import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('[Warning] GEMINI_API_KEY is not set in backend/.env. API requests will fail without a valid key.');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Digiicampus Study Notes Backend',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/generate-notes', async (req, res) => {
  try {
    const { courseName, moduleName, content, noteType = 'detailed', options = {} } = req.body;

    if (!courseName || !moduleName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: courseName and moduleName are required.'
      });
    }

    console.log(`[AI Backend] Generating ${noteType} notes for: ${courseName} -> ${moduleName}`);

    const systemPrompt = `You are a world-class academic tutor and university professor specializing in high-yield study material.
Generate comprehensive, highly structured, clear, and accurate study notes for a university student.

REQUIREMENTS:
- Produce output strictly formatted as valid JSON matching the exact schema requested below.
- Do NOT hallucinate facts not present in or inferred from the source material.
- Note Type: ${noteType.toUpperCase()}.
  - If "simple": concise, quick revision focus, key definitions, core concepts, short examples.
  - If "detailed": in-depth step-by-step explanations, detailed mathematical formulas/equations, comparison tables, common misconceptions, exam questions with suggested answers.

JSON SCHEMA TO RETURN:
{
  "courseName": "${courseName}",
  "moduleTitle": "${moduleName}",
  "noteType": "${noteType}",
  "generatedAt": "${new Date().toISOString()}",
  "overview": "Clear 2-3 paragraph academic overview introducing the module topic from basic concepts to advanced implications.",
  "learningObjectives": [
    "Objective 1...",
    "Objective 2...",
    "Objective 3..."
  ],
  "keyConcepts": [
    "Core Concept 1",
    "Core Concept 2",
    "Core Concept 3"
  ],
  "detailedExplanations": [
    {
      "heading": "Section Heading 1",
      "explanation": "In-depth explanation paragraph...",
      "subpoints": ["Point A", "Point B"]
    }
  ],
  "importantDefinitions": [
    { "term": "Term Name", "definition": "Clear concise definition." }
  ],
  "stepByStepGuides": [
    { "title": "Algorithmic or Logical Step Guide", "steps": ["Step 1", "Step 2", "Step 3"] }
  ],
  "examples": [
    { "title": "Practical Example 1", "problem": "Problem scenario", "solution": "Step by step solution" }
  ],
  "formulasAndEquations": [
    { "name": "Formula Name", "formula": "Mathematical notation", "explanation": "Variable descriptions" }
  ],
  "comparisons": [
    { "conceptA": "Concept A", "conceptB": "Concept B", "keyDifferences": "Key distinction" }
  ],
  "commonMisconceptions": [
    { "misconception": "Common myth/error", "fact": "True principle" }
  ],
  "practicalApplications": [
    "Real world engineering / industrial application 1",
    "Application 2"
  ],
  "quickRevisionPoints": [
    "High yield summary point 1",
    "High yield summary point 2"
  ],
  "importantQuestions": [
    { "question": "Exam Question?", "suggestedAnswer": "Comprehensive answer outline.", "marks": 5 }
  ],
  "examOrientedTips": [
    "Key mistake to avoid during exams",
    "Important diagram or table to remember"
  ]
}`;

    const promptText = `${systemPrompt}

COURSE SOURCE CONTENT & TOPICS:
Course: ${courseName}
Module: ${moduleName}

Educational Material Text:
${content || 'Standard academic syllabus material for ' + moduleName}`;

    // Call Gemini API using google-genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const textOutput = response.text;
    let jsonNotes;

    try {
      jsonNotes = JSON.parse(textOutput);
    } catch (parseErr) {
      console.warn('[AI Backend] Response was not clean JSON, cleaning code blocks...');
      const cleaned = textOutput.replace(/```json\n?|\n?```/g, '').trim();
      jsonNotes = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      notes: jsonNotes
    });

  } catch (err) {
    console.error('[AI Backend Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate study notes via Gemini AI backend.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Digiicampus Study Notes Backend Server Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Note Generation: POST http://localhost:${PORT}/api/generate-notes`);
  console.log(`=======================================================`);
});
