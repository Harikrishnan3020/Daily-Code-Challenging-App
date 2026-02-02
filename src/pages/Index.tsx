/**
 * Index Page (Dashboard)
 * 
 * The main container for the application's core functionality.
 * - Manages global state (streak, XP, user level)
 * - Orchestrates the daily problem loading flow
 * - Handles code submission and result visualization
 * - Provides post-completion analysis and recommendations
 * 
 * @module Dashboard
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Bell, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CodeEditor, { Language } from "@/components/CodeEditor";
import SubmitButton from "@/components/SubmitButton";
import TestResults, { TestResult } from "@/components/TestResults";
import ProblemCard from "@/components/ProblemCard";
import HintSystem from "@/components/HintSystem";
import TimerCard from "@/components/TimerCard";
import SolutionFeedback from "@/components/SolutionFeedback";

import { generateProblem } from "@/lib/gemini";
import { executeCode } from "@/lib/codeExecution";
import { deepEqual } from "@/lib/utils";
import { Problem, problems as staticProblems } from "@/data/problems";
import { getRankFromXP, XP_REWARDS } from "@/lib/ranks";
import { getStarterCode } from "@/lib/starterCode";
import { analyzeCode as analyzeUserCode, CodeAnalysis } from "@/lib/codeAnalyzer";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSolved, setSolved] = useState(false);

  // Post-completion analysis
  const [showFeedback, setShowFeedback] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis | null>(null);
  const problemStartTime = useRef<number>(Date.now());
  const [actualTimeTaken, setActualTimeTaken] = useState<number>(0); // Store exact time at submission

  // User Progression State
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "advanced">(() =>
    (localStorage.getItem("hackathon-habit-level") as "beginner" | "intermediate" | "advanced") || "beginner"
  );
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("hackathon-habit-streak") || "0"));
  const [problemsSolved, setProblemsSolved] = useState(() => parseInt(localStorage.getItem("hackathon-habit-solved") || "0"));
  const [userXP, setUserXP] = useState(() => parseInt(localStorage.getItem("hackathon-habit-xp") || "0"));
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [lastVisit] = useState(localStorage.getItem("hackathon-habit-last-visit"));
  const [language, setLanguage] = useState<Language>("javascript");

  // --- Daily Logic & Problem Loading ---
  const loadProblem = useCallback(async (forceNew = false) => {
    setIsLoading(true);
    setSolved(false); // Reset solved state for new problem
    setShowResults(false);
    setTestResults([]);
    problemStartTime.current = Date.now(); // Reset timer for new problem

    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem("hackathon-habit-problem-date");
    const storedProblem = localStorage.getItem("hackathon-habit-daily-problem");

    // Check if we are coming from "Practice" button or specific problem recommendation
    const practiceCategory = location.state?.focusCategory;
    const loadProblemId = location.state?.loadProblemId;

    // If loading a specific problem by ID
    if (loadProblemId) {
      const specificProblem = staticProblems.find(p => p.id === loadProblemId);
      if (specificProblem) {
        setCurrentProblem(specificProblem);
        setCode(getStarterCode("javascript", specificProblem.functionName));
        setIsLoading(false);
        // Clear state so reload doesn't stick
        window.history.replaceState({}, '');
        return;
      }
    }

    // If we have a problem for today and NOT forcing new AND no specific practice intent, use it
    if (!forceNew && !practiceCategory && storedDate === todayStr && storedProblem) {
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
      const detailedHistory = JSON.parse(localStorage.getItem("hackathon-habit-detailed-history") || "[]");

      // --- Adaptive Learning Analysis ---
      // Analyze last 10 problems to find weaknesses
      let focusCategory = practiceCategory || undefined;
      let toastMessage = "Our AI is crafting a unique problem just for you.";

      if (practiceCategory) {
        toastMessage = `Generating a targeted ${practiceCategory} challenge to help you improve!`;
        // Clear state so reload doesn't stick
        window.history.replaceState({}, '');
      } else if (detailedHistory.length >= 5) {
        const sorted = detailedHistory.sort((a: { date: number }, b: { date: number }) => b.date - a.date); // Sort by date just in case
        const recentActivity = sorted.slice(0, 10);

        // Count category frequency in recent history
        const categoryCounts: Record<string, number> = {};
        recentActivity.forEach((entry: { category: string }) => {
          categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
        });

        // Simple heuristic: If you haven't seen a topic in a while, or if logic is added for "failed" attempts later
        // For now, let's randomly pick a category they haven't seen much of, OR
        // purely random rotation if balanced. 
        // A better approach for "what user lacks":
        // If we tracked failures, we'd pick that. Since we only track 'solved' on submit currently (or skipped),
        // let's assume we want to broaden horizons.

        // Let's bias towards a standard set of topics if missing
        const standardTopics = ["Arrays", "Strings", "Dynamic Programming", "Trees", "Graphs", "Hash Maps"];
        const missingTopics = standardTopics.filter(t => !Object.keys(categoryCounts).includes(t));

        if (missingTopics.length > 0) {
          focusCategory = missingTopics[Math.floor(Math.random() * missingTopics.length)];
          toastMessage = `Noticed you haven't done ${focusCategory} lately. Let's practice that!`;
        }
      }

      toast.info(forceNew ? "Generating Next Challenge..." : "Generating Daily Challenge...", {
        description: toastMessage
      });

      const newProblem = await generateProblem(userLevel, problemHistory, focusCategory);

      setCurrentProblem(newProblem);
      setCode(getStarterCode("javascript", newProblem.functionName));

      // Update storage
      localStorage.setItem("hackathon-habit-problem-date", todayStr);
      localStorage.setItem("hackathon-habit-daily-problem", JSON.stringify(newProblem));

      // Quick history update (titles only)
      problemHistory.push(newProblem.title);
      localStorage.setItem("hackathon-habit-history", JSON.stringify(problemHistory));

    } catch (error: unknown) {
      console.error("Gemini failed, using fallback", error);

      if ((error as Error).message.includes("Missing API Key")) {
        toast.error("🔑 API Key Required", {
          description: "Add your Gemini API key in Settings to unlock AI-generated problems!",
          duration: 6000,
          action: {
            label: "Open Settings",
            onClick: () => navigate("/settings")
          }
        });
      } else {
        toast.info("Using Classic Problem", {
          description: "AI generation temporarily unavailable. You're getting a curated challenge instead!",
          duration: 4000
        });
      }

      const fallbackPool = staticProblems.filter(p => p.difficulty === userLevel);
      const pool = fallbackPool.length > 0 ? fallbackPool : staticProblems;
      const randomFallback = pool[Math.floor(Math.random() * pool.length)];

      setCurrentProblem(randomFallback);
      setCode(getStarterCode("javascript", randomFallback.functionName));
    } finally {
      setIsLoading(false);
    }
  }, [userLevel, location.state?.focusCategory, navigate]);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem("hackathon-habit-level", userLevel);
    localStorage.setItem("hackathon-habit-streak", streak.toString());
    localStorage.setItem("hackathon-habit-solved", problemsSolved.toString());
    localStorage.setItem("hackathon-habit-xp", userXP.toString());

    // CRITICAL: Also update the user object to persist data across logins
    const currentUserStr = localStorage.getItem("hackathon-habit-user");
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const history = JSON.parse(localStorage.getItem("hackathon-habit-history") || "[]");
        const lastVisit = localStorage.getItem("hackathon-habit-last-visit") || "";

        // Update user object with all current progress
        const updatedUser = {
          ...currentUser,
          xp: userXP,
          problemsSolved: problemsSolved,
          streak: streak,
          level: userLevel,
          history: history,
          lastVisit: lastVisit
        };

        localStorage.setItem("hackathon-habit-user", JSON.stringify(updatedUser));

        // Also update in all-users list for leaderboard
        const allUsers = JSON.parse(localStorage.getItem("hackathon-habit-all-users") || "[]");
        const updatedUsers = allUsers.map((u: { id: string }) =>
          u.id === currentUser.id ? updatedUser : u
        );
        localStorage.setItem("hackathon-habit-all-users", JSON.stringify(updatedUsers));
      } catch (error) {
        console.error("Failed to update user object:", error);
      }
    }
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
    setShowFeedback(false);
    loadProblem(true);
  };

  const handleContinuePractice = () => {
    setShowFeedback(false);
    // Navigate to practice mode with focus category
    if (currentProblem) {
      navigate("/", { state: { focusCategory: currentProblem.category } });
      loadProblem(true);
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!currentProblem) return false;

    setShowResults(false);
    setTestResults([]);

    // Small UI delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results: TestResult[] = [];
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
        } catch (err: unknown) {
          errorMsg = (err as Error).message;
        }
        if (!passed) allPassed = false;
        results.push({ passed, input: testCase.input, expected: testCase.expected, actual: result, error: errorMsg });
      }
    } catch (error: unknown) {
      toast.error("Execution Error", { description: (error as Error).message });
      return false;
    }

    setTestResults(results);
    setShowResults(true);

    if (results.length === 0) {
      toast.error("No test cases found", { description: "This problem seems to be malformed." });
      return false;
    }

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
        const history = JSON.parse(localStorage.getItem("hackathon-habit-history") || "[]");
        const lastVisit = localStorage.getItem("hackathon-habit-last-visit") || "";

        // Update ALL user progress fields
        const updatedUser = {
          ...currentUser,
          xp: newXP,
          problemsSolved: newProblems,
          streak: streak,
          level: userLevel,
          history: history,
          lastVisit: lastVisit
        };

        localStorage.setItem("hackathon-habit-user", JSON.stringify(updatedUser));

        // Update in all-users list
        const allUsers = JSON.parse(localStorage.getItem("hackathon-habit-all-users") || "[]");
        const updatedUsers = allUsers.map((u: { id: string }) =>
          u.id === currentUser.id ? updatedUser : u
        );
        localStorage.setItem("hackathon-habit-all-users", JSON.stringify(updatedUsers));
      }

      // 🎯 Analyze user's code for history and feedback
      const timeTaken = Math.floor((Date.now() - problemStartTime.current) / 1000); // seconds
      setActualTimeTaken(timeTaken);
      const analysis = analyzeUserCode(code, currentProblem.category, timeTaken);
      setCodeAnalysis(analysis); // Trigger modal state

      // Save Detailed History for Adaptive/Weakness Analysis
      const detailedHistory = JSON.parse(localStorage.getItem("hackathon-habit-detailed-history") || "[]");
      detailedHistory.push({
        problemId: currentProblem.id,
        title: currentProblem.title,
        category: currentProblem.category,
        date: Date.now(),
        result: 'solved',
        timeTaken,
        masteryLevel: analysis.masteryLevel,
        timeComplexity: analysis.timeComplexity
      });
      localStorage.setItem("hackathon-habit-detailed-history", JSON.stringify(detailedHistory));

      // Track solved problem IDs for recommendations
      const solvedIds = JSON.parse(localStorage.getItem("hackathon-habit-solved-ids") || "[]");
      if (!solvedIds.includes(currentProblem.id)) {
        solvedIds.push(currentProblem.id);
        localStorage.setItem("hackathon-habit-solved-ids", JSON.stringify(solvedIds));
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

          // Trigger visual effects specific to the new rank
          import("@/lib/rankAnimations").then(({ triggerRankUpAnimation }) => {
            triggerRankUpAnimation(newRank);
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

      // Show feedback modal after a short delay
      setTimeout(() => {
        setShowFeedback(true);
      }, 1500);
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

      {/* Solution Feedback Modal */}
      {codeAnalysis && currentProblem && (
        <SolutionFeedback
          open={showFeedback}
          onClose={() => setShowFeedback(false)}
          analysis={codeAnalysis}
          problem={currentProblem}
          timeTaken={actualTimeTaken}
          onContinuePractice={handleContinuePractice}
          onNextProblem={handleNextProblem}
        />
      )}

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
              hints={currentProblem.hints.slice(0, 1)}
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
