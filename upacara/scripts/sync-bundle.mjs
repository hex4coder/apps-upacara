import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const akar = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sumber = resolve(akar, 'dist/main.lynx.bundle');
const tujuan = resolve(akar, 'android/app/src/main/assets/main.lynx.bundle');

mkdirSync(dirname(tujuan), { recursive: true });
copyFileSync(sumber, tujuan);

console.log('Bundle disalin ke: ' + tujuan);
