const MAX_TEXT_LENGTH = 500;
export const MAX_CHAT_QUESTION_LENGTH = 2000;

type RecordValue = Record<string, unknown>;

export interface ValidatedProfile {
  nationality: string;
  intendedDegree: string;
  fieldOfStudy: string;
  grade?: number;
  gradeScale: string;
  fundingPriorities: RecordValue;
  currentEducationLevel?: string;
  currentDegreeProgram?: string;
  specialization?: string;
  languageTest?: string;
  languageScore?: number;
  workExperienceYears?: number;
}

interface ValidatedFundingComponent {
  status: string;
  amountOrDetail?: string;
}

export interface ValidatedScholarship {
  name?: string;
  provider?: string;
  destinationCountry?: string;
  eligibleDegrees?: string[];
  eligibleNationalities?: string[];
  minGrade?: { minimum?: number; scale: string };
  workExperienceRequiredYears?: number;
  fundingType?: string;
  officialUrl?: string;
  lastChecked?: string;
  verificationStatus?: string;
  deadlineStatus?: string;
  applicationDeadline?: string;
  deadlineNote?: string;
  sourceTitle?: string;
  fundingBreakdown: Record<string, ValidatedFundingComponent>;
  exclusions?: string[];
  mandatoryCriteria?: { label: string }[];
}

export interface ValidatedMatchEvaluation {
  overallStatus: string;
  statusLabel: string;
  fitScore?: number;
  fundingAssessment: string;
  fundingAssessmentSummary: string;
  evaluations: Array<{
    criterion: string;
    status: string;
    studentValue: string;
    requiredValue: string;
    reason: string;
  }>;
}

export class AIRequestValidationError extends Error {}

function asRecord(value: unknown, name: string): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AIRequestValidationError(`${name} must be an object.`);
  }
  return value as RecordValue;
}

function assertAllowedKeys(value: RecordValue, allowed: readonly string[], name: string): void {
  const unexpected = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unexpected.length > 0) {
    throw new AIRequestValidationError(`${name} contains unsupported field(s).`);
  }
}

function optionalText(value: unknown, name: string, maxLength = MAX_TEXT_LENGTH): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new AIRequestValidationError(`${name} must be a string of at most ${maxLength} characters.`);
  }
  return value;
}

function requiredText(value: unknown, name: string, maxLength = MAX_TEXT_LENGTH): string {
  const text = optionalText(value, name, maxLength);
  if (!text) throw new AIRequestValidationError(`${name} is required.`);
  return text;
}

function optionalNumber(value: unknown, name: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AIRequestValidationError(`${name} must be a finite number.`);
  }
  return value;
}

function requiredArray(value: unknown, name: string, maxItems = 20): string[] {
  if (!Array.isArray(value) || value.length > maxItems || value.some((item) => typeof item !== 'string' || item.length > MAX_TEXT_LENGTH)) {
    throw new AIRequestValidationError(`${name} must be an array of short strings.`);
  }
  return [...value];
}

function validateFundingPriorities(value: unknown): RecordValue {
  const priorities = asRecord(value, 'profile.fundingPriorities');
  const allowed = ['tuition', 'stipend', 'accommodation', 'travel', 'healthInsurance', 'visaFees'];
  assertAllowedKeys(priorities, allowed, 'profile.fundingPriorities');
  for (const key of allowed) {
    if (priorities[key] !== undefined && !['must', 'preferred', 'not_priority'].includes(String(priorities[key]))) {
      throw new AIRequestValidationError(`profile.fundingPriorities.${key} is invalid.`);
    }
  }
  return { ...priorities };
}

function validateProfile(value: unknown, fields: readonly string[]): ValidatedProfile {
  const profile = asRecord(value, 'profile');
  assertAllowedKeys(profile, fields, 'profile');
  const validated: ValidatedProfile = {
    nationality: requiredText(profile.nationality, 'profile.nationality'),
    intendedDegree: requiredText(profile.intendedDegree, 'profile.intendedDegree'),
    fieldOfStudy: requiredText(profile.fieldOfStudy, 'profile.fieldOfStudy'),
    grade: optionalNumber(profile.grade, 'profile.grade'),
    gradeScale: requiredText(profile.gradeScale, 'profile.gradeScale'),
    fundingPriorities: validateFundingPriorities(profile.fundingPriorities),
  };

  if (fields.includes('currentEducationLevel')) {
    validated.currentEducationLevel = optionalText(profile.currentEducationLevel, 'profile.currentEducationLevel');
  }
  if (fields.includes('currentDegreeProgram')) {
    validated.currentDegreeProgram = optionalText(profile.currentDegreeProgram, 'profile.currentDegreeProgram');
  }
  if (fields.includes('specialization')) {
    validated.specialization = optionalText(profile.specialization, 'profile.specialization');
  }
  if (fields.includes('languageTest')) {
    validated.languageTest = optionalText(profile.languageTest, 'profile.languageTest');
  }
  if (fields.includes('workExperienceYears')) {
    validated.workExperienceYears = optionalNumber(profile.workExperienceYears, 'profile.workExperienceYears');
  }
  if (fields.includes('languageScore')) {
    validated.languageScore = optionalNumber(profile.languageScore, 'profile.languageScore');
  }
  return validated;
}

function validateFundingBreakdown(value: unknown): Record<string, ValidatedFundingComponent> {
  const breakdown = asRecord(value, 'scholarship.fundingBreakdown');
  const allowed = ['tuition', 'stipend', 'accommodation', 'travel', 'healthInsurance', 'visaFees'];
  assertAllowedKeys(breakdown, allowed, 'scholarship.fundingBreakdown');
  const result: Record<string, ValidatedFundingComponent> = {};
  for (const key of allowed) {
    const component = asRecord(breakdown[key], `scholarship.fundingBreakdown.${key}`);
    assertAllowedKeys(component, ['status', 'amountOrDetail'], `scholarship.fundingBreakdown.${key}`);
    result[key] = {
      status: requiredText(component.status, `scholarship.fundingBreakdown.${key}.status`, 40),
      amountOrDetail: optionalText(component.amountOrDetail, `scholarship.fundingBreakdown.${key}.amountOrDetail`),
    };
  }
  return result;
}

function validateScholarship(value: unknown, fields: readonly string[]): ValidatedScholarship {
  const scholarship = asRecord(value, 'scholarship');
  assertAllowedKeys(scholarship, fields, 'scholarship');
  const result: ValidatedScholarship = {
    fundingBreakdown: validateFundingBreakdown(scholarship.fundingBreakdown),
  };
  for (const field of ['name', 'provider', 'destinationCountry', 'fundingType']) {
    if (fields.includes(field)) {
      const text = requiredText(scholarship[field], `scholarship.${field}`);
      if (field === 'name') result.name = text;
      if (field === 'provider') result.provider = text;
      if (field === 'destinationCountry') result.destinationCountry = text;
      if (field === 'fundingType') result.fundingType = text;
    }
  }
  if (fields.includes('officialUrl')) result.officialUrl = optionalText(scholarship.officialUrl, 'scholarship.officialUrl', 2000);
  if (fields.includes('lastChecked')) result.lastChecked = optionalText(scholarship.lastChecked, 'scholarship.lastChecked', 40);
  if (fields.includes('verificationStatus')) result.verificationStatus = optionalText(scholarship.verificationStatus, 'scholarship.verificationStatus', 40);
  if (fields.includes('applicationDeadline')) result.applicationDeadline = optionalText(scholarship.applicationDeadline, 'scholarship.applicationDeadline', 200);
  if (fields.includes('deadlineNote')) result.deadlineNote = optionalText(scholarship.deadlineNote, 'scholarship.deadlineNote', 2000);
  if (fields.includes('sourceTitle')) result.sourceTitle = optionalText(scholarship.sourceTitle, 'scholarship.sourceTitle', 200);
  if (fields.includes('eligibleDegrees')) result.eligibleDegrees = requiredArray(scholarship.eligibleDegrees, 'scholarship.eligibleDegrees');
  if (fields.includes('eligibleNationalities')) result.eligibleNationalities = requiredArray(scholarship.eligibleNationalities, 'scholarship.eligibleNationalities');
  if (fields.includes('mandatoryCriteria')) {
    if (!Array.isArray(scholarship.mandatoryCriteria) || scholarship.mandatoryCriteria.length > 50) {
      throw new AIRequestValidationError('scholarship.mandatoryCriteria must be an array.');
    }
    result.mandatoryCriteria = scholarship.mandatoryCriteria.map((criterion, index) => {
      const item = asRecord(criterion, `scholarship.mandatoryCriteria[${index}]`);
      assertAllowedKeys(item, ['label'], `scholarship.mandatoryCriteria[${index}]`);
      return { label: requiredText(item.label, `scholarship.mandatoryCriteria[${index}].label`) };
    });
  }
  if (fields.includes('exclusions')) result.exclusions = requiredArray(scholarship.exclusions, 'scholarship.exclusions', 50);
  if (fields.includes('deadlineStatus')) result.deadlineStatus = requiredText(scholarship.deadlineStatus, 'scholarship.deadlineStatus', 40);
  if (fields.includes('minGrade') && scholarship.minGrade !== undefined) {
    const minGrade = asRecord(scholarship.minGrade, 'scholarship.minGrade');
    assertAllowedKeys(minGrade, ['minimum', 'scale'], 'scholarship.minGrade');
    result.minGrade = {
      minimum: optionalNumber(minGrade.minimum, 'scholarship.minGrade.minimum'),
      scale: requiredText(minGrade.scale, 'scholarship.minGrade.scale', 40),
    };
  }
  if (fields.includes('workExperienceRequiredYears')) {
    result.workExperienceRequiredYears = optionalNumber(
      scholarship.workExperienceRequiredYears,
      'scholarship.workExperienceRequiredYears'
    );
  }
  return result;
}

const EXPLAIN_PROFILE_FIELDS = [
  'nationality', 'currentEducationLevel', 'currentDegreeProgram', 'intendedDegree',
  'fieldOfStudy', 'specialization', 'grade', 'gradeScale', 'workExperienceYears',
  'languageTest', 'languageScore', 'fundingPriorities',
] as const;

export function validateExplainMatchRequest(body: unknown): {
  profile: ValidatedProfile;
  scholarship: ValidatedScholarship;
  matchEvaluation: ValidatedMatchEvaluation;
} {
  const request = asRecord(body, 'request');
  assertAllowedKeys(request, ['profile', 'scholarship', 'matchEvaluation'], 'request');
  const evaluation = asRecord(request.matchEvaluation, 'matchEvaluation');
  assertAllowedKeys(evaluation, ['overallStatus', 'statusLabel', 'fitScore', 'fundingAssessment', 'fundingAssessmentSummary', 'evaluations'], 'matchEvaluation');
  if (!Array.isArray(evaluation.evaluations) || evaluation.evaluations.length > 100) {
    throw new AIRequestValidationError('matchEvaluation.evaluations must be an array.');
  }
  const evaluations = evaluation.evaluations.map((entry, index) => {
    const item = asRecord(entry, `matchEvaluation.evaluations[${index}]`);
    assertAllowedKeys(item, ['criterion', 'status', 'studentValue', 'requiredValue', 'reason'], `matchEvaluation.evaluations[${index}]`);
    return {
      criterion: requiredText(item.criterion, `matchEvaluation.evaluations[${index}].criterion`),
      status: requiredText(item.status, `matchEvaluation.evaluations[${index}].status`, 40),
      studentValue: requiredText(item.studentValue, `matchEvaluation.evaluations[${index}].studentValue`),
      requiredValue: requiredText(item.requiredValue, `matchEvaluation.evaluations[${index}].requiredValue`),
      reason: requiredText(item.reason, `matchEvaluation.evaluations[${index}].reason`),
    };
  });
  return {
    profile: validateProfile(request.profile, EXPLAIN_PROFILE_FIELDS),
    scholarship: validateScholarship(request.scholarship, [
      'name', 'provider', 'destinationCountry', 'eligibleDegrees', 'eligibleNationalities',
      'minGrade', 'workExperienceRequiredYears', 'fundingType', 'officialUrl',
      'lastChecked', 'verificationStatus', 'fundingBreakdown',
    ]),
    matchEvaluation: {
      overallStatus: requiredText(evaluation.overallStatus, 'matchEvaluation.overallStatus', 40),
      statusLabel: requiredText(evaluation.statusLabel, 'matchEvaluation.statusLabel'),
      fitScore: optionalNumber(evaluation.fitScore, 'matchEvaluation.fitScore'),
      fundingAssessment: requiredText(evaluation.fundingAssessment, 'matchEvaluation.fundingAssessment', 40),
      fundingAssessmentSummary: requiredText(evaluation.fundingAssessmentSummary, 'matchEvaluation.fundingAssessmentSummary'),
      evaluations,
    },
  };
}

export function validateChatRequest(body: unknown): {
  question: string;
  scholarship: ValidatedScholarship;
  profile: ValidatedProfile;
} {
  const request = asRecord(body, 'request');
  assertAllowedKeys(request, ['question', 'scholarship', 'profile'], 'request');
  const question = requiredText(request.question, 'question', MAX_CHAT_QUESTION_LENGTH);
  return {
    question,
    scholarship: validateScholarship(request.scholarship, ['name', 'officialUrl', 'fundingBreakdown']),
    profile: validateProfile(request.profile, EXPLAIN_PROFILE_FIELDS),
  };
}

export function validateCompareRequest(body: unknown): {
  scholarships: ValidatedScholarship[];
  profile: ValidatedProfile;
} {
  const request = asRecord(body, 'request');
  assertAllowedKeys(request, ['scholarships', 'profile'], 'request');
  if (!Array.isArray(request.scholarships) || request.scholarships.length < 2 || request.scholarships.length > 3) {
    throw new AIRequestValidationError('scholarships must contain 2 or 3 records.');
  }
  const profile = validateProfile(request.profile, [
    'nationality', 'intendedDegree', 'fieldOfStudy', 'grade', 'gradeScale', 'fundingPriorities',
  ]);
  const scholarships = request.scholarships.map((scholarship) =>
    validateScholarship(scholarship, [
      'name', 'provider', 'destinationCountry', 'deadlineStatus', 'applicationDeadline',
      'deadlineNote', 'verificationStatus', 'sourceTitle', 'fundingType',
      'fundingBreakdown', 'exclusions', 'mandatoryCriteria',
    ])
  );
  return { scholarships, profile };
}
