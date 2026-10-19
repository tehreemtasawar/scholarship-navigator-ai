# Scholarship Navigator AI

> **Find Scholarships That Fit Your Future.**  
> An evidence-grounded decision engine for international and domestic scholarship seekers, combining deterministic eligibility evaluation, expense-by-expense funding reality checks, and truthful AI explanations.

---

## 1. Problem Statement

Every year, millions of students—particularly from Pakistan and emerging nations—search for international graduate scholarships (e.g., Chevening, Fulbright, DAAD, Erasmus Mundus, Australia Awards). However, students face severe challenges:

1. **Superficial Match Lists:** Most scholarship websites display huge lists of links without verifying whether a student meets mandatory degree, nationality, or work experience cutoffs.
2. **Deceptive "Fully Funded" Labels:** Awards advertised as fully funded can exclude crucial expenses (e.g., the UK Immigration Health Surcharge in Chevening, embassy visa fees in Erasmus Mundus, or housing security bonds); each item must be checked against current official guidance.
3. **AI Hallucinations:** Generic AI chatbots frequently invent non-existent deadlines, fabricate eligibility exemptions, or hallucinate acceptance probabilities.
4. **Forced Grading Conversions:** Students on percentage scales or non-standard GPA systems are subjected to inaccurate conversions that misrepresent their eligibility.

---

## 2. Solution & Key Differentiators

Scholarship Navigator AI replaces guesswork with a **two-tier architecture**:

- **Tier 1: Deterministic Matching Engine (Zero Hallucination)**
  - Hard rules (nationality restrictions, degree levels, study fields, minimum GPAs, work experience hours) are evaluated using strict TypeScript application logic.
  - Incompatible grading scales and missing tests are classified truthfully as **Unknown / Needs Verification**, never assumed to be satisfied.
  - If a mandatory criterion is failed, the scholarship is marked **Likely Ineligible**. A high preference fit score or AI prompt cannot override or hide a failed mandatory rule.

- **Tier 2: Funding Reality Check (Expense-by-Expense Audit)**
  - Breaks down six key costs: Tuition, Living Stipend, Accommodation, Airfare, Health Insurance, and Visa Costs.
  - Evaluates each expense as `covered`, `partial`, `not_covered`, or `unknown`.
  - Flags gaps where students must pay out-of-pocket costs before departing.

- **Tier 3: Grounded AI Explanation (Server-Side Gemini 3.8 Flash)**
  - Server-side Gemini API calls are strictly constrained to factual records in the dataset.
  - Answers specific questions without guessing or making claims of acceptance guarantees.

- **Tier 4: Actionable Application Roadmap & Comparison Lab**
  - Auto-generates application checklists categorizing confirmed provider requirements from general preparation milestones.
  - Supports side-by-side comparison of 2 to 3 scholarships with difference highlighting.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Express.js running on Node.js / tsx
- **AI Integration:** `@google/genai` TypeScript SDK (`gemini-3.8-flash`) via secure server-side endpoints
- **Data Architecture:** Fully typed TypeScript scholarship schema with verified provider data and test fixtures
- **State & Persistence:** React Context with browser `localStorage` for offline milestone tracking
- **Testing:** `node:test` test runner executed via `tsx --test`

---

## 4. Architecture & Separation of Concerns

```
├── server.ts                       # Express server + Gemini API endpoints (/api/explain-match, /api/chat-scholarship)
├── index.html                      # Entry point with SEO and typography
├── package.json                    # Scripts and dependencies
├── src/
│   ├── types/
│   │   └── scholarship.ts          # Core data models (StudentProfile, ScholarshipRecord, MatchResult)
│   ├── data/
│   │   ├── scholarships.ts         # Verified scholarship records with expense breakdowns
│   │   └── demoProfiles.ts         # Quick test profiles A (Meets), B (Fails), C (Uncertain)
│   ├── logic/
│   │   ├── matching.ts             # Deterministic matching & funding evaluation engine
│   │   └── matching.test.ts        # Fast unit tests for logic boundaries
│   ├── context/
│   │   └── ScholarshipContext.tsx  # Central state management & local storage sync
│   └── components/
│       ├── Header.tsx              # Navigation & Quick Demo Profile selector
│       ├── Footer.tsx              # Educational disclaimer & navigation
│       ├── HomePage.tsx            # Hero, 3-step workflow, features & trust guarantees
│       ├── ProfileForm.tsx         # Multi-step profile input with grading scale safeguards
│       ├── ResultsDashboard.tsx    # Filterable results cards with status badges
│       ├── ScholarshipDetails.tsx  # Side-by-side evaluation table, expense audit & AI chat
│       ├── FundingRealityCheck.tsx # Multi-program expense matrix comparison
│       ├── ComparisonLab.tsx       # 2-3 scholarship side-by-side trade-off analysis
│       ├── ApplicationRoadmap.tsx  # Milestone tracker with localStorage persistence
│       ├── AboutPage.tsx           # Methodology & architecture documentation
│       └── PrivacyPage.tsx         # Privacy guarantees & educational disclaimer
```

---

## 5. Local Setup & Development Instructions

### Prerequisites
- Node.js (v20 or v22 recommended)
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/your-username/scholarship-navigator-ai.git
cd scholarship-navigator-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```
> **Security Note:** The `GEMINI_API_KEY` is loaded on the server only (`server.ts`) and is never bundled into or accessible by client-side code.

### 4. Run Unit Tests
Verify that deterministic matching, boundary checks, and funding tests pass:
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 6. How to Run the Hackathon Demonstration (60–90 Seconds)

1. **Home Page:** Open the home page and introduce the problem of unverified directories and hidden scholarship costs.
2. **One-Click Test Profiles:**
   - Click **"Profile A: High Achiever"** to view a candidate meeting all known requirements for Chevening and DAAD.
   - Click **"Profile B: Strict Boundary"** to demonstrate that low CGPA (2.3) and insufficient work experience explicitly flag the student as **Likely Ineligible**, proving AI cannot mask failed criteria.
   - Click **"Profile C: Incomplete / Scale Incompatibility"** to demonstrate how percentage grading and missing IELTS tests are marked as **Unknown / Needs Verification** rather than falsely assumed to be satisfied.
3. **Scholarship Details & Expense Audit:** Open Chevening to compare tuition, stipend, housing, travel, visa, and health-insurance evidence expense by expense. The current IHS status is explicitly marked for official verification.
4. **AI Explainer:** Click **"Explain My Match with AI"** to see grounded synthesis strictly citing the verified record.
5. **Comparison Lab & Roadmap:** Compare Chevening with Fulbright, and check off milestones in the Application Roadmap.

---

## 7. Production Build & Deployment

### Build the Application
```bash
npm run build
```
This produces an optimized production bundle in `dist/`.

### Run Production Server
```bash
npm start
```
The Express server in `server.ts` will serve the static files from `dist/` and expose the API routes.

---

## 8. Data Model & Adding New Scholarships

To add a new scholarship, add an entry to `src/data/scholarships.ts` matching the `ScholarshipRecord` interface:

```typescript
{
  id: 'unique-id',
  name: 'Scholarship Name',
  provider: 'Provider Agency / Ministry',
  destinationCountry: 'Country',
  eligibleNationalities: ['Pakistan', 'All'],
  eligibleDegrees: ['master', 'phd'],
  eligibleFields: ['All', 'STEM', 'Public Policy'],
  minGrade: { minimum: 3.0, scale: '4.0' },
  fundingBreakdown: {
    tuition: { status: 'covered', evidenceNote: '...' },
    stipend: { status: 'covered', evidenceNote: '...' },
    accommodation: { status: 'partial', evidenceNote: '...' },
    travel: { status: 'covered', evidenceNote: '...' },
    healthInsurance: { status: 'not_covered', evidenceNote: '...' },
    visaFees: { status: 'covered', evidenceNote: '...' },
  },
  officialUrl: 'https://...',
  verificationStatus: 'verified_official', // or 'demo_data'
  lastChecked: '2026-03-15'
}
```

---

## 9. Privacy, Security & Disclaimers

- **Zero-Account Privacy:** No user accounts, passwords, or personal documents are required.
- **No Document Uploads:** We do not request CNIC numbers, passport copies, or bank credentials.
- **Client Storage:** Profile inputs and roadmap tasks reside in browser `localStorage`.
- **Educational Disclaimer:**
  > *Scholarship Navigator AI provides preliminary guidance based on the information available in its dataset. Scholarship requirements, deadlines, and funding can change. Always confirm eligibility, costs, deadlines, and application instructions with the official scholarship provider. The app does not guarantee eligibility, admission, funding, or an award.*

---

## 10. Team Contributions

- **Full-Stack Engineering & AI Architecture:** Designed two-tier matching engine, server-side Gemini endpoints, and React SPA.
- **Data Research & Verification:** Curated official funding data, evidence citations, and official links for major global fellowships.
- **UI/UX & Accessibility:** Built responsive, accessible interface with explicit status badges, contrast checks, and touch-friendly controls.
