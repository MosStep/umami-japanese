// Packs dist/ into release/web-bundle-<version>.zip for the Capgo OTA update.
// The zip contents (index.html etc.) sit at the zip root, not inside a dist/ folder.
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from 'archiver';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const versionSrc = readFileSync(join(root, 'src/config/version.ts'), 'utf8');
const match = versionSrc.match(/APP_VERSION_NAME\s*=\s*'([^']+)'/);
if (!match) {
  throw new Error('APP_VERSION_NAME not found in src/config/version.ts');
}
const version = match[1];

const distDir = join(root, 'dist');
if (!existsSync(join(distDir, 'index.html'))) {
  throw new Error('dist/index.html not found. Run `npm run build` first.');
}

const releaseDir = join(root, 'release');
mkdirSync(releaseDir, { recursive: true });
const outFile = join(releaseDir, `web-bundle-${version}.zip`);

await new Promise((resolvePromise, rejectPromise) => {
  const output = createWriteStream(outFile);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on('close', resolvePromise);
  archive.on('error', rejectPromise);
  archive.on('warning', (err) => console.warn(err));

  archive.pipe(output);
  archive.directory(distDir, false);
  archive.finalize();
});

const sizeMB = (statSync(outFile).size / (1024 * 1024)).toFixed(2);
console.log(`Web bundle v${version} created: ${outFile} (${sizeMB} MB)`);
