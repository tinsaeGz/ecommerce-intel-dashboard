# Landing page revision plan

Date: 2026-09-05

Status: Earlier landing content through PR #8 is merged. The three Cinematic Suq deliveries are implemented for sequential review, unmerged. See [final validation and evidence](reviews/cinematic-experience.md). Public support/legal destinations and real analytics remain pending separately.

Baseline: `45b7326` — flat landing section surfaces.

Authority: [SDLC v3](../SDLC.md) remains canonical; the broader product direction is retained. This proposal supplements [UI-UX-CONCEPT.md](../UI-UX-CONCEPT.md), especially §§1, 4–7, 13–17. It does not adopt the v4 amendment, change entitlements, or authorize merging implementation PRs.

## 1. Objective and assessment

Help a merchant understand what Suq gives them, see believable evidence, and take a working next step. Preserve the distinctive paper, ink, mint, and lime identity while simplifying the page's reading order and interactions.

The supplied critique makes sense. The current page explains why interpretation is trustworthy before giving enough space to the business outcome. Its strongest conversion button leads to an account-preview page. Several buying questions from the design blueprint remain unanswered.

Completing every section in the blueprint is not the objective. Adding all missing sections at full size would compound the mobile length problem. Combine related subjects, remove repetition, and keep detailed exploration in the demo.

### Evidence and limits

- The preceding browser review measured approximately 6,600px of page height at 1440px wide and 11,800px at 390px wide. On mobile, the dashboard started around 2,300px below the page top. These are baseline observations, not fixed performance thresholds.
- The review confirmed that “Start free” reaches “Free account creation is being connected.”
- The implemented page repeats the ambiguous “Cod.” field across the hero, briefing, how-it-works example, and trust copy.
- Neither tested width had page-level horizontal overflow. This does not establish full accessibility or device coverage.
- This is an expert review, not evidence of measured conversion loss. Validate comprehension and behavior with target merchants before claiming improvement.

## 2. How to apply the supplied feedback

| Suggestion | Decision for this plan | Qualification |
|---|---|---|
| Lead with the daily briefing | Adopt | Show a compact answer and next action in the hero; move field interpretation to the trust section. |
| Preserve the headline and visual identity | Adopt with copy refinement | Keep the three-question framing and serif emphasis. Prefer “See who comes back” to “Bring customers back” until an actual retention action supports the latter promise. |
| Make the demo the primary CTA | Adopt now | The existing sample experience is the working destination. Use the same label in header, hero, and closing invitation. |
| Add an early-access email form | Conditional follow-up | Requires an accepted design note for storage/provider ownership, privacy, consent purpose, deletion, abuse controls, and reliable submission. Never show success without saving the request. |
| Add a price such as $19/month | Do not adopt the illustrative amount | No price is established by this review. Explain the planned Free/Premium boundaries; publish amounts only from an approved commercial decision. |
| Add privacy, FAQ, and support information | Adopt in stages | Separate current demo behavior from production commitments. Verify hosting, retention, deletion, and support destinations before presenting them as operational. |
| Localize the sample | Adopt deliberately | Provide coherent fictional fixtures per locale where helpful. Never silently translate an original source value or convert currency merely because the UI language changed. |
| Reduce disclaimers | Adopt selectively | Consolidate repeated sample labels. Keep qualifications beside stock estimates, unavailable analyses, and actions that could otherwise be mistaken for real uploads. |
| Remove nonsequential numbering | Adopt | Reserve step numbers for Add → Confirm → See. Benefits use titles or meaningful icons. |
| Add a no-signup file drop zone | Separate discovery proposal | This changes the authenticated upload boundary in FR-A-1 and introduces untrusted-file processing. It is outside the landing revision and needs an explicit product/security decision. |
| Add founder or beta proof | Conditional | Use only an approved real founder statement or a functioning beta invitation. Continue using inspectable sample evidence; do not invent customers, outcomes, or adoption counts. |

## 3. Proposed visitor journey

| Order | Visitor question | Content and interaction |
|---|---|---|
| 1. Hero | “Is this for a business like mine?” | Three merchant outcomes, concrete source examples, one primary demo CTA, and a compact daily briefing. |
| 2. Daily decisions | “What will I learn?” | Three concise examples: sales momentum, stock requiring attention, and returning customers. Each connects an answer to evidence and a useful next decision. |
| 3. How it works | “How do my records become that view?” | Add → Confirm → See, with a short source ribbon. Include live entry beside uploads as an equal input path. Detailed format exploration moves to the demo. |
| 4. Trust | “Can I check and correct it?” | One interpretation example, source evidence, an explained unavailable answer, and the planned correction/undo behavior. Clearly label preview versus working capability. |
| 5. Fit and plans | “Why use this alongside my current records, and what will it cost?” | A short workflow comparison and planned Free/Premium boundaries. Explain limits and sponsorship visibly. |
| 6. FAQ | “What might stop me?” | Direct answers about files, missing customer/cost data, corrections, privacy, history, and availability. |
| 7. Closing action and footer | “What do I do next, and who is behind this?” | Repeat the primary action. Add verified support/company/legal destinations as they become available. |

Short navigation should link to real page sections: Product, How it works, Plans, FAQ, language, and the primary action. Avoid adding empty Resources or Use cases destinations merely to match a template.

### Draft messaging direction

- Audience: small and mid-size merchant owners; staff and technical evaluators remain secondary. Keep all three supported locales and the SDLC's Latin America marketing beachhead.
- Eyebrow: “For the records you already keep.”
- Headline: “Know what’s selling. See what runs out next. See who comes back.”
- Supporting copy: “Turn spreadsheets, POS exports, or a photo of your ledger into a daily view of sales, stock, and returning customers. Review uncertain details before they change your numbers.”
- Primary action during preview: “Explore the demo.” Nearby reassurance: “Fictional sample data. No account needed.”
- Production capability copy must be clearly framed as a product preview until the corresponding backend flow works. Final copy receives English, Spanish, and French review together.

### Three outcome examples

1. Sales: show a comparison with a named period and the items contributing to it. Make the source and date inspectable.
2. Stock: show an estimate and explain the observations and movements needed to support it. A sales file alone must not imply knowledge of physical stock.
3. Returning customers: show repeat versus new customers only when the fixture includes a confirmed customer identifier. Include a concise unavailable state for records without one.

Use one consistent fictional merchant story so totals, dates, sources, and claims agree. Give each example a different business purpose; do not repeat the same field ambiguity as the answer to every question.

## 4. Visual and interaction direction

- Keep the shared paper background and flat main sections. Use spacing, type, fine rules, and restrained color changes to separate ideas. Keep elevation where it helps identify a floating control or product surface.
- Align hero copy and visual deliberately at the top. Use the same content grid throughout; reduce unexplained nested insets and large empty transitions.
- Make the daily result the hero's visual focus. Avoid presenting a full dashboard and a full review interface above the first narrative section.
- On phones, use a compact briefing with one useful answer and next action. Move dense tables and advanced controls into the demo, with accessible alternatives.
- Remove the repetitive announcement strip unless it communicates a real, timely announcement. Never hide an availability or privacy qualification solely because the screen is small.
- Tighten headline scale and spacing without shrinking body text or touch targets. At the reference 390×844 viewport and default text size, aim to show the primary CTA and a meaningful product cue without scrolling; assess the result in a browser. At zoom, short viewports, or expanded translations, preserve readability and natural scrolling rather than forcing everything into one screen.
- Use one dominant action per section. A secondary action is optional, not a requirement to squeeze two buttons into every mobile viewport.
- Reuse the existing dropdown component. Preserve keyboard operation, visible focus, reduced-motion behavior, chart table alternatives, and locally appropriate number/date formats.
- Consolidate duplicate sample labels within a clearly bounded preview. Retain contextual statements where removing them would make the example misleading.

## 5. Availability, pricing, and trust rules

### CTA states

| Product state | Primary action | Supporting action | Release condition |
|---|---|---|---|
| Current preview | Explore the demo | In-page explanation of how it works | Destination renders and a visitor can inspect a meaningful sample answer. |
| Early access, if approved | Explore the demo | Get early access | Real submission, accessible validation, recoverable errors, honest success, and an established follow-up owner. |
| Working authentication | Start free | Explore the demo; Log in for returning users | Signup/verification/login and the protected first-use journey are verified on staging. |

Remove public “Log in” promotion while it only leads to a placeholder. Retain a truthful informational route for direct visits. Do not replace one dead end with a cosmetic signup or email form.

### Plans

Show “Planned Free and Premium plans” while the product is in preview; state that Premium pricing will be announced when finalized. This answers the business-model question without implying purchase is available.

Copy must follow SDLC §2.2 rather than simplifying away limits: Free has one dashboard, 90-day visible history, five daily uploads up to 10 MB, dashboard alerts, and contextual sponsorship. Premium includes additional history subject to retention rules, multiple dashboards, higher upload limits, owner plus up to four staff, email/SMS alerts, Sync API, exports, and an ad-free workspace. Explain predictive-history prerequisites where forecasting is discussed.

Do not change these entitlements in this work. Do not claim that all historical data is retained forever or that Premium provides unlimited team seats.

### FAQ and proof

Initial FAQ topics: supported/planned sources; column renaming; uncertain fields; correction and load reversal; stock prerequisites; missing customer identifiers; current preview availability; plan/history limits; production privacy commitments.

For each answer, record whether it describes a working feature, a sample interaction, or an SDLC commitment. Before publishing present-tense security/privacy claims, verify the deployed behavior and approved policy. Do not infer a blanket “data is never sold” statement from EU hosting alone.

Keep comparisons specific to the work: manually joining exports versus reviewing a proposed interpretation; separate daily records versus a shared daily view. Avoid unsupported claims that all spreadsheets or competing tools lack a capability.

## 6. Delivery sequence

Each implementation PR targets `dev`, includes its own evidence, and remains for the user to review and merge in order. This document is the planning checkpoint only.

| PR | Scope | Acceptance criteria |
|---|---|---|
| 1 — Working action and first impression | Demo-first CTA, truthful account links, compact briefing hero, mobile spacing, announcement cleanup | No promoted CTA ends in an unavailable action; payoff precedes interpretation; readable 320/390px layouts; all three locales; no page overflow. |
| 2 — Merchant story and demo | Three outcome examples, concise input/live-entry story, one trust example, deeper review in the demo | Each promised outcome has coherent sample evidence; stock/customer prerequisites are explicit; a demo visitor can follow answer → evidence → review → return; repeated field examples removed. |
| 3 — Buying questions | Planned plan comparison, FAQ, short workflow comparison, verified footer destinations | Limits match SDLC; no invented price or proof; preview and production claims are distinguished; no placeholder links; accessible FAQ in all locales. |
| 4 — Measurement and optional early access | Privacy-reviewed event collection; early access only after design acceptance | Events reach a real collector, are deduplicated and contain only approved properties; any signup-interest submission is persisted and its failure path tested. |

When implementation changes the accepted narrative or component contract, update `UI-UX-CONCEPT.md` and regenerate its PDF in the corresponding checkpoint. This proposal leaves both canonical documents unchanged.

Likely implementation paths: `apps/web/src/marketing/`, `apps/web/src/components/public-ui.*`, `apps/web/src/routes/`, all three `apps/web/src/locales/*/common.json` catalogs, `apps/web/src/lib/demo-data.ts`, and affected tests. New lead storage, telemetry providers, or API contracts require separately scoped design and backend work.

## 7. Validation and measurement

Requirement traceability: SDLC §1.2 (three merchant questions); FR-A-1/2 (real account journey); FR-U-4/5/12 (review and analytical availability); FR-C-4 and FR-E-1/5 (input and entry story); FR-S-4 and FR-G-6 (provenance and undo); FR-D-4/12 and §2.2 (plans and localization); NFR-5/6/9/10 (accessibility, locale quality, privacy, page weight). Marketing previews illustrate these requirements; they do not mark backend requirements implemented.

For each affected web checkpoint:

- Run web lint, TypeScript checks, component tests, and production build including the under-200 KB initial JavaScript budget.
- Test changed journeys in English, Spanish, and French, with accessible names and working CTA destinations. Run automated accessibility checks and manual keyboard/focus checks.
- Inspect 320, 390, 768, and 1440px widths, text expansion, 200% zoom and narrow reflow, reduced motion, and meaningful touch targets. Do not trade accessibility for a fold-height target.
- Check mobile rendering and responsiveness under throttling; run a real mid-range Android check before launch and report it as unavailable if no device is available.
- Hand-review sample consistency, plan limits, availability wording, privacy claims, and every footer destination. Automated green checks alone cannot verify marketing truth.

Start measurement with the existing concept's `landing_cta_selected`, `demo_started`, and `model_review_opened` events. Define a meaningful demo session as inspecting an answer and its evidence, rather than merely loading the route. Add signup completion only when real authentication exists. Establish a baseline before setting conversion improvement targets.

Limit properties to approved route, CTA location, locale, device class, and source category values. Never transmit raw records, filenames, field names, email addresses, or user-entered text to marketing analytics. Collector choice, consent behavior, retention, and access need design review before deployment.

Run a small formative study with target merchants: ask what Suq does, which decision it helps them make, what data they need, whether they understand the preview status, and what they would do next. Observe mobile task completion and confusion. This is directional usability evidence, not a statistically validated conversion result.

## 8. Dependencies and next action

Ready to implement without a new commercial decision: PR 1, followed by the sample-based narrative in PR 2. Pricing amounts, founder statements, production policy/support destinations, early-access collection, and analytics provider configuration remain explicit dependencies rather than guessed content.

Anonymous real-file trials remain outside this plan. A future proposal must resolve FR-A-1's verified-account upload rule, isolation, file-size/type limits, abuse and compute budgets, retention/deletion, personal-data handling, and the difference between inference preview and committed ingestion. The current sample demo is the delivery path while that decision remains open.

Next action: review PR 3’s planned plan comparison, FAQ and working footer navigation; supply approved public support/legal destinations before publishing those links. Then resolve PR 4’s collector and optional early-access design decisions. Preserve unrelated diagrams and leave the v4 amendment PR in place.

## 9. Review amendments

Source: independent rendering review at 1440×900 and 390×844 (ghost, 2026-09-05), reconciled against sections 2–6 above. These amendments tighten acceptance criteria; they do not change the journey order, the CTA rules, or the pricing and proof rules.

| Amendment | Applies to | Change | Reason |
|---|---|---|---|
| A1. Concrete mobile fold | PR 1 | At 390×844 and default text size, the first screen contains: header, eyebrow, headline capped at four lines, a one-sentence deck, the primary CTA, and one stat tile (revenue plus comparison delta) as the product cue. The announcement strip is removed. The second CTA is not required in the fold. | The rendered fold was text-only, the headline wrapped to six lines, and the second button was clipped. Section 4 sets the aim; this fixes the contents so it can be verified. |
| A2. Compact briefing means three elements | PR 1 | The hero visual is the question, one answer sentence, and at most three stat tiles with one next action. No chart and no field-review control above the first narrative section. Chart and review live in the demo and the trust section. | Prevents the hero from re-growing into the current stacked dashboard-plus-review composition. |
| A3. Ambiguity budget | PR 2 | The `Cod.` example appears once, in the trust section. Each outcome example uses a distinct fixture concept: sales uses a period comparison, stock uses an observation plus movements, customers uses a confirmed identifier or the unavailable state. | Section 3 already forbids repeating the same ambiguity; a count of one makes the rule testable. |
| A4. Qualification budget | PR 1–2 | One bounded sample disclosure per section, placed once beside the hero CTA as “Fictional sample data · No account needed.” Per-element repetitions are removed, except beside stock estimates and unavailable answers as section 4 requires. | The current page carries roughly eight disclaimers; the tone had moved from honest to defensive. |
| A5. Instrument first, collect later | PR 1 (emit), PR 4 (collect) | PR 1 emits `landing_cta_selected`, `demo_started`, and `model_review_opened` through a provider interface whose only implementation is an in-repo, no-network sink with a tested property schema. PR 4 adds the reviewed collector. | Sequencing measurement last leaves PRs 2 and 3 unmeasured. Emitting to a local sink establishes a tested schema without the privacy review a collector needs; a real visitor baseline still requires the collector. |
| A6. Live entry is shown, not named | PR 2 | The how-it-works step includes a visible two-tap sample of recording a sale, with the running stock figure updating in the sample. | “Record the day as it happens” is a product pillar and currently exists only as a phrase and a tab label. |
| A7. Headline change touches the concept document | PR 1 | Adopting “See who comes back” changes the primary recommendation in `UI-UX-CONCEPT.md` §4.3 and the hero blueprint in §5.2. The PR that implements it must update both and regenerate the PDF in the same checkpoint, per the repository instructions. | Section 6 states the proposal leaves the canonical documents unchanged; implementation of this line cannot. |
| A8. Anonymous file trial has its own proposal | Outside PR 1–4 | See ADR 0005. It is scoped as an ephemeral inference preview that loads nothing, so it does not alter the FR-A-1 upload rule, and it is sequenced after the inference worker exists. | Section 8 names this as the open discovery item. The proposal records the boundary questions and a recommended answer for decision. |

Verification additions for the affected PRs: a viewport screenshot at 390×844 attached to PR 1 evidence showing the A1 contents; a page-wide search confirming `Cod.` occurs once in rendered copy for PR 2; a unit test asserting the event sink rejects properties outside the approved set for PR 1.

## Accepted amendment: Cinematic Suq (2026-09-05)

The owner approved one continuous merchant story across the landing page and fictional demo. This amendment supersedes the separate Daily decisions / How it works / Trust presentation above, while preserving the finalized PR #8 hero, plans, FAQ, and closing action.

Three chapters — Understand the day, Inspect the evidence, Try the next sale — share one typed, browser-memory scenario above the routes. Source selection, illustrative role review/confirmation, customer-evidence availability, dashboard selections, and the reversible sample sale survive navigation and language changes. Reset sample restores defaults; a refresh starts fresh. This is demonstration state, not merchant persistence or analytics.

Role review applies only to the original illustrative source records. It does not reprocess the historical dashboard. The next sale changes only the separately identified stock after the historical cutoff (12 → 11); historical money, chart observations, and risk estimates remain unchanged. Missing customer evidence makes customer analyses unavailable, never zero. Source or role changes invalidate review confirmation; repeated confirmation cannot record extra sales.

Desktop uses scrolling copy beside one sticky scene with explicit chapter controls. IntersectionObserver changes presentation only. Mobile, short viewports, enlarged content, and unsupported observers retain sequential scenes without duplicated controls. CSS provides restrained transitions with immediate reduced-motion states. Keyboard focus must never be hidden by automatic chapter changes.

Delivery: three successive, unmerged PRs against dev, in order: scenario continuity, cinematic presentation, final accessibility/performance evidence. Each includes its predecessor until earlier PRs merge. Public support/legal destinations, real analytics, authenticated onboarding, and application workflows remain separate pending work.

Acceptance: SDLC §1.2, FR-U-4/5/12, FR-G-6, FR-E-1, FR-D-12 and NFR-5/6/9/10, as illustrative marketing behavior only. Validate continuity, invalidation, cancel/undo/reset, repeated actions, Back/direct links, all locales, scroll isolation, historical integrity, keyboard/forced colors/reduced motion, mobile and short viewports, 200% text, browser accessibility, and initial JavaScript below 200 KB gzip. Capture screenshots and an interaction recording; no conversion claim without merchant evidence.

### Cinematic presentation checkpoint

The landing narrative now uses three connected chapters. The first scene has compact Sales / Stock / Customers question controls, the second reuses the original-record review, and the third reuses the preview/confirm/undo sale. Plans, FAQ, closing action and the immediate hero briefing remain below/above the story as approved. The legacy separate trust and workflow sections are removed.

With sufficient width and height, chapter copy scrolls beside one visible sticky product scene. Inactive scenes are inert and excluded from the accessibility tree during crossfades. Scroll observes chapter intersections and changes presentation only; it cannot hide a scene containing keyboard focus. Explicit chapter buttons remain available. Without IntersectionObserver, on mobile/short screens, or with enlarged text, copy and scenes remain sequential in the same DOM order with no duplicated controls.

Validation at this checkpoint: 74 web tests, including scroll/state isolation, focus protection and locale continuity; Chromium EN/ES/FR chapter controls, scroll selection, mobile/short fallback and axe including contrast. The final delivery adds the full viewport matrix, recording and performance evidence.

### Final cinematic delivery

Scenario continuity and presentation are delivered in PRs #9 and #10. The final polish branch adds route focus, direct sale links, a separate dashboard stock readout after the cutoff, double-click protection, and the forced-color/200% text corrections found during browser review. All 78 web tests and 27 browser cases passed; initial JavaScript is 122.9 KB gzip. See the final validation report for screenshots, the interaction recording, reproducible checks and remaining human review limits.

The accepted cinematic amendment replaces the earlier separate demonstration layout, not the pending public support/legal and analytics tasks. Leave the three cinematic PRs unmerged for owner review.
