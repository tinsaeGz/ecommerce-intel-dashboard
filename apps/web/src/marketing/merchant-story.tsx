import { useTranslation } from "react-i18next";

import { DemoLink } from "../components/public-ui";
import { getSupportedLanguage } from "../i18n";
import { landingDemo } from "../lib/demo-data";
import { formatCurrency, formatDemoDate, formatNumber, formatPercent } from "../lib/format";
import "./merchant-story.css";


export function DailyBriefing() {
  const { i18n, t } = useTranslation();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);

  return (
    <section className="daily-briefing" aria-labelledby="briefing-title">
      <p className="daily-briefing__caption">{landingDemo.workspace} · {formatDemoDate(landingDemo.date, locale, landingDemo.timeZone)}</p>
      <h2 id="briefing-title">{t("presentation.briefing.question")}</h2>
      <p className="daily-briefing__answer">{t("hero.briefingAnswer")}</p>
      <dl className="daily-briefing__metrics">
        <div className="daily-briefing__revenue">
          <dt>{t("dashboard.metrics.revenue")}</dt>
          <dd>{formatCurrency(landingDemo.revenue, landingDemo.currency, locale)}</dd>
          <dd className="daily-briefing__comparison">{t("hero.comparison", { comparison: formatPercent(landingDemo.comparisonPercent, locale) })}</dd>
        </div>
        <div>
          <dt>{t("dashboard.stock.eyebrow")}</dt>
          <dd>{t("dashboard.stock.title", { count: landingDemo.stockRisks })}</dd>
          <dd className="daily-briefing__context">{t("hero.stockContext")}</dd>
        </div>
        <div>
          <dt>{t("dashboard.briefing.returning")}</dt>
          <dd>{formatNumber(landingDemo.returningCustomers, locale)}</dd>
          <dd className="daily-briefing__context">{t("hero.customerContext", { customers: formatNumber(landingDemo.customers, locale) })}</dd>
        </div>
      </dl>
      <DemoLink location="briefing" />
    </section>
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
        <p className="closing-invitation__eyebrow">{t("presentation.closing.eyebrow")}</p>
        <h2 id="closing-title">{t("presentation.closing.title")}</h2>
        <p className="closing-invitation__body">{t("presentation.closing.body")}</p>
        <div className="closing-invitation__actions">
          <DemoLink location="closing" />
        </div>
        <p className="closing-invitation__note">{t("footer.previewNote")}</p>
      </div>
    </section>
  );
}
