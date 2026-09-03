import { describe, expect, it } from "vitest";

import en from "./en/common.json";
import es from "./es/common.json";
import fr from "./fr/common.json";

function leafKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    leafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("locale catalogs", () => {
  it.each([
    ["Spanish", es],
    ["French", fr],
  ])("keeps %s keys aligned with English", (_name, catalog) => {
    expect(leafKeys(catalog).sort()).toEqual(leafKeys(en).sort());
  });
});
