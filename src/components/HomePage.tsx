import React from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import { DEMO_PROFILES } from '../data/demoProfiles';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Coins,
  FileText,
  GitCompare,
  ExternalLink,
  Sparkles,
  BookOpen,
  Globe2,
  BadgeCheck,
  GraduationCap,
  ListTodo,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveTab, loadDemoProfile, matchResults } = useScholarship();

  const handleSelectDemo = (demoId: string) => {
    loadDemoProfile(demoId);
    setActiveTab('results');
  };

  const potentialMatchesCount = matchResults.filter(
    (m) => m.overallStatus === 'matches_known' || m.overallStatus === 'potential_match'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle background radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Evidence-Based Scholarship Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 font-['Space_Grotesk'] leading-[1.15]">
              Find Scholarships That Fit Your Future.
            </h1>

            {/* Supporting copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Discover scholarship opportunities that match your academic profile, understand what their funding covers, and plan your next steps with evidence-based AI assistance.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('find')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
              >
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Key trust indicators */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="text-lg font-bold text-white font-['Space_Grotesk']">Deterministic</div>
                <div className="text-xs text-slate-400">Rules evaluated by explicit logic, not AI hallucinations</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="text-lg font-bold text-white font-['Space_Grotesk']">Expense Audits</div>
                <div className="text-xs text-slate-400">Tuition, living, flights & visa analyzed item by item</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="text-lg font-bold text-white font-['Space_Grotesk']">Grounded AI</div>
                <div className="text-xs text-slate-400">Explanations strictly cite provider source records</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="text-lg font-bold text-white font-['Space_Grotesk']">Local Storage</div>
                <div className="text-xs text-slate-400">Profile stored in browser; AI calls sent only on request</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hackathon Demonstration Profiles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>One-Click Hackathon Test Profiles</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
                Experience Deterministic Matching in Action
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Click any profile below to immediately test how our matching engine processes strict criteria, failed boundaries, and missing data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEMO_PROFILES.map((p) => {
              const isMeets = p.id === 'profile-a-meets';
              const isFails = p.id === 'profile-b-fails';
              const borderClass = isMeets
                ? 'hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500'
                : isFails
                ? 'hover:border-rose-500 hover:ring-1 hover:ring-rose-500'
                : 'hover:border-amber-500 hover:ring-1 hover:ring-amber-500';

              const badgeClass = isMeets
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isFails
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <div
                  key={p.id}
                  className={`rounded-xl border border-slate-200 p-5 bg-slate-50/50 flex flex-col justify-between transition-all duration-150 ${borderClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {p.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {p.profile.grade} / {p.profile.gradeScale}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1">{p.name}</h3>
                    <p className="text-xs text-slate-600 font-medium mb-2.5">{p.tagline}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{p.description}</p>
                  </div>

                  <button
                    onClick={() => handleSelectDemo(p.id)}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Load & View Evaluation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            The Process
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            How Scholarship Navigator AI Works
          </p>
          <p className="text-sm text-slate-600 mt-2">
            A three-step evidence-based approach that protects students from deceptive marketing claims and unrealistic application plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-lg mb-5 font-['Space_Grotesk'] border border-blue-100">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Share Your Academic Profile & Needs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tell us your nationality, education level, exact grading scale (without forced conversions), English tests, and which expenses (tuition, stipend, flights, visa) you must have funded.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-lg mb-5 font-['Space_Grotesk'] border border-indigo-100">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Evaluate Known Eligibility & Funding
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our deterministic engine reviews each scholarship record. It classifies requirements as Meets, Fails, or Unknown/Needs Verification, and performs an expense-by-expense reality check.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 font-extrabold flex items-center justify-center text-lg mb-5 font-['Space_Grotesk'] border border-teal-100">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Compare Packages & Plan Your Roadmap
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare 2 to 3 scholarships side-by-side, ask grounded AI questions, review official provider links, and track mandatory application requirements step-by-step.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-slate-100/60 py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              Comprehensive Features
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              Engineered for Student Empowerment
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Not a directory of unverified links. An active decision-support system designed for real applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                Personalized Scholarship Matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic matching compares nationality, degree level, study fields, and grade minimums without guessing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                Truthful Eligibility Explanations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Missing facts and scale differences are explicitly flagged as requiring verification, never treated as met.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                Funding Reality Check
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Item-by-item breakdown of tuition, stipend, housing, flights, health insurance, and visa costs so surprise expenses never derail your journey.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <ListTodo className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                Personalized Application Roadmap
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-generates task checklists separating confirmed official mandatory requirements from general preparatory milestones.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                Scholarship Comparison Lab
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare 2 to 3 scholarships side-by-side with difference highlights, deadline watches, and AI trade-off analysis.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                Direct Official Source Links
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every scholarship record features verified direct URLs to official government, embassy, and university portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white border border-slate-700 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Our Verification & Transparency Commitment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] mb-4">
              Built on Principles of Responsible AI
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Unlike generic chatbots that guess deadlines or hallucinate eligibility rules, Scholarship Navigator AI adheres to strict boundaries:
            </p>

            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Preliminary Guidance:</strong> Eligibility outcomes reflect available evidence and are never presented as a guarantee of award or admission.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Official Provider Priority:</strong> Rules set by official scholarship authorities (FCDO, DAAD, USEFP, MEXT) always take precedence over software assessments.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Truthful Unknowns:</strong> When information is missing, ambiguous, or in an incompatible grading scale, we clearly mark it as requiring manual verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Evidence-Grounded AI:</strong> Server-side Gemini AI explanations are strictly constrained to factual records and cannot override deterministic matching outcomes.</span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('find')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
              >
                Start Your Evaluation Now
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              >
                Read Verification Methodology
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
