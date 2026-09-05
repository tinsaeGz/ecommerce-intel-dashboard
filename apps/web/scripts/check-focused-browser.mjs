/* global window, document, getComputedStyle */
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const baseURL = process.env.SUQ_REVIEW_URL ?? "http://127.0.0.1:4178";
const browser = await chromium.launch({ headless: true });
const results = [];
const catalog = async lang => JSON.parse(await readFile(resolve(root, `apps/web/src/locales/${lang}/common.json`), "utf8"));
async function enter(page, c) {
  await page.getByRole("button", { name: c.theatre.enter, exact: true }).click();
  const dialog = page.locator(".cinematic-dialog");
  assert(await dialog.evaluate(el => el.matches(":modal")), "native modal isolates the page");
  await page.waitForTimeout(250);
  return dialog;
}
async function axe(page, label) {
  await page.addScriptTag({ path: resolve(root, "node_modules/axe-core/axe.min.js") });
  const violations = await page.evaluate(async () => (await window.axe.run(document.querySelector("dialog"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
  assert.deepEqual(violations, [], label);
}
try {
  for (const locale of ["en", "es", "fr"]) {
    const c = await catalog(locale);
    for (const config of [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile", width: 390, height: 844 },
      { name: "narrow", width: 320, height: 740 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "short", width: 1440, height: 600 },
      { name: "text-200", width: 1440, height: 1000, text: true },
      { name: "forced-colors", width: 1440, height: 1000, forcedColors: "active" },
      { name: "reduced-motion", width: 1440, height: 1000, reducedMotion: "reduce" },
    ]) {
      const context = await browser.newContext({ viewport: { width: config.width, height: config.height }, forcedColors: config.forcedColors, reducedMotion: config.reducedMotion });
      await context.addInitScript(lang => localStorage.setItem("suq.preferred-language", lang), locale);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(baseURL);
      if (config.text) await page.addStyleTag({ content: "html { font-size: 200%; }" });
      const dialog = await enter(page, c);
      for (const chapter of ["day", "evidence", "sale"]) {
        await dialog.getByRole("button", { name: c.cinematic[chapter].label, exact: true }).click();
        await page.waitForTimeout(250);
        assert.equal(await dialog.locator('.cinematic-pane:not([aria-hidden])').count(), 1);
        assert.equal(await dialog.evaluate(el => el.scrollWidth > el.clientWidth), false, `${locale}/${config.name}/${chapter} overflow`);
        assert.equal(await page.locator(".hero-record").count(), 1, "single review instance");
        assert.equal(await page.locator(".desktop-monitor__stand").count(), 0);
        const languageContrast = await dialog.locator(".cinematic-view-control .dropdown-select__trigger").evaluate(el => ({
          ink: getComputedStyle(el).color,
          ground: getComputedStyle(el.closest(".cinematic-story")).backgroundColor,
        }));
        assert.notEqual(languageContrast.ink, languageContrast.ground, "language control stays visible on every scene ground");
        const exit = await dialog.getByRole("button", { name: c.theatre.exit, exact: true }).boundingBox();
        assert(exit.y >= 0 && exit.y + exit.height <= config.height, "exit stays reachable");
        await axe(page, `${locale}/${config.name}/${chapter}`);
        if (locale === "en" && config.name === "desktop") await page.screenshot({ path: resolve(root, `docs/reviews/cinematic/focused-${chapter}.png`) });
        if (locale === "es" && config.name === "mobile" && chapter === "evidence") await page.screenshot({ path: resolve(root, "docs/reviews/cinematic/focused-mobile.png") });
      }
      if (config.reducedMotion) assert.equal(await dialog.locator("#scene-sale").evaluate(el => getComputedStyle(el).transitionDuration), "0s");
      await dialog.getByRole("button", { name: c.theatre.exit, exact: true }).click();
      assert.equal(await page.getByRole("button", { name: c.theatre.enter, exact: true }).evaluate(el => el === document.activeElement), true);
      assert.equal(await page.locator("html").evaluate(el => el.classList.contains("cinematic-focus-open")), false);
      assert.deepEqual(errors, []);
      results.push({ locale, case: config.name, passed: true });
      console.log(`${locale}/${config.name}: focused scenes and axe passed`);
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(lang => { if (!localStorage.getItem("suq.preferred-language")) localStorage.setItem("suq.preferred-language", lang); }, locale);
    const page = await context.newPage();
    await page.goto(baseURL);
    await page.getByRole("button", { name: c.cinematic.day.label, exact: true }).click();
    await page.getByRole("button", { name: c.cinematic.topics.customers, exact: true }).click();
    await page.getByRole("checkbox").uncheck();
    let dialog = await enter(page, c);
    assert.equal(await dialog.getByRole("checkbox").isChecked(), false);
    await dialog.getByRole("button", { name: c.theatre.followEvidence, exact: true }).click();
    const role = dialog.locator("#scene-evidence").getByRole("combobox");
    await role.click();
    assert.equal(await dialog.getByRole("listbox").count(), 1, "popup stays in modal layer");
    await page.keyboard.press("Escape");
    assert(await dialog.evaluate(el => el.open), "first Escape closes only dropdown");
    await role.click();
    await dialog.getByRole("option", { name: c.understanding.review.roles.customerIdentity, exact: true }).click();
    await dialog.getByRole("button", { name: c.polish.review.confirm, exact: true }).click();
    await dialog.getByRole("combobox").first().click();
    await dialog.getByRole("option", { name: "Français", exact: true }).click();
    const fr = await catalog("fr");
    assert.equal(await dialog.locator(".hero-record").getAttribute("data-confirmed"), "true");
    await dialog.getByRole("button", { name: fr.theatre.trySale, exact: true }).click();
    await dialog.getByRole("button", { name: fr.stories.entry.select, exact: true }).click();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("button", { name: fr.theatre.enter, exact: true }).evaluate(el => el === document.activeElement), true);
    dialog = await enter(page, fr);
    assert.equal(await dialog.getByRole("button", { name: fr.stories.entry.confirm, exact: true }).count(), 1);
    await dialog.getByRole("button", { name: fr.stories.entry.confirm, exact: true }).dblclick();
    assert.match(await dialog.locator(".scene-inventory__balance").textContent(), /11/);
    await dialog.getByRole("button", { name: fr.theatre.exit, exact: true }).focus();
    await page.keyboard.press("Shift+Tab");
    assert(await dialog.evaluate(el => el.contains(document.activeElement)), "Tab stays in dialog");
    await dialog.getByRole("link", { name: fr.cinematic.continue, exact: true }).click();
    await page.getByRole("heading", { name: fr.demo.title, exact: true }).waitFor();
    assert.equal(await page.locator("html").evaluate(el => el.classList.contains("cinematic-focus-open")), false, "route navigation releases scroll lock");
    assert.match(await page.locator(".dashboard-preview__after-cutoff").textContent(), /11/);
    assert.equal(await page.getByRole("checkbox").isChecked(), false);
    await page.goBack();
    await page.locator(".landing-hero").waitFor();
    dialog = await enter(page, fr);
    await dialog.getByRole("button", { name: fr.cinematic.sale.label, exact: true }).click();
    await dialog.getByRole("button", { name: fr.stories.entry.undo, exact: true }).click();
    assert.match(await dialog.locator(".scene-inventory__balance").textContent(), /12/);
    await dialog.getByRole("button", { name: fr.cinematic.reset, exact: true }).click();
    await page.keyboard.press("Escape");
    assert.equal(await dialog.evaluate(el => el.open), false);
    results.push({ locale, case: "focus continuity / language / Escape / Back / undo", passed: true });
    await context.close();
  }
  await writeFile("/tmp/suq-focused-results.json", JSON.stringify(results, null, 2));
  console.log(`${results.length} focused browser cases passed`);
} finally { await browser.close(); }
