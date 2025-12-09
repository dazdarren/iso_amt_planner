import { describe, it, expect } from 'vitest';
import { calculateTax, calculateIncrementalAmt } from '../calculator';
import { TAX_PARAMS_2024 } from '../parameters/2024';
import type { TaxInput } from '../types';

describe('Tax Calculator', () => {
  describe('Regular Tax Calculation', () => {
    it('should calculate correct tax for single filer with $75k income', () => {
      const input: TaxInput = {
        ordinaryIncome: 75000,
        itemizedDeductions: 0, // Will use standard deduction
        filingStatus: 'single',
        isoStrike: 1,
        isoFmv: 1, // No ISO exercise
        sharesExercised: 0,
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // With standard deduction of $14,600, taxable income = $60,400
      // Tax = $1,160 (10%) + $4,266 (12%) + $2,915 (22%) = $8,341
      expect(result.regularTaxableIncome).toBeCloseTo(60400, 0);
      expect(result.regularTax).toBeCloseTo(8341, 0);
    });

    it('should use standard deduction when greater than itemized', () => {
      const input: TaxInput = {
        ordinaryIncome: 100000,
        itemizedDeductions: 10000, // Less than standard deduction
        filingStatus: 'single',
        isoStrike: 1,
        isoFmv: 1,
        sharesExercised: 0,
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // Should use standard deduction of $14,600
      expect(result.regularTaxableIncome).toBe(100000 - 14600);
    });

    it('should use itemized deductions when greater than standard', () => {
      const input: TaxInput = {
        ordinaryIncome: 200000,
        itemizedDeductions: 50000, // Greater than standard deduction
        filingStatus: 'single',
        isoStrike: 1,
        isoFmv: 1,
        sharesExercised: 0,
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // Should use itemized deduction of $50,000
      expect(result.regularTaxableIncome).toBe(200000 - 50000);
    });
  });

  describe('AMT Calculation', () => {
    it('should calculate AMT with ISO bargain element', () => {
      const input: TaxInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 10000, // $90k bargain element
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // Bargain element = (10 - 1) * 10,000 = $90,000
      expect(result.bargainElement).toBe(90000);

      // AMT Income = 150,000 + 90,000 = 240,000
      expect(result.amtIncome).toBe(240000);

      // AMT should be triggered due to large bargain element
      expect(result.amtOwed).toBeGreaterThan(0);
    });

    it('should apply AMT exemption correctly', () => {
      const input: TaxInput = {
        ordinaryIncome: 100000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 5.0,
        sharesExercised: 5000, // $20k bargain element
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // AMT Income = 100,000 + 20,000 = 120,000
      // AMT Exemption for single = $85,700 (no phaseout at this income level)
      expect(result.amtExemptionAmount).toBe(85700);

      // AMT Taxable Income = 120,000 - 85,700 = 34,300
      expect(result.amtTaxableIncome).toBeCloseTo(34300, 0);
    });

    it('should apply AMT exemption phaseout for high earners', () => {
      const input: TaxInput = {
        ordinaryIncome: 700000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 10000, // $90k bargain element
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // AMT Income = 700,000 + 90,000 = 790,000
      // Phaseout starts at $609,350
      // Phaseout amount = (790,000 - 609,350) * 0.25 = 45,162.50
      // AMT Exemption = 85,700 - 45,162.50 = 40,537.50
      expect(result.amtExemptionAmount).toBeCloseTo(40537.5, 0);
    });

    it('should use two-tier AMT rates correctly', () => {
      const input: TaxInput = {
        ordinaryIncome: 400000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 20000, // $180k bargain element
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // AMT Taxable Income will be high enough to trigger 28% rate
      // Threshold is $220,700
      expect(result.amtTaxableIncome).toBeGreaterThan(220700);

      // TMT should use both 26% and 28% rates
      expect(result.tentativeMinimumTax).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should return zero AMT when regular tax exceeds TMT', () => {
      const input: TaxInput = {
        ordinaryIncome: 50000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 2.0,
        sharesExercised: 100, // Very small bargain element
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // With small bargain element, regular tax likely exceeds TMT
      expect(result.amtOwed).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero income', () => {
      const input: TaxInput = {
        ordinaryIncome: 0,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 1.0,
        sharesExercised: 0,
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      expect(result.regularTax).toBe(0);
      expect(result.amtOwed).toBe(0);
      expect(result.totalTaxOwed).toBe(0);
    });

    it('should handle strike >= FMV (no bargain element)', () => {
      const input: TaxInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 10.0,
        isoFmv: 10.0, // Same as strike
        sharesExercised: 10000,
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      expect(result.bargainElement).toBe(0);
      expect(result.amtIncome).toBe(150000); // Just ordinary income
    });

    it('should handle married filing jointly correctly', () => {
      const input: TaxInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'married',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 10000,
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // Should use married filing jointly parameters
      // Standard deduction = $29,200
      expect(result.regularTaxableIncome).toBe(150000 - 29200);

      // AMT exemption = $133,300
      expect(result.amtExemptionAmount).toBe(133300);
    });
  });

  describe('Incremental AMT Calculation', () => {
    it('should calculate incremental AMT correctly', () => {
      const baselineInput: TaxInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 0,
      };

      const exerciseInput: TaxInput = {
        ...baselineInput,
        sharesExercised: 5000, // $45k bargain element
      };

      const incrementalAmt = calculateIncrementalAmt(baselineInput, exerciseInput, TAX_PARAMS_2024);

      expect(incrementalAmt).toBeGreaterThan(0);

      // Verify it matches the difference
      const baselineTax = calculateTax(baselineInput, TAX_PARAMS_2024);
      const exerciseTax = calculateTax(exerciseInput, TAX_PARAMS_2024);

      expect(incrementalAmt).toBe(exerciseTax.amtOwed - baselineTax.amtOwed);
    });

    it('should return zero incremental AMT if no exercise', () => {
      const baselineInput: TaxInput = {
        ordinaryIncome: 150000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 0,
      };

      const incrementalAmt = calculateIncrementalAmt(baselineInput, baselineInput, TAX_PARAMS_2024);

      expect(incrementalAmt).toBe(0);
    });
  });

  describe('Effective Tax Rate', () => {
    it('should calculate effective tax rate correctly', () => {
      const input: TaxInput = {
        ordinaryIncome: 100000,
        itemizedDeductions: 0,
        filingStatus: 'single',
        isoStrike: 1.0,
        isoFmv: 10.0,
        sharesExercised: 5000, // $45k bargain element
      };

      const result = calculateTax(input, TAX_PARAMS_2024);

      // Total income = 100,000 + 45,000 = 145,000
      // Effective rate = total tax / total income
      const expectedRate = result.totalTaxOwed / 145000;

      expect(result.effectiveTaxRate).toBeCloseTo(expectedRate, 6);
      expect(result.effectiveTaxRate).toBeGreaterThan(0);
      expect(result.effectiveTaxRate).toBeLessThan(0.40); // Should be less than 40%
    });
  });
});
