/**
 * File: NotFound.tsx
 * Description: Implementation of NotFound.
 * Copyright: 2026 Daily Code Challenge
 */
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

/**
 * NotFound Page Component
 * 
 * Renders a 404 error page (Page Not Found) when a user navigates to a non-existent route.
 * Automatically logs the attempted missing path to the console for debugging purposes.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mb-6 text-2xl text-gray-600 dark:text-gray-400">Oops! Page not found</p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
