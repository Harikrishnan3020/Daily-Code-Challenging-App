
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Error: VITE_GEMINI_API_KEY is not set in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "generated_problems.json");
const TARGET_COUNT = 105; // Target 100+ total problems (including existing)

const difficulties = ["beginner", "intermediate", "advanced"];

// Helper to wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateProblemBatch(difficulty, existingTitles, batchSize = 5) {
  const prompt = `
    Generate ${batchSize} unique coding challenges for a "${difficulty}" level programmer.
    
    Constraints:
    1. The problems should NOT be any of the following: ${existingTitles.slice(-20).join(", ")}.
    2. Provide the output strictly as a JSON ARRAY of objects. Do not frame it in markdown.
    
    Schema for each object in the array:
    {
      "title": "string (Creative title)",
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
        "string (Hint 1)",
        "string (Hint 2)"
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Extract JSON array
    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Parse error: ${e.message}`);
  }
}

async function main() {
  console.log(`Starting rapid generation of problems to reach ${TARGET_COUNT}...`);

  let currentProblems = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      currentProblems = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
      console.log(`Loaded ${currentProblems.length} existing problems.`);
    } catch (e) {
      console.log("Could not parse existing file, starting fresh.");
    }
  }

  while (currentProblems.length < TARGET_COUNT) {
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const existingTitles = currentProblems.map(p => p.title);

    try {
      console.log(`[${currentProblems.length}/${TARGET_COUNT}] Generating batch of 5 ${difficulty} problems...`);
      const newBatch = await generateProblemBatch(difficulty, existingTitles, 5);

      if (Array.isArray(newBatch)) {
        // Process and add IDs
        newBatch.forEach((p, index) => {
          p.id = Date.now() + index + Math.floor(Math.random() * 1000);
          currentProblems.push(p);
        });

        // Save immediately
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(currentProblems, null, 2));
        console.log(`Saved! Total now: ${currentProblems.length}`);
      }

      await sleep(2000);
    } catch (error) {
      console.error(`Batch generation failed:`, error.message);
      await sleep(3000);
    }
  }

  console.log(`Done! Total problems in library: ${currentProblems.length}`);
}

main();
