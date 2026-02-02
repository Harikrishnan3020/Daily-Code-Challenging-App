/**
 * Solution Feedback Modal
 * Professional post-completion analysis with strengths, weaknesses, and recommendations
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Clock, Zap, Target, ArrowRight } from "lucide-react";
import { CodeAnalysis } from "@/lib/codeAnalyzer";
import { Problem } from "@/data/problems";

interface SolutionFeedbackProps {
    open: boolean;
    onClose: () => void;
    analysis: CodeAnalysis;
    problem: Problem;
    timeTaken: number;
    onContinuePractice: () => void;
    onNextProblem: () => void;
}

const SolutionFeedback = ({
    open,
    onClose,
    analysis,
    problem,
    timeTaken,
    onContinuePractice,
    onNextProblem
}: SolutionFeedbackProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'excellent': return 'text-green-400';
            case 'good': return 'text-blue-400';
            case 'needs-improvement': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getQualityBg = (quality: string) => {
        switch (quality) {
            case 'excellent': return 'bg-green-500/10 border-green-500/30';
            case 'good': return 'bg-blue-500/10 border-blue-500/30';
            case 'needs-improvement': return 'bg-yellow-500/10 border-yellow-500/30';
            default: return 'bg-gray-500/10 border-gray-500/30';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        Solution Analysis
                    </DialogTitle>
                    <DialogDescription>
                        Here's how you did on: <span className="text-primary font-semibold">{problem.title}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Overall Score */}
                    <div className={`p-6 rounded-xl border-2 ${getQualityBg(analysis.codeQuality)} animate-slide-up`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Code Quality</h3>
                                <p className={`text-2xl font-bold ${getQualityColor(analysis.codeQuality)} uppercase`}>
                                    {analysis.codeQuality.replace('-', ' ')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">Mastery Level</p>
                                <p className="text-3xl font-bold text-primary">{analysis.masteryLevel}%</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 relative overflow-hidden"
                                style={{ width: `${analysis.masteryLevel}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-muted-foreground">Time Taken</span>
                            </div>
                            <p className="text-xl font-bold text-white">{formatTime(timeTaken)}</p>
                        </div>

                        <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-muted-foreground">Time Complexity</span>
                            </div>
                            <p className="text-xl font-bold text-white">{analysis.timeComplexity}</p>
                        </div>

                        <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-muted-foreground">Space Complexity</span>
                            </div>
                            <p className="text-xl font-bold text-white">{analysis.spaceComplexity}</p>
                        </div>

                        <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-muted-foreground">Category</span>
                            </div>
                            <p className="text-xl font-bold text-white">{problem.category}</p>
                        </div>
                    </div>

                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-green-400">
                                <CheckCircle2 className="w-5 h-5" />
                                Strengths
                            </h3>
                            <ul className="space-y-2">
                                {analysis.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-400 mt-0.5">✓</span>
                                        <span className="text-foreground/90">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Weaknesses */}
                    {analysis.weaknesses.length > 0 && (
                        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-yellow-400">
                                <AlertCircle className="w-5 h-5" />
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-2">
                                {analysis.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-yellow-400 mt-0.5">⚠</span>
                                        <span className="text-foreground/90">{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-blue-400">
                                <Lightbulb className="w-5 h-5" />
                                Suggestions
                            </h3>
                            <ul className="space-y-2">
                                {analysis.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-blue-400 mt-0.5">💡</span>
                                        <span className="text-foreground/90">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Focus Areas */}
                    {analysis.focusAreas.length > 0 && (
                        <div className="glass-card p-5 border-2 border-primary/30 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-primary">
                                <Target className="w-5 h-5" />
                                Recommended Practice Topics
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {analysis.focusAreas.map((area, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium border border-primary/30"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                We've identified these areas where additional practice could help you master this topic.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        {analysis.focusAreas.length > 0 && (
                            <Button
                                onClick={onContinuePractice}
                                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                            >
                                <Target className="w-4 h-4 mr-2" />
                                Continue Practicing {problem.category}
                            </Button>
                        )}
                        <Button
                            onClick={onNextProblem}
                            variant={analysis.focusAreas.length > 0 ? "outline" : "default"}
                            className={analysis.focusAreas.length === 0 ? "flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90" : "flex-1"}
                        >
                            Next Challenge
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SolutionFeedback;
