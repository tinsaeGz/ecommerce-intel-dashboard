# Cinematic Suq: implementation and browser evidence

Date: 2026-09-06

## Current revision — 2026-09-12

The optional full-screen experience and its entry/exit controls have been removed at the owner's request. The merchant story and connected chapter actions remain inline on the landing page. Modal-only state, styles, locale strings and the focused browser script were removed; the three-locale component journey now exercises the inline flow. The focused-view evidence below is historical and describes the superseded revision.

Requirements: SDLC §1.2, NFR-5, NFR-6, NFR-10. No API, tenancy, billing or telemetry behavior changes.

Validation: web ESLint/Stylelint, TypeScript (production build), all 83 tests, and the production build passed; initial JavaScript is 125.7 KB gzip against the 200 KB budget. The updated inline browser script passed all 30 EN/ES/FR cases, including axe with contrast, keyboard/confirmation continuity, responsive layouts, enlarged text, forced colors and reduced motion. The desktop evidence screenshot was visually inspected. Markdown lint and diff whitespace passed. The concept PDF was regenerated with Markdown/WeasyPrint and its extracted amendment text verified.

Browser reproduction used the command below with `PLAYWRIGHT_MODULE=/home/tensu/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs`, `SUQ_CHROMIUM_PATH=/home/tensu/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`, and `SUQ_REVIEW_EVIDENCE=/tmp/suq-inline-evidence`. Results are in `/tmp/suq-cinematic-results.json`. Physical-device, screen-reader and native-speaker checks remain unavailable; remote CI was not run for this local checkpoint.

## Historical delivery — 2026-09-06

The first delivery was functionally validated, but the owner found its cinematic treatment too shallow and its mockups unconvincing. The current revision follows the owner’s preference for a theatrical brand story, with the product supporting it. The latest revision removes the unnecessary monitor stand and adds an optional full-screen experience, with connected chapter actions and the live product inside a recognizable display frame.

Scope: landing page and fictional demo, built on finalized PR #8. SDLC §1.2, FR-U-4/5/12, FR-G-6, FR-E-1, FR-D-12 and NFR-5/6/9/10 guide this demonstration. This does not complete the corresponding authenticated product requirements.

## Delivered behavior

- One memory-only scenario carries source selection, role and confirmation, customer availability, dashboard metric/time/stock selections, and the pending or confirmed sample sale across landing/demo navigation and language changes. Refresh clears the sample while preserving the chosen language. Reset sample restores all scenario defaults and keeps focus on the reset action.
- Three connected chapters replace the separate demonstration sections: Understand the day, Inspect the evidence, Try the next sale. Desktop shows one evolving sticky scene; mobile, short screens, enlarged text and unavailable observers use sequential scenes without duplicate controls.
- “Enter the experience” opens a native modal story with one active scene, a language control and a persistent Exit action. Follow the evidence and Continue to the next sale connect the chapters. Opening and closing preserve the business question, review choices and pending sale; Escape restores launch focus. Dropdown options stay inside the modal, and their first Escape closes only the list. Background scrolling is locked until exit or route navigation.
- Explicit chapter buttons and normal scrolling select presentation only. Inactive desktop scenes are inert and excluded from the accessibility tree. A scene containing keyboard focus cannot disappear because of scrolling. Desktop moves through paper, ink and mint environments with large editorial headings and a framed monitor as the focal point. Lighting cuts keep text contrast stable; scene crossfades and restrained movement change immediately under reduced motion. Oversized scenes fall back to sequential flow.
- Review changes are scoped to the illustrative source records. Source or role changes invalidate confirmation. Customer evidence affects every customer analysis consistently: missing evidence produces an explanation, never zero.
- The next sale requires preview and confirmation; cancel, undo and repeated actions are guarded. A double click cannot accidentally turn confirmation into undo or reset. The demo dashboard separately displays the stock after the historical cutoff. Historical totals, chart observations and risk estimates remain unchanged.
- Hero, immediate briefing, plans, FAQ and closing action remain. Route headings receive programmatic focus; direct demo review/source/sale links open and focus their disclosure. No section-sized focus outline returns.
- Product surfaces now include the actual sample comparison bars, stock arithmetic and customer-history marks, original CSV rows beside a review inspector, and a stock movement ledger beside quick entry. Missing identifiers remove the customer visualization. Preview marks a draft unit; confirmation removes it, and undo restores it.
- Visual review also caught the focused language selector inheriting ink text on the ink scene; its text and focus treatment now follow the scene theme, with a dedicated browser assertion. The final pass corrected forced-color contrast in the closing section and selected dashboard metric, and French navigation overflow at 200% text. Obsolete independent workflow/review code was removed.

## Validation

| Gate | Result |
|---|---|
| Web ESLint and Stylelint | Passed |
| TypeScript | Passed |
| Component/unit tests | 83 passed in 10 files, including all three locales |
| Production build / initial JavaScript | 126.2 KB gzip; below 200 KB |
| Chromium browser matrix | 57 cases passed: 30 inline/demo cases plus 27 focused-view cases |
| Browser axe | No WCAG 2/2.1 A/AA violations in the tested states; contrast enabled, including forced colors |
| Documentation / generated concept PDF | Markdown lint and PDF regeneration/contents checked |
| Diff whitespace | Passed |

Each locale was exercised at 1440×1000, 390×844, 320×740, 768×1024, 1440×600, 1440×900, 200% root text, forced colors, and reduced motion. Each combination checks all three landing chapters and the direct demo review destination. Assertions cover horizontal overflow, sticky scene fit, compact fallback, first-screen mobile revenue, route focus and motion preferences.

The continuity journeys cover scroll without mutation, dropdown keyboard cancellation, focus protection during scroll, review confirmation, double-click behavior, a pending sale crossing routes, confirm/undo, historical integrity, missing customer evidence, metric/time/stock selections, source invalidation, browser Back, language changes and refresh. Reset/cancel/repeated reducer transitions also have component and unit coverage. The focused matrix adds 24 locale/layout combinations (desktop, mobile, narrow, tablet, short, 200% text, forced colors and reduced motion) plus three interaction journeys covering native modal isolation, dropdown layering, Escape order, focus restoration, language, route cleanup, Back and pending-sale continuity.

Reproduce with the web server running and an external Playwright installation:

```sh
npm run dev --workspace @suq-insights/web -- --host 127.0.0.1 --port 4178
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node apps/web/scripts/check-cinematic-browser.mjs
```

`SUQ_REVIEW_URL` can select another local server. `SUQ_REVIEW_EVIDENCE` selects an alternate screenshot directory, and `SUQ_CHROMIUM_PATH` selects an installed Chromium executable. The scripts write screenshots here and detailed results to `/tmp/suq-cinematic-results.json` and `/tmp/suq-focused-results.json`; they introduce no production dependency or collector.

## Revised art direction

The product provides evidence for three different narrative moments: the scale of a busy day, the ambiguity of a source column, and the visible consequence of one sale. The desktop environment changes with those moments. A slim bezel, camera, decorative window title bar, lower edge place the working product inside a recognizable display. Consistent screen geometry replaces the previous zoom effect and floating number motifs. Mobile keeps a slim window frame without reducing text size. The stand is removed. Entering the focused view expands this stage to fill the viewport; explicit next actions connect inspection to consequence, while the surrounding page stays available on exit. This replaces the first version’s repeated educational cards and subtle background wash.

- [Focused trading day](cinematic/focused-day.png)
- [Focused evidence scene](cinematic/focused-evidence.png)
- [Focused next-sale scene](cinematic/focused-sale.png)
- [Spanish mobile focused view](cinematic/focused-mobile.png)
- [Trading day inside the desktop monitor](cinematic/theatre-day.png)
- [Desktop evidence review: original rows beside the decision](cinematic/theatre-evidence.png)
- [Desktop sale: inventory and the entry inspector](cinematic/theatre-sale.png)
- [Confirmed sale: 11 units and the separate movement](cinematic/theatre-sale-confirmed.png)
- [Mobile: slim window frame and readable evidence](cinematic/theatre-mobile.png)

## Captured evidence

- [Desktop hero and immediate briefing](cinematic/en-desktop.png)
- [Desktop evidence chapter](cinematic/en-evidence.png)
- [Spanish mobile page, sequential scenes](cinematic/es-mobile.png)
- [French at 200% text](cinematic/fr-text-200.png)
- [Forced colors](cinematic/en-forced-colors.png)
- [Spanish reduced-motion sale scene](cinematic/es-reduced-motion.png)
- [Short interaction recording: enter, inspect, confirm, record, exit and undo](cinematic/interaction.gif)

The recording is a review artifact, never shipped as website media. Screenshots were visually inspected; automated checks are not an accessibility certification. Physical mobile devices, NVDA/VoiceOver and native-speaker editorial review were unavailable in this environment. Merchant comprehension/conversion testing remains separate; no conversion improvement is claimed.

## Delivery and remaining work

PR #8 has merged. Review the unmerged cinematic deliveries in order: scenario continuity (#9), cinematic presentation (#10), accessibility/performance polish (#11), then the art-direction revision. PR #12 contains the art direction, display frame and focused interaction revisions and remains cumulative against dev so its affected CI gates run; the previous PRs remain in place. The branches reconcile the #8 squash ancestry without changing validated implementation trees. These are cumulative branches; a squash or rebase merge of a predecessor can require synchronizing later branches with the new dev history before their CI runs. GitHub CI remains a separate remote gate; this report records local validation, not a deployed release.

Public support/legal destinations, analytics collection, authenticated onboarding and application workflows remain separate pending tasks. No backend endpoint, migration, pricing change, animation framework, WebGL, photography or film dependency was added.
