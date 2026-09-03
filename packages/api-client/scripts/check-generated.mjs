import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const temporaryDirectory = await mkdtemp(join(tmpdir(), "suq-api-client-"));
const generatedPath = join(temporaryDirectory, "schema.d.ts");

try {
  const result = spawnSync(
    "openapi-typescript",
    ["openapi.json", "--output", generatedPath],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exitCode = result.status ?? 1;
  } else {
    const [expected, actual] = await Promise.all([
      readFile(generatedPath, "utf8"),
      readFile("src/schema.d.ts", "utf8"),
    ]);

    if (actual !== expected) {
      throw new Error("API client types are stale; run npm run generate:api-client");
    }
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
