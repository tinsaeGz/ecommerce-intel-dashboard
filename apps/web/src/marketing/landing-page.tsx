import { useTranslation } from "react-i18next";

import {
  Announcement,
  ButtonLink,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "../components/public-ui";
import { useDocumentMetadata } from "../lib/use-document-metadata";
import { DailyBriefing, MerchantOutcomes, ClosingInvitation } from "./merchant-story";
import { HeroRecordReview } from "./hero-record-review";
import {
  HowItWorks,
  ProblemFraming,
  SourceExplorer,
} from "./product-understanding";
import "./landing-page.css";

const heroSources = ["csv", "excel", "pdf", "photo"] as const;

export function LandingPage() {
  const { t } = useTranslation();

  useDocumentMetadata(t("meta.landing.title"), t("meta.landing.description"));

  return (
    <div className="landing-page">
      <SkipLink />
      <Announcement />
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
              <ButtonLink to="/signup">{t("actions.startFree")}</ButtonLink>
              <ButtonLink to="/demo" variant="secondary">
                {t("actions.exploreDemo")}
              </ButtonLink>
            </div>

            <div className="landing-hero__reassurance">
              <p>{t("hero.languages")}</p>
              <span aria-hidden="true" />
              <ul aria-label={t("hero.sourcesLabel")}>
                {heroSources.map((source) => (
                  <li key={source}>{t(`hero.sources.${source}`)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="landing-hero__companion">
            <HeroRecordReview />
          </div>

          <div className="landing-hero__visual" id="product-preview">
            <DailyBriefing />
          </div>
        </section>

        <SourceExplorer />
        <ProblemFraming />
        <HowItWorks />
        <MerchantOutcomes />
        <ClosingInvitation />
      </main>

      <SiteFooter />
    </div>
  );
}
