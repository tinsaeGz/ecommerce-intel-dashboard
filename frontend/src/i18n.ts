import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import fr from "./locales/fr/common.json";

const supportedLanguages = ["en", "es", "fr"] as const;
const browserLanguage = navigator.language.split("-")[0];
const initialLanguage = supportedLanguages.includes(
  browserLanguage as (typeof supportedLanguages)[number],
)
  ? browserLanguage
  : "en";

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    es: { common: es },
    fr: { common: fr },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export { supportedLanguages };
