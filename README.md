# ISO AMT Exercise Planner

Calculate the optimal number of ISO shares to exercise while staying within your AMT budget.

## 🚀 Quick Start

```bash
# Install dependencies (already done)
npm install

# Run tests
npm test

# Run demo
npx tsx demo.ts

# Start development server (when UI is ready)
npm run dev
```

## 🧮 Using the Tax Engine

```typescript
import { performCompleteOptimization } from '@/lib/tax/optimizer';
import { TAX_PARAMS_2024 } from '@/lib/tax/parameters/2024';

const result = performCompleteOptimization({
  ordinaryIncome: 180000,
  itemizedDeductions: 0,
  filingStatus: 'single',
  isoStrike: 0.50,
  isoFmv: 25.00,
  totalSharesAvailable: 20000,
  targetAmtBudget: 15000,
}, TAX_PARAMS_2024);

console.log(`Exercise ${result.maxShares} shares`);
console.log(`Cash needed: $${result.cashNeeded}`);
console.log(`Projected AMT: $${result.projectedAmt}`);
```

## 📊 What It Calculates

1. **Optimal Exercise**: Max shares within your AMT budget
2. **Tax Impact**: Regular tax + AMT breakdown
3. **Cash Requirements**: Strike price × shares
4. **Bargain Element**: (FMV - Strike) × shares
5. **Tile Scenarios**: 25%, 50%, 100% exercise options
6. **Sensitivity Analysis**: FMV ±10% impact

## 🧪 Test Coverage

- ✅ 30 comprehensive unit tests
- ✅ Regular tax calculation (IRS-validated)
- ✅ AMT calculation with phaseout
- ✅ Binary search optimizer
- ✅ Edge cases (zero income, strike >= FMV, etc.)
- ✅ Both single and married filing status

## 🗄️ Database Setup

This project uses Vercel Postgres. To set up:

```bash
# 1. Create Vercel Postgres database
# 2. Add DATABASE_URL and DIRECT_URL to .env.local
# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations (when ready)
npx prisma migrate dev --name init
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Vercel Postgres
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# Stripe (get from stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# Resend (get from resend.com)
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Landing page (placeholder)
│   └── layout.tsx    # Root layout
├── lib/
│   ├── tax/          # Tax calculation engine ⭐
│   │   ├── calculator.ts
│   │   ├── optimizer.ts
│   │   ├── types.ts
│   │   └── parameters/2024.ts
│   └── prisma.ts     # Database client
└── components/       # React components (coming soon)

prisma/
└── schema.prisma     # Database schema
```

## 🎯 Core Features

### Tax Calculation Engine
- Accurate 2024 federal tax brackets
- AMT calculation with ISO bargain element
- AMT exemption with phaseout
- Binary search optimization
- Sub-dollar precision ($0.01 tolerance)

### Scenarios & Analysis
- Quick tiles: 25%, 50%, 100% exercise
- FMV sensitivity: ±10% scenarios
- Utilization rate: % of AMT budget used

## 📚 Technical Details

### Tax Logic
- **Regular Tax**: Progressive brackets (10%-37%)
- **AMT**: Two-tier rates (26%/28%)
- **AMT Income**: Ordinary + ISO Bargain Element
- **AMT Exemption**: $85,700 (single), $133,300 (married)
- **Phaseout**: 25% reduction above threshold

### Optimization Algorithm
- Binary search over share count
- Maximizes shares while staying within AMT budget
- Achieves >95% budget utilization
- Handles edge cases gracefully

## 🔜 Coming Soon

- [ ] Web UI with form input
- [ ] Stripe payment integration ($29)
- [ ] PDF "CPA Pack" download
- [ ] Email delivery with Resend
- [ ] Results dashboard
- [ ] Vercel deployment

## 📖 Documentation

- `PROGRESS.md` - Detailed progress summary
- `demo.ts` - Working example
- Tests in `src/lib/tax/__tests__/`

## 🤝 Contributing

This is a private MVP project. No external contributions at this time.

## ⚖️ Legal Disclaimer

**This tool is for informational purposes only and does not constitute tax, legal, or financial advice.**

Users should consult with a qualified tax professional before making ISO exercise decisions. Tax laws are complex and individual circumstances vary.

## 📄 License

Private / Proprietary

---

**Built with:** Next.js 15 • TypeScript • Prisma • Tailwind CSS • Vitest
