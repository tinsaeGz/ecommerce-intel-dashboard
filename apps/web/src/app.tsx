import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";

import { supportedLanguages } from "./i18n";

const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
} as const;

function FoundationPage() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  }, [i18n.resolvedLanguage]);

  const selectLanguage = (language: (typeof supportedLanguages)[number]) => {
    void i18n.changeLanguage(language);
  };

  return (
    <main className="foundation">
      <nav className="foundation__nav" aria-label={t("language.label")}>
        <a className="foundation__brand" href="/" aria-label={t("brand.homeLabel")}>
          <span className="foundation__mark" aria-hidden="true">
            S
          </span>
          Suq Insights
        </a>

        <div className="language-switcher">
          {supportedLanguages.map((language) => (
            <button
              className="language-switcher__button"
              data-active={i18n.resolvedLanguage === language}
              key={language}
              onClick={() => selectLanguage(language)}
              type="button"
            >
              {languageNames[language]}
            </button>
          ))}
        </div>
      </nav>

      <section className="foundation__hero" aria-labelledby="foundation-title">
        <p className="foundation__eyebrow">{t("hero.eyebrow")}</p>
        <h1 id="foundation-title">{t("hero.title")}</h1>
        <p className="foundation__deck">{t("hero.body")}</p>
        <span className="foundation__status">{t("hero.status")}</span>
      </section>

      <section className="foundation__questions" aria-label={t("questions.label")}>
        {(["selling", "stock", "customers"] as const).map((question, index) => (
          <article className="question-card" key={question}>
            <span className="question-card__number" aria-hidden="true">
              0{index + 1}
            </span>
            <h2>{t(`questions.${question}.title`)}</h2>
            <p>{t(`questions.${question}.body`)}</p>
          </article>
        ))}
      </section>

      <footer className="foundation__footer">
        <p>{t("footer.note")}</p>
      </footer>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="*" element={<FoundationPage />} />
    </Routes>
  );
}
