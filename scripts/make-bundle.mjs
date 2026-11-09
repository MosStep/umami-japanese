// Packs dist/ into release/web-bundle-<version>.zip for the Capgo OTA update.
// The zip contents (index.html etc.) sit at the zip root, not inside a dist/ folder.
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
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
const buildMatch = versionSrc.match(/APP_BUILD\s*=\s*(\d+)/);
if (!buildMatch) {
  throw new Error('APP_BUILD not found in src/config/version.ts');
}
const build = Number(buildMatch[1]);

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

// SHA-256 of the final zip on disk. @capgo/capacitor-updater refuses downloads without it.
const checksum = await new Promise((resolvePromise, rejectPromise) => {
  const hash = createHash('sha256');
  const stream = createReadStream(outFile);
  stream.on('error', rejectPromise);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', () => resolvePromise(hash.digest('hex')));
});
console.log(`sha256 ${checksum}`);

// Written AFTER zipping: public/ is copied into dist/, so the zip keeps the previous catalog content.
// The app reads the live catalog from GitHub main, not from the bundle.
const catalogFile = join(root, 'public/live_catalog.json');
const catalogRaw = readFileSync(catalogFile, 'utf8');
const eol = catalogRaw.includes('\r\n') ? '\r\n' : '\n';
const catalog = JSON.parse(catalogRaw);
catalog.version = version;
catalog.build = build;
catalog.bundle_url = `https://github.com/MosStep/umami-japanese/releases/download/v${version}/web-bundle-${version}.zip`;
catalog.checksum = checksum;
writeFileSync(catalogFile, JSON.stringify(catalog, null, 2).replace(/\n/g, eol) + eol, 'utf8');
console.log(`Updated public/live_catalog.json: version ${version}, build ${build}, checksum ${checksum}`);
