import React from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import { Compass, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useScholarship();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-lg font-['Space_Grotesk']">
                Scholarship Navigator AI
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              An evidence-grounded decision engine for international and domestic scholarship seekers.
              Combining deterministic rule evaluations, expense-by-expense funding reality checks, and truthful AI explanations.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in Official Provider Bulletins & Transparent Criteria</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Application Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('find')}
                  className="hover:text-blue-400 transition"
                >
                  Student Profile Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('results')}
                  className="hover:text-blue-400 transition"
                >
                  Scholarship Matches
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('funding')}
                  className="hover:text-blue-400 transition"
                >
                  Funding Reality Check
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('compare')}
                  className="hover:text-blue-400 transition"
                >
                  Scholarship Comparison Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="hover:text-blue-400 transition"
                >
                  Application Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-blue-400 transition"
                >
                  How It Works & Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="hover:text-blue-400 transition"
                >
                  Privacy & Data Safeguards
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-[11px] block mt-1">
                  Zero Login Required • Client Session Storage
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="border-t border-slate-800 pt-6 pb-4">
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">
              EDUCATIONAL ADVISORY DISCLAIMER:
            </span>
            Scholarship Navigator AI provides preliminary guidance based on the information available in its dataset.
            Scholarship requirements, deadlines, and funding can change. Always confirm eligibility, costs, deadlines,
            and application instructions with the official scholarship provider. The app does not guarantee eligibility,
            admission, funding, or an award.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4">
          <p>© {new Date().getFullYear()} Scholarship Navigator AI. Built for student empowerment.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            <span>Powered by Deterministic Rules & Server-Side Gemini AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
