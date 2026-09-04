import {
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "../components/public-ui";
import "./product-understanding.css";

const sourceKeys = [
  "csv",
  "excel",
  "paste",
  "json",
  "pos",
  "marketplace",
  "image",
  "pdf",
  "manual",
  "api",
] as const;

const sourceMarks: Record<(typeof sourceKeys)[number], string> = {
  csv: "CSV",
  excel: "XLS",
  paste: "⌘V",
  json: "{ }",
  pos: "POS",
  marketplace: "MKT",
  image: "IMG",
  pdf: "PDF",
  manual: "+",
  api: "API",
};

const stepKeys = ["add", "confirm", "see"] as const;

function getKeyboardTarget(
  event: KeyboardEvent,
  currentIndex: number,
  itemCount: number,
) {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    return (currentIndex + 1) % itemCount;
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    return (currentIndex - 1 + itemCount) % itemCount;
  }
  if (event.key === "Home") {
    return 0;
  }
  if (event.key === "End") {
    return itemCount - 1;
  }
  return null;
}

export function SourceExplorer() {
  const { t } = useTranslation();
  const [activeSource, setActiveSource] = useState<(typeof sourceKeys)[number]>("csv");
  const tabsId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activateWithKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const targetIndex = getKeyboardTarget(event, currentIndex, sourceKeys.length);
    if (targetIndex === null) {
      return;
    }
    event.preventDefault();
    setActiveSource(sourceKeys[targetIndex]);
    tabRefs.current[targetIndex]?.focus();
  };

  return (
    <section className="source-explorer" id="sources" aria-labelledby="sources-title">
      <div className="section-heading">
        <p className="section-heading__eyebrow">{t("understanding.sources.eyebrow")}</p>
        <h2 id="sources-title">{t("understanding.sources.title")}</h2>
        <p className="section-heading__body">{t("understanding.sources.body")}</p>
      </div>

      <div className="source-explorer__surface">
        <div
          className="source-explorer__tabs"
          role="tablist"
          aria-label={t("understanding.sources.tabLabel")}
        >
          {sourceKeys.map((source, index) => (
            <button
              key={source}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${tabsId}-${source}-tab`}
              className="source-explorer__tab"
              type="button"
              role="tab"
              aria-controls={`${tabsId}-${source}-panel`}
              aria-selected={activeSource === source}
              tabIndex={activeSource === source ? 0 : -1}
              onClick={() => setActiveSource(source)}
              onKeyDown={(event) => activateWithKeyboard(event, index)}
            >
              <span className="source-explorer__tab-mark" aria-hidden="true">
                {sourceMarks[source]}
              </span>
              {t(`understanding.sources.items.${source}`)}
            </button>
          ))}
        </div>

        <div
          className="source-explorer__preview"
          id={`${tabsId}-${activeSource}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-${activeSource}-tab`}
          tabIndex={0}
        >
          <div className="source-input-preview">
            <div className="source-input-preview__heading">
              <span className="source-input-preview__mark" aria-hidden="true">
                {sourceMarks[activeSource]}
              </span>
              <div>
                <p>{t("understanding.sources.rawLabel")}</p>
                <strong>{t(`understanding.sources.items.${activeSource}`)}</strong>
              </div>
            </div>
            <p className="source-input-preview__sample">
              {t(`understanding.sources.previews.${activeSource}`)}
            </p>
            <div className="source-input-preview__cells" aria-hidden="true">
              <span className="source-input-preview__cell">Fecha</span>
              <span className="source-input-preview__cell">Imp.</span>
              <span className="source-input-preview__cell">Cod.</span>
              <span className="source-input-preview__cell">03/09/26</span>
              <span className="source-input-preview__cell">48,00 €</span>
              <span className="source-input-preview__cell">CT-204</span>
            </div>
          </div>

          <span className="source-explorer__flow" aria-hidden="true">→</span>

          <div className="recognized-preview">
            <div className="recognized-preview__heading">
              <span className="recognized-preview__mark" aria-hidden="true">✓</span>
              <div>
                <p>{t("understanding.sources.recognizedLabel")}</p>
                <strong>{t("understanding.sources.recognizedTitle")}</strong>
              </div>
            </div>
            <dl>
              <div>
                <dt>Fecha</dt>
                <dd>{t("understanding.review.roles.transactionTime")}</dd>
              </div>
              <div>
                <dt>Imp.</dt>
                <dd>{t("understanding.review.roles.lineAmount")}</dd>
              </div>
              <div data-status="review">
                <dt>Cod.</dt>
                <dd>{t("understanding.review.confidence.needsReview")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <p className="source-explorer__promise">{t("understanding.sources.promise")}</p>
    </section>
  );
}

export function ProblemFraming() {
  const { t } = useTranslation();
  const problems = ["different", "cleanup", "certainty"] as const;

  return (
    <section className="problem-framing" aria-labelledby="problem-title">
      <div className="section-heading section-heading--wide">
        <p className="section-heading__eyebrow">{t("understanding.problems.eyebrow")}</p>
        <h2 id="problem-title">{t("understanding.problems.title")}</h2>
        <p className="problem-framing__label">{t("presentation.problems.label")}</p>
      </div>
      <div className="problem-framing__grid">
        {problems.map((problem, index) => (
          <article
            className="problem-card"
            data-emphasis={problem === "certainty"}
            key={problem}
          >
            <span className="problem-card__number" aria-hidden="true">
              0{index + 1}
            </span>
            <p className="problem-card__question">{t(`presentation.problems.questions.${problem}`)}</p>
            <h3>{t(`understanding.problems.items.${problem}.title`)}</h3>
            <p className="problem-card__body">
              {t(`understanding.problems.items.${problem}.body`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

interface ReviewField {
  confidence: "high" | "medium" | "needsReview";
  header: string;
  key: "date" | "amount" | "code" | "customer" | "notes";
  role: "transactionTime" | "lineAmount" | "itemIdentity" | "customerIdentity" | "notAnalyzed";
  type: "date" | "currency" | "identifier" | "text";
}

const reviewFields: readonly ReviewField[] = [
  { key: "date", header: "Fecha", type: "date", role: "transactionTime", confidence: "high" },
  { key: "amount", header: "Imp.", type: "currency", role: "lineAmount", confidence: "high" },
  { key: "code", header: "Cod.", type: "identifier", role: "itemIdentity", confidence: "needsReview" },
  { key: "customer", header: "Cliente", type: "text", role: "customerIdentity", confidence: "medium" },
  { key: "notes", header: "Notas", type: "text", role: "notAnalyzed", confidence: "high" },
] as const;

function InterpretationReview({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const [selectedField, setSelectedField] = useState<ReviewField>(reviewFields[2]);
  const [selectedRole, setSelectedRole] = useState(selectedField.role);
  const selectId = useId();

  const selectField = (field: ReviewField) => {
    setSelectedField(field);
    setSelectedRole(field.role);
  };

  return (
    <div className="interpretation-review" data-compact={compact}>
      <div className="interpretation-review__topline">
        <div>
          <p className="interpretation-review__file-label">
            {t("understanding.review.fileLabel")}
          </p>
          <strong>ventas-septiembre.csv</strong>
        </div>
        <span className="interpretation-review__progress">
          {t("understanding.review.progress")}
        </span>
      </div>

      <div className="interpretation-review__body">
        <div className="interpretation-review__table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">{t("understanding.review.columns.field")}</th>
                <th scope="col">{t("understanding.review.columns.type")}</th>
                <th scope="col">{t("understanding.review.columns.use")}</th>
                <th scope="col">{t("understanding.review.columns.confidence")}</th>
              </tr>
            </thead>
            <tbody>
              {reviewFields.map((field) => (
                <tr key={field.key} data-selected={selectedField.key === field.key}>
                  <th scope="row">
                    <button type="button" onClick={() => selectField(field)}>
                      <span className="interpretation-review__field-name">{field.header}</span>
                      <small className="interpretation-review__field-sample">
                        {t(`understanding.review.samples.${field.key}`)}
                      </small>
                    </button>
                  </th>
                  <td>{t(`understanding.review.types.${field.type}`)}</td>
                  <td>
                    {selectedField.key === field.key
                      ? t(`understanding.review.roles.${selectedRole}`)
                      : t(`understanding.review.roles.${field.role}`)}
                  </td>
                  <td>
                    <span className="confidence-badge" data-confidence={field.confidence}>
                      {t(`understanding.review.confidence.${field.confidence}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="evidence-drawer"
          role="group"
          aria-label={t("understanding.review.evidence.label")}
        >
          <div className="evidence-drawer__heading">
            <div>
              <p className="evidence-drawer__eyebrow">
                {t("understanding.review.evidence.eyebrow")}
              </p>
              <h3>{t("understanding.review.evidence.title", { field: selectedField.header })}</h3>
            </div>
            <span className="confidence-badge" data-confidence={selectedField.confidence}>
              {t(`understanding.review.confidence.${selectedField.confidence}`)}
            </span>
          </div>

          <div className="evidence-drawer__source">
            <span className="evidence-drawer__source-label">
              {t("understanding.review.evidence.sourceCrop")}
            </span>
            <strong>{selectedField.header}</strong>
            <mark>{t(`understanding.review.samples.${selectedField.key}`)}</mark>
          </div>

          <ul className="evidence-drawer__facts">
            <li>{t(`understanding.review.evidence.facts.${selectedField.key}`)}</li>
            <li>{t("understanding.review.evidence.locale")}</li>
            <li>{t(`understanding.review.evidence.effects.${selectedField.key}`)}</li>
          </ul>

          <label htmlFor={selectId}>{t("understanding.review.editLabel")}</label>
          <select
            id={selectId}
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value as ReviewField["role"])}
          >
            <option value="transactionTime">{t("understanding.review.roles.transactionTime")}</option>
            <option value="lineAmount">{t("understanding.review.roles.lineAmount")}</option>
            <option value="itemIdentity">{t("understanding.review.roles.itemIdentity")}</option>
            <option value="customerIdentity">{t("understanding.review.roles.customerIdentity")}</option>
            <option value="notAnalyzed">{t("understanding.review.roles.notAnalyzed")}</option>
          </select>
          <p className="evidence-drawer__update" role="status">
            {t("understanding.review.update", {
              role: t(`understanding.review.roles.${selectedRole}`),
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function AddStage() {
  const { t } = useTranslation();
  return (
    <div className="add-stage">
      <div className="add-stage__drop">
        <span className="add-stage__mark" aria-hidden="true">＋</span>
        <strong>{t("understanding.how.stages.add.dropTitle")}</strong>
        <p className="add-stage__body">{t("understanding.how.stages.add.dropBody")}</p>
      </div>
      <div className="add-stage__channels">
        <span className="add-stage__channel">CSV</span>
        <span className="add-stage__channel">PDF</span>
        <span className="add-stage__channel">{t("understanding.sources.items.image")}</span>
        <span className="add-stage__channel">{t("understanding.sources.items.manual")}</span>
      </div>
    </div>
  );
}

function SeeStage() {
  const { t } = useTranslation();
  return (
    <div className="see-stage">
      <article className="see-stage__answer">
        <p className="see-stage__label">{t("understanding.how.stages.see.answerLabel")}</p>
        <strong className="see-stage__value">{t("understanding.how.stages.see.answer")}</strong>
        <span className="see-stage__detail">{t("understanding.how.stages.see.evidence")}</span>
      </article>
      <article className="see-stage__available">
        <p className="see-stage__label">{t("understanding.how.stages.see.availableLabel")}</p>
        <ul>
          <li>{t("dashboard.metrics.revenue")}</li>
          <li>{t("dashboard.stock.eyebrow")}</li>
          <li>{t("dashboard.metrics.customers")}</li>
        </ul>
      </article>
      <article className="see-stage__unavailable">
        <p className="see-stage__label">{t("understanding.how.stages.see.unavailableLabel")}</p>
        <strong className="see-stage__value">{t("understanding.how.stages.see.unavailable")}</strong>
        <span className="see-stage__detail">
          {t("understanding.how.stages.see.unavailableReason")}
        </span>
      </article>
    </div>
  );
}

function StepStage({ step, compact = false }: { step: (typeof stepKeys)[number]; compact?: boolean }) {
  if (step === "add") {
    return <AddStage />;
  }
  if (step === "confirm") {
    return <InterpretationReview compact={compact} />;
  }
  return <SeeStage />;
}

export function HowItWorks() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<(typeof stepKeys)[number]>("confirm");
  const tabsId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activateWithKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const targetIndex = getKeyboardTarget(event, currentIndex, stepKeys.length);
    if (targetIndex === null) {
      return;
    }
    event.preventDefault();
    setActiveStep(stepKeys[targetIndex]);
    tabRefs.current[targetIndex]?.focus();
  };

  return (
    <section className="how-it-works" id="how-it-works" aria-labelledby="how-title" tabIndex={-1}>
      <div className="section-heading section-heading--wide">
        <p className="section-heading__eyebrow">{t("understanding.how.eyebrow")}</p>
        <h2 id="how-title">{t("understanding.how.title")}</h2>
        <p className="section-heading__body">{t("understanding.how.body")}</p>
      </div>

      <div className="how-it-works__interactive">
        <div className="how-it-works__tabs" role="tablist" aria-label={t("understanding.how.tabLabel")}>
          {stepKeys.map((step, index) => (
            <button
              key={step}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${tabsId}-${step}-tab`}
              type="button"
              role="tab"
              aria-controls={`${tabsId}-${step}-panel`}
              aria-selected={activeStep === step}
              tabIndex={activeStep === step ? 0 : -1}
              onClick={() => setActiveStep(step)}
              onKeyDown={(event) => activateWithKeyboard(event, index)}
            >
              <span className="how-it-works__step-number">0{index + 1}</span>
              <strong>{t(`understanding.how.steps.${step}.title`)}</strong>
              <small>{t(`understanding.how.steps.${step}.body`)}</small>
            </button>
          ))}
        </div>

        <div
          className="how-it-works__stage"
          id={`${tabsId}-${activeStep}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-${activeStep}-tab`}
          tabIndex={0}
        >
          <StepStage step={activeStep} />
        </div>
      </div>

      <ol className="how-it-works__static">
        {stepKeys.map((step, index) => (
          <li key={step}>
            <div className="how-it-works__static-heading">
              <span className="how-it-works__static-number">0{index + 1}</span>
              <div>
                <h3>{t(`understanding.how.steps.${step}.title`)}</h3>
                <p className="how-it-works__static-copy">
                  {t(`understanding.how.steps.${step}.body`)}
                </p>
              </div>
            </div>
            <StepStage step={step} compact />
          </li>
        ))}
      </ol>

      <div className="how-it-works__action">
        <ButtonLink to="/demo">{t("understanding.how.action")}</ButtonLink>
      </div>
    </section>
  );
}
