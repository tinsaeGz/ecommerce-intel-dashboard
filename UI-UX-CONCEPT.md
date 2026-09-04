<meta charset="utf-8">
<title>Suq Insights — UI/UX Concept</title>
<style>
@page { size: A4; margin: 18mm 16mm 18mm; }
@media print {
  body { font-size: 9.2pt; line-height: 1.46; color: #151613; }
  h1 { break-before: page; }
  h1:first-of-type { break-before: auto; }
  h2, h3 { break-after: avoid; }
  table, pre, blockquote, .keep-together { break-inside: avoid; }
  a { color: #245f47; text-decoration: none; }
  .cover { min-height: 245mm; break-after: page; }
  .page-break { break-before: page; }
}
body {
  max-width: 980px;
  margin: 0 auto;
  padding: 28px;
  background: #fbfbf7;
  color: #151613;
  font-family: "DejaVu Sans", Arial, sans-serif;
  line-height: 1.58;
}
h1, h2, h3, h4 { color: #10110e; line-height: 1.16; }
h1 { margin-top: 2.4em; padding-top: .2em; font-size: 2.15em; border-top: 7px solid #c9f54a; }
h2 { margin-top: 1.9em; font-size: 1.55em; }
h3 { margin-top: 1.35em; font-size: 1.15em; }
h4 { margin-bottom: .35em; }
p, li { orphans: 3; widows: 3; }
table { width: 100%; border-collapse: collapse; margin: 1em 0 1.4em; font-size: .88em; }
th { background: #e9f7bc; color: #10110e; text-align: left; }
th, td { padding: 8px 9px; border: 1px solid #d9ddd2; vertical-align: top; }
tr:nth-child(even) td { background: #f5f6f1; }
blockquote { margin: 1.1em 0; padding: .75em 1em; border-left: 5px solid #c9f54a; background: #f1f3eb; }
code { color: #244c3d; background: #eef2e9; padding: .1em .25em; border-radius: 3px; }
pre { padding: 14px; color: #edf6e9; background: #171916; border-radius: 10px; white-space: pre-wrap; font-size: .82em; line-height: 1.35; }
pre code { color: inherit; background: transparent; padding: 0; }
hr { margin: 2em 0; border: 0; border-top: 1px solid #d8dbd1; }
.cover { display: flex; flex-direction: column; justify-content: space-between; padding: 18mm 12mm; box-sizing: border-box; background: linear-gradient(145deg, #fbfbf7 38%, #dcf6e9 68%, #d8d0ff 100%); border: 1px solid #dde1d6; border-radius: 24px; }
.cover-kicker { display: inline-block; width: fit-content; padding: 7px 11px; color: #10110e; background: #c9f54a; border-radius: 999px; font-size: .78em; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.cover h1 { max-width: 720px; margin: .55em 0 .2em; padding: 0; border: 0; font-size: 3.45em; letter-spacing: -.045em; }
.cover h1 em { font-family: "DejaVu Serif", Georgia, serif; font-weight: 400; }
.cover-deck { max-width: 650px; font-size: 1.25em; }
.cover-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.cover-card { min-height: 74px; padding: 14px; background: rgba(255,255,255,.72); border: 1px solid rgba(16,17,14,.12); border-radius: 14px; }
.small { color: #5d6359; font-size: .82em; }
.label { color: #526057; font-size: .72em; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
</style>

<div class="cover">
  <div>
    <span class="cover-kicker">Product experience concept · v1.2</span>
    <h1>Suq Insights<br><em>Clarity for every market day.</em></h1>
    <p class="cover-deck">A comprehensive landing-page, dashboard, visual-system, content, conversion, and implementation blueprint for the production SaaS.</p>
  </div>
  <div class="cover-strip">
    <div class="cover-card"><span class="label">Landing page</span><br><strong>Trust → understanding → action</strong></div>
    <div class="cover-card"><span class="label">Product</span><br><strong>Messy records → useful answers</strong></div>
    <div class="cover-card"><span class="label">Experience</span><br><strong>Calm, credible, merchant-first</strong></div>
  </div>
  <p class="small">Updated 5 September 2026 · Canonical product source: SDLC.md v3.0 · English master copy with Spanish and French localization requirements</p>
</div>

# Document purpose and status

This document defines a coherent experience for the Suq Insights marketing site and authenticated merchant product. It turns the product behavior in `SDLC.md` into a visual direction, page narrative, dashboard structure, component inventory, responsive behavior, content system, marketing initiatives, and implementation checklist.

It is a concept and delivery brief, not a replacement for the SDLC. Where the two conflict, `SDLC.md` wins. Headlines and sample values are working copy until product, legal, localization, and evidence reviews approve them. Testimonials, customer logos, performance claims, prices, and regional availability must never be invented to fill a layout.

## Outcomes this document should create

- A visitor understands the product in one screen: Suq accepts the records a merchant already has and turns them into daily sales, stock, and customer answers.
- The landing page and product feel like one brand, not a marketing theme bolted onto a generic admin template.
- The first authenticated screen is useful with real merchant data and instructive before data exists.
- Designers and engineers can make small decisions consistently: spacing, pagination, empty states, widget errors, chart colors, mobile reordering, copy tone, and conversion tracking are specified.
- Launch scope stays honest. Profit, margin, cash-flow, returns, and advertising-attribution metrics are not shown until their semantic roles and calculations exist in the product contract.

## Working product promise

> **Know what’s selling. See what runs out next. Bring customers back.**

Supporting promise:

> Upload the records you already keep—spreadsheets, exports, pasted tables, PDFs, or photos. Suq Insights helps you confirm what they mean, then turns them into a clear daily view of your business.

This promise is specific enough to remember, broad enough for the launch catalog, and faithful to the platform’s core differentiator: it adapts to merchant data instead of demanding a predefined schema.

---

# Contents

1. Experience strategy
2. Inspiration translated into Suq
3. Brand theme: Market Day Intelligence
4. Voice, message, and copy system
5. Landing-page architecture
6. Landing-page product mockups
7. Marketing and growth initiatives
8. Authenticated product information architecture
9. Dashboard concept
10. Launch widget presentation
11. Critical supporting screens
12. Component behavior in detail
13. Responsive behavior
14. Accessibility specification
15. Localization and international UX
16. Motion and interaction
17. Analytics and measurement plan
18. Implementation architecture for the experience
19. Delivery sequence
20. Acceptance checklist
21. SDLC traceability
22. Content and design dependencies

The final pages contain source references and document ownership. Each numbered chapter begins on a new PDF page for scanning and review.

---

# 1. Experience strategy

## 1.1 The problem in the merchant’s language

The user is not shopping for “a composable analytics substrate.” They are trying to answer practical questions before opening, ordering stock, or closing the day:

- What sold today, this week, or this month?
- Which items are moving and which are sitting?
- What will run out soon?
- Which customers returned?
- Is today’s dashboard based on current, correctly interpreted data?

Their evidence is fragmented and imperfect: POS exports, marketplace files, manually maintained sheets, pasted rows, photographs of paper, and records entered while connectivity is weak. Most analytics products begin by asking them to clean, rename, map, or integrate. Suq begins by understanding what arrived, showing its reasoning, and asking the merchant to confirm only what cannot be proven.

## 1.2 Positioning

**Category:** merchant intelligence and operational analytics.

**Primary differentiator:** useful analysis from the records a merchant already keeps, with visible interpretation and merchant confirmation before commitment.

**Emotional benefit:** confidence. The merchant should feel “I know what happened, I know what needs attention, and I can see why the system believes it.”

**Functional benefit:** one daily view across sales velocity, inventory, retention, alerts, channels, and record freshness.

**Positioning line:**

> Suq Insights is the daily intelligence workspace for merchants whose data does not arrive in a perfect shape.

## 1.3 Audience hierarchy

| Audience | Immediate anxiety | Desired first proof | Primary action |
|---|---|---|---|
| Merchant owner | “I have data, but no reliable daily picture.” | A recognizable upload becomes one concrete insight. | Start free / try a sample |
| Merchant staff | “I need to record and check today without breaking anything.” | Quick entry, clear status, safe correction, and visible sync. | Enter data / review alerts |
| Evaluating operator | “Will this work with my strange export?” | Supported-source examples and the inference-review experience. | Explore the demo |
| Premium prospect | “Will the paid plan remove real limits?” | Exact contextual unlock: longer history, SMS/email alerts, sync API, team seats, multiple dashboards, exports, no ads. | Compare plans |
| Advertiser | “Can I reach merchants in a relevant, measurable context?” | Clearly separated advertiser proposition and audited campaign controls. | Visit advertiser portal |

The primary landing page serves merchant owners. Advertiser and administrator experiences must not leak into the merchant narrative or navigation.

## 1.4 North-star experience

**Messy in. Clear out. Nothing silently guessed.**

Every important interaction should reinforce one of four qualities:

1. **Clear:** plain language, visible hierarchy, one primary action per region.
2. **Trustworthy:** interpretation evidence, data freshness, provenance, and honest unavailable states.
3. **Useful today:** insights and next actions appear before configuration options.
4. **Adaptable:** merchant-defined channels, editable models, movable widgets, multiple input forms, and localized conventions.

## 1.5 Experience principles

### Answers before features

Lead with “what is selling?” rather than “advanced analytics.” Widget titles are questions or direct outcomes, and landing-page sections describe decisions merchants can make.

### Evidence beside conclusions

An insight links to the contributing widget, filtered records, or derived-state provenance. Confidence is described in plain language and supported visually; color alone never communicates certainty.

### Progressive complexity

The default canvas is excellent without editing. Advanced controls—render switching, thresholds, field roles, dashboard templates—appear at the point of need.

### Recovery is a first-class path

Uploads can be corrected, loads can be reversed, entries can roll back, models can be revised, and failed widgets can retry independently. The interface explains what will happen before destructive changes.

### International by construction

Layouts tolerate long French labels, Spanish accents, variable currency formats, day-first dates, and locale-specific number separators. No country flag is used as a language icon.

---

# 2. Inspiration translated into Suq

The references inform different parts of Suq: Milestone supplies the theme, the ecommerce dashboard supplies product organization, and Lightdash supplies the presentation rhythm. Each is rebuilt around Suq’s product behavior.

## 2.1 Milestone landing-page influence

Reference: [Milestone Webflow template](https://milestone-webflow-html-website-template.webflow.io/)

Patterns worth carrying forward:

- Oversized, high-contrast hero typography; the updated presentation uses left-aligned copy within a shared page frame.
- A bold sans-serif paired with a selective italic serif for warmth and emphasis.
- Mostly white surfaces with acid-lime actions and soft mint, aqua, and lavender ambient gradients.
- An oversized product mockup that makes the software tangible immediately. Suq uses the straight-on composition specified in §3.7.
- Alternation between airy white sections and black editorial panels.
- Rounded cards, simple line illustrations, sparse hand-drawn marks, and concise feature copy.
- Product-led calls to action repeated at natural decision points.

Suq adaptation:

- Replace finance language with daily merchant decisions.
- Show a trustworthy dashboard and mapping-review sequence, not banking cards or transactions.
- Use market-inspired details abstractly—grid, rhythm, labels, tally marks—not literal bazaars, flags, or regional stereotypes.
- Keep decorative gradients outside data visualizations. Analytical colors retain stable meanings.

## 2.2 Ecommerce dashboard influence

Reference: [E-commerce Management Dashboard by Vetrick Wilsen for Yow](https://dribbble.com/shots/25024243-E-commerce-Management-Dashboard)

Patterns worth carrying forward:

- A quiet gray application background with a large white workspace.
- A persistent left rail, top breadcrumb/context line, and clearly separated content canvas.
- Large rounded cards with restrained borders and generous internal spacing.
- Top-row metrics for quick scanning; charts and ranked lists below.
- Black or near-black primary data marks, muted secondary data, and one controlled accent.
- Clear workspace or store identity near the page title.

Suq adaptation:

- The sidebar reflects Suq’s flat merchant information architecture, not store-management modules.
- Cards become movable, resizable widget frames with explicit widget-level controls.
- “Sales by country,” order-fulfillment, and team contact panels become insight, inventory, alerts, data freshness, and top-item widgets.
- The date in the header becomes a merchant-timezone date range with freshness status.
- The product must work with incomplete capabilities: a missing customer identifier explains why retention is unavailable instead of showing zero.

## 2.3 Product-market references

| Reference | Useful lesson | Suq’s interpretation |
|---|---|---|
| [Triple Whale](https://www.triplewhale.com/) | Strong outcome language and product screenshots make an abstract data platform feel actionable. | Speak in merchant decisions and show the real daily canvas; avoid claiming AI actions or attribution features Suq does not ship. |
| [Polar Analytics](https://www.polaranalytics.com/) | Goal-based navigation and a no-signup demo reduce evaluation risk. | Organize use cases around selling, stock, and returning customers; provide a sample-data playground. |
| Milestone | Editorial contrast makes finance software feel approachable. | Use a confident black/white/lime identity with soft supporting color. |
| Yow dashboard shot | Spatial calm and familiar ecommerce patterns lower learning cost. | Retain the calm shell while making every analytical frame a true Suq widget instance. |
| [Lightdash on Saaspo](https://saaspo.com/pages/lightdash-landing-page) | A bounded page, large product demonstrations, and varied section density connect benefits to evidence. | Keep the Suq theme; present merchant questions, answers, supporting records, and a useful next action. |

## 2.4 What not to copy

- Decorative charts that do not match a real metric contract.
- Low-contrast gray text, tiny labels, or icon-only actions without names.
- Empty customer-logo walls, fictional testimonials, or unsupported performance percentages.
- Huge animations that delay comprehension or violate reduced-motion preferences.
- A permanent right rail that reduces the twelve-column canvas or breaks small laptops.
- A fixed dashboard that visually resembles widgets but cannot actually be rearranged.
- Generic “AI-powered growth” language. Suq’s trust comes from showing interpretation, evidence, and confirmed roles.

## 2.5 Lightdash presentation influence

Reference: [Lightdash landing-page capture on Saaspo](https://saaspo.com/pages/lightdash-landing-page). This is a presentation reference, not a source of Suq product capabilities. Some media panels in the capture are blank; no behavior is inferred from those panels.

- **Continuous frame:** subtle vertical rails and shared section edges keep the page connected. Use the existing 1,280 px content maximum with responsive inner gutters. Sparse ledger dots belong behind product stages; they must not reduce text contrast.
- **Large product demonstration:** begin with a merchant question, a concise answer, and useful actions before the detailed briefing. Keep one straight-on surface. Stock and evidence disclosures work by keyboard and touch; the review link moves focus to the corresponding section.
- **Feature chapters:** give records, interpretation review, and daily decisions room for one dominant mockup each. A source selector or workflow tabs change only their own stage. Mobile and reduced-motion views show readable static workflow cards.
- **Merchant situations:** use illustrative questions about incompatible exports, late numbers, and ambiguous columns in the problem section. Label them as illustrations; never give them fabricated customer identities, logos, or testimonial attribution.
- **Outcome grid:** show six inspectable principles: evidence, confirmation, source preservation, honest missing data, period context, and localization. Prefer statements demonstrated by the preview. Future behavior remains part of the delivery plan until implemented.
- **Transformation:** the existing Add → Confirm → See sequence is the first transformation timeline. Later iterations can extend it to repeated daily use; do not invent a five-day onboarding or productivity promise.
- **Closing invitation:** a dark Ink panel with lime action invites the visitor into Mercado Norte's fictional demo. The account-access alternative remains explicitly a preview until authentication is connected.
- **Brand detail:** original SVG ledger cells and receipt edges carry Suq's lime/mint palette at the hero and close. Hide decoration on narrow screens and in forced colors. Do not copy Lightdash's purple pixel artwork, copy, logos, security badges, or developer positioning.

The presentation revision covers the existing foundations and understanding sequence, its outcome summary, and closing invitation. Dedicated daily-question panels, the full trust demonstration, channels, offline entry, and composable dashboards remain subsequent delivery work. This revision does not mark Phase 3 or the SaaS complete.

---

# 3. Brand theme: Market Day Intelligence

## 3.1 Theme statement

**Market Day Intelligence** combines the energy of a busy market with the order of a well-kept ledger. The interface feels bright, alert, and human without becoming playful about money or data integrity.

The landing page is expressive: oversized type, editorial emphasis, ambient color, and cinematic product mockups. The application is calmer: neutral surfaces, compact typography, stable semantic colors, and restrained motion. They share the same tokens, border language, icon style, and lime action color.

## 3.2 Visual personality

| Attribute | We want | We avoid |
|---|---|---|
| Confidence | Strong type, direct copy, visible evidence | Hype, exaggerated claims, aggressive urgency |
| Warmth | Editorial serif moments, gentle color haze, human examples | Cartoon mascots in serious workflows |
| Clarity | Strong grouping, meaningful whitespace, labels beside icons | Glassmorphism, excessive blur, ornament around tables |
| Energy | Acid-lime action, crisp charts, live-status pulse | Rainbow dashboards and constant movement |
| Global relevance | Neutral merchant examples and flexible locale patterns | Flags, clichés, or one-market assumptions |

## 3.3 Color system

| Token | Hex | Role | Usage rule |
|---|---:|---|---|
| Ink 950 | `#10110E` | Primary text, dark panels, chart series 1 | Use as the dominant high-contrast anchor. |
| Paper 50 | `#FBFBF7` | Marketing background, light app surface | Warmer than pure white; do not use behind white cards without a boundary. |
| White | `#FFFFFF` | Cards, modal surfaces, dashboard canvas | Pair with a border or shadow on Paper/Mist. |
| Mist 100 | `#F0F2EC` | App background, selected rows, disabled wells | Never use for essential low-contrast text. |
| Slate 600 | `#596158` | Secondary copy | Minimum size 14 px; verify contrast on every surface. |
| Lime 400 | `#C9F54A` | Primary action, focus emphasis, brand moment | Black text only. Never use lime text on white. |
| Mint 300 | `#9BE5C1` | Healthy/complete supporting fill | Pair with Ink text and an icon or label. |
| Aqua 300 | `#9EDFED` | Informational/supporting series | Not a link color on white without a darker tone. |
| Lavender 300 | `#CFC6FF` | Comparison/context supporting fill | Decorative or secondary series; not error/status. |
| Amber 400 | `#F2BE4A` | Warning, needs review, low confidence | Always pair with “Review” or warning icon. |
| Coral 500 | `#E9685A` | Error, critical stock, destructive action | Use sparingly and with explicit text. |
| Forest 700 | `#286448` | Accessible success text and positive delta | Use on pale mint or white. |
| Blue 700 | `#245E78` | Accessible links and informational text | Underline body-copy links. |

Semantic color is stable across marketing and product. Green means healthy or complete, amber means attention, coral means failure or urgency, and blue means informational. Positive revenue movement may use Forest, but negative values never rely on red alone: arrows, signs, and labels remain visible.

Dark mode is a post-launch enhancement unless scheduled by the implementation plan. Tokens should be named semantically so it can be added without rewriting components; launch testing should not be diluted by shipping an unvalidated second theme.

## 3.4 Typography

**Primary sans:** Inter Variable or a metrically compatible system sans. Use for navigation, product UI, body copy, tables, controls, and chart labels.

**Editorial serif:** Source Serif 4 Italic. Use selectively in landing-page headlines, quotations, and one-line moments of emphasis. Do not use in tables, form labels, or dense dashboard cards.

| Style | Desktop | Mobile | Weight/line height | Use |
|---|---:|---:|---|---|
| Display XL | 72 px | 44 px | 650 / 0.98 | Landing hero only |
| Display L | 56 px | 38 px | 650 / 1.02 | Major campaign page hero |
| H1 product | 32 px | 28 px | 650 / 1.18 | Screen title |
| H2 section | 40 px | 30 px | 620 / 1.12 | Marketing section heading |
| H2 product | 22 px | 20 px | 650 / 1.25 | Product region heading |
| Body L | 20 px | 18 px | 400 / 1.55 | Marketing deck |
| Body | 16 px | 16 px | 400 / 1.55 | Default copy |
| UI | 14 px | 14 px | 500 / 1.4 | Controls and card content |
| Data L | 30 px | 26 px | 650, tabular / 1.1 | KPI values |
| Caption | 12 px | 12 px | 550 / 1.35 | Metadata; never essential alone |

Use tabular numerals for metrics. Never tighten tracking on translated uppercase labels; use sentence case in product UI.

## 3.5 Layout, spacing, radius, and elevation

- Base spacing unit: 4 px.
- Common steps: 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96, 128.
- Marketing content maximum: 1,280 px; readable copy maximum: 680 px.
- Dashboard maximum: fluid within viewport; content padding 24 px desktop, 16 px tablet/mobile.
- Dashboard grid: twelve columns desktop, eight tablet, four mobile. Widget gap: 16 px compact, 20 px standard.
- Radius: 8 px controls, 12 px small cards, 16 px widgets, 24 px marketing feature panels, pill only for tags/status.
- Borders: 1 px `#D9DDD2`; selected border: 2 px Ink or accessible Forest.
- Shadows are subtle and functional: cards use border first; overlays use `0 16px 48px rgba(16,17,14,.16)`.
- Minimum interactive target: 44 × 44 px, even when the visible icon is 20 px.

## 3.6 Iconography and illustration

- Use a single 1.75 px rounded line-icon family, 20 px default and 16 px in dense tables.
- Pair unfamiliar icons with visible labels. Tooltips supplement; they never replace accessible names.
- Use hand-drawn marks only on marketing pages: a short underline, star, arrow, or tally. They should feel like annotations in a merchant’s notebook, not decorative noise.
- Empty-state illustrations are abstract tables, columns, receipts, boxes, and trend marks. Avoid region-specific costumes, currency piles, or literal marketplace scenes.

## 3.7 Product mockup style

Mockups are the connective tissue between landing page and product:

- Use real Suq components and plausible, localized sample data.
- Display the hero as a straight-on Suq product surface with a decision-led hierarchy. Avoid decorative browser chrome, device tilt, floating cards, and equal-weight KPI grids that make the product resemble a generic analytics template.
- Build the hero around one editorial answer, adjacent actions, supporting evidence, freshness, and a visible interpretation-review item. Later mockups crop to the specific decision or review state being explained.
- Highlight one interaction per mockup: upload review, live dashboard update, stock warning, or mobile quick entry.
- Keep sample merchant names fictional and clearly generic. Do not use real customer data.
- A mockup caption states the user benefit, not the component name: “Confirm what every column means before it affects your totals.”
- Every screenshot has meaningful alt text; decorative device chrome is ignored by assistive technology.

## 3.8 Data-visualization language

Charts should look calm but never be vague.

- Ink is the primary series. Aqua, Lavender, Mint, and Amber are ordered supporting series.
- Coral is reserved for risk or negative exceptions, not the fourth category in a palette.
- Axes and grid lines use Mist/Slate at accessible contrast; labels remain readable at 200% zoom.
- Tooltips show full date, localized number, unit/currency, comparison, and data freshness.
- Legends are interactive only when keyboard and screen-reader equivalents exist.
- Time-series charts never truncate the y-axis when the visual implication would be misleading.
- Donuts aggregate small categories into “Other” and are not offered for high-cardinality dimensions.
- Missing data uses gaps and an explicit “No data recorded” annotation, not zero.
- Forecasts use a dashed line and shaded confidence band with a text legend.
- Every chart offers a table render or accessible data summary.

---

# 4. Voice, message, and copy system

## 4.1 Voice

Suq speaks like a capable operator beside the merchant: concise, specific, calm under failure, and never condescending.

| Situation | Voice | Example |
|---|---|---|
| Marketing | Clear and optimistic | “Your records already know what happened. Suq helps you see it.” |
| Guidance | Direct and explanatory | “Choose the column that identifies an item. This unlocks item-level sales and stock views.” |
| Success | Useful, not celebratory theater | “1,248 rows added. 36 duplicates skipped.” |
| Warning | Consequence first | “This looks unlike your usual sales file. Review it before stock totals change.” |
| Error | What happened + recovery | “We could not find a table in this image. Retake it in brighter light with the full page visible.” |
| Empty state | Explain value + one action | “Retention needs a customer identifier. Assign one in Data review.” |
| Upsell | Exact capability, no pressure | “View more than 90 days. Premium keeps your full history available.” |

## 4.2 Terminology

Prefer user language consistently:

- **Add data** as the broad action; use **Upload file**, **Paste table**, **Take a photo**, or **Enter manually** as methods.
- **Channel** is a saved, named stream with declared intent. Explain it on first use: “A channel remembers what this kind of data means.”
- **Data review** in navigation and headings; “domain model” stays in technical documentation.
- **Field meaning** or **Used as** in forms; “semantic role” stays in help content.
- **Undo load** in the interface, with an explanation that all rows from that load and affected totals will be recalculated.
- **Dashboard** for a named canvas; **widget** for a movable question/answer frame.

## 4.3 Headline bank

Primary recommendation:

> **Know what’s selling. See what runs out next. Bring customers back.**

Alternatives for testing:

- **Your business is already speaking. See what the numbers say.**
- **From the records you keep to the answers you need.**
- **A clearer market day starts with the data you already have.**
- **Messy records. Clear next moves.**

Supporting lines:

- “No rigid template. Suq understands the structure, shows you its interpretation, and waits for your confirmation.”
- “Sales, stock, and returning customers—one daily workspace built around your business.”
- “Upload once or record the day as it happens. Your canvas updates as new data lands.”

## 4.4 CTA hierarchy

| Intent | Primary label | Secondary label | Avoid |
|---|---|---|---|
| First visit | Start free | Explore the demo | Get started, Learn more everywhere |
| Skeptical evaluator | Try sample data | See how review works | Upload your private data before trust is established |
| Returning visitor | Log in | Compare plans | Sign in / Log in mixed inconsistently |
| Empty dashboard | Add your first data | Try a sample | Configure dashboard first |
| Data ready | Review fields | View source | Continue without describing the next step |
| Premium boundary | Unlock full history | Compare plans | Upgrade now with artificial urgency |

Any claim such as “no credit card required,” “setup in five minutes,” customer counts, accuracy percentages, or money saved requires verified evidence before publication.

---

# 5. Landing-page architecture

## 5.1 Page narrative

The landing page follows a simple persuasion sequence:

```text
Recognition        “That is my problem.”
      ↓
Comprehension      “I understand what Suq does.”
      ↓
Trust              “It will not silently corrupt my numbers.”
      ↓
Relevance          “It answers the questions I ask every day.”
      ↓
Proof              “This works for businesses like mine.”
      ↓
Low-risk action    “I can try it safely.”
```

The global navigation remains short: **Product · How it works · Use cases · Pricing · Resources**, followed by language, **Log in**, and the lime **Start free** button. On mobile, product links live in a full-height menu; Log in and Start free remain visible at the bottom of that menu.

## 5.2 Section blueprint

### 0. Announcement strip

**Purpose:** create relevance without a fake promotion.

**Recommended copy:** “Built for the records you already keep—spreadsheets, exports, PDFs, photos, and more.”

**Component:** slim lime strip, centered text, optional arrow link to supported sources. It may be dismissed for the session. Never rotate multiple messages or introduce a carousel.

### 1. Hero: the daily promise

**Eyebrow:** “Commerce clarity from the data you already have”

**Headline:** “Know what’s selling. *See what runs out next.* Bring customers back.”

**Deck:** “Upload the records you already keep or record the day as it happens. Suq confirms what your data means, then turns it into a clear daily view of sales, stock, and returning customers.”

**Actions:** lime **Start free**; text/outlined **Explore the demo**.

**Reassurance line:** “English · Español · Français” and supported-source icons. Do not claim a trial length or no-card signup until billing policy confirms it.

**Composition:** left-aligned headline and copy inside the continuous page rails, with a restrained ledger motif at the upper corner. The product stage occupies the full inner width below the copy on a quiet dotted surface. Paper, Ink, Lime, Mint, and the existing serif emphasis retain the Suq theme.

**Question → answer → action:** “What needs my attention today?” leads into “Revenue is up 18%. Three products may run out soon. One field still needs your confirmation.” The product stage is visibly labelled fictional sample data. Native disclosures show the stock estimates and source evidence; “Review ‘Cod.’” links to the interpretation chapter and moves keyboard focus there. The pending field is separate from the confirmed revenue fields and must never imply that an unconfirmed import changed the totals.

**Visual:** a straight-on merchant morning briefing uses real Suq components without browser chrome, device tilt, or decorative haze. Its asymmetrical hierarchy makes the input-to-insight relationship concrete instead of resembling a generic admin template. The visual should show:

- One dominant revenue answer with localized currency and a restrained supporting trend.
- A plain-language explanation with a nearby evidence line and confirmed transaction count.
- A prioritized stock action queue rather than another equal-weight metric card.
- A compact daily glance for transactions, units, and returning customers.
- One ambiguous source field that visibly requires confirmation before commitment.
- “Updated moments ago” freshness and source count.

**Interaction:** use one short entrance after the copy; do not add parallax or decorative pointer movement. Reduced-motion users see the final static composition immediately. The hero content renders before the mockup and remains within the initial weight budget.

**Mobile:** stack copy, CTAs, reassurance, then crop the briefing to its answer, daily glance, and review item. The wider stock queue may be omitted from the crop when retaining it would make the decision text illegible. No product surface may cause horizontal overflow.

### 2. Source ribbon: “Start where your records are”

**Purpose:** resolve the first objection: “Will it accept my format?”

**Content:** CSV, Excel, pasted table, JSON, POS export, marketplace export, image, PDF, manual entry, Sync API. Use neutral format icons, not unverified integration logos.

**Microcopy:** “No fixed column names. No required order. You confirm the meaning before totals change.”

**Interaction:** selecting a source changes a large adjacent stage from raw input to recognized table. Keyboard users receive the same change through tabs. The section shares the page rails and uses thin separators rather than a collection of disconnected floating cards.

### 3. Problem framing: “Your data should not need a new job before it can help you”

Use a dark Ink chapter with three bordered columns that stack on mobile. Precede each explanation with an illustrative merchant question, explicitly labelled as an example rather than a testimonial:

1. **Every export looks different.** “Columns move, headings change, and dates mean different things.”
2. **Manual cleanup steals the decision window.** “By the time the sheet is ready, the stock decision is already late.”
3. **A confident wrong answer is worse than no answer.** “Suq shows uncertainty and asks before it commits.”

Example questions: “Why does every export need a different spreadsheet?”, “Can I get the numbers before it is too late to act?”, and “Did this column mean quantity or revenue?” Use Paper text, lime sequence markers, and serif emphasis for the questions. The whole chapter introduces the trust position; nothing auto-scrolls or requires motion to be read.

### 4. How it works: “From messy records to a useful morning view”

Use a three-act scrollytelling or tabbed sequence. Scrollytelling collapses to static cards on reduced motion and mobile.

**Act 1 — Add what you have.** File, photo, pasted table, or entry channel.

**Act 2 — Confirm what it means.** Show detected field, type, assigned use, confidence, sample values, and a visible edit. Copy: “Suq proves what it can and flags what it cannot.”

**Act 3 — See what matters.** The confirmed fields animate into the starting dashboard. Copy: “Only supported analyses appear. Missing concepts are explained, never treated as zero.”

Primary CTA after the sequence: **Try sample data**.

In the current preview, follow the sequence with **Clarity you can check**, a six-cell grid of evidence, confirmation, preservation, missing-data, context, and localization principles. Its copy points to behavior visible in the sample. Finish with a dark invitation to explore Mercado Norte and an honest account-access preview link. As later phases arrive, these two closing sections move after the new product chapters.

### 5. Three daily questions

This is the product’s memorable center. Use three large feature panels, alternating image and copy.

#### What is selling?

**Headline:** “See momentum while it still matters.”

**Copy:** “Track revenue, transactions, units, period patterns, top items, and slow movers from one confirmed source of truth.”

**Mockup:** revenue-over-time with comparison, top-items ranked bar, and a narrative insight. Use a question label above the panel.

#### What is about to run out?

**Headline:** “Order before the shelf answers for you.”

**Copy:** “See stock status, days remaining, depletion forecasts, and a reorder list—with provenance behind every derived quantity.”

**Mockup:** stock-status table and days-of-stock gauge. Expand one item to show latest observation + deliveries − sales.

#### Which customers come back?

**Headline:** “Turn repeat business into something you can see.”

**Copy:** “Understand repeat versus new customers, cohorts, purchase frequency, and top customers when your data includes a customer identifier.”

**Honesty note:** show the unavailable state too: “Retention needs a customer identifier. Assign one in Data review.”

### 6. Trust mechanism: “Nothing silently guessed”

Use a black section with white copy, an acid-lime confidence indicator, and a high-resolution crop of the review screen.

**Headline:** “The system proposes. You decide.”

**Body:** “Suq detects structure, types, and likely meanings from headers and values. Before data is committed, you see the evidence, correct any uncertainty, and preview what the dataset can support.”

Four proof points:

- Actual sample values beside every interpretation.
- Low-confidence cells beside the source image region.
- Reusable confirmed models for returning formats.
- Editable history without re-uploading raw records.

CTA: **See the review experience**.

### 7. Channels and live entry: “Keep the picture current”

**Narrative:** “Upload weekly, record each sale, paste the closing table, or sync from another system. A channel remembers what that stream means, so every path feeds the same answers.”

Use a horizontal flow:

```text
Daily sales channel        Supplier deliveries channel       Monday count channel
file · photo · entry       file · paste · API                entry · photo
          \                     |                            /
                 confirmed records → derived stock → widgets
```

Show quick entry on a phone and the live freshness indicator on desktop. Mention offline queuing visibly: “3 entries waiting to sync.”

### 8. Composable dashboard: “Your morning check is not your weekly review”

**Body:** “Start with a useful dashboard, then move, resize, rename, or render each question the way you think. Keep separate dashboards for different routines.”

Mockup sequence:

1. Default canvas after first upload.
2. Widget picker previewing the merchant’s own data.
3. “Weekly review” dashboard with retention and customers.
4. Mobile reorder list.

Callout: “Changing a chart style does not recalculate the data.”

Premium boundary: one dashboard is free; multiple named dashboards are premium. Explain without interrupting the demonstration.

### 9. Global readiness

**Headline:** “Local conventions. One reliable model.”

Show the same compact metric in English, Spanish, and French with appropriate number, date, and currency conventions. Include timezone/day-boundary explanation.

Do not use flags. Use language names in their own language: English, Español, Français.

### 10. Proof

At pre-launch, use **product proof**, not fictional social proof:

- An interactive sample dataset.
- A supported-source matrix.
- A short explanation of tenant isolation and EU data residency.
- A measurable product standard: dashboard target under 300 ms p95, clearly labeled as a target until production evidence exists.
- A transparent “How interpretation works” page.

After beta, replace or supplement with approved customer evidence:

- One quantified case study tied to an auditable method.
- Short testimonials with name, role, business, locale, and consent.
- Customer logos only when contractual approval exists.

### 11. Comparison: “Built for real merchant records”

| Capability | Spreadsheets alone | Fixed-schema dashboard | Suq Insights |
|---|---|---|---|
| Accepts varied structures | Manual cleanup | Usually no | Infers, then asks for confirmation |
| Preserves unknown fields | Yes, but unmodeled | Often dropped | Retained as typed attributes |
| Correctable interpretation | Manual formulas | Re-import/configuration | Remodels retained history |
| Daily entry and uploads | Separate processes | Integration-dependent | Same channel and records path |
| Derived stock provenance | Manual | Varies | Inspectable observation + events |
| Dashboard composition | Manual charts | Often fixed | Question-based movable widgets |

Keep the comparison factual and review competitor claims before naming a competitor.

### 12. Pricing

Use two primary cards: **Free** and **Premium**. A third enterprise card is not justified by the current SDLC.

**Free:** one dashboard, 90-day visible history, dashboard alerts, plan upload quotas, contextual sponsored widget.

**Premium:** unlimited history subject to retention policy, multiple dashboards, predictive alerts over email/SMS, team seats, Sync API, full exports, priority support, ad-free workspace.

The exact price, tax display, regional billing providers, and annual discount are product dependencies. Display tax clearly before checkout. Each capability links to a concise explanation; do not hide important limits in tooltips.

### 13. FAQ

Recommended launch questions:

1. What files can I use?
2. Do I need to rename or reorder columns?
3. What happens when Suq is unsure about a field?
4. Can I correct an upload after it is processed?
5. How does Suq calculate current stock?
6. What if my data does not include customer information?
7. Is my business data separated from other merchants?
8. What happens to my history if I downgrade?
9. Which languages, currencies, and timezones are supported?
10. What is shown in the free plan’s sponsored widget?

Answers should be visible in an accessible accordion with correct heading and button semantics; one answer may remain open by default on desktop, all closed on mobile.

### 14. Final CTA and footer

**Headline:** “Your next clear decision is already in your records.”

**Actions:** **Start free** and **Try sample data**.

Footer groups: Product, Use cases, Resources, Company, Legal, Language. Include status, accessibility, privacy, terms, security, and support links. Advertiser access sits in the footer, not the primary merchant navigation.

## 5.3 Landing-page wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Announcement: built for the records you already keep                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Suq   Product  How it works  Use cases  Pricing  Resources   EN  Log in [CTA]│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ COMMERCE CLARITY FROM YOUR DATA                          ledger cells       │
│ Know what’s selling. See what runs out next.                                 │
│ Bring customers back.                                                        │
│ [Start free]  [Explore the demo]                                             │
│                                                                              │
│ What needs my attention today?                 FICTIONAL SAMPLE DATA       │
│ Answer → [Stock risks] [Evidence] [Review Cod.]                              │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Straight-on briefing: answer, evidence, action queue, daily glance      │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ CSV · Excel · Paste · JSON · POS · Marketplace · Image · PDF · Entry · API  │
├──────────────────────────────────────────────────────────────────────────────┤
│ DARK PROBLEM CHAPTER: illustrative merchant questions                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Add → Confirm → See: one large stage; static workflow on mobile             │
├──────────────────────────────────────────────────────────────────────────────┤
│ WHAT IS SELLING?                │ product mockup                             │
│ product mockup                  │ WHAT WILL RUN OUT?                         │
│ WHICH CUSTOMERS RETURN?         │ product mockup                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ BLACK TRUST PANEL: Nothing silently guessed                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ Channels + live entry             Composable dashboard                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Global readiness · Proof · Comparison · Pricing · FAQ                       │
│ Inspectable outcome grid · Dark sample-demo invitation · Footer             │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. Landing-page product mockups

The page should not rely on one repeated screenshot. Build a small mockup set from production components so changes stay synchronized with the product.

## 6.1 Hero dashboard mockup

Desktop sample content:

- Workspace: “Mercado Norte” (fictional).
- Above the briefing: one daily question, a visible sample-data label, an answer, stock/evidence disclosures, and a working link to interpretation review. Essential meaning must remain accessible outside any decorative `aria-hidden` mockup crop.
- Date: “Today · 3 Sep” using the selected locale and timezone.
- Editorial answer: “Revenue is 18% above the comparison period, led by Canvas Tote and Ground Coffee.”
- Evidence line: “POS export · 312 confirmed transactions.”
- Prioritized action queue: Ground Coffee, Canvas Tote, and Ceramic Cup with readable days-remaining labels.
- Daily glance: 312 transactions, 468 units, and 38 returning customers.
- Review item: “`Cod.` may be the item identifier,” with an explicit Review action and abbreviated-header evidence.
- A restrained revenue sparkline that supports the answer instead of dominating it.
- Freshness: “Updated 2 minutes ago · 4 sources.”

Use varied product names that translate cleanly and avoid sensitive customer detail. Sample numbers must be internally consistent across charts, tooltips, and tables. The composition must retain clear primary, secondary, and evidence layers; do not turn each value into an interchangeable dashboard card.

## 6.2 Interpretation-review mockup

Show five columns with different states:

| Source header | Detected type | Used as | Confidence | UI treatment |
|---|---|---|---|---|
| `Fecha` | Date, day first | Transaction time | High | Mint confirmation |
| `Imp.` | Decimal, EUR | Line amount | High | Evidence: quantity × price |
| `Cod.` | Identifier | Item identity | Needs confirmation | Amber review |
| `Cliente` | Text | Customer identity | Medium | Plain-language evidence |
| `Notas` | Text | Not used in analysis | High | “Preserved for filtering” |

The selected row opens an evidence drawer: sample values, competing meanings, detected locale, effect on supported widgets, and an editable preview. For images, show the recognized cell beside its cropped source region.

## 6.3 Mobile quick-entry mockup

Show channel “Daily sales,” item autocomplete, quantity, amount, time, and a large **Save & add another** button. After save, the form retains stable context and clears changing fields. Offline state is explicit: “Saved on this device · will sync when connected.”

## 6.4 Trust and security mockup

Use a simple architecture illustration rather than a shield collage:

```text
Your workspace → authenticated request → tenant scope → PostgreSQL RLS
       raw file retained by policy      derived dashboard reads from rollups
```

Explain outcomes: workspace isolation, encrypted transport/storage configuration, hashed merchant-customer identifiers, EU data residency, audit history, and recoverable model changes. Final public wording requires security and legal review.

---

# 7. Marketing and growth initiatives

## 7.1 Acquisition themes

### Theme A — The messy-data advantage

Content promise: “You should not have to rebuild your export before you can understand it.”

Initiatives:

- **Spreadsheet rescue kit:** localized guides for separators, date ambiguity, title rows, formulas, and duplicate exports.
- **Can Suq read this?** interactive sample gallery with deliberately messy, synthetic inputs and visible interpretation.
- **Data Clinic:** periodic live session where the team demonstrates safe interpretation on consented or synthetic examples.
- Search content around “analyze POS export,” “inventory from Excel,” “sales dashboard from CSV,” and localized equivalents.

### Theme B — The three-question operating rhythm

Build campaigns around one daily routine:

- Monday stock check.
- Daily sales pulse.
- Weekly returning-customer review.

Each campaign has a dedicated page, demo dashboard template, short video, and downloadable checklist. The product should deep-link new users into the matching starter template after first data confirmation.

### Theme C — Trust before automation

Publish clear explainers about confidence, field interpretation, deduplication, data provenance, load reversal, and why the system asks questions. This differentiates Suq from opaque “upload anything” claims.

## 7.2 Product-led acquisition

- **Instant sample workspace:** no private data required; visitors can explore a preloaded merchant and switch locale.
- **Shareable read-only insight image:** future initiative, only after privacy review and explicit user action. Default to no customer identifiers.
- **Starter templates by business type:** retail, food shop, marketplace seller, wholesaler. Templates choose widgets and suggested channel fields; they never impose a data schema.
- **Upload compatibility report:** after a safe dry run, show recognized fields, possible capabilities, and unresolved questions before account creation only if privacy/legal design permits temporary processing.

## 7.3 Activation and lifecycle

| Moment | Message | Product destination | Success event |
|---|---|---|---|
| Email verified | “Let’s turn one record into one answer.” | Guided source choice | Source submitted |
| Upload stalled | Specific recovery based on stage | Existing upload job | Review resumed |
| Model ready | “We found 8 field meanings; 2 need you.” | Data review | Model confirmed |
| First load complete | Lead with one insight, then counts | Starting dashboard | Insight viewed |
| Day 2 no return | “Your dashboard is ready when today’s data is.” | Add data | Second load |
| Repeated shape | Offer to save as a channel | Channel creation | Channel saved |
| Stock capability available | Explain what an observation channel unlocks | Channel setup | First stock count |
| Premium boundary | Name the exact blocked capability | Contextual comparison | Checkout started |

Notification frequency and consent must be explicit. Operational verification messages are not marketing permission.

## 7.4 Conversion experiments

Run one variable per experiment and segment results by locale and acquisition source.

| Hypothesis | Variant A | Variant B | Primary metric | Guardrail |
|---|---|---|---|---|
| Concrete outcomes outperform abstract clarity. | Three-question hero | “Messy records, clear decisions” hero | Qualified signup | Bounce and comprehension survey |
| A demo reduces data-trust anxiety. | Start free only | Start free + sample demo | First source submitted | Signup rate |
| Review proof improves activation. | Dashboard hero visual | Input → review → dashboard visual | Model-confirm rate | Hero load time |
| Contextual pricing converts better. | Pricing in nav | Pricing plus capability links | Checkout start | Support questions/refunds |
| Business templates reduce blank-canvas anxiety. | Generic starter | Business-type starter | First insight viewed | Template replacement rate |

Do not optimize clicks at the expense of successful confirmed loads. The activation north star is a merchant reaching a correct first insight.

## 7.5 Funnel and content metrics

```text
Landing view
  → meaningful demo interaction
  → signup started
  → email verified
  → source submitted
  → review completed
  → first successful load
  → first insight viewed
  → second data arrival
  → channel saved
  → retained weekly use / premium activation
```

Track abandonment and errors at every transition, segmented by source type, locale, device, and acquisition channel. Never send raw filenames, column names, values, customer identifiers, or dashboard contents to marketing analytics.

---

# 8. Authenticated product information architecture

## 8.1 Desktop navigation

The left rail is stable and task-oriented:

```text
SUQ INSIGHTS

[Workspace switcher]
[Search / command menu]

TODAY
  Dashboard
  Enter data
  Alerts

DATA
  Channels
  Uploads
  Datasets
  Records
  Entities

MANAGE
  Reports
  Integrations       Premium when gated
  Settings

Help & support
User / plan
```

“Inventory” and “Customers” are not required as permanent top-level destinations at launch because their primary experience is widget-based. If dedicated analytical pages are later implemented, they may appear under an **Analyze** group after user research proves a need. The navigation should not imply unavailable screens just because the inspiration dashboard has them.

Desktop rail width: 264–280 px. At 1,024–1,279 px, collapse to a 76 px icon rail with labels available on focus/hover and an explicit expand control. Persist the preference per user.

## 8.2 Mobile navigation

Use a five-destination bottom bar:

- Dashboard
- Enter
- **Add** (prominent center action opening the source sheet)
- Alerts
- More

“More” opens Channels, Uploads, Datasets, Records, Entities, Reports, Integrations, Settings, support, workspace, plan, and account. Active state uses icon, label, and shape—not color alone. The bar respects safe-area insets and does not cover table actions or toasts.

## 8.3 Global command menu

Desktop shortcut `/` focuses search when not typing; `Ctrl/Cmd+K` opens a command menu. It searches navigation, dashboard names, widgets, channels, uploads, entities, and help actions within the user’s role and entitlements. Results are grouped and keyboard navigable. Recent results remain on device; server logs do not capture raw query terms when they could contain merchant data.

## 8.4 URL model

Every restorable view has a URL:

- `/app/dashboards/:dashboard_id`
- `/app/entry?channel=:channel_id&mode=quick`
- `/app/channels/:channel_id`
- `/app/uploads/:upload_id`
- `/app/datasets/:dataset_id/review`
- `/app/records?dataset=:id&sort=-occurred_at`
- `/app/alerts?status=active&severity=critical`

Filters, sort, selected tab, and stable date ranges live in the query string when sharing or reload should preserve them. Never place cursor tokens, sensitive source values, or temporary object URLs in a shareable link.

---

# 9. Dashboard concept

## 9.1 Dashboard job

The dashboard is a daily decision canvas, not a report index. In under ten seconds, it should answer:

1. Is the data current and trustworthy?
2. What changed?
3. What needs action?
4. Where can I inspect the evidence?

## 9.2 Desktop frame

```text
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Brand         │ Workspace / Dashboard                         Help  User     │
│ Workspace  ▾  ├──────────────────────────────────────────────────────────────┤
│ Search        │ Morning check ▾       7 days ▾   Compare ▾   Updated 2m ago │
│               │ [Add widget] [Arrange] [•••]                 ● Live          │
│ Dashboard     ├──────────────────────────────────────────────────────────────┤
│ Enter data    │ ┌──────────────────────────────┐ ┌──────────┐ ┌──────────┐  │
│ Alerts     3  │ │ What changed and why?       │ │ Revenue  │ │ Units    │  │
│               │ │ narrative insight           │ │ +18%     │ │ +7%      │  │
│ Channels      │ └──────────────────────────────┘ └──────────┘ └──────────┘  │
│ Uploads       │ ┌───────────────────────────────────────────┐ ┌────────────┐ │
│ Datasets      │ │ How is money coming in over time?        │ │ Attention  │ │
│ Records       │ │ line / bar / table                       │ │ 3 alerts   │ │
│ Entities      │ │                                           │ │ sponsored* │ │
│               │ └───────────────────────────────────────────┘ └────────────┘ │
│ Reports       │ ┌──────────────────────────┐ ┌──────────────────────────────┐│
│ Integrations  │ │ What sells most?        │ │ What should I buy today?     ││
│ Settings      │ │ ranked bars             │ │ stock/reorder table          ││
│               │ └──────────────────────────┘ └──────────────────────────────┘│
│ Help          │ Data current through 14:32 · 4 sources · View freshness      │
└───────────────┴──────────────────────────────────────────────────────────────┘
* Free tier only; clearly labeled Sponsored / Patrocinado / Sponsorisé.
```

## 9.3 Header anatomy

**Global top bar:** breadcrumb/workspace context, help, notifications, language, account. Height 64 px.

**Canvas header:** dashboard selector and rename, date range, comparison, freshness, live status. A second row holds Add widget, Arrange, Reset to template, and overflow actions. On small screens this becomes a sticky title row plus a filter sheet.

Date behavior:

- Presets: Today, Yesterday, Last 7 days, Last 30 days, This month, Last month, Custom.
- Dates use the merchant timezone; the selected timezone is visible in the custom picker.
- Comparison options: previous period, previous year when history permits, or off.
- Entitled history is enforced by the server; the free-tier boundary is shown at the unavailable calendar edge with an exact explanation.
- A change applies to widgets that inherit the dashboard range. Widgets with a custom range show a small “Custom” badge.

## 9.4 Starting canvas

After the first successful load, create a useful dashboard from supported capabilities:

1. `insight-summary` spanning 6–8 columns.
2. `headline-stat` tiles for available measures.
3. `revenue-over-time` or the best supported velocity question.
4. `alerts-panel` when alerts exist; otherwise `data-freshness`.
5. `top-items` when item identity exists.
6. `stock-status-table` only when stock can be derived honestly.
7. `repeat-vs-new` only when customer identity exists.
8. `sponsored` exactly once for the free tier, contextually placed.

Unavailable capabilities are explained in a compact recommendation region below the canvas, not represented by misleading zero widgets. Example: “Add a customer identifier to unlock returning-customer views.”

## 9.5 Widget anatomy

Every widget frame contains:

1. Drag handle visible in Arrange mode and keyboard-movable equivalent.
2. User-overridable title.
3. Short question or context label when the title is custom.
4. Freshness/partial-data indicator when different from the canvas.
5. Primary visualization or answer.
6. Comparison and unit context.
7. Optional insight or next action.
8. Header menu: change view, configure, duplicate, inspect data, rename, remove.
9. Resize handle in Arrange mode, plus a dialog with width/height choices for keyboard users.

Hover-only controls become persistently visible on touch. Widget menus use buttons with accessible names. Removing a widget offers a brief undo toast; it does not require a confirmation modal because the arrangement is recoverable.

## 9.6 Arrange mode

- Enter through a labeled **Arrange** button; the canvas background changes subtly and a persistent mode bar appears.
- Widgets display drag handles, size labels, and grid outlines.
- Dragging snaps to the twelve-column grid and reserves the proposed position.
- Collision moves affected widgets predictably down, never off-screen.
- Keyboard movement: focus handle, press Space to pick up, arrow keys to move, Space to drop, Escape to cancel. Screen-reader announcements state position and collisions.
- Autosave status cycles through “Unsaved changes,” “Saving…,” and “Saved.” A failed save stays visible with Retry and retains the local layout.
- **Reset to template** previews the changed arrangement and asks for confirmation; this is not undoable after the recovery window.
- Mobile uses a reorder list with Move up/down and size choices; no touch drag is required.

## 9.7 Widget picker

Open as a wide drawer on desktop and a full-screen route on mobile.

Structure:

- Search by question or concept.
- Groups: Sales, Items, Inventory, Customers, Cross-cutting.
- Filters: Supported now, All, Free/Premium, data required.
- Each card shows the question, recommended render, required concepts, live preview from merchant data, and whether it is already placed.
- Unsupported cards remain discoverable but explain exactly what data concept is missing. They do not show sample values that could be mistaken for the merchant’s data.
- Selecting a supported card previews available renders and configuration before placement.
- Placement chooses the first suitable open position while keeping the new widget in view and moving focus to it.

## 9.8 Dashboard selector and templates

- Selector lists personal dashboards, workspace template, locked premium dashboards after downgrade, and Create dashboard.
- Dashboard names are 1–80 characters, unique per user after normalization, and validated inline.
- Free users see one active dashboard. Extra dashboards retained after downgrade are visible but read-only with an explanatory lock state.
- Creating from a template previews included questions and data requirements.
- Publishing a workspace template is owner-only and warns that existing personal dashboards will not be overwritten.

## 9.9 Live updates

The canvas status communicates connection without distraction:

- **Live:** small static green dot and “Live.” No constant pulsing.
- **Updating:** affected widget shows a subtle progress line; existing values remain visible.
- **Updated:** changed values briefly highlight for at most 1.2 seconds unless reduced motion is active.
- **Offline:** persistent amber banner: “You’re offline. Dashboard values are from 14:32.”
- **Reconnecting:** retain content, retry with backoff, and offer manual Retry after a reasonable delay.
- Events are coalesced; the interface never flashes once per entered row.

## 9.10 Widget states

| State | Visual | Copy/action |
|---|---|---|
| Loading, first view | Skeleton matching final geometry | `aria-busy=true`; no indefinite spinner |
| Refreshing | Existing data + top progress line | “Updating” in accessible status region |
| Ready | Answer + context + freshness | Optional Inspect data |
| Empty, no events in range | Empty chart frame with zero-state annotation | “No sales recorded in this period. Try a wider range.” |
| Unsupported capability | Neutral explanatory card | “This view needs an item identifier. Review fields.” |
| Partial data | Amber inline notice | “2 of 4 sources include quantity; unit totals are partial.” |
| Stale | Amber freshness badge | “Last updated yesterday · Add data” |
| Widget failed | Error contained in frame | “This answer could not load. Retry.” + request ID in details |
| Permission denied | Locked frame, no leaked data | “You do not have access to this dashboard.” |
| Premium locked | Readable explanation, no blurred fake data | Exact benefit + Compare plans |
| Deleted source/reversed load | Recomputed answer and audit note | “Changed after load ‘Monday count’ was undone.” |

## 9.11 Dashboard personalization boundaries

Users can move, resize, rename, configure, switch render, duplicate, and remove widgets. They cannot redefine metric formulas inside the dashboard. A render choice changes only presentation and never triggers a new backend calculation when the existing payload supports it. Configuration that changes the question—period, measure, items, segments—requests a new payload and updates the cache key.

---

# 10. Launch widget presentation

The SDLC’s widget catalog is authoritative. The interface presents each widget as a question and offers only sensible renders for its data shape.

## 10.1 Sales velocity

| Widget | Default presentation | Key UX details |
|---|---|---|
| Revenue over time | Line with comparison | Localized money; visible currency; range/granularity; data gaps; Inspect records. |
| Transactions over time | Bars | Whole counts; interval tooltip; comparison as outline/secondary series. |
| Units over time | Line | Unit label and partial-data warning when not all sources resolve quantity. |
| Headline stat | Large value + delta | Period label is always visible; delta states its comparison basis. |
| Insight summary | 2–4 sentence narrative | Every claim links to the supporting widget/filter; no invented causal language. |
| Sales by period pattern | Heatmap | Accessible table toggle; timezone shown; intensity legend includes values. |

## 10.2 Item performance

| Widget | Default presentation | Key UX details |
|---|---|---|
| Top items | Ranked horizontal bars | Top N; “Other” where relevant; revenue/units/transactions toggle; full names on focus. |
| Item mix | Stacked bars | Avoid donut when categories exceed the readable threshold. |
| Item detail | Data table + sparkline | Column controls, cursor pagination, sticky item identity. |
| Item trend comparison | Multi-line | Limit selected items; direct labels when space permits. |
| Slow movers | Table | Define “slow” visibly and allow stock-on-hand filter. |

## 10.3 Inventory

| Widget | Default presentation | Key UX details |
|---|---|---|
| Stock status | Table with severity bands | Status label + icon + color; expandable provenance; last observation date. |
| Days of stock | Gauge/bullet | Exact day estimate beside visual; “Insufficient history” is not zero. |
| Depletion forecast | Timeline | Forecast method and horizon in details; confidence band; stock-out marker. |
| Reorder list | Checklist table | User check state is local workflow state, not proof an order was placed. |
| Stock value | Stat/category bars | Only available when the required valuation basis is confirmed. |

## 10.4 Customers

| Widget | Default presentation | Key UX details |
|---|---|---|
| Retention cohort | Heatmap | Cohort definition and horizon; accessible table; no raw customer identities. |
| Repeat vs new | Stacked area | Explain classification; count/revenue toggle. |
| Top customers | Ranked bar/table | Use workspace-safe display identifiers; respect privacy model. |
| Purchase frequency | Histogram | Bucket definition and selected period visible. |

## 10.5 Cross-cutting

| Widget | Default presentation | Key UX details |
|---|---|---|
| Alerts | Status list | Severity, plain-language reason, time, acknowledge; rules link. |
| Data freshness | Stat/timeline | Latest source, coverage, stale threshold, Add data action. |
| Record table | Table | Any retained attribute filter, cursor pagination, export entitlement. |
| Segment comparison | Grouped bar | Segment definition always displayed; accessible table. |
| Sponsored | Clearly labeled card | At most one per page view; contextual, localized label; collapses cleanly when absent. |

## 10.6 Future-only analytics

The reference dashboard and common ecommerce products often show profit, margin, returns, fulfillment, ad spend, ROAS, CAC, cash flow, and geography. These are visually tempting but are not launch metrics merely because a card can be drawn. Add them only after the SDLC defines their source concepts, formulas, correction behavior, entitlement, privacy rules, and test fixtures. Margin analysis is a likely later widget once cost data is commonly present.

---

# 11. Critical supporting screens

## 11.1 Guided empty dashboard

The empty canvas is an onboarding screen, not a blank grid.

**Headline:** “Let’s turn one record into one useful answer.”

**Body:** “Add a file, paste a table, take a photo, or try a sample. Suq will show what it understands before anything affects your dashboard.”

**Primary:** Add data. **Secondary:** Try a sample.

Below, show the three future questions with muted illustration and requirements. A four-step progress rail—Account, Profile, Add data, First insight—makes the journey finite. Do not show the widget picker until at least one supported capability exists.

## 11.2 Add-data sheet

Accessible from the global Add action. Choices are large cards:

- Upload a file.
- Paste a table.
- Use a photo or PDF.
- Enter data.
- Send to a channel.
- Connect with the Sync API (premium).

Each choice states supported types, size limit from active entitlement, privacy note, and expected next step. Drag-and-drop is an enhancement; a standard file button remains available. Upload progress survives navigation and announces milestones without reading every percentage.

## 11.3 Upload progress

Use stage language: Uploading → Checking safety → Reading structure → Understanding fields → Waiting for review → Processing → Complete. Show determinate progress only when real; otherwise show the current stage and elapsed time. Closing the panel does not cancel the job. Cancellation, when safe, is explicit and scoped.

## 11.4 Data review

Desktop structure:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Back to upload     Review “sales-september.csv”       Saved draft           │
├──────────────────────────────────────────────────────────────────────────────┤
│ 8 fields recognized · 2 need review · Supports: revenue, units, items       │
│ Missing: customer identity → retention unavailable                          │
├───────────────────────────────┬──────────────────────────────────────────────┤
│ Field list/table              │ Evidence and live preview                   │
│ source · type · used as       │ sample values · competing meanings          │
│ confidence · status           │ parsed table / source crop                  │
├───────────────────────────────┴──────────────────────────────────────────────┤
│ [Save draft]                                      [Confirm and process]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Details:

- The first unresolved field receives focus only after the summary is announced.
- Confidence uses High / Medium / Needs review plus evidence, not a mysterious percentage alone.
- Editing type, role, unit, currency, date order, constant, split/combine, exclusion, identifier, or cell re-renders a real preview.
- Conflicting roles are prevented or explained before confirmation.
- Sticky footer summarizes consequences: supported analyses, unresolved warnings, excluded fields, and the primary action.
- On mobile, fields become a step list; evidence opens as a full-screen detail. The user can move Next unresolved / Previous without returning to the list.

## 11.5 Result summary

Lead with what happened:

> “1,248 rows added. 36 duplicates skipped. 4 rows need correction.”

Then show one concrete insight, **View dashboard**, **Download error report** when needed, **Undo this load**, and an offer to save a recurring shape as a channel at the correct moment. If more than half of rows fail, do not present a partial success; return to review with specific guidance.

## 11.6 Channel detail

Tabs: Overview, Add data, Field setup, Load history, Entry form, Guard decisions.

Header shows channel name, intent label, fill policy, last arrival, expected cadence, and status. Changing intent is high consequence: preview the derived-state impact and require explicit confirmation. Load history uses cursor pagination and exposes counts, source, author, status, model version, errors, and Undo when allowed.

## 11.7 Entry space

Modes: Quick, Batch, Corrections.

- Quick prioritizes recent items, barcode/identifier focus when supported, Save & add another, and visible offline queue.
- Batch resembles a spreadsheet but preserves native form semantics, row errors, keyboard movement, paste, and undo.
- Corrections show original value, revised value, author/time, reason, and downstream recalculation state.
- Concurrent updates arrive unobtrusively; editing collisions are explained before overwriting.

## 11.8 Alerts

Default list groups Active, Acknowledged, and Resolved. Each item includes severity, what happened, affected entity, time, recommended inspection, delivery channels, and acknowledgement. Filters persist in URL. Free users can use dashboard alerts; premium channel toggles explain email/SMS prerequisites and exact unlock.

## 11.9 Records and entities

Records are a dense, inspectable evidence surface. Fields can include retained unmapped attributes. Entities support duplicate review and merge previews. Cross-links preserve the originating dashboard range/filter so the merchant can move from answer to evidence and back without losing context.

## 11.10 Settings

Groups: Profile and locale, Workspace, Team, Notifications, Billing and plan, API keys, Security, Data and privacy. Owner-only items are absent or clearly read-only for staff; never show a control that fails only after submission. Destructive actions live in a separated danger region with consequences and recovery limits.

---

# 12. Component behavior in detail

## 12.1 Buttons

- One primary button per panel or sticky action region.
- Primary: lime fill, Ink text. Hover darkens border; active compresses at most 1 px; focus uses a 3 px accessible outline.
- Secondary: white or transparent, Ink border/text.
- Tertiary: text/icon, reserved for low-emphasis actions.
- Destructive: Coral only in confirmation context; neutral trigger before confirmation where possible.
- Loading button keeps its width, shows progress, and retains a verb such as “Processing…”; disabled state is not used as the only explanation.

## 12.2 Forms

- Labels sit above fields and remain visible after entry; placeholder text is an example, never the label.
- Required/optional is textual. Error copy sits below the field and is summarized at the top after submit.
- Validate on blur for local format errors and on submit for cross-field rules; avoid scolding on the first keystroke.
- Currency fields display currency separately and parse locale conventions safely.
- Date inputs support keyboard entry and a calendar; day/month ambiguity includes an example.
- Autosaved drafts show timestamp and recovery. Sensitive tokens are never restored into visible fields.

## 12.3 Tables

Anatomy:

- Search/filter region above, active-filter chips, result count, column control, density, export where entitled.
- Sticky header; first identity column may pin on wide screens.
- Sort button includes direction and priority; default sort is visible.
- Row selection persists only within the explicit action scope and announces the count.
- Row actions use a visible overflow button and remain keyboard accessible.
- Long values truncate visually but expose full text on focus and through an accessible detail—not title attribute alone.
- Empty result after filtering offers **Clear filters**; true empty state offers the relevant creation action.
- Virtualization is allowed for large loaded windows only when screen-reader and focus behavior are proven.

## 12.4 Cursor pagination

The API is cursor-based and caps page size at 100. The interface must not pretend stable numbered pages exist.

**Default table pattern:** 50 rows, **Previous** and **Next** buttons, “Showing 51–100” when a reliable running count is known, and optional page-size choices 25 / 50 / 100. The opaque cursor remains internal.

**Feed/timeline pattern:** **Load more** appends the next cursor window and preserves scroll position. Infinite loading may supplement but never replace the explicit button.

Rules:

- Filter, sort, dataset, and date changes reset to the first cursor and update the URL.
- Back navigation restores loaded windows and scroll position from session state where practical.
- Previous uses the server-provided previous cursor; clients do not construct cursors or infer offsets.
- Disable Next only when the response proves there is no next cursor.
- On error, retain existing rows and offer Retry at the pagination control.
- Selection across windows must either be explicitly supported server-side or described as “selected on this page.”
- Screen readers hear newly appended row counts through a polite live region.
- Exports are asynchronous and are not implemented by looping through visible pages in the browser.

## 12.5 Filters

- Applied filters are visible as removable chips and represented in the URL.
- Desktop uses an inline primary row plus a filter drawer for advanced criteria; mobile uses a full-screen sheet.
- The Apply button states the result count when cheaply available; Clear all requires no confirmation.
- Numeric/date filters show units/timezone. Attribute filters name the dataset/source context.
- Saved views are future scope unless explicitly scheduled; dashboard widget configuration is not a substitute.

## 12.6 Search and autocomplete

- Debounce remote search around 250–350 ms and cancel superseded requests.
- A minimum query length is communicated when required.
- Matching text is highlighted without changing the accessible name.
- Entity autocomplete distinguishes exact identifier matches, normalized-name matches, and “Create new.”
- No results explains the query scope and offers a relevant next action.

## 12.7 Drawers, dialogs, and sheets

- Use a dialog for a decision that blocks background interaction; use a drawer/sheet for inspection or configuration that benefits from context.
- Focus moves to the heading or first meaningful control, stays trapped for modals, and returns to the trigger.
- Escape closes non-destructive overlays. Unsaved destructive edits ask before closing.
- Mobile drawers become full-screen sheets with a visible Back/Close action.
- Deep, multi-step tasks such as data review use routes, not nested modals.

## 12.8 Toasts and banners

- Toasts confirm lightweight, recoverable actions and remain long enough to read. Important failures also remain near the failed object.
- Undo toasts last 8–10 seconds and pause on hover/focus.
- Banners communicate persistent system conditions: offline, verification required, payment grace, upload incident.
- Never stack more than three toasts; combine repetitive live events.

## 12.9 Status and progress

Statuses use icon + text + color: Draft, Waiting for review, Processing, Complete, Complete with errors, Paused, Failed, Reversed. Progress labels describe stages. A percentage appears only when backed by measurable work. Time estimates are ranges and disappear when confidence is poor.

## 12.10 Empty, loading, and error states

Every screen defines four distinct states before implementation:

1. **First use:** explain value and offer creation/sample action.
2. **No results:** preserve query context and offer Clear filters.
3. **Unavailable capability:** name the missing data concept and link to review.
4. **Failure:** preserve safe content, state what failed, offer retry/recovery, include request ID in expandable details.

Skeletons must approximate final layout to prevent shifts. After 10 seconds, replace silent skeletons with stage or recovery copy. A global error page is reserved for shell failure; widget and panel failures stay local.

## 12.11 Permission and entitlement states

Authorization is server-enforced. The UI improves comprehension but is never the security boundary.

- Hidden: actions irrelevant to the role, such as billing for staff.
- Disabled with reason: a temporarily unavailable action the user can resolve, such as SMS before phone verification.
- Locked with comparison: premium capability at the point of intent.
- Not found: cross-tenant identifiers or resources the user must not know exist.

## 12.12 Confirmation patterns

| Action | Confirmation | Recovery |
|---|---|---|
| Remove widget | No modal | Undo toast |
| Delete dashboard | Named confirmation | Soft-delete recovery window if supported |
| Undo load | Impact preview + explicit confirm | Audit trail; re-add source if needed |
| Change field meaning after commit | Re-derivation preview + confirm | Versioned model rollback |
| Change channel intent | Derived-state impact preview + confirm | Version/audit-based recovery |
| Revoke API key | Confirm key name | Irreversible; create replacement |
| Leave unsaved review | Confirm only if draft cannot safely persist | Saved draft preferred |

---

# 13. Responsive behavior

## 13.1 Breakpoints

| Range | Grid | Navigation | Canvas behavior |
|---|---|---|---|
| 0–479 px | 4 columns, 16 px gutter | Bottom bar | Single-column widgets; compact controls; full-screen sheets |
| 480–767 px | 4 columns, 20 px gutter | Bottom bar | Single-column widgets; wider charts; reorder list |
| 768–1023 px | 8 columns, 20 px gutter | Collapsible drawer/rail | Widgets may span 4 or 8; touch-friendly arrangement |
| 1024–1279 px | 12 columns, 20 px gutter | 76 px compact rail | Dense canvas; secondary actions in overflow |
| 1280 px+ | 12 columns, 24 px gutter | 264–280 px rail | Full canvas controls and previews |

Breakpoints respond to available space, not device labels. Test at zoomed widths and with the French locale.

## 13.2 Landing-page adaptation

- Hero headline is never smaller than 40–44 px on compact mobile and uses balanced wrapping only when supported.
- Two CTAs stack full width below 360 px.
- Product visuals crop to the decision being explained rather than shrinking an entire desktop dashboard into illegibility.
- Horizontal card rows use snap scrolling only when all cards remain reachable by keyboard and a non-gesture control exists.
- Decorative haze and marks disappear before content or contrast is compromised.

## 13.3 Dashboard adaptation

- Widgets follow their saved reading order in one column on phones.
- Desktop x/y position does not determine an inaccessible mobile order; the stored order is explicit.
- Tables first reduce optional columns, then switch to a row-detail pattern. Essential identity, value, status, and action remain visible.
- Chart tooltips support tap and keyboard; a table toggle is adjacent.
- Date range and dashboard actions move into sheets without losing current values.
- Mobile arrangement uses a reorder list and size presets; freeform drag is not required.

## 13.4 Low bandwidth and older devices

- Marketing initial JavaScript remains under the SDLC budget; the hero is meaningful before hydration.
- Dashboard shell and last successful values may render from safe client cache while freshness is verified.
- Charts load per visible widget and avoid rendering off-screen canvases unnecessarily.
- Images use responsive formats and dimensions; mockups do not load 4K assets on mobile.
- Offline entry is visibly queued. Dashboard offline mode never implies current data.

---

# 14. Accessibility specification

Target WCAG 2.1 AA across merchant-facing screens.

## 14.1 Foundations

- Semantic landmarks: header, nav, main, complementary only when truly secondary, footer.
- One descriptive H1 per route; widget titles follow a coherent heading level.
- Skip link to main content and, on dashboards, optional skip to canvas controls.
- Visible focus at 3:1 contrast, never removed.
- Text and controls meet contrast requirements; chart distinctions do not rely on color.
- 200% text zoom and 400% browser zoom retain functionality without two-dimensional scrolling except genuine data tables.
- Touch targets are at least 44 × 44 px.

## 14.2 Charts

- Each chart has a concise accessible summary: metric, period, direction, extrema, and missing-data note.
- A table render is available from the widget header.
- Canvas/SVG marks are not the only source of information.
- Tooltip content is reachable by keyboard and dismissible.
- Patterns, direct labels, or line styles distinguish series where necessary.

## 14.3 Drag and drop

- Every drag action has keyboard and button alternatives.
- Pick-up, new position, collision, saved state, and cancellation are announced.
- Motion is reduced or removed under `prefers-reduced-motion`.
- Focus order follows reading order, not visual CSS placement alone.

## 14.4 Live regions

- Use polite announcements for save status, appended pagination rows, upload stages, and coalesced dashboard refresh.
- Use assertive announcements only when immediate action is required.
- Never announce every percentage tick or every incoming record.

## 14.5 Accessibility QA

For every critical route: automated axe checks, keyboard-only walkthrough, screen-reader smoke test, 200%/400% zoom, high-contrast/forced-colors check, reduced-motion check, and locale expansion. Include disabled, error, empty, loading, and offline states—not just the happy path.

---

# 15. Localization and international UX

## 15.1 Supported launch locales

English, Spanish, and French are first-class. All user-facing strings use translation keys. Content design begins from meaning and context, not string fragments.

## 15.2 Formatting

- Numbers, currency, percentages, and dates use locale-aware formatters.
- Day boundaries use merchant timezone; the UI displays it where ambiguity matters.
- Currency is always explicit when datasets or workspace context could differ.
- CSV examples respect common delimiter and decimal differences, but the parser never assumes locale alone proves meaning.
- Pluralization uses locale rules; never concatenate translated fragments.

## 15.3 Layout resilience

- Budget 30–40% text expansion for navigation and controls.
- Buttons grow before labels truncate. Icon-only fallbacks are not used for important actions.
- Tables may wrap headers to two lines; header tooltips are supplementary.
- Test real French and Spanish strings, accents, apostrophes, non-breaking spaces, and long error messages.

## 15.4 Language selection

The selector shows language names, not flags. Changing language does not reset the current task. Account preference persists after login; pre-login preference persists locally. Transactional messages use the recipient’s preference at send time and include localized support paths.

## 15.5 Translation governance

- Every key includes context and screenshot/reference where ambiguity exists.
- Native-language review covers critical journeys and marketing claims.
- Missing-key telemetry records the key and route, never merchant data.
- English fallback rate for Spanish/French screens must remain below the SDLC target.

---

# 16. Motion and interaction

Motion explains continuity; it does not decorate waiting.

| Interaction | Duration | Behavior |
|---|---:|---|
| Hover/focus surface | 100–150 ms | Border/background transition |
| Drawer/sheet | 180–220 ms | Fade + short translate |
| Widget placement | 180–240 ms | Position interpolation with reserved target |
| Value changed live | ≤1,200 ms | Background highlight that fades once |
| Toast | 160 ms in/out | No spring/bounce |
| Landing mockup reveal | 400–600 ms | One staggered entrance after content |

Reduced motion removes transforms, parallax, animated chart drawing, and rearrangement interpolation. State changes remain visible through immediate styles and text.

---

# 17. Analytics and measurement plan

## 17.1 Event naming

Use `object_action` with stable schemas: `landing_cta_selected`, `demo_started`, `source_submitted`, `model_review_opened`, `model_confirmed`, `first_insight_viewed`, `widget_added`, `widget_render_changed`, `layout_saved`, `premium_boundary_viewed`, `checkout_started`.

Common safe properties:

- locale;
- route/template identifier;
- device class;
- plan code;
- source category, never filename;
- widget key, never merchant-configured title;
- render key;
- capability availability booleans;
- stage duration and standardized failure code;
- experiment and variant IDs.

Forbidden properties include raw values, source names, field names, customer information, entity names, user-entered dashboard names, and free-text support/search content.

## 17.2 Experience KPIs

| Area | Primary KPI | Diagnostic metrics |
|---|---|---|
| Landing | Qualified signup / meaningful demo | Hero CTA, section depth, demo completion, performance |
| Activation | First successful confirmed load | Source submit, review time, unresolved rate, failure/retry |
| Value | First insight viewed | Dashboard usable time, supported capabilities, inspect-data use |
| Habit | Second data arrival and weekly active workspace | Channel save, entry use, freshness, alert acknowledgement |
| Composition | Useful customization | Widget add/remove, render override, layout save failure |
| Premium | Activated capability after purchase | Boundary → checkout → activation → feature enabled |
| Trust | Corrective success | Model edits, reversals, duplicate skip, support escalation |

## 17.3 Performance instrumentation

Track Core Web Vitals on marketing pages, route load, dashboard batch resolve, time to first usable canvas, per-widget render, cache status, and chart interaction latency. Segment by locale and connection class. The product target remains dashboard reads under 300 ms p95 and a usable repeat dashboard within eight seconds on throttled 3G.

---

# 18. Implementation architecture for the experience

## 18.1 Frontend route groups

```text
apps/web/src/
  marketing/        landing, pricing, use cases, resources
  app-shell/        authenticated layout, navigation, command menu
  dashboard/        canvas, picker, layout, widget frames
  widgets/          render components keyed by widget manifests
  ingestion/        add data, progress, review, results
  channels/         channel detail, loads, guard decisions
  entry/            quick, batch, corrections, offline queue
  records/          tables, filters, entity evidence
  alerts/           alert list and rules
  settings/         account, workspace, plan, security
  design-system/    tokens, primitives, patterns, charts
  i18n/             locale resources and formatters
  styles/           vanilla CSS tokens, reset, base, shared utilities
```

This is an organizational concept; final folder boundaries should follow the implemented repository conventions. Marketing pages and `/app` share tokens and primitives but load separate route bundles. Heavy dashboard/chart code must not inflate the landing-page entry bundle.

## 18.2 Vanilla CSS structure

Styling is authored in standards-based vanilla CSS. The frontend does not use Tailwind, Sass/Less, CSS-in-JS, CSS Modules, or a runtime styling library.

```text
apps/web/src/styles/
  tokens.css        semantic custom properties
  reset.css         normalization and predictable defaults
  base.css          document typography and element defaults
  utilities.css     small, reviewed accessibility/layout helpers

apps/web/src/design-system/
  button/button.tsx
  button/button.css
  dialog/dialog.tsx
  dialog/dialog.css

apps/web/src/dashboard/
  dashboard-canvas.tsx
  dashboard-canvas.css
```

Declare the global order once with `@layer reset, base, components, utilities, overrides`. Component and feature files contribute to the appropriate layer. Use semantic custom properties from `tokens.css`, low-specificity locally namespaced classes, and `data-*` attributes for state and variants. Avoid IDs, deep descendant selectors, `!important`, and selectors that depend on incidental markup nesting.

Responsive behavior is mobile-first and content-driven. Media queries stay beside the component whose layout changes. Shared breakpoints may be represented as documented custom-media build constants only if the chosen browser/tooling baseline supports the approach without introducing a CSS preprocessor; otherwise repeat the reviewed media-query values explicitly.

Inline styles are limited to genuinely runtime-calculated geometry, such as a canvas position or measured chart dimension. Prefer setting a narrowly named CSS custom property from React and consuming it in the stylesheet. Focus, hover, disabled, validation, loading, reduced-motion, print, and locale-expansion behavior always belongs in CSS.

## 18.3 Design-system layers

1. **Tokens:** color, typography, space, radius, elevation, motion, breakpoints, z-index.
2. **Primitives:** Button, Link, Input, Select, Dialog, Drawer, Tooltip, Menu, Tabs, Table foundation.
3. **Patterns:** Page header, Filter bar, Data table, Empty state, Problem details, Upload progress, Entitlement card.
4. **Product components:** Widget frame, Widget picker card, Field interpretation row, Source preview, Channel status, Derived-state provenance.
5. **Templates:** Marketing section, Empty dashboard, Default canvas, Review workspace, Entry modes.

Avoid page-specific copies of primitives. New variants require a documented semantic need, not a visual preference.

## 18.4 Widget contract reflected in UI

Each widget manifest should provide or enable:

- stable widget key and localized question/title key;
- required semantic capabilities;
- allowed renders and default;
- configuration schema and defaults;
- minimum/preferred grid sizes;
- data contract/version;
- freshness and partial-data metadata;
- accessible summary data;
- entitlement and supported-state rules;
- cache policy on the backend, with render excluded where appropriate.

The frontend registry maps render keys to lazy-loaded renderers. Unknown widget or render versions fail inside the frame with a safe recovery path.

## 18.5 State ownership

- URL: restorable filters, dashboard ID, date range, selected tab.
- Server state: dashboards, widget data, uploads, records, alerts, entitlements; managed through TanStack Query and generated API types.
- Local persistent state: rail preference, dismissed education, safe recent commands, offline entry queue.
- Ephemeral state: open menus, hover/focus, in-progress drag.
- Optimistic state: entries and canvas arrangements only where rollback is explicit and visible.

## 18.6 Performance budgets

- Keep marketing initial JavaScript below 200 KB gzipped as required by the SDLC.
- Split authenticated route groups and widget renderers.
- Use one dashboard batch resolve request, then isolated refresh only where needed.
- Defer charts below the fold and avoid duplicate chart-library registrations.
- Reserve dimensions for mockups, charts, and skeletons to prevent layout shift.
- Use server/edge caching for public pages and ETags for eligible product reads.
- Audit the densest realistic canvas, not only a four-card demo.

## 18.7 Security and privacy in UI implementation

- Treat server authorization and entitlement responses as authoritative.
- Never serialize access/refresh tokens into JavaScript-readable storage for the web client.
- Sanitize exported/spreadsheet-bound values per the backend contract.
- Prevent analytics, error reporting, and replay tools from capturing raw uploaded values or dashboard contents.
- Use request IDs in supportable errors; do not expose stack traces.
- Mask/restrict customer-related displays under the platform privacy model.
- Make impersonation unmistakable in the separate admin surface with time limit and audit state.

---

# 19. Delivery sequence

## Phase 1 — Foundations

- Finalize identity, tokens, typography licenses/assets, icon family, and component semantics.
- Build accessible primitives and Storybook/component documentation if adopted by the repository.
- Establish locale scaffolding and pseudo-localization.
- Create the marketing/app route split and performance measurement.
- Produce a consistent synthetic dataset for every screenshot, demo, and test.

## Phase 2 — Landing and activation shell

- Implement navigation, hero, source ribbon, problem, how-it-works, three questions, trust, channels, canvas, global readiness, proof, comparison, pricing, FAQ, final CTA, footer.
- Build production-component mockups and optimized responsive assets.
- Implement sample workspace/demo and event taxonomy.
- Validate SEO metadata, structured data where accurate, consent, accessibility, localization, and initial weight.

## Phase 3 — Core authenticated journey

- App shell and role-aware navigation.
- Empty dashboard and add-data sheet.
- Upload progress, data review, result summary.
- Starting canvas, batch resolution, widget states, live freshness.
- Records/evidence links and cursor-pagination patterns.

## Phase 4 — Composition and daily work

- Arrange mode and keyboard alternative.
- Widget picker with real-data previews.
- Render/configuration switching and preferences.
- Multiple dashboards and templates.
- Channels, quick/batch/correction entry, offline queue, live updates.

## Phase 5 — Conversion and hardening

- Contextual premium boundaries and post-purchase activation.
- Approved social proof and case study content.
- Native-language review, device/browser matrix, load/accessibility/security tests.
- Funnel analysis and controlled experiments.

Each phase remains subordinate to the SDLC’s implementation phases and release gates; this sequence describes experience dependencies, not a competing project plan.

---

# 20. Acceptance checklist

## Landing page

- [ ] The first viewport states audience, outcome, and primary action without relying on the mockup.
- [ ] Hero and section visuals use real Suq components with consistent synthetic data.
- [ ] Supported sources and the confirmation-before-commit behavior are explicit.
- [ ] The three product questions are prominent and match launch capabilities.
- [ ] Trust copy explains uncertainty, review, correction, and provenance plainly.
- [ ] Free/Premium differences match entitlements and retention behavior.
- [ ] No invented testimonial, logo, performance claim, integration, price, or policy appears.
- [ ] English, Spanish, and French layouts are reviewed.
- [ ] Keyboard, screen reader, zoom, contrast, and reduced motion pass.
- [ ] Initial page weight and Core Web Vitals meet the agreed budget.
- [ ] Events collect no merchant content.

## Dashboard

- [ ] First data produces a useful supported-capability canvas automatically.
- [ ] Unsupported capabilities explain the missing concept rather than showing zero.
- [ ] Entire canvas resolves in one batch and widget failures remain isolated.
- [ ] Every widget has loading, refreshing, empty, partial, stale, error, locked, and ready behavior as applicable.
- [ ] Render switching is client-side when the data contract already supports it.
- [ ] Drag, resize, and reorder have keyboard/mobile alternatives and save-state feedback.
- [ ] Dates, currency, numbers, and day boundaries follow locale/timezone.
- [ ] Free-tier advertising is clearly labeled, limited, contextual, and leaves no gap when absent.
- [ ] Mobile order follows explicit reading order.
- [ ] Dense, realistic canvas performance meets the SDLC target.

## Data-heavy surfaces

- [ ] Tables use cursor-aware Previous/Next or Load more, never fictional numbered pages.
- [ ] Sort/filter changes reset cursor and remain restorable through URL/state.
- [ ] Sticky headers, long values, row actions, density, selection scope, empty states, and mobile adaptation are defined.
- [ ] Export is an asynchronous job and not a client-side pagination loop.
- [ ] Error states preserve existing data and expose safe retry plus request ID.

## Ingestion and trust

- [ ] Review displays type, meaning, confidence/evidence, sample values, and supported analyses.
- [ ] Low-confidence visual cells can be compared with source crops.
- [ ] Changes re-render a real preview.
- [ ] Consequences are summarized before confirm, remodel, intent change, or load reversal.
- [ ] Result summary distinguishes loaded, duplicate, rejected, and reversed records.
- [ ] Raw/unmapped data preservation is explained where relevant.

---

# 21. SDLC traceability

| Concept area | Primary SDLC requirements / sections |
|---|---|
| Authentication and role-aware surfaces | FR-A-1–FR-A-5 |
| Source choice, progress, review, correction, result | FR-U-1–FR-U-12 |
| Channels, intent, fill, any input | FR-C-1–FR-C-5 |
| Quick/batch/correction and offline entry | FR-E-1–FR-E-6 |
| Derived-state display and provenance | FR-S-1–FR-S-4 |
| Guard decisions and load reversal | FR-G-1–FR-G-6 |
| Canvas, widgets, renders, templates, mobile, failures | FR-D-1–FR-D-13 |
| Alerts and premium channels | FR-AL requirements; FR-P-2–FR-P-4 |
| Premium surfaces and downgrade behavior | FR-P-1–FR-P-11 |
| Contextual sponsored widget | FR-AD requirements; FR-D-13; FR-P-8 |
| Latency, accessibility, localization, page weight | NFR-1, NFR-5, NFR-6, NFR-10 |
| Navigation, onboarding, upsell, canvas wireframe | SDLC §6.13 |
| Widget catalog | SDLC Appendix A |
| Testing and release readiness | SDLC chapters 8–12 |

---

# 22. Content and design dependencies

Decisions required before final visual design ships:

- Approved logo/wordmark and whether “Suq” needs a pronunciation or meaning note in target markets.
- Verified price, billing interval, tax presentation, trial/card policy, and regional payment availability.
- Supported launch countries and any source-format or SMS limitations by country.
- Public security/privacy claims approved by legal and engineering.
- Consent and evidence for testimonials, logos, and case studies.
- Final synthetic demo dataset with internally consistent values across three locales.
- Font files, licensing, fallback metrics, and performance cost.
- Screenshot production workflow so marketing mockups track production components.
- Analytics/consent vendor and privacy-safe event review.

Until these are resolved, use clearly labeled placeholders in design files and never publish assumptions as promises.

---

# References

- [Suq Insights SDLC v3.0](SDLC.md) — canonical product and engineering specification.
- [Milestone Webflow template](https://milestone-webflow-html-website-template.webflow.io/) — landing-page visual and section inspiration.
- [Milestone template overview](https://webflow.com/templates/html/milestone-startup-website-template) — source description and preview.
- [E-commerce Management Dashboard](https://dribbble.com/shots/25024243-E-commerce-Management-Dashboard) — authenticated dashboard layout inspiration.
- [Triple Whale](https://www.triplewhale.com/) — ecommerce outcome messaging and product-led presentation reference.
- [Polar Analytics](https://www.polaranalytics.com/) — goal-based commerce analytics and demo framing reference.

---

**Document owner:** Product/design · **Implementation authority:** `SDLC.md` v3.0 · **Review cadence:** at each material experience checkpoint and before beta.
