import { useTranslation } from "react-i18next";

import { ButtonLink } from "../components/public-ui";
import { getSupportedLanguage } from "../i18n";
import { landingDemo } from "../lib/demo-data";
import { formatNumber, formatPercent } from "../lib/format";
import { DashboardPreview } from "./dashboard-preview";
import "./merchant-story.css";

export function LedgerMotif() {
  return (
    <svg className="ledger-motif" viewBox="0 0 180 240" aria-hidden="true" focusable="false">
      <path className="ledger-motif__paper" d="M20 1h159v220l-13-8-13 8-13-8-13 8-13-8-13 8-13-8-13 8-13-8-13 8-13-8-16 8Z" />
      <path className="ledger-motif__grid" d="M20 41h159M20 81h159M20 121h159M20 161h159M60 1v200M100 1v200M140 1v200" />
      <path className="ledger-motif__lime" d="M100 1h40v40h-40zM60 81h40v40H60z" />
      <path className="ledger-motif__mint" d="M140 41h39v40h-39zM100 121h40v40h-40z" />
      <path className="ledger-motif__ink" d="M20 161h40v40H20z" />
      <path className="ledger-motif__tick" d="m30 181 7 7 13-15" />
    </svg>
  );
}

export function DailyBriefing() {
  const { i18n, t } = useTranslation();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);

  return (
    <div className="daily-briefing">
      <div className="daily-briefing__intro">
        <div className="daily-briefing__caption">
          <span className="daily-briefing__mark" aria-hidden="true">S</span>
          <p>{t("presentation.briefing.label")}</p>
          <span className="daily-briefing__sample">{t("demo.sampleLabel")}</span>
        </div>
        <h2>{t("presentation.briefing.question")}</h2>
        <p className="daily-briefing__answer">
          {t("presentation.briefing.answer", {
            comparison: formatPercent(landingDemo.comparisonPercent, locale),
            risks: formatNumber(landingDemo.stockRisks, locale),
          })}
        </p>
        <div className="daily-briefing__controls">
          <details className="briefing-detail">
            <summary>{t("presentation.briefing.stockAction")}</summary>
            <div className="briefing-detail__content">
              <p>{t("dashboard.stock.body")}</p>
              <ul>
                {landingDemo.stockRiskItems.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}</strong>
                    <span>{t("dashboard.briefing.daysRemaining", { count: item.daysRemaining })}</span>
                  </li>
                ))}
              </ul>
              <p>{t("presentation.briefing.stockNote")}</p>
            </div>
          </details>
          <details className="briefing-detail">
            <summary>{t("presentation.briefing.evidenceAction")}</summary>
            <div className="briefing-detail__content">
              <p>{t("dashboard.briefing.evidence", {
                transactions: formatNumber(landingDemo.transactions, locale),
              })}</p>
              <p>{t("presentation.briefing.evidenceBody")}</p>
            </div>
          </details>
          <a
            className="daily-briefing__review-link"
            href="#how-it-works"
            onClick={() => document.getElementById("how-it-works")?.focus({ preventScroll: true })}
          >
            {t("presentation.briefing.reviewAction")} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <DashboardPreview showSourceCard />
      <p className="daily-briefing__footnote">{t("presentation.briefing.caption")}</p>
    </div>
  );
}

const outcomeKeys = ["trace", "confirm", "preserve", "missing", "context", "language"] as const;

export function MerchantOutcomes() {
  const { t } = useTranslation();
  return (
    <section className="merchant-outcomes" aria-labelledby="outcomes-title">
      <div className="section-heading">
        <p className="section-heading__eyebrow">{t("presentation.outcomes.eyebrow")}</p>
        <h2 id="outcomes-title">{t("presentation.outcomes.title")}</h2>
      </div>
      <ul className="merchant-outcomes__grid">
        {outcomeKeys.map((key, index) => (
          <li className="merchant-outcomes__item" key={key}>
            <span className="merchant-outcomes__number" aria-hidden="true">0{index + 1}</span>
            <h3>{t(`presentation.outcomes.items.${key}.title`)}</h3>
            <p>{t(`presentation.outcomes.items.${key}.body`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ClosingInvitation() {
  const { t } = useTranslation();
  return (
    <section className="closing-invitation" aria-labelledby="closing-title">
      <div className="closing-invitation__surface">
        <LedgerMotif />
        <p className="closing-invitation__eyebrow">{t("presentation.closing.eyebrow")}</p>
        <h2 id="closing-title">{t("presentation.closing.title")}</h2>
        <p className="closing-invitation__body">{t("presentation.closing.body")}</p>
        <div className="closing-invitation__actions">
          <ButtonLink to="/demo">{t("presentation.closing.action")}</ButtonLink>
          <ButtonLink to="/signup" variant="secondary">{t("actions.previewSignup")}</ButtonLink>
        </div>
        <p className="closing-invitation__note">{t("footer.previewNote")}</p>
      </div>
    </section>
  );
}
