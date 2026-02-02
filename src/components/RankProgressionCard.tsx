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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {RANKS.map((rank, index) => {
                        const isUnlocked = currentXP >= rank.minXP;
                        const isCurrent = currentRank.tier === rank.tier;

                        return (
                            <div
                                key={rank.tier}
                                className={`
                  relative p-5 rounded-2xl border-2 transition-all duration-700 cursor-pointer
                  animate-slide-up overflow-hidden group
                  transform-gpu perspective-1000
                  ${isCurrent
                                        ? `bg-gradient-to-br ${rank.gradient} border-white/60 scale-[1.15] shadow-[0_0_60px_rgba(34,211,238,0.6)] animate-luxury-pulse z-20`
                                        : isUnlocked
                                            ? `bg-gradient-to-br ${rank.gradient} border-white/40 hover:scale-[1.15] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] shadow-xl hover:border-white/60`
                                            : 'bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-white/20 opacity-75 hover:opacity-95 hover:scale-110 hover:shadow-xl'
                                    }
                `}
                                style={{
                                    animationDelay: `${0.6 + index * 0.1}s`,
                                    transformStyle: 'preserve-3d',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                {/* Aurora Background Effect - ALL CARDS */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 via-purple-500/20 to-primary/20 animate-aurora ${isCurrent ? 'opacity-70' : 'opacity-0 group-hover:opacity-50'} transition-opacity duration-700`} />

                                {/* Holographic Shimmer - ALL CARDS */}
                                <div className={`absolute inset-0 ${isCurrent ? 'animate-holographic-shimmer' : 'opacity-0 group-hover:opacity-100 group-hover:animate-holographic-shimmer'} transition-opacity duration-500`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer-luxury" />
                                </div>

                                {/* Radial Pulse Rings - ALL UNLOCKED */}
                                {isUnlocked && (
                                    <>
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-white/20 ${isCurrent ? 'animate-pulse-ring-1' : 'opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring-1'}`} />
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-white/10 ${isCurrent ? 'animate-pulse-ring-2' : 'opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring-2'}`} />
                                    </>
                                )}

                                {/* Cinematic Particle System - Enhanced */}
                                {isCurrent && (
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-particle-luxury-1 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                        <div className="absolute top-0 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-particle-luxury-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                        <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-particle-luxury-3 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-particle-luxury-4 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                                        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-cyan-200 rounded-full animate-particle-luxury-5 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                    </div>
                                )}

                                {isUnlocked && !isCurrent && (
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-particle-luxury-1 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                                        <div className="absolute top-0 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-particle-luxury-2 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                                        <div className="absolute bottom-0 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-particle-luxury-3 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                                    </div>
                                )}

                                {/* Snow Effect - Luxury Feature */}
                                {(isCurrent || (isUnlocked && !isCurrent)) && (
                                    <div className={`snow-container absolute inset-0 overflow-hidden pointer-events-none z-10 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-700`}>
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`snowflake absolute text-white/80 ${i % 2 === 0 ? 'sway' : ''}`}
                                                style={{
                                                    fontSize: `${10 + (i % 4) * 2}px`,
                                                    left: `${(i * 13) % 95}%`,
                                                    animationDuration: `${8 + (i % 5)}s`,
                                                    animationDelay: `${(i * 0.7) % 5}s`,
                                                    opacity: 0
                                                }}
                                            >❄</div>
                                        ))}
                                    </div>
                                )}

                                {/* Cherry Blossom Effect - Luxury Feature */}
                                {(isCurrent || (isUnlocked && !isCurrent)) && (
                                    <div className={`petal-container absolute inset-0 overflow-hidden pointer-events-none z-10 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-700`}>
                                        {[...Array(15)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="petal absolute petal-flow"
                                                style={{
                                                    left: `${(i * 17) % 95}%`,
                                                    width: `${8 + (i % 5)}px`,
                                                    height: `${8 + (i % 5)}px`,
                                                    backgroundColor: i % 2 === 0 ? '#ffb7b2' : '#ff9cee',
                                                    animationDuration: `${7 + (i % 6)}s`,
                                                    animationDelay: `${(i * 1.1) % 5}s`,
                                                    opacity: 0
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                {/* 3D Depth Layers */}
                                {isUnlocked && (
                                    <>
                                        <div className={`absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent ${isCurrent ? 'opacity-40 animate-breathe' : 'opacity-0 group-hover:opacity-30 group-hover:animate-breathe'} transition-opacity duration-500`} />
                                        <div className={`absolute inset-0 bg-gradient-conic from-primary/10 via-accent/10 to-primary/10 ${isCurrent ? 'opacity-30 animate-rotate-slow' : 'opacity-0 group-hover:opacity-20 group-hover:animate-rotate-slow'} transition-opacity duration-500`} />
                                    </>
                                )}

                                <div className="relative flex flex-col items-center gap-2.5 text-center z-10">
                                    {/* Icon with Luxury 3D Effects */}
                                    <div className={`relative ${isCurrent ? 'animate-float-luxury' : 'group-hover:animate-float-luxury'}`}>
                                        <span className={`
                                            text-4xl transition-all duration-700 block
                                            ${!isUnlocked && 'grayscale opacity-50 group-hover:opacity-75'} 
                                            ${isCurrent && 'filter drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-icon-glow'}
                                            ${isUnlocked && !isCurrent && 'group-hover:scale-[1.4] group-hover:rotate-[15deg] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,1)] filter drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]'}
                                        `}>
                                            {rank.icon}
                                        </span>
                                        {/* Icon Halo */}
                                        {isUnlocked && (
                                            <div className={`absolute inset-0 -z-10 blur-xl bg-gradient-radial from-white/40 to-transparent ${isCurrent ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-80'} transition-opacity duration-500`} />
                                        )}
                                    </div>

                                    {/* Rank Name with Premium Glow */}
                                    <span className={`
                                        text-sm font-bold transition-all duration-500 tracking-wide uppercase
                                        ${isCurrent ? 'text-white text-shadow-luxury animate-text-shimmer' : isUnlocked ? 'text-white/95 group-hover:text-white group-hover:text-shadow-luxury group-hover:animate-text-shimmer' : 'text-muted-foreground group-hover:text-white/80'}
                                    `}>
                                        {rank.name}
                                    </span>

                                    {/* XP Badge */}
                                    <div className={`px-3 py-1 rounded-full transition-all duration-500 ${isCurrent ? 'bg-white/20 backdrop-blur-sm border border-white/40' : isUnlocked ? 'bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 group-hover:border-white/40' : 'bg-white/5 border border-white/10'}`}>
                                        <span className={`text-[11px] font-semibold transition-colors duration-300 ${isCurrent ? 'text-white' : isUnlocked ? 'text-white/80 group-hover:text-white' : 'text-muted-foreground/80 group-hover:text-muted-foreground'}`}>
                                            {rank.minXP} XP
                                        </span>
                                    </div>

                                    {/* Luxury Indicator System */}
                                    {isCurrent && (
                                        <div className="mt-2 flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-[0_0_12px_rgba(34,211,238,1)]" />
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse delay-200 shadow-[0_0_12px_rgba(168,85,247,1)]" />
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse delay-400 shadow-[0_0_12px_rgba(34,211,238,1)]" />
                                        </div>
                                    )}

                                    {isUnlocked && !isCurrent && (
                                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                        </div>
                                    )}
                                </div>

                                {/* Luxury Corner Effects - ALL UNLOCKED */}
                                {isUnlocked && (
                                    <>
                                        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/50 via-cyan-300/30 to-transparent rounded-bl-3xl ${isCurrent ? 'opacity-60 animate-corner-shine' : 'opacity-0 group-hover:opacity-100 group-hover:animate-corner-shine'} transition-opacity duration-500`} />
                                        <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/40 via-purple-300/30 to-transparent rounded-tr-3xl ${isCurrent ? 'opacity-50 animate-corner-shine-reverse' : 'opacity-0 group-hover:opacity-90 group-hover:animate-corner-shine-reverse'} transition-opacity duration-500`} />
                                        <div className={`absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-cyan-300/40 to-transparent rounded-br-3xl ${isCurrent ? 'opacity-40' : 'opacity-0 group-hover:opacity-70'} transition-opacity duration-500`} />
                                        <div className={`absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple-300/40 to-transparent rounded-tl-3xl ${isCurrent ? 'opacity-40' : 'opacity-0 group-hover:opacity-70'} transition-opacity duration-500`} />
                                    </>
                                )}

                                {/* Premium Border Glow - ALL UNLOCKED */}
                                {isUnlocked && (
                                    <div className={`absolute inset-0 rounded-2xl ${isCurrent ? 'animate-luxury-border-glow' : 'opacity-0 group-hover:opacity-100 group-hover:animate-luxury-border-glow'} transition-opacity duration-500`}
                                        style={{
                                            boxShadow: 'inset 0 0 30px rgba(34, 211, 238, 0.4), inset 0 0 60px rgba(168, 85, 247, 0.2)',
                                        }}
                                    />
                                )}

                                {/* Scan Line Effect */}
                                {isUnlocked && (
                                    <div className={`absolute inset-0 ${isCurrent ? 'animate-scan-line' : 'opacity-0 group-hover:opacity-100 group-hover:animate-scan-line'} transition-opacity duration-300`}>
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RankProgressionCard;
