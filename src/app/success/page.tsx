'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PurchaseSession {
  id: string;
  email: string;
  taxYear: number;
  filingStatus: string;
  ordinaryIncome: number;
  itemizedDeductions: number;
  isoStrike: number;
  isoFmv: number;
  totalSharesAvailable: number;
  targetAmtBudget: number;
  maxShares: number;
  projectedAmt: number;
  projectedTotalTax: number;
  bargainElement: number;
  tile25Shares: number | null;
  tile25Cash: number | null;
  tile25Bargain: number | null;
  tile25Amt: number | null;
  tile50Shares: number | null;
  tile50Cash: number | null;
  tile50Bargain: number | null;
  tile50Amt: number | null;
  tile100Shares: number | null;
  tile100Cash: number | null;
  tile100Bargain: number | null;
  tile100Amt: number | null;
  sensitivityDownFmv: number | null;
  sensitivityDownShares: number | null;
  sensitivityUpFmv: number | null;
  sensitivityUpShares: number | null;
  paymentStatus: string;
  paidAt: string | null;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [session, setSession] = useState<PurchaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/session/${sessionId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch session');
        }

        const data = await response.json();
        setSession(data.session);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your results...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-6">{error || 'Failed to load results'}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Success Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-slate-600">
            Your ISO AMT Exercise Plan is ready
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Results sent to {session.email}
          </p>
        </div>

        {/* Optimal Exercise Plan */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Optimal Exercise Plan</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-6 border border-indigo-200/50">
                <div className="text-sm font-medium text-indigo-600 mb-1">Max Shares to Exercise</div>
                <div className="text-3xl font-bold text-indigo-900">{formatNumber(session.maxShares)}</div>
                <div className="text-xs text-indigo-600 mt-1">shares</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-6 border border-emerald-200/50">
                <div className="text-sm font-medium text-emerald-600 mb-1">Cash Required</div>
                <div className="text-3xl font-bold text-emerald-900">{formatCurrency(session.maxShares * session.isoStrike)}</div>
                <div className="text-xs text-emerald-600 mt-1">at ${session.isoStrike}/share</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200/50">
                <div className="text-sm font-medium text-purple-600 mb-1">Projected AMT</div>
                <div className="text-3xl font-bold text-purple-900">{formatCurrency(session.projectedAmt)}</div>
                <div className="text-xs text-purple-600 mt-1">of {formatCurrency(session.targetAmtBudget)} budget</div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-6 border border-pink-200/50">
                <div className="text-sm font-medium text-pink-600 mb-1">Bargain Element</div>
                <div className="text-3xl font-bold text-pink-900">{formatCurrency(session.bargainElement)}</div>
                <div className="text-xs text-pink-600 mt-1">FMV - Strike</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Scenarios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Alternative Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* 25% Scenario */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Conservative</h3>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">25% Budget</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Shares</div>
                  <div className="text-xl font-bold text-slate-900">{formatNumber(session.tile25Shares || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Cash Needed</div>
                  <div className="text-lg font-semibold text-slate-700">{formatCurrency(session.tile25Cash || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Projected AMT</div>
                  <div className="text-lg font-semibold text-slate-700">{formatCurrency(session.tile25Amt || 0)}</div>
                </div>
              </div>
            </div>

            {/* 50% Scenario */}
            <div className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-2xl p-6 shadow-lg shadow-indigo-200/50 ring-2 ring-indigo-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Moderate</h3>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">50% Budget</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Shares</div>
                  <div className="text-xl font-bold text-slate-900">{formatNumber(session.tile50Shares || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Cash Needed</div>
                  <div className="text-lg font-semibold text-slate-700">{formatCurrency(session.tile50Cash || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Projected AMT</div>
                  <div className="text-lg font-semibold text-slate-700">{formatCurrency(session.tile50Amt || 0)}</div>
                </div>
              </div>
            </div>

            {/* 100% Scenario */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Aggressive</h3>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">100% Budget</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Shares</div>
                  <div className="text-xl font-bold text-slate-900">{formatNumber(session.tile100Shares || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Cash Needed</div>
                  <div className="text-lg font-semibold text-slate-700">{formatCurrency(session.tile100Cash || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Projected AMT</div>
                  <div className="text-lg font-semibold text-slate-700">{formatCurrency(session.tile100Amt || 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sensitivity Analysis</h2>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-200/50">
            <p className="text-slate-600 mb-6">
              What if the Fair Market Value changes? Here&apos;s how your exercise plan would adjust:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <h3 className="text-lg font-semibold text-orange-900">If FMV Decreases 10%</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-orange-700">New FMV:</span>
                    <span className="text-sm font-semibold text-orange-900">{formatCurrency(session.sensitivityDownFmv || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-orange-700">Max Shares:</span>
                    <span className="text-sm font-semibold text-orange-900">{formatNumber(session.sensitivityDownShares || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-6 border border-emerald-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <h3 className="text-lg font-semibold text-emerald-900">If FMV Increases 10%</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-700">New FMV:</span>
                    <span className="text-sm font-semibold text-emerald-900">{formatCurrency(session.sensitivityUpFmv || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-700">Max Shares:</span>
                    <span className="text-sm font-semibold text-emerald-900">{formatNumber(session.sensitivityUpShares || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-center shadow-xl shadow-indigo-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Get Your CPA Pack</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Download a comprehensive PDF report with all calculations, tax analysis, and scenarios to share with your tax advisor.
          </p>
          <button
            onClick={() => window.location.href = `/api/pdf/${sessionId}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
