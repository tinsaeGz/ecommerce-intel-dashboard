import { describe, expect, it } from "vitest";

import { pseudoLocalize } from "./pseudo-localize";

describe("pseudo localization", () => {
  it("accents and expands copy by roughly thirty to forty percent", () => {
    const source = "Revenue over time for the selected period";
    const pseudoLocalized = pseudoLocalize(source);
    const expansionRatio = (pseudoLocalized.length - 2) / source.length;

    expect(pseudoLocalized).toMatch(/^［.*］$/);
    expect(pseudoLocalized).toContain("Rëvënûë");
    expect(expansionRatio).toBeGreaterThanOrEqual(1.3);
    expect(expansionRatio).toBeLessThanOrEqual(1.4);
  });
});
