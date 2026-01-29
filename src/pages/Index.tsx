/**
 * Index Page (Dashboard)
 * 
 * The main container for the application's core functionality.
 * - Manages global state (streak, XP, user level)
 * - Orchestrates the daily problem loading flow
 * - Handles code submission and result visualization
 * 
 * @module Dashboard
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProblemCard from "@/components/ProblemCard";
import TimerCard from "@/components/TimerCard";
import CodeEditor, { Language } from "@/components/CodeEditor";
import SubmitButton from "@/components/SubmitButton";
import TestResults, { TestResult } from "@/components/TestResults";
import HintSystem from "@/components/HintSystem";
import { problems as staticProblems, Problem } from "@/data/problems";
import { generateProblem } from "@/lib/gemini";
import { executeCode } from "@/lib/codeExecution";
import { deepEqual } from "@/lib/utils";
import { getRankFromProblems, getRankFromXP, XP_REWARDS } from "@/lib/ranks";
import { toast } from "sonner";
import { Bell, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * Generates the boilerplate code for the selected language.
 * @param lang - Target programming language
 * @param functionName - Name of the function to generate
 * @returns Starter code string
 */
const getStarterCode = (lang: Language, functionName: string): string => {
  switch (lang) {
    case "javascript":
      return `function ${functionName}(...args) {\n  // Your solution here\n  \n}`;
    case "python":
      return `def ${functionName}(*args):\n    # Your solution here\n    pass`;
    case "c":
      // TODO: Implement C execution via Piston
      return `// C support coming soon (Use JS/Python for now)\n// Piston API requires main() function wrapper for C`;
    case "cpp":
      // TODO: Implement C++ execution via Piston
      return `// C++ support coming soon (Use JS/Python for now)\n// Piston API requires main() function wrapper for C++`;
    default:
      return "";
  }
};

/**
 * Index Page Component (Main Dashboard)
 * Orchestrates the daily challenge flow, problem loading, and user progress.
 * Manages state for code, results, streaks, and gamification.
 */
const Index = () => {
  const navigate = useNavigate();
  // --- Persistent State ---
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "advanced">(() => {
    return (localStorage.getItem("hackathon-habit-level") as any) || "beginner";
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("hackathon-habit-streak");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [problemsSolved, setProblemsSolved] = useState(() => {
    const saved = localStorage.getItem("hackathon-habit-solved");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem("hackathon-habit-xp");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastVisit] = useState(() => {
    return localStorage.getItem("hackathon-habit-last-visit");
  });

  // --- Dynamic Problem State ---
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");

  // --- UI State ---
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isSolved, setSolved] = useState(false);

  // --- Daily Logic & Problem Loading ---
  const loadProblem = useCallback(async (forceNew = false) => {
    setIsLoading(true);
    setSolved(false); // Reset solved state for new problem
    setShowResults(false);
    setTestResults([]);

    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem("hackathon-habit-problem-date");
    const storedProblem = localStorage.getItem("hackathon-habit-daily-problem");

    // If we have a problem for today and NOT forcing new, use it
    if (!forceNew && storedDate === todayStr && storedProblem) {
      try {
        const parsed = JSON.parse(storedProblem);
        setCurrentProblem(parsed);
        setCode(getStarterCode("javascript", parsed.functionName));
        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse stored problem", e);
      }
    }

    // Otherwise, generate a NEW one with Gemini
    try {
      const problemHistory = JSON.parse(localStorage.getItem("hackathon-habit-history") || "[]");

      toast.info(forceNew ? "Generating Next Challenge..." : "Generating Daily Challenge...", {
        description: "Our AI is crafting a unique problem just for you."
      });

      const newProblem = await generateProblem(userLevel, problemHistory);

      setCurrentProblem(newProblem);
      setCode(getStarterCode("javascript", newProblem.functionName));

      // Update storage
      localStorage.setItem("hackathon-habit-problem-date", todayStr);
      localStorage.setItem("hackathon-habit-daily-problem", JSON.stringify(newProblem));

      problemHistory.push(newProblem.title);
      localStorage.setItem("hackathon-habit-history", JSON.stringify(problemHistory));
    } catch (error: any) {
      console.error("Gemini failed, using fallback", error);

      if (error.message.includes("Missing API Key")) {
        toast.error("AI Generation Unavailable", {
          description: "Please add your API Key in Settings to generate new problems.",
          action: {
            label: "Settings",
            onClick: () => navigate("/settings")
          }
        });
      } else {
        toast.error("AI Generation Failed", { description: "Using a classic problem instead." });
      }

      const fallbackPool = staticProblems.filter(p => p.difficulty === userLevel);
      const pool = fallbackPool.length > 0 ? fallbackPool : staticProblems;
      const randomFallback = pool[Math.floor(Math.random() * pool.length)];

      setCurrentProblem(randomFallback);
      setCode(getStarterCode("javascript", randomFallback.functionName));
    } finally {
      setIsLoading(false);
    }
  }, [userLevel]);

  // Initial load
  useEffect(() => {
    loadProblem(false);
  }, [loadProblem]);

  // Handle language switch
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (currentProblem) {
      setCode(getStarterCode(newLang, currentProblem.functionName));
    }
  };

  // --- Streak Logic ---
  useEffect(() => {
    const todayStr = new Date().toDateString();

    if (lastVisit && lastVisit !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit !== yesterday.toDateString()) {
        if (streak > 0) {
          setStreak(0);
          toast.error("Streak Lost!", { description: "You missed a day." });
        }
      } else {
        setShowWelcomeModal(true);
      }
    } else if (!lastVisit) {
      setShowWelcomeModal(true);
    }
    localStorage.setItem("hackathon-habit-last-visit", todayStr);
  }, []);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem("hackathon-habit-level", userLevel);
    localStorage.setItem("hackathon-habit-streak", streak.toString());
    localStorage.setItem("hackathon-habit-solved", problemsSolved.toString());
    localStorage.setItem("hackathon-habit-xp", userXP.toString());
  }, [userLevel, streak, problemsSolved, userXP]);


  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      toast.error("Not supported", { description: "This browser does not support desktop notifications" });
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success("Notifications Enabled", { description: "We'll remind you to keep your streak!" });
        }
      });
    }
  };

  const handleNextProblem = () => {
    loadProblem(true);
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!currentProblem) return false;

    setShowResults(false);
    setTestResults([]);

    // Small UI delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let results: TestResult[] = [];
    let allPassed = true;

    try {
      for (const testCase of currentProblem.testCases) {
        let result;
        let errorMsg;
        let passed = false;
        try {
          // Execute using our universal service
          const inputs = JSON.parse(JSON.stringify(testCase.input));
          result = await executeCode(language, code, currentProblem, inputs);
          passed = deepEqual(result, testCase.expected);
        } catch (err: any) {
          errorMsg = err.message;
        }
        if (!passed) allPassed = false;
        results.push({ passed, input: testCase.input, expected: testCase.expected, actual: result, error: errorMsg });
      }
    } catch (error: any) {
      toast.error("Execution Error", { description: error.message });
      return false;
    }

    setTestResults(results);
    setShowResults(true);

    if (allPassed) {
      setSolved(true); // Mark as solved
      setStreak((prev) => prev + 1);

      // Problems update
      const oldProblems = problemsSolved;
      const newProblems = problemsSolved + 1;
      setProblemsSolved(newProblems);

      // XP Update
      const xpGain = XP_REWARDS[userLevel];
      const oldXP = userXP;
      const newXP = oldXP + xpGain;
      setUserXP(newXP);

      // Update persistent user object and list for leaderboard
      const currentUserStr = localStorage.getItem("hackathon-habit-user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        currentUser.xp = newXP;
        localStorage.setItem("hackathon-habit-user", JSON.stringify(currentUser));

        // Update in all-users list
        const allUsers = JSON.parse(localStorage.getItem("hackathon-habit-all-users") || "[]");
        const updatedUsers = allUsers.map((u: any) => u.id === currentUser.id ? { ...u, xp: newXP } : u);
        localStorage.setItem("hackathon-habit-all-users", JSON.stringify(updatedUsers));
      }

      toast.success(`+${xpGain} XP Gained!`, {
        description: "Excellent work!"
      });

      // Check for rank progression (using XP)
      const oldRank = getRankFromXP(oldXP);
      const newRank = getRankFromXP(newXP);

      if (newRank.tier > oldRank.tier) {
        // Rank up celebration!
        setTimeout(() => {
          toast.success(`🎉 Rank Up to ${newRank.name} League!`, {
            description: `${newRank.description} - Keep crushing it!`,
            duration: 5000,
          });
          confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 },
            colors: [newRank.color, '#FFD700', '#FFFFFF']
          });
        }, 1000);
      }

      const newTotal = newProblems;
      if (newTotal === 5 && userLevel === 'beginner') {
        setUserLevel('intermediate');
        toast.success("Level Up! 🌟", { description: "You are now an Intermediate coder!" });
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      } else if (newTotal === 15 && userLevel === 'intermediate') {
        setUserLevel('advanced');
        toast.success("Level Up! 🚀", { description: "You are now an Advanced coder!" });
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      } else {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      toast.success("Solution Accepted!", { description: "Great work!" });
    } else {
      toast.error("Solution Failed", { description: "Check results for details." });
    }

    return allPassed;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Crafting Your Daily Challenge</h2>
          <p className="text-muted-foreground">Consulting the AI Oracle...</p>
        </div>
      </div>
    );
  }

  if (!currentProblem) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

      {/* Welcome / Streak Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome back! 👋</DialogTitle>
            <DialogDescription>
              Your current streak is <span className="text-primary font-bold">{streak} days</span>.
              Our AI has generated a fresh problem for you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowWelcomeModal(false)}>Let's Code</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative container max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        <Header streak={streak} problemsSolved={problemsSolved} xp={userXP} />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Level:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${userLevel === 'beginner' ? 'bg-success/20 text-success' :
              userLevel === 'intermediate' ? 'bg-warning/20 text-warning' :
                'bg-destructive/20 text-destructive'
              }`}>
              {userLevel}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={requestNotificationPermission}>
            <Bell className="w-4 h-4" /> Enable Reminders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <ProblemCard problem={currentProblem} />
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
            />

            <div className="flex gap-4">
              <SubmitButton onSubmit={handleSubmit} disabled={code.trim().length === 0} />

              {isSolved && (
                <Button
                  onClick={handleNextProblem}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white animate-fade-in"
                >
                  Next Challenge <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>

            <TestResults results={testResults} visible={showResults} />
          </div>

          <div className="space-y-4 md:space-y-6 order-first lg:order-last">
            <TimerCard />
            <HintSystem
              hints={currentProblem.hints}
              testsPassed={testResults.filter(r => r.passed).length}
              totalTests={currentProblem.testCases.length}
            />


            <div className="glass-card p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">📊 Level Progress</h3>
                <span className="text-xs text-muted-foreground">{problemsSolved} / {
                  userLevel === 'beginner' ? 5 : userLevel === 'intermediate' ? 15 : 'MAX'
                } to next</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: userLevel === 'beginner'
                      ? `${Math.min((problemsSolved / 5) * 100, 100)}%`
                      : userLevel === 'intermediate'
                        ? `${Math.min(((problemsSolved - 5) / 10) * 100, 100)}%`
                        : '100%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
