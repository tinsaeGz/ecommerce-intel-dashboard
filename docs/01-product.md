# 01 — Product Definition

## 1. Vision

Small merchants everywhere run real businesses on informal tooling: Excel sheets, WhatsApp order threads, marketplace back-office exports, paper notebooks transcribed at night. They cannot answer basic questions — *what sells fastest, what will run out next week, who buys twice*. Mainstream analytics products assume Shopify-grade clean data, native English, and an appetite for enterprise pricing. A huge global segment — the corner retailer in Guadalajara, the boutique in Lyon, the trader in Abidjan, the Etsy-plus-market-stall seller in Manchester — is unserved.

**Suq Insights** ("suq" = market) is an intelligence dashboard that meets merchants where they are:

- **Accepts chaos as input.** Any tabular export, any column names and language, any regional number/date convention (comma decimals, semicolon-delimited CSVs, DD/MM vs MM/DD), any encoding. The normalization pipeline is the technical moat.
- **Answers three questions daily:** What's selling? What's about to run out? Who's coming back?
- **Speaks the merchant's language.** Full UI and alerts in English, Spanish, and French — covering three of the largest merchant populations on earth and leaving the architecture open for more.
- **Monetizes both sides of the market.** Merchants get a genuinely useful free tier; B2B suppliers (packaging, logistics, wholesale, working-capital lenders, POS vendors) pay to reach merchants at the exact moment of need (e.g., a stockout alert triggers a wholesale-supplier ad).

## 2. Target markets & rollout

| Wave | Markets | Language | Notes |
|---|---|---|---|
| Launch | Latin America (Mexico, Colombia, Argentina, Chile, Spain) | es | Largest informal-merchant segment with high WhatsApp/Excel usage; card + local payment rails via Stripe now, Mercado Pago later |
| Launch | France, Belgium, francophone West Africa (Côte d'Ivoire, Senegal, Cameroon) | fr | EU merchants pay easily; West Africa validates the low-bandwidth design |
| Launch | Global English (UK, US, Nigeria, Kenya, Philippines…) | en | Default locale, SEO/self-serve driven |

Product is market-agnostic by design: per-merchant currency, timezone, and locale; no market-specific logic outside the payments/notifications provider layer.

## 3. Personas

| Persona | Description | Primary needs |
|---|---|---|
| **Mariana — boutique owner, Guadalajara** | Tracks sales in Excel exported from a basic POS; ~40 orders/day | Upload weekly export, see what to reorder, WhatsApp/SMS when a size sells out |
| **Julien — specialty grocer, Lyon** | 3 staff, POS with CSV export (semicolon-delimited, comma decimals); ~300 orders/day | Multi-user access, long history, API sync from POS, no ads |
| **Sofía — operations at a packaging supplier, Mexico City** | B2B advertiser | Reach merchants about to reorder stock; self-serve campaigns and budgets |
| **Platform admin (us)** | Internal | Tenant management, ad review/moderation, billing oversight, abuse handling |

## 4. Product surfaces

1. **Merchant web app** (responsive, mobile-first — a large share of merchants operate from mid-range Android phones; desktop is first-class for EU users).
2. **Advertiser portal** (separate section of the same web app, distinct role).
3. **Platform admin panel** (internal; same codebase behind `platform_admin` role).
4. **Public Sync API** (premium): programmatic order/product ingestion for merchants with POS systems.
5. **Mobile app (phase 2 — see §8).**

## 5. Feature matrix by tier

| Feature | Free (ad-supported) | Premium (subscription) |
|---|---|---|
| Data history | Rolling 90 days | Unlimited retention |
| Uploads | Manual CSV/Excel, 5/day, ≤ 10 MB | Manual + Sync API, 50/day, ≤ 50 MB |
| Dashboard analytics | Full (velocity, inventory, retention) | Full |
| Inventory alerts | In-dashboard only | Automated email + SMS, predictive (forecast-based) |
| Ads | Contextual B2B ads | None |
| Team members | 1 user | Up to 5 users (owner + staff roles) |
| Sync API access | — | Yes (API keys, documented rate limits) |
| Data export | CSV of last 90 days | Full CSV/Excel export |
| Localization | en / es / fr | en / es / fr |
| Support | Community/help center | Priority email + in-app |

Tier limits are **data**, not code — stored in the `plans` table and enforced by the entitlements middleware (see [11-billing.md](11-billing.md)). Adding a mid-tier or regional pricing later requires zero code changes.

## 6. Monetization model

1. **Premium subscriptions** — monthly/annual via **Stripe** (cards, SEPA, Apple/Google Pay, link), priced in USD/EUR with purchasing-power-adjusted regional pricing as a lever ([11-billing.md §5](11-billing.md)). Mercado Pago (LATAM) and Flutterwave/Paystack (West Africa) join behind the same provider abstraction when those markets justify it.
2. **B2B ad revenue** — advertisers fund a prepaid wallet, campaigns bid CPC/CPM on contextual triggers (see [08-ads.md](08-ads.md)). Prepaid-only eliminates receivables risk.
3. Explicitly **not** monetized: merchant data is never sold, never shared row-level with advertisers. Advertisers target *contexts* ("merchants in Mexico with an active stockout alert in category=beverages"), never identities. This is a stated product promise and a compliance stance ([05-security.md §9](05-security.md)).

## 7. Success metrics (first 12 months)

- Activation: % of signups completing first successful upload ≥ 60%
- Weekly active merchants / registered merchants ≥ 40%
- Upload success rate (rows accepted / rows submitted) ≥ 97%
- Free→Premium conversion ≥ 4%
- Ad fill rate on triggered slots ≥ 70% (house ads fill the rest); advertiser retention (2nd campaign) ≥ 50%
- p95 dashboard latency < 300 ms; ingestion completion p95 < 60 s for a 10 MB file
- Locale health: < 0.5% of UI renders falling back to English in es/fr sessions

## 8. Mobile strategy

The web app is mobile-first from day one (responsive vanilla CSS, PWA manifest, offline shell for read-only cached dashboards). A native app is justified **when and only when** these feature demands materialize:

| Trigger feature | Why web can't do it well |
|---|---|
| Push notifications for alerts | Cheaper than SMS at scale and more reliable than web push on aggressive Android battery managers |
| Camera-based ingestion (photograph a paper ledger → OCR) | Needs reliable camera + background upload |
| Offline order entry (merchant records sales in-app) | Needs local storage + sync engine |

**Plan:** ship PWA at launch; build a React Native (Expo) app in phase 2 reusing the design-token system and the same versioned API. The API is designed mobile-ready from day one: token auth suitable for native clients, cursor pagination, sparse payloads, ETag caching ([04-api.md](04-api.md)). No API rework will be needed when mobile starts.

## 9. Explicit non-goals (v1)

- No payment processing *between* merchants and their customers (we analyze sales, we don't process them).
- No inventory *management* (purchase orders, transfers) — only analytics and alerts. Watch demand; most likely v2 expansion.
- No marketplace between merchants and advertisers beyond ad serving (no RFQ/chat).
- No languages beyond en/es/fr in v1 (architecture supports adding Portuguese — the obvious Brazil expansion — German, Italian, Arabic later as a translation-file drop, see [10-notifications-i18n.md](10-notifications-i18n.md)).
- No per-country accounting/tax reporting features; taxes handled only where we must (our own invoicing via Stripe Tax).
