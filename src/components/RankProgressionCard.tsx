import { getRankFromXP, getNextRank, getRankProgress, RANKS } from "@/lib/ranks";
import { TrendingUp, Award, Star } from "lucide-react";
import RankBadge from "./RankBadge";

interface RankProgressionCardProps {
    problemsSolved: number;
    xp?: number;
}

/**
 * RankProgressionCard Component
 * 
 * Displays the user's current league rank, progress bar towards the next rank, 
 * and an overview of all available leagues.
 * 
 * Visuals:
 * - Dynamic gradient backgrounds based on rank
 * - Shimmer effects on progress bars
 * - "Locked" states for future ranks
 */
const RankProgressionCard = ({ problemsSolved, xp }: RankProgressionCardProps) => {
    // legacy support: estimate XP if not provided
    const currentXP = xp !== undefined ? xp : problemsSolved * 75;

    const currentRank = getRankFromXP(currentXP);
    const nextRank = getNextRank(currentXP);
    const progress = getRankProgress(currentXP);

    return (
        <div className="glass-card p-6 md:p-8 animate-slide-up space-y-6" style={{ animationDelay: "0.35s" }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    League Rank
                </h2>
                <RankBadge xp={currentXP} size="lg" />
            </div>

            {/* Current Rank Description */}
            <div className={`p-4 rounded-xl bg-gradient-to-r ${currentRank.gradient} border border-white/20`}>
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{currentRank.icon}</span>
                    <div>
                        <h3 className="text-xl font-bold text-white">{currentRank.name} League</h3>
                        <p className="text-white/80 text-sm">{currentRank.description}</p>
                    </div>
                </div>
            </div>

            {/* Progress to Next Rank */}
            {nextRank && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress to {nextRank.name}</span>
                        <span className="font-bold text-primary">{progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                        <div
                            className={`h-full bg-gradient-to-r ${nextRank.gradient} transition-all duration-500 ease-out relative overflow-hidden`}
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                    </div>

                    {/* XP Needed */}
                    <p className="text-sm text-muted-foreground text-center">
                        {nextRank.minXP - currentXP} more XP to reach {nextRank.name}!
                    </p>
                </div>
            )}

            {nextRank === null && (
                <div className="text-center py-4 space-y-2">
                    <div className="flex justify-center">
                        <Star className="w-12 h-12 text-yellow-400 animate-bounce" />
                    </div>
                    <p className="text-lg font-bold text-yellow-400">🎉 Maximum Rank Achieved!</p>
                    <p className="text-sm text-muted-foreground">You are a legendary coder!</p>
                </div>
            )}

            {/* All Ranks Overview */}
            <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    All Leagues
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                    {RANKS.map((rank) => {
                        const isUnlocked = currentXP >= rank.minXP;
                        const isCurrent = currentRank.tier === rank.tier;

                        return (
                            <div
                                key={rank.tier}
                                className={`
                  p-3 rounded-lg border transition-all
                  ${isCurrent
                                        ? `bg-gradient-to-r ${rank.gradient} border-white/30 scale-105 shadow-lg`
                                        : isUnlocked
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                            : 'bg-white/[0.02] border-white/5 opacity-50'
                                    }
                `}
                            >
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <span className={`text-2xl ${!isUnlocked && 'grayscale opacity-40'}`}>
                                        {rank.icon}
                                    </span>
                                    <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-muted-foreground'}`}>
                                        {rank.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {rank.minXP} XP
                                    </span>
                                    {isCurrent && (
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RankProgressionCard;
