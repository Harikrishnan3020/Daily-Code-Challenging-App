export interface DetailedHistoryItem {
    id: number;
    title: string;
    category: string;
    result: 'passed' | 'failed' | 'solved';
    timestamp: number;
}

export interface TopicStat {
    category: string;
    total: number;
    passed: number;
    failed: number;
    winRate: number;
}

export const getTopicStats = (): TopicStat[] => {
    try {
        const history: DetailedHistoryItem[] = JSON.parse(localStorage.getItem("hackathon-habit-detailed-history") || "[]");

        // Group by category
        const stats: Record<string, TopicStat> = {};

        // Initialize common categories to ensure chart isn't empty
        const defaultCategories = ["Arrays", "Strings", "DP", "Trees", "Graphs", "Math"];
        defaultCategories.forEach(cat => {
            stats[cat] = { category: cat, total: 0, passed: 0, failed: 0, winRate: 0 };
        });

        history.forEach(item => {
            // Normalize category name (sometimes AI gives slight variations)
            let cat = item.category || "Unknown";

            // Map common variations if needed
            if (cat.includes("Dynamic")) cat = "DP";
            if (cat.includes("Hash")) cat = "Hash Maps";

            if (!stats[cat]) {
                stats[cat] = { category: cat, total: 0, passed: 0, failed: 0, winRate: 0 };
            }

            stats[cat].total++;
            if (item.result === "passed" || item.result === "solved") {
                stats[cat].passed++;
            } else {
                stats[cat].failed++;
            }
        });

        // Calculate rates
        return Object.values(stats).map(stat => ({
            ...stat,
            winRate: stat.total === 0 ? 0 : Math.round((stat.passed / stat.total) * 100)
        }));

    } catch (e) {
        console.error("Error analyzing stats", e);
        return [];
    }
};

export const getWeaknessAnalysis = (stats: TopicStat[]) => {
    // Filter out categories with 0 data if you want strictly active ones, 
    // but exposing 0s is good to show what they HAVEN'T done.

    // Sort by winRate (ascending) for weakness
    // But prioritize topics with at least some attempts, otherwise everything 0 is weak.

    const activeTopics = stats.filter(s => s.total > 0);
    const unusedTopics = stats.filter(s => s.total === 0);

    const strongest = [...activeTopics].sort((a, b) => b.winRate - a.winRate).slice(0, 3);

    // Weakest are those with low winrate OR unused
    const weakest = [...activeTopics].sort((a, b) => a.winRate - b.winRate).slice(0, 3);

    // Recommendation logic
    let recommendation = "";
    if (activeTopics.length === 0) {
        recommendation = "Start solving problems to unlock analytics!";
    } else if (weakest.length > 0 && weakest[0].winRate < 50) {
        recommendation = `Focus on ${weakest[0].category}. Your success rate is low (${weakest[0].winRate}%).`;
    } else if (unusedTopics.length > 0) {
        recommendation = `Try exploring ${unusedTopics[0].category}. You haven't solved any problems there yet.`;
    } else {
        recommendation = "You have a balanced skill set! Challenge yourself with higher difficulty problems.";
    }

    return { strongest, weakest, unusedTopics, recommendation };
};

export interface RecommendedProblem {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    reason: string;
}

export const getRecommendedProblems = (stats: TopicStat[]): RecommendedProblem[] => {
    const { weakest, unusedTopics } = getWeaknessAnalysis(stats);
    const solvedProblemIds = JSON.parse(localStorage.getItem("hackathon-habit-solved-ids") || "[]");

    // Import problems dynamically to avoid circular dependency
    const allProblems = require('@/data/problems').problems;

    const recommendations: RecommendedProblem[] = [];

    // Only recommend if user has solved at least 3 problems
    const totalSolved = stats.reduce((sum, s) => sum + s.total, 0);
    if (totalSolved < 3) {
        return []; // Don't show recommendations until user has some history
    }

    // First, recommend problems from weakest areas (success rate < 80%)
    const weakAreas = weakest.filter(w => w.winRate < 80);
    weakAreas.forEach(weak => {
        const categoryProblems = allProblems
            .filter((p: { category: string; id: number }) =>
                p.category === weak.category && !solvedProblemIds.includes(p.id)
            )
            .slice(0, 2);

        categoryProblems.forEach((p: { id: number; title: string; category: string; difficulty: string }) => {
            recommendations.push({
                id: p.id,
                title: p.title,
                category: p.category,
                difficulty: p.difficulty,
                reason: `Improve your ${weak.category} skills (${weak.winRate}% success rate)`
            });
        });
    });

    // Then, recommend problems from unexplored topics (limit to 2 topics)
    const limitedUnused = unusedTopics.slice(0, 2);
    limitedUnused.forEach(unused => {
        const categoryProblems = allProblems
            .filter((p: { category: string; id: number }) =>
                p.category === unused.category && !solvedProblemIds.includes(p.id)
            )
            .slice(0, 2);

        categoryProblems.forEach((p: { id: number; title: string; category: string; difficulty: string }) => {
            recommendations.push({
                id: p.id,
                title: p.title,
                category: p.category,
                difficulty: p.difficulty,
                reason: `Explore ${unused.category} - you haven't tried this yet!`
            });
        });
    });

    // Limit to top 10 recommendations
    return recommendations.slice(0, 10);
};
