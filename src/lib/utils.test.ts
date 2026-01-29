import { deepEqual, cn } from "./utils";
import { describe, it, expect } from "vitest";

describe("cn", () => {
    it("should merge classes correctly", () => {
        expect(cn("c1", "c2")).toBe("c1 c2");
        expect(cn("c1", null, false, "c2")).toBe("c1 c2");
    });

    it("should resolve tailwind conflicts", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
    });
});

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

    it("should compare objects correctly", () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 2 } };
        const obj3 = { a: 1, b: { c: 3 } };

        expect(deepEqual(obj1, obj2)).toBe(true);
        expect(deepEqual(obj1, obj3)).toBe(false);
    });
});
