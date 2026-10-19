import React from 'react';
import { ScholarshipProvider, useScholarship } from './context/ScholarshipContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProfileForm } from './components/ProfileForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ScholarshipDetails } from './components/ScholarshipDetails';
import { FundingRealityCheck } from './components/FundingRealityCheck';
import { ComparisonLab } from './components/ComparisonLab';
import { ApplicationRoadmap } from './components/ApplicationRoadmap';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { GitCompare, ArrowRight, AlertCircle, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, compareIds, setActiveTab, compareNotification, clearCompareNotification } =
    useScholarship();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'find' && <ProfileForm />}
        {activeTab === 'results' && <ResultsDashboard />}
        {activeTab === 'details' && <ScholarshipDetails />}
        {activeTab === 'funding' && <FundingRealityCheck />}
        {activeTab === 'compare' && <ComparisonLab />}
        {activeTab === 'roadmap' && <ApplicationRoadmap />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'privacy' && <PrivacyPage />}
      </main>

      {/* Floating Compare Lab Bar if items are queued */}
      {compareIds.length > 0 && activeTab !== 'compare' && (
        <aside
          aria-label="Comparison dock"
          className="fixed bottom-5 right-5 z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700 p-3 sm:p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
            <GitCompare className="w-4 h-4" />
          </div>
          <div className="text-xs pr-2 hidden sm:block">
            <span className="font-bold">{compareIds.length} scholarship(s)</span> in Compare Lab
          </div>
          <button
            onClick={() => setActiveTab('compare')}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Accessible in-page comparison notification banner replacing window.alert */}
      {compareNotification && (
        <aside
          role="alert"
          aria-live="assertive"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-amber-500/60 p-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-amber-300">Comparison Limit Reached</p>
              <p className="text-slate-200 mt-1 leading-relaxed">{compareNotification}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('compare');
                    clearCompareNotification();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-xs"
                >
                  Open Compare Lab
                </button>
                <button
                  type="button"
                  onClick={clearCompareNotification}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={clearCompareNotification}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ScholarshipProvider>
      <MainContent />
    </ScholarshipProvider>
  );
}
