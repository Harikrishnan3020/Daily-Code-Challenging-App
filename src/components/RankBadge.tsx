import { getRankFromProblems, getRankFromXP } from "@/lib/ranks";
import { Crown } from "lucide-react";

interface RankBadgeProps {
    problemsSolved?: number;
    xp?: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}

/**
 * RankBadge Component
 * 
 * Displays a visual badge representing the user's current rank.
 * Supports different sizes (sm, md, lg) and valid rank progression data.
 */
const RankBadge = ({ problemsSolved = 0, xp, showLabel = true, size = "md" }: RankBadgeProps) => {
    const rank = xp !== undefined ? getRankFromXP(xp) : getRankFromProblems(problemsSolved);

    const sizeClasses = {
        sm: "px-2 py-1 text-xs gap-1",
        md: "px-3 py-1.5 text-sm gap-2",
        lg: "px-4 py-2 text-base gap-2"
    };

    const iconSize = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-xl"
    };

    return (
        <div
            className={`
        inline-flex items-center ${sizeClasses[size]} rounded-lg 
        bg-gradient-to-r ${rank.gradient} 
        border border-white/20 shadow-lg
        animate-scale-in
      `}
            title={`${rank.name} Rank - ${rank.description}`}
        >
            <span className={iconSize[size]}>{rank.icon}</span>
            {showLabel && (
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{rank.name}</span>
                    {rank.tier === 5 && <Crown className="w-3 h-3 text-yellow-300" />}
                </div>
            )}
        </div>
    );
};

export default RankBadge;
