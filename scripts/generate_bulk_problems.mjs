/**
 * Bulk Problem Generator Script
 * Generates 150+ coding problems using Groq API
 * 
 * Run: node scripts/generate_bulk_problems.js
 */

import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.error("Error: GROQ_API_KEY environment variable is not set.");
    process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

const CATEGORIES = [
    "Arrays", "Strings", "Dynamic Programming", "Trees", "Graphs",
    "Stack", "Queue", "Hash Maps", "Math", "Linked Lists",
    "Binary Search", "Backtracking", "Greedy", "Heap", "Bit Manipulation"
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

async function generateProblem(difficulty, category, index) {
    const prompt = `Generate a unique ${difficulty} level coding challenge in the "${category}" category.

Requirements:
1. Create a well-defined problem with a clear description
2. Include 2-3 examples showing input/output
3. Provide 3 progressive hints (from general approach to specific implementation details)
4. Include at least 3 test cases
5. Return ONLY a valid JSON object (no markdown, no extra text)

JSON Schema:
{
  "id": ${1000 + index},
  "title": "string (Unique, descriptive title)",
  "difficulty": "${difficulty}",
  "category": "${category}",
  "description": "string (Clear problem statement with context and constraints)",
  "examples": [
    {"input": "string representation", "output": "string representation"}
  ],
  "starterCode": "function functionName(...args) {\\n  // Your solution here\\n  \\n}",
  "testCases": [
    {"input": [array of arguments], "expected": value}
  ],
  "functionName": "string (camelCase function name)",
  "hints": [
    "Hint 1: General approach or strategy",
    "Hint 2: Key insight or data structure to use",
    "Hint 3: Implementation detail or edge case to consider"
  ]
}

Important:
- Make the problem interesting and educational
- Hints should be progressively revealing but not give away the solution
- Test cases should cover normal cases and edge cases
- Return ONLY the JSON, no markdown formatting`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.9,
            max_tokens: 2048,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Error generating problem ${index}:`, error.message);
        return null;
    }
}

async function generateBulkProblems(count = 150) {
    console.log(`🚀 Starting generation of ${count} problems...`);
    const problems = [];
    const existingTitles = new Set();

    for (let i = 0; i < count; i++) {
        const difficulty = DIFFICULTIES[i % 3];
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

        console.log(`Generating problem ${i + 1}/${count} - ${difficulty} ${category}...`);

        const problem = await generateProblem(difficulty, category, i);

        if (problem && !existingTitles.has(problem.title)) {
            problems.push(problem);
            existingTitles.add(problem.title);
            console.log(`✅ Generated: ${problem.title}`);
        } else {
            console.log(`⚠️ Skipped duplicate or failed problem ${i + 1}`);
        }

        // Rate limiting: wait 1 second between requests
        if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Save to file
    const outputPath = path.join(__dirname, "../src/data/generated_problems.json");
    fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2));

    console.log(`\n✨ Successfully generated ${problems.length} problems!`);
    console.log(`📁 Saved to: ${outputPath}`);

    // Print statistics
    const stats = {
        beginner: problems.filter(p => p.difficulty === "beginner").length,
        intermediate: problems.filter(p => p.difficulty === "intermediate").length,
        advanced: problems.filter(p => p.difficulty === "advanced").length,
    };

    console.log("\n📊 Statistics:");
    console.log(`   Beginner: ${stats.beginner}`);
    console.log(`   Intermediate: ${stats.intermediate}`);
    console.log(`   Advanced: ${stats.advanced}`);
    console.log(`   Total: ${problems.length}`);
}

// Run the generator
const targetCount = process.argv[2] ? parseInt(process.argv[2]) : 150;
generateBulkProblems(targetCount).catch(console.error);
