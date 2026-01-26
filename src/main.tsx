/**
 * Application Entry Point
 * Mounts the React application to the DOM.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
