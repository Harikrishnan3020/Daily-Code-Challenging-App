/**
 * Rank Animation Utilities
 * Provides functions to trigger visual effects (confetti, etc.) based on user rank.
 * Author: Antigravity Agent
  * Last Audit: 2026-02-02
 */
import confetti from "canvas-confetti";
import { Rank } from "./ranks";

/**
 * Triggers a celebration animation appropriate for the user's specific rank.
 * 
 * @param rank - The user's new rank object
 */
export const triggerRankUpAnimation = (rank: Rank) => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    switch (rank.name) {
        case "Bronze":
            // Simple bronze burst
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: [rank.color, "#ffffff"]
            });
            break;

        case "Silver":
            // Metallic silver and white rain
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.6 },
                colors: [rank.color, "#e0e0e0", "#ffffff"],
                scalar: 1.2
            });
            break;

        case "Gold": {
            // Golden shower
            const goldDefaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const goldInterval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(goldInterval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti({ ...goldDefaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: [rank.color, "#ffeb3b", "#ffffff"] });
            }, 250);
            break;
        }

        case "Platinum": {
            // Elegant blue/white lateral bursts
            const platEnd = Date.now() + 3000;
            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: [rank.color, "#f0f8ff"]
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: [rank.color, "#f0f8ff"]
                });

                if (Date.now() < platEnd) {
                    requestAnimationFrame(frame);
                }
            }());
            break;
        }

        case "Diamond":
            // Diamond burst - centralized high energy
            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.5 },
                colors: ["#B9F2FF", "#00BFFF", "#FFFFFF"],
                scalar: 1.5,
                startVelocity: 45
            });
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 360,
                    origin: { y: 0.5 },
                    colors: ["#B9F2FF", "#00BFFF", "#FFFFFF"],
                    shapes: ['circle'],
                    scalar: 0.8
                });
            }, 300);
            break;

        case "Master": {
            // Fire/Red inferno effect
            const masterDuration = 3000; // 3 seconds
            const masterEnd = Date.now() + masterDuration;

            (function frame() {
                const timeLeft = masterEnd - Date.now();

                if (timeLeft <= 0) return;

                confetti({
                    particleCount: 8,
                    angle: 270, // Downwards
                    spread: 180,
                    startVelocity: 35,
                    origin: { y: -0.1, x: Math.random() }, // From Top
                    colors: ["#FF4500", "#FF0000", "#FFD700"], // Red/Orange/Gold
                    shapes: ['circle', 'square'],
                    gravity: 0.8,
                    scalar: 1.2
                });

                requestAnimationFrame(frame);
            }());
            break;
        }

        case "Grandmaster": {
            // The ultimate chaos - fireworks simulation
            const gmDuration = 5000;
            const gmAnimationEnd = Date.now() + gmDuration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: NodeJS.Timeout = setInterval(function () {
                const timeLeft = gmAnimationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / gmDuration);

                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: [rank.color, "#800080", "#FFD700"] }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: [rank.color, "#4B0082", "#ffffff"] }));
            }, 250);
            break;
        }

        default:
            // Fallback
            confetti({
                particleCount: 100,
                spread: 100,
                origin: { y: 0.6 }
            });
    }
};
