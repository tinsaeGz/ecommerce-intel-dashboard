import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { SampleScenarioProvider } from "../components/sample-scenario-provider";
import { useSampleScenario } from "../lib/sample-scenario";
import { i18n } from "../i18n";
import { CinematicStory } from "./cinematic-story";

let notify: IntersectionObserverCallback;
const nativeShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const nativeClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");
const disconnect = vi.fn();
function ScenarioProbe() {
  const { state } = useSampleScenario();
  return <output data-testid="scenario">{JSON.stringify(state)}</output>;
}

beforeEach(async () => {
  await i18n.changeLanguage("en");
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute("open"); } });
  vi.stubGlobal("innerHeight", 1000);
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { notify = callback; }
    observe() {}
    disconnect = disconnect;
  });
});
afterEach(() => {
  vi.unstubAllGlobals(); vi.clearAllMocks();
  if (nativeShow) Object.defineProperty(HTMLDialogElement.prototype, "showModal", nativeShow);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (nativeClose) Object.defineProperty(HTMLDialogElement.prototype, "close", nativeClose);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

function renderStory() {
  return render(<MemoryRouter><SampleScenarioProvider><CinematicStory /><ScenarioProbe /></SampleScenarioProvider></MemoryRouter>);
}
function intersect(chapter: string) {
  const targets = Array.from(document.querySelectorAll(".cinematic-copy"));
  act(() => notify(targets.map(target => ({ target, isIntersecting: (target as HTMLElement).dataset.chapter === chapter })) as IntersectionObserverEntry[], {} as IntersectionObserver));
}

describe("chapter presentation", () => {
  it("scrolls through chapters without changing any scenario data", async () => {
    const { unmount } = renderStory();
    const before = screen.getByTestId("scenario").textContent;
    for (const chapter of ["evidence", "sale", "day", "sale"]) {
      intersect(chapter);
      expect(document.getElementById(`scene-${chapter}`)).not.toHaveAttribute("aria-hidden");
      expect(document.querySelectorAll('.cinematic-pane:not([aria-hidden])')).toHaveLength(1);
      expect(screen.getByTestId("scenario").textContent).toBe(before);
    }
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("keeps an operated control visible while scrolling, then allows explicit chapter selection", async () => {
    const user = userEvent.setup();
    renderStory();
    intersect("evidence");
    const role = screen.getByRole("combobox");
    role.focus();
    intersect("sale");
    expect(role).toHaveFocus();
    expect(document.getElementById("scene-evidence")).not.toHaveAttribute("aria-hidden");
    await user.click(screen.getByRole("button", { name: "Try the next sale" }));
    expect(document.getElementById("scene-sale")).not.toHaveAttribute("aria-hidden");
    expect(document.getElementById("scene-evidence")).toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "Try the next sale" })).toHaveFocus();
  });

  it("keeps review confirmation and a pending sale through chapter and language changes", async () => {
    const user = userEvent.setup();
    renderStory();
    await user.click(screen.getByRole("button", { name: "Inspect the evidence" }));
    await user.click(screen.getByRole("button", { name: i18n.t("polish.review.confirm") }));
    await user.click(screen.getByRole("button", { name: "Try the next sale" }));
    await user.click(screen.getByRole("button", { name: i18n.t("stories.entry.select") }));
    await act(() => i18n.changeLanguage("fr"));
    const entry = screen.getByRole("group", { name: i18n.t("stories.entry.try") });
    expect(within(entry).getByRole("button", { name: i18n.t("stories.entry.confirm") })).toBeVisible();
    await user.click(screen.getByRole("button", { name: i18n.t("cinematic.evidence.label") }));
    expect(screen.getByRole("region", { name: i18n.t("polish.review.title") })).toHaveAttribute("data-confirmed", "true");
  });

  it.each(["en", "es", "fr"])("carries an operated scenario into and out of the focused story in %s", async locale => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    renderStory();
    await user.click(screen.getByRole("button", { name: i18n.t("cinematic.evidence.label") }));
    await user.click(screen.getByRole("button", { name: i18n.t("polish.review.confirm") }));
    const before = screen.getByTestId("scenario").textContent;
    await user.click(screen.getByRole("button", { name: i18n.t("theatre.enter") }));
    const dialog = screen.getByRole("dialog", { name: i18n.t("theatre.focusTitle") });
    expect(within(dialog).getByRole("button", { name: i18n.t("theatre.exit") })).toHaveFocus();
    expect(screen.getByTestId("scenario").textContent).toBe(before);
    expect(document.querySelectorAll(".hero-record")).toHaveLength(1);
    expect(document.documentElement).toHaveClass("cinematic-focus-open");
    await user.click(within(dialog).getByRole("button", { name: i18n.t("theatre.trySale") }));
    expect(within(dialog).getByRole("button", { name: i18n.t("cinematic.sale.label") })).toHaveFocus();
    await user.click(within(dialog).getByRole("button", { name: i18n.t("stories.entry.select") }));
    const pending = screen.getByTestId("scenario").textContent;
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: i18n.t("theatre.enter") })).toHaveFocus();
    expect(document.documentElement).not.toHaveClass("cinematic-focus-open");
    expect(screen.getByTestId("scenario").textContent).toBe(pending);
    await user.click(screen.getByRole("button", { name: i18n.t("theatre.enter") }));
    await user.click(screen.getByRole("button", { name: i18n.t("stories.entry.confirm") }));
    expect(JSON.parse(screen.getByTestId("scenario").textContent ?? "{}").sale).toBe("recorded");
    await user.click(screen.getByRole("button", { name: i18n.t("stories.entry.undo") }));
    expect(JSON.parse(screen.getByTestId("scenario").textContent ?? "{}").sale).toBe("idle");
    await user.click(screen.getByRole("button", { name: i18n.t("theatre.exit") }));
    expect(screen.getByRole("button", { name: i18n.t("theatre.enter") })).toHaveFocus();
  });

  it("falls back when a translated or expanded product scene cannot fit the viewport", () => {
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(1200);
    try {
      renderStory();
      expect(document.querySelector(".cinematic-story")).toHaveAttribute("data-enhanced", "false");
      expect(document.querySelectorAll('.cinematic-pane:not([aria-hidden])')).toHaveLength(3);
      expect(screen.getAllByRole("combobox")).toHaveLength(1);
    } finally { height.mockRestore(); }
  });

  it("renders sequential scenes when observers are unavailable or the viewport is short", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("innerHeight", 600);
    renderStory();
    expect(document.querySelector('.cinematic-story')).toHaveAttribute("data-enhanced", "false");
    expect(document.querySelectorAll('.cinematic-pane:not([aria-hidden])')).toHaveLength(3);
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    fireEvent.scroll(window);
    expect(screen.getByRole("group", { name: i18n.t("stories.entry.try") })).toBeVisible();
  });
});
