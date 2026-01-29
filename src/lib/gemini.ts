/**
 * Google Gemini Integration
 * Provides functionality to generate coding problems and analyze user code using Google's Gemini AI models.
 * Author: Antigravity Agent
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Problem } from "@/data/problems";

// NOTE: In a production app, never expose your API key on the client side.
// This should be done via a backend proxy.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Only use env var if present (e.g. from user build)

/**
 * Helper to get the authenticated Gemini client.
 * 
 * Logic:
 * 1. Checks for a user-provided API key in localStorage (from Settings).
 * 2. Fallbacks to the environment variable key (VITE_GEMINI_API_KEY).
 * 3. Throws an error if no key is found.
 */
const getGenAI = () => {
  const userKey = localStorage.getItem("hackathon-habit-api-key");
  const keyToUse = userKey || API_KEY;

  if (!keyToUse) {
    throw new Error("Missing API Key. Please add your API Key in Settings.");
  }

  return new GoogleGenerativeAI(keyToUse);
};

/**
 * Generates a coding challenge using AI.
 * 
 * @param difficulty - Difficulty level (e.g. "beginner", "intermediate")
 * @param excludeTitles - List of titles to avoid generating duplicates
 * @returns A structured Problem object
 */
export const generateProblem = async (difficulty: string, excludeTitles: string[] = []): Promise<Problem> => {
  // Using gemini-1.5-flash (base name) for v1beta API compatibility
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate a unique coding challenge for a "${difficulty}" level programmer.
      
      Constraints:
      1. The problem should NOT be one of the following: ${excludeTitles.join(", ")}.
      2. Provide the output strictly as a JSON object matching this schema. Do not frame it in markdown.
      
      Schema:
      {
        "id": number (use Date.now()),
        "title": "string (Title Case, e.g. 'Binary Tree Level Order')",
        "difficulty": "${difficulty}",
        "category": "string (e.g. Arrays, Strings, DP, Graph)",
        "description": "string (Clear problem statement. MUST specify constraints. MUST specify input format and output format clearly.)",
        "examples": [
          {"input": "input representation (e.g. 'nums = [2, 7], target = 9')", "output": "output representation (e.g. '[0, 1]')"}
        ],
        "starterCode": "string (JavaScript function signature)",
        "testCases": [
          {"input": [array of arguments], "expected": json_value} // Test Case 1 (Basic)
          {"input": [array of arguments], "expected": json_value} // Test Case 2 (Edge Case / Complex)
        ],
        "functionName": "string (name of the function in starterCode)",
        "hints": [
          "string (Hint 1: SPECIFIC help for Test Case 1. How to get started and pass the basic input.)",
          "string (Hint 2: SPECIFIC help for Test Case 2. Address the edge case or logic required for the second test.)"
        ]
      }

      IMPORTANT rules for Description:
      - The 'description' MUST be self-contained and clear. 
      - Explicitly state: "Given [input], return [output]."
      - Ensure the description matches the examples and test cases exactly.

      IMPORTANT rules for Correctness:
      - **CRITICAL**: Check your generated test cases.
      - Ensure 'expected' values in testCases are mathematically/logically correct for the given 'input'.
      - Verify that the 'testCases' actually match the problem logic described.

      IMPORTANT rules for logic:
      - You MUST generate exactly 2 test cases and exactly 2 hints.
      - **CRITICAL**: Hint N must directly help the user pass Test Case N.
      - Hint 1 -> Helps with Test Case 1 (Basic Logic).
      - Hint 2 -> Helps with Test Case 2 (Edge Case/Constraint).
      - Do NOT provide generic "strategy" hints. Provide actionable hints related to the specific inputs of the corresponding test case.

      IMPORTANT rules for testCases:
      - "input" must be an array of arguments that will be passed to the function using spread syntax (...input).
      - "expected" must be the exact return value.
      - Test Case 1 should be a standard, simple example.
      - Test Case 2 should test a common edge case or complexity.
      
      Example for an "add" function:
      starterCode: "function add(a, b) { ... }"
      testCases: [
        {"input": [1, 2], "expected": 3},        // Test 1: Simple
        {"input": [-1, -5], "expected": -6}      // Test 2: Negatives/Edge
      ]
      hints: [
        "For Test 1: Simply return the sum of the two arguments using the + operator.",
        "For Test 2: Remember that adding two negative numbers results in a smaller negative number."
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean potential markdown code blocks if the model ignores instruction
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const problem = JSON.parse(jsonString) as Problem;
    // ensure ID is unique-ish
    problem.id = Date.now();
    return problem;
  } catch (error: any) {
    if (error.message.includes("Missing API Key")) {
      throw error; // Re-throw to be caught by UI
    }

    console.error("Gemini Generation Error:", error);
    console.log("Attempting to use Groq API as fallback...");

    // Try Groq API as fallback
    try {
      const { generateProblemWithGroq } = await import("./groq");
      return await generateProblemWithGroq(difficulty, excludeTitles);
    } catch (groqError: any) {
      console.error("Groq fallback also failed:", groqError);
      throw new Error("Failed to generate a new challenge with both Gemini and Groq.");
    }
  }
};

export interface CodeAnalysis {
  hasError: boolean;
  line?: number;
  message?: string;
  suggestion?: string;
  isCorrect?: boolean;
}

export const analyzeCode = async (
  code: string,
  problemTitle: string,
  problemDescription: string,
  language: string
): Promise<CodeAnalysis> => {
  // Using gemini-1.5-flash (base name) for v1beta API compatibility
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
     Act as a senior software engineer code reviewer.
     
     Task: Analyze the following ${language} code for the problem "${problemTitle}".
     Problem Description: ${problemDescription}
     
     User Code:
     ${code}
     
     Instructions:
     1. Detailedly check for syntax errors, logical bugs, or infinite loops.
     2. If there is a bug or error, pinpoint the LINE NUMBER (1-indexed).
     3. Provide a helpful error message explaining *why* it is wrong.
     4. Provide a suggestion on how to fix it WITHOUT giving the full solution code directly if possible (guide them).
     5. If the code looks logically correct (even if not optimal), set hasError to false.
     
     Return strictly JSON with this schema:
     {
       "hasError": boolean,
       "line": number | null,
       "message": "string (brief explanation of error)",
       "suggestion": "string (how to fix)",
       "isCorrect": boolean
     }
   `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return {
      hasError: true,
      message: `Analysis error: ${error.message || "Unknown error"}. Check API key or connection.`,
      isCorrect: false
    };
  }
};
