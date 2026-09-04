import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const budgetBytes = 200 * 1024;
const manifestPath = new URL("../dist/.vite/manifest.json", import.meta.url);
const outputRoot = new URL("../dist/", import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const entry = Object.values(manifest).find((chunk) => chunk.isEntry);

if (!entry) {
  throw new Error("Vite manifest does not contain an entry chunk.");
}

const initialFiles = new Set();

function collectStaticImports(chunk) {
  if (chunk.file.endsWith(".js")) {
    initialFiles.add(chunk.file);
  }

  for (const importedKey of chunk.imports ?? []) {
    const importedChunk = manifest[importedKey];
    if (!importedChunk) {
      throw new Error(`Vite manifest import ${importedKey} is missing.`);
    }
    collectStaticImports(importedChunk);
  }
}

collectStaticImports(entry);

let totalBytes = 0;
for (const file of initialFiles) {
  const source = await readFile(new URL(file, outputRoot));
  totalBytes += gzipSync(source).byteLength;
}

const totalKilobytes = (totalBytes / 1024).toFixed(1);
const budgetKilobytes = (budgetBytes / 1024).toFixed(0);

if (totalBytes > budgetBytes) {
  throw new Error(
    `Landing entry is ${totalKilobytes} KB gzip, above the ${budgetKilobytes} KB budget.`,
  );
}

console.log(
  `Landing entry: ${totalKilobytes} KB gzip across ${initialFiles.size} JavaScript file(s); budget: ${budgetKilobytes} KB.`,
);
