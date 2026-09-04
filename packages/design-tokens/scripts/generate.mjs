import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDirectory = resolve(packageDirectory, "../..");
const tokens = JSON.parse(await readFile(join(packageDirectory, "tokens.json"), "utf8"));

const genericFontFamilies = new Set([
  "cursive",
  "fantasy",
  "monospace",
  "sans-serif",
  "serif",
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
]);

const formatFontFamily = (family) =>
  genericFontFamilies.has(family) || family.startsWith("-")
    ? family
    : JSON.stringify(family);

const rem = (pixels) => `${pixels / 16}rem`;
const cssLines = [
  "/* Generated from packages/design-tokens/tokens.json. Do not edit directly. */",
  ":root {",
  ...Object.entries(tokens.color).map(([name, value]) => `  --color-${name}: ${value};`),
  ...Object.entries(tokens.fontFamily).map(
    ([name, value]) => `  --font-${name}: ${value.map(formatFontFamily).join(", ")};`,
  ),
  ...Object.entries(tokens.space).map(([name, value]) => `  --space-${name}: ${rem(value)};`),
  ...Object.entries(tokens.radius).map(([name, value]) => `  --radius-${name}: ${rem(value)};`),
  ...Object.entries(tokens.shadow).map(([name, value]) => `  --shadow-${name}: ${value};`),
  ...Object.entries(tokens.fontSize).map(
    ([name, value]) => `  --font-size-${name}: ${rem(value)};`,
  ),
  ...Object.entries(tokens.fontWeight).map(
    ([name, value]) => `  --font-weight-${name}: ${value};`,
  ),
  ...Object.entries(tokens.lineHeight).map(
    ([name, value]) => `  --line-height-${name}: ${value};`,
  ),
  ...Object.entries(tokens.motion).map(
    ([name, value]) => `  --motion-${name}: ${value}ms;`,
  ),
  "}",
  "",
];

const typeScript = [
  "/* Generated from packages/design-tokens/tokens.json. Do not edit directly. */",
  `export const designTokens = ${JSON.stringify(tokens, null, 2)} as const;`,
  "",
  "export type DesignTokens = typeof designTokens;",
  "",
].join("\n");

const outputs = [
  [join(packageDirectory, "src/index.ts"), typeScript],
  [join(repositoryDirectory, "apps/web/src/styles/tokens.css"), cssLines.join("\n")],
];

if (process.argv.includes("--check")) {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "suq-design-tokens-"));
  try {
    for (const [outputPath, expected] of outputs) {
      const actual = await readFile(outputPath, "utf8");
      if (actual !== expected) {
        throw new Error(`${outputPath} is stale; run npm run generate:tokens`);
      }
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
} else {
  for (const [outputPath, content] of outputs) {
    await writeFile(outputPath, content);
  }
}
