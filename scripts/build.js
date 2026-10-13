import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const wwwDir = path.join(rootDir, 'www');

// Clean and recreate www/
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const itemsToCopy = [
  'index.html',
  'privacy.html',
  'css',
  'js',
  'img',
  'icons',
  'manifest.json',
  'sw.js'
];

for (const item of itemsToCopy) {
  const src = path.join(rootDir, item);
  const dest = path.join(wwwDir, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`Copied ${item} to www/`);
  }
}

console.log('Build completed successfully: www/ directory is ready for Capacitor.');
