// Core Tax Calculation Engine

import type {
  TaxInput,
  TaxResult,
  TaxParameters,
  TaxBracket,
  AMTRateStructure,
  FilingStatusParams,
} from './types';

/**
 * Calculate regular federal income tax
 */
function calculateRegularTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;

  for (const bracket of brackets) {
    const taxableInBracket = Math.min(Math.max(income - bracket.min, 0), bracket.max - bracket.min);

    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }

    if (income <= bracket.max) {
      break;
    }
  }

  return tax;
}

/**
 * Calculate AMT tax using two-tier rate structure
 */
function calculateAmtTax(income: number, rates: AMTRateStructure): number {
  if (income <= 0) {
    return 0;
  }

  if (income <= rates.threshold) {
    return income * rates.lowerRate;
  }

  return rates.threshold * rates.lowerRate + (income - rates.threshold) * rates.upperRate;
}

/**
 * Calculate AMT exemption with phaseout
 */
function calculateAmtExemption(
  amtIncome: number,
  baseExemption: number,
  phaseoutStart: number,
  phaseoutRate: number
): number {
  if (amtIncome <= phaseoutStart) {
    return baseExemption;
  }

  const phaseoutAmount = (amtIncome - phaseoutStart) * phaseoutRate;
  return Math.max(0, baseExemption - phaseoutAmount);
}

/**
 * Main tax calculation function
 * Calculates both regular tax and AMT for a given tax scenario
 */
export function calculateTax(input: TaxInput, params: TaxParameters): TaxResult {
  const statusParams: FilingStatusParams = params.filingStatus[input.filingStatus];

  // 1. Calculate Regular Tax
  const standardDeduction = statusParams.standardDeduction;
  const deduction = Math.max(input.itemizedDeductions, standardDeduction);
  const regularTaxableIncome = Math.max(0, input.ordinaryIncome - deduction);
  const regularTax = calculateRegularTax(regularTaxableIncome, statusParams.regularBrackets);

  // 2. Calculate ISO Bargain Element
  const bargainElement = input.sharesExercised * Math.max(0, input.isoFmv - input.isoStrike);

  // 3. Calculate AMT Income (AMTI)
  // For AMT, we add back the standard deduction and add the ISO bargain element
  const amtIncome =
    input.ordinaryIncome +
    bargainElement +
    (input.otherAmtAdjustments || 0);

  // 4. Calculate AMT Exemption with Phaseout
  const amtExemptionAmount = calculateAmtExemption(
    amtIncome,
    statusParams.amtExemption,
    statusParams.amtPhaseoutStart,
    statusParams.amtPhaseoutRate
  );

  // 5. Calculate AMT Taxable Income
  const amtTaxableIncome = Math.max(0, amtIncome - amtExemptionAmount);

  // 6. Calculate Tentative Minimum Tax (TMT)
  const tentativeMinimumTax = calculateAmtTax(amtTaxableIncome, statusParams.amtRate);

  // 7. AMT Owed = max(TMT - Regular Tax, 0)
  const amtOwed = Math.max(0, tentativeMinimumTax - regularTax);

  // 8. Total Tax
  const totalTaxOwed = regularTax + amtOwed;

  // 9. Effective Tax Rate
  const totalIncome = input.ordinaryIncome + bargainElement;
  const effectiveTaxRate = totalIncome > 0 ? totalTaxOwed / totalIncome : 0;

  return {
    regularTaxableIncome,
    regularTax,
    amtIncome,
    amtExemptionAmount,
    amtTaxableIncome,
    tentativeMinimumTax,
    amtOwed,
    totalTaxOwed,
    bargainElement,
    effectiveTaxRate,
  };
}

/**
 * Calculate incremental AMT from exercising shares
 * This is the additional AMT owed compared to baseline (no exercise)
 */
export function calculateIncrementalAmt(
  baselineInput: TaxInput,
  exerciseInput: TaxInput,
  params: TaxParameters
): number {
  const baselineTax = calculateTax(baselineInput, params);
  const exerciseTax = calculateTax(exerciseInput, params);

  return Math.max(0, exerciseTax.amtOwed - baselineTax.amtOwed);
}
