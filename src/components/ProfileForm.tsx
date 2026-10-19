import React, { useState } from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import { StudentProfile, PriorityLevel } from '../types/scholarship';
import { DEMO_PROFILES } from '../data/demoProfiles';
import {
  User,
  GraduationCap,
  Globe2,
  Coins,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Building,
  Calendar,
  Award,
  BookOpen,
} from 'lucide-react';

export const ProfileForm: React.FC = () => {
  const { profile, setProfile, setActiveTab, loadDemoProfile, resetProfile } = useScholarship();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Field change handler
  const handleChange = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Funding priority change handler
  const handlePriorityChange = (
    expenseKey: keyof StudentProfile['fundingPriorities'],
    level: PriorityLevel
  ) => {
    setProfile((prev) => ({
      ...prev,
      fundingPriorities: {
        ...prev.fundingPriorities,
        [expenseKey]: level,
      },
    }));
  };

  // Destination toggle handler
  const toggleDestination = (country: string) => {
    setProfile((prev) => {
      let current = [...prev.preferredDestinations];
      let updatedDestinations: string[];
      if (country === 'Any') {
        updatedDestinations = ['Any'];
      } else {
        current = current.filter((c) => c !== 'Any');
        if (current.includes(country)) {
          const next = current.filter((c) => c !== country);
          updatedDestinations = next.length === 0 ? ['Any'] : next;
        } else {
          updatedDestinations = [...current, country];
        }
      }
      return { ...prev, preferredDestinations: updatedDestinations };
    });
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.nationality.trim()) {
      newErrors.nationality = 'Nationality is required.';
    }

    if (!profile.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = 'Field of study is required.';
    }

    if (profile.grade === undefined || isNaN(profile.grade) || profile.grade < 0) {
      newErrors.grade = 'Please enter a valid grade / CGPA.';
    } else {
      if (profile.gradeScale === '4.0' && profile.grade > 4.0) {
        newErrors.grade = 'CGPA on a 4.0 scale cannot exceed 4.0.';
      } else if (profile.gradeScale === '5.0' && profile.grade > 5.0) {
        newErrors.grade = 'CGPA on a 5.0 scale cannot exceed 5.0.';
      } else if (profile.gradeScale === '10.0' && profile.grade > 10.0) {
        newErrors.grade = 'Grade on a 10.0 scale cannot exceed 10.0.';
      } else if (profile.gradeScale === 'percentage' && profile.grade > 100) {
        newErrors.grade = 'Percentage cannot exceed 100%.';
      }
    }

    if (
      profile.languageTest === 'ielts' &&
      profile.languageScore !== undefined &&
      (profile.languageScore < 0 || profile.languageScore > 9)
    ) {
      newErrors.languageScore = 'IELTS band score must be between 0.0 and 9.0.';
    }

    if (
      profile.languageTest === 'toefl' &&
      profile.languageScore !== undefined &&
      (profile.languageScore < 0 || profile.languageScore > 120)
    ) {
      newErrors.languageScore = 'TOEFL iBT score must be between 0 and 120.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setActiveTab('results');
    }
  };

  const countriesList = [
    'United Kingdom',
    'United States',
    'Germany',
    'Australia',
    'Turkey',
    'Japan',
    'Singapore',
    'European Union (Multiple Countries)',
  ];

  const fundingExpenseLabels: { key: keyof StudentProfile['fundingPriorities']; label: string; desc: string }[] = [
    { key: 'tuition', label: 'Tuition Fees', desc: 'Full or partial cost of university academic instruction' },
    { key: 'stipend', label: 'Living Stipend / Subsistence', desc: 'Monthly cash allowance for food, local transport & daily needs' },
    { key: 'accommodation', label: 'Accommodation', desc: 'University dorm halls or private flat rental assistance' },
    { key: 'travel', label: 'Airfare / Travel', desc: 'Economy round-trip flight from home country to destination' },
    { key: 'healthInsurance', label: 'Health Insurance', desc: 'National student health scheme or private medical policy (e.g. UK IHS)' },
    { key: 'visaFees', label: 'Visa & Permit Costs', desc: 'Embassy application and residence permit processing expenses' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Title & Demo Helpers */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              Student Profile & Study Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide your academic credentials and financial requirements for deterministic matching.
            </p>
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">Quick Fill:</span>
            {DEMO_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadDemoProfile(p.id)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                title={p.description}
              >
                {p.badge.replace(' Criteria', '').replace(' Remaining Requirements', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`py-2 px-3 rounded-lg text-xs font-bold text-center border transition ${
              activeStep === 1
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            1. Academic Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`py-2 px-3 rounded-lg text-xs font-bold text-center border transition ${
              activeStep === 2
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            2. Study Preferences
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`py-2 px-3 rounded-lg text-xs font-bold text-center border transition ${
              activeStep === 3
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            3. Funding Needs
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`py-2 px-3 rounded-lg text-xs font-bold text-center border transition ${
              activeStep === 4
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            4. Review & Search
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* STEP 1: Academic & Personal Profile */}
        {activeStep === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Section A: Academic & Personal Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate information ensures deterministic eligibility tests reflect genuine scholarship criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Optional Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={profile.fullName || ''}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Amina Khan"
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Nationality */}
              <div>
                <label htmlFor="nationality" className="block text-xs font-bold text-slate-700 mb-1">
                  Nationality <span className="text-rose-500">*</span>
                </label>
                <select
                  id="nationality"
                  value={profile.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Turkey">Turkey</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other / International</option>
                </select>
                {errors.nationality && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.nationality}
                  </p>
                )}
              </div>

              {/* Residence */}
              <div>
                <label htmlFor="residenceCountry" className="block text-xs font-bold text-slate-700 mb-1">
                  Current Country of Residence <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="residenceCountry"
                  value={profile.residenceCountry || ''}
                  onChange={(e) => handleChange('residenceCountry', e.target.value)}
                  placeholder="e.g. Pakistan"
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Current Education Level */}
              <div>
                <label htmlFor="currentEducationLevel" className="block text-xs font-bold text-slate-700 mb-1">
                  Current or Most Recent Education Level <span className="text-rose-500">*</span>
                </label>
                <select
                  id="currentEducationLevel"
                  value={profile.currentEducationLevel}
                  onChange={(e) =>
                    handleChange('currentEducationLevel', e.target.value as StudentProfile['currentEducationLevel'])
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="bachelor_completed">Bachelor’s Degree Completed (4-Year / 16 Years)</option>
                  <option value="bachelor_in_progress">Bachelor’s Degree In Progress (Final Year)</option>
                  <option value="master_completed">Master’s / MPhil Completed (18 Years)</option>
                  <option value="master_in_progress">Master’s In Progress</option>
                  <option value="high_school">High School / A-Levels / Intermediate</option>
                  <option value="other">Other Diploma</option>
                </select>
              </div>

              {/* Current Program */}
              <div>
                <label htmlFor="currentDegreeProgram" className="block text-xs font-bold text-slate-700 mb-1">
                  Current / Completed Degree Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="currentDegreeProgram"
                  value={profile.currentDegreeProgram || ''}
                  onChange={(e) => handleChange('currentDegreeProgram', e.target.value)}
                  placeholder="e.g. BS Computer Science, BE Mechanical"
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Intended Next Degree */}
              <div>
                <label htmlFor="intendedDegree" className="block text-xs font-bold text-slate-700 mb-1">
                  Intended Next Degree Level <span className="text-rose-500">*</span>
                </label>
                <select
                  id="intendedDegree"
                  value={profile.intendedDegree}
                  onChange={(e) =>
                    handleChange('intendedDegree', e.target.value as StudentProfile['intendedDegree'])
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="master">Master’s Degree (MSc / MA / MPhil)</option>
                  <option value="phd">PhD / Doctoral Research</option>
                  <option value="bachelor">Bachelor’s Undergraduate</option>
                  <option value="postdoc">Postdoctoral Fellowship</option>
                </select>
              </div>

              {/* Field of Study */}
              <div>
                <label htmlFor="fieldOfStudy" className="block text-xs font-bold text-slate-700 mb-1">
                  Field of Study <span className="text-rose-500">*</span>
                </label>
                <select
                  id="fieldOfStudy"
                  value={profile.fieldOfStudy}
                  onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Computer Science & AI">Computer Science, Software & AI</option>
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Public Policy">Public Policy, Governance & Law</option>
                  <option value="Natural Sciences">Natural Sciences & Mathematics</option>
                  <option value="Medicine & Health">Public Health & Allied Medical</option>
                  <option value="Business & Economics">Business, Finance & Economics</option>
                  <option value="Social Sciences & Humanities">Social Sciences & Humanities</option>
                  <option value="Agriculture & Environment">Agriculture, Climate & Environment</option>
                </select>
                {errors.fieldOfStudy && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fieldOfStudy}
                  </p>
                )}
              </div>

              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-xs font-bold text-slate-700 mb-1">
                  Subfield / Specialization <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="specialization"
                  value={profile.specialization || ''}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  placeholder="e.g. Machine Learning, Renewable Energy"
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Grade Scale */}
              <div>
                <label htmlFor="gradeScale" className="block text-xs font-bold text-slate-700 mb-1">
                  Grading Scale System <span className="text-rose-500">*</span>
                </label>
                <select
                  id="gradeScale"
                  value={profile.gradeScale}
                  onChange={(e) =>
                    handleChange('gradeScale', e.target.value as StudentProfile['gradeScale'])
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="4.0">4.0 CGPA Scale (Standard Semester)</option>
                  <option value="5.0">5.0 Scale</option>
                  <option value="10.0">10.0 Scale</option>
                  <option value="percentage">Percentage Scale (%) (Annual System)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Safe rule: Scales are preserved as entered without inventing arbitrary conversion formulas.
                </p>
              </div>

              {/* Grade / CGPA */}
              <div>
                <label htmlFor="grade" className="block text-xs font-bold text-slate-700 mb-1">
                  Current / Latest Grade Value <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="grade"
                  value={isNaN(profile.grade) ? '' : profile.grade}
                  onChange={(e) => handleChange('grade', parseFloat(e.target.value) || 0)}
                  placeholder={profile.gradeScale === 'percentage' ? 'e.g. 78' : 'e.g. 3.65'}
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.grade && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.grade}
                  </p>
                )}
              </div>

              {/* Work Experience */}
              <div>
                <label htmlFor="workExperienceYears" className="block text-xs font-bold text-slate-700 mb-1">
                  Work Experience (Full-time / Part-time / Internships)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    id="workExperienceYears"
                    value={profile.workExperienceYears ?? 0}
                    onChange={(e) => handleChange('workExperienceYears', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <span className="text-xs text-slate-500 font-medium">years</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  E.g. Chevening requires min 2 years (2,800 hrs); Australia Awards requires 2 years.
                </p>
              </div>

              {/* English Test */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  English Language Test Status <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (profile.languageTest === 'not_taken' || profile.languageTest === 'none_planned') {
                        setProfile((prev) => ({ ...prev, languageTest: 'ielts', languageScore: prev.languageScore ?? 6.5 }));
                      }
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition ${
                      profile.languageTest !== 'not_taken' && profile.languageTest !== 'none_planned'
                        ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">Test Taken</div>
                    <div className="text-[10px] text-slate-500 font-normal">Have official IELTS / TOEFL / PTE score</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfile((prev) => ({ ...prev, languageTest: 'not_taken', languageScore: undefined }));
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.languageScore;
                        return n;
                      });
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition ${
                      profile.languageTest === 'not_taken'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">Not Taken Yet</div>
                    <div className="text-[10px] text-slate-500 font-normal">Planning to take test in future</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfile((prev) => ({ ...prev, languageTest: 'none_planned', languageScore: undefined }));
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.languageScore;
                        return n;
                      });
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition ${
                      profile.languageTest === 'none_planned'
                        ? 'bg-slate-200 border-slate-400 text-slate-900 ring-2 ring-slate-500/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">No Test Planned</div>
                    <div className="text-[10px] text-slate-500 font-normal">Seeking waiver or exempt university</div>
                  </button>
                </div>

                {/* Ask test type and score only when applicable */}
                {profile.languageTest !== 'not_taken' && profile.languageTest !== 'none_planned' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label htmlFor="languageTest" className="block text-[11px] font-bold text-slate-700 mb-1">
                        Test Type
                      </label>
                      <select
                        id="languageTest"
                        value={profile.languageTest}
                        onChange={(e) =>
                          handleChange('languageTest', e.target.value as StudentProfile['languageTest'])
                        }
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="ielts">IELTS Academic</option>
                        <option value="toefl">TOEFL iBT</option>
                        <option value="pte">PTE Academic</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="languageScore" className="block text-[11px] font-bold text-slate-700 mb-1">
                        {profile.languageTest === 'ielts'
                          ? 'IELTS Overall Band (e.g. 7.0)'
                          : profile.languageTest === 'toefl'
                          ? 'TOEFL iBT Score (0 - 120)'
                          : 'PTE Academic Score (10 - 90)'}
                      </label>
                      <input
                        type="number"
                        step={profile.languageTest === 'ielts' ? '0.5' : '1'}
                        id="languageScore"
                        value={profile.languageScore ?? ''}
                        onChange={(e) =>
                          handleChange(
                            'languageScore',
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        placeholder={
                          profile.languageTest === 'ielts'
                            ? 'e.g. 7.0'
                            : profile.languageTest === 'toefl'
                            ? 'e.g. 100'
                            : 'e.g. 68'
                        }
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      {errors.languageScore && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.languageScore}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>No score applied:</strong> Because you selected "{profile.languageTest === 'none_planned' ? 'No test planned' : 'Not taken yet'}", no language score is assumed or silently evaluated. Language requirements for international scholarships will be evaluated as <em>Unverified / Verification Required</em> in match results.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>Continue to Study Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Study Preferences */}
        {activeStep === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-indigo-600" />
                <span>Section B: Study Preferences & Destination</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Preferences guide matching fit without hiding otherwise eligible scholarships in other countries.
              </p>
            </div>

            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Preferred Destination Countries (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleDestination('Any')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    profile.preferredDestinations.includes('Any')
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  🌍 Any Country (Global Search)
                </button>
                {countriesList.map((country) => {
                  const isSelected = profile.preferredDestinations.includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleDestination(country)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Funding Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                General Funding Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'fully_funded', title: 'Fully Funded Opportunities', desc: 'Tuition + substantial living stipend + travel' },
                  { id: 'substantial_partial', title: 'Substantial or Partial Funding', desc: 'Significant grant or partial living contribution' },
                  { id: 'tuition_only', title: 'Tuition-Only Waivers', desc: 'University fees covered; self-funded living' },
                  { id: 'any', title: 'Any Funding Level', desc: 'Show all matching financial packages' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      profile.fundingPreference === item.id
                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fundingPreference"
                      value={item.id}
                      checked={profile.fundingPreference === item.id}
                      onChange={() =>
                        handleChange('fundingPreference', item.id as StudentProfile['fundingPreference'])
                      }
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Intake Year */}
            <div className="max-w-xs">
              <label htmlFor="preferredIntakeYear" className="block text-xs font-bold text-slate-700 mb-1">
                Target Intake Academic Year
              </label>
              <select
                id="preferredIntakeYear"
                value={profile.preferredIntakeYear ?? 2026}
                onChange={(e) => handleChange('preferredIntakeYear', parseInt(e.target.value, 10))}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value={2026}>2026 / 2027 (Upcoming Cycle)</option>
                <option value={2027}>2027 / 2028 (Future Planning)</option>
                <option value={2025}>2025 / 2026</option>
              </select>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Back to Academic Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>Continue to Funding Needs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Funding Needs (Expense-by-Expense Reality Check) */}
        {activeStep === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <span>Section C: Funding Reality Check — Expense Priorities</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Indicate which expenses must be covered for an award to be financially viable. We will audit every scholarship against your answers.
              </p>
            </div>

            <div className="space-y-4">
              {fundingExpenseLabels.map((exp) => {
                const currentPriority = profile.fundingPriorities[exp.key];
                return (
                  <div
                    key={exp.key}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{exp.label}</div>
                      <div className="text-[11px] text-slate-500">{exp.desc}</div>
                    </div>

                    {/* 3-way toggle */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePriorityChange(exp.key, 'must')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                          currentPriority === 'must'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Must be covered
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePriorityChange(exp.key, 'preferred')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                          currentPriority === 'preferred'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Preferably covered
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePriorityChange(exp.key, 'not_priority')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                          currentPriority === 'not_priority'
                            ? 'bg-slate-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Not a priority
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Truthful Coverage Principle:</strong> Marking an expense as "Must be covered" will explicitly warn you if a scholarship excludes it (e.g. UK Health Surcharge in Chevening or visa processing fees in Türkiye Bursları).
              </span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Back to Preferences
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>Continue to Profile Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Profile & Submit */}
        {activeStep === 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Section D: Profile Summary & Final Verification</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review your stated academic background and funding priorities before running deterministic matching.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Profile</span>
              </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Academic Credentials
                </span>
                <div className="font-bold text-slate-900 text-sm">{profile.nationality}</div>
                <div className="text-slate-600 mt-1">
                  Level: <span className="font-medium text-slate-800">{profile.currentEducationLevel.replace('_', ' ')}</span>
                </div>
                <div className="text-slate-600">
                  Target: <span className="font-semibold text-blue-700">{profile.intendedDegree.toUpperCase()}</span>
                </div>
                <div className="text-slate-600">
                  Field: <span className="font-medium text-slate-800">{profile.fieldOfStudy}</span>
                </div>
                <div className="text-slate-600 mt-2 font-mono font-bold text-blue-900">
                  Grade: {profile.grade} ({profile.gradeScale} scale)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Language & Experience
                </span>
                <div className="text-slate-700">
                  Test:{' '}
                  <span className="font-bold text-slate-900">
                    {profile.languageTest === 'not_taken'
                      ? 'Not taken yet'
                      : profile.languageTest.toUpperCase()}
                  </span>
                </div>
                {profile.languageScore && (
                  <div className="text-slate-700 font-bold text-emerald-700">
                    Score: {profile.languageScore}
                  </div>
                )}
                <div className="text-slate-700 mt-2">
                  Experience: <span className="font-bold text-slate-900">{profile.workExperienceYears ?? 0} year(s)</span>
                </div>
                <div className="text-slate-700">
                  Intake: <span className="font-medium">{profile.preferredIntakeYear ?? 2026}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Stated Must-Cover Expenses
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(profile.fundingPriorities)
                    .filter(([_, level]) => level === 'must')
                    .map(([key]) => (
                      <span
                        key={key}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200"
                      >
                        {key.toUpperCase()}
                      </span>
                    ))}
                </div>
                <div className="text-[11px] text-slate-500 mt-3">
                  Preferred destinations:{' '}
                  <span className="font-medium text-slate-800">
                    {profile.preferredDestinations.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Validation errors if any */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800">
                <p className="font-bold mb-1">Please correct the following fields:</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  {Object.values(errors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Back to Funding Needs
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
              >
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Reset Student Profile?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              This will clear all entered academic details and return fields to blank defaults. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProfile();
                  setConfirmResetOpen(false);
                  setActiveStep(1);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-xs transition"
              >
                Yes, Reset Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
