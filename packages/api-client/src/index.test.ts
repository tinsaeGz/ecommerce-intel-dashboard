import { describe, expect, it, vi } from "vitest";

import { createApiClient } from "./index";

describe("generated API client boundary", () => {
  it("requests the versioned API with same-origin credentials", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ service: "suq-insights-api", version: "test-version" }),
        { status: 200 },
      ),
    );

    const response = await createApiClient({ baseUrl: "https://example.test", fetch }).version();

    expect(fetch).toHaveBeenCalledWith("https://example.test/v1/version", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    expect(response.version).toBe("test-version");
  });
});
