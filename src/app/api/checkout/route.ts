import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { performCompleteOptimization, calculateTiles, performSensitivityAnalysis } from '@/lib/tax/optimizer';
import { TAX_PARAMS_2025 } from '@/lib/tax/parameters/2025';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      filingStatus,
      ordinaryIncome,
      itemizedDeductions,
      isoStrike,
      isoFmv,
      totalSharesAvailable,
      targetAmtBudget,
    } = body;

    // Validate required fields
    if (!email || !filingStatus || ordinaryIncome === undefined || isoStrike === undefined || 
        isoFmv === undefined || totalSharesAvailable === undefined || targetAmtBudget === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Map filing status to supported types (single or married)
    const mappedFilingStatus = ['married'].includes(filingStatus) ? 'married' : 'single';

    // Run complete tax optimization
    const optimizationResult = performCompleteOptimization({
      ordinaryIncome,
      itemizedDeductions: itemizedDeductions || 0,
      filingStatus: mappedFilingStatus,
      isoStrike,
      isoFmv,
      totalSharesAvailable,
      targetAmtBudget,
    }, TAX_PARAMS_2025);

    // Calculate tiles (25%, 50%, 100%)
    const tiles = calculateTiles({
      ordinaryIncome,
      itemizedDeductions: itemizedDeductions || 0,
      filingStatus: mappedFilingStatus,
      isoStrike,
      isoFmv,
      totalSharesAvailable,
      targetAmtBudget,
    }, TAX_PARAMS_2025);

    // Perform sensitivity analysis
    const sensitivity = performSensitivityAnalysis({
      ordinaryIncome,
      itemizedDeductions: itemizedDeductions || 0,
      filingStatus: mappedFilingStatus,
      isoStrike,
      isoFmv,
      totalSharesAvailable,
      targetAmtBudget,
    }, TAX_PARAMS_2025);

    // Create purchase session in database
    const purchaseSession = await prisma.purchaseSession.create({
      data: {
        email,
        taxYear: 2025,
        filingStatus,
        ordinaryIncome,
        itemizedDeductions: itemizedDeductions || 0,
        isoStrike,
        isoFmv,
        totalSharesAvailable,
        targetAmtBudget,
        
        // Optimization results
        maxShares: optimizationResult.maxShares,
        projectedAmt: optimizationResult.projectedAmt,
        projectedTotalTax: optimizationResult.projectedTotalTax,
        bargainElement: optimizationResult.bargainElement,
        
        // Tiles
        tile25Shares: tiles.tile25.shares,
        tile25Cash: tiles.tile25.cashNeeded,
        tile25Bargain: tiles.tile25.bargainElement,
        tile25Amt: tiles.tile25.projectedAmt,
        
        tile50Shares: tiles.tile50.shares,
        tile50Cash: tiles.tile50.cashNeeded,
        tile50Bargain: tiles.tile50.bargainElement,
        tile50Amt: tiles.tile50.projectedAmt,
        
        tile100Shares: tiles.tile100.shares,
        tile100Cash: tiles.tile100.cashNeeded,
        tile100Bargain: tiles.tile100.bargainElement,
        tile100Amt: tiles.tile100.projectedAmt,
        
        // Sensitivity
        sensitivityDownFmv: sensitivity.down.fmv,
        sensitivityDownShares: sensitivity.down.maxShares,
        sensitivityUpFmv: sensitivity.up.fmv,
        sensitivityUpShares: sensitivity.up.maxShares,
      },
    });

    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id=${purchaseSession.id}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      client_reference_id: purchaseSession.id,
      customer_email: email,
      metadata: {
        purchaseSessionId: purchaseSession.id,
      },
    });

    // Update purchase session with Stripe session ID
    await prisma.purchaseSession.update({
      where: { id: purchaseSession.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
