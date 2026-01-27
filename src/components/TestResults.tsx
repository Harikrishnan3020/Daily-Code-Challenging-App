import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Represents the outcome of a sinlge test case execution.
 */
export interface TestResult {
    /** Whether the test succeeded */
    passed: boolean;
    /** The arguments passed to the function */
    input: any;
    /** The expected return value */
    expected: any;
    /** The actual returned value */
    actual: any;
    /** Error message if an exception was thrown */
    error?: string;
}

interface TestResultsProps {
    results: TestResult[];
    visible: boolean;
}

const TestResults = ({ results, visible }: TestResultsProps) => {
    if (!visible) return null;

    const allPassed = results.length > 0 && results.every((r) => r.passed);

    return (
        <div className="glass-card p-4 md:p-6 animate-slide-up mt-4 md:mt-6">
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${allPassed ? "text-success" : "text-destructive"}`}>
                {allPassed ? (
                    <CheckCircle2 className="w-4 h-4" />
                ) : (
                    <XCircle className="w-4 h-4" />
                )}
                {allPassed ? "All Test Cases Passed" : "Some Test Cases Failed"}
            </h3>

            <ScrollArea className="max-h-[300px] pr-4">
                <div className="space-y-3">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg text-sm border ${result.passed
                                ? "bg-success/5 border-success/20"
                                : "bg-destructive/5 border-destructive/20"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {result.passed ? (
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-destructive" />
                                )}
                                <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    Test Case {index + 1}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                                <div>
                                    <span className="text-muted-foreground mr-2">Input:</span>
                                    <span className="text-foreground">{JSON.stringify(result.input)}</span>
                                </div>
                                {!result.error ? (
                                    <>
                                        <div>
                                            <span className="text-muted-foreground mr-2">Expected:</span>
                                            <span className="text-success">{JSON.stringify(result.expected)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground mr-2">Actual:</span>
                                            <span className={`${result.passed ? 'text-success' : 'text-destructive'}`}>
                                                {JSON.stringify(result.actual)}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-start gap-2 text-destructive mt-1">
                                        <AlertCircle className="w-3 h-3 mt-0.5" />
                                        <span>{result.error}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default TestResults;
