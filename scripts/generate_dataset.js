
/**
 * Dataset Generator Script with Fallback
 * Rapidly populates the problem database using Gemini AI, falling back to Groq if needed.
 * Usage: node scripts/generate_dataset.js
 * Author: Antigravity Agent
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;

const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "generated_problems.json");
const difficulties = ["beginner", "intermediate", "advanced"];
const geminiModels = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro-latest"];

// Helper to wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Groq Fallback Function
async function generateWithGroq(difficulty, existingTitles, batchSize) {
  if (!GROQ_API_KEY) throw new Error("VITE_GROQ_API_KEY not found for fallback");

  const groq = new Groq({ apiKey: GROQ_API_KEY });
  const prompt = `Generate ${batchSize} unique coding challenges for a "${difficulty}" level programmer.
    
    Constraints:
    1. The problems should NOT be any of the following: ${existingTitles.slice(-20).join(", ")}.
    2. Provide the output strictly as a JSON ARRAY of objects. Do not frame it in markdown.
    
    Schema for each object in the array:
    {
      "title": "string (Creative title, NO numbers at the end)",
      "difficulty": "${difficulty}",
      "category": "string (e.g. Arrays, Strings, DP, Graph)",
      "description": "string (Clear problem statement. Start with 'Given...')",
      "examples": [
        {"input": "string representation", "output": "string representation (strictly expected output)"}
      ],
      "starterCode": "string (JavaScript function signature)",
      "testCases": [
        {"input": [array of arguments], "expected": json_value}
      ],
      "functionName": "string (name of the function in starterCode)",
      "hints": ["string (Hint 1)"]
    }`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000
    });

    let text = completion.choices[0]?.message?.content || "";
    // Clean markdown if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // extract array
    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");

    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.substring(firstBracket, lastBracket + 1);
      return JSON.parse(text);
    } else if (text.startsWith('{')) {
      return [JSON.parse(text)];
    }

    console.warn("Groq response did not contain valid JSON array:", text.substring(0, 100) + "...");
    return []; // Return empty array instead of throwing to avoid crash
  } catch (err) {
    console.error("Groq generation failed:", err.message);
    return [];
  }
}


async function generateProblemBatch(genAI, difficulty, existingTitles, batchSize = 3) {
  const prompt = `
    Generate ${batchSize} unique coding challenges for a "${difficulty}" level programmer.
    
    Constraints:
    1. The problems should NOT be any of the following: ${existingTitles.slice(-20).join(", ")}.
    2. Provide the output strictly as a JSON ARRAY of objects. Do not frame it in markdown.
    
    Schema for each object in the array:
    {
      "title": "string (Creative title, NO numbers at the end)",
      "difficulty": "${difficulty}",
      "category": "string (e.g. Arrays, Strings, DP, Graph)",
      "description": "string (Clear problem statement)",
      "examples": [
        {"input": "string representation", "output": "string representation (strictly expected output)"}
      ],
      "starterCode": "string (JavaScript function signature)",
      "testCases": [
        {"input": [array of arguments], "expected": json_value}
      ],
      "functionName": "string (name of the function in starterCode)",
      "hints": [
        "string (Hint 1)"
      ]
    }
  `;

  // Try Gemini models first
  if (API_KEY) {
    for (const modelName of geminiModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const firstBracket = text.indexOf("[");
        const lastBracket = text.lastIndexOf("]");
        if (firstBracket !== -1 && lastBracket !== -1) {
          text = text.substring(firstBracket, lastBracket + 1);
          return JSON.parse(text);
        } else if (text.trim().startsWith('{')) {
          return [JSON.parse(text)];
        } else {
          // Don't throw immediately, try next model or fallback
          console.warn(`Gemini (${modelName}) returned invalid JSON format. Retrying/Fallback.`);
          continue;
        }
      } catch (e) {
        if (e.message.includes("404")) continue;
        console.warn(`Gemini (${modelName}) error:`, e.message);
      }
    }
  }

  // Fallback to Groq
  console.log("   Gemini failed/unavailable, switching to Groq/Llama...");
  return await generateWithGroq(difficulty, existingTitles, batchSize);
}

async function main() {
  console.log(`Starting generation of high-quality problems...`);
  console.log(`Gemini Key: ${!!API_KEY}, Groq Key: ${!!GROQ_API_KEY}`);

  try {
    const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

    if (fs.existsSync(OUTPUT_FILE)) {
      console.log("Clearing old static dataset...");
      fs.unlinkSync(OUTPUT_FILE);
    }

    let currentProblems = [];
    const TOTAL_TARGET = 30;

    while (currentProblems.length < TOTAL_TARGET) {
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const existingTitles = currentProblems.map(p => p.title);

      try {
        console.log(`[${currentProblems.length}/${TOTAL_TARGET}] Generating batch of 3 ${difficulty} problems...`);
        const newBatch = await generateProblemBatch(genAI, difficulty, existingTitles, 3);

        if (Array.isArray(newBatch)) {
          newBatch.forEach((p, index) => {
            p.id = Date.now() + index + Math.floor(Math.random() * 1000);
            if (!currentProblems.find(cp => cp.title === p.title)) {
              currentProblems.push(p);
            }
          });

          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(currentProblems, null, 2));
          console.log(`   Saved! Total now: ${currentProblems.length}`);
        }
        await sleep(2000);
      } catch (error) {
        console.error(`   Batch failed:`, error.message);
        await sleep(2000);
      }
    }
    console.log(`Done! Created ${currentProblems.length} unique AI problems.`);

  } catch (err) {
    console.error("FATAL ERROR IN MAIN:", err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Unhandled promise rejection:", err);
  process.exit(1);
});
