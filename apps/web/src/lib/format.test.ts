import { describe, expect, it } from "vitest";

import { landingDemo } from "./demo-data";
import {
  formatCurrency,
  formatDemoDate,
  formatNumber,
  formatPercent,
} from "./format";

describe("localized demo formatting", () => {
  it("uses explicit locale conventions for every launch language", () => {
    expect(formatCurrency(landingDemo.revenue, "EUR", "en")).toBe("€12,480");
    expect(formatCurrency(landingDemo.revenue, "EUR", "es")).toMatch(/12\.480\s*€/);
    expect(formatCurrency(landingDemo.revenue, "EUR", "fr")).toMatch(/12[\s\u202f]480\s*€/);
    expect(formatNumber(landingDemo.transactions, "fr")).toBe("312");
    expect(formatPercent(landingDemo.comparisonPercent, "es")).toBe("+18 %");
  });

  it("keeps the synthetic date deterministic in the merchant timezone", () => {
    expect(formatDemoDate(landingDemo.date, "en", landingDemo.timeZone)).toBe("3 Sept");
    expect(formatDemoDate(landingDemo.date, "es", landingDemo.timeZone)).toBe("3 sept");
    expect(formatDemoDate(landingDemo.date, "fr", landingDemo.timeZone)).toBe("3 sept.");
  });
});
