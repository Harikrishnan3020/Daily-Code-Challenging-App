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
        // Local execution for JS
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
        throw new Error(err.message || "Execution failed");
    }
};
