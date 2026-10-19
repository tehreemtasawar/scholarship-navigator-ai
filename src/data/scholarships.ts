import { ScholarshipRecord } from '../types/scholarship';

const LIVE_SCHOLARSHIPS_DATA: ScholarshipRecord[] = [
  {
    id: 'chevening-uk-2026',
    name: 'Chevening Scholarships',
    provider: 'UK Foreign, Commonwealth & Development Office (FCDO)',
    shortDescription: 'The UK government’s flagship global scholarship programme offering full financial support for a one-year Master’s degree at any UK university for emerging global leaders.',
    destinationCountry: 'United Kingdom',
    eligibleNationalities: [
      'Pakistan', 'India', 'Bangladesh', 'Nigeria', 'Kenya', 'Ghana', 'Egypt',
      'Indonesia', 'Malaysia', 'Vietnam', 'Brazil', 'Mexico', 'South Africa',
      'Chevening-eligible countries (160+ territories)'
    ],
    eligibleDegrees: ['master'],
    eligibleFields: ['All'],
    minGrade: {
      minimum: 3.0,
      scale: '4.0',
      flexibleEquivalencyNote: 'Equivalent to a UK upper second-class (2:1) honours degree. Must be officially evaluated against UK ENIC criteria.'
    },
    languageRequirements: {
      test: 'ielts',
      minScore: 6.5,
      note: 'Chevening removed its standalone English requirement in 2020, but applicants must still meet their chosen UK university’s unconditional English offer requirement (typically IELTS 6.5 - 7.0).'
    },
    workExperienceRequiredYears: 2, // 2,800 hours = 2 years
    mandatoryCriteria: [
      {
        id: 'chev-citizenship',
        label: 'Citizen of Chevening-eligible country',
        description: 'Must be a citizen of a Chevening-eligible country or territory and agree to return for a minimum of two years post-study.'
      },
      {
        id: 'chev-undergrad',
        label: 'Completed undergraduate degree',
        description: 'Must hold an undergraduate degree that enables entry into a postgraduate course at a UK university (typically 2:1 equivalency).'
      },
      {
        id: 'chev-work-exp',
        label: '2 years (2,800 hours) work experience',
        description: 'Minimum 2 years of verifiable work experience (full-time, part-time, voluntary, or paid internships).'
      },
      {
        id: 'chev-return',
        label: 'Commitment to return home for 2 years',
        description: 'Obligation to return to country of citizenship for at least two years after scholarship completes.'
      }
    ],
    requiredDocuments: [
      'Valid international passport',
      'Official undergraduate degree certificate and academic transcripts',
      'Three eligible UK master course choices',
      'Two professional/academic reference letters',
      'Four required Chevening leadership, networking, study in UK, and career essays'
    ],
    applicationOpeningDate: 'To be announced',
    applicationDeadline: 'Closed for current cycle',
    deadlineStatus: 'closed',
    deadlineNote: 'Applications for the Chevening Scholarship in Pakistan are currently closed according to the official Pakistan page (https://www.chevening.org/scholarship/pakistan/). Retained in the catalog for eligibility assessment and future planning. Next cycle dates will be updated once officially confirmed by the FCDO.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% of approved tuition fee (Master fee cap applies only to MBA courses up to £22,000)',
        evidenceNote: 'Official Chevening guidelines state full university tuition fees are paid directly to the institution.',
        sourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Monthly living allowance (~£1,340/month London, ~£1,080/month outside London)',
        evidenceNote: 'Monthly living allowance provided for individual scholar to cover food, local transit, and daily incidentals.',
        sourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid out of monthly stipend allowance; no separate university halls housing grant',
        evidenceNote: 'Chevening does not provide separate accommodation; scholars pay for private rent or university housing from their monthly living allowance.',
        sourceUrl: 'https://www.chevening.org/scholarships/guidance/accommodation/'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Economy class round-trip airfare from home country to the UK',
        evidenceNote: 'Approved economy travel to and from home country booked through designated travel partner.',
        sourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/'
      },
      healthInsurance: {
        status: 'unknown',
        amountOrDetail: 'Immigration Health Surcharge (IHS) coverage requires confirmation from the current Chevening guidance.',
        evidenceNote: 'The linked official Chevening coverage page could not be independently confirmed in the current audit. Do not assume IHS coverage; verify the current award guidance.',
        sourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/'
      },
      visaFees: {
        status: 'covered',
        amountOrDetail: 'Cost of one entry visa application to the UK',
        evidenceNote: 'Reimbursement or direct voucher code for standard Student Visa application fee.',
        sourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/'
      },
      otherCosts: {
        status: 'partial',
        amountOrDetail: 'Arrival allowance, departure allowance, and travel grant to attend official Chevening events in the UK. Does NOT cover travel to interview in home country or medical clearance/TB testing.',
        evidenceNote: 'Official Chevening guidance confirms allowances for UK arrival/departure and mandatory UK events. Travel to in-country interviews, passport fees, and TB testing are explicitly the candidate’s personal expense.',
        sourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/'
      }
    },
    exclusions: [
      'Travel expenses to and from the Chevening interview in home country are not covered and must be self-funded',
      'Pre-departure medical tests (mandatory UK TB screening) and general medical certificates are not covered',
      'Pre-departure costs (university application fees, IELTS/TOEFL test fees, passport and document attestation fees)',
      'Family/dependant financial support is completely excluded'
    ],
    officialUrl: 'https://www.chevening.org/scholarship/pakistan/',
    additionalUrls: [
      { title: 'Official Chevening Pakistan Page', url: 'https://www.chevening.org/scholarship/pakistan/' },
      { title: 'What Chevening Covers', url: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/' },
      { title: 'Global Eligibility Guidance', url: 'https://www.chevening.org/scholarships/guidance/eligibility/' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Information checked against the official Chevening Pakistan page (https://www.chevening.org/scholarship/pakistan/) confirming the cycle is closed. IHS coverage remains unconfirmed in the current audit; verify current guidance before relying on it.'
  },
  {
    id: 'fulbright-pakistan-2026',
    name: 'Fulbright Foreign Student Program (Pakistan) — 2027 Programme',
    provider: 'USEFP & U.S. Department of State',
    shortDescription: 'The flagship international educational exchange program sponsored by the U.S. government, providing full funding for Master’s or PhD study in the United States for Pakistani citizens.',
    destinationCountry: 'United States',
    eligibleNationalities: ['Pakistan'],
    eligibleDegrees: ['master', 'phd'],
    eligibleFields: [
      'All fields except clinical medicine',
      'Energy', 'Water & Agriculture', 'Public Health', 'Education',
      'Social Sciences', 'Journalism & Media', 'Computer Science & AI', 'Business & Economics'
    ],
    minGrade: {
      minimum: 3.0,
      scale: '4.0',
      flexibleEquivalencyNote: 'Strong academic record required. Four-year Bachelor’s (16 years education for Master’s, 18 years for PhD) from an HEC-accredited institution.'
    },
    languageRequirements: {
      test: 'toefl',
      minScore: 80, // or Duolingo / IELTS equivalent for testing phases
      note: 'Minimum required score is usually 80+ on TOEFL iBT or Duolingo equivalent at application; funded finalists are provided official TOEFL/GRE vouchers.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'ful-citizenship',
        label: 'Pakistani citizen residing in Pakistan',
        description: 'Applicants must be Pakistani citizens currently residing in Pakistan throughout the application and selection process. Dual US citizens or permanent residents are ineligible.'
      },
      {
        id: 'ful-16-years',
        label: '16 years of accredited education (for Master’s)',
        description: 'Minimum 4-year Bachelor degree (BS/BSc Hons) or 16-year equivalent recognized by Higher Education Commission (HEC).'
      },
      {
        id: 'ful-gre-exam',
        label: 'Valid GRE General Test score',
        description: 'Must take the GRE General Test before the application deadline (or specified testing window).'
      },
      {
        id: 'ful-j1-two-year-rule',
        label: 'Two-year home-country physical presence requirement (J-1 visa)',
        description: 'Mandatory U.S. J-1 visa section 212(e) requirement to return and reside in Pakistan for at least two consecutive years upon program completion.'
      }
    ],
    requiredDocuments: [
      'Complete online application form with 2 personal/study objective essays',
      'Official academic transcripts and degree certificates attested by HEC',
      'Three letters of recommendation (academic and professional)',
      'Official GRE General Test score report',
      'Copy of Pakistani CNIC or Passport'
    ],
    applicationOpeningDate: '2026-02-01',
    applicationDeadline: '2026-04-01',
    deadlineStatus: 'closed',
    deadlineNote: 'The application deadline for the 2027 Fulbright Degree Program was April 1, 2026 (CLOSED). Applications for the next cycle (2028 Programme) typically open in early 2027. This record remains visible for future planning.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% full university tuition and mandatory academic fees covered',
        evidenceNote: 'Tuition and mandatory fees paid directly to the host U.S. university.',
        sourceUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Monthly maintenance stipend based on host university location (~$1,400 - $2,400/month)',
        evidenceNote: 'Generous cost-of-living stipend adjusted for U.S. city tier.',
        sourceUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid out of monthly maintenance stipend (campus dorm or off-campus housing)',
        evidenceNote: 'USEFP covers housing indirectly via the monthly living stipend; orientation housing is provided directly.',
        sourceUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Direct round-trip international airfare on U.S. Fly America Act compliant carrier',
        evidenceNote: 'Airfare ticket issued and managed directly by USEFP / IIE.',
        sourceUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'ASPE (Accident and Sickness Program for Exchanges) health benefits plan',
        evidenceNote: 'U.S. Department of State provides ASPE health plan covering emergency illnesses and medical conditions.',
        sourceUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm'
      },
      visaFees: {
        status: 'covered',
        amountOrDetail: 'DS-2019 sponsorship provided; U.S. J-1 visa application fee and SEVIS fee waived/paid',
        evidenceNote: 'Sponsorship covers SEVIS fee and MRV fee processing.',
        sourceUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Textbook allowance, computer allowance, and settling-in transitional allowance',
        evidenceNote: 'Standard textbook stipend provided per semester and initial computer subsidy.'
      }
    },
    exclusions: [
      'Clinical patient-contact medical training is prohibited by law',
      'Family members/dependants costs are not funded by USEFP',
      'Costs incurred prior to selection (initial GRE testing fees)'
    ],
    officialUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm',
    additionalUrls: [
      { title: 'USEFP Frequently Asked Questions', url: 'https://usefp.org/scholarships/fulbright-faq.cfm' },
      { title: 'Fulbright Program Overview', url: 'https://foreign.fulbrightonline.org/' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Verified against official USEFP 2027 Fulbright Degree Program announcement (deadline April 1, 2026).'
  },
  {
    id: 'daad-helmut-schmidt-2026',
    name: 'DAAD Helmut-Schmidt-Programme (Public Policy & Good Governance)',
    provider: 'German Academic Exchange Service (DAAD)',
    shortDescription: 'Prestigious German government scholarship for future leaders in public policy, governance, politics, economics, and international relations from developing countries.',
    destinationCountry: 'Germany',
    eligibleNationalities: [
      'Pakistan', 'Afghanistan', 'India', 'Bangladesh', 'Nepal', 'Sri Lanka',
      'Nigeria', 'Kenya', 'Ethiopia', 'Ghana', 'Egypt', 'Developing & Emerging Nations (DAC List)'
    ],
    eligibleDegrees: ['master'],
    eligibleFields: [
      'Public Policy', 'Good Governance', 'Public Administration',
      'International Relations', 'Political Science', 'Economics & Development',
      'Social Sciences', 'Law'
    ],
    minGrade: {
      minimum: 3.2,
      scale: '4.0',
      flexibleEquivalencyNote: 'Applicants should have graduated in the top third of their class (equivalent to German grade 2.5 or better).'
    },
    languageRequirements: {
      test: 'ielts',
      minScore: 6.5,
      note: 'IELTS 6.5 or TOEFL iBT 80+ required for English-taught master tracks; German tracks require TestDaF / Goethe certificate.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'daad-degree-recency',
        label: 'Degree obtained within last 6 years',
        description: 'The applicant’s last academic degree must not have been obtained more than 6 years before the application deadline.'
      },
      {
        id: 'daad-residence-limitation',
        label: 'Resided in developing country for at least 15 months prior',
        description: 'Applicants must not have lived in Germany or a non-developing country for more than 15 months at the time of application.'
      },
      {
        id: 'daad-qualifying-subject',
        label: 'Social science, law, politics, or economic background',
        description: 'Must have a first degree in political science, law, economics, administration, or related social disciplines.'
      }
    ],
    requiredDocuments: [
      'DAAD application form signed',
      'Europass CV with detailed educational and professional milestones',
      'Letter of Motivation detailing commitment to good governance (max 2 pages)',
      'Undergraduate degree certificate and grade transcripts (with German or English translation)',
      'Two letters of recommendation from university professors or employers',
      'Official English language certificate (IELTS/TOEFL)'
    ],
    applicationOpeningDate: '2026-06-01',
    applicationDeadline: '2026-07-31',
    deadlineStatus: 'closed',
    deadlineNote: 'Applications for the 2026/2027 intake closed on July 31, 2026 (CLOSED). Applications are accepted annually between June 1 and July 31. Visible for future planning.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: 'Tuition fees at German participating universities are waived/fully covered',
        evidenceNote: 'State university master courses in this programme charge no tuition fees.',
        sourceUrl: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/helmut-schmidt-programme/'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: '€934 per month living allowance',
        evidenceNote: 'Monthly scholarship payment of €934 paid directly to student German bank account.',
        sourceUrl: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/helmut-schmidt-programme/'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid from monthly stipend; rent subsidy up to €100/mo available if rent exceeds threshold',
        evidenceNote: 'Student rents a room in student halls (Studentenwerk) or flatshare (WG) using monthly stipend.',
        sourceUrl: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/helmut-schmidt-programme/'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Lump-sum travel allowance to Germany and back home after graduation',
        evidenceNote: 'Flat-rate travel contribution provided based on country of origin.',
        sourceUrl: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/helmut-schmidt-programme/'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'Full German statutory health, accident, and personal liability insurance covered',
        evidenceNote: 'DAAD covers comprehensive health and liability insurance package for scholars.',
        sourceUrl: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/helmut-schmidt-programme/'
      },
      visaFees: {
        status: 'partial',
        amountOrDetail: 'German national student visa fee is often waived by German Embassy for DAAD awardees',
        evidenceNote: 'German embassies generally exempt DAAD scholarship recipients from the €75 visa processing fee upon showing award letter.',
        sourceUrl: 'https://www.daad.de/en/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Free 6-month preparatory German language course in Germany prior to master studies, plus annual study & research subsidy of €460',
        evidenceNote: 'Includes full language institute tuition and living subsidy during pre-master German course.'
      }
    },
    exclusions: [
      'Living costs for spouses or children are not automatically funded (requires separate family supplement request)',
      'Pre-departure visa preparation documents (notarizations, HEC stamps)'
    ],
    officialUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/',
    additionalUrls: [
      { title: 'DAAD Helmut-Schmidt Programme Portal', url: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/helmut-schmidt-programme/' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Verified against DAAD Programme Call Guidelines 2026 (cycle closed July 31, 2026).'
  },
  {
    id: 'erasmus-mundus-emjm-2026',
    name: 'Erasmus Mundus Joint Masters (EMJM)',
    provider: 'European Commission (European Union)',
    shortDescription: 'High-level integrated international study programmes designed and delivered by an international consortium of higher education institutions across at least 2 European countries.',
    destinationCountry: 'European Union (Multiple Countries)',
    eligibleNationalities: ['All'],
    eligibleDegrees: ['master'],
    eligibleFields: [
      'All fields', 'Artificial Intelligence & Robotics', 'Data Science & Cybersecurity',
      'Environmental Sciences & Climate', 'Bioengineering', 'Economics & Management',
      'Public Health', 'Humanities & Cultural Heritage'
    ],
    minGrade: {
      minimum: 3.0,
      scale: '4.0',
      flexibleEquivalencyNote: 'Each specific consortium sets exact academic prerequisites; typically requires a 1st or upper 2nd class undergraduate degree.'
    },
    languageRequirements: {
      test: 'ielts',
      minScore: 6.5,
      note: 'Most consortia require IELTS 6.5-7.0 or TOEFL 90+; requirements vary by individual program curriculum.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'em-first-degree',
        label: 'First higher education degree (Bachelor or equivalent)',
        description: 'Must have obtained a first higher education degree (equivalent to minimum 180 ECTS credits) or demonstrate a recognized equivalent.'
      },
      {
        id: 'em-mobility',
        label: 'Mandatory mobility in at least 2 distinct countries',
        description: 'Applicants must be able and willing to spend study periods in at least two different European countries represented in the consortium.'
      },
      {
        id: 'em-max-programs',
        label: 'Maximum 3 Erasmus Mundus applications per year',
        description: 'Candidates may apply to a maximum of three different Erasmus Mundus master programs in the same selection year.'
      }
    ],
    requiredDocuments: [
      'Completed consortium online application',
      'Undergraduate diploma and academic transcripts (with official English/French translation)',
      'Curriculum Vitae (Europass format recommended)',
      'Motivation letter tailored to the specific joint master program',
      'Two academic recommendation letters',
      'Proof of place of residence (issued within 12 months)',
      'Proof of English proficiency certificate'
    ],
    applicationOpeningDate: '2026-10-01',
    applicationDeadline: undefined,
    deadlineStatus: 'unconfirmed',
    deadlineNote: 'Application deadlines vary by individual joint master consortium between December 2026 and February 2027. Review the official EMJM catalogue for course-specific dates.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: 'Full tuition participation costs and university fees covered 100%',
        evidenceNote: 'Erasmus Mundus scholarship covers total student participation costs directly with consortium partner universities.',
        sourceUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: '€1,400 per month living allowance for the entire duration (up to 24 months)',
        evidenceNote: 'Under the current Erasmus+ framework, scholarship holders receive a flat monthly allowance of €1,400 to cover subsistence, travel, and accommodation.',
        sourceUrl: 'https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-2/erasmus-mundus-action'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid by student from the €1,400 monthly living allowance; consortia provide booking assistance',
        evidenceNote: 'No separate housing payment; housing is paid out of the €1,400 monthly stipend.',
        sourceUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters'
      },
      travel: {
        status: 'partial',
        amountOrDetail: 'Incorporated into the monthly stipend model under current EMJM guidelines',
        evidenceNote: 'In current EMJM guidelines, travel costs are rolled into the increased €1,400/month flat-rate stipend allowance.',
        sourceUrl: 'https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-2/erasmus-mundus-action'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'Comprehensive worldwide student medical and accident insurance covered by consortium',
        evidenceNote: 'Consortia are contractually mandated by European Commission to provide full insurance meeting EACEA minimum requirements.',
        sourceUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters'
      },
      visaFees: {
        status: 'not_covered',
        amountOrDetail: 'National Schengen visa fees and residence permit application fees must be paid by student',
        evidenceNote: 'Consortium issues admission and financial certificates, but local embassy visa fees are borne by the student.',
        sourceUrl: 'https://erasmus-plus.ec.europa.eu/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Library access, laboratory equipment, field trips, and thesis research fees included in participation cost',
        evidenceNote: 'Full academic participation costs covered without hidden bench fees.'
      }
    },
    exclusions: [
      'National embassy visa application fees must be paid up-front by student',
      'Travel and accommodation for family members/dependants'
    ],
    officialUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
    additionalUrls: [
      { title: 'EMJM Catalogue of Programs', url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'needs_verification',
    verificationNotes: 'Consortium-specific admission deadlines and language cutoffs vary by program; verify on official EMJM catalogue course portal.'
  },
  {
    id: 'australia-awards-2026',
    name: 'Australia Awards Scholarships',
    provider: 'Australian Department of Foreign Affairs and Trade (DFAT)',
    shortDescription: 'Long-term development awards administered by the Australian Government providing full master’s scholarships for emerging leaders from partner countries in the Indo-Pacific.',
    destinationCountry: 'Australia',
    eligibleNationalities: [
      'Pakistan', 'Bangladesh', 'Bhutan', 'Cambodia', 'Fiji', 'Indonesia',
      'Laos', 'Maldives', 'Mongolia', 'Nepal', 'Papua New Guinea', 'Philippines',
      'Sri Lanka', 'Vietnam', 'Pacific Island Nations'
    ],
    eligibleDegrees: ['master'],
    eligibleFields: [
      'Agriculture & Food Security', 'Health Security', 'Water Resource Management',
      'Gender Equality & Social Inclusion', 'Climate Change & Green Economy',
      'Governance & Public Policy', 'Infrastructure & Disaster Resilience'
    ],
    minGrade: {
      minimum: 2.8,
      scale: '4.0',
      flexibleEquivalencyNote: 'Four-year Bachelor’s degree. Country specific profiles set minimum CGPA (for Pakistan: 16 years education with min 2.8/4.0 CGPA or equivalent).'
    },
    languageRequirements: {
      test: 'ielts',
      minScore: 6.5,
      note: 'Overall score of at least 6.5 with no band less than 6.0 (or TOEFL iBT 84+ or PTE Academic 58+).'
    },
    workExperienceRequiredYears: 2,
    mandatoryCriteria: [
      {
        id: 'aa-nationality',
        label: 'Citizen and resident of participating country',
        description: 'Must be a citizen of an eligible participating country and applying from within that country.'
      },
      {
        id: 'aa-two-year-return',
        label: 'Two-year return to home country obligation',
        description: 'Contractually bound to leave Australia and reside in their home country for a minimum of two years post completion.'
      },
      {
        id: 'aa-work-exp',
        label: 'At least 2 years relevant work experience',
        description: 'Minimum 2 years of relevant professional work experience in the priority development sector.'
      },
      {
        id: 'aa-permanent-residency',
        label: 'Not hold Australian or NZ permanent residency',
        description: 'Must not hold or be applying for Australian permanent residency or citizenship.'
      }
    ],
    requiredDocuments: [
      'Online OASIS portal application',
      'Certified copy of original degree certificates and academic transcripts',
      'Certified copy of birth certificate or national ID/Passport',
      'Curriculum Vitae with employment history verification',
      'Official IELTS, TOEFL, or PTE academic certificate',
      'Referee reports (one academic, one professional supervisor)',
      'Development Impact Plan (relevance to home country priorities)'
    ],
    applicationOpeningDate: '2026-02-01',
    applicationDeadline: '2026-04-30',
    deadlineStatus: 'closed',
    deadlineNote: 'The 2026 application cycle closed on April 30, 2026 (CLOSED). Applications for the next intake typically open February 1, 2027. Visible for future planning.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% full tuition fees paid directly to Australian university',
        evidenceNote: 'DFAT pays the complete international student tuition fees.',
        sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Contribution to Living Expenses (CLE) of AUD $3,000+ paid fortnightly',
        evidenceNote: 'Regular subsistence allowance determined by DFAT to support basic living expenses in Australian capital cities.',
        sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid from fortnightly living allowance; one-off AUD $5,000 establishment allowance helps with bond/deposit',
        evidenceNote: 'AUD $5,000 establishment payment provided on arrival to cover accommodation bond, utilities, and textbooks.',
        sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Single return economy class airfare by the most direct route',
        evidenceNote: 'DFAT books international economy airfare to and from Australia at start and end of program.',
        sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'Overseas Student Health Cover (OSHC) for the scholar for duration of award',
        evidenceNote: 'Basic medical and hospital cover provided through approved Australian OSHC provider.',
        sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      },
      visaFees: {
        status: 'covered',
        amountOrDetail: 'Australian Student visa (subclass 500) fee is waived for government-sponsored students',
        evidenceNote: 'Subclass 500 visa application fee is nil for recipients of Australian government aid scholarships.',
        sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Introductory Academic Program (IAP) mandatory bridging orientation and supplementary academic support',
        evidenceNote: 'Pre-course English training in home country if needed and academic tutoring support in Australia.'
      }
    },
    exclusions: [
      'Overseas Student Health Cover for dependants/spouse must be paid by scholar',
      'Flight tickets and living costs for accompanying family members'
    ],
    officialUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
    additionalUrls: [
      { title: 'Australia Awards Policy Handbook', url: 'https://www.dfat.gov.au/about-us/publications/Pages/australia-awards-scholarships-policy-handbook' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Verified against DFAT Australia Awards Policy Handbook (cycle closed April 30, 2026).'
  },
  {
    id: 'turkiye-burslari-2026',
    name: 'Türkiye Bursları (Government of Turkey Scholarships)',
    provider: 'Presidency for Turks Abroad and Related Communities (YTB)',
    shortDescription: 'Full government scholarship program covering undergraduate, master’s, and PhD studies at premier Turkish universities, including university placement, Turkish language tuition, and health coverage.',
    destinationCountry: 'Turkey',
    eligibleNationalities: ['All'],
    eligibleDegrees: ['bachelor', 'master', 'phd'],
    eligibleFields: [
      'All fields', 'Engineering & Technology', 'Natural Sciences',
      'Medicine & Health', 'Humanities & Social Sciences', 'Islamic Studies', 'International Trade'
    ],
    minGrade: {
      minimum: 75,
      scale: 'percentage',
      flexibleEquivalencyNote: 'Minimum 75% for Master’s and PhD candidates (minimum 70% for Bachelor candidates; 90% for Health/Medicine).'
    },
    languageRequirements: {
      test: 'any',
      minScore: 0,
      note: 'Most programs include a compulsory free 1-year Turkish language preparatory course. For programs taught in English, applicant must present valid TOEFL or GRE.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'tb-age-limit',
        label: 'Age limitation criteria',
        description: 'Under 21 for undergraduate, under 30 for master’s, and under 35 for PhD programs as of application date.'
      },
      {
        id: 'tb-nationality',
        label: 'Foreign nationality (non-Turkish)',
        description: 'Must not hold Turkish citizenship or have lost Turkish citizenship.'
      },
      {
        id: 'tb-no-current-enrollment',
        label: 'Not currently enrolled in Turkish universities at same level',
        description: 'Applicants must not already be studying at a Turkish university at the degree level they are applying for.'
      }
    ],
    requiredDocuments: [
      'National identity document or valid passport',
      'Diploma or temporary certificate of graduation',
      'Official academic transcripts demonstrating minimum percentage criteria',
      'International exam score certificates (GRE/GMAT/SAT) if required by chosen university',
      'Language exam certificates if required for English-taught programs',
      'Academic research proposal (mandatory for PhD, highly recommended for Master’s)',
      'Two letters of reference'
    ],
    applicationOpeningDate: '2026-01-10',
    applicationDeadline: '2026-02-20',
    deadlineStatus: 'closed',
    deadlineNote: 'The 2026 application window closed on February 20, 2026 (CLOSED). Applications open annually from January 10 to February 20. Visible for future planning.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% university tuition fees paid directly to the allocated Turkish university',
        evidenceNote: 'University placement and tuition coverage guaranteed for all scholarship awardees.',
        sourceUrl: 'https://turkiyeburslari.gov.tr/whatthescholarshipcovers'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Monthly stipend (approx. 3,500 TRY Master’s, 5,000 TRY PhD, adjusted for inflation)',
        evidenceNote: 'Monthly cash stipend paid via Turkish Ziraat Bank card.',
        sourceUrl: 'https://turkiyeburslari.gov.tr/whatthescholarshipcovers'
      },
      accommodation: {
        status: 'covered',
        amountOrDetail: 'Free accommodation in state-run student dormitories (KYK) with meals included',
        evidenceNote: 'Government dormitories provide free room and subsidized breakfast/dinner. Students opting for private housing forfeit free dorm access.',
        sourceUrl: 'https://turkiyeburslari.gov.tr/whatthescholarshipcovers'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'One-time flight ticket to Turkey at program start and one return ticket after graduation',
        evidenceNote: 'Economy class flight tickets provided directly by Turkish Airlines/YTB partner.',
        sourceUrl: 'https://turkiyeburslari.gov.tr/whatthescholarshipcovers'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'Public General Health Insurance (GSS) under Turkish Social Security Institution',
        evidenceNote: 'Full health insurance premium paid, granting access to public hospitals in Turkey.',
        sourceUrl: 'https://turkiyeburslari.gov.tr/whatthescholarshipcovers'
      },
      visaFees: {
        status: 'not_covered',
        amountOrDetail: 'Turkish student visa application fee in home country must be paid by applicant',
        evidenceNote: 'Student pays initial Turkish visa processing fee at local embassy/VFS center; in-country student residence permit card fee is covered.',
        sourceUrl: 'https://turkiyeburslari.gov.tr/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: '1-year full-time Turkish Language Course (TÖMER) tuition covered 100%',
        evidenceNote: 'Awardees receive free Turkish language education for 1 year before starting their degree.'
      }
    },
    exclusions: [
      'Initial student visa application processing fees at home country Turkish embassy/VFS',
      'Costs of sworn Turkish translations and diploma apostille/notarization fees'
    ],
    officialUrl: 'https://turkiyeburslari.gov.tr/',
    additionalUrls: [
      { title: 'What the Scholarship Covers', url: 'https://turkiyeburslari.gov.tr/whatthescholarshipcovers' },
      { title: 'Application Criteria', url: 'https://turkiyeburslari.gov.tr/criteriaandconditions' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Verified against official YTB Türkiye Bursları 2026 guidelines (cycle closed Feb 20, 2026).'
  },
  {
    id: 'mext-japan-research-2026',
    name: 'MEXT Japanese Government Scholarship (Research/Graduate Students)',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT), Japan',
    shortDescription: 'The premier Japanese government scholarship for international graduate students to conduct research and complete Master’s or Doctoral degrees at prestigious Japanese universities.',
    destinationCountry: 'Japan',
    eligibleNationalities: ['All countries having diplomatic relations with Japan (including Pakistan)'],
    eligibleDegrees: ['master', 'phd'],
    eligibleFields: [
      'All fields of study offered at Japanese universities',
      'Engineering & Robotics', 'Information Technology & AI', 'Material Science',
      'Biomedical Sciences', 'Japanese Studies & Economics', 'Agriculture'
    ],
    minGrade: {
      minimum: 3.2,
      scale: '4.0',
      flexibleEquivalencyNote: 'High academic standing required; typically at least 70-75% or 3.2/4.0 CGPA on Japanese credit point conversion scale.'
    },
    languageRequirements: {
      test: 'any',
      minScore: 0,
      note: 'Willingness to learn Japanese is mandatory. English proficiency (IELTS 6.5+ or TOEFL 80+) or Japanese proficiency (JLPT N2+) required depending on field.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'mext-age',
        label: 'Born on or after April 2, 1991 (under 35 years)',
        description: 'Must generally be under 35 years of age at the time of arrival in Japan.'
      },
      {
        id: 'mext-degree',
        label: 'Completed 16 years of school education',
        description: 'Must have completed a 4-year undergraduate degree (or 16 years of primary through tertiary schooling).'
      },
      {
        id: 'mext-medical',
        label: 'Clear certificate of health',
        description: 'Must be physically and mentally fit to pursue study at a Japanese university, certified by a licensed physician.'
      },
      {
        id: 'mext-embassy-exam',
        label: 'Embassy track: pass written examinations and interview',
        description: 'Must pass screening examinations (English/Japanese written tests) and oral interview at local Embassy of Japan.'
      }
    ],
    requiredDocuments: [
      'MEXT Application Form (prescribed format)',
      'Field of Study and Research Plan (detailed 2-3 page proposal)',
      'Official academic transcripts from all university years',
      'Graduation certificate or degree certificate',
      'Recommendation letter from university dean or academic advisor',
      'Medical certificate signed by a licensed physician',
      'Abstracts of undergraduate thesis or scientific publications'
    ],
    applicationOpeningDate: '2026-04-10',
    applicationDeadline: '2026-05-15',
    deadlineStatus: 'closed',
    deadlineNote: 'The 2026 Embassy recommendation track in Pakistan and other countries closed May 15, 2026 (CLOSED). Opens annually in April. Visible for future planning.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% entrance examination fees, university matriculation fees, and tuition fees covered',
        evidenceNote: 'MEXT pays tuition directly to the national, public, or private Japanese host university.',
        sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: '¥144,000/month for Master’s students; ¥145,000/month for PhD students (with extra ¥2,000-3,000 regional allowance in designated regions)',
        evidenceNote: 'Monthly maintenance stipend paid to student Japanese Post Bank (Yucho) account.',
        sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid from monthly stipend; host universities offer discounted international student dormitories (kaikan) for first 6-12 months',
        evidenceNote: 'University dorms cost approx. ¥15,000-45,000/month, paid by the student from the monthly stipend.',
        sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Economy class flight ticket from nearest international airport to Japan and return ticket upon graduation',
        evidenceNote: 'Travel vouchers and airline tickets arranged by MEXT via designated travel agency.',
        sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/'
      },
      healthInsurance: {
        status: 'partial',
        amountOrDetail: 'Japanese National Health Insurance (NHI) premium must be paid by student (~¥1,500 - 2,500/month); covers 70% of medical costs',
        evidenceNote: 'Japan requires all residents to join NHI. The student pays a subsidized monthly premium from their stipend.',
        sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/'
      },
      visaFees: {
        status: 'covered',
        amountOrDetail: 'Japanese Student Visa issued free of charge for MEXT scholars at Japanese Embassy',
        evidenceNote: 'Embassy of Japan waives visa issuance fees for official Japanese Government scholars.',
        sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Six-month intensive Japanese language preparatory course at designated university center included',
        evidenceNote: 'Intensive introductory language training provided to ensure ease of everyday living in Japan.'
      }
    },
    exclusions: [
      'National Health Insurance monthly copay (~¥2,000/mo) is paid from stipend',
      'Housing security deposits (shikikin) and key money if renting private apartments off-campus'
    ],
    officialUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/',
    additionalUrls: [
      { title: 'Embassy of Japan in Pakistan MEXT Notice', url: 'https://www.pk.emb-japan.go.jp/itpr_en/MEXT_Scholarship.html' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Verified from Study in Japan MEXT 2026 portal (cycle closed May 15, 2026).'
  },
  {
    id: 'commonwealth-masters-2026',
    name: 'Commonwealth Master’s Scholarships (UK)',
    provider: 'Commonwealth Scholarship Commission (CSC) & UK FCDO',
    shortDescription: 'Funded by the UK Foreign, Commonwealth & Development Office, aimed at talented and motivated individuals from eligible low and middle income Commonwealth countries.',
    destinationCountry: 'United Kingdom',
    eligibleNationalities: [
      'Pakistan', 'Bangladesh', 'India', 'Nigeria', 'Kenya', 'Ghana', 'Tanzania',
      'Uganda', 'Rwanda', 'Sri Lanka', 'Malaysia', 'Eligible Commonwealth Developing Nations'
    ],
    eligibleDegrees: ['master'],
    eligibleFields: [
      'Science and technology for development',
      'Strengthening health systems and capacity',
      'Promoting global prosperity',
      'Strengthening global peace, security and governance',
      'Strengthening resilience and response to crises',
      'Access, inclusion and opportunity'
    ],
    minGrade: {
      minimum: 3.0,
      scale: '4.0',
      flexibleEquivalencyNote: 'At least an upper second class (2:1) honours standard degree, or a second class degree (2:2) with a relevant postgraduate qualification.'
    },
    languageRequirements: {
      test: 'ielts',
      minScore: 6.5,
      note: 'Must meet English language entry requirements of the chosen UK host university.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'cw-citizenship',
        label: 'Citizen of or refugee in an eligible Commonwealth country',
        description: 'Must be a citizen of or refugee in an eligible Commonwealth country and permanently resident in that country.'
      },
      {
        id: 'cw-financial-need',
        label: 'Unable to afford to study in the UK without scholarship',
        description: 'Applicants must sign declaration confirming inability to study in the UK without CSC funding.'
      },
      {
        id: 'cw-nominating-agency',
        label: 'Nominated by national nominating agency (e.g. HEC in Pakistan)',
        description: 'Must apply through and be nominated by national agency (e.g., Higher Education Commission Pakistan) or selected non-governmental bodies.'
      }
    ],
    requiredDocuments: [
      'CSC online application',
      'Proof of citizenship or refugee status',
      'Full academic transcripts of all higher education qualifications',
      'Two references submitted directly by referees',
      'University admission offer letters for chosen courses',
      'Development Impact Statement linked to UN Sustainable Development Goals'
    ],
    applicationOpeningDate: '2026-09-05',
    applicationDeadline: '2026-10-15',
    deadlineStatus: 'closed',
    deadlineNote: 'Applications for 2027 entry closed on October 15, 2026 (CLOSED). Nominating agencies (e.g. HEC Pakistan) conduct nominee interviews.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% approved tuition fees paid directly to the host UK university',
        evidenceNote: 'Full tuition fees covered through agreement between CSC and participating UK universities.',
        sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Monthly stipend of £1,347/month (or £1,652/month for universities in the London metropolitan area)',
        evidenceNote: 'Monthly living allowance at official UK government scholar rates.',
        sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid from monthly stipend; no separate housing voucher',
        evidenceNote: 'Student rents room in university accommodation or private hall using monthly stipend.',
        sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Approved airfare from home country to UK and return at conclusion of award',
        evidenceNote: 'Economy flights booked directly through CSC designated travel agent.',
        sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'
      },
      healthInsurance: {
        status: 'not_covered',
        amountOrDetail: 'UK Immigration Health Surcharge (IHS) is NOT covered by CSC',
        evidenceNote: 'Commonwealth scholars must self-fund their UK Immigration Health Surcharge (~£776/year) during visa application.',
        sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'
      },
      visaFees: {
        status: 'covered',
        amountOrDetail: 'Cost of standard entry visa (Student route) is reimbursed or paid via voucher',
        evidenceNote: 'Reimbursement of standard Student Visa fee upon submission of payment receipt.',
        sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Warm clothing allowance on arrival, study travel grant for approved academic conferences',
        evidenceNote: 'Special winter clothing allowance granted to assist scholars arriving from tropical climates.'
      }
    },
    exclusions: [
      'UK Immigration Health Surcharge (IHS) must be paid out-of-pocket by scholar',
      'Family/dependants maintenance costs not covered for Master’s candidates'
    ],
    officialUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
    additionalUrls: [
      { title: 'Commonwealth Terms and Conditions', url: 'https://cscuk.fcdo.gov.uk/wp-content/uploads/2023/08/CSC-Masters-Scholarships-terms-and-conditions-2024.pdf' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Information verified against CSC UK 2026/2027 Terms & Conditions (round closed October 15, 2026).'
  },
  {
    id: 'hec-overseas-pakistan-2026',
    name: 'HEC Overseas Scholarships for MS/MPhil & PhD',
    provider: 'Higher Education Commission (HEC), Government of Pakistan',
    shortDescription: 'National government scholarship funded by Government of Pakistan sending high-achieving Pakistani/AJK nationals to top 300 QS-ranked global universities.',
    destinationCountry: 'United Kingdom / Europe / USA / Australia / China',
    eligibleNationalities: ['Pakistan'],
    eligibleDegrees: ['master', 'phd'],
    eligibleFields: [
      'Science, Technology, Engineering & Mathematics (STEM)',
      'Artificial Intelligence & Computing', 'Agriculture & Veterinary Sciences',
      'Medical & Allied Health Sciences', 'Social Sciences & Economics'
    ],
    minGrade: {
      minimum: 3.0,
      scale: '4.0',
      flexibleEquivalencyNote: 'Minimum 16 years education (BS/MSc) with minimum 3.0/4.0 CGPA (semester system) or 1st Division (annual system). Maximum of two 2nd divisions throughout academic career, no 3rd division.'
    },
    languageRequirements: {
      test: 'any',
      minScore: 0,
      note: 'Must achieve minimum 50 marks in HEC Aptitude Test (HAT). Must independently meet foreign university language requirements (typically IELTS 6.5+).'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'hec-citizenship',
        label: 'Pakistani / AJK national',
        description: 'Applicants must be nationals of Pakistan or Azad Jammu & Kashmir.'
      },
      {
        id: 'hec-age-limit',
        label: 'Age maximum 35 years (40 for regular faculty/public servants)',
        description: 'Maximum age 35 years for general candidates, 40 years for regular government/university faculty.'
      },
      {
        id: 'hec-legal-bond',
        label: 'Legal bond to serve Pakistan for 5 years',
        description: 'Selected candidates must execute legal bond with guarantors to return and serve Pakistan for a minimum of 5 years immediately after degree.'
      },
      {
        id: 'hec-hat-test',
        label: 'Qualify HEC Aptitude Test (HAT)',
        description: 'Must obtain minimum 50% marks in the specialized Higher Education Aptitude Test (HAT) conducted by Education Testing Council (ETC).'
      }
    ],
    requiredDocuments: [
      'HEC online e-portal application',
      'All academic degrees and transcripts attested by HEC',
      'Valid HAT test score card',
      'Valid Pakistani Passport and CNIC',
      'No Objection Certificate (NOC) and study leave order from employer (for employed candidates)',
      'Signed deed of agreement and surety bond'
    ],
    applicationOpeningDate: '2026-03-01',
    applicationDeadline: undefined,
    deadlineStatus: 'unconfirmed',
    deadlineNote: 'Application deadlines are announced batch-by-batch via national press and HEC portal. Requires active verification on the HEC portal.',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: 'Full tuition fees paid up to approved bilateral university fee cap',
        evidenceNote: 'Paid directly to foreign partner universities under negotiated HEC concessionary rates.',
        sourceUrl: 'https://www.hec.gov.pk/english/scholarshipsgrants/lao/Pages/default.aspx'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Standard country-specific monthly maintenance allowance (e.g. £1,100/mo UK, €1,100/mo Europe, $1,500/mo US)',
        evidenceNote: 'Monthly living allowance approved by Ministry of Finance Pakistan for overseas scholars.',
        sourceUrl: 'https://www.hec.gov.pk/'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Included in monthly living stipend; no separate housing supplement',
        evidenceNote: 'Scholars arrange accommodation independently using their monthly stipend.',
        sourceUrl: 'https://www.hec.gov.pk/'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'Return economy airfare ticket provided directly via Pakistan International Airlines / partner carriers',
        evidenceNote: 'Air ticket arranged by HEC travel desk for outgoing and returning journey.',
        sourceUrl: 'https://www.hec.gov.pk/'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'Basic mandatory medical insurance allowance or UK IHS fee covered under approved budget',
        evidenceNote: 'Health insurance costs are factored into the bilateral university agreement or paid as actuals.',
        sourceUrl: 'https://www.hec.gov.pk/'
      },
      visaFees: {
        status: 'partial',
        amountOrDetail: 'Actual student visa application fee reimbursed upon submission of official receipt',
        evidenceNote: 'Initial foreign student visa processing fee is reimbursed after scholar arrives at host institution.',
        sourceUrl: 'https://www.hec.gov.pk/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'Book allowance, thesis preparation allowance, and settlement grant',
        evidenceNote: 'Lump-sum book and thesis allowance provided during the academic tenure.'
      }
    },
    exclusions: [
      'Living expenses or health insurance for family members/spouse are not provided',
      'Tuition charges exceeding HEC ceiling at non-partner universities must be paid by student'
    ],
    officialUrl: 'https://www.hec.gov.pk/english/scholarshipsgrants/lao/Pages/default.aspx',
    additionalUrls: [
      { title: 'HEC Overseas Scholarship Portal', url: 'https://scholarships.hec.gov.pk/' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'needs_verification',
    verificationNotes: 'Specific batch calls and fee caps depend on PC-1 government approval; verify current advertisements on HEC portal.'
  },
  {
    id: 'singa-singapore-2026',
    name: 'Singapore International Graduate Award (SINGA)',
    provider: 'Agency for Science, Technology & Research (A*STAR), Singapore',
    shortDescription: 'Prestigious collaboration between A*STAR, NTU, NUS, SUTD and SMU providing full funding for international students to pursue PhD training in science and engineering in Singapore.',
    destinationCountry: 'Singapore',
    eligibleNationalities: ['All international students (non-Singaporeans)'],
    eligibleDegrees: ['phd'],
    eligibleFields: [
      'Biomedical Sciences', 'Computing & Information Sciences (AI, Data, Cyber)',
      'Physical Sciences & Materials Engineering', 'Engineering & Robotics'
    ],
    minGrade: {
      minimum: 3.5,
      scale: '4.0',
      flexibleEquivalencyNote: 'Graduates with passion for research and excellent academic results (first-class honours or equivalent).'
    },
    languageRequirements: {
      test: 'ielts',
      minScore: 6.5,
      note: 'Good reports in academic English (IELTS 6.5+, TOEFL 85+) or certification from previous English-medium university.'
    },
    workExperienceRequiredYears: 0,
    mandatoryCriteria: [
      {
        id: 'singa-non-citizen',
        label: 'International applicant (non-Singapore citizen)',
        description: 'Open to all international graduates with passion for research in science and engineering.'
      },
      {
        id: 'singa-phd-intent',
        label: 'Commitment to full-time 4-year PhD program',
        description: 'Award is strictly for PhD research training in laboratory of A*STAR, NTU, NUS, SUTD, or SMU.'
      }
    ],
    requiredDocuments: [
      'Online SINGA application form',
      'Valid international passport copy',
      'Bachelor’s and/or Master’s academic transcripts (in English)',
      'Bachelor’s and/or Master’s degree certificates',
      'Two academic recommendation letters submitted online by referees',
      'Personal statement of research interests and aspirations'
    ],
    applicationOpeningDate: '2026-06-02',
    applicationDeadline: '2026-12-01',
    deadlineStatus: 'open',
    deadlineNote: 'Applications are currently OPEN for the January 2027 intake until December 1, 2026 (23:59 GMT+8).',
    fundingType: 'Fully Funded',
    fundingBreakdown: {
      tuition: {
        status: 'covered',
        amountOrDetail: '100% full tuition fees covered for up to 4 years of PhD studies',
        evidenceNote: 'Tuition paid directly to host Singapore university (NUS/NTU/SUTD/SMU).',
        sourceUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'
      },
      stipend: {
        status: 'covered',
        amountOrDetail: 'Monthly stipend of SGD $2,700, increased to SGD $3,200 after passing the PhD qualifying examination (QE)',
        evidenceNote: 'Regular monthly stipend paid directly into student DBS/POSB bank account.',
        sourceUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'
      },
      accommodation: {
        status: 'partial',
        amountOrDetail: 'Paid from monthly stipend; host universities offer subsidized on-campus graduate housing',
        evidenceNote: 'Campus graduate hall rooms range from SGD $500 - $900/mo, paid from the stipend.',
        sourceUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'
      },
      travel: {
        status: 'covered',
        amountOrDetail: 'One-time airfare grant of up to SGD $1,500',
        evidenceNote: 'Reimbursement of airfare from home country to Singapore upon arrival.',
        sourceUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'
      },
      healthInsurance: {
        status: 'covered',
        amountOrDetail: 'Mandatory university medical and hospitalization insurance covered',
        evidenceNote: 'Standard group health insurance is included as part of graduate student welfare.',
        sourceUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'
      },
      visaFees: {
        status: 'covered',
        amountOrDetail: 'Singapore Student’s Pass (STP) processing and issuance fees covered',
        evidenceNote: 'Immigration & Checkpoints Authority (ICA) student pass application supported and fees reimbursed.',
        sourceUrl: 'https://www.a-star.edu.sg/'
      },
      otherCosts: {
        status: 'covered',
        amountOrDetail: 'One-time settling-in allowance of SGD $1,000 upon arrival',
        evidenceNote: 'Cash allowance paid in the first month to cover initial living setup in Singapore.'
      }
    },
    exclusions: [
      'Master’s degree seekers (SINGA is PhD only)',
      'Accompanied family/spouse living expenses are completely excluded'
    ],
    officialUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
    additionalUrls: [
      { title: 'A*STAR Graduate Academy', url: 'https://www.a-star.edu.sg/Scholarships' }
    ],
    lastChecked: '2026-10-18',
    verificationStatus: 'verified_official',
    verificationNotes: 'Verified against A*STAR Singapore 2026/2027 admissions bulletin (intake deadline Dec 1, 2026).'
  }
];

/**
 * Isolated demonstration / QA fixture scholarship record.
 * STRICTLY EXCLUDED from the live catalogue (SCHOLARSHIPS / LIVE_SCHOLARSHIPS)
 * so it never appears in user-facing search results, catalogue counts,
 * funding audits, comparison lab, or AI recommendations.
 * Exported specifically for test suites to validate boundary conditions.
 */
export const DEMO_FELLOWSHIP_FIXTURE: ScholarshipRecord = {
  id: 'demo-fellowship-test-2026',
  name: 'Demo International Merit Fellowship (Testing & QA Fixture)',
  provider: 'Global Education Demonstration Trust (Mock Data)',
  shortDescription: 'Clearly labeled benchmark demonstration record designed for hackathon testing and QA validation of boundary criteria, scale matching, and failed-requirement handling.',
  destinationCountry: 'United Kingdom',
  eligibleNationalities: ['Pakistan', 'India', 'Canada'],
  eligibleDegrees: ['master'],
  eligibleFields: ['All'],
  minGrade: {
    minimum: 3.5,
    scale: '4.0',
    flexibleEquivalencyNote: 'Strict minimum 3.5 on a 4.0 scale. Incompatible or percentage scales without official conversion are marked unknown.'
  },
  languageRequirements: {
    test: 'ielts',
    minScore: 7.0,
    note: 'Strict minimum overall IELTS 7.0 with no band less than 6.5.'
  },
  workExperienceRequiredYears: 1,
  mandatoryCriteria: [
    {
      id: 'demo-undergrad-degree',
      label: 'Completed 4-year undergraduate degree',
      description: 'Undergraduate degree must enable postgraduate entry.'
    },
    {
      id: 'demo-minimum-gpa',
      label: 'Mandatory 3.5+ CGPA (4.0 scale)',
      description: 'Non-negotiable academic requirement strictly enforced for test fixture evaluations.'
    }
  ],
  requiredDocuments: [
    'Demo academic transcript',
    'Demo test verification certificate'
  ],
  applicationOpeningDate: '2026-01-01',
  applicationDeadline: '2026-12-31',
  deadlineStatus: 'open',
  deadlineNote: 'Open year-round for software test simulations (Demonstration Fixture).',
  fundingType: 'Fully Funded',
  fundingBreakdown: {
    tuition: {
      status: 'covered',
      amountOrDetail: '100% demo tuition fee coverage',
      evidenceNote: 'Demonstration fixture note: Full tuition covered in mock record.',
      sourceUrl: 'https://example.org/demo-fellowship'
    },
    stipend: {
      status: 'covered',
      amountOrDetail: '£1,250/month test stipend',
      evidenceNote: 'Demonstration fixture note: Living allowance provided in mock record.',
      sourceUrl: 'https://example.org/demo-fellowship'
    },
    accommodation: {
      status: 'not_covered',
      amountOrDetail: 'No separate housing provided; must be paid from stipend',
      evidenceNote: 'Demonstration fixture note: Housing explicitly excluded as separate benefit.',
      sourceUrl: 'https://example.org/demo-fellowship'
    },
    travel: {
      status: 'partial',
      amountOrDetail: 'One-way outbound travel voucher up to £500',
      evidenceNote: 'Demonstration fixture note: Only outbound travel partially covered.',
      sourceUrl: 'https://example.org/demo-fellowship'
    },
    healthInsurance: {
      status: 'unknown',
      amountOrDetail: 'Policy details not confirmed in mock provider documentation',
      evidenceNote: 'Demonstration fixture note: Medical coverage deliberately marked unknown to test uncertain requirement handling.',
      sourceUrl: 'https://example.org/demo-fellowship'
    },
    visaFees: {
      status: 'not_covered',
      amountOrDetail: 'Visa fees excluded from coverage',
      evidenceNote: 'Demonstration fixture note: Visa fees must be self-funded.',
      sourceUrl: 'https://example.org/demo-fellowship'
    }
  },
  exclusions: [
    'Health insurance status is unconfirmed and needs provider clarification',
    'Visa fees are explicitly excluded'
  ],
  officialUrl: 'https://example.org/demo-fellowship',
  lastChecked: '2026-10-18',
  verificationStatus: 'demo_data',
  verificationNotes: 'Clearly marked demonstration record used for automated test suites and boundary condition QA.'
};

/**
 * The live scholarship catalogue. Contains ONLY authentic, real-world scholarship programs.
 * Excludes all demo / QA / test fixtures.
 */
export const SCHOLARSHIPS: ScholarshipRecord[] = LIVE_SCHOLARSHIPS_DATA;

/**
 * Explicit alias for live scholarships.
 */
export const LIVE_SCHOLARSHIPS = SCHOLARSHIPS;

/**
 * Combined list for testing / QA scenarios where fixture testing is explicitly requested.
 */
export const ALL_SCHOLARSHIPS_FOR_TESTS: ScholarshipRecord[] = [
  ...LIVE_SCHOLARSHIPS_DATA,
  DEMO_FELLOWSHIP_FIXTURE
];
