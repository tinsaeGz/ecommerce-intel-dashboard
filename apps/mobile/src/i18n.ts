import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@suq-insights/shared-types";
import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import fr from "./locales/fr/common.json";

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
const initialLanguage = SUPPORTED_LOCALES.includes(
  deviceLanguage as SupportedLocale,
)
  ? deviceLanguage
  : "en";
const i18n = createInstance();

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

export { i18n };
