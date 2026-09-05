import { StrictMode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { createLocalJourneySink, localJourneySink, useDemoVisit } from "./journey-events";

describe("local journey events", () => {
  it("rejects unknown event names, unsafe properties and unapproved values", () => {
    const sink = createLocalJourneySink();
    expect(sink.emit("upload", { locale: "en", location: "hero" })).toBe(false);
    for (const properties of [
      { locale: "en", location: "hero", email: "merchant@example.test" },
      { locale: "en", location: "customer-supplied-file.csv" },
      { locale: "de", location: "hero" },
      { locale: { toString: () => "en" }, location: "hero" },
      { locale: "en" },
      { locale: "en", location: "demo" },
    ]) expect(sink.emit("landing_cta_selected", properties)).toBe(false);
    expect(sink.snapshot()).toEqual([]);
  });

  it("keeps only the latest 100 immutable events in memory", () => {
    const sink = createLocalJourneySink();
    const properties = { locale: "fr", location: "hero" };
    expect(sink.emit("landing_cta_selected", properties)).toBe(true);
    properties.locale = "unsafe";
    expect(sink.snapshot()[0].properties.locale).toBe("fr");
    expect(Object.isFrozen(sink.snapshot()[0].properties)).toBe(true);
    for (let i = 0; i < 101; i++) sink.emit("demo_started", { locale: "es", location: "demo" });
    const snapshot = sink.snapshot();
    expect(snapshot).toHaveLength(100);
    snapshot.pop();
    expect(sink.snapshot()).toHaveLength(100);
    sink.clear();
    expect(sink.snapshot()).toEqual([]);
  });

  it("does not double-count a demo visit when React replays effects", () => {
    function Visit() { useDemoVisit(); return null; }
    localJourneySink.clear();
    render(<StrictMode><MemoryRouter initialEntries={["/demo"]}><Visit /></MemoryRouter></StrictMode>);
    expect(localJourneySink.snapshot().map(event => event.name)).toEqual(["demo_started"]);
  });
});
