export type PriorityLevel = 'must' | 'preferred' | 'not_priority';

export type CoverageStatus = 'covered' | 'partial' | 'not_covered' | 'unknown' | 'not_applicable';

export interface FundingComponent {
  status: CoverageStatus;
  amountOrDetail?: string;
  evidenceNote: string;
  sourceUrl?: string;
}

export interface FundingBreakdown {
  tuition: FundingComponent;
  stipend: FundingComponent;
  accommodation: FundingComponent;
  travel: FundingComponent;
  healthInsurance: FundingComponent;
  visaFees: FundingComponent;
  otherCosts?: FundingComponent;
}

export type VerificationStatus = 'verified_official' | 'needs_verification' | 'demo_data';

export type DeadlineStatus = 'open' | 'upcoming' | 'closed' | 'unconfirmed';

export interface ScholarshipRecord {
  id: string;
  name: string;
  provider: string;
  shortDescription: string;
  destinationCountry: string;
  eligibleNationalities: string[]; // e.g. ['All'] or ['Pakistan', 'Developing Countries', ...]
  eligibleDegrees: ('bachelor' | 'master' | 'phd' | 'postdoc')[];
  eligibleFields: string[]; // e.g. ['All'] or specific fields
  minGrade?: {
    minimum: number;
    scale: '4.0' | '5.0' | 'percentage';
    flexibleEquivalencyNote?: string;
  };
  languageRequirements?: {
    test: 'ielts' | 'toefl' | 'pte' | 'any';
    minScore: number;
    note?: string;
  };
  workExperienceRequiredYears?: number;
  mandatoryCriteria: {
    id: string;
    label: string;
    description: string;
  }[];
  requiredDocuments: string[];
  applicationOpeningDate?: string; // e.g. '2026-08-01'
  applicationDeadline?: string; // e.g. '2026-11-05'
  deadlineStatus: DeadlineStatus;
  deadlineNote?: string;
  fundingType: 'Fully Funded' | 'Tuition + Stipend' | 'Tuition Only' | 'Partial / Grant';
  fundingBreakdown: FundingBreakdown;
  exclusions: string[];
  officialUrl: string;
  officialSourceUrl?: string;
  sourceTitle?: string;
  additionalUrls?: { title: string; url: string }[];
  lastChecked: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
}

export interface StudentProfile {
  fullName?: string;
  nationality: string;
  residenceCountry?: string;
  currentEducationLevel: 'bachelor_in_progress' | 'bachelor_completed' | 'master_in_progress' | 'master_completed' | 'high_school' | 'other';
  currentDegreeProgram?: string;
  intendedDegree: 'bachelor' | 'master' | 'phd' | 'postdoc';
  fieldOfStudy: string;
  specialization?: string;
  grade: number;
  gradeScale: '4.0' | '5.0' | '10.0' | 'percentage';
  institution?: string;
  expectedGraduationYear?: number;
  preferredIntakeYear?: number;
  languageTest: 'ielts' | 'toefl' | 'pte' | 'none_planned' | 'not_taken';
  languageScore?: number;
  preferredDestinations: string[]; // ['Any'] or list of countries
  fundingPreference: 'fully_funded' | 'substantial_partial' | 'tuition_only' | 'any';
  fundingPriorities: {
    tuition: PriorityLevel;
    stipend: PriorityLevel;
    accommodation: PriorityLevel;
    travel: PriorityLevel;
    healthInsurance: PriorityLevel;
    visaFees: PriorityLevel;
  };
  workExperienceYears?: number;
}

export type CriterionEvaluationStatus = 'meets' | 'does_not_meet' | 'unknown' | 'not_applicable';

export interface CriterionEvaluation {
  criterion: string;
  status: CriterionEvaluationStatus;
  studentValue: string;
  requiredValue: string;
  reason: string;
  isMandatory: boolean;
}

export type OverallEligibilityStatus = 'matches_known' | 'potential_match' | 'likely_ineligible';

export type FundingAssessment = 'meets_needs' | 'partially_meets' | 'does_not_meet_mandatory' | 'unknown';

export interface FundingComparisonItem {
  expense: string;
  expenseKey: keyof FundingBreakdown;
  priority: PriorityLevel;
  coverage: CoverageStatus;
  detail?: string;
  satisfiesPriority: boolean;
  evidenceNote: string;
}

export interface MatchResult {
  scholarship: ScholarshipRecord;
  overallStatus: OverallEligibilityStatus;
  statusLabel: string;
  statusSummary: string;
  fitScore: number; // 0 - 100 purely based on profile/preference match, never claims win probability
  fitScoreBreakdown: {
    academicScore: number;
    nationalityScore: number;
    degreeScore: number;
    fieldScore: number;
    destinationScore: number;
    fundingFitScore: number;
  };
  evaluations: CriterionEvaluation[];
  failedMandatoryCount: number;
  unknownMandatoryCount: number;
  fundingAssessment: FundingAssessment;
  fundingAssessmentSummary: string;
  fundingMatches: FundingComparisonItem[];
}

export interface RoadmapTask {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  title: string;
  description: string;
  category: 'mandatory_official' | 'general_preparation';
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate?: string;
  officialSourceUrl?: string;
}
