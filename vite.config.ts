import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The data JSON (captions, explanations, glossary…) is large: emit it as JSON.parse("…") strings, which needs far
  // less memory to transform and bundle than JSON turned into JS object literals (and parses faster at runtime).
  json: { stringify: true },
  // Keep the build within ~600 MB on this machine: no gzip size report, fewer files transformed at once.
  build: { reportCompressedSize: false, rollupOptions: { maxParallelFileOps: 4 } },
});
