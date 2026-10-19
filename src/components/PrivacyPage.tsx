import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, AlertCircle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-200">
          <ShieldCheck className="w-4 h-4" />
          <span>User Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Privacy Policy & Data Use
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          How your information is processed, stored, and protected within Scholarship Navigator AI.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Account or Sign-In</h3>
          <p className="text-slate-600 leading-relaxed">
            You do not need to create an account, provide an email address, or set a password to use this application.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Sensitive Documents</h3>
          <p className="text-slate-600 leading-relaxed">
            We never ask for CNIC numbers, passport numbers, bank credentials, biometric data, or private academic certificates.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Server-Side Secret Isolation</h3>
          <p className="text-slate-600 leading-relaxed">
            Gemini API keys remain strictly confined to the backend server and are never accessible to client browser bundles.
          </p>
        </div>
      </div>

      {/* Detailed sections */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">1. What Information Is Collected</h3>
          <p className="leading-relaxed">
            The application collects only the academic and preference fields you enter in the profile form:
          </p>
          <ul className="list-disc pl-5 mt-1.5 space-y-1">
            <li>Academic profile: Nationality, education level, field of study, grade value and grading scale system.</li>
            <li>Test information: Optional language test type (e.g. IELTS or TOEFL) and reported numerical band score.</li>
            <li>Work experience: Stated number of years of professional, part-time, or internship experience.</li>
            <li>Study preferences: Selected destination countries, intake years, and expense priorities (tuition, living stipend, travel, insurance, visa fees).</li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">2. Where Your Data Is Stored (Local-First by Default)</h3>
          <p className="leading-relaxed">
            Your profile details and application roadmap tasks are stored entirely within your local web browser’s <strong>localStorage</strong>.
            All core navigator capabilities — including profile updates, deterministic matching calculation, rule-by-rule eligibility evaluations, funding gap audits, and manual roadmap checklists — run 100% client-side in your browser. No profile information is sent to our servers or saved in a remote database during these standard evaluations.
          </p>
          <p className="leading-relaxed mt-2 text-slate-500">
            You can permanently clear all local profile data and task checklists at any time by clicking <strong>Reset Profile</strong> or clearing your browser's site storage.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">3. When Data Is Sent to Backend & External AI Provider</h3>
          <p className="leading-relaxed">
            Limited profile parameters and scholarship data are transmitted outside your browser <strong>only when you explicitly trigger an AI-assisted action</strong>:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600">
            <li>
              <strong>AI Match Explanations (<code>/api/explain-match</code>):</strong> When you click <em>"Explain My Match With AI"</em>, only the profile fields used by the explanation prompt (nationality, education and intended degree, field, grade scale/value, language status, funding priorities, and work experience) plus the selected scholarship evidence and deterministic rule evaluation are sent to our backend proxy server, which forwards the validated prompt data to Google Gemini (<code>gemini-3.8-flash</code>). Your name, institution, documents, and credentials are not included.
            </li>
            <li>
              <strong>AI Scholarship Comparison (<code>/api/compare-scholarships</code>):</strong> When you click <em>"Run Grounded AI Comparison"</em>, only the comparison prompt’s profile fields (nationality, intended degree, field, grade, grading scale, and funding priorities) and curated records of the selected live scholarships are sent to our backend proxy server and Google Gemini. Personal names, institutions, documents, and credentials are not included.
            </li>
            <li>
              <strong>AI Scholarship Chat (<code>/api/chat-scholarship</code>):</strong> When you submit a question, the question text and the limited profile and scholarship context needed by the chat prompt are sent to our backend proxy server and Google Gemini. Do not include names, contact details, passport or identity numbers, documents, credentials, financial account information, or other sensitive personal information in your question.
            </li>
          </ul>
          <p className="leading-relaxed mt-2">
            No profile data is transmitted to AI services unless you manually click these specific AI generation buttons. The server rejects unexpected request fields and oversized chat questions, but this is not a substitute for avoiding sensitive information. No tracking cookies or advertising identifiers are included in these API requests.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">4. Third-Party Tracking</h3>
          <p className="leading-relaxed">
            Scholarship Navigator AI does not use third-party advertising networks, analytics tracking cookies, or tracking pixels.
          </p>
        </div>
      </div>

      {/* Formal Educational Advisory Disclaimer Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>Mandatory Educational Advisory Disclaimer</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Scholarship Navigator AI provides preliminary guidance based on the information available in its dataset.
          Scholarship requirements, deadlines, and funding can change. Always confirm eligibility, costs, deadlines,
          and application instructions with the official scholarship provider. The app does not guarantee eligibility,
          admission, funding, or an award.
        </p>
      </div>
    </div>
  );
};
