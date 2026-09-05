import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "../components/public-ui";
import { getSupportedLanguage } from "../i18n";
import { emitJourneyEvent } from "../lib/journey-events";
import { landingDemo } from "../lib/demo-data";
import { formatDemoDate, formatNumber, formatPercent } from "../lib/format";
import { coffeeStock, customerHistory, returningCount, salesComparison, sampleStock } from "../lib/merchant-story-data";
import "./merchant-decisions.css";

export function MerchantDecisions() {
  const { t, i18n } = useTranslation();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);
  const [hasIdentity, setHasIdentity] = useState(true);
  const money = (cents: number) => new Intl.NumberFormat(locale, { style: "currency", currency: landingDemo.currency }).format(cents / 100);
  const increase = salesComparison.reduce((sum, row) => sum + row.currentCents - row.previousCents, 0);

  return (
    <section className="merchant-decisions" id="daily-decisions" tabIndex={-1} aria-labelledby="decisions-title">
      <header className="story-heading">
        <p className="story-eyebrow">{t("stories.eyebrow")}</p>
        <h2 id="decisions-title">{t("stories.title")}</h2>
        <p>{t("stories.sample", { date: formatDemoDate(landingDemo.date, locale, landingDemo.timeZone) })}</p>
      </header>

      <article className="decision-row" aria-labelledby="sales-title">
        <div className="decision-row__copy">
          <p className="story-eyebrow">{t("stories.sales.question")}</p>
          <h3 id="sales-title">{t("stories.sales.title")}</h3>
          <p>{t("stories.sales.body")}</p>
        </div>
        <div className="decision-proof">
          <p>{t("stories.sales.change")}</p>
          <strong className="decision-proof__value">+{money(increase)}</strong>
          <p>{t("hero.comparison", { comparison: formatPercent(landingDemo.comparisonPercent, locale) })}</p>
          <details>
            <summary>{t("stories.sales.evidence")}</summary>
            <div className="decision-proof__table">
              <table>
                <caption>{t("stories.sales.caption")}</caption>
                <thead><tr><th scope="col">{t("stories.product")}</th><th scope="col">{t("stories.sales.before")}</th><th scope="col">{t("stories.sales.now")}</th></tr></thead>
                <tbody>{salesComparison.map(row => <tr key={row.product}><th scope="row">{t(`stories.products.${row.product}`)}</th><td>{money(row.previousCents)}</td><td>{money(row.currentCents)}</td></tr>)}</tbody>
                <tfoot><tr><th scope="row">{t("stories.sales.total")}</th><td>{money(salesComparison.reduce((sum, row) => sum + row.previousCents, 0))}</td><td>{money(landingDemo.revenue * 100)}</td></tr></tfoot>
              </table>
            </div>
            <p>{t("stories.sales.source", { count: landingDemo.transactions })}</p>
          </details>
        </div>
      </article>

      <article className="decision-row" aria-labelledby="stock-title">
        <div className="decision-row__copy">
          <p className="story-eyebrow">{t("stories.stock.question")}</p>
          <h3 id="stock-title">{t("stories.stock.title")}</h3>
          <p>{t("stories.stock.body")}</p>
        </div>
        <div className="decision-proof">
          <p>{t("stories.products.coffee")}</p>
          <strong className="decision-proof__value">{t("stories.stock.remaining", { count: sampleStock })}</strong>
          <p>{t("stories.stock.estimate", { days: sampleStock / coffeeStock.dailyPace, pace: coffeeStock.dailyPace })}</p>
          <details>
            <summary>{t("stories.stock.evidence")}</summary>
            <dl className="stock-equation">
              <div><dt>{t("stories.stock.observed")}</dt><dd>{coffeeStock.observed}</dd></div>
              <div><dt>{t("stories.stock.delivered")}</dt><dd>+{coffeeStock.deliveries}</dd></div>
              <div><dt>{t("stories.stock.sold")}</dt><dd>−{coffeeStock.sold}</dd></div>
            </dl>
            <p>{t("stories.stock.prerequisite")}</p>
          </details>
        </div>
      </article>

      <article className="decision-row" aria-labelledby="customers-title">
        <div className="decision-row__copy">
          <p className="story-eyebrow">{t("stories.customers.question")}</p>
          <h3 id="customers-title">{t("stories.customers.title")}</h3>
          <p>{t("stories.customers.body")}</p>
        </div>
        <div className="decision-proof">
          <label className="story-toggle"><input type="checkbox" checked={hasIdentity} onChange={event => setHasIdentity(event.target.checked)} />{t("stories.customers.toggle")}</label>
          <div role="status">
            {hasIdentity ? <>
              <strong className="decision-proof__value">{formatNumber(returningCount, locale)}</strong>
              <p>{t("stories.customers.result", { total: customerHistory.today.length, first: customerHistory.today.length - returningCount })}</p>
            </> : <>
              <strong className="decision-proof__unavailable">{t("stories.customers.unavailable")}</strong>
              <p>{t("stories.customers.missing")}</p>
            </>}
          </div>
          <details>
            <summary>{t("stories.customers.evidence")}</summary>
            <p>{t("stories.customers.source", { total: customerHistory.today.length, returning: returningCount })}</p>
          </details>
        </div>
      </article>
    </section>
  );
}

export function RecordToDecision() {
  const { t } = useTranslation();
  const [entry, setEntry] = useState<"idle" | "review" | "recorded">("idle");
  const stock = entry === "recorded" ? sampleStock - 1 : sampleStock;
  const actionRef = useRef<HTMLButtonElement>(null);
  const previousEntry = useRef(entry);
  useEffect(() => {
    if (previousEntry.current !== entry) actionRef.current?.focus({ preventScroll: true });
    previousEntry.current = entry;
  }, [entry]);
  return (
    <section className="record-journey" id="how-it-works" tabIndex={-1} aria-labelledby="record-journey-title">
      <header className="story-heading">
        <p className="story-eyebrow">{t("understanding.how.eyebrow")}</p>
        <h2 id="record-journey-title">{t("stories.entry.title")}</h2>
        <p>{t("stories.entry.body")}</p>
      </header>
      <ol className="record-journey__steps">
        {(["add", "confirm", "see"] as const).map(step => <li key={step}><h3>{t(`understanding.how.steps.${step}.title`)}</h3><p>{t(`stories.entry.steps.${step}`)}</p></li>)}
      </ol>
      <div className="entry-preview" role="group" aria-labelledby="entry-preview-title">
        <div>
          <p className="story-eyebrow">{t("stories.entry.sample")}</p>
          <h3 id="entry-preview-title">{t("stories.entry.try")}</h3>
          <p>{t("stories.entry.context")}</p>
        </div>
        <div className="entry-preview__controls">
          <p className="entry-preview__stock" role="status">{t("stories.entry.stock", { count: stock })}</p>
          {entry === "review" ? <>
            <p>{t("stories.entry.review", { before: sampleStock, after: sampleStock - 1 })}</p>
            <button ref={actionRef} className="button-link" data-variant="primary" type="button" onClick={() => { setEntry("recorded"); }}>{t("stories.entry.confirm")}</button>
            <button className="button-link" data-variant="quiet" type="button" onClick={() => setEntry("idle")}>{t("stories.entry.cancel")}</button>
          </> : entry === "recorded" ? <>
            <p>{t("stories.entry.result")}</p>
            <button ref={actionRef} className="button-link" data-variant="secondary" type="button" onClick={() => { setEntry("idle"); }}>{t("stories.entry.undo")}</button>
          </> : <button ref={actionRef} className="button-link" data-variant="primary" type="button" onClick={() => setEntry("review")}>{t("stories.entry.select")}</button>}
        </div>
      </div>
      <p className="record-journey__formats">{t("stories.entry.formats")}</p>
      <ButtonLink to="/demo#demo-sources" variant="quiet" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "sources" })}>{t("stories.entry.explore")}</ButtonLink>
    </section>
  );
}

export function TrustStory() {
  const { t } = useTranslation();
  return (
    <section className="trust-story" id="trust" aria-labelledby="trust-story-title">
      <div className="story-heading">
        <p className="story-eyebrow">{t("stories.trust.eyebrow")}</p>
        <h2 id="trust-story-title">{t("stories.trust.title")}</h2>
        <p>{t("stories.trust.body")}</p>
        <ButtonLink to="/demo#demo-review" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "trust" })}>{t("hero.reviewAction")}</ButtonLink>
      </div>
      <div className="trust-story__example">
        <h3>{t("stories.trust.question")}</h3>
        <p className="trust-story__values">CT-204 · GC-118</p>
        <p>{t("stories.trust.evidence")}</p>
        <p>{t("stories.trust.missing")}</p>
      </div>
    </section>
  );
}
