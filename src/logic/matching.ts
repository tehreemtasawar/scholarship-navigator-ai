import {
  CriterionEvaluation,
  FundingAssessment,
  FundingComparisonItem,
  MatchResult,
  OverallEligibilityStatus,
  PriorityLevel,
  ScholarshipRecord,
  StudentProfile,
} from '../types/scholarship';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function requiredNationalitiesSummary(list: string[]): string {
  return list.slice(0, 3).join(', ') + (list.length > 3 ? '...' : '');
}

function isWorldwideOpenNationality(entry: string): boolean {
  const n = entry.trim().toLowerCase();
  return n === 'all' || n === 'all countries' || n === 'all nationalities' || n === 'all international' || n === 'all international students';
}

function isBroadNationalityLabel(entry: string): boolean {
  const n = entry.toLowerCase();
  return (
    n.includes('commonwealth') ||
    n.includes('developing') ||
    n.includes('emerging nations') ||
    n.includes('dac list') ||
    n.includes('chevening-eligible') ||
    n.includes('diplomatic relations') ||
    n.includes('partner countries') ||
    n.includes('participating country')
  );
}

function nationalityExplicitlyListed(entry: string, normStudent: string): boolean {
  const n = entry.trim().toLowerCase();
  if (!normStudent) return false;
  if (n === normStudent) return true;
  const parts = n.split(/[,;/]/).map((part) => part.trim()).filter(Boolean);
  if (parts.some((part) => part === normStudent)) return true;
  return new RegExp(`\\bincluding\\s+${escapeRegExp(normStudent)}\\b`, 'i').test(entry);
}

function nationalityExclusionResult(
  entry: string,
  normStudent: string
): 'meets' | 'does_not_meet' | null {
  const n = entry.toLowerCase();
  if (n.includes('all international') && n.includes('non-singapore')) {
    if (normStudent === 'singapore' || normStudent === 'singaporean') return 'does_not_meet';
    if (normStudent) return 'meets';
  }
  return null;
}

/**
 * Checks if a candidate nationality satisfies the scholarship eligibility list.
 * Broad labels such as Commonwealth or developing countries are never treated as proof of eligibility.
 */
export function checkNationality(
  studentNationality: string,
  scholarship: ScholarshipRecord
): CriterionEvaluation {
  const rawStudent = studentNationality.trim();
  const normStudent = rawStudent.toLowerCase();
  const list = scholarship.eligibleNationalities;
  const requiredValue = requiredNationalitiesSummary(list);

  if (!normStudent) {
    return {
      criterion: 'Nationality',
      status: 'unknown',
      studentValue: 'Not specified',
      requiredValue,
      reason: 'Nationality was not provided, so citizenship eligibility cannot be confirmed from the record.',
      isMandatory: true,
    };
  }

  const nonTurkishRule = scholarship.mandatoryCriteria.some((c) =>
    `${c.label} ${c.description}`.toLowerCase().includes('non-turkish')
  );
  if (nonTurkishRule && (normStudent === 'turkey' || normStudent === 'türkiye' || normStudent === 'turkish')) {
    return {
      criterion: 'Nationality',
      status: 'does_not_meet',
      studentValue: rawStudent,
      requiredValue: 'Foreign nationality (non-Turkish)',
      reason: `${scholarship.name} requires applicants not to hold Turkish citizenship.`,
      isMandatory: true,
    };
  }

  if (list.some(isWorldwideOpenNationality)) {
    return {
      criterion: 'Nationality',
      status: 'meets',
      studentValue: rawStudent,
      requiredValue: 'Open to all international nationalities',
      reason: `Your nationality (${rawStudent}) is eligible under the worldwide open criteria.`,
      isMandatory: true,
    };
  }

  for (const entry of list) {
    const excluded = nationalityExclusionResult(entry, normStudent);
    if (excluded === 'does_not_meet') {
      return {
        criterion: 'Nationality',
        status: 'does_not_meet',
        studentValue: rawStudent,
        requiredValue,
        reason: `Your stated nationality (${rawStudent}) is excluded by the award’s international-student rule.`,
        isMandatory: true,
      };
    }
    if (excluded === 'meets') {
      return {
        criterion: 'Nationality',
        status: 'meets',
        studentValue: rawStudent,
        requiredValue,
        reason: `Citizen of ${rawStudent} is eligible as an international applicant under the listed nationality rule.`,
        isMandatory: true,
      };
    }
  }

  if (list.some((entry) => nationalityExplicitlyListed(entry, normStudent))) {
    return {
      criterion: 'Nationality',
      status: 'meets',
      studentValue: rawStudent,
      requiredValue,
      reason: `Citizen of ${rawStudent} is explicitly listed among eligible nationalities for this award.`,
      isMandatory: true,
    };
  }

  if (list.some(isBroadNationalityLabel)) {
    return {
      criterion: 'Nationality',
      status: 'unknown',
      studentValue: rawStudent,
      requiredValue,
      reason: `Your nationality (${rawStudent}) is not named in the eligibility list. Broad labels such as Commonwealth or developing-country groups are not treated as proof of eligibility.`,
      isMandatory: true,
    };
  }

  return {
    criterion: 'Nationality',
    status: 'does_not_meet',
    studentValue: rawStudent,
    requiredValue,
    reason: `Your stated nationality (${rawStudent}) is not listed among the eligible countries for this award.`,
    isMandatory: true,
  };
}

/**
 * Checks degree level eligibility.
 */
export function checkDegreeLevel(
  studentIntendedDegree: StudentProfile['intendedDegree'],
  scholarship: ScholarshipRecord
): CriterionEvaluation {
  const isEligible = scholarship.eligibleDegrees.includes(studentIntendedDegree);
  const degreeLabels: Record<string, string> = {
    bachelor: "Bachelor's",
    master: "Master's",
    phd: 'PhD / Doctorate',
    postdoc: 'Postdoctoral Fellowship',
  };

  if (isEligible) {
    return {
      criterion: 'Intended Degree Level',
      status: 'meets',
      studentValue: degreeLabels[studentIntendedDegree] || studentIntendedDegree,
      requiredValue: scholarship.eligibleDegrees.map((d) => degreeLabels[d] || d).join(', '),
      reason: `The program officially funds ${degreeLabels[studentIntendedDegree]} studies.`,
      isMandatory: true,
    };
  }

  return {
    criterion: 'Intended Degree Level',
    status: 'does_not_meet',
    studentValue: degreeLabels[studentIntendedDegree] || studentIntendedDegree,
    requiredValue: scholarship.eligibleDegrees.map((d) => degreeLabels[d] || d).join(', '),
    reason: `This scholarship funds ${scholarship.eligibleDegrees.map((d) => degreeLabels[d] || d).join(', ')}, whereas your intended level is ${degreeLabels[studentIntendedDegree]}.`,
    isMandatory: true,
  };
}

/**
 * Evaluates the student's current education status against scholarship prerequisites.
 * Preserves the user's actual education status and distinguishes a bachelor's degree
 * in progress from a completed bachelor's degree.
 */
export function checkEducationStatus(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): CriterionEvaluation {
  const currentLevel = profile.currentEducationLevel;
  const intendedDegree = profile.intendedDegree;

  const levelLabels: Record<string, string> = {
    bachelor_completed: "Bachelor's Degree Completed (4-Year / 16 Years)",
    bachelor_in_progress: "Bachelor's Degree in Progress (Final Year)",
    master_completed: "Master's / MPhil Completed (18 Years)",
    master_in_progress: "Master's Degree in Progress",
    high_school: 'High School / Intermediate / A-Levels',
    other: 'Other Diploma / Associate',
  };

  const studentLabel = levelLabels[currentLevel] || currentLevel;

  // Case 1: Intended degree is Master's
  if (intendedDegree === 'master') {
    if (
      currentLevel === 'bachelor_completed' ||
      currentLevel === 'master_completed' ||
      currentLevel === 'master_in_progress'
    ) {
      return {
        criterion: 'Current Education Qualification',
        status: 'meets',
        studentValue: studentLabel,
        requiredValue: "Completed undergraduate degree (minimum 16 years education / Bachelor's)",
        reason: `Your educational background (${studentLabel}) satisfies the prerequisite for Master's degree applications.`,
        isMandatory: true,
      };
    }

    if (currentLevel === 'bachelor_in_progress') {
      // Check if scholarship strictly mandates degree already completed at time of application
      const strictlyRequiresCompletedAtApp =
        scholarship.id === 'chevening-uk-2026' ||
        scholarship.id === 'fulbright-pakistan-2026' ||
        scholarship.mandatoryCriteria.some(
          (c) =>
            c.id === 'chev-undergrad' ||
            c.id === 'ful-16-years' ||
            c.label.toLowerCase().includes('completed undergraduate')
        );

      if (strictlyRequiresCompletedAtApp) {
        return {
          criterion: 'Current Education Qualification',
          status: 'does_not_meet',
          studentValue: studentLabel,
          requiredValue: 'Completed undergraduate degree required by application deadline',
          reason: `Your profile indicates a Bachelor's degree in progress. ${scholarship.name} explicitly requires that an undergraduate degree enabling postgraduate entry be officially completed and documented by the application deadline.`,
          isMandatory: true,
        };
      }

      return {
        criterion: 'Current Education Qualification (In Progress)',
        status: 'unknown',
        studentValue: studentLabel,
        requiredValue: "Completed Bachelor's prior to course start or provisional eligibility certificate",
        reason:
          "Your Bachelor's degree is currently in progress. Many programs allow provisional applications for final-year students provided graduation is completed before enrollment. Confirm provisional rules with provider.",
        isMandatory: false,
      };
    }

    if (currentLevel === 'high_school') {
      return {
        criterion: 'Current Education Qualification',
        status: 'does_not_meet',
        studentValue: studentLabel,
        requiredValue: "Completed Bachelor's degree (16 years education)",
        reason: "Master's degree programs require a completed undergraduate degree.",
        isMandatory: true,
      };
    }

    return {
      criterion: 'Current Education Qualification',
      status: 'unknown',
      studentValue: studentLabel,
      requiredValue: "Completed undergraduate degree (minimum 16 years education / Bachelor's)",
      reason: `Your educational background (${studentLabel}) cannot be confirmed as meeting the undergraduate prerequisite for Master's study. Provider verification is required.`,
      isMandatory: true,
    };
  }

  // Case 2: Intended degree is PhD
  if (intendedDegree === 'phd') {
    if (currentLevel === 'master_completed') {
      return {
        criterion: 'Current Education Qualification',
        status: 'meets',
        studentValue: studentLabel,
        requiredValue: "Completed Master's degree (or equivalent graduate training)",
        reason: "Your completed Master's/MPhil degree satisfies the standard prerequisite for PhD study.",
        isMandatory: true,
      };
    }

    // Direct PhD from a bachelor's only when a recorded criterion explicitly allows it.
    // Document lists that mention "Bachelor's and/or Master's" are not proof of PhD entry.
    const allowsDirectBachelors = scholarship.mandatoryCriteria.some((c) => {
      const text = `${c.label} ${c.description}`.toLowerCase();
      return (
        /\bbachelor/.test(text) &&
        (/\bdirect(-|\s)?entry\b/.test(text) ||
          /\bfast-track\b/.test(text) ||
          /\bwithout (a )?master/.test(text) ||
          /\bundergraduate.{0,40}phd\b/.test(text) ||
          /\bphd.{0,40}bachelor/.test(text))
      );
    });

    if (currentLevel === 'bachelor_completed') {
      if (allowsDirectBachelors) {
        return {
          criterion: 'Current Education Qualification',
          status: 'meets',
          studentValue: studentLabel,
          requiredValue: "Completed 4-Year Bachelor's (First Class / High Honours for direct PhD)",
          reason:
            'This program accepts exceptional 4-year undergraduate degree holders directly into PhD research.',
          isMandatory: true,
        };
      } else {
        return {
          criterion: 'Current Education Qualification',
          status: 'unknown',
          studentValue: studentLabel,
          requiredValue: "Master's / MS degree typically required for doctoral research",
          reason:
            "Most PhD programs require an MS/MPhil prior to admission unless applying under direct-entry fast-track provisions.",
          isMandatory: false,
        };
      }
    }

    if (currentLevel === 'bachelor_in_progress' || currentLevel === 'high_school') {
      return {
        criterion: 'Current Education Qualification',
        status: 'does_not_meet',
        studentValue: studentLabel,
        requiredValue: "Completed Bachelor's or Master's degree",
        reason:
          'PhD programs require at least a completed undergraduate or graduate degree prior to matriculation.',
        isMandatory: true,
      };
    }

    return {
      criterion: 'Current Education Qualification',
      status: 'unknown',
      studentValue: studentLabel,
      requiredValue: "Completed Master's degree (or equivalent graduate training)",
      reason: `Your educational background (${studentLabel}) is not sufficient to confirm PhD eligibility from structured profile data. Provider verification is required.`,
      isMandatory: true,
    };
  }

  // Case 3: Intended degree is Bachelor's
  if (intendedDegree === 'bachelor') {
    if (currentLevel === 'high_school') {
      return {
        criterion: 'Current Education Qualification',
        status: 'meets',
        studentValue: studentLabel,
        requiredValue: 'Completed Secondary School / Higher Secondary Certificate (12 years)',
        reason:
          "Your high school/intermediate qualification meets the prerequisite for undergraduate Bachelor's study.",
        isMandatory: true,
      };
    }

    return {
      criterion: 'Current Education Qualification',
      status: 'unknown',
      studentValue: studentLabel,
      requiredValue: 'Completed Secondary School / Higher Secondary Certificate (12 years)',
      reason: `Your educational background (${studentLabel}) is not a standard high-school prerequisite match for Bachelor's study. Confirm with the provider whether this pathway is accepted.`,
      isMandatory: true,
    };
  }

  return {
    criterion: 'Current Education Qualification',
    status: 'unknown',
    studentValue: studentLabel,
    requiredValue: 'Educational prerequisite documented by provider',
    reason: `Educational background (${studentLabel}) could not be evaluated against a structured prerequisite for the intended ${intendedDegree} pathway. This is not treated as meeting the requirement.`,
    isMandatory: true,
  };
}

const FIELD_STOPWORDS = new Set([
  'and',
  'or',
  'the',
  'of',
  'in',
  'for',
  'to',
  'all',
  'fields',
  'field',
  'studies',
  'study',
  'sciences',
  'science',
  'general',
  'related',
  'other',
  'areas',
]);

/** Tokens that are too generic to prove a disciplinary match on their own. */
const GENERIC_FIELD_TOKENS = new Set([
  'international',
  'global',
  'public',
  'development',
  'social',
  'applied',
  'advanced',
  'modern',
  'human',
  'cultural',
  'inclusive',
  'inclusion',
  'opportunity',
  'access',
  'capacity',
  'systems',
  'system',
  'management',
  'resource',
  'resources',
  'change',
  'green',
  'economy',
  'security',
  'peace',
  'prosperity',
  'response',
  'crises',
  'resilience',
  'strengthening',
  'promoting',
  'improving',
  'information',
]);

function fieldTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !FIELD_STOPWORDS.has(token));
}

function fieldsHaveReliableMatch(studentField: string, eligibleField: string): boolean {
  const student = studentField.trim().toLowerCase();
  const eligible = eligibleField.trim().toLowerCase();
  if (!student || !eligible) return false;
  if (student === eligible) return true;
  if (student.length > 4 && eligible.includes(student)) return true;
  if (eligible.length > 4 && student.includes(eligible)) return true;

  const studentTokens = fieldTokens(student);
  const eligibleTokens = new Set(fieldTokens(eligible));
  const computingStudent = studentTokens.some((t) =>
    ['computer', 'computing', 'informatics', 'software', 'ai'].includes(t)
  );
  const computingEligible = [...eligibleTokens].some((t) =>
    ['computer', 'computing', 'informatics', 'software', 'ai', 'stem'].includes(t)
  );
  if (computingStudent && computingEligible) return true;

  const policyStudent = studentTokens.some((t) =>
    ['policy', 'governance', 'administration', 'political'].includes(t)
  );
  const policyEligible = [...eligibleTokens].some((t) =>
    ['policy', 'governance', 'administration', 'political'].includes(t)
  );
  if (policyStudent && policyEligible) return true;

  const engineeringStudent = studentTokens.includes('engineering');
  const engineeringEligible = eligibleTokens.has('engineering') || eligibleTokens.has('stem');
  if (engineeringStudent && engineeringEligible) return true;

  const distinctiveStudent = studentTokens.filter((token) => !GENERIC_FIELD_TOKENS.has(token));
  const distinctiveEligible = new Set(
    [...eligibleTokens].filter((token) => !GENERIC_FIELD_TOKENS.has(token))
  );
  const sharedDistinctive = distinctiveStudent.filter((token) => distinctiveEligible.has(token));
  if (sharedDistinctive.length >= 1) return true;

  const sharedAny = studentTokens.filter((token) => eligibleTokens.has(token));
  // A single generic token such as "international" is not sufficient evidence.
  return sharedAny.filter((token) => !GENERIC_FIELD_TOKENS.has(token)).length >= 1;
}

function hasClosedSubjectRequirement(scholarship: ScholarshipRecord): boolean {
  return scholarship.mandatoryCriteria.some((c) => {
    const text = `${c.id} ${c.label} ${c.description}`.toLowerCase();
    return (
      text.includes('qualifying-subject') ||
      text.includes('qualifying subject') ||
      text.includes('first degree in') ||
      text.includes('stem bachelor') ||
      text.includes('must be in computer') ||
      text.includes('must have a first degree')
    );
  });
}

function excludedFieldFromOpenList(entry: string): string | null {
  const match = entry.match(/all fields except\s+(.+)/i);
  return match?.[1]?.trim() || null;
}

/**
 * Checks field of study eligibility.
 */
export function checkFieldOfStudy(
  studentField: string,
  scholarship: ScholarshipRecord
): CriterionEvaluation {
  const trimmedField = studentField.trim();
  const list = scholarship.eligibleFields;
  const requiredValue = list.slice(0, 3).join(', ') + (list.length > 3 ? '...' : '');

  if (!trimmedField) {
    return {
      criterion: 'Field of Study',
      status: 'unknown',
      studentValue: 'Not specified',
      requiredValue,
      reason: 'Field of study was not provided, so disciplinary eligibility cannot be confirmed.',
      isMandatory: true,
    };
  }

  const exceptionEntry = list.find((f) => /all fields except/i.test(f));
  if (exceptionEntry) {
    const excluded = excludedFieldFromOpenList(exceptionEntry) || '';
    const excludedNorm = excluded.toLowerCase();
    const studentNorm = trimmedField.toLowerCase();
    const isExcluded =
      Boolean(excludedNorm) &&
      (studentNorm === excludedNorm ||
        studentNorm.includes(excludedNorm) ||
        (excludedNorm.includes('clinical') && studentNorm.includes('clinical')));
    if (isExcluded) {
      return {
        criterion: 'Field of Study',
        status: 'does_not_meet',
        studentValue: trimmedField,
        requiredValue: exceptionEntry,
        reason: `Your field (${trimmedField}) falls under the stated exclusion (${excluded}).`,
        isMandatory: true,
      };
    }
    return {
      criterion: 'Field of Study',
      status: 'meets',
      studentValue: trimmedField,
      requiredValue: exceptionEntry,
      reason: `Your field (${trimmedField}) is accepted under an open-discipline policy with a stated exclusion that does not apply.`,
      isMandatory: true,
    };
  }

  const isOpenToAll = list.some((f) => {
    const norm = f.trim().toLowerCase();
    return (
      norm === 'all' ||
      norm === 'all fields' ||
      norm === 'all disciplines' ||
      norm === 'all academic disciplines' ||
      norm.startsWith('all fields of study')
    );
  });

  if (isOpenToAll) {
    return {
      criterion: 'Field of Study',
      status: 'meets',
      studentValue: trimmedField,
      requiredValue: 'Open to all academic disciplines',
      reason: `Your chosen field (${trimmedField}) is accepted under the open-discipline policy.`,
      isMandatory: true,
    };
  }

  const directMatch = list.some((f) => fieldsHaveReliableMatch(trimmedField, f));
  if (directMatch) {
    return {
      criterion: 'Field of Study',
      status: 'meets',
      studentValue: trimmedField,
      requiredValue,
      reason: `Your field (${trimmedField}) matches the scholarship’s targeted priority disciplines.`,
      isMandatory: true,
    };
  }

  if (hasClosedSubjectRequirement(scholarship)) {
    return {
      criterion: 'Field of Study',
      status: 'does_not_meet',
      studentValue: trimmedField,
      requiredValue,
      reason: `Your field (${trimmedField}) does not match the award’s stated qualifying-subject or first-degree requirement.`,
      isMandatory: true,
    };
  }

  return {
    criterion: 'Field of Study',
    status: 'unknown',
    studentValue: trimmedField,
    requiredValue,
    reason: `Your field (${trimmedField}) is not explicitly listed in priority areas. Cross-disciplinary or departmental verification required with provider.`,
    isMandatory: true,
  };
}

/**
 * Safe, non-hallucinating academic requirement comparison.
 * Never invents universal conversion formulas across incompatible scales.
 */
export function checkAcademicRequirements(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): CriterionEvaluation {
  if (!scholarship.minGrade) {
    return {
      criterion: 'Academic Minimum (GPA/Grade)',
      status: 'meets',
      studentValue: `${profile.grade} (${profile.gradeScale} scale)`,
      requiredValue: 'No specific minimum cutoff stated by provider',
      reason: 'No rigid numerical cutoff published; competitive merit selection applies.',
      isMandatory: false,
    };
  }

  const req = scholarship.minGrade;

  // Case 1: Both on 4.0 scale
  if (profile.gradeScale === '4.0' && req.scale === '4.0') {
    if (profile.grade >= req.minimum) {
      return {
        criterion: 'Academic Minimum (GPA)',
        status: 'meets',
        studentValue: `${profile.grade.toFixed(2)} / 4.0`,
        requiredValue: `Minimum ${req.minimum.toFixed(2)} / 4.0`,
        reason: `Your CGPA of ${profile.grade.toFixed(2)} meets the minimum published threshold of ${req.minimum.toFixed(2)}. ${req.flexibleEquivalencyNote || ''}`.trim(),
        isMandatory: true,
      };
    } else {
      return {
        criterion: 'Academic Minimum (GPA)',
        status: 'does_not_meet',
        studentValue: `${profile.grade.toFixed(2)} / 4.0`,
        requiredValue: `Minimum ${req.minimum.toFixed(2)} / 4.0`,
        reason: `Your CGPA of ${profile.grade.toFixed(2)} is below the mandatory minimum of ${req.minimum.toFixed(2)} on the 4.0 scale.`,
        isMandatory: true,
      };
    }
  }

  // Case 2: Both on percentage scale
  if (profile.gradeScale === 'percentage' && req.scale === 'percentage') {
    if (profile.grade >= req.minimum) {
      return {
        criterion: 'Academic Minimum (Percentage)',
        status: 'meets',
        studentValue: `${profile.grade}%`,
        requiredValue: `Minimum ${req.minimum}%`,
        reason: `Your percentage score of ${profile.grade}% satisfies the ${req.minimum}% minimum requirement.`,
        isMandatory: true,
      };
    } else {
      return {
        criterion: 'Academic Minimum (Percentage)',
        status: 'does_not_meet',
        studentValue: `${profile.grade}%`,
        requiredValue: `Minimum ${req.minimum}%`,
        reason: `Your percentage of ${profile.grade}% is below the mandatory ${req.minimum}% cutoff.`,
        isMandatory: true,
      };
    }
  }

  // Case 3: Incompatible or non-identical scales (e.g. 4.0 student applying to percentage scholarship or vice versa)
  return {
    criterion: 'Academic Minimum (Grading Scale Equivalency)',
    status: 'unknown',
    studentValue: `${profile.grade} (${profile.gradeScale} scale)`,
    requiredValue: `Minimum ${req.minimum} (${req.scale} scale)`,
    reason: `Grading scales differ (${profile.gradeScale} vs required ${req.scale}). To avoid misleading conversions, official academic credential evaluation (e.g. UK ENIC, WES, or university admissions office) is required. ${req.flexibleEquivalencyNote || ''}`.trim(),
    isMandatory: true,
  };
}

function isHostUniversityLanguageRequirement(note?: string): boolean {
  const text = (note || '').toLowerCase();
  return (
    text.includes('removed its standalone') ||
    text.includes('host university') ||
    text.includes('chosen uk university') ||
    text.includes('depends on host university') ||
    text.includes('unconditional english')
  );
}

/**
 * Checks language test requirement.
 */
export function checkLanguageRequirements(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): CriterionEvaluation {
  const isNoTest =
    profile.languageTest === 'not_taken' || profile.languageTest === 'none_planned';

  if (!scholarship.languageRequirements) {
    return {
      criterion: 'Language Proficiency',
      status: 'meets',
      studentValue: isNoTest
        ? profile.languageTest === 'none_planned'
          ? 'No test planned'
          : 'Not taken yet'
        : `${profile.languageTest.toUpperCase()} (${profile.languageScore !== undefined ? profile.languageScore : 'Score not entered'})`,
      requiredValue: 'No specific scholarship-level score test mandated',
      reason: 'No universal English test mandated by scholarship itself; depends on host university.',
      isMandatory: false,
    };
  }

  const req = scholarship.languageRequirements;
  const hostUniversityLanguage = isHostUniversityLanguageRequirement(req.note);
  const scholarshipSetsCutoff = !hostUniversityLanguage && req.minScore > 0 && req.test !== 'any';

  if (hostUniversityLanguage) {
    const studentValue = isNoTest
      ? profile.languageTest === 'none_planned'
        ? 'No test planned'
        : 'Not taken yet'
      : `${profile.languageTest.toUpperCase()} ${profile.languageScore ?? '(score pending)'}`;
    return {
      criterion: 'Language Proficiency (host university)',
      status: 'unknown',
      studentValue,
      requiredValue: req.note || 'Host university English requirement (not a scholarship-owned cutoff)',
      reason:
        'This award does not set a standalone English-test cutoff in the record. Typical university scores in the note are not treated as a scholarship pass/fail threshold. Confirm the chosen university’s unconditional offer requirements.',
      isMandatory: false,
    };
  }

  if (isNoTest) {
    const isNonePlanned = profile.languageTest === 'none_planned';
    return {
      criterion: 'Language Proficiency (IELTS / TOEFL / PTE)',
      status: 'unknown',
      studentValue: isNonePlanned ? 'No test planned' : 'Not taken yet',
      requiredValue: `${req.test.toUpperCase()} minimum ${req.minScore > 0 ? req.minScore : 'standard cutoff'}. ${req.note || ''}`.trim(),
      reason: isNonePlanned
        ? 'You indicated no language test is planned. Most international scholarships and host universities require an official language certificate before enrollment.'
        : 'You have not yet taken an approved language test. This requirement remains unverified until an official test score is submitted.',
      isMandatory: scholarshipSetsCutoff,
    };
  }

  const score = profile.languageScore;
  if (score === undefined || score === null || typeof score !== 'number' || Number.isNaN(score)) {
    return {
      criterion: 'Language Proficiency',
      status: 'unknown',
      studentValue: `${profile.languageTest.toUpperCase()} (score pending)`,
      requiredValue: req.minScore > 0 ? `Minimum ${req.minScore} on ${req.test.toUpperCase()}` : `${req.test.toUpperCase()} required`,
      reason: 'Score not provided. Verification with official test report required.',
      isMandatory: scholarshipSetsCutoff,
    };
  }

  const compareNamedTest = (
    testLabel: string,
    studentTest: StudentProfile['languageTest'],
    requiredTest: typeof req.test
  ): CriterionEvaluation | null => {
    if (profile.languageTest !== studentTest || req.test !== requiredTest) return null;
    const requiredValue = `${testLabel} minimum ${req.minScore}`;
    if (score >= req.minScore) {
      return {
        criterion: `Language Proficiency (${testLabel})`,
        status: 'meets',
        studentValue: `${testLabel} ${score}`,
        requiredValue,
        reason: `Your ${testLabel} score of ${score} meets or exceeds the required minimum of ${req.minScore}.`,
        isMandatory: true,
      };
    }
    return {
      criterion: `Language Proficiency (${testLabel})`,
      status: 'does_not_meet',
      studentValue: `${testLabel} ${score}`,
      requiredValue,
      reason: `Your ${testLabel} score of ${score} does not meet the published minimum of ${req.minScore}.`,
      isMandatory: true,
    };
  };

  const ieltsEval = compareNamedTest('IELTS', 'ielts', 'ielts');
  if (ieltsEval) return ieltsEval;
  const toeflEval = compareNamedTest('TOEFL', 'toefl', 'toefl');
  if (toeflEval) return toeflEval;
  const pteEval = compareNamedTest('PTE', 'pte', 'pte');
  if (pteEval) return pteEval;

  // Scholarship records a language expectation without a named cutoff
  if (req.test === 'any') {
    return {
      criterion: 'Language Proficiency',
      status: 'unknown',
      studentValue: `${profile.languageTest.toUpperCase()} ${score}`.trim(),
      requiredValue: req.note || 'Institutional or host-university language evaluation',
      reason: `A language test is recorded, but this award does not publish a single named cutoff that can be compared in the matcher. ${req.note || 'Confirm with the provider or host university.'}`.trim(),
      isMandatory: false,
    };
  }

  // Different test type entered (e.g. student has TOEFL, scholarship specified IELTS or vice versa)
  return {
    criterion: 'Language Proficiency (Test Equivalency)',
    status: 'unknown',
    studentValue: `${profile.languageTest.toUpperCase()} ${score}`,
    requiredValue: `${req.test.toUpperCase()} minimum ${req.minScore}`,
    reason: `You reported a ${profile.languageTest.toUpperCase()} score. Verify official test conversion table directly on the scholarship admissions portal.`,
    isMandatory: true,
  };
}

/**
 * Checks work experience requirements if explicitly mandated.
 */
export function checkWorkExperience(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): CriterionEvaluation | null {
  if (!scholarship.workExperienceRequiredYears || scholarship.workExperienceRequiredYears <= 0) {
    return null;
  }

  const reqYears = scholarship.workExperienceRequiredYears;
  if (profile.workExperienceYears === undefined || profile.workExperienceYears === null) {
    return {
      criterion: 'Work Experience',
      status: 'unknown',
      studentValue: 'Not specified',
      requiredValue: `Minimum ${reqYears} year(s)`,
      reason: 'Work experience was not provided, so the mandatory experience requirement cannot be confirmed.',
      isMandatory: true,
    };
  }
  const studentYears = profile.workExperienceYears;

  if (studentYears >= reqYears) {
    return {
      criterion: 'Work Experience',
      status: 'meets',
      studentValue: `${studentYears} year(s)`,
      requiredValue: `Minimum ${reqYears} year(s) (${reqYears * 1400} hours)`,
      reason: `Your ${studentYears} year(s) of verified work experience meets the mandatory ${reqYears}-year minimum.`,
      isMandatory: true,
    };
  }

  return {
    criterion: 'Work Experience',
    status: 'does_not_meet',
    studentValue: `${studentYears} year(s)`,
    requiredValue: `Minimum ${reqYears} year(s)`,
    reason: `You have ${studentYears} year(s) of work experience, which is below the mandatory minimum of ${reqYears} year(s).`,
    isMandatory: true,
  };
}

function isApplicationPledgeCriterion(text: string): boolean {
  const n = text.toLowerCase();
  return (
    n.includes('return home') ||
    n.includes('return to country') ||
    n.includes('return to their home') ||
    n.includes('returning to pakistan') ||
    n.includes('serve pakistan') ||
    n.includes('legal bond') ||
    n.includes('unable to afford') ||
    n.includes('financial need') ||
    n.includes('nominat') ||
    n.includes('maximum 3') ||
    n.includes('mandatory mobility') ||
    n.includes('willing to spend')
  );
}

/**
 * Surfaces recorded mandatory criteria that cannot be checked with the current profile schema.
 * Does not invent cutoffs. Application pledges (return-home, bonds) are not treated as profile facts.
 */
export function evaluateUncheckableRecordedCriteria(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): CriterionEvaluation[] {
  const extra: CriterionEvaluation[] = [];
  const seen = new Set<string>();

  const pushUnknown = (
    key: string,
    criterionName: string,
    requiredValue: string,
    reason: string
  ) => {
    if (seen.has(key)) return;
    seen.add(key);
    extra.push({
      criterion: criterionName,
      status: 'unknown',
      studentValue: 'Not collected in current profile',
      requiredValue,
      reason,
      isMandatory: true,
    });
  };

  for (const criterion of scholarship.mandatoryCriteria) {
    const text = `${criterion.label} ${criterion.description}`;
    if (isApplicationPledgeCriterion(text)) continue;

    if (/\bage\b/i.test(text) || /under \d+/i.test(text) || /born on or after/i.test(text)) {
      pushUnknown(
        'age',
        'Age Requirement',
        criterion.label,
        `The record lists an age condition (${criterion.label}), but the current profile schema does not include age or date of birth. This is not treated as meeting the requirement.`
      );
      continue;
    }

    const testMatch = text.match(/\b(GRE|HAT|GMAT)\b/i);
    if (testMatch) {
      const testName = testMatch[1].toUpperCase();
      pushUnknown(
        `test-${testName}`,
        `Standardized Test (${testName})`,
        criterion.label,
        `The record requires ${testName}, but the current profile schema has no ${testName} score field. This is not treated as meeting the requirement.`
      );
      continue;
    }

    if (
      /within last \d+\s+years/i.test(text) ||
      /not have been obtained more than/i.test(text) ||
      /at least two years before/i.test(text) ||
      /degree obtained within/i.test(text)
    ) {
      pushUnknown(
        'degree-recency',
        'Degree Recency',
        criterion.label,
        `The record lists a degree-recency or post-graduation waiting rule (${criterion.label}), which cannot be confirmed from the current profile. This is not treated as meeting the requirement.`
      );
      continue;
    }

    if (/\bresid/i.test(text) || /lived in/i.test(text)) {
      const needsPakistanResidence = /pakistan/i.test(text) && /resid/i.test(text);
      if (needsPakistanResidence) {
        const residence = (profile.residenceCountry || '').trim().toLowerCase();
        if (!residence) {
          pushUnknown(
            'residence',
            'Country of Residence',
            criterion.label,
            'The record requires residence in Pakistan during the application process, but residence country was not provided. This is not treated as meeting the requirement.'
          );
        } else if (residence === 'pakistan') {
          if (!seen.has('residence')) {
            seen.add('residence');
            extra.push({
              criterion: 'Country of Residence',
              status: 'meets',
              studentValue: profile.residenceCountry || residence,
              requiredValue: criterion.label,
              reason: 'Your stated country of residence is Pakistan, which matches the recorded residence rule.',
              isMandatory: true,
            });
          }
        } else {
          if (!seen.has('residence')) {
            seen.add('residence');
            extra.push({
              criterion: 'Country of Residence',
              status: 'does_not_meet',
              studentValue: profile.residenceCountry || residence,
              requiredValue: criterion.label,
              reason: `The record requires residence in Pakistan. Your stated residence (${profile.residenceCountry}) does not match that rule.`,
              isMandatory: true,
            });
          }
        }
      } else if (/permanent residenc/i.test(text)) {
        pushUnknown(
          'permanent-residency',
          'Permanent Residency Restriction',
          criterion.label,
          `The record restricts Australian/NZ or similar permanent residency (${criterion.label}), which is not a field in the current profile. This is not treated as meeting the requirement.`
        );
      } else {
        pushUnknown(
          'residence-limitation',
          'Residence Limitation',
          criterion.label,
          `The record lists a residence-duration or location condition (${criterion.label}) that cannot be verified from the current profile. This is not treated as meeting the requirement.`
        );
      }
      continue;
    }

    if (/\bhealth\b/i.test(text) || /\bmedical\b/i.test(text) || /physically and mentally/i.test(text)) {
      pushUnknown(
        'health',
        'Health / Medical Certificate',
        criterion.label,
        `The record requires a health or medical clearance (${criterion.label}), which is not collected in the current profile. This is not treated as meeting the requirement.`
      );
      continue;
    }

    if (/embassy/i.test(text) && /(exam|interview|written)/i.test(text)) {
      pushUnknown(
        'embassy-exam',
        'Embassy Screening Examination',
        criterion.label,
        `The record requires an embassy written examination or interview (${criterion.label}). Outcome cannot be known from the current profile and is not treated as meeting the requirement.`
      );
      continue;
    }

    if (/not currently enrolled|currently enrolled/i.test(text)) {
      pushUnknown(
        'current-enrollment',
        'Current Enrollment Status',
        criterion.label,
        `The record includes an enrollment-status requirement (${criterion.label}), but current enrollment is not collected in the profile. This is not treated as meeting the requirement.`
      );
    }
  }

  return extra;
}

/**
 * Evaluates expense-by-expense funding reality check.
 */
export function evaluateFundingCheck(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): {
  assessment: FundingAssessment;
  summary: string;
  items: FundingComparisonItem[];
} {
  const priorities = profile.fundingPriorities;
  const breakdown = scholarship.fundingBreakdown;

  const expenseKeys: { key: keyof typeof breakdown; label: string }[] = [
    { key: 'tuition', label: 'Tuition Fees' },
    { key: 'stipend', label: 'Living Expenses / Stipend' },
    { key: 'accommodation', label: 'Accommodation' },
    { key: 'travel', label: 'Airfare / Travel' },
    { key: 'healthInsurance', label: 'Health Insurance' },
    { key: 'visaFees', label: 'Visa Fees' },
  ];

  const items: FundingComparisonItem[] = [];
  let hasFailedMandatory = false;
  let hasUnknownMandatory = false;
  let hasPartiallyCoveredMust = false;
  let totalMustCount = 0;
  let satisfiedMustCount = 0;

  const failedMustExpenses: string[] = [];
  const unknownMustExpenses: string[] = [];
  const partialMustExpenses: string[] = [];
  const preferredGapExpenses: string[] = [];

  for (const exp of expenseKeys) {
    const priority: PriorityLevel = priorities[exp.key as keyof typeof priorities] || 'not_priority';
    const comp = breakdown[exp.key];
    const status = comp?.status ?? 'unknown';

    let satisfies = false;

    if (priority === 'not_priority') {
      satisfies = true;
    } else if (priority === 'preferred') {
      satisfies = status === 'covered' || status === 'partial';
      if (status !== 'covered') {
        preferredGapExpenses.push(`${exp.label} (${status.replace('_', ' ')})`);
      }
    } else if (priority === 'must') {
      totalMustCount++;
      if (status === 'covered') {
        satisfies = true;
        satisfiedMustCount++;
      } else if (status === 'partial') {
        satisfies = false; // Partial coverage does not fully satisfy a strict must-cover
        hasPartiallyCoveredMust = true;
        partialMustExpenses.push(exp.label);
      } else if (status === 'not_covered') {
        satisfies = false;
        hasFailedMandatory = true;
        failedMustExpenses.push(exp.label);
      } else if (status === 'unknown') {
        satisfies = false;
        hasUnknownMandatory = true;
        unknownMustExpenses.push(exp.label);
      } else if (status === 'not_applicable') {
        satisfies = false;
        hasFailedMandatory = true;
        failedMustExpenses.push(`${exp.label} (not applicable in record)`);
      }
    }

    items.push({
      expense: exp.label,
      expenseKey: exp.key,
      priority,
      coverage: status,
      detail: comp?.amountOrDetail,
      satisfiesPriority: satisfies,
      evidenceNote: comp?.evidenceNote || 'No evidence note provided.',
    });
  }

  let assessment: FundingAssessment = 'meets_needs';
  let summary = '';
  const mandatoryLabel =
    totalMustCount > 0
      ? `Mandatory priorities assessed: ${[...new Set(
          items.filter((item) => item.priority === 'must').map((item) => item.expense)
        )].join(', ')}.`
      : 'No expenses are marked as mandatory in your current profile.';
  const preferredGapLabel =
    preferredGapExpenses.length > 0
      ? ` Preferred expense gaps requiring review: ${preferredGapExpenses.join(', ')}.`
      : ' No preferred-expense gaps were identified.';

  if (hasFailedMandatory) {
    assessment = 'does_not_meet_mandatory';
    summary = `${mandatoryLabel} Does not meet mandatory financial requirements: ${failedMustExpenses.join(', ')}.${preferredGapLabel}`;
  } else if (hasUnknownMandatory) {
    assessment = 'unknown';
    summary = `${mandatoryLabel} Unconfirmed mandatory funding: Official coverage for ${unknownMustExpenses.join(', ')} is unknown or unverified. Verification required before assuming full coverage.${preferredGapLabel}`;
  } else if (hasPartiallyCoveredMust || satisfiedMustCount < totalMustCount) {
    assessment = 'partially_meets';
    const incompleteExpenses = partialMustExpenses.length > 0
      ? partialMustExpenses
      : ['one or more mandatory expenses'];
    summary = `${mandatoryLabel} Partially satisfies mandatory funding priorities: ${incompleteExpenses.join(', ')} not fully covered.${preferredGapLabel}`;
  } else {
    assessment = 'meets_needs';
    summary = `${mandatoryLabel} All selected mandatory expenses are covered according to the recorded package data.${preferredGapLabel}`;
  }

  return { assessment, summary, items };
}

/**
 * Calculates a transparent, deterministic profile-and-preference fit score (0-100).
 * Never claims win probability or overrides a failed mandatory criterion.
 */
export function calculateFitScore(
  profile: StudentProfile,
  scholarship: ScholarshipRecord,
  evaluations: CriterionEvaluation[],
  fundingAssessment: FundingAssessment
): {
  score: number;
  breakdown: MatchResult['fitScoreBreakdown'];
} {
  // If any mandatory criterion definitively fails, the score reflects that it is not viable
  const failedMandatory = evaluations.filter(
    (e) => e.isMandatory && e.status === 'does_not_meet'
  ).length;
  const unknownMandatory = evaluations.filter(
    (e) => e.isMandatory && e.status === 'unknown'
  ).length;

  let academicScore = 0;
  let nationalityScore = 0;
  let degreeScore = 0;
  let fieldScore = 0;
  let destinationScore = 0;
  let fundingFitScore = 0;

  // 1. Academic (max 25)
  const acadEval = evaluations.find((e) => e.criterion.startsWith('Academic Minimum'));
  if (acadEval?.status === 'meets') academicScore = 25;
  else if (acadEval?.status === 'unknown') academicScore = 15;
  else academicScore = 0;

  // 2. Nationality (max 20)
  const natEval = evaluations.find((e) => e.criterion === 'Nationality');
  if (natEval?.status === 'meets') nationalityScore = 20;
  else nationalityScore = 0;

  // 3. Degree Level (max 15)
  const degEval = evaluations.find((e) => e.criterion === 'Intended Degree Level');
  if (degEval?.status === 'meets') degreeScore = 15;
  else degreeScore = 0;

  // 4. Field of Study (max 15)
  const fieldEval = evaluations.find((e) => e.criterion === 'Field of Study');
  if (fieldEval?.status === 'meets') fieldScore = 15;
  else if (fieldEval?.status === 'unknown') fieldScore = 8;
  else fieldScore = 0;

  // 5. Destination Preference Fit (max 10)
  const prefersAny = profile.preferredDestinations.some((d) => d.toLowerCase() === 'any');
  const destMatch = profile.preferredDestinations.some(
    (d) =>
      d.toLowerCase() === scholarship.destinationCountry.toLowerCase() ||
      scholarship.destinationCountry.toLowerCase().includes(d.toLowerCase())
  );
  if (prefersAny || destMatch) {
    destinationScore = 10;
  } else {
    destinationScore = 2; // Opportunity exists in different country
  }

  // 6. Funding Fit (max 15)
  if (fundingAssessment === 'meets_needs') fundingFitScore = 15;
  else if (fundingAssessment === 'partially_meets') fundingFitScore = 10;
  else if (fundingAssessment === 'unknown') fundingFitScore = 7;
  else fundingFitScore = 0;

  let rawTotal =
    academicScore +
    nationalityScore +
    degreeScore +
    fieldScore +
    destinationScore +
    fundingFitScore;

  // Failed mandatory criteria cannot look like a viable confirmed match.
  if (failedMandatory > 0) {
    rawTotal = Math.min(rawTotal, 30);
  } else if (unknownMandatory > 0) {
    // Unknown mandatory criteria cannot imply confirmed eligibility.
    rawTotal = Math.min(rawTotal, 64);
  }

  return {
    score: Math.round(rawTotal),
    breakdown: {
      academicScore,
      nationalityScore,
      degreeScore,
      fieldScore,
      destinationScore,
      fundingFitScore,
    },
  };
}

/**
 * Main deterministic matching function comparing a student profile against a single scholarship record.
 */
export function matchScholarship(
  profile: StudentProfile,
  scholarship: ScholarshipRecord
): MatchResult {
  const evaluations: CriterionEvaluation[] = [];

  // 1. Nationality check
  evaluations.push(checkNationality(profile.nationality, scholarship));

  // 2. Degree level check
  evaluations.push(checkDegreeLevel(profile.intendedDegree, scholarship));

  // 3. Current education status check (distinguishes in-progress vs completed)
  evaluations.push(checkEducationStatus(profile, scholarship));

  // 4. Field of study check
  evaluations.push(checkFieldOfStudy(profile.fieldOfStudy, scholarship));

  // 4. Academic requirements check
  evaluations.push(checkAcademicRequirements(profile, scholarship));

  // 5. Language requirements check
  evaluations.push(checkLanguageRequirements(profile, scholarship));

  // 6. Work experience check (if applicable)
  const workEval = checkWorkExperience(profile, scholarship);
  if (workEval) evaluations.push(workEval);

  // 7. Age / GRE / HAT and similar structured-gap criteria from the record
  evaluations.push(...evaluateUncheckableRecordedCriteria(profile, scholarship));

  // Calculate failed and unknown mandatory counts
  const failedMandatoryCount = evaluations.filter(
    (e) => e.isMandatory && e.status === 'does_not_meet'
  ).length;

  const unknownMandatoryCount = evaluations.filter(
    (e) => e.isMandatory && e.status === 'unknown'
  ).length;

  // Determine overall status according to strict product principles
  let overallStatus: OverallEligibilityStatus = 'potential_match';
  let statusLabel = '';
  let statusSummary = '';

  if (failedMandatoryCount > 0) {
    overallStatus = 'likely_ineligible';
    statusLabel = 'Likely Ineligible';
    statusSummary = `Based on available information, ${failedMandatoryCount} mandatory requirement(s) are not satisfied.`;
  } else if (unknownMandatoryCount > 0) {
    overallStatus = 'potential_match';
    statusLabel = 'Potential Match — Verify Requirements';
    statusSummary = `${unknownMandatoryCount} mandatory criteria require manual credential or provider verification before confirming eligibility.`;
  } else {
    overallStatus = 'matches_known';
    statusLabel = 'Matches Known Requirements';
    statusSummary =
      'All evaluated mandatory criteria appear satisfied based on your profile. Confirm final details with provider.';
  }

  // 7. Funding reality check
  const fundingCheck = evaluateFundingCheck(profile, scholarship);

  // 8. Deterministic fit score
  const { score: fitScore, breakdown: fitScoreBreakdown } = calculateFitScore(
    profile,
    scholarship,
    evaluations,
    fundingCheck.assessment
  );

  return {
    scholarship,
    overallStatus,
    statusLabel,
    statusSummary,
    fitScore,
    fitScoreBreakdown,
    evaluations,
    failedMandatoryCount,
    unknownMandatoryCount,
    fundingAssessment: fundingCheck.assessment,
    fundingAssessmentSummary: fundingCheck.summary,
    fundingMatches: fundingCheck.items,
  };
}

/**
 * Runs matching on an entire list of scholarships and sorts according to specified order.
 */
export function matchAllScholarships(
  profile: StudentProfile,
  scholarships: ScholarshipRecord[]
): MatchResult[] {
  return scholarships.map((s) => matchScholarship(profile, s));
}
