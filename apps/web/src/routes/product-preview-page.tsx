import { useTranslation } from "react-i18next";

import {
  ButtonLink,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "../components/public-ui";
import { useDocumentMetadata } from "../lib/use-document-metadata";

export function ProductPreviewPage() {
  const { t } = useTranslation();

  useDocumentMetadata(t("meta.app.title"), t("meta.app.description"));

  return (
    <div className="public-route">
      <SkipLink />
      <SiteHeader />
      <main className="public-route__main public-route__main--center" id="main-content">
        <section className="access-preview" aria-labelledby="product-preview-title">
          <span className="access-preview__mark" aria-hidden="true">
            S
          </span>
          <p className="public-route__eyebrow">{t("appPreview.eyebrow")}</p>
          <h1 id="product-preview-title">{t("appPreview.title")}</h1>
          <p className="public-route__body">{t("appPreview.body")}</p>
          <div className="public-route__actions">
            <ButtonLink to="/demo">{t("actions.exploreDemo")}</ButtonLink>
            <ButtonLink to="/signup" variant="secondary">
              {t("actions.previewSignup")}
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
