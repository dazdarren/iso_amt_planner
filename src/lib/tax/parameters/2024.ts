// 2024 Tax Year Parameters (IRS Published Data)

import { TaxParameters } from '../types';

export const TAX_PARAMS_2024: TaxParameters = {
  year: 2024,
  filingStatus: {
    single: {
      standardDeduction: 14600,
      amtExemption: 85700,
      amtPhaseoutStart: 609350,
      amtPhaseoutRate: 0.25,
      regularBrackets: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
      ],
      amtRate: {
        threshold: 220700,
        lowerRate: 0.26,
        upperRate: 0.28,
      },
    },
    married: {
      standardDeduction: 29200,
      amtExemption: 133300,
      amtPhaseoutStart: 1218700,
      amtPhaseoutRate: 0.25,
      regularBrackets: [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 },
      ],
      amtRate: {
        threshold: 220700,
        lowerRate: 0.26,
        upperRate: 0.28,
      },
    },
  },
} as const;

export default TAX_PARAMS_2024;
