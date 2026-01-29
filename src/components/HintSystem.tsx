import { useState, useEffect } from "react";
import { Lightbulb, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HintSystemProps {
    /** List of hint strings - each hint corresponds to a test case */
    hints: string[];
    /** Number of test cases passed so far (to unlock hints) */
    testsPassed?: number;
    /** Total number of test cases */
    totalTests?: number;
}

/**
 * HintSystem Component with Test Case-Linked Hints
 * - First problem (user's first ever): All hints visible immediately
 * - All subsequent problems: 
 *   - Hint 1 unlocks for Test Case 1
 *   - Hint 2 unlocks when Test Case 1 passes
 *   - Hint 3 unlocks when Test Case 2 passes
 *   - Each hint helps with the corresponding test case
 */
const HintSystem = ({ hints, testsPassed = 0, totalTests = 3 }: HintSystemProps) => {
    const [problemsSolved, setProblemsSolved] = useState(0);
    const [maxHintsUnlocked, setMaxHintsUnlocked] = useState(1);

    // Check if this is the user's first problem
    useEffect(() => {
        const solved = parseInt(localStorage.getItem("hackathon-habit-solved") || "0");
        setProblemsSolved(solved);
    }, []);

    // ALLOW REVEAL but don't auto-reveal
    useEffect(() => {
        // Unlock all available hints so the user CAN click to reveal needed
        setMaxHintsUnlocked(hints.length);
        // Start with NONE revealed (user must click)
        setRevealedCount(0);
    }, [hints.length]);

    const [revealedCount, setRevealedCount] = useState(0);

    const revealNextHint = () => {
        if (revealedCount < maxHintsUnlocked && revealedCount < hints.length) {
            setRevealedCount((prev) => prev + 1);
        }
    };

    return (
        <div className="glass-card p-4 md:p-6 animate-slide-up mt-4">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    Hints
                    {problemsSolved === 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                            First Problem - All Unlocked!
                        </span>
                    )}
                </h3>
                <span className="text-xs text-muted-foreground">
                    {revealedCount} / {hints.length} Revealed
                </span>
            </div>

            {/* Info about test case linkage */}
            {problemsSolved > 0 && (
                <div className="mb-3 text-xs text-muted-foreground bg-secondary/20 border border-border/20 rounded p-2">
                    💡 Each hint helps with a specific test case. Pass tests to unlock more hints!
                </div>
            )}

            {/* Hint List */}
            <div className="space-y-3">
                {hints.map((hint, index) => {
                    const isRevealed = index < revealedCount;
                    const isUnlocked = index < maxHintsUnlocked;
                    const testCaseNumber = index + 1;
                    const isTestPassed = testsPassed >= testCaseNumber;

                    return (
                        <div
                            key={index}
                            className={`
                                p-3 rounded-lg border text-sm transition-all
                                ${isRevealed
                                    ? 'bg-secondary/50 border-border/50 text-muted-foreground italic animate-fade-in'
                                    : isUnlocked
                                        ? 'bg-warning/10 border-warning/30 text-foreground'
                                        : 'bg-secondary/10 border-border/20 text-muted-foreground/30'
                                }
                            `}
                        >
                            {/* Test Case Label */}
                            <div className="flex items-center gap-2 mb-1 text-xs font-semibold">
                                {isTestPassed ? (
                                    <CheckCircle className="w-3 h-3 text-success" />
                                ) : (
                                    <span className="text-muted-foreground">Test Case {testCaseNumber}</span>
                                )}
                                {isTestPassed && (
                                    <span className="text-success">Test {testCaseNumber} Passed!</span>
                                )}
                            </div>

                            {/* Hint Content */}
                            {isRevealed ? (
                                <div className="mt-1">💡 {hint}</div>
                            ) : isUnlocked ? (
                                <span className="flex items-center gap-2 text-warning">
                                    <Lightbulb className="w-3 h-3" />
                                    Hint for Test Case {testCaseNumber} available - Click "Reveal"
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    Pass Test Case {index} to unlock this hint
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Reveal Button */}
            {revealedCount < maxHintsUnlocked && revealedCount < hints.length && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={revealNextHint}
                    className="w-full mt-4 border-dashed hover:bg-warning/10 hover:border-warning"
                >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Reveal Hint for Test Case {revealedCount + 1}
                </Button>
            )}

            {/* Progress Info */}
            {problemsSolved > 0 && (
                <div className="mt-3 text-xs text-center">
                    <span className="text-muted-foreground">
                        {testsPassed} / {totalTests} Test Cases Passed
                    </span>
                    {testsPassed < totalTests && (
                        <span className="block mt-1 text-warning">
                            → Complete more tests to unlock hints!
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default HintSystem;
