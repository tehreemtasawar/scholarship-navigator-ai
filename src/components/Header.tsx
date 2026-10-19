import React, { useState } from 'react';
import { useScholarship, AppTab } from '../context/ScholarshipContext';
import { DEMO_PROFILES } from '../data/demoProfiles';
import {
  GraduationCap,
  Compass,
  CheckCircle2,
  Sparkles,
  Menu,
  X,
  Layers,
  Scale,
  ListTodo,
  ShieldAlert,
  HelpCircle,
  Search,
  ExternalLink,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    compareIds,
    roadmapTasks,
    matchResults,
    activeDemoProfileId,
    loadDemoProfile,
  } = useScholarship();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const pendingTasksCount = roadmapTasks.filter((t) => t.status !== 'completed').length;
  const potentialMatchesCount = matchResults.filter(
    (m) => m.overallStatus === 'matches_known' || m.overallStatus === 'potential_match'
  ).length;

  const navItems: { tab: AppTab; label: string; badge?: number | string }[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'find', label: 'Profile' },
    { tab: 'results', label: 'Results', badge: potentialMatchesCount },
    { tab: 'funding', label: 'Funding Check' },
    { tab: 'roadmap', label: 'Roadmap', badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { tab: 'compare', label: 'Compare', badge: compareIds.length > 0 ? compareIds.length : undefined },
    { tab: 'about', label: 'How It Works' },
    { tab: 'privacy', label: 'Privacy' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1"
            aria-label="Go to home page"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5 font-['Space_Grotesk']">
                <span>Scholarship Navigator</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Truthful & Evidence-Grounded
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Demo Profile Selector for Hackathon Presentation */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
                aria-expanded={demoMenuOpen}
                aria-haspopup="true"
                id="demo-profile-dropdown-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Demo Profile:{' '}
                  <span className="text-blue-300 font-bold">
                    {activeDemoProfileId === 'profile-a-meets'
                      ? 'A (Meets)'
                      : activeDemoProfileId === 'profile-b-fails'
                      ? 'B (Fails)'
                      : activeDemoProfileId === 'profile-c-missing'
                      ? 'C (Uncertain)'
                      : 'Custom'}
                  </span>
                </span>
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                >
                  <div className="px-3 py-1.5 border-b border-slate-700/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Hackathon Test Profiles
                  </div>
                  {DEMO_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        loadDemoProfile(p.id);
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700/80 transition flex items-start gap-2.5"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          p.id === 'profile-a-meets'
                            ? 'bg-emerald-400'
                            : p.id === 'profile-b-fails'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-slate-200">{p.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{p.tagline}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-700/60 mt-1 pt-1">
                    <button
                      onClick={() => {
                        loadDemoProfile('blank');
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    >
                      Reset to blank profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('results')}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition"
            >
              View Results ({potentialMatchesCount})
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <div className="py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Select Test Profile:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  loadDemoProfile('profile-a-meets');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs rounded bg-emerald-950 text-emerald-300 border border-emerald-800"
              >
                Profile A
              </button>
              <button
                onClick={() => {
                  loadDemoProfile('profile-b-fails');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs rounded bg-rose-950 text-rose-300 border border-rose-800"
              >
                Profile B
              </button>
              <button
                onClick={() => {
                  loadDemoProfile('profile-c-missing');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs rounded bg-amber-950 text-amber-300 border border-amber-800"
              >
                Profile C
              </button>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === item.tab
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
