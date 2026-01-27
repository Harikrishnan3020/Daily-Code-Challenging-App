export interface Problem {
    id: number;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    description: string;
    examples: { input: string; output: string }[];
    starterCode: string;
    testCases: { input: any[]; expected: any }[];
    functionName: string;
    hints: string[];
}


import generatedProblems from './generated_problems.json';

export const problems: Problem[] = [
    ...generatedProblems as Problem[],
    {
        id: 1,
        title: "Two Sum",
        difficulty: "beginner",
        category: "Arrays",
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
        ],
        starterCode: `function twoSum(nums, target) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] },
        ],
        functionName: "twoSum",
        hints: [
            "Start by thinking about what you need to find: two numbers that add up to the target. A brute force approach would check every possible pair, but that's O(n²). Can you do better?",
            "Consider using a hash map (JavaScript object) to store numbers you've already seen along with their indices. As you iterate through the array, for each number, check if (target - current number) already exists in your map.",
            "The key insight: if you're at index i looking at number nums[i], you need to find if (target - nums[i]) exists in your hash map. If it does, you've found your pair! Don't forget to add the current number to the map before moving to the next iteration."
        ]
    },
    {
        id: 2,
        title: "Palindrome Number",
        difficulty: "beginner",
        category: "Math",
        description:
            "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.",
        examples: [
            { input: "x = 121", output: "true" },
            { input: "x = -121", output: "false" },
        ],
        starterCode: `function isPalindrome(x) {
  // Your solution here
  
}`,
        testCases: [
            { input: [121], expected: true },
            { input: [-121], expected: false },
            { input: [10], expected: false },
        ],
        functionName: "isPalindrome",
        hints: [
            "Negative numbers are never palindromes.",
            "You can convert the number to a string and reverse it.",
            "For a challenge, try solving it without converting to a string!"
        ]
    },
    {
        id: 3,
        title: "Reverse String",
        difficulty: "beginner",
        category: "Strings",
        description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
        examples: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        starterCode: `function reverseString(s) {
  // Your solution here
  
}`,
        testCases: [
            { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] },
            { input: [['H', 'a', 'n', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'n', 'a', 'H'] }
        ],
        functionName: "reverseString",
        hints: [
            "Use two pointers: one at the start of the array, one at the end.",
            "Swap the characters at the two pointers.",
            "Move the start pointer forward and the end pointer backward until they meet."
        ]
    },
    {
        id: 4,
        title: "Valid Parentheses",
        difficulty: "intermediate",
        category: "Stack",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
        examples: [
            { input: 's = "()"', output: "true" },
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "(]"', output: "false" }
        ],
        starterCode: `function isValid(s) {
  // Your solution here
  
}`,
        testCases: [
            { input: ["()"], expected: true },
            { input: ["()[]{}"], expected: true },
            { input: ["(]"], expected: false },
            { input: ["([)]"], expected: false },
            { input: ["{[]}"], expected: true }
        ],
        functionName: "isValid",
        hints: [
            "This problem is perfect for a Stack data structure.",
            "When you encounter an opening bracket, push it onto the stack.",
            "When you encounter a closing bracket, check if it matches the top of the stack.",
            "If the stack is empty at the end, the string is valid."
        ]
    },
    {
        id: 5,
        title: "Fibonacci Number",
        difficulty: "beginner",
        category: "Dynamic Programming",
        description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
        examples: [
            { input: "n = 2", output: "1" },
            { input: "n = 3", output: "2" },
            { input: "n = 4", output: "3" }
        ],
        starterCode: `function fib(n) {
  // Your solution here
  
}`,
        testCases: [
            { input: [2], expected: 1 },
            { input: [3], expected: 2 },
            { input: [4], expected: 3 },
            { input: [10], expected: 55 }
        ],
        functionName: "fib",
        hints: [
            "Base cases: F(0) = 0, F(1) = 1.",
            "Recursive solution: F(n) = F(n-1) + F(n-2).",
            "Dynamic programming (iterative) is more efficient (O(n))."
        ]
    }
];
