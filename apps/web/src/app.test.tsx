import axe from "axe-core";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { App } from "./app";
import { localJourneySink } from "./lib/journey-events";
import { i18n, LANGUAGE_STORAGE_KEY } from "./i18n";

async function renderAt(pathname: string) {
  const result = render(
    <MemoryRouter initialEntries={[pathname]}>
      <App />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { level: 1 });
  return result;
}

beforeEach(async () => {
  await i18n.changeLanguage("en");
  window.localStorage.clear();
  window.sessionStorage.clear();
  localJourneySink.clear();
});

describe("public landing routes", () => {
  it("states the audience, outcome, and primary action in the hero", async () => {
    await renderAt("/");

    const main = screen.getByRole("main");
    expect(within(main).getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      within(main).getByRole("heading", {
        name: /Know what’s selling.*See what runs out next.*See who comes back/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Start free" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    for (const link of within(main).getAllByRole("link", { name: "Explore the demo" })) {
      expect(link).toHaveAttribute("href", "/demo");
    }
    const hero = screen.getByRole("region", { name: /Know what’s selling/ });
    expect(within(hero).getByText("€12,480")).toBeInTheDocument();
    expect(within(hero).queryByRole("combobox")).not.toBeInTheDocument();
    expect(within(hero).queryByRole("slider")).not.toBeInTheDocument();
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

    await user.click(screen.getByRole("combobox", { name: "Choose language" }));
    await user.click(screen.getByRole("option", { name: "Español" }));

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

    await user.click(within(reviewPanel).getByRole("combobox", { name: "Use this field as" }));
    await user.click(screen.getByRole("option", { name: "Customer identity" }));
    expect(within(reviewPanel).getByRole("status")).toHaveTextContent(
      /Customer identity.*Nothing is committed yet/i,
    );
  });

  it.each(["en", "es", "fr"])("confirms, invalidates and resets the demo review in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/demo");
    await user.click(screen.getByText(i18n.t("hero.reviewAction"), { selector: "summary" }));
    const review = screen.getByRole("region", { name: i18n.t("polish.review.title") });
    const select = within(review).getByRole("combobox");
    await user.click(select);
    await user.click(screen.getByRole("option", { name: i18n.t("understanding.review.roles.customerIdentity") }));
    await user.click(within(review).getByRole("button", { name: i18n.t("polish.review.confirm") }));
    expect(within(review).getByRole("status")).toHaveTextContent(i18n.t("polish.review.result", { role: i18n.t("understanding.review.roles.customerIdentity") }));
    await user.click(select);
    await user.keyboard("{Enter}");
    expect(within(review).getByRole("status")).toHaveTextContent(i18n.t("polish.review.confirmed"));
    await user.click(select);
    await user.click(screen.getByRole("option", { name: i18n.t("understanding.review.roles.notAnalyzed") }));
    expect(within(review).getByRole("status")).toHaveTextContent(i18n.t("polish.review.pending"));
    await user.click(within(review).getByRole("button", { name: i18n.t("polish.review.confirm") }));
    await user.click(within(review).getByRole("button", { name: i18n.t("polish.review.reset") }));
    expect(select).toHaveTextContent(i18n.t("understanding.review.roles.itemIdentity"));
    expect(within(review).getByRole("status")).toHaveTextContent(i18n.t("polish.review.pending"));
    expect(within(review).getByRole("table")).toHaveTextContent("48,00 €");
  });

  it.each(["en", "es", "fr"])("keeps metric, chart, table and stock selections consistent in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/demo");
    const metrics = screen.getByRole("group", { name: i18n.t("polish.dashboard.metricLabel") });
    const units = within(metrics).getByRole("button", { name: new RegExp(`^${i18n.t("dashboard.metrics.units")} `) });
    await user.click(units);
    expect(units).toHaveAttribute("aria-pressed", "true");
    expect(within(metrics).getAllByRole("button", { pressed: true })).toHaveLength(1);
    const chart = screen.getByRole("region", { name: i18n.t("dashboard.metrics.units") });
    const slider = within(chart).getByRole("slider");
    expect(within(chart).getByRole("status")).toHaveTextContent("468");
    fireEvent.change(slider, { target: { value: "0" } });
    expect(within(chart).getByRole("status")).toHaveTextContent(/^0/);
    fireEvent.change(slider, { target: { value: "4" } });
    expect(within(chart).getByRole("status")).toHaveTextContent(/^252/);
    expect(slider).toHaveAttribute("aria-valuetext", expect.stringContaining("252"));
    await user.click(within(chart).getByText(i18n.t("polish.dashboard.viewData")));
    const table = within(chart).getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(9);
    expect(within(table).getAllByRole("row").at(-1)).toHaveTextContent("468");
    const stock = screen.getByRole("region", { name: i18n.t("dashboard.stock.eyebrow") });
    await user.click(within(stock).getByRole("button", { name: /Canvas Tote/ }));
    expect(within(stock).getByRole("status")).toHaveTextContent(i18n.t("polish.dashboard.stockDetail", { count: 4 }));
  });

  it.each(["en", "es", "fr"])("takes a merchant from the hero to the demo and source review in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/");
    const hero = screen.getByRole("region", { name: new RegExp(i18n.t("hero.titleBefore")) });
    const action = within(hero).getAllByRole("link", { name: i18n.t("actions.exploreDemo") })[0];
    await user.click(action);
    await screen.findByRole("heading", { level: 1, name: i18n.t("demo.title") });
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: i18n.t("actions.previewSignup") })).not.toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: i18n.t("hero.reviewAction") }));
    const summary = screen.getByText(i18n.t("hero.reviewAction"), { selector: "summary" });
    expect(summary).toHaveFocus();
    expect(summary.closest("details")).toHaveAttribute("open");
    await waitFor(() => expect(localJourneySink.snapshot().map(event => event.name)).toEqual([
      "landing_cta_selected", "demo_started", "model_review_opened",
    ]));
    expect(localJourneySink.snapshot().every(event => event.properties.locale === locale)).toBe(true);
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

  it.each(["en", "es", "fr"].flatMap(locale => ["/", "/demo", "/signup", "/login"].map(path => [locale, path])))(
    "has no automated accessibility violations in %s at %s",
    async (locale, path) => {
      await i18n.changeLanguage(locale);
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
