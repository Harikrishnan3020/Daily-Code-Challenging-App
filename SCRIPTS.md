# NPM Scripts Documentation

This document explains the available npm scripts in the project.

## Development
- `npm run dev`: **Starts the development server**. access the app at `http://localhost:8080`. Supports HMR (Hot Module Replacement).
- `npm run preview`: **Preview Production Build**. Serve the output of the build command locally to verify production behavior.

## Build
- `npm run build`: Compiles the application for production deployment.
- `npm run build:dev`: Compiles the application in development mode (useful for debugging build artifacts).

## Quality
- `npm run lint`: Runs ESLint to identify code quality issues.
- `npm test`: Runs the test suite once.
- `npm run test:watch`: Runs tests in watch mode.
