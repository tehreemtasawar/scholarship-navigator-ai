import React, { useState } from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export const FundingRealityCheck: React.FC = () => {
  const { profile, matchResults, viewScholarshipDetails, setActiveTab } = useScholarship();
  const [selectedDestination, setSelectedDestination] = useState<string>('All');

  const filteredMatches = matchResults.filter((m) => {
    if (selectedDestination === 'All') return true;
    return m.scholarship.destinationCountry === selectedDestination;
  });

  const destinations = ['All', ...Array.from(new Set(matchResults.map((m) => m.scholarship.destinationCountry)))];

  const expenseColumns = [
    { key: 'tuition', label: 'Tuition' },
    { key: 'stipend', label: 'Stipend / Living' },
    { key: 'accommodation', label: 'Housing' },
    { key: 'travel', label: 'Flights' },
    { key: 'healthInsurance', label: 'Health Ins.' },
    { key: 'visaFees', label: 'Visa Fees' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" />
            <span>Financial Suitability Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            Funding Reality Check
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            "Fully funded" does not always mean every cost is paid. Compare your required expenses with real provider policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Filter Destination:</label>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-1.5 text-slate-800 bg-white"
          >
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student's Stated Financial Baseline Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Your Stated Expense Priorities (Baseline)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {Object.entries(profile.fundingPriorities).map(([key, level]) => {
            const isMust = level === 'must';
            const isPref = level === 'preferred';
            return (
              <div
                key={key}
                className={`p-3 rounded-xl border ${
                  isMust
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : isPref
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="font-bold text-sm mt-0.5">
                  {isMust ? 'Must Cover' : isPref ? 'Preferably' : 'Not Priority'}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>
            To update these priorities, go to{' '}
            <button
              onClick={() => setActiveTab('find')}
              className="text-blue-600 font-semibold underline hover:text-blue-700"
            >
              Profile Form &gt; Funding Needs
            </button>
            .
          </span>
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
            Audited Coverage by Scholarship Program
          </h2>
          <span className="text-xs text-slate-500">
            Showing {filteredMatches.length} scholarship packages
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Scholarship & Country</th>
                <th className="py-3.5 px-3">Funding Match</th>
                {expenseColumns.map((col) => (
                  <th key={col.key} className="py-3.5 px-3">
                    {col.label}
                  </th>
                ))}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMatches.map((m) => {
                const s = m.scholarship;
                const fb = s.fundingBreakdown;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.destinationCountry} • {s.fundingType}</div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          m.fundingAssessment === 'meets_needs'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : m.fundingAssessment === 'partially_meets'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {m.fundingAssessment === 'meets_needs' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : m.fundingAssessment === 'partially_meets' ? (
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>
                          {m.fundingAssessment === 'meets_needs'
                                        ? m.fundingMatches.some((item) => item.priority === 'preferred' && item.coverage !== 'covered')
                                          ? 'Mandatory Priorities Met; Preferred Gaps'
                                          : 'Mandatory Priorities Met'
                                        : m.fundingAssessment === 'partially_meets'
                                        ? 'Mandatory Priorities Partial'
                                        : 'Misses Must-Have'}
                        </span>
                      </span>
                    </td>

                    {/* Expense coverage status badges */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        fb.tuition.status === 'covered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {fb.tuition.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        fb.stipend.status === 'covered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : fb.stipend.status === 'partial' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {fb.stipend.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        fb.accommodation.status === 'covered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : fb.accommodation.status === 'partial' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {fb.accommodation.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        fb.travel.status === 'covered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : fb.travel.status === 'partial' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {fb.travel.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        fb.healthInsurance.status === 'covered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : fb.healthInsurance.status === 'not_covered' ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {fb.healthInsurance.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        fb.visaFees.status === 'covered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : fb.visaFees.status === 'not_covered' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {fb.visaFees.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => viewScholarshipDetails(s.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1"
                      >
                        <span>Audit Notes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
