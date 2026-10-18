import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from './src/locale.mjs';
import { renderPage } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, 'src/template.html'), 'utf8');

const assetVersion = path => createHash('sha256').update(readFileSync(join(root, path))).digest('hex').slice(0, 10);

for (const lang of Object.keys(locales)) {
  const output = join(root, `index.${lang}.html`);
  writeFileSync(output, renderPage(template, lang, assetVersion));
  console.log(`Built ${output}`);
}
