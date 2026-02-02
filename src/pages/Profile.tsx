import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Flame, Zap, Calendar, Medal, Target, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RankProgressionCard from "@/components/RankProgressionCard";
import SkillRadar from "@/components/SkillRadar";
import WeaknessAnalysis from "@/components/WeaknessAnalysis";
import RecommendedProblems from "@/components/RecommendedProblems";
import { getTopicStats, TopicStat, getRecommendedProblems, RecommendedProblem } from "@/lib/analytics";
import { ChartErrorBoundary } from "@/components/ChartErrorBoundary";
import { User } from "@/types";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState({
        streak: 0,
        solved: 0,
        level: "beginner",
        xp: 0
    });
    const [history, setHistory] = useState<any[]>([]); // Supports legacy strings and new detailed objects
    const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
    const [recommendedProblems, setRecommendedProblems] = useState<RecommendedProblem[]>([]);

    useEffect(() => {
        // Load User
        const savedUser = localStorage.getItem("hackathon-habit-user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        } else {
            // Redirect if not logged in
            navigate("/login");
        }

        // Load Stats
        const streak = parseInt(localStorage.getItem("hackathon-habit-streak") || "0");
        const solved = parseInt(localStorage.getItem("hackathon-habit-solved") || "0");
        const level = localStorage.getItem("hackathon-habit-level") || "beginner";
        const xp = parseInt(localStorage.getItem("hackathon-habit-xp") || "0");
        setStats({ streak, solved, level, xp });

        // Load History
        // Load History (Prefer detailed, fallback to legacy)
        try {
            const detailedHistory = JSON.parse(localStorage.getItem("hackathon-habit-detailed-history") || "[]");
            if (detailedHistory.length > 0) {
                setHistory(detailedHistory.reverse());
            } else {
                const historyData = JSON.parse(localStorage.getItem("hackathon-habit-history") || "[]");
                setHistory(historyData.reverse());
            }

            // Load Topic Stats
            const stats = getTopicStats();
            setTopicStats(stats);

            // Load Recommended Problems based on weaknesses
            setRecommendedProblems(getRecommendedProblems(stats));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header / Back Button */}
                <div>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-white" onClick={() => navigate("/")}>
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                </div>

                {/* Profile Header */}
                <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 animate-slide-up">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-primary/10 relative z-10">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl -z-10 animate-pulse" />
                        <div className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-2 border border-white/10">
                            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-2 flex-1">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            {user.name}
                        </h1>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            {user.email}
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                                {user.provider || "Member"}
                            </span>
                        </p>
                        <div className="pt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${stats.level === 'beginner' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                    stats.level === 'intermediate' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                        'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                }`}>
                                {stats.level} Coder
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-6 flex items-center gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <Flame className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{stats.streak}</h3>
                            <p className="text-sm text-muted-foreground">Day Streak</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{stats.solved}</h3>
                            <p className="text-sm text-muted-foreground">Problems Solved</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                            <Medal className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{stats.xp}</h3>
                            <p className="text-sm text-muted-foreground">Total XP</p>
                        </div>
                    </div>
                </div>
                {/* Skill Insights Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Radar Chart */}
                    <div className="lg:col-span-1 glass-card p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Skill Radar
                        </h2>
                        <ChartErrorBoundary>
                            <SkillRadar data={topicStats} />
                        </ChartErrorBoundary>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="lg:col-span-2 glass-card p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            Performance Insights
                        </h2>
                        <ChartErrorBoundary>
                            <WeaknessAnalysis data={topicStats} />
                        </ChartErrorBoundary>
                    </div>
                </div>

                {/* Recommended Problems Section */}
                {recommendedProblems.length > 0 && (
                    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.55s" }}>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Recommended Problems for You
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Based on your performance, here are problems to help you improve:
                        </p>
                        <RecommendedProblems problems={recommendedProblems} />
                    </div>
                )}

                {/* Rank Progression Section */}
                <RankProgressionCard problemsSolved={stats.solved} xp={stats.xp} />

                {/* Activity History */}
                <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Recent Activity
                    </h2>

                    {history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((item, i) => {
                                const isDetailed = typeof item === 'object';
                                const title = isDetailed ? item.title : item;
                                const category = isDetailed ? item.category : 'Code Practice';
                                const date = isDetailed ? new Date(item.date).toLocaleDateString() : '';
                                const mastery = isDetailed ? item.masteryLevel : null;

                                return (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                                ${isDetailed ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-500'}`}>
                                                {isDetailed ? <Target className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium group-hover:text-primary transition-colors">{title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{category}</span>
                                                    {date && <span>• {date}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Solved
                                            </span>
                                            {mastery && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    {mastery}% Mastery
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No problems solved yet.</p>
                            <p className="text-sm mt-2">Start your journey today!</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profile;
