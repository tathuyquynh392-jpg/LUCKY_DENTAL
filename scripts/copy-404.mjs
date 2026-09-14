import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '404.html');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist!');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html does not exist!');
  process.exit(1);
}

try {
  fs.copyFileSync(indexPath, fallbackPath);
  console.log('✓ Successfully copied dist/index.html -> dist/404.html');
} catch (err) {
  console.error('Failed to copy index.html to 404.html:', err);
  process.exit(1);
}
