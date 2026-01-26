import { useState } from "react";
import Header from "@/components/Header";
import ProblemCard from "@/components/ProblemCard";
import TimerCard from "@/components/TimerCard";
import CodeEditor from "@/components/CodeEditor";
import SubmitButton from "@/components/SubmitButton";

const todaysProblem = {
  id: 1,
  title: "Two Sum",
  difficulty: "easy" as const,
  category: "Arrays",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
  ],
};

const starterCode = `function twoSum(nums, target) {
  // Your solution here
  
}`;

const Index = () => {
  const [code, setCode] = useState(starterCode);
  const [streak, setStreak] = useState(7);
  const [problemsSolved, setProblemsSolved] = useState(42);

  const handleSubmit = async (): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Mock success (in real app, would validate solution)
    const success = code.length > 50;
    
    if (success) {
      setStreak((prev) => prev + 1);
      setProblemsSolved((prev) => prev + 1);
    }
    
    return success;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      
      <div className="relative container max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        <Header streak={streak} problemsSolved={problemsSolved} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left column - Problem */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <ProblemCard problem={todaysProblem} />
            <CodeEditor value={code} onChange={setCode} />
            <SubmitButton onSubmit={handleSubmit} disabled={code.length < 10} />
          </div>

          {/* Right column - Timer & Stats */}
          <div className="space-y-4 md:space-y-6 order-first lg:order-last">
            <TimerCard />
            
            {/* Quick tips card */}
            <div className="glass-card p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <h3 className="text-sm font-semibold text-foreground mb-3">💡 Quick Tips</h3>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use a hash map for O(n) time complexity
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Consider edge cases with negative numbers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Return indices, not values
                </li>
              </ul>
            </div>

            {/* Progress card */}
            <div className="glass-card p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-sm font-semibold text-foreground mb-3">📊 This Week</h3>
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                        i < 5
                          ? "bg-success/20 text-success"
                          : i === 5
                          ? "bg-primary/20 text-primary ring-2 ring-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i < 5 ? "✓" : i === 5 ? "→" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
