/**
 * Application Name: Hackathon Habit
 * Entry Point: App.tsx
 * Description: Main application component setting up routing and providers.
 * Author: Antigravity Agent
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

/**
 * App Component
 * 
 * Root component that initializes:
 * - QueryClient for server state management
 * - UI Providers (Tooltip, Toaster)
 * - React Router for navigation
 * - Theme initialization from localStorage
 */
const App = () => {
  useEffect(() => {
    // Apply saved theme on app start
    const savedThemeValues = localStorage.getItem("hackathon-habit-theme-values");
    if (savedThemeValues) {
      try {
        const themeColors = JSON.parse(savedThemeValues);
        Object.entries(themeColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value as string);
        });
      } catch (e) {
        console.error("Failed to parse theme values", e);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Global UI Providers: Tooltips and Toasts */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Client-side Routing */}
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
