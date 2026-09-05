import { useTranslation } from "react-i18next";

import "./buying-questions.css";

const planRows = ["dashboards", "history", "uploads", "alerts", "team", "connections", "sponsorship"] as const;
const questions = ["availability", "sources", "review", "missing", "history", "privacy"] as const;

export function BuyingQuestions() {
  const { t } = useTranslation();
  return (
    <>
      <section className="buying-section" id="plans" tabIndex={-1} aria-labelledby="plans-title">
        <header className="story-heading">
          <p className="story-eyebrow">{t("buying.eyebrow")}</p>
          <h2 id="plans-title">{t("buying.title")}</h2>
          <p>{t("buying.intro")}</p>
        </header>
        <div className="workflow-comparison">
          {(["today", "planned"] as const).map(key => <div key={key}>
            <h3>{t(`buying.workflow.${key}.title`)}</h3>
            <p>{t(`buying.workflow.${key}.body`)}</p>
          </div>)}
        </div>
        <p className="plan-availability">{t("buying.availability")}</p>
        <div className="plan-grid">
          {(["free", "premium"] as const).map(plan => <article className="plan-summary" key={plan} aria-labelledby={`plan-${plan}`}>
            <h3 id={`plan-${plan}`}>{t(`buying.${plan}.title`)}</h3>
            <p className="plan-summary__purpose">{t(`buying.${plan}.purpose`)}</p>
            <dl>{planRows.map(row => <div key={row}>
              <dt>{t(`buying.rows.${row}`)}</dt><dd>{t(`buying.${plan}.${row}`)}</dd>
            </div>)}</dl>
          </article>)}
        </div>
        <p className="plan-footnote">{t("buying.forecast")}</p>
      </section>
      <section className="buying-section" id="faq" tabIndex={-1} aria-labelledby="faq-title">
        <header className="story-heading">
          <p className="story-eyebrow">{t("buying.faq.eyebrow")}</p>
          <h2 id="faq-title">{t("buying.faq.title")}</h2>
        </header>
        <div className="buying-faq">
          {questions.map(question => <details key={question}>
            <summary>{t(`buying.faq.${question}.question`)}</summary>
            <p>{t(`buying.faq.${question}.answer`)}</p>
          </details>)}
        </div>
      </section>
    </>
  );
}
