import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ButtonLink,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "../components/public-ui";
import { ResetSample } from "../components/reset-sample";
import { useDocumentMetadata } from "../lib/use-document-metadata";
import { emitJourneyEvent, useDemoVisit } from "../lib/journey-events";
import { SourceExplorer } from "../marketing/product-understanding";
import { SampleSale } from "../marketing/merchant-decisions";
import { useSampleScenario } from "../lib/sample-scenario";
import { HeroRecordReview } from "../marketing/hero-record-review";
import { DashboardPreview } from "../marketing/dashboard-preview";
import "./demo-page.css";

export function DemoPage() {
  const { t } = useTranslation();
  useDemoVisit();
  const { state: { hasIdentity }, dispatch } = useSampleScenario();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#demo-review" && hash !== "#demo-sources") return;
    const target = document.querySelector<HTMLDetailsElement>(hash);
    if (target) {
      target.open = true;
      target.querySelector("summary")?.focus({ preventScroll: true });
      target.scrollIntoView?.();
    }
  }, [hash]);

  useDocumentMetadata(t("meta.demo.title"), t("meta.demo.description"));

  return (
    <div className="public-route">
      <SkipLink />
      <SiteHeader />
      <main className="public-route__main" id="main-content">
        <div className="public-route__intro">
          <p className="public-route__eyebrow">{t("demo.eyebrow")}</p>
          <h1>{t("demo.title")}</h1>
          <p className="public-route__body">{t("demo.body")}</p>
          <div className="public-route__actions">
            <a className="button-link" data-variant="primary" href="#demo-review" onClick={() => {
              const review = document.querySelector<HTMLDetailsElement>("#demo-review");
              if (review) { review.open = true; review.querySelector("summary")?.focus({ preventScroll: true }); }
            }}>{t("hero.reviewAction")}</a>
            <ButtonLink to="/" variant="secondary">
              {t("actions.backHome")}
            </ButtonLink>
          </div>
        </div>

        <ResetSample />
        <label className="story-toggle"><input type="checkbox" checked={hasIdentity} onChange={event => dispatch({ type: "identity", value: event.target.checked })} />{t("stories.customers.toggle")}</label>
        <section className="demo-stage" aria-labelledby="demo-stage-title">
          <div className="demo-stage__note">
            <span>{t("demo.sampleLabel")}</span>
            <h2 id="demo-stage-title">{t("demo.sampleTitle")}</h2>
            <p className="demo-stage__body">{t("demo.sampleBody")}</p>
          </div>
          <DashboardPreview variant="full" />
        </section>
        <details className="demo-review" id="demo-review" onToggle={(event) => {
          if (event.currentTarget.open) emitJourneyEvent("model_review_opened", { location: "demo" });
        }}>
          <summary>{t("hero.reviewAction")}</summary>
          <HeroRecordReview />
        </details>
        <details className="demo-review" id="demo-sources">
          <summary>{t("stories.entry.explore")}</summary>
          <SourceExplorer />
        </details>
        <details className="demo-review" id="demo-workflow">
          <summary>{t("stories.demo.workflow")}</summary>
          <SampleSale />
          <p className="cinematic-pane__scope">{t("cinematic.historicalScope")}</p>
        </details>
      </main>
      <SiteFooter />
    </div>
  );
}
