import { Calendar, Tag, Zap } from "lucide-react";
import { Problem } from "@/data/problems";

interface ProblemCardProps {
  /** The problem object containing title, description, and examples */
  problem: Problem;
}

/** Configuration for difficulty badge styling */
const difficultyConfig = {
  beginner: { label: "Beginner", class: "difficulty-easy" },
  intermediate: { label: "Intermediate", class: "difficulty-medium" },
  advanced: { label: "Advanced", class: "difficulty-hard" },
};

/**
 * ProblemCard Component
 * Displays the daily challenge description, logic examples, and difficulty tags.
 * Adapts styling based on problem difficulty level.
 */
const ProblemCard = ({ problem }: ProblemCardProps) => {
  // Fallback for safety if data doesn't match type
  const difficulty = difficultyConfig[problem.difficulty] || difficultyConfig.beginner;

  return (
    <div className="glass-card p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs md:text-sm text-muted-foreground font-medium">Daily Challenge</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${difficulty.class}`}>
            {difficulty.label}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {problem.category}
          </span>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        {problem.title}
      </h2>

      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
        {problem.description}
      </p>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Examples:</h3>
        {problem.examples.map((example, index) => (
          <div key={index} className="bg-secondary/50 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm">
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-muted-foreground">Input: </span>
                <span className="text-primary">{example.input}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Output: </span>
                <span className="text-success">{example.output}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemCard;
