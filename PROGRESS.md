# ISO AMT Exercise Planner - Progress Summary

## ✅ What's Complete (Phase 1 & 2)

### Infrastructure ✓
- [x] Next.js 15 with App Router + TypeScript
- [x] Tailwind CSS fully configured
- [x] Prisma ORM with Vercel Postgres schema
- [x] Vitest testing framework
- [x] ESLint + TypeScript strict mode
- [x] All production dependencies installed

### Tax Calculation Engine ✓ (THE CORE)
- [x] **2024 Tax Parameters** - IRS-accurate data
  - Federal tax brackets (7 tiers)
  - AMT exemption ($85,700 single, $133,300 married)
  - AMT phaseout thresholds
  - Two-tier AMT rates (26% / 28%)

- [x] **Core Calculator** (`src/lib/tax/calculator.ts`)
  - Regular federal income tax calculation
  - AMT calculation with ISO bargain element
  - AMT exemption with phaseout
  - Incremental AMT calculation

- [x] **Binary Search Optimizer** (`src/lib/tax/optimizer.ts`)
  - Finds max shares within AMT budget
  - Binary search algorithm (efficient)
  - Tolerance of $0.01
  - 95%+ budget utilization

- [x] **Tiles & Sensitivity**
  - Pre-calculated scenarios (25%, 50%, 100%)
  - FMV sensitivity analysis (±10%)
  - Complete optimization in one call

- [x] **Comprehensive Testing** - 30/30 tests passing ✅
  - Edge cases (zero income, strike >= FMV, etc.)
  - IRS tax bracket validation
  - AMT phaseout logic
  - Binary search correctness
  - Monotonicity checks

### Database Schema ✓
```prisma
model PurchaseSession {
  // Stripe payment tracking
  stripeSessionId, stripePaymentIntentId, paymentStatus

  // User inputs (reproducible)
  email, taxYear, filingStatus, ordinaryIncome, etc.

  // Computed results (cached)
  maxShares, projectedAmt, bargainElement, etc.

  // Tiles (25%, 50%, 100%)
  tile25Shares, tile25Cash, tile25Amt, etc.

  // Sensitivity analysis
  sensitivityDownFmv, sensitivityDownShares, etc.

  // Email tracking
  emailSent, emailSentAt

  // Timestamps
  createdAt, updatedAt, paidAt
}
```

### Environment Setup ✓
- [x] `.env.example` with all required variables
- [x] `.env.local` ready for your API keys
- [x] `.gitignore` configured
- [x] Package scripts: dev, build, start, test

## 🧪 How to Test

```bash
# Run all unit tests
npm test

# Run the demo
npx tsx demo.ts

# Start dev server (when UI is ready)
npm run dev
```

## 📊 Current Capabilities

The tax engine can:
1. ✅ Calculate accurate 2024 federal taxes
2. ✅ Compute AMT with ISO bargain element
3. ✅ Apply AMT exemption phaseout correctly
4. ✅ Find optimal shares within any AMT budget
5. ✅ Generate tile scenarios (25%/50%/100%)
6. ✅ Perform FMV sensitivity analysis
7. ✅ Handle edge cases gracefully
8. ✅ Work for both single & married filers

## 🚧 What's Next (Phases 3-8)

### Phase 3: API Endpoints
- [ ] `POST /api/checkout` - Create Stripe session + pre-compute results
- [ ] `POST /api/webhooks/stripe` - Handle payment completion
- [ ] `GET /api/pdf/[sessionId]` - Generate & download PDF

### Phase 4: UI Components
- [ ] Install shadcn/ui components
- [ ] Landing page with input form
- [ ] Success page with results display
- [ ] Error boundaries

### Phase 5: PDF Generation
- [ ] PDF template with @react-pdf/renderer
- [ ] "CPA Pack" layout (inputs + outputs + disclaimer)
- [ ] Download functionality

### Phase 6: Email Integration
- [ ] Resend API setup
- [ ] Email template with results
- [ ] PDF attachment
- [ ] Idempotent sending

### Phase 7: Stripe Integration
- [ ] Stripe account setup
- [ ] Create $29 product
- [ ] Checkout flow
- [ ] Webhook verification

### Phase 8: Deployment
- [ ] Vercel deployment
- [ ] Vercel Postgres database
- [ ] Stripe webhook endpoint
- [ ] Environment variables in Vercel

## 🔧 Configuration Needed

Before continuing, you'll need:

1. **Stripe Account**
   - Sign up at stripe.com
   - Create $29 product
   - Get API keys (test mode)
   - Set up webhook (after deployment)

2. **Vercel Postgres** (for production)
   - Create database in Vercel dashboard
   - Get `DATABASE_URL` and `DIRECT_URL`
   - Run `npx prisma migrate dev`

3. **Resend API** (for email)
   - Sign up at resend.com
   - Get API key
   - Verify sender domain (optional for testing)

## 💡 Key Decisions Made

1. **Vercel Postgres** instead of SQLite (your preference)
2. **2024 tax year** only for MVP
3. **Federal AMT only** (no state taxes)
4. **Placeholder email** domain for now
5. **Pre-compute results** before payment (faster UX)
6. **On-demand PDF** generation (no caching)
7. **Stateless auth** via Stripe session ID (no user accounts)

## 📈 Test Results

```bash
Test Files  2 passed (2)
Tests      30 passed (30)
Duration   145ms
```

All tax calculations validated against IRS published data!

## 🎯 Demo Output

See `demo.ts` for a working example. Sample output:

```
🎯 OPTIMAL RECOMMENDATION:
   Exercise:             3,645 shares
   Cash Needed:          $1,822.50
   Bargain Element:      $89,302.50
   Projected AMT:        $14,998
   Budget Utilization:   100.0%
```

## 📝 Next Session

When you're ready to continue:
1. Review this progress summary
2. Decide: continue with full build OR test/modify tax engine
3. Set up Stripe account (if ready to proceed)
4. Let me know and we'll build the rest!

---

**Built with:** Next.js 15, TypeScript, Prisma, Vitest, Tailwind CSS
**Tax Engine:** Production-ready, fully tested, IRS-compliant
