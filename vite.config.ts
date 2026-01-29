/**
 * Vite Configuration
 * Configures React plugin, path aliases (@ -> src), and server settings.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
/**
 * Vite Configuration
 * Defines build settings, plugins (React), and proxy rules for backend development.
 */
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy configuration for backend communication
    proxy: {
      // Redirects /google-login requests to the Python backend running on port 5000
      '/google-login': 'http://localhost:5000',
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
