# Landing buying questions — PR 3 evidence

Date: 2026-09-05. Branch: `feat/tensu/landing-buying-questions`, based on `dev` after PR #6 merged.

Implements the third revision in the [landing plan](../landing-page-revision-plan.md). External support/legal destinations remain pending owner input; the current footer has verified internal destinations only. This checkpoint remains for the owner to review and merge.

## Delivered behavior

- A short workflow comparison describes manually connecting separate records and the planned Suq review/shared-view workflow. It makes no blanket competitor claim.
- Equal-weight Free and Premium cards state that plans are planned, accounts/subscriptions are unavailable in the preview, and Premium pricing is not finalized. There are no purchase buttons or invented prices.
- Visible limits include dashboards, history, upload counts/sizes, alert channels including Premium's ten-SMS daily cap, owner/staff seats, API/export eligibility and the five-export daily limit, and sponsorship. A visible note explains the six-week forecasting prerequisite, moving-average fallback and planned support availability.
- Six native FAQ disclosures cover availability, sources/column names, review/corrections/undo, missing analytical evidence, retention/downgrade rules, and current demo privacy. Each planned capability is distinguished from the local sample interaction.
- Product, How it works, Plans and FAQ links target real landing sections. Links from the demo return to the landing section and move focus there. The mobile menu closes on selection, supports Escape restoration and remains scrollable with enlarged text. Desktop navigation switches to the menu below 68rem to accommodate translated labels.
- The footer links to the working demo, Plans and FAQ. No fabricated support address, company identity, legal policy, status page or advertiser destination was added.
- All copy is in English, Spanish and French. `UI-UX-CONCEPT.md` and its PDF reflect the delivered narrative.

## Claim traceability

| Content | Authority and boundary |
|---|---|
| Planned Free/Premium limits | SDLC §2.2, FR-P-1 through FR-P-11 and FR-D-4; descriptive marketing, no entitlement enforcement change |
| Forecasting and SMS qualifications | FR-P-2/3: six-week history, moving-average fallback, verified phone and daily cap |
| History/downgrades | FR-P-1 and SDLC data model retention: Free raw records pruned beyond 90 days; hidden Premium-era history retained 13 months after downgrade; source files expire after 30/180 days |
| Review, unsupported analyses, reversal | FR-U-4/5/12, FR-G-6; planned product flow versus the working fictional review/sale examples |
| Demo privacy | Inspected browser language persistence and bounded in-tab journey sink; no real file input or analytics collector; ordinary page requests still reach the host |
| Locale and accessibility | FR-D-12, NFR-5/6; all-locale navigation/disclosures, keyboard, reflow and contrast checks |
| Initial page weight | NFR-10; under 200 KB initial JavaScript gzip |

The FAQ is not a production privacy policy. Production residency, retention implementation, public support ownership, terms and legal claims require verification before publication. No backend requirement is marked complete by these descriptions.

## Validation

- Web lint and TypeScript checks passed.
- All 66 tests across eight files passed, including plan limits, opening all six FAQs, menu/footer navigation and focus in all three locales, and the prior landing/demo behavior.
- Production build passed at 118.9 KB initial JavaScript gzip against the 200 KB budget.
- Chromium: English, Spanish and French at 320, 390, 768, 1090 and 1440px had no page overflow, JavaScript errors or axe WCAG 2 A/AA and 2.1 A/AA violations with contrast enabled.
- In all three locales at 390px: keyboard Enter opened each FAQ, Space closed it, menu-to-plans and footer-to-FAQ navigation restored destination focus. Expanded FAQs under reduced motion, 200% root text sizing, and the enlarged scrollable menu passed the same overflow/axe checks.
- Full-page desktop/mobile screenshots reviewed. Forced-color plan rendering was inspected; no full WCAG certification is claimed.
- Documentation lint and Git whitespace checks passed. The design PDF was regenerated and its extracted text verified.

| Screenshot | Full page height at 390px |
|---|---|
| [English mobile](landing-buying-questions/en-390.png) | 8,537px |
| [Spanish mobile](landing-buying-questions/es-390.png) | 8,880px |
| [French mobile](landing-buying-questions/fr-390.png) | 8,902px |

[English desktop](landing-buying-questions/en-1440.png) is 5,527px tall at 1440px. The new plan details and FAQ add length compared with PR 2; the first-screen hero is preserved, FAQ answers are collapsed, and section navigation provides direct access. Target-merchant usability feedback should determine whether further shortening is useful. No conversion improvement is claimed.

Unavailable: physical Android/device checks, NVDA/VoiceOver, native-language reviewer sign-off, and merchant usability research. Backend/migration/container suites were not rerun locally for this frontend/documentation checkpoint; GitHub CI reports independently.

## Remaining work

Owner-provided public support and approved privacy/terms URLs are still needed before adding those footer links. Until then, the footer uses only working internal routes. PR 4 needs a reviewed analytics collector design and, if desired, a separate accepted design for early-access submission. The earlier Vercel deployment configuration issue is separate from this landing PR. Unrelated `docs/diagrams/` files remain untouched.

## Section-focus correction

The browser's default focus outline framed the entire section after navigation. The landing CSS now suppresses only that noninteractive section outline and underlines its heading when `:focus-visible` applies. Focus and scroll destinations are unchanged; button/link/disclosure focus indicators remain intact.

Revalidated all four destinations in English, Spanish and French: mouse navigation has no section outline, keyboard navigation shows the heading underline, and the next Tab stop has a visible focus outline. A 390px forced-color check retained the heading indicator without page overflow. Web lint/types, all 66 tests, production build (118.9 KB initial gzip), documentation lint and whitespace checks passed again. [Focused Product section](landing-buying-questions/section-focus-1440.png) shows the corrected treatment. The concept PDF was regenerated with this focus contract.
