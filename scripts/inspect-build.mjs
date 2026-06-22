import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distDir = new URL('../dist', import.meta.url).pathname;
const sourceFile = new URL('../src/App.vue', import.meta.url).pathname;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

const files = walk(distDir).filter((file) => /\.(js|css|html)$/.test(file));
const dataV = new Map();
let inspCount = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  inspCount += content.match(/data-insp-path/g)?.length ?? 0;

  for (const match of content.matchAll(/data-v-[0-9a-f]{8}/g)) {
    const key = `${file.replace(distDir, 'dist')}:${match[0]}`;
    dataV.set(key, (dataV.get(key) ?? 0) + 1);
  }
}

const source = readFileSync(sourceFile, 'utf8');
const { transformCode } = await import('@code-inspector/core');
const transformed = await transformCode({
  content: source,
  filePath: sourceFile,
  fileType: 'vue',
  pathType: 'relative',
});

console.log('transformed App.vue data-insp-path count:', transformed.match(/data-insp-path/g)?.length ?? 0);
console.log('data-insp-path count:', inspCount);
console.log('data-v values:');
for (const [key, count] of [...dataV.entries()].sort()) {
  console.log(`${String(count).padStart(3, ' ')} ${key}`);
}
