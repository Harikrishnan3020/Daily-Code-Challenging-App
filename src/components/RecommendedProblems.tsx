import { RecommendedProblem } from '@/lib/analytics';
import { Button } from './ui/button';
import { ArrowRight, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendedProblemsProps {
    problems: RecommendedProblem[];
}

const RecommendedProblems = ({ problems }: RecommendedProblemsProps) => {
    const navigate = useNavigate();

    const handleSolveProblem = (problemId: number) => {
        // Navigate to dashboard and load this specific problem
        navigate("/", { state: { loadProblemId: problemId } });
    };

    if (problems.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>Great job! You've solved all recommended problems.</p>
                <p className="text-sm mt-2">Keep practicing to maintain your skills!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {problems.map((problem, index) => (
                <div
                    key={problem.id}
                    className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-all group animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold text-white">{problem.title}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{problem.reason}</p>
                            <div className="flex gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${problem.difficulty === 'beginner'
                                    ? 'bg-green-500/20 text-green-400'
                                    : problem.difficulty === 'intermediate'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {problem.difficulty}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                    {problem.category}
                                </span>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => handleSolveProblem(problem.id)}
                            className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                            Solve <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendedProblems;
