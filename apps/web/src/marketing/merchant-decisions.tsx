import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { getSupportedLanguage } from "../i18n";
import { landingDemo } from "../lib/demo-data";
import { formatNumber, formatPercent } from "../lib/format";
import { coffeeStock, customerHistory, returningCount, salesComparison, sampleStock } from "../lib/merchant-story-data";
import { useSampleScenario, type ScenarioAction } from "../lib/sample-scenario";
import "./merchant-decisions.css";

export type DecisionKind = "sales" | "stock" | "customers";

export function DecisionExample({ kind, compact = false }: { kind: DecisionKind; compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);
  const { state: { hasIdentity }, dispatch } = useSampleScenario();
  const money = (cents: number) => new Intl.NumberFormat(locale, { style: "currency", currency: landingDemo.currency }).format(cents / 100);
  const increase = salesComparison.reduce((sum, row) => sum + row.currentCents - row.previousCents, 0);

  return <>
{kind === "sales" && (<article className="decision-row" data-compact={compact} aria-labelledby="sales-title">
        <div className={compact ? "visually-hidden" : "decision-row__copy"}>
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
      </article>)}
{kind === "stock" && (<article className="decision-row" data-compact={compact} aria-labelledby="stock-title">
        <div className={compact ? "visually-hidden" : "decision-row__copy"}>
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
      </article>)}
{kind === "customers" && (<article className="decision-row" data-compact={compact} aria-labelledby="customers-title">
        <div className={compact ? "visually-hidden" : "decision-row__copy"}>
          <p className="story-eyebrow">{t("stories.customers.question")}</p>
          <h3 id="customers-title">{t("stories.customers.title")}</h3>
          <p>{t("stories.customers.body")}</p>
        </div>
        <div className="decision-proof">
          <label className="story-toggle"><input type="checkbox" checked={hasIdentity} onChange={event => dispatch({ type: "identity", value: event.target.checked })} />{t("stories.customers.toggle")}</label>
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
            <p>{hasIdentity ? t("stories.customers.source", { total: customerHistory.today.length, returning: returningCount }) : t("stories.customers.missing")}</p>
          </details>
        </div>
      </article>)}
  </>;
}
export function SampleSale() {
  const { t } = useTranslation();
  const { state: { sale: entry }, dispatch } = useSampleScenario();
  const stock = entry === "recorded" ? sampleStock - 1 : sampleStock;
  const actionRef = useRef<HTMLButtonElement>(null);
  const focusRequested = useRef(false);
  const act = (event: { detail: number }, action: ScenarioAction) => {
    if (event.detail > 1) return;
    focusRequested.current = true;
    dispatch(action);
  };
  useEffect(() => {
    if (focusRequested.current) actionRef.current?.focus({ preventScroll: true });
    focusRequested.current = false;
  }, [entry]);
  return (
      <div className="entry-preview" role="group" aria-labelledby="entry-preview-title">
        <div>
          <p className="story-eyebrow">{t("stories.entry.sample")}</p>
          <h3 id="entry-preview-title">{t("stories.entry.try")}</h3>
          <p>{t("stories.entry.context")}</p>
        </div>
        <div className="entry-preview__controls" onKeyDown={event => { if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault(); }}>
          <p className="entry-preview__stock" role="status">{t("stories.entry.stock", { count: stock })}</p>
          {entry === "review" ? <>
            <p>{t("stories.entry.review", { before: sampleStock, after: sampleStock - 1 })}</p>
            <button ref={actionRef} className="button-link" data-variant="primary" type="button" onClick={event => { act(event, { type: "confirm-sale" }); }}>{t("stories.entry.confirm")}</button>
            <button className="button-link" data-variant="quiet" type="button" onClick={event => act(event, { type: "cancel-sale" })}>{t("stories.entry.cancel")}</button>
          </> : entry === "recorded" ? <>
            <p>{t("stories.entry.result")}</p>
            <button ref={actionRef} className="button-link" data-variant="secondary" type="button" onClick={event => { act(event, { type: "undo-sale" }); }}>{t("stories.entry.undo")}</button>
          </> : <button ref={actionRef} className="button-link" data-variant="primary" type="button" onClick={event => act(event, { type: "preview-sale" })}>{t("stories.entry.select")}</button>}
        </div>
      </div>
  );
}
