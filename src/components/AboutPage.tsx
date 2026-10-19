import React from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  FileCode,
  Brain,
  Coins,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useScholarship();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Hero Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
          <BookOpen className="w-4 h-4" />
          <span>System Architecture & Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          How Scholarship Navigator AI Works
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          The engineering design, deterministic matching logic, and truthful AI integration powering your decisions.
        </p>
      </div>

      {/* The Problem */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
          1. The Problem with Generic Scholarship Directories
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Students seeking global opportunities—particularly students from Pakistan and emerging nations—encounter three pervasive obstacles:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">Superficial Match Lists</div>
            <p className="text-slate-600 leading-relaxed">
              Directories show hundreds of outdated links without verifying whether your degree, nationality, or work experience actually satisfies mandatory requirements.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">Unclear Funding Exclusions</div>
            <p className="text-slate-600 leading-relaxed">
              Scholarships marketed broadly as "fully funded" often exclude vital expenses such as specific pre-departure exams, non-covered visa surcharges, housing security deposits, or local fees.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">AI Hallucinations & Guesswork</div>
            <p className="text-slate-600 leading-relaxed">
              Unconstrained chatbots often invent non-existent deadlines, fabricate eligibility exceptions, or hallucinate acceptance probabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
          2. Our Two-Tier Architecture: Deterministic Logic + Grounded AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Scholarship Navigator AI separates computation into two distinct tiers:
        </p>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <FileCode className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Tier 1: Deterministic Rule-Based Engine
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Written entirely in strict TypeScript. Compares nationality eligibility lists, degree level constraints, minimum GPA thresholds, work experience hours, and mandatory conditions. If a mandatory condition is failed, the scholarship is marked <strong>Likely Ineligible</strong>. AI cannot override or mask this determination.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
            <Brain className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Tier 2: Server-Side Grounded AI (Gemini 3.8 Flash)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                When requested, server-side Gemini synthesizes a natural-language explanation. It receives only the structured scholarship record and the deterministic match result as context. It explains the evidence, highlights unconfirmed items, and recommends next steps without guessing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safe Grading Policy */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
          3. Safe Grading Scale Policy
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Universities across Pakistan, the UK, Europe, and North America use distinct evaluation methods. A 75% in a Pakistani annual system is not mathematically identical to a 3.0/4.0 CGPA, nor is a 2:1 UK honours degree identical to an arbitrary number.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Rather than converting grades with invented universal formulas, we mark incompatible scales as <strong>Unknown / Needs Verification</strong> and guide the student to official academic equivalency portals (such as UK ENIC, WES, or university admissions offices).
        </p>
      </div>

      {/* Dataset Limitations */}
      <div className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-700 space-y-3">
        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Transparency on Dataset Scope</span>
        </div>
        <p className="leading-relaxed">
          Scholarship Navigator AI does not claim to contain every scholarship worldwide. It currently features a curated catalog of high-impact government, embassy, and institutional scholarships (including Chevening, Fulbright, DAAD Helmut-Schmidt, Erasmus Mundus, Australia Awards, Turkiye Burslari, MEXT Japan, Commonwealth, SINGA, and HEC Overseas).
        </p>
        <p className="leading-relaxed">
          Lack of a result in our dataset never implies scholarships do not exist elsewhere. We provide direct links to official international education portals to empower continuous independent discovery.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('find')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-2"
        >
          <span>Try the Navigator with Your Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
