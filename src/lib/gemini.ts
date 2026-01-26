import { GoogleGenerativeAI } from "@google/generative-ai";
import { Problem } from "@/data/problems";

// NOTE: In a production app, never expose your API key on the client side.
// This should be done via a backend proxy.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAN_Q5MMJE7jZNt5ClaTsSWOOdcYEgGmeg";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a coding challenge using AI.
 * 
 * @param difficulty - Difficulty level (e.g. "beginner", "intermediate")
 * @param excludeTitles - List of titles to avoid generating duplicates
 * @returns A structured Problem object
 */
export const generateProblem = async (difficulty: string, excludeTitles: string[] = []): Promise<Problem> => {
  // Using gemini-1.5-flash (base name) for v1beta API compatibility
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate a unique coding challenge for a "${difficulty}" level programmer.
    
    Constraints:
    1. The problem should NOT be one of the following: ${excludeTitles.join(", ")}.
    2. Provide the output strictly as a JSON object matching this schema. Do not frame it in markdown.
    
    Schema:
    {
      "id": number (use Date.now()),
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
        "string (Hint 1: High-level approach - explain the general strategy without giving away the solution)",
        "string (Hint 2: Key insight - point out the crucial data structure or algorithm concept needed)",
        "string (Hint 3: Implementation detail - provide a specific technique or edge case to consider)"
      ]
    }

    IMPORTANT rules for hints:
    - Hint 1 should guide the user toward the right approach (e.g., "Think about using a hash map to store values you've seen")
    - Hint 2 should reveal a key insight or pattern (e.g., "For each element, check if its complement exists in your stored values")
    - Hint 3 should address implementation details or edge cases (e.g., "Remember to handle the case where the same element can't be used twice")
    - Make hints progressively more revealing but never give the complete solution
    - Each hint should be 1-2 sentences and actionable

    IMPORTANT rules for testCases:
    - "input" must be an array of arguments that will be passed to the function using spread syntax (...input).
    - "expected" must be the exact return value.
    - Make sure edge cases are covered.
    
    Example for an "add" function:
    starterCode: "function add(a, b) { ... }"
    testCases: [{"input": [1, 2], "expected": 3}]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean potential markdown code blocks if the model ignores instruction
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const problem = JSON.parse(jsonString) as Problem;
    // ensure ID is unique-ish
    problem.id = Date.now();
    return problem;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate a new challenge. Please try again.");
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
