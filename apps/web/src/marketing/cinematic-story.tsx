import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { ButtonLink } from "../components/public-ui";
import { ResetSample } from "../components/reset-sample";
import { emitJourneyEvent } from "../lib/journey-events";
import { landingDemo } from "../lib/demo-data";
import { DecisionExample, SampleSale, type DecisionKind } from "./merchant-decisions";
import { HeroRecordReview } from "./hero-record-review";
import "./cinematic-story.css";

const chapters = ["day", "evidence", "sale"] as const;
type Chapter = (typeof chapters)[number];
const chapterIds: Record<Chapter, string> = { day: "daily-decisions", evidence: "how-it-works", sale: "next-sale" };

function DayScene() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState<DecisionKind>("sales");
  return <div className="day-scene">
    <div className="day-scene__questions" role="group" aria-label={t("cinematic.questions")}>
      {(["sales", "stock", "customers"] as const).map(kind => <button key={kind} type="button" aria-pressed={question === kind} onClick={() => setQuestion(kind)}>{t(`cinematic.topics.${kind}`)}</button>)}
    </div>
    <DecisionExample kind={question} />
  </div>;
}

export function CinematicStory() {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const [active, setActive] = useState<Chapter>(() => chapters.find(item => `#${chapterIds[item]}` === hash) ?? "day");
  const [enhanced, setEnhanced] = useState(false);
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia?.("(min-width: 72rem) and (min-height: 56rem)");
    const update = () => {
      // Enlarged text gets the sequential layout too, with no clipped sticky scene.
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
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

  const choose = (chapter: Chapter) => {
    setActive(chapter);
    const target = document.getElementById(chapterIds[chapter]);
    if (!enhanced) target?.focus({ preventScroll: true });
    target?.scrollIntoView?.({ block: "start" });
  };

  return <section className="cinematic-story" ref={storyRef} data-enhanced={enhanced} data-chapter={active} aria-labelledby="cinematic-title">
    <header className="story-heading cinematic-story__heading">
      <p className="story-eyebrow">{t("cinematic.eyebrow")}</p>
      <h2 id="cinematic-title">{t("stories.title")}</h2>
      <p>{t("cinematic.intro")}</p>
    </header>
    <div className="cinematic-toolbar">
      <div className="cinematic-controls" role="group" aria-label={t("cinematic.controls")}>
        {chapters.map((chapter, index) => <button type="button" key={chapter} aria-pressed={active === chapter} aria-controls={`scene-${chapter}`} onClick={() => choose(chapter)}><span aria-hidden="true">0{index + 1}</span>{t(`cinematic.${chapter}.label`)}</button>)}
      </div>
      <ResetSample />
    </div>
    <div className="cinematic-layout">
      {chapters.map((chapter, index) => {
        const inactive = enhanced && active !== chapter;
        return <div className="cinematic-chapter" key={chapter}>
          <article className="cinematic-copy" data-chapter={chapter} id={chapterIds[chapter]} tabIndex={-1} onFocus={() => setActive(chapter)} aria-labelledby={`chapter-${chapter}`}>
            <p className="story-eyebrow">{t("cinematic.chapter", { number: index + 1 })}</p>
            <h3 id={`chapter-${chapter}`}>{t(`cinematic.${chapter}.title`)}</h3>
            <p>{t(`cinematic.${chapter}.body`)}</p>
            <p className="cinematic-copy__bridge">{t(`cinematic.${chapter}.bridge`)}</p>
            {chapter === "sale" && <ButtonLink to="/demo" variant="primary" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "how-it-works" })}>{t("cinematic.continue")}</ButtonLink>}
          </article>
          <div className="cinematic-pane" id={`scene-${chapter}`} data-active={!inactive} onFocusCapture={() => setActive(chapter)} aria-hidden={inactive || undefined} inert={inactive}>
            <p className="cinematic-pane__caption"><span>{landingDemo.workspace}</span><span>{t("demo.sampleLabel")} · 0{index + 1} / 03</span></p>
            {chapter === "day" ? <DayScene /> : chapter === "evidence" ? <>
              <HeroRecordReview />
              <ButtonLink to="/demo#demo-review" variant="quiet" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "trust" })}>{t("hero.reviewAction")}</ButtonLink>
            </> : <>
              <SampleSale />
              <p className="cinematic-pane__scope">{t("cinematic.historicalScope")}</p>
              <ButtonLink to="/demo#demo-sources" variant="quiet" onClick={() => emitJourneyEvent("landing_cta_selected", { location: "sources" })}>{t("stories.entry.explore")}</ButtonLink>
            </>}
          </div>
        </div>;
      })}
    </div>
  </section>;
}
