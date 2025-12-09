import { describe, it, expect } from 'vitest';
import {
  findMaxSharesWithinAmtBudget,
  calculateTiles,
  performSensitivityAnalysis,
  performCompleteOptimization,
} from '../optimizer';
import { TAX_PARAMS_2024 } from '../parameters/2024';
import type { OptimizationInput } from '../types';

describe('Share Optimizer', () => {
  describe('findMaxSharesWithinAmtBudget', () => {
    it('should find max shares within AMT budget', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      const result = findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);

      expect(result.maxShares).toBeGreaterThan(0);
      expect(result.maxShares).toBeLessThanOrEqual(10000);
      expect(result.projectedAmt).toBeLessThanOrEqual(5000 + 0.01); // Allow tolerance
      expect(result.bargainElement).toBeGreaterThan(0);
      expect(result.cashNeeded).toBe(result.maxShares * 1.0);
    });

    it('should return 0 shares when strike >= FMV', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 10.0,
        isoFmv: 10.0, // Same as strike
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      expect(() => {
        findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);
      }).toThrow('Strike price must be less than FMV');
    });

    it('should return 0 shares when baseline AMT exceeds budget', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 0, // Zero budget
      };

      const result = findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);

      expect(result.maxShares).toBe(0);
      expect(result.cashNeeded).toBe(0);
    });

    it('should achieve >95% budget utilization when possible', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 20000,
        targetAmtBudget: 10000,
      };

      const result = findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);

      // Should use most of the budget
      expect(result.utilizationRate).toBeGreaterThan(95);
      expect(result.projectedAmt).toBeLessThanOrEqual(10000 + 0.01);
    });

    it('should handle large share amounts correctly', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 200000,
        itemizedDeductions: 0,
        filingStatus: 'married',
        isoStrike: 0.5,
        isoFmv: 50.0,
        totalSharesAvailable: 100000,
        targetAmtBudget: 20000,
      };

      const result = findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);

      expect(result.maxShares).toBeGreaterThan(0);
      expect(result.maxShares).toBeLessThanOrEqual(100000);
      expect(result.projectedAmt).toBeLessThanOrEqual(20000 + 0.01);
    });

    it('should return all shares if they fit within budget', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 2.0, // Small bargain element
        totalSharesAvailable: 1000,
        targetAmtBudget: 100000, // Very large budget
      };

      const result = findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);

      expect(result.maxShares).toBe(1000);
    });

    it('should handle zero shares available', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 0,
        targetAmtBudget: 5000,
      };

      const result = findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);

      expect(result.maxShares).toBe(0);
      expect(result.cashNeeded).toBe(0);
      expect(result.bargainElement).toBe(0);
    });

    it('should reject negative AMT budget', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: -1000,
      };

      expect(() => {
        findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);
      }).toThrow('AMT budget cannot be negative');
    });

    it('should reject non-integer shares', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000.5, // Not an integer
        targetAmtBudget: 5000,
      };

      expect(() => {
        findMaxSharesWithinAmtBudget(input, TAX_PARAMS_2024);
      }).toThrow('Total shares must be a whole number');
    });
  });

  describe('calculateTiles', () => {
    it('should calculate tiles for 25%, 50%, 100%', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      const tiles = calculateTiles(input, TAX_PARAMS_2024);

      expect(tiles).toHaveLength(3);

      // 25% tile
      expect(tiles[0].shares).toBe(2500);
      expect(tiles[0].cashNeeded).toBe(2500 * 1.0);
      expect(tiles[0].bargainElement).toBeGreaterThan(0);

      // 50% tile
      expect(tiles[1].shares).toBe(5000);
      expect(tiles[1].cashNeeded).toBe(5000 * 1.0);

      // 100% tile
      expect(tiles[2].shares).toBe(10000);
      expect(tiles[2].cashNeeded).toBe(10000 * 1.0);

      // AMT should increase with more shares
      expect(tiles[1].projectedAmt).toBeGreaterThan(tiles[0].projectedAmt);
      expect(tiles[2].projectedAmt).toBeGreaterThan(tiles[1].projectedAmt);
    });

    it('should handle custom percentages', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      const tiles = calculateTiles(input, TAX_PARAMS_2024, [0.1, 0.5, 0.9]);

      expect(tiles).toHaveLength(3);
      expect(tiles[0].shares).toBe(1000);
      expect(tiles[1].shares).toBe(5000);
      expect(tiles[2].shares).toBe(9000);
    });
  });

  describe('performSensitivityAnalysis', () => {
    it('should perform FMV sensitivity analysis', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      const sensitivity = performSensitivityAnalysis(input, TAX_PARAMS_2024);

      expect(sensitivity).toHaveLength(2);

      // Down scenario (FMV - 10%)
      expect(sensitivity[0].fmv).toBeCloseTo(9.0, 1);
      expect(sensitivity[0].maxShares).toBeGreaterThan(0);

      // Up scenario (FMV + 10%)
      expect(sensitivity[1].fmv).toBeCloseTo(11.0, 1);
      expect(sensitivity[1].maxShares).toBeGreaterThan(0);

      // Higher FMV should allow fewer shares
      expect(sensitivity[1].maxShares).toBeLessThan(sensitivity[0].maxShares);
    });

    it('should handle custom FMV adjustments', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      const sensitivity = performSensitivityAnalysis(input, TAX_PARAMS_2024, [-0.2, 0, 0.2]);

      expect(sensitivity).toHaveLength(3);
      expect(sensitivity[0].fmv).toBeCloseTo(8.0, 1);
      expect(sensitivity[1].fmv).toBeCloseTo(10.0, 1);
      expect(sensitivity[2].fmv).toBeCloseTo(12.0, 1);
    });

    it('should skip scenarios where adjusted FMV <= strike', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 10.0,
        isoFmv: 11.0, // Only $1 spread
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      // -10% would make FMV = 9.9, which is less than strike
      const sensitivity = performSensitivityAnalysis(input, TAX_PARAMS_2024, [-0.1, 0.1]);

      // Should only have one result (the +10% scenario)
      expect(sensitivity.length).toBeLessThanOrEqual(1);
    });
  });

  describe('performCompleteOptimization', () => {
    it('should return complete optimization with tiles and sensitivity', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 5000,
      };

      const result = performCompleteOptimization(input, TAX_PARAMS_2024);

      // Check optimal result
      expect(result.maxShares).toBeGreaterThan(0);
      expect(result.projectedAmt).toBeLessThanOrEqual(5000 + 0.01);

      // Check tiles
      expect(result.tiles.tile25).toBeDefined();
      expect(result.tiles.tile50).toBeDefined();
      expect(result.tiles.tile100).toBeDefined();
      expect(result.tiles.tile25.shares).toBe(2500);
      expect(result.tiles.tile50.shares).toBe(5000);
      expect(result.tiles.tile100.shares).toBe(10000);

      // Check sensitivity
      expect(result.sensitivity.down).toBeDefined();
      expect(result.sensitivity.up).toBeDefined();
      expect(result.sensitivity.down?.fmv).toBeCloseTo(9.0, 1);
      expect(result.sensitivity.up?.fmv).toBeCloseTo(11.0, 1);
    });
  });

  describe('Monotonicity', () => {
    it('should have monotonically increasing AMT with more shares', () => {
      const input: OptimizationInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        totalSharesAvailable: 10000,
        targetAmtBudget: 100000, // Large budget
      };

      const tiles = calculateTiles(input, TAX_PARAMS_2024, [0.1, 0.2, 0.3, 0.4, 0.5]);

      for (let i = 1; i < tiles.length; i++) {
        // More shares should mean more AMT
        expect(tiles[i].projectedAmt).toBeGreaterThanOrEqual(tiles[i - 1].projectedAmt);
      }
    });
  });
});
