
import { TopicStat, getWeaknessAnalysis } from '@/lib/analytics';
import { TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface WeaknessAnalysisProps {
    data: TopicStat[];
}

const WeaknessAnalysis = ({ data }: WeaknessAnalysisProps) => {
    const { strongest, weakest, recommendation } = getWeaknessAnalysis(data);
    const navigate = useNavigate();

    const handlePractice = (category: string) => {
        navigate("/", { state: { focusCategory: category } });
    };

    return (
        <div className="space-y-6">
            {/* Recommendation Banner */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                    <Lightbulb className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-indigo-200 mb-1">AI Recommendation</h4>
                    <p className="text-sm opacity-90">{recommendation}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-emerald-400">
                        <TrendingUp className="w-4 h-4" /> Strongest Areas
                    </h3>
                    <div className="space-y-3">
                        {strongest.length > 0 ? strongest.map(stat => (
                            <div key={stat.category} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white">{stat.category}</span>
                                    <span className="text-emerald-400">{stat.winRate}% SR</span>
                                </div>
                                <Progress value={stat.winRate} className="h-1.5 bg-white/10" indicatorClassName="bg-emerald-500" />
                                <p className="text-xs text-muted-foreground mt-2">{stat.passed} passed / {stat.total} total</p>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">Solve more problems to see strengths.</p>
                        )}
                    </div>
                </div>

                {/* Weaknesses */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-rose-400">
                        <AlertTriangle className="w-4 h-4" /> Areas to Improve
                    </h3>
                    <div className="space-y-3">
                        {weakest.filter(stat => stat.winRate < 80).length > 0 ? weakest.filter(stat => stat.winRate < 80).map(stat => (
                            <div key={stat.category} className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col gap-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white">{stat.category}</span>
                                        <span className="text-rose-400">{stat.winRate}% SR</span>
                                    </div>
                                    <Progress value={stat.winRate} className="h-1.5 bg-white/10" indicatorClassName="bg-rose-500" />
                                    <p className="text-xs text-muted-foreground mt-2">{stat.failed} failed / {stat.total} total</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs h-8 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                                    onClick={() => handlePractice(stat.category)}
                                >
                                    Practice {stat.category} <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">Great job! You've mastered all topics you've tried (80%+ success rate). 🎉</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeaknessAnalysis;
