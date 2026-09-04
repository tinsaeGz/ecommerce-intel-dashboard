import type { SupportedLocale } from "@suq-insights/shared-types";

const localeTags: Record<SupportedLocale, string> = {
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
};

export function formatCurrency(
  value: number,
  currency: string,
  locale: SupportedLocale,
) {
  return new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale: SupportedLocale) {
  return new Intl.NumberFormat(localeTags[locale]).format(value);
}

export function formatPercent(value: number, locale: SupportedLocale) {
  return new Intl.NumberFormat(localeTags[locale], {
    style: "percent",
    maximumFractionDigits: 0,
    signDisplay: "always",
  }).format(value / 100);
}

export function formatDemoDate(
  value: Date,
  locale: SupportedLocale,
  timeZone: string,
) {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    month: "short",
    timeZone,
  }).format(value);
}
