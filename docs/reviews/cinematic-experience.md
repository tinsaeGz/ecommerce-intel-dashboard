# Cinematic Suq: implementation and browser evidence

Date: 2026-09-06

The first delivery was functionally validated, but the owner found its cinematic treatment too shallow and its mockups unconvincing. The current revision follows the owner’s preference for a theatrical brand story, with the product supporting it.

Scope: landing page and fictional demo, built on finalized PR #8. SDLC §1.2, FR-U-4/5/12, FR-G-6, FR-E-1, FR-D-12 and NFR-5/6/9/10 guide this demonstration. This does not complete the corresponding authenticated product requirements.

## Delivered behavior

- One memory-only scenario carries source selection, role and confirmation, customer availability, dashboard metric/time/stock selections, and the pending or confirmed sample sale across landing/demo navigation and language changes. Refresh clears the sample while preserving the chosen language. Reset sample restores all scenario defaults and keeps focus on the reset action.
- Three connected chapters replace the separate demonstration sections: Understand the day, Inspect the evidence, Try the next sale. Desktop shows one evolving sticky scene; mobile, short screens, enlarged text and unavailable observers use sequential scenes without duplicate controls.
- Explicit chapter buttons and normal scrolling select presentation only. Inactive desktop scenes are inert and excluded from the accessibility tree. A scene containing keyboard focus cannot disappear because of scrolling. Desktop moves through paper, ink and mint environments with large editorial headings and scene motifs. Lighting cuts keep text contrast stable; scene crossfades and restrained movement change immediately under reduced motion. Oversized scenes fall back to sequential flow.
- Review changes are scoped to the illustrative source records. Source or role changes invalidate confirmation. Customer evidence affects every customer analysis consistently: missing evidence produces an explanation, never zero.
- The next sale requires preview and confirmation; cancel, undo and repeated actions are guarded. A double click cannot accidentally turn confirmation into undo or reset. The demo dashboard separately displays the stock after the historical cutoff. Historical totals, chart observations and risk estimates remain unchanged.
- Hero, immediate briefing, plans, FAQ and closing action remain. Route headings receive programmatic focus; direct demo review/source/sale links open and focus their disclosure. No section-sized focus outline returns.
- Product surfaces now include the actual sample comparison bars, stock arithmetic and customer-history marks, original CSV rows beside a review inspector, and a stock movement ledger beside quick entry. Missing identifiers remove the customer visualization. Preview marks a draft unit; confirmation removes it, and undo restores it.
- The final pass corrected forced-color contrast in the closing section and selected dashboard metric, and French navigation overflow at 200% text. Obsolete independent workflow/review code was removed.

## Validation

| Gate | Result |
|---|---|
| Web ESLint and Stylelint | Passed |
| TypeScript | Passed |
| Component/unit tests | 79 passed in 10 files, including all three locales |
| Production build / initial JavaScript | 125.3 KB gzip; below 200 KB |
| Chromium browser matrix | 30 cases passed: 3 continuity journeys plus 27 locale/layout combinations |
| Browser axe | No WCAG 2/2.1 A/AA violations in the tested states; contrast enabled, including forced colors |
| Documentation / generated concept PDF | Markdown lint and PDF regeneration/contents checked |
| Diff whitespace | Passed |

Each locale was exercised at 1440×1000, 390×844, 320×740, 768×1024, 1440×600, 1440×900, 200% root text, forced colors, and reduced motion. Each combination checks all three landing chapters and the direct demo review destination. Assertions cover horizontal overflow, sticky scene fit, compact fallback, first-screen mobile revenue, route focus and motion preferences.

The continuity journeys cover scroll without mutation, dropdown keyboard cancellation, focus protection during scroll, review confirmation, double-click behavior, a pending sale crossing routes, confirm/undo, historical integrity, missing customer evidence, metric/time/stock selections, source invalidation, browser Back, language changes and refresh. Reset/cancel/repeated reducer transitions also have component and unit coverage.

Reproduce with the web server running and an external Playwright installation:

```sh
npm run dev --workspace @suq-insights/web -- --host 127.0.0.1 --port 4178
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node apps/web/scripts/check-cinematic-browser.mjs
```

`SUQ_REVIEW_URL` can select another local server. The script writes screenshots here and detailed results to `/tmp/suq-cinematic-results.json`; it introduces no production dependency or collector.

## Revised art direction

The product provides evidence for three different narrative moments: the scale of a busy day, the ambiguity of a source column, and the visible consequence of one sale. The desktop environment changes with those moments. This replaces the first version’s repeated educational cards and subtle background wash.

- [Trading day: sample comparisons and editorial scale](cinematic/theatre-day.png)
- [Evidence: ink environment and original rows beside the decision](cinematic/theatre-evidence.png)
- [Next sale: inventory and the entry inspector](cinematic/theatre-sale.png)
- [Confirmed sale: 11 units and the separate movement](cinematic/theatre-sale-confirmed.png)
- [Mobile: sequential story and evidence](cinematic/theatre-mobile.png)

## Captured evidence

- [Desktop hero and immediate briefing](cinematic/en-desktop.png)
- [Desktop evidence chapter](cinematic/en-evidence.png)
- [Spanish mobile page, sequential scenes](cinematic/es-mobile.png)
- [French at 200% text](cinematic/fr-text-200.png)
- [Forced colors](cinematic/en-forced-colors.png)
- [Spanish reduced-motion sale scene](cinematic/es-reduced-motion.png)
- [Short interaction recording: stock, review, sale, demo continuity and undo](cinematic/interaction.gif)

The recording is a review artifact, never shipped as website media. Screenshots were visually inspected; automated checks are not an accessibility certification. Physical mobile devices, NVDA/VoiceOver and native-speaker editorial review were unavailable in this environment. Merchant comprehension/conversion testing remains separate; no conversion improvement is claimed.

## Delivery and remaining work

PR #8 has merged. Review the unmerged cinematic deliveries in order: scenario continuity (#9), cinematic presentation (#10), accessibility/performance polish (#11), then the art-direction revision. The latest revision remains cumulative against dev so its affected CI gates run; the previous PRs remain in place. The branches reconcile the #8 squash ancestry without changing validated implementation trees. These are cumulative branches; a squash or rebase merge of a predecessor can require synchronizing later branches with the new dev history before their CI runs. GitHub CI remains a separate remote gate; this report records local validation, not a deployed release.

Public support/legal destinations, analytics collection, authenticated onboarding and application workflows remain separate pending tasks. No backend endpoint, migration, pricing change, animation framework, WebGL, photography or film dependency was added.
