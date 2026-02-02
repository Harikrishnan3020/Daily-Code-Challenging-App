import { Language } from "@/components/CodeEditor";

export const getStarterCode = (language: string, functionName: string): string => {
    if (language === "javascript") {
        return `function ${functionName}(...args) {
  // Your code here
  
}`;
    } else if (language === "python") {
        return `def ${functionName}(*args):
  # Your code here
  pass`;
    } else if (language === "cpp") {
        return `// C++ execution is experimental
// Write your solution here`;
    }
    return "";
};
