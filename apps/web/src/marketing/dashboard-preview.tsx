import { useId } from "react";
import { useTranslation } from "react-i18next";

import { getSupportedLanguage } from "../i18n";
import { landingDemo } from "../lib/demo-data";
import {
  formatCurrency,
  formatDemoDate,
  formatNumber,
  formatPercent,
} from "../lib/format";
import "./dashboard-preview.css";

interface DashboardPreviewProps {
  showSourceCard?: boolean;
  variant?: "hero" | "full";
}

function toPoints(values: readonly number[]) {
  const width = 520;
  const height = 150;
  const maximum = Math.max(...landingDemo.chart.current);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / maximum) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function DashboardPreview({
  showSourceCard = false,
  variant = "hero",
}: DashboardPreviewProps) {
  const { i18n, t } = useTranslation();
  const summaryId = useId();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);
  const formattedRevenue = formatCurrency(
    landingDemo.revenue,
    landingDemo.currency,
    locale,
  );
  const formattedComparison = formatPercent(landingDemo.comparisonPercent, locale);
  const formattedDate = formatDemoDate(
    landingDemo.date,
    locale,
    landingDemo.timeZone,
  );

  const metrics = [
    ["revenue", formattedRevenue],
    ["transactions", formatNumber(landingDemo.transactions, locale)],
    ["units", formatNumber(landingDemo.units, locale)],
    ["customers", formatNumber(landingDemo.customers, locale)],
  ] as const;

  return (
    <figure
      className="dashboard-preview"
      data-variant={variant}
      aria-describedby={summaryId}
    >
      <figcaption className="visually-hidden" id={summaryId}>
        {t("dashboard.accessibleSummary", {
          revenue: formattedRevenue,
          comparison: formattedComparison,
          stockRisks: landingDemo.stockRisks,
          sources: landingDemo.sources,
        })}
      </figcaption>

      <div className="dashboard-preview__frame" aria-hidden="true">
        <div className="dashboard-preview__browser-bar">
          <span className="dashboard-preview__browser-dot" />
          <span className="dashboard-preview__browser-dot" />
          <span className="dashboard-preview__browser-dot" />
          <span className="dashboard-preview__address">app.suqinsights.com</span>
        </div>

        <div className="dashboard-preview__application">
          <div className="dashboard-preview__rail">
            <span className="dashboard-preview__mini-mark">S</span>
            <span data-active="true" />
            <span />
            <span />
            <span />
          </div>

          <div className="dashboard-preview__canvas">
            <header className="dashboard-preview__header">
              <div>
                <p className="dashboard-preview__overline">{t("dashboard.workspace")}</p>
                <h2>{landingDemo.workspace}</h2>
              </div>
              <div className="dashboard-preview__context">
                <p>{t("dashboard.sampleDay", { date: formattedDate })}</p>
                <p className="dashboard-preview__freshness">
                  <span className="dashboard-preview__freshness-dot" />
                  {t("dashboard.freshness", {
                    minutes: landingDemo.freshnessMinutes,
                    sources: landingDemo.sources,
                  })}
                </p>
              </div>
            </header>

            <section className="dashboard-preview__insight">
              <span className="dashboard-preview__spark">↗</span>
              <div>
                <p className="dashboard-preview__overline">{t("dashboard.insightLabel")}</p>
                <p>{t("dashboard.insight", { comparison: formattedComparison })}</p>
              </div>
            </section>

            <div className="dashboard-preview__metrics">
              {metrics.map(([metric, value]) => (
                <section className="dashboard-preview__metric" key={metric}>
                  <p>{t(`dashboard.metrics.${metric}`)}</p>
                  <strong>{value}</strong>
                  {metric === "revenue" ? (
                    <span className="dashboard-preview__metric-comparison">
                      {t("dashboard.comparison", { comparison: formattedComparison })}
                    </span>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="dashboard-preview__lower-grid">
              <section className="dashboard-preview__chart-card">
                <div className="dashboard-preview__card-heading">
                  <div>
                    <p className="dashboard-preview__overline">{t("dashboard.chart.eyebrow")}</p>
                    <h3>{t("dashboard.chart.title")}</h3>
                  </div>
                  <span className="dashboard-preview__period">
                    {t("dashboard.chart.period")}
                  </span>
                </div>
                <svg viewBox="0 0 520 170" role="presentation">
                  <line x1="0" y1="30" x2="520" y2="30" />
                  <line x1="0" y1="90" x2="520" y2="90" />
                  <line x1="0" y1="150" x2="520" y2="150" />
                  <polyline
                    className="dashboard-preview__previous-line"
                    points={toPoints(landingDemo.chart.previous)}
                  />
                  <polyline
                    className="dashboard-preview__current-line"
                    points={toPoints(landingDemo.chart.current)}
                  />
                  <circle cx="520" cy="0" r="5" />
                </svg>
                <div className="dashboard-preview__legend">
                  <span data-series="current">{t("dashboard.chart.current")}</span>
                  <span data-series="previous">{t("dashboard.chart.previous")}</span>
                </div>
              </section>

              <section className="dashboard-preview__risk-card">
                <span className="dashboard-preview__risk-icon">!</span>
                <p className="dashboard-preview__overline">{t("dashboard.stock.eyebrow")}</p>
                <strong>
                  {t("dashboard.stock.title", { count: landingDemo.stockRisks })}
                </strong>
                <p>{t("dashboard.stock.body")}</p>
                <span className="dashboard-preview__risk-link">
                  {t("dashboard.stock.action")} →
                </span>
              </section>
            </div>
          </div>
        </div>
      </div>

      {showSourceCard ? (
        <div className="source-confirmation" aria-hidden="true">
          <div className="source-confirmation__heading">
            <span className="source-confirmation__icon">✓</span>
            <div>
              <strong>{t("dashboard.confirmed.title")}</strong>
              <p className="source-confirmation__body">
                {t("dashboard.confirmed.body")}
              </p>
            </div>
          </div>
          <dl>
            <div>
              <dt>Fecha</dt>
              <dd>{t("dashboard.confirmed.date")}</dd>
            </div>
            <div>
              <dt>Imp.</dt>
              <dd>{t("dashboard.confirmed.amount")}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </figure>
  );
}
