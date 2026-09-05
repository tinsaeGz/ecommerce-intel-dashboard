import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import { i18n } from "../i18n";

vi.stubGlobal("ResizeObserver", class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

afterEach(async () => {
  cleanup();
  await i18n.changeLanguage("en");
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.body.removeAttribute("data-menu-open");
  document.title = "Suq Insights";
});
