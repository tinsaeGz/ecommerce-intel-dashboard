import { useId } from "react";
import { useTranslation } from "react-i18next";

import { getSupportedLanguage } from "../i18n";
import { landingDemo, previewMetricKeys, previewMetricSeries } from "../lib/demo-data";
import { formatCurrency, formatDemoDate, formatNumber, formatPercent } from "../lib/format";
import { useSampleScenario } from "../lib/sample-scenario";
import "./dashboard-preview.css";

interface DashboardPreviewProps {
  showSourceCard?: boolean;
  variant?: "hero" | "full";
}

export function DashboardPreview({ showSourceCard = false, variant = "hero" }: DashboardPreviewProps) {
  const { i18n, t } = useTranslation();
  const summaryId = useId();
  const chartId = useId();
  const sliderId = useId();
  const { state: { metric, observation, stockIndex, hasIdentity, sale }, dispatch } = useSampleScenario();
  const unavailable = metric === "customers" && !hasIdentity;
  const locale = getSupportedLanguage(i18n.resolvedLanguage);
  const values = previewMetricSeries[metric];
  const selectedStock = landingDemo.stockRiskItems[stockIndex];
  const comparison = formatPercent(landingDemo.comparisonPercent, locale);
  const formatValue = (value: number, key = metric) => key === "revenue"
    ? formatCurrency(value, landingDemo.currency, locale)
    : formatNumber(value, locale);
  const timeAt = (index: number) => new Intl.DateTimeFormat(locale, {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: landingDemo.timeZone,
  }).format(new Date(landingDemo.date.getTime() - (7 - index) * 3_600_000));
  const maximum = Math.max(...values);
  const chartPoints = values.map((value, index) => ({ x: index * 640 / 7, y: 160 - value / maximum * 136 }));
  const points = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const selectedPoint = chartPoints[observation];

  return (
    <figure className="dashboard-preview" data-variant={variant} aria-describedby={summaryId}>
      <figcaption className="visually-hidden" id={summaryId}>
        {t("dashboard.accessibleSummary", {
          revenue: formatValue(landingDemo.revenue, "revenue"), comparison,
          stockRisks: landingDemo.stockRisks, sources: landingDemo.sources,
        })}
      </figcaption>
      <div className="dashboard-preview__frame">
        <header className="dashboard-preview__header">
          <div className="dashboard-preview__workspace">
            <span className="dashboard-preview__mark" aria-hidden="true">M</span>
            <div><h2>{landingDemo.workspace}</h2><p>{t("polish.dashboard.workspaceNote")}</p></div>
          </div>
          <p className="dashboard-preview__date">{t("dashboard.sampleDay", { date: formatDemoDate(landingDemo.date, locale, landingDemo.timeZone) })}</p>
        </header>
        <div className="dashboard-preview__metrics" role="group" aria-label={t("polish.dashboard.metricLabel")}>
          {previewMetricKeys.map((key) => (
            <button className="dashboard-preview__metric" key={key} type="button" aria-pressed={metric === key} onClick={() => dispatch({ type: "metric", value: key })}>
              <span>{t(`dashboard.metrics.${key}`)}</span>{" "}
              <strong>{key === "customers" && !hasIdentity ? t("stories.customers.unavailable") : formatValue(landingDemo[key], key)}</strong>{" "}
              <span className="dashboard-preview__metric-hint">{t(metric === key ? "polish.dashboard.selected" : "polish.dashboard.viewTrend")}</span>
            </button>
          ))}
        </div>
        <div className="dashboard-preview__body">
          <section className="dashboard-preview__chart" aria-labelledby={chartId}>
            <div className="dashboard-preview__chart-header">
              <div><p className="dashboard-preview__eyebrow">{t("polish.dashboard.dayView")}</p><h3 id={chartId}>{t(`dashboard.metrics.${metric}`)}</h3></div>
              <p className="dashboard-preview__comparison">{metric === "revenue" ? t("dashboard.comparison", { comparison }) : t("polish.dashboard.cumulative")}</p>
            </div>
            {unavailable ? <p role="status">{t("stories.customers.missing")}</p> : <>
            <div className="dashboard-preview__reading" role="status">
              <strong>{formatValue(values[observation])}</strong>
              <span>{t("polish.dashboard.atTime", { time: timeAt(observation) })}</span>
            </div>
            <svg className="dashboard-preview__plot" viewBox="0 0 640 184" aria-hidden="true" focusable="false">
              <line x1="0" x2="640" y1="24" y2="24" /><line x1="0" x2="640" y1="92" y2="92" /><line x1="0" x2="640" y1="160" y2="160" />
              <polygon points={`0,160 ${points} 640,160`} /><polyline points={points} />
              <line className="dashboard-preview__cursor" x1={selectedPoint.x} x2={selectedPoint.x} y1="0" y2="160" />
              <circle cx={selectedPoint.x} cy={selectedPoint.y} r="6" />
            </svg>
            <div className="dashboard-preview__axis" aria-hidden="true"><span>{timeAt(0)}</span><span>{timeAt(3)}</span><span>{timeAt(7)}</span></div>
            <label className="dashboard-preview__slider-label" htmlFor={sliderId}>{t("polish.dashboard.inspectTime")}</label>
            <input id={sliderId} className="dashboard-preview__slider" type="range" min="0" max="7" step="1" value={observation}
              aria-valuetext={`${timeAt(observation)} · ${t(`dashboard.metrics.${metric}`)} · ${formatValue(values[observation])}`}
              onChange={(event) => dispatch({ type: "observation", value: Number(event.target.value) })} />
            <details className="dashboard-preview__data">
              <summary>{t("polish.dashboard.viewData")}</summary>
              <table>
                <caption className="visually-hidden">{t("polish.dashboard.dataCaption", { metric: t(`dashboard.metrics.${metric}`) })}</caption>
                <thead><tr><th scope="col">{t("polish.dashboard.time")}</th><th scope="col">{t(`dashboard.metrics.${metric}`)}</th></tr></thead>
                <tbody>{values.map((value, index) => <tr key={index}><th scope="row">{timeAt(index)}</th><td>{formatValue(value)}</td></tr>)}</tbody>
              </table>
            </details>
            </>}
          </section>
          <section className="dashboard-preview__stock" aria-label={t("dashboard.stock.eyebrow")}>
            <p className="dashboard-preview__eyebrow">{t("dashboard.briefing.actNext")}</p>
            <h3>{t("dashboard.stock.title", { count: landingDemo.stockRisks })}</h3>
            <p className="dashboard-preview__stock-note">{t("polish.dashboard.stockHint")}</p>
            <div className="dashboard-preview__stock-list" role="group" aria-label={t("polish.dashboard.stockLabel")}>
              {landingDemo.stockRiskItems.map((item, index) => (
                <button key={item.name} type="button" className="dashboard-preview__stock-item" aria-pressed={stockIndex === index} onClick={() => dispatch({ type: "stock", value: index })}>
                  <span className="dashboard-preview__stock-mark" aria-hidden="true">0{index + 1}</span>
                  <span><strong>{item.name}</strong><small>{t("dashboard.briefing.daysRemaining", { count: item.daysRemaining })}</small></span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div className="dashboard-preview__stock-detail" role="status">
              <strong>{selectedStock.name}</strong><p>{t("polish.dashboard.stockDetail", { count: selectedStock.daysRemaining })}</p>
            </div>
            <div className="dashboard-preview__after-cutoff" role="status">
              <strong>{t("cinematic.stockAfter", { count: sale === "recorded" ? 11 : 12 })}</strong>
              <p>{t(sale === "recorded" ? "cinematic.saleApplied" : sale === "review" ? "cinematic.salePending" : "cinematic.saleNotApplied")}</p>
            </div>
            <p className="dashboard-preview__stock-disclaimer">{t("presentation.briefing.stockNote")}</p>
          </section>
        </div>
        <footer className="dashboard-preview__footer">
          <p><span className="dashboard-preview__freshness-dot" aria-hidden="true" />{t("dashboard.freshness", { minutes: landingDemo.freshnessMinutes, sources: landingDemo.sources })}</p>
          {showSourceCard ? <a href="#how-it-works" onClick={() => document.getElementById("how-it-works")?.focus({ preventScroll: true })}>{t("polish.dashboard.reviewLink")} <span aria-hidden="true">→</span></a> : <span>{t("demo.sampleLabel")}</span>}
        </footer>
      </div>
    </figure>
  );
}
