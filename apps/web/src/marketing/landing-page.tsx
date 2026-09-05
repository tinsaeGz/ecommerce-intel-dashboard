import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import {
  DemoLink,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "../components/public-ui";
import { ResetSample } from "../components/reset-sample";
import { useDocumentMetadata } from "../lib/use-document-metadata";
import { DailyBriefing, ClosingInvitation } from "./merchant-story";
import { MerchantDecisions, RecordToDecision, TrustStory } from "./merchant-decisions";
import { BuyingQuestions } from "./buying-questions";
import "./landing-page.css";

export function LandingPage() {
  const { t } = useTranslation();
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!["#daily-decisions", "#how-it-works", "#plans", "#faq"].includes(hash)) return;
    const target = document.getElementById(hash.slice(1));
    target?.focus({ preventScroll: true });
    target?.scrollIntoView?.();
  }, [hash, key]);

  useDocumentMetadata(t("meta.landing.title"), t("meta.landing.description"));

  return (
    <div className="landing-page">
      <SkipLink />
      <SiteHeader />

      <main id="main-content" className="marketing-canvas">
        <section className="landing-hero" aria-labelledby="landing-hero-title">
          <div className="landing-hero__copy">
            <p className="landing-hero__eyebrow">{t("hero.eyebrow")}</p>
            <h1 id="landing-hero-title">
              <span>{t("hero.titleBefore")}</span>{" "}
              <em>{t("hero.titleEmphasis")}</em>{" "}
              <span>{t("hero.titleAfter")}</span>
            </h1>
            <p className="landing-hero__deck">{t("hero.body")}</p>

            <div className="landing-hero__actions">
              <DemoLink location="hero" />
            </div>
            <p className="landing-hero__reassurance">{t("hero.sampleNote")}</p>
          </div>
          <div className="landing-hero__visual" id="product-preview">
            <DailyBriefing />
          </div>
        </section>

        <ResetSample />
        <MerchantDecisions />
        <RecordToDecision />
        <TrustStory />
        <BuyingQuestions />
        <ClosingInvitation />
      </main>

      <SiteFooter />
    </div>
  );
}
