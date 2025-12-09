# Testing Guide - ISO AMT Exercise Planner

## 🧪 Local Testing Before Deployment

### Current Status: ✅ Ready to Test Locally

The development server is running at: **http://localhost:3000**

---

## 1️⃣ Test the Tax Engine (Unit Tests)

### Run All Tests
```bash
npm test
```

**Expected Output:**
```
✓ Test Files  2 passed (2)
✓ Tests      30 passed (30)
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Test Coverage (Optional)
```bash
npm test -- --coverage
```

---

## 2️⃣ Test the Next.js App

### Start Development Server
```bash
npm run dev
```

**Server will be available at:**
- Local: http://localhost:3000
- Network: http://10.40.103.159:3000

### What to Test:

#### ✅ Homepage (Currently Placeholder)
1. Open http://localhost:3000
2. Should see: "ISO AMT Exercise Planner" heading
3. Should see: "Coming soon: Input form" message
4. Check browser console for errors (should be none)

#### ✅ Hot Reload
1. Edit `src/app/page.tsx`
2. Change any text
3. Save file
4. Page should auto-reload without refresh

#### ✅ TypeScript Compilation
```bash
npm run build
```

Should complete without errors.

---

## 3️⃣ Test the Tax Engine Directly

### Run the Demo Script
```bash
npx tsx demo.ts
```

**Expected Output:**
```
🎯 OPTIMAL RECOMMENDATION:
   Exercise:             3,645 shares
   Cash Needed:          $1,822.50
   Bargain Element:      $89,302.50
   Projected AMT:        $14,998
   Budget Utilization:   100.0%

📊 QUICK SCENARIOS:
   25% (5,000 shares): Cash: $2,500, AMT: $23,630
   50% (10,000 shares): Cash: $5,000, AMT: $57,852
   100% (20,000 shares): Cash: $10,000, AMT: $130,697
```

### Test Different Scenarios

Create a test file `test-scenarios.ts`:

```typescript
import { performCompleteOptimization } from './src/lib/tax/optimizer';
import { TAX_PARAMS_2024 } from './src/lib/tax/parameters/2024';

// Scenario 1: Low income, small ISO grant
console.log('\n🧪 Test 1: Low Income Engineer');
const scenario1 = performCompleteOptimization({
  ordinaryIncome: 80000,
  itemizedDeductions: 0,
  filingStatus: 'single',
  isoStrike: 0.10,
  isoFmv: 5.00,
  totalSharesAvailable: 5000,
  targetAmtBudget: 2000,
}, TAX_PARAMS_2024);
console.log(`Max shares: ${scenario1.maxShares}`);
console.log(`AMT: $${Math.round(scenario1.projectedAmt)}`);

// Scenario 2: High income, large ISO grant
console.log('\n🧪 Test 2: High Income Senior Engineer');
const scenario2 = performCompleteOptimization({
  ordinaryIncome: 300000,
  itemizedDeductions: 0,
  filingStatus: 'married',
  isoStrike: 1.00,
  isoFmv: 50.00,
  totalSharesAvailable: 50000,
  targetAmtBudget: 30000,
}, TAX_PARAMS_2024);
console.log(`Max shares: ${scenario2.maxShares}`);
console.log(`AMT: $${Math.round(scenario2.projectedAmt)}`);

// Scenario 3: Edge case - very low FMV spread
console.log('\n🧪 Test 3: Low FMV Spread');
const scenario3 = performCompleteOptimization({
  ordinaryIncome: 150000,
  itemizedDeductions: 0,
  filingStatus: 'single',
  isoStrike: 9.00,
  isoFmv: 10.00, // Only $1 spread
  totalSharesAvailable: 10000,
  targetAmtBudget: 5000,
}, TAX_PARAMS_2024);
console.log(`Max shares: ${scenario3.maxShares}`);
console.log(`AMT: $${Math.round(scenario3.projectedAmt)}`);
```

Run it:
```bash
npx tsx test-scenarios.ts
```

---

## 4️⃣ Test Build Process

### Production Build
```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

### Test Production Server Locally
```bash
npm run build
npm start
```

Visit: http://localhost:3000

Should see the same app, but in production mode (faster).

---

## 5️⃣ Pre-Deployment Checklist

Before deploying to Vercel, verify:

### ✅ Code Quality
- [ ] `npm test` - All tests pass
- [ ] `npm run build` - Build succeeds
- [ ] `npm run lint` - No linting errors
- [ ] No TypeScript errors

### ✅ Environment Variables
- [ ] `.env.local` has placeholder values
- [ ] `.env.example` is complete
- [ ] No secrets committed to git

### ✅ Git Status
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Clean working directory

### ✅ Documentation
- [ ] README.md is accurate
- [ ] PROGRESS.md is up to date
- [ ] CODE_REVIEW.md exists

---

## 6️⃣ Manual Testing Checklist

### Tax Engine
- [ ] Single filer calculations correct
- [ ] Married filer calculations correct
- [ ] AMT triggered when expected
- [ ] Binary search finds optimal shares
- [ ] Budget utilization >95%
- [ ] Tiles calculate correctly
- [ ] Sensitivity analysis works

### Edge Cases
- [ ] Zero income handled
- [ ] Strike >= FMV handled
- [ ] Zero shares available
- [ ] Negative inputs rejected
- [ ] Very large numbers work

---

## 7️⃣ Testing After Each New Feature

When you add UI, APIs, etc., test:

### API Endpoints (Future)
```bash
# Test checkout endpoint
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"ordinaryIncome": 150000, ...}'

# Check response
# Should return stripe checkout URL
```

### Database (Future)
```bash
# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

### Stripe Integration (Future)
- Use test mode API keys
- Test with test card: 4242 4242 4242 4242
- Verify webhook receives events
- Check database after payment

### PDF Generation (Future)
- Generate PDF locally
- Verify all data appears
- Check formatting
- Test download

### Email (Future)
- Use Resend test mode
- Verify email sends
- Check PDF attachment
- Verify content

---

## 🐛 Debugging Tips

### Check Logs
```bash
# Development server logs
# Already visible in terminal

# Build errors
npm run build 2>&1 | tee build.log

# Test failures
npm test -- --reporter=verbose
```

### Common Issues

**Port 3000 already in use:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

**TypeScript errors:**
```bash
# Check types
npx tsc --noEmit

# See detailed errors
npx tsc --noEmit --pretty
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Tests failing:**
```bash
# Run specific test file
npm test calculator.test.ts

# Debug mode
node --inspect-brk node_modules/.bin/vitest
```

---

## 📊 Performance Testing

### Load Testing (Optional)

After APIs are built:

```bash
# Install autocannon
npm install -g autocannon

# Test API endpoint
autocannon -c 10 -d 5 http://localhost:3000/api/checkout
```

### Lighthouse Audit (After UI)

```bash
# Install lighthouse
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:3000
```

---

## 🚀 Ready for Deployment?

You're ready to deploy when:

1. ✅ All unit tests pass
2. ✅ Build completes successfully
3. ✅ App runs without errors locally
4. ✅ Tax engine calculations are accurate
5. ✅ Git repo is clean and pushed
6. ✅ Environment variables documented

---

## 🔧 Current Testing Status

**What Works:**
- ✅ Tax calculation engine (30/30 tests)
- ✅ Next.js app compiles and runs
- ✅ Development server works
- ✅ Production build succeeds
- ✅ Demo script runs

**What Needs Testing (After Implementation):**
- ⏳ UI components
- ⏳ API endpoints
- ⏳ Stripe integration
- ⏳ Database queries
- ⏳ PDF generation
- ⏳ Email sending

---

## 📝 Testing Log

Keep track of your testing:

```
Date: 2024-12-09
Tester: [Your Name]
Version: MVP v0.1

Tests Run:
- [x] Unit tests (30/30 pass)
- [x] Dev server starts
- [x] Build succeeds
- [x] Demo script works
- [ ] UI loads correctly
- [ ] API endpoints work
- [ ] Payment flow complete

Issues Found:
- None yet

Notes:
- Tax engine is solid
- Ready for UI development
```

---

**Next Steps:**
1. Keep dev server running
2. Build UI components
3. Test each component as you build
4. Run full test suite before each commit
5. Deploy to Vercel when ready!
