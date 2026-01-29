/**
 * PostCSS Configuration
 * Configures the build process for CSS, including Tailwind CSS and autoprefixing.
 */
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    // Generate Tailwind utility classes
    tailwindcss: {},
    // Add vendor prefixes for better browser compatibility
    autoprefixer: {},
  },
};
