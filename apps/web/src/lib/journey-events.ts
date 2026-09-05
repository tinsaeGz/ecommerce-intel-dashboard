import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { getSupportedLanguage, i18n } from "../i18n";

const schemas = {
  landing_cta_selected: { location: ["header", "mobile-menu", "hero", "briefing", "closing", "how-it-works", "sources", "trust"] },
  demo_started: { location: ["demo"] },
  model_review_opened: { location: ["demo", "how-it-works"] },
} as const;

export type JourneyName = keyof typeof schemas;
export interface JourneyEvent {
  readonly name: JourneyName;
  readonly properties: Readonly<{ locale: "en" | "es" | "fr"; location: string }>;
}

export interface JourneySink {
  // Treat input as untrusted even when callers have TypeScript types.
  emit(name: string, properties: Record<string, unknown>): boolean;
}

export function createLocalJourneySink() {
  const events: JourneyEvent[] = [];
  return {
    emit(name: string, properties: Record<string, unknown>) {
      if (!Object.hasOwn(schemas, name)) return false;
      const schema = schemas[name as JourneyName];
      const keys = Object.keys(properties);
      if (keys.length !== 2 || !keys.includes("locale") || !keys.includes("location")) return false;
      if (typeof properties.locale !== "string" || !["en", "es", "fr"].includes(properties.locale)) return false;
      if (!(schema.location as readonly unknown[]).includes(properties.location)) return false;
      events.push(Object.freeze({
        name: name as JourneyName,
        properties: Object.freeze({ locale: properties.locale as "en" | "es" | "fr", location: properties.location as string }),
      }));
      // Bounded, tab-local memory only: no cookies, storage, logging, or network.
      if (events.length > 100) events.shift();
      return true;
    },
    snapshot: () => [...events],
    clear: () => { events.length = 0; },
  } satisfies JourneySink & { snapshot(): JourneyEvent[]; clear(): void };
}

export const localJourneySink = createLocalJourneySink();

export function emitJourneyEvent(name: JourneyName, properties: { location: string }) {
  return localJourneySink.emit(name, { ...properties, locale: getSupportedLanguage(i18n.resolvedLanguage) });
}

export function useDemoVisit() {
  const { key, pathname } = useLocation();
  const previousVisit = useRef<string | null>(null);
  useEffect(() => {
    if (previousVisit.current === key) return;
    previousVisit.current = key;
    if (pathname === "/demo") emitJourneyEvent("demo_started", { location: "demo" });
  }, [key, pathname]);
}
