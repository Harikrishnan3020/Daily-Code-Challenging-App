/**
 * Code Execution Utility
 * Handles executing user code in various languages using local eval (JS) or Piston API (Python).
 * Author: Antigravity Agent
 */
import { Language } from "@/components/CodeEditor";
import { Problem } from "@/data/problems";

interface PistonResponse {
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
    };
}

/**
 * API endpoint for the Piston code execution engine.
 * v2 API supports multiple languages and versions.
 */
// TODO: Move to VITE_PISTON_API_URL in .env for flexibility
const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

/**
 * Executes user code against a set of inputs.
 * Uses local execution for JavaScript (unsafe eval context) and Piston API for Python.
 * 
 * @param language - Target programming language
 * @param code - User's raw source code
 * @param problem - Problem definition containing function name
 * @param input - List of arguments to pass to the function
 * @returns The return value of the function execution
 */
export const executeCode = async (
    language: Language,
    code: string,
    problem: Problem,
    input: any[]
): Promise<any> => {
    if (language === "javascript") {
        // Local execution for JS using Function constructor.
        // WARNING: This runs in the browser's context. 
        // In a production environment with untrusted code, this should be sandboxed or run server-side.
        const userFn = new Function(code + `\nreturn ${problem.functionName};`)();
        if (typeof userFn !== "function") throw new Error(`Function ${problem.functionName} not found.`);
        return userFn(...input);
    }

    // Piston Execution for Python, C, C++
    let languageKey = "";
    let version = "";
    let fileContent = code;

    if (language === "python") {
        languageKey = "python";
        version = "3.10.0";

        // Wrap to call the function and print result as JSON for basic types
        // Using json.dumps to ensure output format is consistent
        // We add unique delimiters to separate the actual result from any user stdout prints
        const args = JSON.stringify(input);
        fileContent = `
import sys
import json

${code}

if __name__ == "__main__":
    try:
        args = ${args}
        result = ${problem.functionName}(*args)
        print("---PISTON-JSON-START---")
        print(json.dumps(result))
        print("---PISTON-JSON-END---")
    except Exception as e:
        print(e, file=sys.stderr)
`;
    } else if (language === "c" || language === "cpp") {
        throw new Error("C/C++ execution requires full program structure (main function) which is experimenting.");
    }

    try {
        const response = await fetch(PISTON_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: languageKey,
                version: version,
                files: [{ content: fileContent }],
            }),
        });

        const result: PistonResponse = await response.json();

        if (result.run.stderr) {
            throw new Error(result.run.stderr);
        }

        const output = result.run.stdout;

        // Try to parse JSON output with delimiters
        const startDelimiter = "---PISTON-JSON-START---";
        const endDelimiter = "---PISTON-JSON-END---";

        const startIndex = output.indexOf(startDelimiter);
        const endIndex = output.indexOf(endDelimiter);

        if (startIndex !== -1 && endIndex !== -1) {
            const jsonStr = output.substring(startIndex + startDelimiter.length, endIndex).trim();
            try {
                return JSON.parse(jsonStr);
            } catch {
                throw new Error("Failed to parse execution result");
            }
        }

        // Fallback for cases without delimiters (shouldn't happen for Python if updated correctly, but for others)
        // Or if the script crashed before printing delimiters but didn't write to stderr
        try {
            return JSON.parse(output.trim());
        } catch {
            return output.trim();
        }

    } catch (err: any) {
        // Enhance error message with line numbers if possible
        let errorMsg = err.message || "Execution failed";

        if (language === "python") {
            // Python Piston errors usually look like: File "...", line 5, in ...
            // Our wrapper adds 4 lines of prelude (empty, imports, empty)
            // So we subtract 4 from the reported line number
            const preludeOffset = 4;
            errorMsg = errorMsg.replace(/line (\d+)/g, (match: string, lineNum: string) => {
                const correctedLine = Math.max(1, parseInt(lineNum, 10) - preludeOffset);
                return `line ${correctedLine}`;
            });
        } else if (language === "javascript") {
            // JS errors in new Function often have line info in the stack, not the message
            // Format: <anonymous>:2:5 or just :2:5
            if (err.stack) {
                const stackLines = err.stack.split('\n');
                // Regex to find :line:column pattern typical in V8/Browsers for eval/new Function
                // Looking for patterns like (<anonymous>:2:15) or (eval at ... :2:15)
                const lineMatch = err.stack.match(/<anonymous>:(\d+):/);
                if (lineMatch && lineMatch[1]) {
                    const lineNum = parseInt(lineMatch[1], 10);
                    // The appended "return ..." could cause errors on the last line + 1, 
                    // but usually user errors are within their own code. 
                    // No offset needed for new Function body starting at char 0
                    errorMsg = `Line ${lineNum}: ${errorMsg}`;
                }
            }
        }

        throw new Error(errorMsg);
    }
};
