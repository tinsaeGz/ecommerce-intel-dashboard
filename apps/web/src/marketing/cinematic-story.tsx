import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { ButtonLink } from "../components/public-ui";
import { ResetSample } from "../components/reset-sample";
import { emitJourneyEvent } from "../lib/journey-events";
import { landingDemo } from "../lib/demo-data";
import { DayEvidence, DesktopMonitor, StockMovement, WorkspaceHeading } from "./scene-material";
import { DecisionExample, SampleSale, type DecisionKind } from "./merchant-decisions";
import { HeroRecordReview } from "./hero-record-review";
import "./cinematic-story.css";

const chapters = ["day", "evidence", "sale"] as const;
type Chapter = (typeof chapters)[number];
const chapterIds: Record<Chapter, string> = { day: "daily-decisions", evidence: "how-it-works", sale: "next-sale" };

function DayScene({ question, onQuestion }: { question: DecisionKind; onQuestion: (kind: DecisionKind) => void }) {
  const { t } = useTranslation();
  return <div className="day-scene">
    <div className="day-scene__questions" role="group" aria-label={t("cinematic.questions")}>
      {(["sales", "stock", "customers"] as const).map(kind => <button key={kind} type="button" aria-pressed={question === kind} onClick={() => onQuestion(kind)}>{t(`cinematic.topics.${kind}`)}</button>)}
    </div>
    <DayEvidence kind={question} />
    <DecisionExample kind={question} compact />
  </div>;
}

export function CinematicStory() {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const [active, setActive] = useState<Chapter>(() => chapters.find(item => `#${chapterIds[item]}` === hash) ?? "day");
  const [enhanced, setEnhanced] = useState(false);
  const storyRef = useRef<HTMLElement>(null);
  const [question, setQuestion] = useState<DecisionKind>("sales");
  useEffect(() => {
    const media = window.matchMedia?.("(min-width: 72rem) and (min-height: 56rem)");
    let lastGeometry = "";
    const update = () => {
      // Enlarged text gets the sequential layout too, with no clipped sticky scene.
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const geometry = `${window.innerWidth}/${window.innerHeight}/${rootSize}`;
      if (geometry === lastGeometry) return;
      lastGeometry = geometry;
      setEnhanced(Boolean(media?.matches && window.innerHeight >= rootSize * 56 && typeof IntersectionObserver !== "undefined"));
    };
    update();
    media?.addEventListener("change", update);
    window.addEventListener("resize", update);
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resize?.observe(document.documentElement);
    return () => { media?.removeEventListener("change", update); window.removeEventListener("resize", update); resize?.disconnect(); };
  }, []);


  useEffect(() => {
    if (!enhanced) return;
    const nodes = storyRef.current?.querySelectorAll<HTMLElement>(".cinematic-copy");
    if (!nodes) return;
    const visible = new Map<Element, boolean>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
      // Scrolling must never hide the control a visitor is operating.
      if (storyRef.current?.querySelector(".cinematic-pane:focus-within")) return;
      const candidate = Array.from(nodes).filter(node => visible.get(node)).sort((a, b) => Math.abs(a.getBoundingClientRect().top - window.innerHeight * 0.25) - Math.abs(b.getBoundingClientRect().top - window.innerHeight * 0.25))[0];
      if (candidate) setActive(candidate.dataset.chapter as Chapter);
    }, { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [enhanced]);

  useEffect(() => {
    if (!enhanced || typeof ResizeObserver === "undefined") return;
    // A translated or expanded scene must not trap controls below the viewport.
    // Retry enhancement only when viewport/font geometry changes, preventing a
    // layout feedback loop when the sequential fallback itself gets taller.
    const nodes = storyRef.current?.querySelectorAll<HTMLElement>(".cinematic-pane");
    if (!nodes) return;
    const fits = () => {
      if (Array.from(nodes).some(node => node.offsetHeight > window.innerHeight - (parseFloat(getComputedStyle(node).top) || 0) - 16)) setEnhanced(false);
    };
    const resize = new ResizeObserver(fits);
    nodes.forEach(node => resize.observe(node));
    fits();
    return () => resize.disconnect();
  }, [enhanced]);

  const choose = (chapter: Chapter, moveFocus = false) => {
    setActive(chapter);
    if (moveFocus) {
      // A next-step button becomes inert with its old pane. Move keyboard focus
      // to the always-present chapter control before hiding that pane.
      storyRef.current?.querySelector<HTMLButtonElement>(`[data-control="${chapter}"]`)?.focus({ preventScroll: true });
    }
    const target = document.getElementById(chapterIds[chapter]);
    if (!enhanced) target?.focus({ preventScroll: true });
    target?.scrollIntoView?.({ block: "start" });
  };

  return <section className="cinematic-story" ref={storyRef} data-enhanced={enhanced} data-chapter={active} aria-labelledby="cinematic-title">
    <header className="story-heading cinematic-story__heading">
      <p className="story-eyebrow">{t("cinematic.eyebrow")}</p>
      <h2 id="cinematic-title">{t("theatre.title")} <em>{t("theatre.emphasis")}</em></h2>
      <p>{t("theatre.intro")}</p>
    </header>
    <div className="cinematic-toolbar">
      <div className="cinematic-controls" role="group" aria-label={t("cinematic.controls")}>
        {chapters.map((chapter, index) => <button type="button" key={chapter} data-control={chapter} aria-pressed={active === chapter} aria-controls={`scene-${chapter}`} onClick={() => choose(chapter)}><span aria-hidden="true">0{index + 1}</span>{t(`cinematic.${chapter}.label`)}</button>)}
      </div>
      <ResetSample />
    </div>
    <div className="cinematic-layout">
      {chapters.map((chapter, index) => {
        const inactive = enhanced && active !== chapter;
        return <div className="cinematic-chapter" key={chapter}>
          <article className="cinematic-copy" data-chapter={chapter} id={chapterIds[chapter]} tabIndex={-1} onFocus={() => setActive(chapter)} aria-labelledby={`chapter-${chapter}`}>
            <p className="story-eyebrow">{t("cinematic.chapter", { number: index + 1 })}</p>
            <h3 id={`chapter-${chapter}`}><span>{t(`theatre.${chapter}.title`)}</span> <em>{t(`theatre.${chapter}.emphasis`)}</em></h3>
            <p>{t(`theatre.${chapter}.body`)}</p>
            <p className="cinematic-copy__bridge">{t(`theatre.${chapter}.bridge`)}</p>
            {chapter === "sale" && <ButtonLink to="/demo" variant="primary" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "how-it-works" })}>{t("cinematic.continue")}</ButtonLink>}
          </article>
          <div className="cinematic-pane" data-scene={chapter} id={`scene-${chapter}`} data-active={!inactive} onFocusCapture={() => setActive(chapter)} aria-hidden={inactive || undefined} inert={inactive}>
            <div className="scene-set">
            <DesktopMonitor>
            <div className="scene-workspace">
            <WorkspaceHeading chapter={chapter} />
            {chapter === "day" ? <DayScene question={question} onQuestion={setQuestion} /> : chapter === "evidence" ? <>
              <HeroRecordReview compact />
              <ButtonLink to="/demo#demo-review" variant="quiet" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "trust" })}>{t("hero.reviewAction")}</ButtonLink>
            </> : <>
              <StockMovement />
              <SampleSale />
              <p className="cinematic-pane__scope">{t("cinematic.historicalScope")}</p>
              <ButtonLink to="/demo#demo-sources" variant="quiet" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "sources" })}>{t("stories.entry.explore")}</ButtonLink>
            </>}
            </div>
            </DesktopMonitor>
            {chapter !== "sale" && <button className="cinematic-next button-link" data-variant="primary" type="button" onClick={() => choose(chapter === "day" ? "evidence" : "sale", true)}>{t(chapter === "day" ? "theatre.followEvidence" : "theatre.trySale")} <span aria-hidden="true">→</span></button>}
            <p className="cinematic-pane__caption"><span>{landingDemo.workspace}</span><span>{t("demo.sampleLabel")}</span></p>
            </div>
          </div>
        </div>;
      })}
    </div>
  </section>;

}
