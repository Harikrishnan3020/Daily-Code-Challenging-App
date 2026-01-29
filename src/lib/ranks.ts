/**
 * Ranking System Constants and Logic
 * Defines rank tiers, XP thresholds, and helper functions to calculate user progress.
 * Author: Antigravity Agent
 */
export interface Rank {
    name: string;      // Display name of the rank (e.g., Bronze, Gold)
    tier: number;      // Numeric tier level (1-indexed)
    minXP: number;     // Minimum XP required to achieve this rank
    maxXP: number;     // Maximum XP for this rank (before upgrading)
    color: string;     // Hex color code representing the rank
    gradient: string;  // Tailwind gradient class string
    icon: string;      // Emoji or icon string
    description: string; // User-facing description of the rank status
}

export const RANKS: Rank[] = [
    {
        name: "Bronze",
        tier: 1,
        minXP: 0,
        maxXP: 499,
        color: "#CD7F32",
        gradient: "from-orange-700 to-orange-900",
        icon: "🥉",
        description: "Just getting started"
    },
    {
        name: "Silver",
        tier: 2,
        minXP: 500,
        maxXP: 1499,
        color: "#C0C0C0",
        gradient: "from-gray-400 to-gray-600",
        icon: "🥈",
        description: "Building momentum"
    },
    {
        name: "Gold",
        tier: 3,
        minXP: 1500,
        maxXP: 3499,
        color: "#FFD700",
        gradient: "from-yellow-400 to-yellow-600",
        icon: "🥇",
        description: "Consistent coder"
    },
    {
        name: "Platinum",
        tier: 4,
        minXP: 3500,
        maxXP: 6999,
        color: "#E5E4E2",
        gradient: "from-cyan-300 to-cyan-500",
        icon: "💎",
        description: "Elite solver"
    },
    {
        name: "Diamond",
        tier: 5,
        minXP: 7000,
        maxXP: Infinity,
        color: "#B9F2FF",
        gradient: "from-blue-300 to-purple-400",
        icon: "💠",
        description: "Legendary master"
    }
];

// XP rewards based on difficulty
export const XP_REWARDS = {
    beginner: 50,
    intermediate: 100,
    advanced: 200
};

/**
 * Calculate user's current rank based on XP
 */
export const getRankFromXP = (xp: number): Rank => {
    return RANKS.find(
        rank => xp >= rank.minXP && xp <= rank.maxXP
    ) || RANKS[0];
};

/**
 * Get progress percentage to next rank
 */
export const getRankProgress = (xp: number): number => {
    const currentRank = getRankFromXP(xp);

    if (currentRank.tier === RANKS.length) {
        return 100; // Max rank
    }

    const nextRank = RANKS[currentRank.tier]; // Next tier (0-indexed)
    const rangeSize = nextRank.minXP - currentRank.minXP;
    const currentProgress = xp - currentRank.minXP;

    return Math.min(Math.floor((currentProgress / rangeSize) * 100), 100);
};

/**
 * Get the next rank the user is working towards
 */
export const getNextRank = (xp: number): Rank | null => {
    const currentRank = getRankFromXP(xp);

    if (currentRank.tier === RANKS.length) {
        return null; // Already at max rank
    }

    return RANKS[currentRank.tier]; // Next tier
};

// Legacy compatibility - map problems to XP
export const getRankFromProblems = (problemsSolved: number): Rank => {
    const estimatedXP = problemsSolved * 75; // Average XP per problem
    return getRankFromXP(estimatedXP);
};
