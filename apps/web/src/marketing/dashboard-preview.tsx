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
  const width = 360;
  const height = 82;
  const maximum = Math.max(...values);

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
        <aside className="dashboard-preview__rail">
          <span className="dashboard-preview__mini-mark">S</span>
          <span className="dashboard-preview__rail-item" data-active="true">↗</span>
          <span className="dashboard-preview__rail-item">≡</span>
          <span className="dashboard-preview__rail-item">＋</span>
        </aside>

        <div className="dashboard-preview__briefing">
          <header className="dashboard-preview__header">
            <div>
              <p className="dashboard-preview__overline">{t("dashboard.workspace")}</p>
              <h2>{t("dashboard.briefing.greeting", { workspace: landingDemo.workspace })}</h2>
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

          <div className="dashboard-preview__briefing-grid">
            <section className="dashboard-preview__story">
              <div className="dashboard-preview__story-heading">
                <div>
                  <p className="dashboard-preview__overline">
                    {t("dashboard.briefing.answerLabel")}
                  </p>
                  <strong>{formattedRevenue}</strong>
                  <span className="dashboard-preview__comparison">
                    {t("dashboard.comparison", { comparison: formattedComparison })}
                  </span>
                </div>
                <span className="dashboard-preview__movement">↗ {formattedComparison}</span>
              </div>

              <h3>{t("dashboard.briefing.storyTitle")}</h3>
              <p className="dashboard-preview__story-copy">
                {t("dashboard.insight", { comparison: formattedComparison })}
              </p>

              <svg viewBox="0 0 360 100" role="presentation">
                <line x1="0" y1="82" x2="360" y2="82" />
                <polyline points={toPoints(landingDemo.chart.current)} />
                <circle cx="360" cy="0" r="4" />
              </svg>

              <div className="dashboard-preview__evidence">
                <span className="dashboard-preview__evidence-label">
                  {t("dashboard.briefing.evidenceLabel")}
                </span>
                <strong>
                  {t("dashboard.briefing.evidence", {
                    transactions: formatNumber(landingDemo.transactions, locale),
                  })}
                </strong>
              </div>
            </section>

            <section className="dashboard-preview__actions">
              <div className="dashboard-preview__actions-heading">
                <div>
                  <p className="dashboard-preview__overline">
                    {t("dashboard.briefing.actNext")}
                  </p>
                  <h3>{t("dashboard.stock.title", { count: landingDemo.stockRisks })}</h3>
                </div>
                <span className="dashboard-preview__risk-count">{landingDemo.stockRisks}</span>
              </div>
              <ol>
                {landingDemo.stockRiskItems.map((item, index) => (
                  <li key={item.name}>
                    <span className="dashboard-preview__risk-index">0{index + 1}</span>
                    <strong>{item.name}</strong>
                    <small className="dashboard-preview__risk-days">
                      {t("dashboard.briefing.daysRemaining", {
                        count: item.daysRemaining,
                      })}
                    </small>
                  </li>
                ))}
              </ol>
              <span className="dashboard-preview__text-action">
                {t("dashboard.stock.action")} →
              </span>
            </section>

            <section className="dashboard-preview__glance">
              <p className="dashboard-preview__overline">
                {t("dashboard.briefing.glance")}
              </p>
              <dl>
                <div>
                  <dt>{t("dashboard.metrics.transactions")}</dt>
                  <dd>{formatNumber(landingDemo.transactions, locale)}</dd>
                </div>
                <div>
                  <dt>{t("dashboard.metrics.units")}</dt>
                  <dd>{formatNumber(landingDemo.units, locale)}</dd>
                </div>
                <div>
                  <dt>{t("dashboard.briefing.returning")}</dt>
                  <dd>{formatNumber(landingDemo.returningCustomers, locale)}</dd>
                </div>
              </dl>
            </section>

            {showSourceCard ? (
              <section className="dashboard-preview__review">
                <span className="dashboard-preview__review-icon">?</span>
                <div>
                  <p className="dashboard-preview__overline">
                    {t("dashboard.briefing.reviewLabel")}
                  </p>
                  <strong>{t("dashboard.briefing.reviewTitle")}</strong>
                  <small className="dashboard-preview__review-evidence">
                    {t("dashboard.briefing.reviewEvidence")}
                  </small>
                </div>
                <span className="dashboard-preview__review-action">
                  {t("dashboard.briefing.reviewAction")} →
                </span>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </figure>
  );
}
