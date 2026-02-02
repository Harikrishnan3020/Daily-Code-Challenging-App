/**
 * Utility to clear fake/mock data from localStorage
 * Run this once to remove any pre-seeded fake users from the leaderboard
  * Last Audit: 2026-02-02
 */

export const clearFakeUsers = () => {
    // Clear the all-users list (this removes fake data)
    localStorage.removeItem("hackathon-habit-all-users");

    console.log("✅ Fake users cleared! Leaderboard will now show only real logged-in users.");
};

/**
 * Initialize leaderboard with only the current logged-in user
 */
export const initializeLeaderboardWithCurrentUser = () => {
    const currentUserStr = localStorage.getItem("hackathon-habit-user");

    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);

        // Set the all-users list to contain only the current user
        localStorage.setItem("hackathon-habit-all-users", JSON.stringify([currentUser]));

        console.log("✅ Leaderboard initialized with current user:", currentUser.name);
    } else {
        // No logged-in user, start with empty leaderboard
        localStorage.setItem("hackathon-habit-all-users", JSON.stringify([]));
        console.log("✅ Leaderboard initialized empty (no logged-in user)");
    }
};
