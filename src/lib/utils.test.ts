import { deepEqual } from "./utils";
import { describe, it, expect } from "vitest";

describe("deepEqual", () => {
    it("should return true for identical primitives", () => {
        expect(deepEqual(1, 1)).toBe(true);
        expect(deepEqual("string", "string")).toBe(true);
        expect(deepEqual(true, true)).toBe(true);
    });

    it("should return false for different primitives", () => {
        expect(deepEqual(1, 2)).toBe(false);
        expect(deepEqual("a", "b")).toBe(false);
        expect(deepEqual(true, false)).toBe(false);
    });

    it("should compare arrays correctly", () => {
        expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
        expect(deepEqual([], [])).toBe(true);
    });
});
