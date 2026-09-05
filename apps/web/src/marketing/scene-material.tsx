import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { getSupportedLanguage } from "../i18n";
import { landingDemo } from "../lib/demo-data";
import { formatDemoDate } from "../lib/format";
import { coffeeStock, returningCount, salesComparison, sampleStock } from "../lib/merchant-story-data";
import { useSampleScenario } from "../lib/sample-scenario";
import type { DecisionKind } from "./merchant-decisions";

export function DesktopMonitor({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return <div className="desktop-monitor">
    <div className="desktop-monitor__case">
      <div className="desktop-monitor__camera" aria-hidden="true" />
      <div className="desktop-monitor__screen">
        <div className="desktop-monitor__window" aria-hidden="true">
          <span className="desktop-monitor__window-dots"><i /><i /><i /></span>
          <span>Suq Insights <span className="desktop-monitor__window-context">— {t("theatre.windowTitle")}</span></span>
          <span className="desktop-monitor__window-mark" />
        </div>
        {children}
      </div>
      <div className="desktop-monitor__chin" aria-hidden="true"><span>suq</span><i /></div>
    </div>
    <div className="desktop-monitor__stand" aria-hidden="true"><span /><i /></div>
  </div>;
}

export function WorkspaceHeading({ chapter }: { chapter: "day" | "evidence" | "sale" }) {
  const { t, i18n } = useTranslation();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);
  return <header className="scene-workspace__header">
    <span className="scene-workspace__brand" aria-label="Suq">s.</span>
    <div><strong>{landingDemo.workspace}</strong><p>{t(`theatre.${chapter}.workspace`)}</p></div>
    <time className="scene-workspace__date" dateTime={landingDemo.date.toISOString()}>{formatDemoDate(landingDemo.date, locale, landingDemo.timeZone)}</time>
  </header>;
}

// These are visualizations of the existing fictional aggregates, never generated
// transaction rows. Accessible evidence and controls follow in DecisionExample.
export function DayEvidence({ kind }: { kind: DecisionKind }) {
  const { t, i18n } = useTranslation();
  const locale = getSupportedLanguage(i18n.resolvedLanguage);
  const { state: { hasIdentity } } = useSampleScenario();
  const money = (cents: number) => new Intl.NumberFormat(locale, { style: "currency", currency: landingDemo.currency, maximumFractionDigits: 2 }).format(cents / 100);

  if (kind === "sales") return <figure className="scene-bars">
    <figcaption><span>{t("stories.sales.caption")}</span><strong>{money(landingDemo.revenue * 100)}</strong></figcaption>
    <p className="scene-bars__legend"><span>{t("stories.sales.before")}</span><span>{t("stories.sales.now")}</span></p>
    {salesComparison.map(row => <div className="scene-bars__row" key={row.product}>
      <div><span>{t(`stories.products.${row.product}`)}</span><strong>{money(row.currentCents)}</strong></div>
      <div className="scene-bars__tracks" aria-hidden="true">
        <span data-period="previous" style={{ "--bar-width": `${row.previousCents / 5000}%` } as CSSProperties} />
        <span data-period="current" style={{ "--bar-width": `${row.currentCents / 5000}%` } as CSSProperties} />
      </div>
      <span className="visually-hidden">{t("stories.sales.before")}: {money(row.previousCents)}</span>
    </div>)}
  </figure>;

  if (kind === "stock") return <div className="scene-ledger">
    <p className="scene-ledger__label">GC-118 · {t("stories.products.coffee")}</p>
    <dl className="scene-ledger__equation">
      <div><dt>{t("stories.stock.observed")}</dt><dd>{coffeeStock.observed}</dd></div>
      <div><dt>{t("stories.stock.delivered")}</dt><dd>+{coffeeStock.deliveries}</dd></div>
      <div><dt>{t("stories.stock.sold")}</dt><dd>−{coffeeStock.sold}</dd></div>
    </dl>
  </div>;

  if (!hasIdentity) return <div className="scene-customers" data-available="false">
    <p>{t("stories.customers.missing")}</p>
  </div>;

  return <div className="scene-customers" data-available={hasIdentity}>
    <p>{t("theatre.customerHistory")}</p>
    <div className="scene-customers__marks" aria-hidden="true">{Array.from({ length: landingDemo.customers }, (_, index) => <span key={index} data-returning={index < returningCount} />)}</div>
    <p>{t("theatre.customerLegend")}</p>
  </div>;
}

export function StockMovement() {
  const { t } = useTranslation();
  const { state: { sale } } = useSampleScenario();
  const recorded = sale === "recorded";
  return <div className="scene-inventory" data-sale={sale} role="group" aria-label={t("theatre.balance")}>
    <p className="scene-ledger__label">GC-118 · {t("stories.products.coffee")}</p>
    <div className="scene-inventory__balance"><span>{t("theatre.balance")}</span><strong>{recorded ? sampleStock - 1 : sampleStock}<small>{t("theatre.units")}</small></strong></div>
    <div className="scene-inventory__units" aria-hidden="true">{Array.from({ length: sampleStock }, (_, index) => <span key={index} data-last={index === sampleStock - 1} />)}</div>
    <dl className="scene-inventory__movement">
      <div><dt>{t("theatre.cutoff")}</dt><dd>{sampleStock}</dd></div>
      <div><dt>{t(sale === "idle" ? "theatre.noMovement" : sale === "review" ? "theatre.draftMovement" : "theatre.confirmedMovement")}</dt><dd>{sale === "idle" ? "—" : "−1"}</dd></div>
    </dl>
  </div>;
}
