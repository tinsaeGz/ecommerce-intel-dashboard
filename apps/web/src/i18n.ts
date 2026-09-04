import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@suq-insights/shared-types";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import fr from "./locales/fr/common.json";

const supportedLanguages = SUPPORTED_LOCALES;
const LANGUAGE_STORAGE_KEY = "suq.preferred-language";

function isSupportedLanguage(language: string | null | undefined): language is SupportedLocale {
  return supportedLanguages.includes(language?.split("-")[0] as SupportedLocale);
}

function readStoredLanguage(): SupportedLocale | null {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(storedLanguage) ? storedLanguage : null;
  } catch {
    return null;
  }
}

function resolveInitialLanguage(): SupportedLocale {
  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  const browserLanguage = navigator.language.split("-")[0];
  return isSupportedLanguage(browserLanguage) ? browserLanguage : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    es: { common: es },
    fr: { common: fr },
  },
  lng: resolveInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  const normalizedLanguage = language.split("-")[0];
  if (!isSupportedLanguage(normalizedLanguage)) {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  } catch {
    // Language changes still work when storage is unavailable.
  }
});

function getSupportedLanguage(language = i18n.resolvedLanguage): SupportedLocale {
  const normalizedLanguage = language?.split("-")[0];
  return isSupportedLanguage(normalizedLanguage) ? normalizedLanguage : "en";
}

export {
  getSupportedLanguage,
  i18n,
  LANGUAGE_STORAGE_KEY,
  supportedLanguages,
};
