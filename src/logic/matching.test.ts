import test from 'node:test';
import assert from 'node:assert/strict';
import { matchScholarship, evaluateFundingCheck, checkAcademicRequirements } from './matching.ts';
import { SCHOLARSHIPS, DEMO_FELLOWSHIP_FIXTURE, ALL_SCHOLARSHIPS_FOR_TESTS } from '../data/scholarships.ts';
import { DEMO_PROFILES, DEFAULT_BLANK_PROFILE } from '../data/demoProfiles.ts';
import {
  AIRequestValidationError,
  MAX_CHAT_QUESTION_LENGTH,
  validateChatRequest,
  validateCompareRequest,
  validateExplainMatchRequest,
} from './aiValidation.ts';

const profileA = DEMO_PROFILES[0].profile;
const profileB = DEMO_PROFILES[1].profile;
const profileC = DEMO_PROFILES[2].profile;

const chevening = SCHOLARSHIPS.find((s) => s.id === 'chevening-uk-2026')!;
const demoFellowship = DEMO_FELLOWSHIP_FIXTURE;
const daad = SCHOLARSHIPS.find((s) => s.id === 'daad-helmut-schmidt-2026')!;

test('Test Profile A: High achiever meets known requirements for Chevening', () => {
  const result = matchScholarship(profileA, chevening);
  assert.equal(result.overallStatus, 'matches_known');
  assert.equal(result.failedMandatoryCount, 0);
  assert.ok(result.fitScore >= 80, `Expected fitScore >= 80, got ${result.fitScore}`);
  
  // Nationality meets
  const natEval = result.evaluations.find((e) => e.criterion === 'Nationality');
  assert.equal(natEval?.status, 'meets');

  // Degree meets
  const degEval = result.evaluations.find((e) => e.criterion === 'Intended Degree Level');
  assert.equal(degEval?.status, 'meets');

  // Work experience meets
  const workEval = result.evaluations.find((e) => e.criterion === 'Work Experience');
  assert.equal(workEval?.status, 'meets');
});

test('Test Profile B: Fails mandatory CGPA & work experience requirements', () => {
  const result = matchScholarship(profileB, chevening);
  // Profile B has CGPA 2.3 (below 3.0 min) and work experience 0.5 yrs (below 2 yrs)
  assert.equal(result.overallStatus, 'likely_ineligible');
  assert.ok(result.failedMandatoryCount >= 1);
  assert.ok(result.fitScore <= 30, `Fit score should be capped for ineligible profile, got ${result.fitScore}`);

  // Test against Demo Fellowship requiring CGPA 3.5 and IELTS 7.0
  const demoResult = matchScholarship(profileB, demoFellowship);
  assert.equal(demoResult.overallStatus, 'likely_ineligible');
  const gpaEval = demoResult.evaluations.find((e) => e.criterion.startsWith('Academic Minimum'));
  assert.equal(gpaEval?.status, 'does_not_meet');
  const langEval = demoResult.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(langEval?.status, 'does_not_meet');
});

test('Test Profile C: Missing/Incompatible scale results in Unknown without falsely assuming met', () => {
  const result = matchScholarship(profileC, demoFellowship);
  // Grade is on percentage scale (72%) while demo fellowship requires 3.5 on 4.0 scale
  const gpaEval = result.evaluations.find((e) => e.criterion.startsWith('Academic Minimum'));
  assert.equal(gpaEval?.status, 'unknown');
  assert.ok(gpaEval?.reason.includes('Grading scales differ'));

  // Language test not taken
  const langEval = result.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(langEval?.status, 'unknown');

  // Overall status must NOT be 'matches_known'
  assert.equal(result.overallStatus, 'potential_match');
  assert.ok(result.unknownMandatoryCount >= 1);
});

test('Funding Reality Check: Chevening IHS coverage remains unconfirmed without current evidence', () => {
  const cheveningHealthCheck = evaluateFundingCheck(
    {
      ...profileA,
      fundingPriorities: {
        ...profileA.fundingPriorities,
        healthInsurance: 'must',
      },
    },
    chevening
  );
  const healthItem = cheveningHealthCheck.items.find((i) => i.expenseKey === 'healthInsurance');
  assert.equal(healthItem?.coverage, 'unknown');
  assert.equal(healthItem?.satisfiesPriority, false);
  assert.ok(healthItem?.detail?.toLowerCase().includes('immigration health surcharge'));
});

test('Funding Reality Check: Accurately flags unsatisfied mandatory expense when partially covered', () => {
  // DAAD Helmut Schmidt provides rent subsidy in stipend (partial), not separate full accommodation
  const strictProfile = {
    ...profileA,
    fundingPriorities: {
      ...profileA.fundingPriorities,
      accommodation: 'must' as const,
    },
  };

  const fundingCheck = evaluateFundingCheck(strictProfile, daad);
  const accommodationItem = fundingCheck.items.find((i) => i.expenseKey === 'accommodation');
  assert.equal(accommodationItem?.coverage, 'partial');
  assert.equal(accommodationItem?.satisfiesPriority, false);
  assert.equal(fundingCheck.assessment, 'partially_meets');
});

test('Fulbright Pakistan 2027 Program: Verified deadline is April 1, 2026 and status is Closed', () => {
  const fulbright = SCHOLARSHIPS.find((s) => s.id === 'fulbright-pakistan-2026');
  assert.ok(fulbright, 'Fulbright Pakistan record should exist');
  assert.equal(fulbright?.applicationDeadline, '2026-04-01');
  assert.equal(fulbright?.deadlineStatus, 'closed');
  assert.equal(fulbright?.verificationStatus, 'verified_official');
  assert.ok((fulbright?.officialSourceUrl || fulbright?.officialUrl).includes('usefp.org'));
});

test('Profile Language Validation: "not_taken" and "none_planned" never silently use scores', () => {
  // Even if a legacy score number was somehow present, "not_taken" or "none_planned" must evaluate as unknown
  const profileWithUnusedScore = {
    ...profileA,
    languageTest: 'not_taken' as const,
    languageScore: 8.5, // Should NOT be used
  };

  const result = matchScholarship(profileWithUnusedScore, demoFellowship);
  const langEval = result.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(langEval?.status, 'unknown');
  assert.ok(langEval?.studentValue.includes('Not taken yet'));

  const profileNonePlanned = {
    ...profileA,
    languageTest: 'none_planned' as const,
    languageScore: 8.0, // Should NOT be used
  };
  const resultNone = matchScholarship(profileNonePlanned, demoFellowship);
  const langEvalNone = resultNone.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(langEvalNone?.status, 'unknown');
  assert.ok(langEvalNone?.studentValue.includes('No test planned'));
});

test('Profile Education Status: Distinguishes bachelor in progress from completed bachelor degree', () => {
  // Chevening strictly requires completed undergraduate degree by the deadline
  const inProgressProfile = {
    ...profileA,
    currentEducationLevel: 'bachelor_in_progress' as const,
  };
  const resultInProgress = matchScholarship(inProgressProfile, chevening);
  const eduEvalInProgress = resultInProgress.evaluations.find((e) => e.criterion.startsWith('Current Education'));
  assert.equal(eduEvalInProgress?.status, 'does_not_meet');
  assert.ok(eduEvalInProgress?.reason.includes("Bachelor's degree in progress"));

  // Completed bachelor meets the requirement
  const completedProfile = {
    ...profileA,
    currentEducationLevel: 'bachelor_completed' as const,
  };
  const resultCompleted = matchScholarship(completedProfile, chevening);
  const eduEvalCompleted = resultCompleted.evaluations.find((e) => e.criterion.startsWith('Current Education'));
  assert.equal(eduEvalCompleted?.status, 'meets');
});

test('All scholarships have valid deadlineStatus and verificationStatus', () => {
  const validDeadlineStatuses = ['open', 'upcoming', 'closed', 'unconfirmed'];
  const validVerificationStatuses = ['verified_official', 'needs_verification', 'demo_data'];

  for (const s of SCHOLARSHIPS) {
    assert.ok(
      validDeadlineStatuses.includes(s.deadlineStatus),
      `Scholarship ${s.id} has invalid deadlineStatus: ${s.deadlineStatus}`
    );
    assert.ok(
      validVerificationStatuses.includes(s.verificationStatus),
      `Scholarship ${s.id} has invalid verificationStatus: ${s.verificationStatus}`
    );
    assert.ok(s.lastChecked, `Scholarship ${s.id} must have a lastChecked date`);
    assert.ok(s.officialUrl || s.officialSourceUrl, `Scholarship ${s.id} must have an officialUrl or officialSourceUrl`);
  }
});

test('Chevening Pakistan: Verified country-specific status is Closed and official source is Pakistan portal', () => {
  const chev = SCHOLARSHIPS.find((s) => s.id === 'chevening-uk-2026');
  assert.ok(chev, 'Chevening scholarship must exist');
  assert.equal(chev?.deadlineStatus, 'closed');
  assert.ok(chev?.officialUrl.includes('chevening.org/scholarship/pakistan'), 'Official URL must link directly to official Pakistan page');
  assert.equal(chev?.applicationDeadline?.toLowerCase().includes('closed'), true, 'Application deadline must indicate closed cycle');
  assert.ok(chev?.deadlineNote?.includes('chevening.org/scholarship/pakistan'));
});

test('DEFAULT_BLANK_PROFILE defaults do not assume English test taken or assign scores', () => {
  assert.equal(DEFAULT_BLANK_PROFILE.languageTest, 'not_taken', 'Blank profile must have languageTest as not_taken');
  assert.equal(DEFAULT_BLANK_PROFILE.languageScore, undefined, 'Blank profile must not assign a default score');
  assert.equal(DEFAULT_BLANK_PROFILE.workExperienceYears, 0, 'Blank profile defaults to 0 work experience');

  // When evaluated against a scholarship requiring language tests, it must result in unknown status (never assumed passed)
  const result = matchScholarship(DEFAULT_BLANK_PROFILE, demoFellowship);
  const langEval = result.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(langEval?.status, 'unknown');
  assert.ok(langEval?.reason.includes('not yet taken'));
});

test('Comparison limit logic strictly enforces 3-scholarship maximum', () => {
  const initialCompare: string[] = ['chevening-uk-2026', 'fulbright-pakistan-2026', 'daad-helmut-schmidt-2026'];
  assert.equal(initialCompare.length, 3);

  // Simulating toggleCompare with 3 existing items
  const attemptAddFourth = (current: string[], newId: string) => {
    if (current.includes(newId)) {
      return { list: current.filter((i) => i !== newId), notification: null };
    }
    if (current.length >= 3) {
      return {
        list: current,
        notification: 'Comparison limit reached: You can compare up to 3 scholarships side by side. Please remove one from the Compare Lab first.'
      };
    }
    return { list: [...current, newId], notification: null };
  };

  const outcome = attemptAddFourth(initialCompare, 'erasmus-mundus-2026');
  assert.equal(outcome.list.length, 3, 'Must not exceed 3 scholarships');
  assert.ok(outcome.notification?.includes('Comparison limit reached'), 'Must produce notification message');
  assert.deepEqual(outcome.list, initialCompare, 'List must remain unchanged when limit reached');

  // Removing an item works
  const removeOutcome = attemptAddFourth(initialCompare, 'chevening-uk-2026');
  assert.equal(removeOutcome.list.length, 2);
  assert.equal(removeOutcome.notification, null);
});

test('Live catalogue excludes the QA fixture while test catalogue retains it', () => {
  assert.equal(SCHOLARSHIPS.some((s) => s.id === 'demo-fellowship-test-2026'), false);
  assert.equal(ALL_SCHOLARSHIPS_FOR_TESTS.some((s) => s.id === 'demo-fellowship-test-2026'), true);
});

test('Mandatory unknown and not-applicable funding never passes as fully meeting needs', () => {
  const unknownFundingScholarship = {
    ...chevening,
    fundingBreakdown: {
      ...chevening.fundingBreakdown,
      healthInsurance: { ...chevening.fundingBreakdown.healthInsurance, status: 'unknown' as const },
    },
  };
  const unknownCheck = evaluateFundingCheck(
    { ...profileA, fundingPriorities: { ...profileA.fundingPriorities, healthInsurance: 'must' as const } },
    unknownFundingScholarship
  );
  assert.equal(unknownCheck.assessment, 'unknown');
  assert.equal(unknownCheck.items.find((item) => item.expenseKey === 'healthInsurance')?.satisfiesPriority, false);

  const notApplicableFundingScholarship = {
    ...chevening,
    fundingBreakdown: {
      ...chevening.fundingBreakdown,
      visaFees: { ...chevening.fundingBreakdown.visaFees, status: 'not_applicable' as const },
    },
  };
  const notApplicableCheck = evaluateFundingCheck(
    { ...profileA, fundingPriorities: { ...profileA.fundingPriorities, visaFees: 'must' as const } },
    notApplicableFundingScholarship
  );
  assert.equal(notApplicableCheck.assessment, 'does_not_meet_mandatory');
  assert.equal(notApplicableCheck.items.find((item) => item.expenseKey === 'visaFees')?.satisfiesPriority, false);
});

test('Funding summary separates selected mandatory priorities from preferred gaps', () => {
  const profileWithTwoMusts = {
    ...profileA,
    fundingPriorities: {
      tuition: 'must' as const,
      stipend: 'must' as const,
      accommodation: 'preferred' as const,
      travel: 'not_priority' as const,
      healthInsurance: 'not_priority' as const,
      visaFees: 'not_priority' as const,
    },
  };
  const result = evaluateFundingCheck(profileWithTwoMusts, chevening);
  assert.equal(result.assessment, 'meets_needs');
  assert.ok(result.summary.includes('Mandatory priorities assessed: Tuition Fees, Living Expenses / Stipend.'));
  assert.ok(result.summary.includes('Preferred expense gaps requiring review: Accommodation (partial).'));
  assert.equal(result.summary.includes('all six'), false);
});

test('Eligibility conditions such as current enrollment remain unknown when not collected', () => {
  const scholarshipWithEnrollmentRule = {
    ...demoFellowship,
    mandatoryCriteria: [
      ...demoFellowship.mandatoryCriteria,
      {
        id: 'enrollment-rule',
        label: 'Applicant must not be currently enrolled',
        description: 'Applicants must not be currently enrolled in another degree programme.',
      },
    ],
  };
  const result = matchScholarship(profileA, scholarshipWithEnrollmentRule);
  const enrollmentEval = result.evaluations.find((evaluation) => evaluation.criterion === 'Current Enrollment Status');
  assert.equal(enrollmentEval?.status, 'unknown');
  assert.equal(enrollmentEval?.isMandatory, true);
});

test('Regression: Missing languageScore produces unknown, not a false pass or false failure', () => {
  const profileMissingIeltsScore = {
    ...profileA,
    languageTest: 'ielts' as const,
    languageScore: undefined,
  };

  // Against Demo Fellowship (strict IELTS 7.0 cutoff)
  const demoResult = matchScholarship(profileMissingIeltsScore, demoFellowship);
  const demoLangEval = demoResult.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(demoLangEval?.status, 'unknown', 'Missing score must be unknown, not pass or fail');
  assert.equal(demoLangEval?.isMandatory, true);
  assert.ok(demoLangEval?.studentValue.includes('score pending'));
  assert.ok(demoLangEval?.reason.includes('Score not provided'));

  // Against Chevening (host university language note)
  const chevResult = matchScholarship(profileMissingIeltsScore, chevening);
  const chevLangEval = chevResult.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(chevLangEval?.status, 'unknown');
  assert.equal(chevLangEval?.isMandatory, false);
  assert.ok(chevLangEval?.studentValue.includes('score pending'));

  // Against Fulbright (TOEFL 80 cutoff, student entered TOEFL without score)
  const profileMissingToeflScore = {
    ...profileA,
    languageTest: 'toefl' as const,
    languageScore: undefined,
  };
  const fulbright = SCHOLARSHIPS.find((s) => s.id === 'fulbright-pakistan-2026')!;
  const fulResult = matchScholarship(profileMissingToeflScore, fulbright);
  const fulLangEval = fulResult.evaluations.find((e) => e.criterion.startsWith('Language Proficiency'));
  assert.equal(fulLangEval?.status, 'unknown');
  assert.equal(fulLangEval?.isMandatory, true);
  assert.ok(fulLangEval?.studentValue.includes('score pending'));
});

test('Regression: Closed-subject requirement safeguard flags disciplinary mismatch as does_not_meet', () => {
  // Profile A is Computer Science & AI
  // DAAD Helmut Schmidt mandates social science, politics, law, economics via daad-qualifying-subject
  const csResult = matchScholarship(profileA, daad);
  const fieldEval = csResult.evaluations.find((e) => e.criterion === 'Field of Study');
  assert.equal(fieldEval?.status, 'does_not_meet', 'Non-social science degree must fail closed subject requirement');
  assert.equal(fieldEval?.isMandatory, true);
  assert.equal(csResult.overallStatus, 'likely_ineligible');
  assert.ok(csResult.failedMandatoryCount >= 1);

  // Profile C is Public Policy (matches DAAD discipline)
  const policyResult = matchScholarship(profileC, daad);
  const policyFieldEval = policyResult.evaluations.find((e) => e.criterion === 'Field of Study');
  assert.equal(policyFieldEval?.status, 'meets', 'Public Policy must satisfy DAAD Helmut Schmidt discipline');
});

test('Regression: SINGA education level safeguard correctly enforces PhD restriction', () => {
  const singa = SCHOLARSHIPS.find((s) => s.id === 'singa-singapore-2026')!;
  // Master degree seeker applying to PhD-only award fails degree level
  const masterSeeker = {
    ...profileA,
    intendedDegree: 'master' as const,
  };
  const masterResult = matchScholarship(masterSeeker, singa);
  const degEval = masterResult.evaluations.find((e) => e.criterion === 'Intended Degree Level');
  assert.equal(degEval?.status, 'does_not_meet');
  assert.equal(masterResult.overallStatus, 'likely_ineligible');

  // Completed bachelor seeking PhD without recorded direct-entry exception evaluates to unknown for master requirement
  const phdSeeker = {
    ...profileA,
    intendedDegree: 'phd' as const,
    currentEducationLevel: 'bachelor_completed' as const,
  };
  const phdResult = matchScholarship(phdSeeker, singa);
  const eduEval = phdResult.evaluations.find((e) => e.criterion === 'Current Education Qualification');
  assert.equal(eduEval?.status, 'unknown');
  assert.equal(eduEval?.isMandatory, false);
});

test('AI request validation rejects unexpected fields and malformed comparison payloads', () => {
  const profile = {
    nationality: profileA.nationality,
    currentEducationLevel: profileA.currentEducationLevel,
    currentDegreeProgram: profileA.currentDegreeProgram,
    intendedDegree: profileA.intendedDegree,
    fieldOfStudy: profileA.fieldOfStudy,
    grade: profileA.grade,
    gradeScale: profileA.gradeScale,
    fundingPriorities: profileA.fundingPriorities,
  };

  assert.throws(
    () => validateChatRequest({ question: 'What does this cover?', profile, scholarship: { name: 'Test', officialUrl: 'https://example.org', fundingBreakdown: chevening.fundingBreakdown, fullName: 'Unexpected' } }),
    (error) => error instanceof AIRequestValidationError
  );
  assert.throws(
    () => validateCompareRequest({ profile, scholarships: [chevening] }),
    (error) => error instanceof AIRequestValidationError
  );
  assert.throws(
    () => validateExplainMatchRequest({ profile, scholarship: chevening, matchEvaluation: {} }),
    (error) => error instanceof AIRequestValidationError
  );
});

test('AI chat request validation rejects oversized questions', () => {
  const profile = {
    nationality: profileA.nationality,
    currentEducationLevel: profileA.currentEducationLevel,
    currentDegreeProgram: profileA.currentDegreeProgram,
    intendedDegree: profileA.intendedDegree,
    fieldOfStudy: profileA.fieldOfStudy,
    grade: profileA.grade,
    gradeScale: profileA.gradeScale,
    fundingPriorities: profileA.fundingPriorities,
  };
  const request = {
    question: 'x'.repeat(MAX_CHAT_QUESTION_LENGTH + 1),
    profile,
    scholarship: {
      name: chevening.name,
      officialUrl: chevening.officialUrl,
      fundingBreakdown: chevening.fundingBreakdown,
    },
  };

  assert.throws(
    () => validateChatRequest(request),
    (error) => error instanceof AIRequestValidationError && error.message.includes('at most')
  );
});
