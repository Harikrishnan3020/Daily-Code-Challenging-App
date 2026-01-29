/**
 * Application Entry Point
 * Mounts the React application to the DOM.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Developer environment check
// This allows developers to confirm that the app is running in the expected mode.
if (import.meta.env.DEV) {
    console.info("🚀 Hackathon Habit App mounting in DEVELOPMENT mode...");
}

import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
