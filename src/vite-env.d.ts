/**
 * File: vite-env.d.ts
 * Description: Implementation of vite-env.
 * Copyright: 2026 Daily Code Challenge
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
