/**
 * Utility Functions
 * Common helpers for class merging and object comparison.
 * Author: Antigravity Agent
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge.
 * This is a standard utility for Shadcn UI components to allow
 * class overrides while resolving conflicts (e.g., px-2 vs px-4).
 * 
 * @param inputs - List of class names or conditional class objects
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Performs a deep comparison between two values to check for equality.
 * Handles primitives, objects, and arrays recursively.
 * 
 * @param a - First value
 * @param b - Second value
 * @returns true if values are deeply equal, false otherwise
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}
