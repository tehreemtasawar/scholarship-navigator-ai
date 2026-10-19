import { StudentProfile } from '../types/scholarship';

export interface DemoProfileOption {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  expectedOutcome: string;
  profile: StudentProfile;
}

export const DEMO_PROFILES: DemoProfileOption[] = [
  {
    id: 'profile-a-meets',
    name: 'Profile A: High Achiever (Meets Known Requirements)',
    badge: 'Meets Criteria',
    tagline: 'BS CS graduate, 3.8/4.0 CGPA, IELTS 7.5, 2.5 years experience',
    description: 'Designed to verify that when all known mandatory requirements (degree, CGPA, IELTS, work experience, nationality) are met, opportunities appear as Strong Potential Matches with transparent evidence notes.',
    expectedOutcome: 'Matches known requirements for Chevening, Erasmus Mundus, Australia Awards, DAAD, and HEC Overseas.',
    profile: {
      fullName: 'Amina Khan',
      nationality: 'Pakistan',
      residenceCountry: 'Pakistan',
      currentEducationLevel: 'bachelor_completed',
      currentDegreeProgram: 'BS Computer Science',
      intendedDegree: 'master',
      fieldOfStudy: 'Computer Science & AI',
      specialization: 'Artificial Intelligence & Data Systems',
      grade: 3.8,
      gradeScale: '4.0',
      institution: 'NUST Islamabad',
      expectedGraduationYear: 2024,
      preferredIntakeYear: 2026,
      languageTest: 'ielts',
      languageScore: 7.5,
      preferredDestinations: ['United Kingdom', 'Germany', 'Australia', 'European Union (Multiple Countries)'],
      fundingPreference: 'fully_funded',
      fundingPriorities: {
        tuition: 'must',
        stipend: 'must',
        accommodation: 'preferred',
        travel: 'must',
        healthInsurance: 'preferred',
        visaFees: 'preferred'
      },
      workExperienceYears: 2.5
    }
  },
  {
    id: 'profile-b-fails',
    name: 'Profile B: Strict Boundary Check (Fails Mandatory Requirement)',
    badge: 'Fails Criteria',
    tagline: 'BS Engineering graduate, 2.3/4.0 CGPA, IELTS 5.5, 0.5 years experience',
    description: 'Designed to verify that a student failing non-negotiable criteria (e.g. CGPA < minimum requirement, inadequate work experience for Chevening) is explicitly categorized as "Likely Ineligible" and never hidden behind a soft score.',
    expectedOutcome: 'Fails Chevening (work experience < 2 yrs, CGPA < 3.0), fails Demo Merit Fellowship (CGPA 2.3 vs 3.5 min, IELTS 5.5 vs 7.0 min).',
    profile: {
      fullName: 'Bilal Ahmed',
      nationality: 'Pakistan',
      residenceCountry: 'Pakistan',
      currentEducationLevel: 'bachelor_completed',
      currentDegreeProgram: 'BS Electrical Engineering',
      intendedDegree: 'master',
      fieldOfStudy: 'Engineering & Technology',
      specialization: 'Telecommunications',
      grade: 2.3,
      gradeScale: '4.0',
      institution: 'FAST-NUCES Lahore',
      expectedGraduationYear: 2025,
      preferredIntakeYear: 2026,
      languageTest: 'ielts',
      languageScore: 5.5,
      preferredDestinations: ['United Kingdom'],
      fundingPreference: 'fully_funded',
      fundingPriorities: {
        tuition: 'must',
        stipend: 'must',
        accommodation: 'must',
        travel: 'must',
        healthInsurance: 'must',
        visaFees: 'must'
      },
      workExperienceYears: 0.5
    }
  },
  {
    id: 'profile-c-missing',
    name: 'Profile C: Incomplete / Scale Incompatibility (Needs Verification)',
    badge: 'Needs Verification',
    tagline: 'Percentage scale (72%), Language test not yet taken, Any destination',
    description: 'Designed to test uncertainty handling. Because the grade is in percentage and the English test is not yet taken, the engine flags these criteria as "Unknown / Needs Verification" instead of assuming they are satisfied.',
    expectedOutcome: 'Categorized as "Potential Match — Verify Remaining Requirements". Alerts student to verify credential equivalency and schedule IELTS/TOEFL.',
    profile: {
      fullName: 'Zainab Fatima',
      nationality: 'Pakistan',
      residenceCountry: 'Pakistan',
      currentEducationLevel: 'bachelor_completed',
      currentDegreeProgram: 'BSc Public Administration & Economics',
      intendedDegree: 'master',
      fieldOfStudy: 'Public Policy',
      specialization: 'Governance & Development Economics',
      grade: 72,
      gradeScale: 'percentage',
      institution: 'University of the Punjab',
      expectedGraduationYear: 2023,
      preferredIntakeYear: 2026,
      languageTest: 'not_taken',
      languageScore: undefined,
      preferredDestinations: ['Any'],
      fundingPreference: 'fully_funded',
      fundingPriorities: {
        tuition: 'must',
        stipend: 'must',
        accommodation: 'preferred',
        travel: 'preferred',
        healthInsurance: 'not_priority',
        visaFees: 'not_priority'
      },
      workExperienceYears: 1
    }
  }
];

export const DEFAULT_BLANK_PROFILE: StudentProfile = {
  fullName: '',
  nationality: 'Pakistan',
  residenceCountry: 'Pakistan',
  currentEducationLevel: 'bachelor_completed',
  currentDegreeProgram: '',
  intendedDegree: 'master',
  fieldOfStudy: 'Computer Science & AI',
  specialization: '',
  grade: 3.5,
  gradeScale: '4.0',
  institution: '',
  expectedGraduationYear: 2025,
  preferredIntakeYear: 2026,
  languageTest: 'not_taken',
  languageScore: undefined,
  preferredDestinations: ['Any'],
  fundingPreference: 'fully_funded',
  fundingPriorities: {
    tuition: 'must',
    stipend: 'must',
    accommodation: 'preferred',
    travel: 'preferred',
    healthInsurance: 'preferred',
    visaFees: 'not_priority'
  },
  workExperienceYears: 0
};
