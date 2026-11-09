// Loads the app's own caption rules (src/data/captions/link.ts) and the dictionary (src/data/mockVideos.ts)
// for the build scripts. Both files are bundled with esbuild, so the scripts run the app's code, not a copy.
import { buildSync } from 'esbuild';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const loadModule = async (relPath) => {
  const { outputFiles } = buildSync({
    entryPoints: [join(ROOT, relPath)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
};

export const loadSharedRules = () => loadModule('src/data/captions/link.ts');

export const loadDictionary = async () => {
  const mod = await loadModule('src/data/mockVideos.ts');
  return mod.DICTIONARY_WORDS;
};
