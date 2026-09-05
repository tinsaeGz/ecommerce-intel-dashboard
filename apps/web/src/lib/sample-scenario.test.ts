import { describe, expect, it } from "vitest";
import { initialScenario, scenarioReducer as reduce, type ScenarioAction } from "./sample-scenario";
import { landingDemo, previewMetricSeries } from "./demo-data";

describe("memory sample transitions", () => {
  it("requires preview, applies a sale once, and supports cancel, undo and replay", () => {
    expect(reduce(initialScenario, { type: "confirm-sale" })).toEqual(initialScenario);
    const preview = reduce(initialScenario, { type: "preview-sale" });
    expect(reduce(preview, { type: "cancel-sale" })).toEqual(initialScenario);
    const recorded = reduce(preview, { type: "confirm-sale" });
    expect(recorded.sale).toBe("recorded");
    for (const type of ["confirm-sale", "preview-sale", "cancel-sale"] as const) {
      expect(reduce(recorded, { type })).toEqual(recorded);
    }
    const undone = reduce(recorded, { type: "undo-sale" });
    expect(undone).toEqual(initialScenario);
    expect(reduce(reduce(undone, { type: "preview-sale" }), { type: "confirm-sale" })).toEqual(recorded);
  });

  it("invalidates confirmation only when the source or role changes", () => {
    const confirmed = reduce(initialScenario, { type: "confirm-review" });
    expect(reduce(confirmed, { type: "role", value: "itemIdentity" }).confirmed).toBe(true);
    expect(reduce(confirmed, { type: "source", value: "csv" }).confirmed).toBe(true);
    expect(reduce(confirmed, { type: "role", value: "customerIdentity" }).confirmed).toBe(false);
    expect(reduce(confirmed, { type: "source", value: "excel" }).confirmed).toBe(false);
    expect(reduce(confirmed, { type: "identity", value: false }).confirmed).toBe(true);
  });

  it("keeps historical fixtures immutable and resets every choice", () => {
    const history = JSON.stringify({ landingDemo, previewMetricSeries });
    const actions: ScenarioAction[] = [
      { type: "source", value: "pdf" }, { type: "role", value: "notAnalyzed" },
      { type: "confirm-review" }, { type: "identity", value: false },
      { type: "metric", value: "units" }, { type: "observation", value: 3 },
      { type: "stock", value: 2 }, { type: "preview-sale" }, { type: "confirm-sale" },
    ];
    const changed = actions.reduce(reduce, initialScenario);
    expect(changed).toEqual({ source: "pdf", role: "notAnalyzed", confirmed: true, hasIdentity: false, metric: "units", observation: 3, stockIndex: 2, sale: "recorded" });
    expect(JSON.stringify({ landingDemo, previewMetricSeries })).toBe(history);
    expect(reduce(changed, { type: "reset" })).toEqual(initialScenario);
    for (const value of [-1, 99, 0.5, NaN]) {
      expect(reduce(changed, { type: "observation", value })).toEqual(changed);
      expect(reduce(changed, { type: "stock", value })).toEqual(changed);
    }
  });
});
