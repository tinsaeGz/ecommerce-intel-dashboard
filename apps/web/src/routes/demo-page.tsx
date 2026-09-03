import { useTranslation } from "react-i18next";

import {
  ButtonLink,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "../components/public-ui";
import { useDocumentMetadata } from "../lib/use-document-metadata";
import { DashboardPreview } from "../marketing/dashboard-preview";

export function DemoPage() {
  const { t } = useTranslation();

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
            <ButtonLink to="/signup">{t("actions.previewSignup")}</ButtonLink>
            <ButtonLink to="/" variant="secondary">
              {t("actions.backHome")}
            </ButtonLink>
          </div>
        </div>

        <section className="demo-stage" aria-labelledby="demo-stage-title">
          <div className="demo-stage__note">
            <span>{t("demo.sampleLabel")}</span>
            <h2 id="demo-stage-title">{t("demo.sampleTitle")}</h2>
            <p className="demo-stage__body">{t("demo.sampleBody")}</p>
          </div>
          <DashboardPreview variant="full" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
