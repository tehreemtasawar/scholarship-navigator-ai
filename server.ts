import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  AIRequestValidationError,
  validateChatRequest,
  validateCompareRequest,
  validateExplainMatchRequest,
} from './src/logic/aiValidation.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '128kb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function logGeminiProviderError(endpoint: string, error: unknown): void {
  const providerError = error as {
    status?: number;
    httpStatus?: number;
    code?: string | number;
    message?: string;
  };
  const message = String(providerError.message || 'Unknown provider error')
    .replace(/AIza[0-9A-Za-z_-]+/g, '[redacted-key]')
    .replace(/authorization[^,;\n]*/gi, '[redacted-authorization]')
    .replace(/\s+/g, ' ')
    .slice(0, 240);
  console.error(
    `[Gemini provider error] endpoint=${endpoint} status=${providerError.status ?? providerError.httpStatus ?? 'unknown'} code=${providerError.code ?? 'unknown'} message=${message}`
  );
}

function buildRuleBasedExplanation(
  scholarship: ReturnType<typeof validateExplainMatchRequest>['scholarship'],
  evaluation: ReturnType<typeof validateExplainMatchRequest>['matchEvaluation']
): string {
  const met = evaluation.evaluations.filter((item) => item.status === 'meets');
  const unresolved = evaluation.evaluations.filter((item) => item.status === 'unknown');
  const failed = evaluation.evaluations.filter((item) => item.status === 'does_not_meet');
  const funding = Object.entries(scholarship.fundingBreakdown)
    .map(([expense, component]) => `${expense}: ${component.status}${component.amountOrDetail ? ` — ${component.amountOrDetail}` : ''}`)
    .join('\n- ');

  return `OFFLINE RULE-BASED EXPLANATION (Gemini unavailable)

### 1. Overall Profile Alignment
Deterministic result: ${evaluation.statusLabel}. Fit score: ${evaluation.fitScore ?? 'not available'}/100. This score describes profile and preference fit; it is not a probability of receiving an award.

### 2. Satisfied Requirements
${met.length ? met.map((item) => `- ${item.criterion}: ${item.reason}`).join('\n') : '- No requirements are marked as satisfied.'}

### 3. Missing, Failed, or Unconfirmed Requirements
${failed.length ? failed.map((item) => `- Failed: ${item.criterion}: ${item.reason}`).join('\n') : '- No failed requirements are recorded.'}
${unresolved.length ? unresolved.map((item) => `- Needs verification: ${item.criterion}: ${item.reason}`).join('\n') : '- No unresolved requirements are recorded.'}

### 4. Funding Reality Check Analysis
Deterministic funding assessment: ${evaluation.fundingAssessment}. ${evaluation.fundingAssessmentSummary}

Recorded coverage:
- ${funding}

### 5. Practical Next Actions
- Review the recorded unknown or partial items against the official provider source: ${scholarship.officialUrl || 'official provider portal'}.
- Confirm all failed or unresolved requirements before relying on this result.

This is a rule-based explanation from the application data, not a Gemini-generated response.`;
}

function buildOfflineChatResponse(
  scholarship: ReturnType<typeof validateChatRequest>['scholarship']
): string {
  return `OFFLINE HELP (Gemini unavailable)

I cannot answer this question with an AI-generated response right now. Use the displayed scholarship record and funding audit for the confirmed details. Any item marked unknown, partial, or needing verification should not be assumed to be covered or eligible.

Check the official provider source for the current answer: ${scholarship.officialUrl || 'the official provider portal'}.`;
}

function buildRuleBasedComparison(
  scholarships: ReturnType<typeof validateCompareRequest>['scholarships']
): string {
  return `RULE-BASED COMPARISON (Gemini unavailable)

AI synthesis is unavailable. The comparison below uses only the validated scholarship records supplied by the application.

${scholarships
  .map(
    (scholarship, index) => `### Option ${index + 1}: ${scholarship.name}
- Destination: ${scholarship.destinationCountry || 'Not recorded'}
- Deadline status: ${scholarship.deadlineStatus || 'Not recorded'}${scholarship.applicationDeadline ? ` (${scholarship.applicationDeadline})` : ''}
- Verification status: ${scholarship.verificationStatus || 'Not recorded'}
- Funding classification: ${scholarship.fundingType || 'Not recorded'}
- Expense coverage: ${Object.entries(scholarship.fundingBreakdown)
      .map(([expense, component]) => `${expense}=${component.status}`)
      .join(', ')}
- Official source: ${scholarship.officialUrl || 'Not recorded'}`
  )
  .join('\n\n')}

Do not treat a “Fully Funded” classification as proof that every expense is covered.`;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    app: 'Scholarship Navigator AI',
  });
});

// AI Eligibility Explainer endpoint
app.post('/api/explain-match', async (req: Request, res: Response) => {
  try {
    const { profile, scholarship, matchEvaluation } = validateExplainMatchRequest(req.body);

    if (!aiClient) {
      return res.json({
        groundedExplanation: buildRuleBasedExplanation(scholarship, matchEvaluation),
        isAiAvailable: false,
        isFallback: true,
        officialUrl: scholarship.officialUrl,
      });
    }

    const prompt = `
You are an expert, truthful international scholarship adviser for "Scholarship Navigator AI".
Your role is to explain the match evaluation for a student and scholarship strictly grounded in the verified data below.

IMPORTANT ANTI-HALLUCINATION INSTRUCTIONS:
1. Rely ONLY on the provided scholarship data, official notes, and rule-based evaluation.
2. DO NOT invent application deadlines, eligibility criteria, GPA conversion formulas, or funding amounts.
3. If an item is marked "unknown" or "needs verification", explicitly state that the official provider must be consulted.
4. If a mandatory criterion was failed (status: "does_not_meet"), you MUST NEVER claim the student is eligible or override the deterministic failure.
5. Never state the student is "guaranteed" to receive the scholarship or admission.
6. Clearly distinguish verified official facts from student profile data.
7. Preserve the deterministic funding assessment and summary exactly; do not upgrade, soften, or override a mandatory funding failure or unknown result.

--- STUDENT PROFILE ---
- Nationality: ${profile?.nationality || 'Not specified'}
- Current Education Level: ${profile?.currentEducationLevel || 'Not specified'}
- Current Degree: ${profile?.currentDegreeProgram || 'Not specified'}
- Intended Next Degree: ${profile?.intendedDegree || 'Not specified'}
- Field of Study: ${profile?.fieldOfStudy || 'Not specified'} (${profile?.specialization || 'General'})
- Grade: ${profile?.grade} (${profile?.gradeScale} scale)
- Work Experience: ${profile?.workExperienceYears ?? 0} years
- Language Test: ${profile?.languageTest} (Score: ${profile?.languageScore ?? 'None'})
- Stated Funding Priorities: Tuition (${profile?.fundingPriorities?.tuition}), Stipend (${profile?.fundingPriorities?.stipend}), Accommodation (${profile?.fundingPriorities?.accommodation}), Travel (${profile?.fundingPriorities?.travel}), Health Insurance (${profile?.fundingPriorities?.healthInsurance}), Visa Fees (${profile?.fundingPriorities?.visaFees})

--- SCHOLARSHIP RECORD ---
- Name: ${scholarship.name}
- Provider: ${scholarship.provider}
- Destination: ${scholarship.destinationCountry}
- Degree Levels: ${scholarship.eligibleDegrees?.join(', ')}
- Eligible Nationalities: ${scholarship.eligibleNationalities?.slice(0, 5).join(', ')}
- Academic Requirement: ${scholarship.minGrade ? scholarship.minGrade.minimum + ' (' + scholarship.minGrade.scale + ')' : 'No fixed cutoff'}
- Work Experience Required: ${scholarship.workExperienceRequiredYears ?? 0} years
- Funding Type: ${scholarship.fundingType}
- Official Website: ${scholarship.officialUrl}
- Last Checked: ${scholarship.lastChecked} (${scholarship.verificationStatus})
- Funding Breakdown:
  * Tuition: ${scholarship.fundingBreakdown?.tuition?.status} (${scholarship.fundingBreakdown?.tuition?.amountOrDetail || ''})
  * Stipend: ${scholarship.fundingBreakdown?.stipend?.status} (${scholarship.fundingBreakdown?.stipend?.amountOrDetail || ''})
  * Accommodation: ${scholarship.fundingBreakdown?.accommodation?.status} (${scholarship.fundingBreakdown?.accommodation?.amountOrDetail || ''})
  * Travel/Airfare: ${scholarship.fundingBreakdown?.travel?.status} (${scholarship.fundingBreakdown?.travel?.amountOrDetail || ''})
  * Health Insurance: ${scholarship.fundingBreakdown?.healthInsurance?.status} (${scholarship.fundingBreakdown?.healthInsurance?.amountOrDetail || ''})
  * Visa Fees: ${scholarship.fundingBreakdown?.visaFees?.status} (${scholarship.fundingBreakdown?.visaFees?.amountOrDetail || ''})

--- DETERMINISTIC EVALUATION RESULTS ---
- Overall Status: ${matchEvaluation.overallStatus} (${matchEvaluation.statusLabel})
- Fit Score: ${matchEvaluation.fitScore}/100 (Profile & Preference Fit, not win probability)
- Funding Assessment: ${matchEvaluation.fundingAssessment} (${matchEvaluation.fundingAssessmentSummary})
- Evaluated Criteria:
${matchEvaluation.evaluations
  ?.map((e: any) => `  * ${e.criterion}: ${e.status.toUpperCase()} (Required: ${e.requiredValue} | Student: ${e.studentValue} | Reason: ${e.reason})`)
  .join('\n')}

Generate a concise, well-structured explanation using markdown with these specific sections:
### 1. Overall Profile Alignment
(Explain why this scholarship fits or does not fit the student's profile)

### 2. Satisfied Requirements
(Bullet points of known verified requirements that the student appears to satisfy)

### 3. Missing, Failed, or Unconfirmed Requirements
(Explicitly list any failed mandatory criteria or items marked unknown that require credential evaluation)

### 4. Funding Reality Check Analysis
(Compare student's financial needs with the actual package. Highlight expenses like health insurance or accommodation that are partial or not covered)

### 5. Practical Next Actions
(Actionable steps: e.g., checking official provider website, scheduling test, requesting transcripts)
`;

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2, // Low temperature for high factual adherence
        },
      });
    } catch (error) {
      logGeminiProviderError('/api/explain-match', error);
      return res.json({
        groundedExplanation: buildRuleBasedExplanation(scholarship, matchEvaluation),
        isAiAvailable: false,
        isFallback: true,
        officialUrl: scholarship.officialUrl,
      });
    }

    const explanation = response.text || 'Unable to generate explanation at this time.';

    return res.json({
      groundedExplanation: explanation,
      isAiAvailable: true,
      officialUrl: scholarship.officialUrl,
    });
  } catch (error: any) {
    if (error instanceof AIRequestValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error in /api/explain-match:', error?.message || error);
    return res.status(500).json({
      error: 'AI service encountered an issue. Rule-based evaluation remains fully valid.',
    });
  }
});

// AI Scholarship Assistant Q&A
app.post('/api/chat-scholarship', async (req: Request, res: Response) => {
  try {
    const { question, scholarship, profile } = validateChatRequest(req.body);

    if (!aiClient) {
      return res.json({
        answer: buildOfflineChatResponse(scholarship),
        isAiAvailable: false,
        isFallback: true,
      });
    }

    const systemPrompt = `
You are the dedicated AI Scholarship Assistant for "${scholarship.name}".
You answer questions strictly based on the provided scholarship record and student profile.
Rules:
- Never guess missing facts. If an answer cannot be determined from the provided data, state: "This detail is not confirmed in our current dataset. Please check the official provider portal at ${scholarship.officialUrl}."
- Be concise, supportive, and clear.
- Do not guarantee admission, visa approval, or scholarship awards.
- Keep answers under 200 words.

Scholarship Data:
${JSON.stringify(scholarship, null, 2)}

Student Profile:
- Nationality: ${profile.nationality || 'Not specified'}
- Current Education Level: ${profile.currentEducationLevel || 'Not specified'}
- Current Degree: ${profile.currentDegreeProgram || 'Not specified'}
- Intended Next Degree: ${profile.intendedDegree || 'Not specified'}
- Field of Study: ${profile.fieldOfStudy || 'Not specified'} (${profile.specialization || 'General'})
- Grade: ${profile.grade ?? 'Not specified'} (${profile.gradeScale || 'Not specified'} scale)
- Work Experience: ${profile.workExperienceYears ?? 'Not specified'} years
- Language Test: ${profile.languageTest || 'Not specified'} (Score: ${profile.languageScore ?? 'None'})
- Funding Priorities: ${JSON.stringify(profile.fundingPriorities)}
`;

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\nUser Question: ${question}`,
        config: {
          temperature: 0.3,
        },
      });
    } catch (error) {
      logGeminiProviderError('/api/chat-scholarship', error);
      return res.json({
        answer: buildOfflineChatResponse(scholarship),
        isAiAvailable: false,
        isFallback: true,
      });
    }

    return res.json({
      answer: response.text || 'No answer generated.',
      isAiAvailable: true,
    });
  } catch (error: any) {
    if (error instanceof AIRequestValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error in /api/chat-scholarship:', error?.message || error);
    return res.status(500).json({
      error: 'Unable to process assistant query.',
    });
  }
});

// Compare 2-3 scholarships with AI analysis
app.post('/api/compare-scholarships', async (req: Request, res: Response) => {
  try {
    const { scholarships, profile } = validateCompareRequest(req.body);

    if (!aiClient) {
      return res.json({
        analysis:
          'AI comparison synthesis is unavailable without GEMINI_API_KEY. Use the structured side-by-side comparison table below to review differences.',
        isAiAvailable: false,
      });
    }

    const prompt = `
You are an expert, objective scholarship advisor. Compare the following ${scholarships.length} scholarships specifically tailored for this student:

Student:
- Nationality: ${profile?.nationality || 'Unknown'}
- Intended Degree: ${profile?.intendedDegree || 'Master'}
- Field: ${profile?.fieldOfStudy || 'General'}
- CGPA: ${profile?.grade} (${profile?.gradeScale} scale)
- Stated Financial Musts: ${Object.entries(profile?.fundingPriorities || {})
      .filter(([_, v]) => v === 'must')
      .map(([k]) => k)
      .join(', ') || 'Standard full funding'}

Scholarships to Compare:
${scholarships
  .map(
    (s: any, idx: number) => `
Option ${idx + 1}: ${s.name} (${s.destinationCountry})
- Provider: ${s.provider}
- Deadline Status: ${(s.deadlineStatus || 'unconfirmed').toUpperCase()} (Date: ${s.applicationDeadline || 'Check provider'})
- Deadline Guidance: ${s.deadlineNote || 'Consult official source for current intake window.'}
- Verification Status: ${s.verificationStatus} (Source: ${s.sourceTitle || 'Official website'})
- Funding Type: ${s.fundingType}
- Tuition: ${s.fundingBreakdown?.tuition?.status} (${s.fundingBreakdown?.tuition?.amountOrDetail || ''})
- Stipend: ${s.fundingBreakdown?.stipend?.status} (${s.fundingBreakdown?.stipend?.amountOrDetail || ''})
- Accommodation: ${s.fundingBreakdown?.accommodation?.status} (${s.fundingBreakdown?.accommodation?.amountOrDetail || ''})
- Travel: ${s.fundingBreakdown?.travel?.status} (${s.fundingBreakdown?.travel?.amountOrDetail || ''})
- Health Insurance: ${s.fundingBreakdown?.healthInsurance?.status} (${s.fundingBreakdown?.healthInsurance?.amountOrDetail || ''})
- Visa Fees: ${s.fundingBreakdown?.visaFees?.status} (${s.fundingBreakdown?.visaFees?.amountOrDetail || ''})
- Exclusions & Out-of-Pocket Expenses: ${s.exclusions?.join('; ') || 'None explicitly listed'}
- Mandatory Criteria: ${s.mandatoryCriteria?.map((m: any) => m.label).join('; ')}
`
  )
  .join('\n---\n')}

CRITICAL GROUNDING INSTRUCTIONS:
- Base your analysis STRICTLY on the provided scholarship records above. Do NOT invent or assume eligibility requirements, deadlines, or funding benefits that are not listed.
- Identify and clearly highlight uncertainty and deadline status: if a scholarship is CLOSED, clearly state that it is closed for the current cycle and relevant for future cycles only. If a scholarship's deadline or requirements are UNCONFIRMED or marked 'needs_verification', flag that explicitly.
- Accurately state health coverage and visa provisions based only on the supplied record. If a component is marked unknown, explicitly say it requires official confirmation; never infer coverage from a "Fully Funded" classification.
- Provide a structured comparison covering:
  1. Deadline & Timing Status (Open vs Closed vs Upcoming)
  2. Eligibility & Application Burden (work experience, return obligations, etc.)
  3. Real Funding Differences (which package covers more out-of-pocket costs)
  4. Student Profile Alignment (pros and cons for this specific student)
  5. Mandatory Next Steps & Verification Advisories
`;

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });
    } catch (error) {
      logGeminiProviderError('/api/compare-scholarships', error);
      return res.json({
        analysis: buildRuleBasedComparison(scholarships),
        isAiAvailable: false,
        isFallback: true,
      });
    }

    return res.json({
      analysis: response.text || 'Unable to generate comparison analysis.',
      isAiAvailable: true,
    });
  } catch (error: any) {
    if (error instanceof AIRequestValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error in /api/compare-scholarships:', error?.message || error);
    return res.status(500).json({
      error: 'Comparison analysis failed.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Scholarship Navigator AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
