import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, 'src/template.html'), 'utf8');
const output = join(root, 'index.html');

writeFileSync(output, renderPage(template));
console.log(`Built ${output}`);
