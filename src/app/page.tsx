import ISOCalculatorForm from '@/components/iso-calculator-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ISO AMT Exercise Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate the optimal number of ISO shares to exercise while staying within your AMT budget. Get your personalized CPA Pack for $29.
          </p>
        </div>

        <ISOCalculatorForm />

        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What You'll Receive
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Optimal Exercise Plan:</strong> Maximum shares to exercise within your AMT budget</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Tax Breakdown:</strong> Regular tax + AMT calculations with bargain element</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Scenario Analysis:</strong> 25%, 50%, and 100% exercise options</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Sensitivity Analysis:</strong> Impact of FMV changes (±10%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>CPA-Ready PDF:</strong> Professional report you can share with your tax advisor</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
