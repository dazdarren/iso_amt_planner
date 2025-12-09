'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  filingStatus: z.enum(['single', 'married']),
  ordinaryIncome: z.coerce
    .number()
    .min(0, 'Income must be positive')
    .max(10000000, 'Income seems unusually high'),
  itemizedDeductions: z.coerce
    .number()
    .min(0, 'Deductions must be positive')
    .default(0),
  isoStrike: z.coerce
    .number()
    .min(0.01, 'Strike price must be greater than 0')
    .max(10000, 'Strike price seems unusually high'),
  isoFmv: z.coerce
    .number()
    .min(0.01, 'FMV must be greater than 0')
    .max(100000, 'FMV seems unusually high'),
  totalSharesAvailable: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must have at least 1 share')
    .max(10000000, 'Number of shares seems unusually high'),
  targetAmtBudget: z.coerce
    .number()
    .min(0, 'AMT budget must be positive')
    .max(1000000, 'AMT budget seems unusually high'),
});

type FormData = z.output<typeof formSchema>;

export default function ISOCalculatorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemizedDeductions: 0,
      filingStatus: 'single' as const,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Call /api/checkout endpoint
      console.log('Form data:', data);

      // Placeholder: This will redirect to Stripe checkout
      alert('Form submitted! Next: Implement Stripe checkout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ISO Exercise Calculator
          </h2>
          <p className="text-gray-600">
            Calculate the optimal number of ISO shares to exercise within your AMT budget.
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              We'll send your CPA Pack report to this email
            </p>
          </div>
        </div>

        {/* Tax Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tax Information</h3>

          {/* Filing Status */}
          <div>
          <label htmlFor="filingStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Filing Status
          </label>
          <select
            {...register('filingStatus')}
            id="filingStatus"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly (MFJ)</option>
          </select>
          {errors.filingStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.filingStatus.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Note: MFS, HOH, and QSS filing statuses coming soon
          </p>
        </div>

        {/* Income & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ordinaryIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Ordinary Income (W-2, etc.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">$</span>
              <input
                {...register('ordinaryIncome')}
                type="number"
                id="ordinaryIncome"
                step="1"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="180000"
              />
            </div>
            {errors.ordinaryIncome && (
              <p className="mt-1 text-sm text-red-600">{errors.ordinaryIncome.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="itemizedDeductions" className="block text-sm font-medium text-gray-700 mb-1">
              Itemized Deductions (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">$</span>
              <input
                {...register('itemizedDeductions')}
                type="number"
                id="itemizedDeductions"
                step="1"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            {errors.itemizedDeductions && (
              <p className="mt-1 text-sm text-red-600">{errors.itemizedDeductions.message}</p>
            )}
          </div>
        </div>

        {/* ISO Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">ISO Stock Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="isoStrike" className="block text-sm font-medium text-gray-700 mb-1">
              ISO Strike Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">$</span>
              <input
                {...register('isoStrike')}
                type="number"
                id="isoStrike"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.50"
              />
            </div>
            {errors.isoStrike && (
              <p className="mt-1 text-sm text-red-600">{errors.isoStrike.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="isoFmv" className="block text-sm font-medium text-gray-700 mb-1">
              Current Fair Market Value (FMV)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">$</span>
              <input
                {...register('isoFmv')}
                type="number"
                id="isoFmv"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="25.00"
              />
            </div>
            {errors.isoFmv && (
              <p className="mt-1 text-sm text-red-600">{errors.isoFmv.message}</p>
            )}
          </div>
          </div>
        </div>

        {/* Shares & AMT Budget */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Exercise Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalSharesAvailable" className="block text-sm font-medium text-gray-700 mb-1">
              Total Shares Available to Exercise
            </label>
            <input
              {...register('totalSharesAvailable')}
              type="number"
              id="totalSharesAvailable"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="20000"
            />
            {errors.totalSharesAvailable && (
              <p className="mt-1 text-sm text-red-600">{errors.totalSharesAvailable.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="targetAmtBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Target AMT Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">$</span>
              <input
                {...register('targetAmtBudget')}
                type="number"
                id="targetAmtBudget"
                step="1"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="15000"
              />
            </div>
            {errors.targetAmtBudget && (
              <p className="mt-1 text-sm text-red-600">{errors.targetAmtBudget.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Maximum AMT you're willing to pay this year
            </p>
          </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Processing...' : 'Calculate & Pay $29 →'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            🔒 Secure payment via Stripe • Instant email delivery
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute tax, legal, or financial advice. Consult with a qualified tax professional before making ISO exercise decisions.
        </p>
      </div>
    </form>
  );
}
