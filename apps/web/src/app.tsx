import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";

import { LandingPage } from "./marketing/landing-page";

const DemoPage = lazy(() =>
  import("./routes/demo-page").then((module) => ({ default: module.DemoPage })),
);
const PreviewAccessPage = lazy(() =>
  import("./routes/preview-access-page").then((module) => ({
    default: module.PreviewAccessPage,
  })),
);
const ProductPreviewPage = lazy(() =>
  import("./routes/product-preview-page").then((module) => ({
    default: module.ProductPreviewPage,
  })),
);

function LanguageDocumentSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage?.split("-")[0] ?? "en";
  }, [i18n.resolvedLanguage]);

  return null;
}

function RouteLoadingState() {
  const { t } = useTranslation();

  return (
    <main className="route-loading" aria-live="polite">
      <p>{t("common.loading")}</p>
    </main>
  );
}

export function App() {
  return (
    <>
      <LanguageDocumentSync />
      <Suspense fallback={<RouteLoadingState />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/signup" element={<PreviewAccessPage mode="signup" />} />
          <Route path="/login" element={<PreviewAccessPage mode="login" />} />
          <Route path="/app/*" element={<ProductPreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
