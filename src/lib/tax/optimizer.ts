// Binary Search Optimizer for ISO Exercise Planning

import type {
  OptimizationInput,
  OptimizationResult,
  TaxParameters,
  TaxInput,
  TileResult,
  SensitivityResult,
} from './types';
import { calculateTax, calculateIncrementalAmt } from './calculator';

/**
 * Find maximum shares to exercise within AMT budget using binary search
 */
export function findMaxSharesWithinAmtBudget(
  input: OptimizationInput,
  params: TaxParameters
): OptimizationResult {
  // Validation
  if (input.isoStrike >= input.isoFmv) {
    throw new Error('Strike price must be less than FMV for ISO exercise');
  }

  if (input.targetAmtBudget < 0) {
    throw new Error('AMT budget cannot be negative');
  }

  if (input.totalSharesAvailable < 0) {
    throw new Error('Total shares available cannot be negative');
  }

  if (!Number.isInteger(input.totalSharesAvailable)) {
    throw new Error('Total shares must be a whole number');
  }

  // Edge case: no shares available
  if (input.totalSharesAvailable === 0) {
    return createZeroShareResult(input, params);
  }

  // Create baseline (no exercise) scenario
  const baselineInput: TaxInput = {
    ordinaryIncome: input.ordinaryIncome,
    itemizedDeductions: input.itemizedDeductions,
    filingStatus: input.filingStatus,
    isoStrike: input.isoStrike,
    isoFmv: input.isoFmv,
    sharesExercised: 0,
  };

  const baselineTax = calculateTax(baselineInput, params);

  // Check if even 0 shares exceeds budget (baseline AMT from other sources)
  if (baselineTax.amtOwed >= input.targetAmtBudget) {
    return {
      maxShares: 0,
      projectedAmt: baselineTax.amtOwed,
      projectedTotalTax: baselineTax.totalTaxOwed,
      bargainElement: 0,
      utilizationRate: 0,
      cashNeeded: 0,
      taxDetails: baselineTax,
    };
  }

  // Binary search for max shares
  let left = 0;
  let right = input.totalSharesAvailable;
  let bestShares = 0;
  let bestTaxResult = baselineTax;

  const TOLERANCE = 0.01; // $0.01 tolerance

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    const exerciseInput: TaxInput = {
      ...baselineInput,
      sharesExercised: mid,
    };

    const taxResult = calculateTax(exerciseInput, params);
    const incrementalAmt = taxResult.amtOwed - baselineTax.amtOwed;

    if (incrementalAmt <= input.targetAmtBudget + TOLERANCE) {
      // Within budget, try more shares
      bestShares = mid;
      bestTaxResult = taxResult;
      left = mid + 1;
    } else {
      // Over budget, try fewer shares
      right = mid - 1;
    }
  }

  const cashNeeded = bestShares * input.isoStrike;
  const utilizationRate =
    input.targetAmtBudget > 0
      ? ((bestTaxResult.amtOwed - baselineTax.amtOwed) / input.targetAmtBudget) * 100
      : 0;

  return {
    maxShares: bestShares,
    projectedAmt: bestTaxResult.amtOwed,
    projectedTotalTax: bestTaxResult.totalTaxOwed,
    bargainElement: bestTaxResult.bargainElement,
    utilizationRate,
    cashNeeded,
    taxDetails: bestTaxResult,
  };
}

/**
 * Calculate exercise scenarios for different percentages (tiles)
 */
export function calculateTiles(
  input: OptimizationInput,
  params: TaxParameters,
  percentages: number[] = [0.25, 0.5, 1.0]
): TileResult[] {
  const tiles: TileResult[] = [];

  for (const pct of percentages) {
    const shares = Math.floor(input.totalSharesAvailable * pct);

    const exerciseInput: TaxInput = {
      ordinaryIncome: input.ordinaryIncome,
      itemizedDeductions: input.itemizedDeductions,
      filingStatus: input.filingStatus,
      isoStrike: input.isoStrike,
      isoFmv: input.isoFmv,
      sharesExercised: shares,
    };

    const taxResult = calculateTax(exerciseInput, params);

    tiles.push({
      shares,
      cashNeeded: shares * input.isoStrike,
      bargainElement: taxResult.bargainElement,
      projectedAmt: taxResult.amtOwed,
      projectedTotalTax: taxResult.totalTaxOwed,
    });
  }

  return tiles;
}

/**
 * Perform FMV sensitivity analysis
 */
export function performSensitivityAnalysis(
  input: OptimizationInput,
  params: TaxParameters,
  fmvAdjustments: number[] = [-0.1, 0.1] // -10%, +10%
): SensitivityResult[] {
  const results: SensitivityResult[] = [];

  for (const adjustment of fmvAdjustments) {
    const adjustedFmv = input.isoFmv * (1 + adjustment);

    // Skip if adjusted FMV <= strike
    if (adjustedFmv <= input.isoStrike) {
      continue;
    }

    const adjustedInput: OptimizationInput = {
      ...input,
      isoFmv: adjustedFmv,
    };

    const result = findMaxSharesWithinAmtBudget(adjustedInput, params);

    results.push({
      fmv: adjustedFmv,
      maxShares: result.maxShares,
      projectedAmt: result.projectedAmt,
    });
  }

  return results;
}

/**
 * Helper: Create zero-share result
 */
function createZeroShareResult(
  input: OptimizationInput,
  params: TaxParameters
): OptimizationResult {
  const zeroInput: TaxInput = {
    ordinaryIncome: input.ordinaryIncome,
    itemizedDeductions: input.itemizedDeductions,
    filingStatus: input.filingStatus,
    isoStrike: input.isoStrike,
    isoFmv: input.isoFmv,
    sharesExercised: 0,
  };

  const taxResult = calculateTax(zeroInput, params);

  return {
    maxShares: 0,
    projectedAmt: taxResult.amtOwed,
    projectedTotalTax: taxResult.totalTaxOwed,
    bargainElement: 0,
    utilizationRate: 0,
    cashNeeded: 0,
    taxDetails: taxResult,
  };
}

/**
 * Complete optimization with tiles and sensitivity
 */
export interface CompleteOptimizationResult extends OptimizationResult {
  tiles: {
    tile25: TileResult;
    tile50: TileResult;
    tile100: TileResult;
  };
  sensitivity: {
    down: SensitivityResult | null;
    up: SensitivityResult | null;
  };
}

export function performCompleteOptimization(
  input: OptimizationInput,
  params: TaxParameters
): CompleteOptimizationResult {
  // Find optimal shares
  const optimal = findMaxSharesWithinAmtBudget(input, params);

  // Calculate tiles
  const tilesArray = calculateTiles(input, params, [0.25, 0.5, 1.0]);

  // Perform sensitivity analysis
  const sensitivityArray = performSensitivityAnalysis(input, params, [-0.1, 0.1]);

  return {
    ...optimal,
    tiles: {
      tile25: tilesArray[0],
      tile50: tilesArray[1],
      tile100: tilesArray[2],
    },
    sensitivity: {
      down: sensitivityArray[0] || null,
      up: sensitivityArray[1] || null,
    },
  };
}
