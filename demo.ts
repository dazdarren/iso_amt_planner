// Demo: How the ISO AMT Tax Engine Works

import { performCompleteOptimization } from './src/lib/tax/optimizer';
import { TAX_PARAMS_2024 } from './src/lib/tax/parameters/2024';

// Example scenario: Software engineer with ISO stock options
const scenario = {
  ordinaryIncome: 180000,        // W-2 salary
  itemizedDeductions: 0,         // Using standard deduction
  filingStatus: 'single' as const,
  isoStrike: 0.50,               // Exercise price per share
  isoFmv: 25.00,                 // Current fair market value
  totalSharesAvailable: 20000,   // Total ISOs you can exercise
  targetAmtBudget: 15000,        // Max AMT you're willing to pay
};

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('         ISO AMT EXERCISE PLANNER - DEMO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📊 YOUR SCENARIO:');
console.log(`   W-2 Income:           $${scenario.ordinaryIncome.toLocaleString()}`);
console.log(`   Filing Status:        ${scenario.filingStatus}`);
console.log(`   ISO Strike Price:     $${scenario.isoStrike}`);
console.log(`   Current FMV:          $${scenario.isoFmv}`);
console.log(`   Available Shares:     ${scenario.totalSharesAvailable.toLocaleString()}`);
console.log(`   AMT Budget:           $${scenario.targetAmtBudget.toLocaleString()}\n`);

// Run the optimization
const result = performCompleteOptimization(scenario, TAX_PARAMS_2024);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🎯 OPTIMAL RECOMMENDATION:');
console.log(`   Exercise:             ${result.maxShares.toLocaleString()} shares`);
console.log(`   Cash Needed:          $${result.cashNeeded.toLocaleString()}`);
console.log(`   Bargain Element:      $${result.bargainElement.toLocaleString()}`);
console.log(`   Projected AMT:        $${Math.round(result.projectedAmt).toLocaleString()}`);
console.log(`   Budget Utilization:   ${result.utilizationRate.toFixed(1)}%\n`);

console.log('📊 QUICK SCENARIOS:');
console.log(`   25% (${result.tiles.tile25.shares.toLocaleString()} shares):`);
console.log(`      Cash: $${result.tiles.tile25.cashNeeded.toLocaleString()}, AMT: $${Math.round(result.tiles.tile25.projectedAmt).toLocaleString()}`);
console.log(`   50% (${result.tiles.tile50.shares.toLocaleString()} shares):`);
console.log(`      Cash: $${result.tiles.tile50.cashNeeded.toLocaleString()}, AMT: $${Math.round(result.tiles.tile50.projectedAmt).toLocaleString()}`);
console.log(`   100% (${result.tiles.tile100.shares.toLocaleString()} shares):`);
console.log(`      Cash: $${result.tiles.tile100.cashNeeded.toLocaleString()}, AMT: $${Math.round(result.tiles.tile100.projectedAmt).toLocaleString()}\n`);

console.log('📈 SENSITIVITY ANALYSIS (FMV changes):');
if (result.sensitivity.down) {
  console.log(`   If FMV drops to $${result.sensitivity.down.fmv.toFixed(2)}:`);
  console.log(`      Can exercise ${result.sensitivity.down.maxShares.toLocaleString()} shares`);
}
if (result.sensitivity.up) {
  console.log(`   If FMV rises to $${result.sensitivity.up.fmv.toFixed(2)}:`);
  console.log(`      Can exercise ${result.sensitivity.up.maxShares.toLocaleString()} shares`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💡 TAX DETAILS:');
console.log(`   Regular Tax:          $${Math.round(result.taxDetails.regularTax).toLocaleString()}`);
console.log(`   AMT Owed:             $${Math.round(result.taxDetails.amtOwed).toLocaleString()}`);
console.log(`   Total Tax:            $${Math.round(result.taxDetails.totalTaxOwed).toLocaleString()}`);
console.log(`   Effective Rate:       ${(result.taxDetails.effectiveTaxRate * 100).toFixed(2)}%`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
