import fs from 'fs';

const problemTemplates = {
    Arrays: [
        {
            title: 'Contains Duplicate',
            description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
            examples: [
                { input: 'nums = [1,2,3,1]', output: 'true' },
                { input: 'nums = [1,2,3,4]', output: 'false' }
            ],
            testCases: [
                { input: [[1, 2, 3, 1]], expected: true },
                { input: [[1, 2, 3, 4]], expected: false }
            ],
            functionName: 'containsDuplicate'
        },
        {
            title: 'Product of Array Except Self',
            description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product is guaranteed to fit in a 32-bit integer.',
            examples: [
                { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }
            ],
            testCases: [
                { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] }
            ],
            functionName: 'productExceptSelf'
        },
        {
            title: 'Maximum Product Subarray',
            description: 'Given an integer array nums, find a subarray that has the largest product, and return the product.',
            examples: [
                { input: 'nums = [2,3,-2,4]', output: '6' }
            ],
            testCases: [
                { input: [[2, 3, -2, 4]], expected: 6 }
            ],
            functionName: 'maxProduct'
        },
        {
            title: 'Search in Rotated Sorted Array',
            description: 'There is an integer array nums sorted in ascending order (with distinct values). nums is rotated at an unknown pivot. Given the array after rotation and a target value, return the index of target, or -1 if it is not in nums.',
            examples: [
                { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }
            ],
            testCases: [
                { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 }
            ],
            functionName: 'search'
        }
    ],
    Strings: [
        {
            title: 'Longest Substring Without Repeating Characters',
            description: 'Given a string s, find the length of the longest substring without repeating characters.',
            examples: [
                { input: 's = "abcabcbb"', output: '3 (abc)' },
                { input: 's = "bbbbb"', output: '1 (b)' }
            ],
            testCases: [
                { input: ['abcabcbb'], expected: 3 },
                { input: ['bbbbb'], expected: 1 }
            ],
            functionName: 'lengthOfLongestSubstring'
        },
        {
            title: 'Group Anagrams',
            description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
            examples: [
                { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
            ],
            testCases: [],
            functionName: 'groupAnagrams'
        },
        {
            title: 'Longest Palindromic Substring',
            description: 'Given a string s, return the longest palindromic substring in s.',
            examples: [
                { input: 's = "babad"', output: '"bab" or "aba"' }
            ],
            testCases: [
                { input: ['babad'], expected: 'bab' }
            ],
            functionName: 'longestPalindrome'
        },
        {
            title: 'Valid Palindrome',
            description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
            examples: [
                { input: 's = "A man, a plan, a canal: Panama"', output: 'true' }
            ],
            testCases: [
                { input: ['A man, a plan, a canal: Panama'], expected: true }
            ],
            functionName: 'isPalindrome'
        }
    ],
    DP: [
        {
            title: 'House Robber',
            description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses are arranged in a line, and adjacent houses have security systems connected that will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
            examples: [
                { input: 'nums = [1,2,3,1]', output: '4 (Rob house 1 and house 3)' },
                { input: 'nums = [2,7,9,3,1]', output: '12 (Rob house 1, 3, and 5)' }
            ],
            testCases: [
                { input: [[1, 2, 3, 1]], expected: 4 },
                { input: [[2, 7, 9, 3, 1]], expected: 12 }
            ],
            functionName: 'rob'
        },
        {
            title: 'Coin Change',
            description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
            examples: [
                { input: 'coins = [1,2,5], amount = 11', output: '3 (11 = 5 + 5 + 1)' }
            ],
            testCases: [
                { input: [[1, 2, 5], 11], expected: 3 }
            ],
            functionName: 'coinChange'
        },
        {
            title: 'Longest Increasing Subsequence',
            description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
            examples: [
                { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4 ([2,3,7,101])' }
            ],
            testCases: [
                { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 }
            ],
            functionName: 'lengthOfLIS'
        },
        {
            title: 'Word Break',
            description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
            examples: [
                { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' }
            ],
            testCases: [
                { input: ['leetcode', ['leet', 'code']], expected: true }
            ],
            functionName: 'wordBreak'
        }
    ],
    Trees: [
        {
            title: 'Maximum Depth of Binary Tree',
            description: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
            examples: [
                { input: 'root = [3,9,20,null,null,15,7]', output: '3' }
            ],
            testCases: [],
            functionName: 'maxDepth'
        },
        {
            title: 'Invert Binary Tree',
            description: 'Given the root of a binary tree, invert the tree, and return its root.',
            examples: [
                { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }
            ],
            testCases: [],
            functionName: 'invertTree'
        },
        {
            title: 'Validate Binary Search Tree',
            description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
            examples: [
                { input: 'root = [2,1,3]', output: 'true' }
            ],
            testCases: [],
            functionName: 'isValidBST'
        }
    ],
    Graphs: [
        {
            title: 'Number of Islands',
            description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
            examples: [
                { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' }
            ],
            testCases: [],
            functionName: 'numIslands'
        },
        {
            title: 'Clone Graph',
            description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
            examples: [],
            testCases: [],
            functionName: 'cloneGraph'
        },
        {
            title: 'Course Schedule',
            description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.',
            examples: [
                { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }
            ],
            testCases: [
                { input: [2, [[1, 0]]], expected: true }
            ],
            functionName: 'canFinish'
        }
    ],
    'Hash Maps': [
        {
            title: 'Longest Consecutive Sequence',
            description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
            examples: [
                { input: 'nums = [100,4,200,1,3,2]', output: '4 ([1,2,3,4])' }
            ],
            testCases: [
                { input: [[100, 4, 200, 1, 3, 2]], expected: 4 }
            ],
            functionName: 'longestConsecutive'
        },
        {
            title: 'Top K Frequent Elements',
            description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
            examples: [
                { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' }
            ],
            testCases: [
                { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] }
            ],
            functionName: 'topKFrequent'
        }
    ],
    Math: [
        {
            title: 'Pow(x, n)',
            description: 'Implement pow(x, n), which calculates x raised to the power n.',
            examples: [
                { input: 'x = 2.0, n = 10', output: '1024.0' }
            ],
            testCases: [
                { input: [2.0, 10], expected: 1024.0 }
            ],
            functionName: 'myPow'
        },
        {
            title: 'Happy Number',
            description: 'Write an algorithm to determine if a number n is happy. A happy number is a number where repeatedly replacing the number by the sum of the squares of its digits eventually leads to 1.',
            examples: [
                { input: 'n = 19', output: 'true' }
            ],
            testCases: [
                { input: [19], expected: true }
            ],
            functionName: 'isHappy'
        }
    ],
    Stack: [
        {
            title: 'Min Stack',
            description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
            examples: [],
            testCases: [],
            functionName: 'MinStack'
        },
        {
            title: 'Evaluate Reverse Polish Notation',
            description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.',
            examples: [
                { input: 'tokens = ["2","1","+","3","*"]', output: '9 ((2 + 1) * 3)' }
            ],
            testCases: [
                { input: [['2', '1', '+', '3', '*']], expected: 9 }
            ],
            functionName: 'evalRPN'
        }
    ]
};

const categories = Object.keys(problemTemplates);
const problems = [];
let id = 1001;

// Generate 150 problems
for (let i = 0; i < 150; i++) {
    const category = categories[i % categories.length];
    const templates = problemTemplates[category];
    const template = templates[i % templates.length];
    const difficulty = i % 3 === 0 ? 'advanced' : i % 2 === 0 ? 'intermediate' : 'beginner';

    const problemNumber = Math.floor(i / templates.length) + 1;
    const title = problemNumber > 1 ? `${template.title} ${problemNumber}` : template.title;

    problems.push({
        id: id++,
        title: title,
        difficulty: difficulty,
        category: category,
        description: template.description,
        examples: template.examples,
        starterCode: `function ${template.functionName}(...args) {\n  // Your solution here\n  \n}`,
        testCases: template.testCases,
        functionName: template.functionName,
        hints: [
            'Think about the time and space complexity of your solution',
            'Consider edge cases like empty inputs or extreme values',
            'Can you optimize your approach using a different data structure?'
        ]
    });
}

fs.writeFileSync('src/data/generated_problems.json', JSON.stringify(problems, null, 2));
console.log(`✓ Successfully created ${problems.length} problems with detailed descriptions`);
console.log(`  - Categories: ${categories.join(', ')}`);
console.log(`  - Difficulty distribution: ${problems.filter(p => p.difficulty === 'beginner').length} beginner, ${problems.filter(p => p.difficulty === 'intermediate').length} intermediate, ${problems.filter(p => p.difficulty === 'advanced').length} advanced`);
