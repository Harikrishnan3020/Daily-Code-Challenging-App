import { getRankFromXP } from "./ranks";
import { describe, it, expect } from "vitest";

describe("getRankFromXP", () => {
    it("should return Novice (Tier 1) for 0 XP", () => {
        const rank = getRankFromXP(0);
        expect(rank.tier).toBe(1);
        expect(rank.name).toBe("Novice");
    });

    it("should return Bronze (Tier 2) for 100 XP", () => {
        const rank = getRankFromXP(100);
        expect(rank.tier).toBe(2);
        expect(rank.name).toBe("Bronze");
    });

    it("should handle high XP correctly (Legend)", () => {
        const rank = getRankFromXP(10000);
        expect(rank.tier).toBe(5);
        expect(rank.name).toBe("Legend");
    });
});
