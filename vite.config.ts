import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The data JSON (captions, explanations, glossary…) is large: emit it as JSON.parse("…") strings, which needs far
  // less memory to transform and bundle than JSON turned into JS object literals (and parses faster at runtime).
  json: { stringify: true },
});
