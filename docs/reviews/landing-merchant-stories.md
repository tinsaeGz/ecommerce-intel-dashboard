# Landing merchant stories — PR 2 evidence

Date: 2026-09-05. Branch: `feat/tensu/landing-merchant-stories`.

Implements PR 2 and amendments A3 and A6 from the [revision plan](../landing-page-revision-plan.md). Depends on [PR #5](https://github.com/tinsaeGz/ecommerce-intel-dashboard/pull/5), which contains PR 1 of that plan. Review and merge those changes first; this checkpoint remains for the owner to merge.

## Behavior and evidence

- Sales compares integer-cent fictional aggregates: €12,480 today versus €10,576.27 at the previous day's cutoff, an increase of €1,903.73 (rounded 18%). The expandable table shows the product contributions.
- Stock explains an observation plus movements: 50 counted + 10 delivered − 48 sold = 12 Ground Coffee units. Two days at six units per day is explicitly an estimate. Sales alone cannot establish stock.
- Customers shows 38 returning among 241 distinct sample identifiers, with 203 first seen in the available history. Removing identifier evidence displays an explained unavailable state rather than zero.
- The local next-sale sample previews 12 → 11, supports cancel, confirms the sale on the second action, and supports undo to 12. Keyboard focus follows each action. This simulation changes only its displayed stock after the historical cutoff; nothing is submitted or saved.
- The landing page uses `Cod.` once, in its trust example. Detailed source tabs and the original field-review workflow remain in demo disclosures. Landing links open and focus their intended disclosure.
- English, Spanish, and French ship together. Original source codes and fictional EUR sample amounts are preserved. New source/trust CTA locations use the existing bounded, schema-validated memory event sink.
- Section backgrounds remain flat. The narrative is shorter without removing the deeper interactive demo.

## Rendered evidence

| View | Screenshot |
|---|---|
| English, 390×844 | [Mobile](landing-merchant-stories/en-390.png) |
| Spanish, 390×844 | [Mobile](landing-merchant-stories/es-390.png) |
| French, 390×844 | [Mobile](landing-merchant-stories/fr-390.png) |
| English, 1440×844 | [Desktop](landing-merchant-stories/en-1440.png) |
| Forced colors, sale review | [Controls and focus](landing-merchant-stories/forced-entry.png) |

English page height at 390px decreased from PR 1's 8,920px to 5,401px (about 39%); at 1440px it decreased from 5,050px to 3,683px. These local layout measurements are not evidence of increased conversion.

## Validation

- `npm run lint --workspace @suq-insights/web` — passed.
- `npm run typecheck --workspace @suq-insights/web` — passed.
- `npm run test --workspace @suq-insights/web` — 60 tests across eight files passed. Includes fixture reconciliation, all-locale preview/cancel/confirm/undo, customer availability, disclosure navigation/focus, preserved review/chart behavior, and accessibility checks.
- `npm run build:web` — passed; initial JavaScript 113.7 KB gzip against a 200 KB budget.
- `npm run lint:docs` and `git diff --check` — passed.
- Chromium at 320, 390, 768, and 1440px in all three locales: no page overflow or JavaScript errors, one rendered `Cod.` occurrence, and no axe WCAG 2 A/AA or 2.1 A/AA violations with contrast checks enabled.
- At 390px, all locales: keyboard-confirmed sale and undo passed; expanded evidence and missing customer identifiers at 200% root text sizing produced no page overflow.
- Reduced-motion browser checks in all locales: sale review, recorded state, and expanded demo source/workflow disclosures had no page overflow or axe violations. Forced-color rendering of the new evidence and entry controls was manually inspected; no full automated forced-color certification is claimed.
- The updated `UI-UX-CONCEPT.md` was rendered to `SUQ-INSIGHTS-UI-UX-CONCEPT.pdf`; extracted text includes the new stock and customer stories.

Unavailable: physical Android device testing, native-language reviewer sign-off, NVDA/VoiceOver testing, target-merchant usability sessions, and deployed conversion measurements. Backend, migration, and deployment checks were not run locally for this frontend/documentation checkpoint; GitHub CI reports separately.

## Traceability and next action

SDLC §1.2 supplies the three merchant questions. FR-C-4 and FR-E-1 constrain the input/entry story; FR-S-1/4 and FR-U-4/5/12 constrain evidence, interpretation and unavailable answers; FR-D-12 governs localized presentation; NFR-5/6/9/10 govern accessibility, localization, privacy and page weight. These samples illustrate requirements and do not mark backend features complete.

Next: merge the first revision before this dependent PR, then implement planned PR 3's plan comparison, FAQ, workflow comparison and verified footer destinations. Real event collection and optional early access remain planned PR 4, subject to the documented decisions. The v4 amendment PR and proposed anonymous-file ADR remain in place. Unrelated `docs/diagrams/` files are excluded from this checkpoint.
