/**
 * Groq AI Integration (Fallback)
 * Provides fallback generation capabilities using Groq's high-performance LLM API when Gemini is unavailable.
 * Author: Antigravity Agent
 */
import Groq from "groq-sdk";
import { Problem } from "@/data/problems";

// TODO: Security - Move this key to an environment variable (VITE_GROQ_API_KEY) and access via import.meta.env
// TODO: Security - Move this key to an environment variable (VITE_GROQ_API_KEY) and access via import.meta.env
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

/**
 * Generates a coding challenge using Groq API (fallback for Gemini).
 */
export const generateProblemWithGroq = async (
  difficulty: string,
  excludeTitles: string[] = []
): Promise<Problem> => {
  const groq = new Groq({
    apiKey: GROQ_API_KEY,
    // Note: dangerouslyAllowBrowser is enabled for client-side demo purposes. 
    // In a production environment, requests should be proxied through a backend to protect the API key.
    dangerouslyAllowBrowser: true
  });

  const prompt = `Generate a unique coding challenge for a "${difficulty}" level programmer.

Constraints:
1. The problem should NOT be one of the following: ${excludeTitles.join(", ")}.
2. Provide the output strictly as a JSON object matching this schema. Do not frame it in markdown or add any extra text.

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
          {"input": [array of arguments], "expected": json_value} 
          {"input": [array of arguments], "expected": json_value} 
        ],
        "functionName": "string (name of the function in starterCode)",
        "hints": [
          "string (Hint 1)",
          "string (Hint 2)"
        ]
      }

      IMPORTANT rules for Description:
      - The 'description' MUST be self-contained and clear. 
      - Explicitly state: "Given [input], return [output]."
      - Ensure the description matches the examples and test cases exactly.

      IMPORTANT rules for Examples:
      - 'input' should be a string showing the variable assignment (e.g., "s = 'hello'").
      - 'output' should be a string showing the result (e.g., "'olleh'").

      IMPORTANT rules for Correctness:
      - Verify that the 'testCases' actually match the problem logic described.
      - Ensure 'expected' values in testCases are mathematically/logically correct for the given 'input'.

hints: [
  "For Test 1: Simply return the sum of the two arguments using the + operator.",
  "For Test 2: Remember that adding two negative numbers results in a smaller negative number."
]

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2048,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    // Clean potential markdown code blocks
    const jsonString = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const problem = JSON.parse(jsonString) as Problem;
    problem.id = Date.now();
    return problem;
  } catch (error: unknown) {
    console.error("Groq Generation Error:", error);
    throw new Error("Failed to generate challenge with Groq: " + (error as Error).message);
  }
};
