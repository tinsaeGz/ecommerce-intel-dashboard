import {
  type KeyboardEvent,
  useId,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";

import "./product-understanding.css";

import { sourceKeys, useSampleScenario, type SampleSource } from "../lib/sample-scenario";

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
  const { state: { source: activeSource }, dispatch } = useSampleScenario();
  const setActiveSource = (value: SampleSource) => dispatch({ type: "source", value });
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
