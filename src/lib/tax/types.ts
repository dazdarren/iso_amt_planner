// Type definitions for tax calculations

export type FilingStatus = 'single' | 'married';

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface AMTRateStructure {
  threshold: number;
  lowerRate: number;
  upperRate: number;
}

export interface FilingStatusParams {
  standardDeduction: number;
  amtExemption: number;
  amtPhaseoutStart: number;
  amtPhaseoutRate: number;
  regularBrackets: TaxBracket[];
  amtRate: AMTRateStructure;
}

export interface TaxParameters {
  year: number;
  filingStatus: {
    single: FilingStatusParams;
    married: FilingStatusParams;
  };
}

export interface TaxInput {
  // Income & Deductions
  ordinaryIncome: number;
  itemizedDeductions: number;
  filingStatus: FilingStatus;

  // ISO Exercise Data
  isoStrike: number;
  isoFmv: number;
  sharesExercised: number;

  // Other AMT adjustments (optional)
  otherAmtAdjustments?: number;
}

export interface TaxResult {
  // Regular Tax
  regularTaxableIncome: number;
  regularTax: number;

  // AMT
  amtIncome: number;
  amtExemptionAmount: number;
  amtTaxableIncome: number;
  tentativeMinimumTax: number;
  amtOwed: number;

  // Final
  totalTaxOwed: number;
  bargainElement: number;
  effectiveTaxRate: number;
}

export interface OptimizationInput {
  ordinaryIncome: number;
  itemizedDeductions: number;
  filingStatus: FilingStatus;
  isoStrike: number;
  isoFmv: number;
  totalSharesAvailable: number;
  targetAmtBudget: number;
}

export interface OptimizationResult {
  maxShares: number;
  projectedAmt: number;
  projectedTotalTax: number;
  bargainElement: number;
  utilizationRate: number; // % of AMT budget used
  cashNeeded: number;
  taxDetails: TaxResult;
}

export interface TileResult {
  shares: number;
  cashNeeded: number;
  bargainElement: number;
  projectedAmt: number;
  projectedTotalTax: number;
}

export interface SensitivityResult {
  fmv: number;
  maxShares: number;
  projectedAmt: number;
}
