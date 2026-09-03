export const SUPPORTED_LOCALES = ["en", "es", "fr"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface ProblemFieldError {
  field: string;
  message: string;
  code: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  request_id: string;
  errors?: ProblemFieldError[];
}

export interface VersionResponse {
  service: "suq-insights-api";
  version: string;
}
