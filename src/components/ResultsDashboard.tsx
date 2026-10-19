import React, { useState, useMemo } from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import { MatchResult, OverallEligibilityStatus } from '../types/scholarship';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Coins,
  Calendar,
  ExternalLink,
  GitCompare,
  ListTodo,
  Sparkles,
  ArrowUpDown,
  Building,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const ResultsDashboard: React.FC = () => {
  const {
    profile,
    matchResults,
    viewScholarshipDetails,
    compareIds,
    toggleCompare,
    roadmapTasks,
    addScholarshipToRoadmap,
    setActiveTab,
  } = useScholarship();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deadlineFilter, setDeadlineFilter] = useState<string>('All');
  const [fundingFilter, setFundingFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'fit' | 'funding' | 'deadline' | 'verified'>('fit');

  // Stats calculations directly from actual evaluated results
  const totalEvaluated = matchResults.length;
  const matchesKnownCount = matchResults.filter((m) => m.overallStatus === 'matches_known').length;
  const potentialCount = matchResults.filter((m) => m.overallStatus === 'potential_match').length;
  const ineligibleCount = matchResults.filter((m) => m.overallStatus === 'likely_ineligible').length;
  const verifiedOfficialCount = matchResults.filter((m) => m.scholarship.verificationStatus === 'verified_official').length;
  const unconfirmedCount = matchResults.filter((m) => m.scholarship.verificationStatus === 'needs_verification').length;
  const openDeadlinesCount = matchResults.filter((m) => m.scholarship.deadlineStatus === 'open').length;
  const closedDeadlinesCount = matchResults.filter((m) => m.scholarship.deadlineStatus === 'closed').length;
  const fundingMatchesCount = matchResults.filter(
    (m) => m.fundingAssessment === 'meets_needs' || m.fundingAssessment === 'partially_meets'
  ).length;

  // Unique destinations for filter dropdown
  const destinations = useMemo(() => {
    const set = new Set<string>();
    matchResults.forEach((m) => set.add(m.scholarship.destinationCountry));
    return ['All', ...Array.from(set)];
  }, [matchResults]);

  // Filtered & sorted results
  const filteredResults = useMemo(() => {
    return matchResults
      .filter((m) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = m.scholarship.name.toLowerCase().includes(q);
          const matchProvider = m.scholarship.provider.toLowerCase().includes(q);
          const matchCountry = m.scholarship.destinationCountry.toLowerCase().includes(q);
          const matchFields = m.scholarship.eligibleFields.some((f) => f.toLowerCase().includes(q));
          if (!matchName && !matchProvider && !matchCountry && !matchFields) return false;
        }

        // Destination
        if (destinationFilter !== 'All' && m.scholarship.destinationCountry !== destinationFilter) {
          return false;
        }

        // Degree
        if (degreeFilter !== 'All') {
          if (!m.scholarship.eligibleDegrees.includes(degreeFilter as any)) {
            return false;
          }
        }

        // Eligibility Status
        if (statusFilter !== 'All' && m.overallStatus !== statusFilter) {
          return false;
        }

        // Deadline Status
        if (deadlineFilter !== 'All' && m.scholarship.deadlineStatus !== deadlineFilter) {
          return false;
        }

        // Funding Type
        if (fundingFilter !== 'All' && m.scholarship.fundingType !== fundingFilter) {
          return false;
        }

        // Verification Status
        if (verificationFilter !== 'All' && m.scholarship.verificationStatus !== verificationFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fit') {
          // Highest fit score first, but keep likely ineligible at bottom
          if (a.overallStatus === 'likely_ineligible' && b.overallStatus !== 'likely_ineligible') return 1;
          if (b.overallStatus === 'likely_ineligible' && a.overallStatus !== 'likely_ineligible') return -1;
          return b.fitScore - a.fitScore;
        }
        if (sortBy === 'funding') {
          const rank = {
            meets_needs: 4,
            partially_meets: 3,
            unknown: 2,
            does_not_meet_mandatory: 1,
          };
          return rank[b.fundingAssessment] - rank[a.fundingAssessment];
        }
        if (sortBy === 'deadline') {
          if (!a.scholarship.applicationDeadline) return 1;
          if (!b.scholarship.applicationDeadline) return -1;
          return a.scholarship.applicationDeadline.localeCompare(b.scholarship.applicationDeadline);
        }
        if (sortBy === 'verified') {
          return b.scholarship.lastChecked.localeCompare(a.scholarship.lastChecked);
        }
        return 0;
      });
  }, [
    matchResults,
    searchTerm,
    destinationFilter,
    degreeFilter,
    statusFilter,
    deadlineFilter,
    fundingFilter,
    verificationFilter,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setDestinationFilter('All');
    setDegreeFilter('All');
    setStatusFilter('All');
    setDeadlineFilter('All');
    setFundingFilter('All');
    setVerificationFilter('All');
    setSortBy('fit');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <span>Evaluated against profile of {profile.fullName || profile.nationality}</span>
            <span>•</span>
            <span>{profile.grade} ({profile.gradeScale})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            Personalized Scholarship Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explicit deterministic rules evaluated before AI assistance. Failed criteria are never masked.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('find')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition self-start md:self-auto"
        >
          Edit Profile Criteria
        </button>
      </div>

      {/* Summary Statistics Bar (derived from real results) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Catalogue</div>
          <div className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk'] mt-1">
            {totalEvaluated}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            <span className="font-semibold text-emerald-700">{verifiedOfficialCount} verified</span>
            {unconfirmedCount > 0 && <span className="text-slate-400"> • {unconfirmedCount} need audit</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Matches Known</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 font-['Space_Grotesk'] mt-1">
            {matchesKnownCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Known rules satisfied</div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-800 font-semibold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Needs Verification</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 font-['Space_Grotesk'] mt-1">
            {potentialCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Unconfirmed/scale check</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-300 shadow-xs">
          <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Now</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 font-['Space_Grotesk'] mt-1">
            {openDeadlinesCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Currently accepting</div>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 shadow-xs">
          <div className="text-xs text-rose-800 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Closed (Planning)</span>
          </div>
          <div className="text-2xl font-extrabold text-rose-900 font-['Space_Grotesk'] mt-1">
            {closedDeadlinesCount}
          </div>
          <div className="text-[11px] text-rose-700 mt-0.5">Future cycle reference</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-300 shadow-xs">
          <div className="text-xs text-slate-700 font-semibold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Likely Ineligible</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 font-['Space_Grotesk'] mt-1">
            {ineligibleCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Failed mandatory criteria</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scholarship name, provider, country, or study discipline..."
              className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-800 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="fit">Best Profile Fit</option>
              <option value="funding">Funding Suitability</option>
              <option value="deadline">Earliest Confirmed Deadline</option>
              <option value="verified">Recently Verified</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Destination
            </label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 bg-slate-50 focus:bg-white"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Eligibility Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 bg-slate-50 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="matches_known">Matches Known</option>
              <option value="potential_match">Needs Verification</option>
              <option value="likely_ineligible">Likely Ineligible</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Deadline Status
            </label>
            <select
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 bg-slate-50 focus:bg-white font-medium"
            >
              <option value="All">All Deadlines</option>
              <option value="open">Open Now</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed (Future Planning)</option>
              <option value="unconfirmed">Unconfirmed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Degree Level
            </label>
            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 bg-slate-50 focus:bg-white"
            >
              <option value="All">All Degrees</option>
              <option value="master">Master’s</option>
              <option value="phd">PhD</option>
              <option value="bachelor">Bachelor’s</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Funding Type
            </label>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 bg-slate-50 focus:bg-white"
            >
              <option value="All">All Funding</option>
              <option value="Fully Funded">Fully Funded</option>
              <option value="Tuition + Stipend">Tuition + Stipend</option>
              <option value="Partial / Grant">Partial / Grant</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetAllFilters}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results List or Empty State */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
            No matching opportunities found in current dataset
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            This does not mean scholarships do not exist in the real world. Our verified dataset currently covers prominent international fellowships. Try broadening your destination criteria or adjusting strict funding filters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-500 transition"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setActiveTab('find')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Update Student Profile
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-left text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700">Official databases to explore further:</p>
            <p>• DAAD Germany Scholarship Database (daad.de/deutschland/stipendium)</p>
            <p>• British Council Study UK Database (study-uk.britishcouncil.org)</p>
            <p>• USEFP / EducationUSA Pakistan (usefp.org)</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium px-1">
            Displaying {filteredResults.length} scholarship record(s) matching your criteria:
          </div>

          {filteredResults.map((result) => {
            const { scholarship, overallStatus, statusLabel, statusSummary, fitScore, fundingAssessment, fundingAssessmentSummary } = result;
            const isCompared = compareIds.includes(scholarship.id);
            const isInRoadmap = roadmapTasks.some((t) => t.scholarshipId === scholarship.id);

            // Badges styling (never relying on color alone, icons provided)
            let statusBadge = {
              bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
              label: 'Matches Known Requirements',
            };

            if (overallStatus === 'potential_match') {
              statusBadge = {
                bg: 'bg-amber-50 text-amber-800 border-amber-300',
                icon: <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />,
                label: 'Potential Match — Verify Remaining Criteria',
              };
            } else if (overallStatus === 'likely_ineligible') {
              statusBadge = {
                bg: 'bg-rose-50 text-rose-800 border-rose-300',
                icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
                label: 'Likely Ineligible based on Available Data',
              };
            }

            return (
              <div
                key={scholarship.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 sm:p-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Eligibility Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${statusBadge.bg}`}
                      >
                        {statusBadge.icon}
                        <span>{statusBadge.label}</span>
                      </span>

                      {/* Deadline Status Badge */}
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
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
                            ? scholarship.applicationDeadline
                              ? `OPEN (Deadline: ${scholarship.applicationDeadline})`
                              : 'OPEN (Deadline not published)'
                            : scholarship.deadlineStatus === 'closed'
                            ? (scholarship.applicationDeadline
                                ? (scholarship.applicationDeadline.toLowerCase().includes('closed')
                                    ? `CLOSED (${scholarship.applicationDeadline})`
                                    : `CLOSED (Ended: ${scholarship.applicationDeadline})`)
                                : 'CLOSED')
                            : scholarship.deadlineStatus === 'upcoming'
                            ? `UPCOMING (Opens: ${scholarship.applicationOpeningDate || 'soon'})`
                            : 'UNCONFIRMED / Rolling'}
                        </span>
                      </span>

                      {/* Verification Status Badge */}
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          scholarship.verificationStatus === 'verified_official'
                            ? 'bg-teal-50 text-teal-800 border-teal-300'
                            : scholarship.verificationStatus === 'demo_data'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {scholarship.verificationStatus === 'verified_official'
                          ? 'Verified from Official Source'
                          : scholarship.verificationStatus === 'demo_data'
                          ? 'Demonstration Test Fixture'
                          : 'Needs Verification'}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Space_Grotesk'] hover:text-blue-600 cursor-pointer transition"
                      onClick={() => viewScholarshipDetails(scholarship.id)}
                    >
                      {scholarship.name}
                    </h2>
                    <p className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{scholarship.provider}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800">{scholarship.destinationCountry}</span>
                      <span>•</span>
                      {scholarship.verificationStatus === 'verified_official' ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 ml-1" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 ml-1" />
                      )}
                      <span>Source:</span>
                      <a
                        href={scholarship.officialSourceUrl || scholarship.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        {scholarship.sourceTitle || 'Official Portal'}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-400">(Checked {scholarship.lastChecked})</span>
                    </p>
                  </div>

                  {/* Fit score badge & deadline status */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Profile & Preference Fit
                      </span>
                      <div className="text-xl font-extrabold text-blue-900 font-['Space_Grotesk']">
                        {fitScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </div>
                    </div>
                    {scholarship.applicationDeadline && (
                      <div className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${scholarship.deadlineStatus === 'closed' ? 'text-rose-600' : 'text-slate-600'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>
                          Deadline: {scholarship.applicationDeadline || 'Not published; confirm with provider'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Closed Cycle Notice Banner */}
                {scholarship.deadlineStatus === 'closed' && (
                  <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-2.5 mb-3 text-xs text-rose-900 flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Deadline Passed (Closed): </span>
                      {scholarship.deadlineNote || `Applications for this cycle closed on ${scholarship.applicationDeadline}.`}
                      <span className="block text-[11px] text-rose-700 mt-0.5 font-normal">
                        Retained in results for future cycle research and early preparation.
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {scholarship.shortDescription}
                </p>

                {/* Funding breakdown preview pills */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>Funding Coverage Reality Check:</span>
                    </span>
                    <span className="text-slate-700 font-semibold">{scholarship.fundingType}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded font-medium border ${
                        scholarship.fundingBreakdown.tuition.status === 'covered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : scholarship.fundingBreakdown.tuition.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : scholarship.fundingBreakdown.tuition.status === 'not_covered'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Tuition: {scholarship.fundingBreakdown.tuition.status.replace('_', ' ')}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-medium border ${
                        scholarship.fundingBreakdown.stipend.status === 'covered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : scholarship.fundingBreakdown.stipend.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : scholarship.fundingBreakdown.stipend.status === 'not_covered'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Stipend: {scholarship.fundingBreakdown.stipend.status.replace('_', ' ')}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-medium border ${
                        scholarship.fundingBreakdown.accommodation.status === 'covered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : scholarship.fundingBreakdown.accommodation.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : scholarship.fundingBreakdown.accommodation.status === 'not_covered'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Housing: {scholarship.fundingBreakdown.accommodation.status.replace('_', ' ')}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-medium border ${
                        scholarship.fundingBreakdown.travel.status === 'covered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : scholarship.fundingBreakdown.travel.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : scholarship.fundingBreakdown.travel.status === 'not_covered'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Flights: {scholarship.fundingBreakdown.travel.status.replace('_', ' ')}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-medium border ${
                        scholarship.fundingBreakdown.healthInsurance.status === 'covered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : scholarship.fundingBreakdown.healthInsurance.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : scholarship.fundingBreakdown.healthInsurance.status === 'not_covered'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Health: {scholarship.fundingBreakdown.healthInsurance.status.replace('_', ' ')}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-medium border ${
                        scholarship.fundingBreakdown.visaFees.status === 'covered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : scholarship.fundingBreakdown.visaFees.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : scholarship.fundingBreakdown.visaFees.status === 'not_covered'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Visa: {scholarship.fundingBreakdown.visaFees.status.replace('_', ' ')}
                    </span>
                  </div>

                  {profile.fundingPriorities?.visaFees === 'must' && scholarship.fundingBreakdown.visaFees.status !== 'covered' && (
                    <div className="mt-2.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Mandatory Visa Funding Gap: </span>
                        {scholarship.fundingBreakdown.visaFees.status === 'not_covered'
                          ? 'Visa fees are marked as a non-negotiable need for you, but are NOT covered by this scholarship. You must budget personal funds for embassy visa fees.'
                          : scholarship.fundingBreakdown.visaFees.status === 'partial'
                          ? `Visa fees are mandatory for you, but only partially covered (${scholarship.fundingBreakdown.visaFees.amountOrDetail}).`
                          : 'Visa fees are mandatory for you, but coverage details remain unconfirmed from official sources.'}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    Assessment: {fundingAssessmentSummary}
                  </p>
                </div>

                {/* Important failed or unconfirmed notice if applicable */}
                {overallStatus === 'likely_ineligible' && (
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 mb-4 text-xs text-rose-800 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Failed Mandatory Criterion: </span>
                      {result.evaluations
                        .filter((e) => e.isMandatory && e.status === 'does_not_meet')
                        .map((e) => e.reason)
                        .join(' ')}
                    </div>
                  </div>
                )}

                {overallStatus === 'potential_match' && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Credential Verification Needed: </span>
                      {result.evaluations
                        .filter((e) => e.isMandatory && e.status === 'unknown')
                        .map((e) => e.reason)
                        .join(' ')}
                    </div>
                  </div>
                )}

                {/* Card Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => viewScholarshipDetails(scholarship.id)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span>View Full Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleCompare(scholarship.id)}
                      className={`px-3 py-2 rounded-xl font-semibold border transition flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'In Compare Lab (✓)' : 'Add to Compare'}</span>
                    </button>

                    <button
                      onClick={() => addScholarshipToRoadmap(scholarship)}
                      className={`px-3 py-2 rounded-xl font-semibold border transition flex items-center gap-1.5 ${
                        isInRoadmap
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <ListTodo className="w-3.5 h-3.5" />
                      <span>{isInRoadmap ? 'In Roadmap (✓)' : 'Add to Roadmap'}</span>
                    </button>
                  </div>

                  <a
                    href={scholarship.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
