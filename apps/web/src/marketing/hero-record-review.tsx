import { useId } from "react";
import { useTranslation } from "react-i18next";

import { DropdownSelect } from "../components/dropdown-select";
import { useSampleScenario } from "../lib/sample-scenario";
import "./hero-record-review.css";

const roles = ["itemIdentity", "customerIdentity", "notAnalyzed"] as const;


export function HeroRecordReview() {
  const { t } = useTranslation();
  const fieldId = useId();
  const titleId = useId();
  const { state: { role, confirmed }, dispatch } = useSampleScenario();

  return (
    <section className="hero-record" aria-labelledby={titleId} data-confirmed={confirmed}>
      <header className="hero-record__header">
        <span className="hero-record__file-icon" aria-hidden="true">CSV</span>
        <div>
          <p className="hero-record__filename">ventas-septiembre.csv</p>
          <p className="hero-record__meta">{t("polish.review.sample")}</p>
        </div>
        <span className="hero-record__step" aria-hidden="true">02 / 03</span>
      </header>

      <div className="hero-record__body">
        <p className="hero-record__eyebrow">{t("polish.review.eyebrow")}</p>
        <h2 id={titleId}>{t("polish.review.title")}</h2>
        <p className="hero-record__deck">{t("polish.review.body")}</p>

        <div className="hero-record__source">
          <table>
            <caption className="visually-hidden">{t("polish.review.sourceCaption")}</caption>
            <thead><tr><th scope="col">Fecha</th><th scope="col">Imp.</th><th scope="col">Cod.</th></tr></thead>
            <tbody>
              <tr><td>03/09/26</td><td>48,00 €</td><td>CT-204</td></tr>
              <tr><td>03/09/26</td><td>27,50 €</td><td>GC-118</td></tr>
            </tbody>
          </table>
          <p>{t("polish.review.sourceNote")}</p>
        </div>

        <label className="hero-record__label" htmlFor={fieldId}>{t("polish.review.roleLabel")}</label>
        <DropdownSelect
          id={fieldId} label={t("polish.review.roleLabel")} value={role}
          hint={t("polish.review.localOnly")}
          onChange={(value) => dispatch({ type: "role", value })}
          options={roles.map((value) => ({ value, label: t(`understanding.review.roles.${value}`) }))}
        />

        <div className="hero-record__result" role="status">
          <span className="hero-record__result-icon" aria-hidden="true">{confirmed ? "✓" : "?"}</span>
          <div>
            <strong>{t(confirmed ? "polish.review.confirmed" : "polish.review.pending")}</strong>
            <p>{confirmed
              ? t("polish.review.result", { role: t(`understanding.review.roles.${role}`) })
              : t("polish.review.evidence")}</p>
          </div>
        </div>

        <button
          type="button"
          className="hero-record__apply"
          onClick={() => dispatch({ type: confirmed ? "reset-review" : "confirm-review" })}
        >
          {t(confirmed ? "polish.review.reset" : "polish.review.confirm")}
          <span aria-hidden="true">{confirmed ? "↺" : "→"}</span>
        </button>
      </div>
      <p className="hero-record__footnote">{t("cinematic.reviewScope")}</p>
    </section>
  );
}
