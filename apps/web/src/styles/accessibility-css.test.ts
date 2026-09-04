import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const styles = [
  "base.css",
  "../components/public-ui.css",
  "../marketing/dashboard-preview.css",
  "../marketing/landing-page.css",
  "../marketing/product-understanding.css",
  "../marketing/merchant-story.css",
]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n");

describe("adaptive accessibility styles", () => {
  it("provides static states when reduced motion is requested", () => {
    expect(styles.match(/@media \(prefers-reduced-motion: reduce\)/g)).toHaveLength(4);
    expect(styles).toContain("animation: none");
    expect(styles).toContain("transition: none");
    expect(styles).toContain("transform: none");
  });

  it("keeps controls and charts visible in forced-colors mode", () => {
    expect(styles.match(/@media \(forced-colors: active\)/g)).toHaveLength(5);
    expect(styles).toContain("border: 0.125rem solid currentcolor");
    expect(styles).toContain("stroke: currentcolor");
  });
});
