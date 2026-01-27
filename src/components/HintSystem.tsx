import { useState } from "react";
import { Lightbulb } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface HintSystemProps {
    /** List of hint strings to be displayed progressively */
    hints: string[];
}

/**
 * HintSystem Component
 * Displays progressively revealable hints to assist the user.
 * Tracks how many hints have been used.
 */
const HintSystem = ({ hints }: HintSystemProps) => {
    // State to track how many hints have been revealed so far
    const [revealedCount, setRevealedCount] = useState(0);

    /**
     * Reveals the next available hint if there are any left.
     * Increments the revealedCount state.
     */
    const revealNextHint = () => {
        if (revealedCount < hints.length) {
            setRevealedCount((prev) => prev + 1);
        }
    };

    return (
        <div className="glass-card p-4 md:p-6 animate-slide-up mt-4">
            {/* Header Section: Title and Count */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    Hints
                </h3>
                <span className="text-xs text-muted-foreground">
                    {revealedCount} / {hints.length} Revealed
                </span>
            </div>

            {/* Hint List: Displays currently revealed hints */}
            <div className="space-y-3">
                {hints.slice(0, revealedCount).map((hint, index) => (
                    <div
                        key={index}
                        className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-sm italic text-muted-foreground animate-fade-in"
                    >
                        " {hint} "
                    </div>
                ))}
            </div>

            {/* Action Button: Visible only if there are more hints to show */}
            {revealedCount < hints.length && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={revealNextHint}
                    className="w-full mt-4 border-dashed"
                >
                    Reveal Next Hint
                </Button>
            )}
        </div>
    );
};

export default HintSystem;
