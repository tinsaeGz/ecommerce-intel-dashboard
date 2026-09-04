import { useTranslation } from "react-i18next";

import {
  ButtonLink,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "../components/public-ui";
import { useDocumentMetadata } from "../lib/use-document-metadata";

interface PreviewAccessPageProps {
  mode: "login" | "signup";
}

export function PreviewAccessPage({ mode }: PreviewAccessPageProps) {
  const { t } = useTranslation();
  const prefix = `access.${mode}`;

  useDocumentMetadata(t(`meta.${mode}.title`), t(`meta.${mode}.description`));

  return (
    <div className="public-route">
      <SkipLink />
      <SiteHeader />
      <main className="public-route__main public-route__main--center" id="main-content">
        <section className="access-preview" aria-labelledby="access-preview-title">
          <span className="access-preview__mark" aria-hidden="true">
            ↗
          </span>
          <p className="public-route__eyebrow">{t(`${prefix}.eyebrow`)}</p>
          <h1 id="access-preview-title">{t(`${prefix}.title`)}</h1>
          <p className="public-route__body">{t(`${prefix}.body`)}</p>
          <div className="public-route__actions">
            <ButtonLink to="/demo">{t("actions.exploreDemo")}</ButtonLink>
            <ButtonLink to="/" variant="secondary">
              {t("actions.backHome")}
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
