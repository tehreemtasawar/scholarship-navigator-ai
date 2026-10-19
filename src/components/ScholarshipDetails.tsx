import React, { useState } from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import {
  ArrowLeft,
  Building,
  Globe2,
  Calendar,
  Coins,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ExternalLink,
  ListTodo,
  GitCompare,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  FileText,
  AlertCircle,
  Info,
} from 'lucide-react';

export const ScholarshipDetails: React.FC = () => {
  const {
    profile,
    selectedScholarship,
    selectedMatchResult,
    setActiveTab,
    compareIds,
    toggleCompare,
    roadmapTasks,
    addScholarshipToRoadmap,
  } = useScholarship();

  // AI Explainer State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiFallback, setIsAiFallback] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainerError, setExplainerError] = useState<string | null>(null);

  // AI Assistant Chat State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; time: string }[]
  >([]);
  const [isChatting, setIsChatting] = useState(false);

  if (!selectedScholarship || !selectedMatchResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">No scholarship selected</h2>
        <p className="text-xs text-slate-500 mb-4">Please select a scholarship from the results dashboard.</p>
        <button
          onClick={() => setActiveTab('results')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Results
        </button>
      </div>
    );
  }

  const scholarship = selectedScholarship;
  const match = selectedMatchResult;
  const isCompared = compareIds.includes(scholarship.id);
  const isInRoadmap = roadmapTasks.some((t) => t.scholarshipId === scholarship.id);
  const aiFundingBreakdown = Object.fromEntries(
    (['tuition', 'stipend', 'accommodation', 'travel', 'healthInsurance', 'visaFees'] as const).map((key) => [
      key,
      {
        status: scholarship.fundingBreakdown[key].status,
        amountOrDetail: scholarship.fundingBreakdown[key].amountOrDetail,
      },
    ])
  );
  const aiProfile = {
    nationality: profile.nationality,
    currentEducationLevel: profile.currentEducationLevel,
    currentDegreeProgram: profile.currentDegreeProgram,
    intendedDegree: profile.intendedDegree,
    fieldOfStudy: profile.fieldOfStudy,
    specialization: profile.specialization,
    grade: profile.grade,
    gradeScale: profile.gradeScale,
    languageTest: profile.languageTest,
    languageScore: profile.languageScore,
    fundingPriorities: profile.fundingPriorities,
    workExperienceYears: profile.workExperienceYears,
  };
  const explainScholarship = {
    name: scholarship.name,
    provider: scholarship.provider,
    destinationCountry: scholarship.destinationCountry,
    eligibleDegrees: scholarship.eligibleDegrees,
    eligibleNationalities: scholarship.eligibleNationalities,
    minGrade: scholarship.minGrade
      ? { minimum: scholarship.minGrade.minimum, scale: scholarship.minGrade.scale }
      : undefined,
    workExperienceRequiredYears: scholarship.workExperienceRequiredYears,
    fundingType: scholarship.fundingType,
    officialUrl: scholarship.officialUrl,
    lastChecked: scholarship.lastChecked,
    verificationStatus: scholarship.verificationStatus,
    fundingBreakdown: aiFundingBreakdown,
  };
  const chatScholarship = {
    name: scholarship.name,
    officialUrl: scholarship.officialUrl,
    fundingBreakdown: aiFundingBreakdown,
  };
  const explainEvaluation = {
    overallStatus: match.overallStatus,
    statusLabel: match.statusLabel,
    fitScore: match.fitScore,
    fundingAssessment: match.fundingAssessment,
    fundingAssessmentSummary: match.fundingAssessmentSummary,
    evaluations: match.evaluations.map(({ criterion, status, studentValue, requiredValue, reason }) => ({
      criterion,
      status,
      studentValue,
      requiredValue,
      reason,
    })),
  };

  // Call Server-Side AI Explainer
  const handleExplainMatch = async () => {
    setIsExplaining(true);
    setExplainerError(null);
    try {
      const response = await fetch('/api/explain-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: aiProfile,
          scholarship: explainScholarship,
          matchEvaluation: explainEvaluation,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate explanation.');
      }

      setIsAiFallback(Boolean(data.isFallback));
      if (data.groundedExplanation) {
        setAiExplanation(data.groundedExplanation);
      } else if (data.fallbackMessage) {
        setAiExplanation(data.fallbackMessage);
      }
    } catch (err: any) {
      setExplainerError(err.message || 'AI service unavailable.');
    } finally {
      setIsExplaining(false);
    }
  };

  // Call Server-Side AI Chat Assistant
  const handleSendChat = async (questionText?: string) => {
    const q = questionText || chatQuestion;
    if (!q.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistory = [...chatMessages, { sender: 'user' as const, text: q, time: timeStr }];
    setChatMessages(newHistory);
    setChatQuestion('');
    setIsChatting(true);

    try {
      const response = await fetch('/api/chat-scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          scholarship: chatScholarship,
          profile: aiProfile,
        }),
      });

      const data = await response.json();
      const reply = data.answer || data.error || 'No answer available.';
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant' as const,
          text: 'Unable to reach the assistant service at this moment.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const quickPrompts = [
    'Does this scholarship cover health insurance?',
    'What happens if my CGPA is below the requirement?',
    'What should I prepare first for this application?',
    'Is there a return home country obligation?',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('results')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Results</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCompare(scholarship.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
              isCompared
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompared ? 'In Compare (✓)' : 'Add to Compare'}</span>
          </button>

          <button
            onClick={() => addScholarshipToRoadmap(scholarship)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
              isInRoadmap
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>{isInRoadmap ? 'In Roadmap (✓)' : 'Add to Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Eligibility status badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg border ${
              match.overallStatus === 'matches_known'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : match.overallStatus === 'potential_match'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {match.overallStatus === 'matches_known' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : match.overallStatus === 'potential_match' ? (
              <HelpCircle className="w-4 h-4 text-amber-600" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{match.statusLabel}</span>
          </span>

          {/* Deadline Status Badge */}
          <span
            className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
              scholarship.deadlineStatus === 'open'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : scholarship.deadlineStatus === 'closed'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : scholarship.deadlineStatus === 'upcoming'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {scholarship.deadlineStatus === 'open'
                ? `OPEN — Deadline: ${scholarship.applicationDeadline}`
                : scholarship.deadlineStatus === 'closed'
                ? (scholarship.applicationDeadline
                    ? (scholarship.applicationDeadline.toLowerCase().includes('closed')
                        ? `CLOSED (${scholarship.applicationDeadline})`
                        : `CLOSED (Deadline was ${scholarship.applicationDeadline})`)
                    : 'CLOSED')
                : scholarship.deadlineStatus === 'upcoming'
                ? `UPCOMING (Opens ${scholarship.applicationOpeningDate || 'soon'})`
                : 'UNCONFIRMED / Rolling'}
            </span>
          </span>

          {/* Verification Status Badge */}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              scholarship.verificationStatus === 'verified_official'
                ? 'bg-teal-50 text-teal-800 border-teal-300'
                : scholarship.verificationStatus === 'demo_data'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {scholarship.verificationStatus === 'verified_official'
              ? 'Verified Official Source'
              : scholarship.verificationStatus === 'demo_data'
              ? 'Demo Fixture'
              : 'Needs Verification'}
          </span>

          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            {scholarship.fundingType}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] mb-2">
          {scholarship.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mb-3">
          <span className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <strong>Provider:</strong> {scholarship.provider}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <strong>Destination:</strong> {scholarship.destinationCountry}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <strong>Official Source:</strong>{' '}
            <a
              href={scholarship.officialSourceUrl || scholarship.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
            >
              {scholarship.sourceTitle || 'Official provider portal'}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-400">(Checked {scholarship.lastChecked})</span>
          </span>
        </div>

        {scholarship.deadlineNote && (
          <div className="p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Cycle Timeline Note: </strong>
              {scholarship.deadlineNote}
              {scholarship.deadlineStatus === 'closed' && (
                <span className="text-rose-700 font-semibold block mt-0.5">
                  Notice: Applications for this cycle are closed. This record is retained for planning future intake cycles.
                </span>
              )}
            </div>
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {scholarship.shortDescription}
        </p>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>
              Official Source:               <a href={scholarship.officialSourceUrl || scholarship.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">{scholarship.sourceTitle || 'Official provider portal'}</a> (Checked: {scholarship.lastChecked}; status: {scholarship.verificationStatus})
            </span>
          </div>

          <a
            href={scholarship.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <span>Visit Official Provider Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* AI Explainer Callout Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-800/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence-Grounded AI Assistant</span>
            </div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              Why Does This Scholarship Match (or Not Match) You?
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Generate an unbiased, comprehensive explanation grounded in the official rules and your profile.
            </p>
          </div>

          <button
            onClick={handleExplainMatch}
            disabled={isExplaining}
            className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isExplaining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Evidence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explain My Match With AI</span>
              </>
            )}
          </button>
        </div>

        {explainerError && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl p-4 text-xs mt-4">
            <span className="font-bold">Notice: </span>
            {explainerError}
          </div>
        )}

        {aiExplanation && (
          <div className="mt-6 bg-slate-950/70 border border-slate-700/80 rounded-2xl p-6 text-xs text-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isAiFallback ? 'Offline Rule-Based Assessment' : 'Grounded Assessment Output'}
              </span>
              <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isAiFallback ? 'Gemini unavailable' : 'Grounded in Verified Data'}
              </span>
            </div>
            <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {aiExplanation}
            </div>
          </div>
        )}
      </div>

      {/* Student Specific Eligibility Evaluation Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Deterministic Criterion-by-Criterion Evaluation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your profile facts against the scholarship’s mandatory criteria. Evaluated using strict code logic.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Criterion</th>
                <th className="py-3 px-3">Official Rule</th>
                <th className="py-3 px-3">Your Profile</th>
                <th className="py-3 px-3">Result</th>
                <th className="py-3 px-3">Explanation & Caveats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {match.evaluations.map((evalItem, idx) => {
                let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                let icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;

                if (evalItem.status === 'does_not_meet') {
                  badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
                  icon = <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
                } else if (evalItem.status === 'unknown') {
                  badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                  icon = <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
                }

                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {evalItem.criterion}
                      {evalItem.isMandatory && (
                        <span className="text-[10px] text-rose-500 ml-1 font-semibold">*Mandatory</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium max-w-xs">{evalItem.requiredValue}</td>
                    <td className="py-3 px-3 font-semibold text-blue-900 whitespace-nowrap">
                      {evalItem.studentValue}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${badgeClass}`}>
                        {icon}
                        <span>{evalItem.status === 'meets' ? 'Meets' : evalItem.status === 'does_not_meet' ? 'Fails' : 'Unknown'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 leading-relaxed">{evalItem.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Funding Reality Check Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>Funding Reality Check: Expense-by-Expense Audit</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recorded breakdown of what the award claims to pay vs what you may need to fund out of pocket.
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
              match.fundingAssessment === 'meets_needs'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : match.fundingAssessment === 'partially_meets'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {match.fundingAssessment === 'meets_needs'
              ? match.fundingMatches.some((item) => item.priority === 'preferred' && item.coverage !== 'covered')
                ? 'Mandatory Priorities Met; Preferred Gaps'
                : 'Mandatory Priorities Met'
              : match.fundingAssessment === 'partially_meets'
              ? 'Mandatory Priorities Partial'
              : 'Does Not Meet Mandatory Need'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Expense</th>
                <th className="py-3 px-3">Your Stated Need</th>
                <th className="py-3 px-3">Scholarship Coverage</th>
                <th className="py-3 px-3">Amount or Policy Detail</th>
                <th className="py-3 px-3">Official Evidence Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {match.fundingMatches.map((item, idx) => {
                let covBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                if (item.coverage === 'partial') covBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                if (item.coverage === 'not_covered') covBadge = 'bg-rose-50 text-rose-800 border-rose-200';
                if (item.coverage === 'unknown') covBadge = 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{item.expense}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.priority === 'must'
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : item.priority === 'preferred'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.priority === 'must' ? 'Must Cover' : item.priority === 'preferred' ? 'Preferred' : 'Not Priority'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase ${covBadge}`}>
                        {item.coverage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium max-w-xs">{item.detail || 'Standard award rate'}</td>
                    <td className="py-3 px-3 text-slate-600 leading-relaxed max-w-sm">{item.evidenceNote}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Exclusions Box */}
        {scholarship.exclusions && scholarship.exclusions.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-slate-500" />
              <span>Confirmed Exclusions & Self-Funded Items</span>
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {scholarship.exclusions.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mandatory Official Requirements & Required Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mandatory Criteria */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Mandatory Official Criteria</span>
          </h3>
          <div className="space-y-3">
            {scholarship.mandatoryCriteria.map((crit) => (
              <div key={crit.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="font-bold text-slate-800 mb-0.5">{crit.label}</div>
                <div className="text-slate-600 leading-relaxed">{crit.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Required Application Documents</span>
          </h3>
          <ul className="space-y-2 text-xs">
            {scholarship.requiredDocuments.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive AI Scholarship Assistant Chat */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
                AI Assistant for {scholarship.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Ask targeted questions about requirements, funding rules, or preparation steps grounded in this record.
              </p>
            </div>
          </div>
        </div>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendChat(prompt)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 min-h-[160px] max-h-[320px] overflow-y-auto space-y-3 text-xs mb-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <p>No messages yet. Ask a question or click any prompt chip above.</p>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))
          )}
          {isChatting && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Checking verified scholarship records...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder={`Ask a specific question about ${scholarship.name}...`}
            className="flex-1 text-xs rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!chatQuestion.trim() || isChatting}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50 transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
