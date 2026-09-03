import axe from "axe-core";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { App } from "./app";
import { announcementStorageKey } from "./components/public-ui";
import { i18n, LANGUAGE_STORAGE_KEY } from "./i18n";

async function renderAt(pathname: string) {
  const result = render(
    <MemoryRouter initialEntries={[pathname]}>
      <App />
    </MemoryRouter>,
  );
  await screen.findByRole("main");
  return result;
}

beforeEach(async () => {
  await i18n.changeLanguage("en");
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("public landing routes", () => {
  it("states the audience, outcome, and primary action in the hero", async () => {
    await renderAt("/");

    const main = screen.getByRole("main");
    expect(within(main).getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      within(main).getByRole("heading", {
        name: /Know what’s selling.*See what runs out next.*Bring customers back/i,
      }),
    ).toBeInTheDocument();
    expect(within(main).getByRole("link", { name: "Start free" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(within(main).getByRole("link", { name: "Explore the demo" })).toHaveAttribute(
      "href",
      "/demo",
    );
    expect(screen.getByRole("figure")).toHaveAccessibleDescription(
      /Fictional Mercado Norte dashboard.*€12,480.*18%.*3.*4/i,
    );
  });

  it("dismisses the announcement for the browser session", async () => {
    const user = userEvent.setup();
    const firstRender = await renderAt("/");

    await user.click(screen.getByRole("button", { name: "Dismiss announcement" }));
    expect(screen.queryByText(/Built for the records you already keep/i)).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(announcementStorageKey)).toBe("true");

    firstRender.unmount();
    await renderAt("/");
    expect(screen.queryByText(/Built for the records you already keep/i)).not.toBeInTheDocument();
  });

  it("opens the mobile menu, moves focus, and restores focus on Escape", async () => {
    const user = userEvent.setup();
    await renderAt("/");
    const menuButton = screen.getByRole("button", { name: "Open menu" });

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole(
        "link",
        { name: "Explore the demo" },
      ),
    ).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });

  it("persists language changes and localizes metadata and sample values", async () => {
    const user = userEvent.setup();
    await renderAt("/");

    await user.selectOptions(screen.getByRole("combobox", { name: "Choose language" }), "es");

    await waitFor(() => expect(document.documentElement).toHaveAttribute("lang", "es"));
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("es");
    expect(document.title).toContain("Claridad diaria");
    expect(
      screen.getByRole("heading", { name: /Descubre qué se vende.*Anticipa qué se agotará/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/12\.480\s*€/).length).toBeGreaterThan(0);
  });

  it.each([
    ["/demo", /See the daily view before sharing your data/i],
    ["/signup", /Free account creation is being connected/i],
    ["/login", /Secure account access is being connected/i],
    ["/app", /workspace opens only through real account access/i],
  ])("provides an honest working preview at %s", async (path, heading) => {
    await renderAt(path);

    expect(await screen.findByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it.each(["/", "/demo", "/signup", "/login"])(
    "has no automated accessibility violations at %s",
    async (path) => {
      const { container } = await renderAt(path);
      await screen.findByRole("heading", { level: 1 });

      const results = await axe.run(container, {
        rules: {
          "color-contrast": { enabled: false },
        },
      });
      expect(results.violations).toEqual([]);
    },
  );
});
