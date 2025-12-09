import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendResultsEmail } from '@/lib/email/send-results-email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Processing checkout.session.completed:', session.id);

        // Get the purchase session ID from metadata
        const purchaseSessionId = session.metadata?.purchaseSessionId;

        if (!purchaseSessionId) {
          console.error('Missing purchaseSessionId in session metadata');
          return NextResponse.json(
            { error: 'Missing purchaseSessionId in metadata' },
            { status: 400 }
          );
        }

        // Update the purchase session to mark as paid
        try {
          const updatedSession = await prisma.purchaseSession.update({
            where: { id: purchaseSessionId },
            data: {
              paymentStatus: 'completed',
              paidAt: new Date(),
              stripePaymentIntentId: session.payment_intent as string,
            },
          });

          console.log('Purchase session updated:', updatedSession.id);

          // Send email with results
          const emailSent = await sendResultsEmail(updatedSession);

          // Update email tracking
          if (emailSent) {
            await prisma.purchaseSession.update({
              where: { id: purchaseSessionId },
              data: {
                emailSent: true,
                emailSentAt: new Date(),
              },
            });
            console.log('Results email sent to:', updatedSession.email);
          } else {
            console.warn('Failed to send results email to:', updatedSession.email);
          }

        } catch (dbError) {
          console.error('Failed to update purchase session:', dbError);
          return NextResponse.json(
            { error: 'Failed to update purchase session' },
            { status: 500 }
          );
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session expired:', session.id);
        // Optionally handle expired sessions
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
