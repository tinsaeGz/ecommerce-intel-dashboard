# Landing conversion revision — PR 1 evidence

Date: 2026-09-05. Branch: `fix/tensu/landing-conversion-journey`.

Implements PR 1 and amendments A1, A2, A4 (hero), A5, and A7 from the [revision plan](../landing-page-revision-plan.md). The broader narrative, plan comparison, FAQ, live-entry sample, and collection infrastructure remain subsequent work.

## Behavior

- Header, hero, briefing, how-it-works, and closing CTAs open the working demo. Signup/login preview routes remain reachable directly, but are not promoted as working account actions.
- The announcement and the stacked hero chart/review are removed. A dated compact briefing now shows the question, one answer sentence, revenue with comparison, stock attention, returning customers, and one demo action.
- The demo preserves chart/metric/table/stock interactions and offers a keyboard-operable field-review disclosure with confirmation and reset. Its explicit review link opens the disclosure and moves focus to its summary.
- Copy changes ship together in English, Spanish, and French. Original Spanish sample records and EUR amounts are preserved; UI language only changes presentation formatting.
- Events are schema-validated and retained only in bounded tab memory. No event collector, persistent analytics storage, email capture, or anonymous file processing is enabled.
- Enlarged text can wrap without the old fixed minimum page width or clipped how-it-works content. The menu icon remains visible under forced colors.

## First-screen evidence

At 390×844, default text size, Chromium: all three headlines occupy approximately three lines; the primary CTA and the complete revenue tile with comparison fit in the first screen. Tile bottoms are rounded CSS-pixel positions after the entrance animation completes.

| Locale | Revenue tile bottom | Screenshot |
|---|---|---|
| English | 727px | [English, 390×844](landing-conversion/en-390.png) |
| Spanish | 753px | [Spanish, 390×844](landing-conversion/es-390.png) |
| French | 777px | [French, 390×844](landing-conversion/fr-390.png) |

[Desktop, 1440×844](landing-conversion/en-1440.png) shows the top-aligned briefing and headline. These are local renderings, not production deployment evidence.

## Validation

- `npm run lint --workspace @suq-insights/web` — passed.
- `npm run typecheck --workspace @suq-insights/web` — passed.
- `npm run test --workspace @suq-insights/web` — 49 tests passed, including all-locale hero → demo → review journeys, focus behavior, original review/metric interactions, event rejection, bounded memory, and StrictMode visit deduplication.
- `npm run build:web` — passed; initial JavaScript 111.0 KB gzipped against the 200 KB budget. The full chart and review load with the demo route.
- `npm run lint:docs` and Git whitespace checks — passed.
- Browser review at 320, 390, 768, and 1440px in English, Spanish, and French — no page overflow, no JavaScript errors, and no axe WCAG 2 A/AA or 2.1 A/AA violations after entrance motion finishes. Contrast checks were enabled in the browser; jsdom tests do not measure contrast.
- At 390px with 200% root text sizing — no page overflow in all three locales. Content is allowed to extend vertically; the first-screen target applies only at default text size.
- Reduced motion and the expanded demo review — browser checks passed in all three locales. Keyboard menu opening, initial focus, Escape, and focus restoration passed in the final browser check.
- Forced colors — manually inspected rendered content and controls. Axe's forced-color emulation reports contrast findings on the existing dark narrative/closing sections; normal-color contrast checks pass. Do not describe this as a clean automated forced-color audit or full WCAG certification.
- With 4× CPU slowdown, 150ms network latency, and approximately 1.6 Mbps download throughput — opening the demo and keyboard-opening its review succeeded. This is an emulated interaction check, not a production performance benchmark.
- `SUQ-INSIGHTS-UI-UX-CONCEPT.pdf` regenerated from its updated Markdown source; metadata and extracted text verified, including the revised hero recommendation and event boundary.

Unavailable before launch: a real mid-range Android device, native-language reviewer sign-off, NVDA/VoiceOver testing, target-merchant usability sessions, and deployed conversion measurements. No backend or migration gate is claimed by this frontend checkpoint.

## Requirement traceability and next step

SDLC §1.2 supplies the merchant outcomes; FR-A-1/2 constrain account promises; FR-U-4/5/12 constrain the review and unavailable states; FR-D-12 governs localized dates and amounts; NFR-5/6/9/10 govern accessibility, localization, privacy, and initial weight. These are marketing demonstrations, not completion of the corresponding backend capabilities.

Next: review and merge this PR through the normal CI gate, then implement PR 2's distinct sales/stock/customer stories and live-entry example. The anonymous-file ADR remains proposed and is not implemented here.
