/**
 * Application Entry Point
 * Mounts the React application to the DOM.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Developer environment check
if (import.meta.env.DEV) {
    console.info("🚀 Hackathon Habit App mounting...");
}

createRoot(document.getElementById("root")!).render(<App />);
