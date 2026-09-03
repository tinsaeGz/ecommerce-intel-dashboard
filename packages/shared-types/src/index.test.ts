import { describe, expect, it } from "vitest";

import { SUPPORTED_LOCALES } from "./index";

describe("shared client types", () => {
  it("defines the three SDLC locales in source-language order", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "es", "fr"]);
  });
});
