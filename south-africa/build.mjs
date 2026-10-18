import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);

const template = readFileSync(join(root, 'src/template.html'), 'utf8');
writeFileSync(join(dist, 'index.html'), renderPage(template));

cpSync(join(root, 'images'), join(dist, 'images'), {
  recursive: true,
  filter: source => !source.includes(`${join('images', 'drafts')}`),
});
for (const file of ['favicon.svg', 'apple-touch-icon.png']) {
  cpSync(join(root, file), join(dist, file));
}

console.log(`Built ${join(dist, 'index.html')}`);
