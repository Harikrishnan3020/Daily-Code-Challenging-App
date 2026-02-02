export interface Problem {
    id: number;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    description: string;
    examples: { input: string; output: string }[];
    starterCode: string;
    testCases: { input: unknown[]; expected: unknown }[];
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
            "Test Case 1 (Basic): For input `[2,7,11,15]` and target `9`, you just need to find two numbers that sum to 9. Since 2+7=9, return their indices `[0, 1]`.",
            "Test Case 2 (Logic): Elements don't need to be adjacent. For `[3,2,4]` and target `6`, we skip 3 and pick 2 and 4 (indices 1 and 2).",
            "Test Case 3 (Edge Case): For `[3,3]`, you need to pick different indices. Ensure your logic doesn't use the same element twice (e.g. 3 at index 0 used twice)."
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
    },
    {
        id: 6,
        title: "Maximum Subarray",
        difficulty: "intermediate",
        category: "Arrays",
        description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
            { input: "nums = [1]", output: "1" },
            { input: "nums = [5,4,-1,7,8]", output: "23" }
        ],
        starterCode: `function maxSubArray(nums) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
            { input: [[1]], expected: 1 },
            { input: [[5, 4, -1, 7, 8]], expected: 23 }
        ],
        functionName: "maxSubArray",
        hints: [
            "Use Kadane's algorithm for optimal O(n) solution.",
            "Keep track of the current sum and maximum sum seen so far.",
            "If current sum becomes negative, reset it to 0."
        ]
    },
    {
        id: 7,
        title: "Merge Two Sorted Lists",
        difficulty: "beginner",
        category: "Linked Lists",
        description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list. For this problem, use arrays to represent linked lists.",
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
            { input: "list1 = [], list2 = []", output: "[]" }
        ],
        starterCode: `function mergeTwoLists(list1, list2) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
            { input: [[], []], expected: [] },
            { input: [[], [0]], expected: [0] }
        ],
        functionName: "mergeTwoLists",
        hints: [
            "Use two pointers to traverse both arrays.",
            "Compare elements and add the smaller one to result.",
            "Don't forget to handle remaining elements."
        ]
    },
    {
        id: 8,
        title: "Binary Tree Maximum Depth",
        difficulty: "beginner",
        category: "Trees",
        description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node. The tree is represented as an array in level-order.",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3" },
            { input: "root = [1,null,2]", output: "2" }
        ],
        starterCode: `function maxDepth(root) {
  // Your solution here
  // root is an array representing level-order traversal
  
}`,
        testCases: [
            { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
            { input: [[1, null, 2]], expected: 2 },
            { input: [[]], expected: 0 }
        ],
        functionName: "maxDepth",
        hints: [
            "For array representation, depth relates to array length.",
            "Use Math.floor(Math.log2(n)) + 1 for complete binary tree.",
            "Handle null values in the array carefully."
        ]
    },
    {
        id: 9,
        title: "First Unique Character",
        difficulty: "beginner",
        category: "Strings",
        description: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
        examples: [
            { input: "s = 'leetcode'", output: "0" },
            { input: "s = 'loveleetcode'", output: "2" },
            { input: "s = 'aabb'", output: "-1" }
        ],
        starterCode: `function firstUniqChar(s) {
  // Your solution here
  
}`,
        testCases: [
            { input: ["leetcode"], expected: 0 },
            { input: ["loveleetcode"], expected: 2 },
            { input: ["aabb"], expected: -1 }
        ],
        functionName: "firstUniqChar",
        hints: [
            "Use a hash map to count character frequencies.",
            "Make a second pass to find first character with count 1.",
            "Time complexity should be O(n)."
        ]
    },
    {
        id: 10,
        title: "Contains Duplicate",
        difficulty: "beginner",
        category: "Hash Maps",
        description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        examples: [
            { input: "nums = [1,2,3,1]", output: "true" },
            { input: "nums = [1,2,3,4]", output: "false" },
            { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" }
        ],
        starterCode: `function containsDuplicate(nums) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[1, 2, 3, 1]], expected: true },
            { input: [[1, 2, 3, 4]], expected: false },
            { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
        ],
        functionName: "containsDuplicate",
        hints: [
            "Use a Set to track seen numbers.",
            "If you encounter a number already in the set, return true.",
            "If you finish the loop without duplicates, return false."
        ]
    },
    {
        id: 11,
        title: "Climbing Stairs",
        difficulty: "beginner",
        category: "Dynamic Programming",
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples: [
            { input: "n = 2", output: "2" },
            { input: "n = 3", output: "3" }
        ],
        starterCode: `function climbStairs(n) {
  // Your solution here
  
}`,
        testCases: [
            { input: [2], expected: 2 },
            { input: [3], expected: 3 },
            { input: [5], expected: 8 }
        ],
        functionName: "climbStairs",
        hints: [
            "This is similar to Fibonacci sequence.",
            "ways(n) = ways(n-1) + ways(n-2)",
            "Base cases: ways(1) = 1, ways(2) = 2"
        ]
    },
    {
        id: 12,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "beginner",
        category: "Arrays",
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5" },
            { input: "prices = [7,6,4,3,1]", output: "0" }
        ],
        starterCode: `function maxProfit(prices) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
            { input: [[7, 6, 4, 3, 1]], expected: 0 },
            { input: [[2, 4, 1]], expected: 2 }
        ],
        functionName: "maxProfit",
        hints: [
            "Track the minimum price seen so far.",
            "Calculate profit at each step: current price - min price.",
            "Keep track of maximum profit."
        ]
    },
    {
        id: 13,
        title: "Single Number",
        difficulty: "beginner",
        category: "Math",
        description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
        examples: [
            { input: "nums = [2,2,1]", output: "1" },
            { input: "nums = [4,1,2,1,2]", output: "4" },
            { input: "nums = [1]", output: "1" }
        ],
        starterCode: `function singleNumber(nums) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[2, 2, 1]], expected: 1 },
            { input: [[4, 1, 2, 1, 2]], expected: 4 },
            { input: [[1]], expected: 1 }
        ],
        functionName: "singleNumber",
        hints: [
            "Use XOR operation: a ^ a = 0 and a ^ 0 = a",
            "XOR all numbers together.",
            "Pairs will cancel out, leaving only the single number."
        ]
    },
    {
        id: 14,
        title: "Move Zeroes",
        difficulty: "beginner",
        category: "Arrays",
        description: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
        examples: [
            { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
            { input: "nums = [0]", output: "[0]" }
        ],
        starterCode: `function moveZeroes(nums) {
  // Your solution here
  // Modify nums in-place and return it
  
}`,
        testCases: [
            { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
            { input: [[0]], expected: [0] },
            { input: [[1, 2, 3]], expected: [1, 2, 3] }
        ],
        functionName: "moveZeroes",
        hints: [
            "Use two pointers approach.",
            "One pointer tracks position for next non-zero element.",
            "Swap non-zero elements to the front."
        ]
    },
    {
        id: 15,
        title: "Intersection of Two Arrays",
        difficulty: "beginner",
        category: "Hash Maps",
        description: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
        examples: [
            { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" },
            { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[9,4]" }
        ],
        starterCode: `function intersection(nums1, nums2) {
  // Your solution here
  
}`,
        testCases: [
            { input: [[1, 2, 2, 1], [2, 2]], expected: [2] },
            { input: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [4, 9] },
            { input: [[1, 2, 3], [4, 5, 6]], expected: [] }
        ],
        functionName: "intersection",
        hints: [
            "Convert first array to a Set.",
            "Filter second array for elements in the Set.",
            "Return unique values using Set."
        ]
    }
];
