'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  filingStatus: z.enum(['single', 'married', 'married_separate', 'head_of_household', 'qualifying_widow']),
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Form Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Calculate Your Plan
          </h2>
          <p className="text-slate-600 text-sm">
            Enter your information to receive an instant, personalized analysis
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Contact</h3>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Tax Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Tax Profile</h3>
            </div>

            <div>
              <label htmlFor="filingStatus" className="block text-sm font-medium text-slate-700 mb-2">
                Filing Status
              </label>
              <select
                {...register('filingStatus')}
                id="filingStatus"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none cursor-pointer"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly (MFJ)</option>
                <option value="married_separate">Married Filing Separately (MFS)</option>
                <option value="head_of_household">Head of Household (HOH)</option>
                <option value="qualifying_widow">Qualifying Surviving Spouse (QSS)</option>
              </select>
              <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Only Single and MFJ are fully supported. Others default to Single.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ordinaryIncome" className="block text-sm font-medium text-slate-700 mb-2">
                  Ordinary Income
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">$</span>
                  <input
                    {...register('ordinaryIncome')}
                    type="number"
                    id="ordinaryIncome"
                    step="1"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                    placeholder="180,000"
                  />
                </div>
                {errors.ordinaryIncome && (
                  <p className="mt-2 text-sm text-red-600">{errors.ordinaryIncome.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="itemizedDeductions" className="block text-sm font-medium text-slate-700 mb-2">
                  Itemized Deductions
                  <span className="text-slate-400 ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">$</span>
                  <input
                    {...register('itemizedDeductions')}
                    type="number"
                    id="itemizedDeductions"
                    step="1"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ISO Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">ISO Grant</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="isoStrike" className="block text-sm font-medium text-slate-700 mb-2">
                  Strike Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">$</span>
                  <input
                    {...register('isoStrike')}
                    type="number"
                    id="isoStrike"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                    placeholder="0.50"
                  />
                </div>
                {errors.isoStrike && (
                  <p className="mt-2 text-sm text-red-600">{errors.isoStrike.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="isoFmv" className="block text-sm font-medium text-slate-700 mb-2">
                  Current FMV
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">$</span>
                  <input
                    {...register('isoFmv')}
                    type="number"
                    id="isoFmv"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                    placeholder="25.00"
                  />
                </div>
                {errors.isoFmv && (
                  <p className="mt-2 text-sm text-red-600">{errors.isoFmv.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="totalSharesAvailable" className="block text-sm font-medium text-slate-700 mb-2">
                Total Shares Available
              </label>
              <input
                {...register('totalSharesAvailable')}
                type="number"
                id="totalSharesAvailable"
                step="1"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                placeholder="20,000"
              />
              {errors.totalSharesAvailable && (
                <p className="mt-2 text-sm text-red-600">{errors.totalSharesAvailable.message}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Budget</h3>
            </div>

            <div>
              <label htmlFor="targetAmtBudget" className="block text-sm font-medium text-slate-700 mb-2">
                Target AMT Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">$</span>
                <input
                  {...register('targetAmtBudget')}
                  type="number"
                  id="targetAmtBudget"
                  step="1"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                  placeholder="15,000"
                />
              </div>
              {errors.targetAmtBudget && (
                <p className="mt-2 text-sm text-red-600">{errors.targetAmtBudget.message}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Maximum AMT you're willing to pay this year
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="px-8 pb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Calculate & Pay $29</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure payment</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Instant email delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-xs text-amber-900/80 leading-relaxed">
          <strong className="font-semibold">Disclaimer:</strong> This tool is for informational purposes only and does not constitute tax, legal, or financial advice. Consult with a qualified tax professional before making ISO exercise decisions.
        </p>
      </div>
    </form>
  );
}
