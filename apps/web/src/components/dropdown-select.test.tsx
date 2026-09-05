import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";

import { DropdownSelect } from "./dropdown-select";

const options = [
  { value: "en", label: "English", mark: "EN", lang: "en" },
  { value: "de", label: "Deutsch", disabled: true },
  { value: "es", label: "Español", mark: "ES", lang: "es" },
  { value: "fr", label: "Français", mark: "FR", lang: "fr" },
];

function Example({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState("en");
  return <main><DropdownSelect label="Choose language" value={value} onChange={setValue} options={options} disabled={disabled} /><button type="button">Next</button></main>;
}

describe("shared dropdown select", () => {
  it("keeps the options inside a containing dialog and cancels the list without closing it", async () => {
    const user = userEvent.setup();
    render(<dialog open aria-label="Sample"><Example /></dialog>);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("dialog")).toContainElement(screen.getByRole("listbox"));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("browses without committing, skips disabled options, and cancels with Escape", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("combobox");
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveTextContent("English");
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Español" }).id);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveTextContent("English");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.keyboard("{End}{Enter}");
    expect(trigger).toHaveTextContent("Français");
    await user.keyboard("{Home} ");
    expect(trigger).toHaveTextContent("English");
  });

  it("supports typeahead, Tab commitment, outside dismissal and pointer selection", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("combobox");
    await user.tab();
    await user.keyboard("fr");
    await user.tab();
    expect(trigger).toHaveTextContent("Français");
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Deutsch" }));
    expect(trigger).toHaveTextContent("Français");
    await user.click(screen.getByRole("option", { name: "Español" }));
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveTextContent("Español");
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open disabled controls", async () => {
    const user = userEvent.setup();
    render(<Example disabled />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps the active option inside the popup without scrolling the document", async () => {
    const top = vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("role") === "option" && this.textContent?.includes("Français") ? 160 : 0;
    });
    const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(44);
    const viewport = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(80);
    try {
      const user = userEvent.setup();
      render(<Example />);
      await user.tab();
      await user.keyboard("{End}");
      expect(screen.getByRole("listbox").parentElement?.scrollTop).toBe(132);
      expect(document.documentElement.scrollTop).toBe(0);
      await user.keyboard("{Home}");
      expect(screen.getByRole("listbox").parentElement?.scrollTop).toBeLessThanOrEqual(0);
    } finally {
      top.mockRestore();
      height.mockRestore();
      viewport.mockRestore();
    }
  });

  it("provides a named listbox and selected state with no automated accessibility violations", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox", { name: "Choose language" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "English" })).toHaveAttribute("aria-selected", "true");
    const result = await axe.run(document.body, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
