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

  it("lets keyboard users compare supported sources", async () => {
    const user = userEvent.setup();
    await renderAt("/");
    const sourceTabs = screen.getByRole("tablist", {
      name: "Supported source examples",
    });
    expect(within(sourceTabs).getAllByRole("tab")).toHaveLength(10);
    const csvTab = within(sourceTabs).getByRole("tab", { name: /CSV/i });

    expect(csvTab).toHaveAttribute("aria-selected", "true");
    csvTab.focus();
    await user.keyboard("{ArrowRight}");

    const excelTab = within(sourceTabs).getByRole("tab", { name: /Excel/i });
    expect(excelTab).toHaveFocus();
    expect(excelTab).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tabpanel", { name: /Excel/i }),
    ).toHaveTextContent(/workbook whose first useful row/i);
  });

  it("shows evidence and updates an interpretation before commitment", async () => {
    const user = userEvent.setup();
    await renderAt("/");
    const workflowTabs = screen.getByRole("tablist", {
      name: "How Suq turns records into answers",
    });
    const confirmTab = within(workflowTabs).getByRole("tab", {
      name: /Confirm what it means/i,
    });

    expect(confirmTab).toHaveAttribute("aria-selected", "true");
    const reviewPanel = screen.getByRole("tabpanel", {
      name: /Confirm what it means/i,
    });
    expect(
      within(reviewPanel).getByRole("group", {
        name: "Interpretation evidence",
      }),
    ).toHaveTextContent(/abbreviated header is ambiguous/i);

    await user.selectOptions(
      within(reviewPanel).getByRole("combobox", { name: "Use this field as" }),
      "customerIdentity",
    );
    expect(within(reviewPanel).getByRole("status")).toHaveTextContent(
      /Customer identity.*Nothing is committed yet/i,
    );
  });

  it("explains unsupported analysis instead of presenting a false zero", async () => {
    const user = userEvent.setup();
    await renderAt("/");
    const workflowTabs = screen.getByRole("tablist", {
      name: "How Suq turns records into answers",
    });
    const confirmTab = within(workflowTabs).getByRole("tab", {
      name: /Confirm what it means/i,
    });

    confirmTab.focus();
    await user.keyboard("{ArrowRight}");

    const seeTab = within(workflowTabs).getByRole("tab", {
      name: /See what matters/i,
    });
    expect(seeTab).toHaveFocus();
    expect(seeTab).toHaveAttribute("aria-selected", "true");
    const answersPanel = screen.getByRole("tabpanel", {
      name: /See what matters/i,
    });
    expect(answersPanel).toHaveTextContent(/Margin is unavailable/i);
    expect(answersPanel).toHaveTextContent(/No confirmed cost field was found/i);
    expect(answersPanel).not.toHaveTextContent(/Margin[^.]*0/);
  });

  it.each([
    ["en", "Start where your records are.", "From messy records to a useful morning view."],
    ["es", "Empieza donde están tus registros.", "De registros desordenados a una vista útil cada mañana."],
    ["fr", "Commencez là où se trouvent vos données.", "Des données imparfaites à une vue matinale utile."],
  ])("renders the product-understanding sequence in %s", async (locale, sourcesTitle, howTitle) => {
    await i18n.changeLanguage(locale);
    await renderAt("/");

    expect(screen.getByRole("heading", { name: sourcesTitle })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: howTitle })).toBeInTheDocument();
    expect(
      within(screen.getByRole("tablist", { name: /source|fuentes/i })).getAllByRole("tab"),
    ).toHaveLength(10);
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
