import { describe, expect, it } from "vitest";

import { landingDemo } from "./demo-data";
import { coffeeStock, customerHistory, returningCount, salesComparison, sampleStock } from "./merchant-story-data";

describe("merchant story evidence", () => {
  it("reconciles product contributions to the shared revenue and comparison", () => {
    const current = salesComparison.reduce((sum, row) => sum + row.currentCents, 0);
    const previous = salesComparison.reduce((sum, row) => sum + row.previousCents, 0);
    expect(current).toBe(landingDemo.revenue * 100);
    expect(previous).toBe(Math.round(landingDemo.chart.previous.at(-1)! * 100));
    expect(Math.round((current - previous) / previous * 100)).toBe(landingDemo.comparisonPercent);
    expect(salesComparison.every(row => Number.isInteger(row.currentCents) && Number.isInteger(row.previousCents))).toBe(true);
  });

  it("ties the stock estimate to the shared risk and known movements", () => {
    expect(sampleStock).toBe(12);
    expect(sampleStock / coffeeStock.dailyPace).toBe(landingDemo.stockRiskItems[0].daysRemaining);
    expect(coffeeStock.sold).toBeLessThanOrEqual(landingDemo.units);
  });

  it("counts returning customers by stable identity without double counting", () => {
    expect(new Set(customerHistory.today).size).toBe(landingDemo.customers);
    expect(new Set(customerHistory.earlier).size).toBe(customerHistory.earlier.length);
    expect(returningCount).toBe(landingDemo.returningCustomers);
    expect(customerHistory.today.length - returningCount).toBe(203);
  });
});
