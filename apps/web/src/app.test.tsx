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
  it.each(["en", "es", "fr"])("explains planned limits and opens every FAQ in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/");
    const plans = screen.getByRole("region", { name: i18n.t("buying.title") });
    const free = within(plans).getByRole("article", { name: i18n.t("buying.free.title") });
    const premium = within(plans).getByRole("article", { name: i18n.t("buying.premium.title") });
    expect(free).toHaveTextContent(/5.*10 M[Bo]/);
    expect(premium).toHaveTextContent(/50.*50 M[Bo]/);
    expect(premium).toHaveTextContent("4");
    expect(free).toHaveTextContent("90");
    expect(within(plans).getByText(i18n.t("buying.availability"))).toBeVisible();
    expect(within(plans).queryByRole("button")).not.toBeInTheDocument();
    for (const question of ["availability", "sources", "review", "missing", "history", "privacy"]) {
      const summary = screen.getByText(i18n.t(`buying.faq.${question}.question`), { selector: "summary" });
      expect(summary.parentElement).not.toHaveAttribute("open");
      await user.click(summary);
      expect(summary.parentElement).toHaveAttribute("open");
      expect(screen.getByText(i18n.t(`buying.faq.${question}.answer`))).toBeVisible();
    }
    const results = await axe.run(screen.getByRole("region", { name: i18n.t("buying.faq.title") }), { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations).toEqual([]);
  });

  it.each(["en", "es", "fr"])("takes mobile and footer navigation to focused landing sections in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/demo");
    await user.click(screen.getByRole("button", { name: i18n.t("navigation.openMenu") }));
    const menu = screen.getByRole("navigation", { name: i18n.t("navigation.mobile") });
    await user.click(within(menu).getByRole("link", { name: i18n.t("buying.nav.plans") }));
    expect(screen.queryByRole("navigation", { name: i18n.t("navigation.mobile") })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: i18n.t("buying.title") })).toHaveFocus();
    const footer = screen.getByRole("navigation", { name: i18n.t("buying.nav.footer") });
    await user.click(within(footer).getByRole("link", { name: i18n.t("buying.nav.faq") }));
    expect(screen.getByRole("region", { name: i18n.t("buying.faq.title") })).toHaveFocus();
    for (const link of within(footer).getAllByRole("link")) {
      expect(link.getAttribute("href")).toMatch(/^\/(demo|#plans|#faq)$/);
    }
  });

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
    await renderAt("/demo");
    await user.click(screen.getByText(i18n.t("stories.entry.explore"), { selector: "summary" }));
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

  it.each(["en", "es", "fr"])("confirms, invalidates and resets the demo review in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/demo");
    await user.click(screen.getByText(i18n.t("hero.reviewAction"), { selector: "summary" }));
    const review = screen.getByRole("region", { name: i18n.t("polish.review.title") });
    const select = within(review).getByRole("combobox");
    await user.click(select);
    await user.click(screen.getByRole("option", { name: i18n.t("understanding.review.roles.customerIdentity") }));
    await user.dblClick(within(review).getByRole("button", { name: i18n.t("polish.review.confirm") }));
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
    expect(within(stock).getAllByRole("status")[0]).toHaveTextContent(i18n.t("polish.dashboard.stockDetail", { count: 4 }));
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

  it.each(["en", "es", "fr"])("carries customer availability and the sale into the demo and resets in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/");
    await user.click(screen.getByRole("button", { name: i18n.t("cinematic.topics.customers") }));
    await user.click(screen.getByRole("checkbox", { name: i18n.t("stories.customers.toggle") }));
    await user.click(screen.getByRole("button", { name: i18n.t("stories.entry.select") }));
    await user.click(screen.getByRole("button", { name: i18n.t("stories.entry.confirm") }));
    const hero = screen.getByRole("region", { name: new RegExp(i18n.t("hero.titleBefore")) });
    expect(within(hero).getByText(i18n.t("stories.customers.unavailable"))).toBeVisible();
    await user.click(within(hero).getAllByRole("link", { name: i18n.t("actions.exploreDemo") })[0]);
    await screen.findByRole("heading", { name: i18n.t("demo.title") });
    const metrics = screen.getByRole("group", { name: i18n.t("polish.dashboard.metricLabel") });
    await user.click(within(metrics).getByRole("button", { name: new RegExp(`^${i18n.t("dashboard.metrics.customers")} `) }));
    const chart = screen.getByRole("region", { name: i18n.t("dashboard.metrics.customers") });
    expect(within(chart).getByRole("status")).toHaveTextContent(i18n.t("stories.customers.missing"));
    expect(within(chart).queryByRole("slider")).not.toBeInTheDocument();
    await user.click(screen.getByText(i18n.t("stories.demo.workflow"), { selector: "summary" }));
    const entry = screen.getByRole("group", { name: i18n.t("stories.entry.try") });
    expect(within(entry).getByRole("status")).toHaveTextContent(i18n.t("stories.entry.stock", { count: 11 }));
    await user.click(screen.getByRole("button", { name: i18n.t("cinematic.reset") }));
    expect(within(entry).getByRole("status")).toHaveTextContent(i18n.t("stories.entry.stock", { count: 12 }));
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(within(metrics).getByRole("button", { pressed: true })).toHaveTextContent(i18n.t("dashboard.metrics.revenue"));
  });

  it.each(["en", "es", "fr"])("shows three connected chapters with one review and compact business questions in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/");
    for (const chapter of ["day", "evidence", "sale"]) {
      expect(screen.getByRole("heading", { name: `${i18n.t(`theatre.${chapter}.title`)} ${i18n.t(`theatre.${chapter}.emphasis`)}` })).toBeInTheDocument();
    }
    for (const kind of ["sales", "stock", "customers"]) {
      await user.click(screen.getByRole("button", { name: i18n.t(`cinematic.topics.${kind}`) }));
      expect(screen.getByRole("heading", { name: i18n.t(`stories.${kind}.title`) })).toBeVisible();
    }
    expect(screen.getAllByRole("region", { name: i18n.t("polish.review.title") })).toHaveLength(1);
    expect(screen.getByText(i18n.t("cinematic.reviewScope"))).toBeVisible();
    expect(screen.getByText(i18n.t("cinematic.historicalScope"))).toBeVisible();
  });

  it.each(["en", "es", "fr"])("previews, cancels, confirms and undoes a sale with keyboard focus in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/");
    const entry = screen.getByRole("group", { name: i18n.t("stories.entry.try") });
    const stock = within(entry).getByRole("status");
    const movement = screen.getByRole("group", { name: i18n.t("theatre.balance") });
    expect(within(movement).getByText(i18n.t("theatre.noMovement"))).toBeVisible();
    expect(stock).toHaveTextContent(i18n.t("stories.entry.stock", { count: 12 }));
    await user.click(within(entry).getByRole("button", { name: i18n.t("stories.entry.select") }));
    expect(within(entry).getByRole("button", { name: i18n.t("stories.entry.confirm") })).toHaveFocus();
    expect(stock).toHaveTextContent(i18n.t("stories.entry.stock", { count: 12 }));
    expect(within(movement).getByText(i18n.t("theatre.draftMovement"))).toBeVisible();
    expect(movement.querySelector(".scene-inventory__balance strong")).toHaveTextContent("12");
    await user.click(within(entry).getByRole("button", { name: i18n.t("stories.entry.cancel") }));
    const select = within(entry).getByRole("button", { name: i18n.t("stories.entry.select") });
    expect(select).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard("{Enter}");
    expect(stock).toHaveTextContent(i18n.t("stories.entry.stock", { count: 11 }));
    expect(within(movement).getByText(i18n.t("theatre.confirmedMovement"))).toBeVisible();
    expect(movement.querySelector(".scene-inventory__balance strong")).toHaveTextContent("11");
    const undo = within(entry).getByRole("button", { name: i18n.t("stories.entry.undo") });
    expect(undo).toHaveFocus();
    expect(within(entry).queryByRole("button", { name: i18n.t("stories.entry.confirm") })).not.toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(stock).toHaveTextContent(i18n.t("stories.entry.stock", { count: 12 }));
    expect(within(entry).getByRole("button", { name: i18n.t("stories.entry.select") })).toHaveFocus();
  });

  it("applies one sale after a double click and does not turn the second click into undo", async () => {
    const user = userEvent.setup();
    await renderAt("/");
    await user.click(screen.getByRole("button", { name: i18n.t("stories.entry.select") }));
    await user.dblClick(screen.getByRole("button", { name: i18n.t("stories.entry.confirm") }));
    const entry = screen.getByRole("group", { name: i18n.t("stories.entry.try") });
    expect(within(entry).getByRole("status")).toHaveTextContent(i18n.t("stories.entry.stock", { count: 11 }));
    await user.dblClick(within(entry).getByRole("button", { name: i18n.t("stories.entry.undo") }));
    expect(within(entry).getByRole("status")).toHaveTextContent(i18n.t("stories.entry.stock", { count: 12 }));
    expect(within(entry).getByRole("button", { name: i18n.t("stories.entry.select") })).toBeVisible();
  });

  it.each(["en", "es", "fr"])("explains the source math and missing customer identity in %s", async (locale) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(locale);
    await renderAt("/");
    await user.click(screen.getByText(i18n.t("stories.sales.evidence"), { selector: "summary" }));
    expect(screen.getByRole("table", { name: i18n.t("stories.sales.caption") })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: i18n.t("cinematic.topics.stock") }));
    await user.click(screen.getByText(i18n.t("stories.stock.evidence"), { selector: "summary" }));
    expect(screen.getByText(i18n.t("stories.stock.prerequisite"))).toBeVisible();
    await user.click(screen.getByRole("button", { name: i18n.t("cinematic.topics.customers") }));
    const customers = screen.getByRole("article", { name: i18n.t("stories.customers.title") });
    const status = within(customers).getByRole("status");
    expect(status).toHaveTextContent("38");
    const toggle = within(customers).getByRole("checkbox", { name: i18n.t("stories.customers.toggle") });
    await user.click(toggle);
    expect(status).toHaveTextContent(i18n.t("stories.customers.unavailable"));
    expect(status).not.toHaveTextContent("38");
    expect(status).not.toHaveTextContent(/\b0\b/);
    await user.keyboard(" ");
    expect(status).toHaveTextContent("38");
  });

  it.each(["#demo-review", "#demo-sources"])("opens and focuses a linked demo destination at %s", async (hash) => {
    const user = userEvent.setup();
    await renderAt("/");
    const action = hash === "#demo-review" ? "hero.reviewAction" : "stories.entry.explore";
    await user.click(screen.getByRole("link", { name: i18n.t(action) }));
    await screen.findByRole("heading", { level: 1, name: i18n.t("demo.title") });
    const summary = screen.getByText(i18n.t(action), { selector: "summary" });
    await waitFor(() => expect(summary.closest("details")).toHaveAttribute("open"));
    expect(summary).toHaveFocus();
    await user.click(screen.getByRole("link", { name: i18n.t("actions.backHome") }));
    await screen.findByRole("heading", { name: `${i18n.t("theatre.title")} ${i18n.t("theatre.emphasis")}` });
  });

  it.each(["#demo-review", "#demo-sources", "#demo-workflow"])("focuses a direct demo chapter at %s", async (hash) => {
    await renderAt(`/demo${hash}`);
    const target = document.querySelector(hash) as HTMLDetailsElement;
    await waitFor(() => expect(target).toHaveAttribute("open"));
    expect(target.querySelector("summary")).toHaveFocus();
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
