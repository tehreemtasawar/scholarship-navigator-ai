import React, { useState } from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import { SCHOLARSHIPS } from '../data/scholarships';
import {
  GitCompare,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building,
  Globe2,
  Calendar,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export const ComparisonLab: React.FC = () => {
  const { compareIds, toggleCompare, clearCompare, profile, viewScholarshipDetails, setActiveTab } =
    useScholarship();

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiFallback, setIsAiFallback] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const comparedScholarships = SCHOLARSHIPS.filter((s) => compareIds.includes(s.id));
  const aiProfile = {
    nationality: profile.nationality,
    intendedDegree: profile.intendedDegree,
    fieldOfStudy: profile.fieldOfStudy,
    grade: profile.grade,
    gradeScale: profile.gradeScale,
    fundingPriorities: profile.fundingPriorities,
  };
  const aiScholarships = comparedScholarships.map((scholarship) => ({
    name: scholarship.name,
    provider: scholarship.provider,
    destinationCountry: scholarship.destinationCountry,
    deadlineStatus: scholarship.deadlineStatus,
    applicationDeadline: scholarship.applicationDeadline,
    deadlineNote: scholarship.deadlineNote,
    verificationStatus: scholarship.verificationStatus,
    sourceTitle: scholarship.sourceTitle,
    fundingType: scholarship.fundingType,
    fundingBreakdown: Object.fromEntries(
      (['tuition', 'stipend', 'accommodation', 'travel', 'healthInsurance', 'visaFees'] as const).map((key) => [
        key,
        {
          status: scholarship.fundingBreakdown[key].status,
          amountOrDetail: scholarship.fundingBreakdown[key].amountOrDetail,
        },
      ])
    ),
    exclusions: scholarship.exclusions,
    mandatoryCriteria: scholarship.mandatoryCriteria.map(({ label }) => ({ label })),
  }));

  const handleRunAiComparison = async () => {
    if (comparedScholarships.length < 2) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/compare-scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarships: aiScholarships,
          profile: aiProfile,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to compare.');
      setIsAiFallback(Boolean(data.isFallback));
      setAiAnalysis(data.analysis || data.fallbackMessage || 'Comparison complete.');
    } catch (err: any) {
      setAnalysisError(err.message || 'Comparison service unavailable.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (comparedScholarships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-100">
          <GitCompare className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 font-['Space_Grotesk']">
          No Scholarships in Comparison Lab
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Select 2 or 3 scholarships from the Results Dashboard to compare eligibility rules, funding packages, and application deadlines side by side.
        </p>
        <button
          onClick={() => setActiveTab('results')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
        >
          Browse Scholarship Results
        </button>
      </div>
    );
  }

  const comparisonRows: {
    category: string;
    label: string;
    render: (s: typeof comparedScholarships[0]) => React.ReactNode;
  }[] = [
    {
      category: 'Overview',
      label: 'Destination & Provider',
      render: (s) => (
        <div>
          <div className="font-bold text-slate-900">{s.destinationCountry}</div>
          <div className="text-slate-500 text-[11px]">{s.provider}</div>
        </div>
      ),
    },
    {
      category: 'Overview',
      label: 'Funding Classification',
      render: (s) => (
        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
          Provider classification: {s.fundingType}
        </span>
      ),
    },
    {
      category: 'Eligibility',
      label: 'Degrees Supported',
      render: (s) => s.eligibleDegrees.map((d) => d.toUpperCase()).join(', '),
    },
    {
      category: 'Eligibility',
      label: 'Academic Minimum',
      render: (s) =>
        s.minGrade
          ? `${s.minGrade.minimum} (${s.minGrade.scale} scale)`
          : 'Competitive merit selection (no fixed cutoff)',
    },
    {
      category: 'Eligibility',
      label: 'Language Requirement',
      render: (s) =>
        s.languageRequirements
          ? `${s.languageRequirements.test.toUpperCase()} min ${s.languageRequirements.minScore || 'standard'}`
          : 'Set by chosen university',
    },
    {
      category: 'Eligibility',
      label: 'Work Experience Mandate',
      render: (s) =>
        s.workExperienceRequiredYears
          ? `Mandatory ${s.workExperienceRequiredYears} years (${s.workExperienceRequiredYears * 1400} hrs)`
          : 'No mandatory work experience',
    },
    {
      category: 'Funding Coverage',
      label: 'Tuition Fee Coverage',
      render: (s) => (
        <div>
          <span className="font-bold text-emerald-700 uppercase text-[11px]">
            {s.fundingBreakdown.tuition.status}:
          </span>{' '}
          {s.fundingBreakdown.tuition.amountOrDetail}
        </div>
      ),
    },
    {
      category: 'Funding Coverage',
      label: 'Stipend / Living Allowance',
      render: (s) => (
        <div>
          <span className="font-bold text-emerald-700 uppercase text-[11px]">
            {s.fundingBreakdown.stipend.status}:
          </span>{' '}
          {s.fundingBreakdown.stipend.amountOrDetail}
        </div>
      ),
    },
    {
      category: 'Funding Coverage',
      label: 'Accommodation',
      render: (s) => (
        <div>
          <span className="font-bold text-amber-700 uppercase text-[11px]">
            {s.fundingBreakdown.accommodation.status}:
          </span>{' '}
          {s.fundingBreakdown.accommodation.amountOrDetail}
        </div>
      ),
    },
    {
      category: 'Funding Coverage',
      label: 'Airfare / Flights',
      render: (s) => (
        <div>
          <span className="font-bold text-emerald-700 uppercase text-[11px]">
            {s.fundingBreakdown.travel.status}:
          </span>{' '}
          {s.fundingBreakdown.travel.amountOrDetail}
        </div>
      ),
    },
    {
      category: 'Funding Coverage',
      label: 'Health Insurance',
      render: (s) => {
        const status = s.fundingBreakdown.healthInsurance.status;
        return (
          <div>
            <span
              className={`font-bold uppercase text-[11px] ${
                status === 'covered'
                  ? 'text-emerald-700'
                  : status === 'not_covered'
                  ? 'text-rose-700'
                  : 'text-amber-700'
              }`}
            >
              {status.replace('_', ' ')}:
            </span>{' '}
            {s.fundingBreakdown.healthInsurance.amountOrDetail}
          </div>
        );
      },
    },
    {
      category: 'Funding Coverage',
      label: 'Visa Fees',
      render: (s) => (
        <div>
          <span className="font-bold uppercase text-[11px] text-slate-700">
            {s.fundingBreakdown.visaFees.status.replace('_', ' ')}:
          </span>{' '}
          {s.fundingBreakdown.visaFees.amountOrDetail}
        </div>
      ),
    },
    {
      category: 'Deadlines & Sources',
      label: 'Deadline Status & Intake',
      render: (s) => (
        <div className="space-y-1">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
              s.deadlineStatus === 'open'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : s.deadlineStatus === 'closed'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : s.deadlineStatus === 'upcoming'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>
              {s.deadlineStatus === 'open'
                ? 'OPEN FOR APPLICATION'
                : s.deadlineStatus === 'closed'
                ? 'CLOSED FOR CURRENT CYCLE'
                : s.deadlineStatus === 'upcoming'
                ? 'UPCOMING INTAKE'
                : 'UNCONFIRMED / ROLLING'}
            </span>
          </span>
          <div className="text-[11px] text-slate-700 font-semibold">
            {s.applicationDeadline ? `Deadline: ${s.applicationDeadline}` : 'No deadline published; confirm with provider'}
          </div>
          {s.deadlineNote && (
            <div className="text-[10px] text-slate-500 italic leading-snug">
              {s.deadlineNote}
            </div>
          )}
        </div>
      ),
    },
    {
      category: 'Deadlines & Sources',
      label: 'Official Source & Verification',
      render: (s) => (
        <div className="space-y-0.5 text-xs">
          <a
            href={s.officialSourceUrl || s.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
          >
            <span>{s.sourceTitle || 'Official provider portal'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="text-[10px] text-slate-400">Last Checked: {s.lastChecked} ({s.verificationStatus})</div>
        </div>
      ),
    },
    {
      category: 'Deadlines & Sources',
      label: 'Official Website',
      render: (s) => (
        <a
          href={s.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Scholarship Comparison Lab ({comparedScholarships.length}/3)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            Side-by-Side Trade-off Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Carefully analyze differences in return obligations, health insurance, and out-of-pocket costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedScholarships.length >= 2 && (
            <button
              onClick={handleRunAiComparison}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Comparison Synthesis</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={clearCompare}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* AI Comparison Synthesis Card if generated */}
      {aiAnalysis && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isAiFallback ? 'Offline Rule-Based Comparison' : 'Grounded AI Comparative Analysis'}</span>
            </div>
            <button
              onClick={() => setAiAnalysis(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line prose prose-invert prose-xs max-w-none">
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-4 w-48 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  Feature
                </th>
                {comparedScholarships.map((s) => (
                  <th key={s.id} className="py-4 px-4 min-w-[260px] align-top">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-extrabold text-slate-900 text-sm font-['Space_Grotesk']">
                        {s.name}
                      </span>
                      <button
                        onClick={() => toggleCompare(s.id)}
                        className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => viewScholarshipDetails(s.id)}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      View Details →
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/40 whitespace-nowrap">
                    {row.label}
                  </td>
                  {comparedScholarships.map((s) => (
                    <td key={s.id} className="py-3 px-4 text-slate-700 align-top leading-relaxed">
                      {row.render(s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
