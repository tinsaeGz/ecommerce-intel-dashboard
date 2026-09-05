/* global window, document, innerWidth, getComputedStyle, scrollTo, scrollY, requestAnimationFrame */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Use an externally installed Playwright to keep the production dependency graph unchanged.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const evidence = resolve(root, "docs/reviews/cinematic");
const baseURL = process.env.SUQ_REVIEW_URL ?? "http://127.0.0.1:4178";
const results = [];
const browser = await chromium.launch({ headless: true });
await mkdir(evidence, { recursive: true });

async function catalog(locale) {
  return JSON.parse(await readFile(resolve(root, `apps/web/src/locales/${locale}/common.json`), "utf8"));
}
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.evaluate(() => new Promise((resolve, reject) => {
    let previous = scrollY;
    let stable = 0;
    let frames = 0;
    const tick = () => {
      stable = scrollY === previous ? stable + 1 : 0;
      previous = scrollY;
      if (stable >= 4) resolve();
      else if (++frames >= 180) reject(new Error("Scroll did not settle"));
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));
}
async function axeCheck(page, label) {
  await page.addScriptTag({ path: resolve(root, "node_modules/axe-core/axe.min.js") });
  const violations = await page.evaluate(async () => (await window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  })).violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })));
  assert.deepEqual(violations, [], label);
}
async function chapter(page, c, name) {
  await page.getByRole("button", { name: c.cinematic[name].label, exact: true }).click();
  await settle(page);
}
async function openDetails(page, id) {
  if (!await page.locator(id).evaluate(el => el.open)) await page.locator(`${id} > summary`).click();
}
async function noOverflow(page, label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, label);
}

try {
  for (const locale of ["en", "es", "fr"]) {
    const c = await catalog(locale);
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(lang => { if (!localStorage.getItem("suq.preferred-language")) localStorage.setItem("suq.preferred-language", lang); }, locale);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(baseURL);
    await settle(page);
    assert.equal(await page.getByRole("heading", { level: 1 }).evaluate(el => el === document.activeElement), true, "landing route focus");
    await page.locator('[data-enhanced="true"]').waitFor();
    // Pure scroll visits every chapter but cannot confirm or record anything.
    for (const [name, id] of [["day", "daily-decisions"], ["evidence", "how-it-works"], ["sale", "next-sale"]]) {
      await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: "instant" }), id);
      await page.waitForFunction(name => document.querySelector(".cinematic-story").dataset.chapter === name, name);
      assert.equal(await page.locator('.cinematic-pane:not([aria-hidden])').count(), 1);
    }
    await settle(page);
    assert.equal(await page.getByRole("button", { name: c.stories.entry.select, exact: true }).count(), 1, "scroll must not sell");
    await chapter(page, c, "day");
    await page.getByRole("button", { name: c.cinematic.topics.customers, exact: true }).click();
    await page.getByRole("checkbox").uncheck();
    await chapter(page, c, "evidence");
    const role = page.locator("#scene-evidence").getByRole("combobox");
    await role.click();
    await page.getByRole("option", { name: c.understanding.review.roles.customerIdentity, exact: true }).click();
    await page.getByRole("button", { name: c.polish.review.confirm, exact: true }).dblclick();
    await role.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".hero-record").getAttribute("data-confirmed"), "true", "cancelled keyboard choice preserves confirmation");
    await page.keyboard.press("Tab");
    await page.evaluate(() => document.getElementById("next-sale").scrollIntoView({ behavior: "instant" }));
    await settle(page);
    assert.equal(await page.locator(".cinematic-story").getAttribute("data-chapter"), "evidence", "scroll protects keyboard focus");
    await chapter(page, c, "sale");
    await page.getByRole("button", { name: c.stories.entry.select, exact: true }).click();
    await page.getByRole("button", { name: c.stories.entry.cancel, exact: true }).click();
    await page.getByRole("button", { name: c.stories.entry.select, exact: true }).click();
    await page.getByRole("link", { name: c.cinematic.continue, exact: true }).click();
    await page.getByRole("heading", { level: 1, name: c.demo.title }).waitFor();
    await openDetails(page, "#demo-workflow");
    assert.equal(await page.getByRole("button", { name: c.stories.entry.confirm, exact: true }).count(), 1, "pending sale survives navigation");
    const historicalMetrics = await page.locator(".dashboard-preview__metrics").innerText();
    const historicalReading = await page.locator(".dashboard-preview__reading").innerText();
    await page.getByRole("button", { name: c.stories.entry.confirm, exact: true }).dblclick();
    assert.equal(await page.locator(".dashboard-preview__metrics").innerText(), historicalMetrics);
    assert.equal(await page.locator(".dashboard-preview__reading").innerText(), historicalReading);
    assert.match(await page.locator(".dashboard-preview__after-cutoff").textContent(), /11/);
    assert.equal(await page.getByRole("checkbox").isChecked(), false);
    await page.getByRole("button", { name: new RegExp(`^${c.dashboard.metrics.customers} `) }).click();
    assert.equal(await page.getByRole("region", { name: c.dashboard.metrics.customers, exact: true }).getByRole("slider").count(), 0);
    await page.getByRole("button", { name: new RegExp(`^${c.dashboard.metrics.units} `) }).click();
    await page.getByRole("slider").fill("4");
    await page.getByRole("button", { name: /Canvas Tote/ }).click();
    await openDetails(page, "#demo-review");
    assert.equal(await page.locator(".hero-record").getAttribute("data-confirmed"), "true");
    // Source changes invalidate confirmation, while source choice survives another round trip.
    await openDetails(page, "#demo-sources");
    await page.getByRole("tab", { name: /Excel/ }).click();
    assert.equal(await page.locator(".hero-record").getAttribute("data-confirmed"), "false");
    await page.getByRole("link", { name: c.actions.backHome, exact: true }).click();
    await page.locator(".landing-hero").waitFor();
    await page.goBack();
    await page.getByRole("heading", { level: 1, name: c.demo.title }).waitFor();
    assert.equal(await page.getByRole("slider").inputValue(), "4");
    assert.equal(await page.getByRole("button", { name: /Canvas Tote/ }).getAttribute("aria-pressed"), "true");
    await openDetails(page, "#demo-sources");
    assert.equal(await page.getByRole("tab", { name: /Excel/ }).getAttribute("aria-selected"), "true");
    await openDetails(page, "#demo-workflow");
    await page.getByRole("button", { name: c.stories.entry.undo, exact: true }).click();
    assert.match(await page.locator(".dashboard-preview__after-cutoff").textContent(), /12/);
    // Language changes preserve every setting. Refresh then resets memory, not language.
    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Français", exact: true }).click();
    assert.equal(await page.getByRole("slider").inputValue(), "4");
    assert.equal(await page.getByRole("checkbox").isChecked(), false);
    await page.reload();
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(await page.getByRole("slider").inputValue(), "7");
    assert.equal(await page.getByRole("checkbox").isChecked(), true);
    assert.equal(await page.locator("html").getAttribute("lang"), "fr", "a full load preserves language but clears sample state");
    assert.deepEqual(errors, []);
    results.push({ locale, case: "continuity / invalidation / cancel / undo / Back / language / refresh", passed: true });
    await context.close();

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
      await context.addInitScript(lang => { if (!localStorage.getItem("suq.preferred-language")) localStorage.setItem("suq.preferred-language", lang); }, locale);
      const page = await context.newPage();
      await page.goto(baseURL);
      if (config.text) await page.addStyleTag({ content: "html { font-size: 200%; }" });
      await settle(page);
      const enhanced = await page.locator(".cinematic-story").getAttribute("data-enhanced");
      assert.equal(enhanced === "true", config.width >= 1152 && config.height >= 896 && !config.text, `${locale}/${config.name} layout`);
      await noOverflow(page, `${locale}/${config.name} landing overflow`);
      if (config.name === "mobile") {
        const briefing = await page.locator(".daily-briefing__revenue").boundingBox();
        assert(briefing.y < config.height, "mobile first-screen revenue briefing");
      }
      for (const name of ["day", "evidence", "sale"]) {
        await chapter(page, c, name);
        if (enhanced === "true") {
          const pane = await page.locator(`#scene-${name}`).boundingBox();
          assert(pane.y >= 0 && pane.y + pane.height <= config.height, `${locale}/${name} scene fits`);
        }
        await axeCheck(page, `${locale}/${config.name}/${name}`);
        if (locale === "en" && config.name === "desktop" && name === "evidence") {
          await page.screenshot({ path: resolve(evidence, "en-evidence.png") });
        }
      }
      if (config.reducedMotion) {
        assert.equal(await page.locator("#scene-sale").evaluate(el => getComputedStyle(el).transitionDuration), "0s");
        assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior), "auto");
      }
      if ((locale === "en" && config.name === "desktop") || (locale === "es" && config.name === "mobile")) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await settle(page);
        await page.screenshot({ path: resolve(evidence, `${locale}-${config.name}.png`), fullPage: config.name === "mobile" });
      }
      if ((locale === "fr" && config.text) || (locale === "en" && config.forcedColors) || (locale === "es" && config.reducedMotion)) {
        await page.screenshot({ path: resolve(evidence, `${locale}-${config.name}.png`) });
      }
      await page.goto(`${baseURL}/demo#demo-review`);
      if (config.text) await page.addStyleTag({ content: "html { font-size: 200%; }" });
      await settle(page);
      assert.equal(await page.locator("#demo-review > summary").evaluate(el => el === document.activeElement), true);
      await noOverflow(page, `${locale}/${config.name} demo overflow`);
      await axeCheck(page, `${locale}/${config.name}/demo`);
      results.push({ locale, case: config.name, passed: true });
      console.log(`${locale}/${config.name}: layout, chapters, deep-link focus, axe passed`);
      await context.close();
    }
  }
  await writeFile("/tmp/suq-cinematic-results.json", JSON.stringify(results, null, 2));
  console.log(`${results.length} browser cases passed; screenshots: ${evidence}`);
} finally {
  await browser.close();
}
