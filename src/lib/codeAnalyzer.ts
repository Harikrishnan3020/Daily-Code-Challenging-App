/**
 * Code Analyzer
 * Analyzes user's submitted code to identify strengths, weaknesses, and areas for improvement.
  * Last Audit: 2026-02-02
 */

export interface CodeAnalysis {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    timeComplexity: string;
    spaceComplexity: string;
    codeQuality: 'excellent' | 'good' | 'needs-improvement';
    masteryLevel: number; // 0-100
    focusAreas: string[]; // Topics to practice more
}

/**
 * Analyzes JavaScript code for quality, complexity, and patterns
 */
export const analyzeCode = (code: string, problemCategory: string, timeTaken: number): CodeAnalysis => {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const focusAreas: string[] = [];

    // Code quality checks
    const hasComments = /\/\/|\/\*/.test(code);
    const hasDescriptiveNames = /\b[a-z][a-zA-Z]{3,}\b/.test(code);
    const codeLength = code.length;
    const lineCount = code.split('\n').length;

    // Pattern detection
    const usesRecursion = code.includes('function') && code.split('return').length > 2;
    const usesLoops = /for\s*\(|while\s*\(|\.forEach|\.map|\.filter|\.reduce/.test(code);
    const usesDataStructures = /new\s+(Map|Set|Array|Object)|{|}|\[|\]/.test(code);
    const hasEdgeCaseHandling = /if\s*\([^)]*===\s*null|if\s*\([^)]*===\s*undefined|if\s*\([^)]*\.length\s*===\s*0/.test(code);
    const usesModernJS = /const\s|let\s|=>|\.map|\.filter|\.reduce|\.find|\.some|\.every/.test(code);

    // Analyze based on problem category
    if (problemCategory.toLowerCase().includes('array')) {
        if (usesLoops) {
            strengths.push('Good use of iteration for array manipulation');
        }
        if (code.includes('.map') || code.includes('.filter') || code.includes('.reduce')) {
            strengths.push('Excellent use of functional array methods');
        }
        if (!hasEdgeCaseHandling) {
            weaknesses.push('Missing edge case handling for empty arrays');
            suggestions.push('Always check for empty arrays and null values');
            focusAreas.push('Edge Case Handling');
        }
    }

    if (problemCategory.toLowerCase().includes('string')) {
        if (code.includes('.split') || code.includes('.join')) {
            strengths.push('Good string manipulation techniques');
        }
        if (!code.includes('.trim') && !code.includes('.toLowerCase')) {
            suggestions.push('Consider normalizing strings (trim, toLowerCase) for robust solutions');
        }
    }

    if (problemCategory.toLowerCase().includes('dynamic programming') || problemCategory.toLowerCase().includes('dp')) {
        if (usesRecursion) {
            strengths.push('Recursive approach identified');
        }
        if (code.includes('memo') || code.includes('dp') || code.includes('cache')) {
            strengths.push('Excellent use of memoization!');
        } else {
            weaknesses.push('Could benefit from memoization to optimize');
            suggestions.push('Try using memoization to cache repeated calculations');
            focusAreas.push('Dynamic Programming Optimization');
        }
    }

    if (problemCategory.toLowerCase().includes('tree') || problemCategory.toLowerCase().includes('graph')) {
        if (usesRecursion) {
            strengths.push('Recursive tree/graph traversal');
        }
        if (code.includes('queue') || code.includes('stack')) {
            strengths.push('Good use of auxiliary data structures');
        }
        if (!usesRecursion && !code.includes('queue') && !code.includes('stack')) {
            weaknesses.push('Tree/Graph problems often need recursion or queue/stack');
            focusAreas.push('Tree Traversal Techniques');
        }
    }

    // General code quality
    if (usesModernJS) {
        strengths.push('Modern JavaScript syntax (ES6+)');
    }

    if (hasComments && codeLength > 100) {
        strengths.push('Well-documented code');
    }

    if (hasDescriptiveNames) {
        strengths.push('Clear variable naming');
    }

    if (lineCount < 10 && !weaknesses.length) {
        strengths.push('Concise and elegant solution');
    }

    if (codeLength > 500 && lineCount > 50) {
        weaknesses.push('Solution might be overly complex');
        suggestions.push('Try to simplify your approach or break into smaller functions');
    }

    // Time-based analysis
    if (timeTaken < 300) { // Less than 5 minutes
        strengths.push('Quick problem-solving! ⚡');
    } else if (timeTaken > 1800) { // More than 30 minutes
        suggestions.push('Practice similar problems to improve speed');
        focusAreas.push(problemCategory);
    }

    // Estimate complexity (basic heuristic)
    let timeComplexity = 'O(n)';
    let spaceComplexity = 'O(1)';

    const nestedLoops = (code.match(/for\s*\(/g) || []).length;
    if (nestedLoops >= 2) {
        timeComplexity = 'O(n²)';
        if (nestedLoops >= 3) {
            timeComplexity = 'O(n³)';
            suggestions.push('Consider optimizing nested loops - O(n³) is quite slow');
        }
    }

    if (usesRecursion) {
        timeComplexity = 'O(2ⁿ) or O(n)';
        spaceComplexity = 'O(n)';
    }

    if (code.includes('new Map') || code.includes('new Set') || code.includes('{}') || code.includes('[]')) {
        spaceComplexity = 'O(n)';
    }

    // Determine code quality
    let codeQuality: 'excellent' | 'good' | 'needs-improvement' = 'good';
    if (strengths.length >= 4 && weaknesses.length === 0) {
        codeQuality = 'excellent';
    } else if (weaknesses.length >= 2 || strengths.length < 2) {
        codeQuality = 'needs-improvement';
    }

    // Calculate mastery level
    const masteryLevel = Math.min(100, Math.max(0,
        (strengths.length * 20) - (weaknesses.length * 15) + (timeTaken < 600 ? 20 : 0)
    ));

    // Ensure we have at least some feedback
    if (strengths.length === 0) {
        strengths.push('Solution works correctly!');
    }

    if (suggestions.length === 0 && weaknesses.length === 0) {
        suggestions.push('Great job! Keep practicing to maintain your skills.');
    }

    return {
        strengths,
        weaknesses,
        suggestions,
        timeComplexity,
        spaceComplexity,
        codeQuality,
        masteryLevel,
        focusAreas
    };
};

/**
 * Generates personalized recommendations based on analysis
 */
export const generateRecommendations = (analysis: CodeAnalysis, problemCategory: string): string[] => {
    const recommendations: string[] = [];

    if (analysis.masteryLevel < 50) {
        recommendations.push(`Practice more ${problemCategory} problems to build confidence`);
    }

    if (analysis.focusAreas.length > 0) {
        analysis.focusAreas.forEach(area => {
            recommendations.push(`Focus on: ${area}`);
        });
    }

    if (analysis.codeQuality === 'needs-improvement') {
        recommendations.push('Review best practices for cleaner code');
    }

    if (analysis.timeComplexity.includes('n²') || analysis.timeComplexity.includes('n³')) {
        recommendations.push('Study time complexity optimization techniques');
    }

    return recommendations;
};
