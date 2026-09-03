# 10 — Notifications & Internationalization

## 1. Localization (en / es / fr)

### Architecture
- **Frontend:** react-i18next, namespace-per-feature JSON files in `frontend/src/locales/{en,es,fr}/*.json`. Language switcher persists to user profile (server) + localStorage (pre-login). Default locale from signup choice; browser `Accept-Language` as first-visit hint (and it actually works for es/fr, unlike minority locales).
- **Backend:** its own catalogs (same JSON format, shared keys repo-wide) for API error messages, alert/SMS/email templates, generated exports' headers. Locale resolution: explicit `?locale` > user profile > `Accept-Language` > merchant default.
- **Key discipline:** English is the source-of-truth catalog; CI fails if es/fr files miss keys (fallback to English is allowed at runtime but tracked as a metric — missing-translation renders must trend to zero; target < 0.5% of es/fr session renders).
- Message formatting via ICU MessageFormat (plurals, interpolation, gender where fr needs it). French typographic conventions respected in templates (non-breaking space before `:` `!` `?`, `« »` quotes) — small details that make the product feel native rather than translated.

### Regional formatting (product-quality differentiators)
- **Numbers & currency:** per-locale formatting via a single shared FE/BE util on top of `Intl.NumberFormat` (well-supported for es/fr): `$1,234.56` (en-US), `1.234,56 €` (es-ES), `1 234,56 €` (fr-FR), `MX$1,234.56` (es-MX) — driven by locale + merchant currency, snapshot-tested per combination.
- **Dates:** locale-aware display (`12 févr. 2026`, `12 feb 2026`, `Feb 12, 2026`); merchant-local weeks start Monday for es/fr/en-GB, Sunday for en-US (config from locale, overridable).
- **Ingestion symmetry:** the same regional conventions accepted on *input* — semicolon CSVs, comma decimals, day-first dates, localized month names ([06-ingestion.md](06-ingestion.md)).
- **Text handling:** Unicode NFKC + diacritic-fold for matching, accents preserved for display; standard Latin web font subset covers all three languages.

### Translation workflow
Translations live in-repo (PRs, reviewable diffs); a `scripts/i18n-report` shows key coverage. Professional review pass for es (LATAM-neutral Spanish — no voseo in UI copy, region-neutral vocabulary) and fr (France-standard, acceptable across francophone Africa) before launch. Machine-translation drafts acceptable only as PR placeholders flagged `"__mt": true`, blocked from release by CI.

## 2. Notification system

### Channels & providers
| Channel | Provider | Notes |
|---|---|---|
| Email | **Primary channel.** Postmark (or SES) via `integrations/email/`; DKIM/SPF/DMARC at DNS; dedicated transactional domain | Email is universal in these markets — it carries verification, alerts, billing by default |
| SMS | **Twilio** primary, **Vonage** fallback, behind `integrations/sms/` provider interface (send, delivery callback, cost) | Premium alert channel + optional phone verification. International SMS pricing varies 10× by country — per-country cost table maintained, budget alarms per market |
| WhatsApp Business API | Phase 1.5 (post-launch, LATAM priority) | The dominant merchant channel in LATAM; template-message approval process starts during beta. The `notifications` table is channel-generic so this is an integration, not a schema change |
| Push | With the mobile app (phase 2) | |

### Message classes
| Class | Channel(s) | Gating |
|---|---|---|
| Verification (email link/code; SMS OTP when enabling SMS channel) | Email / SMS | All tiers; strict rate limits ([09-performance.md §5](09-performance.md)) |
| Security (new API key, password change, new device) | Email (+ SMS if verified) | All tiers |
| Inventory/velocity alerts | Email + SMS | **Premium**; per-rule channel opt-in; SMS requires verified phone |
| Billing (payment success/failure, renewal, dunning) | Email | All paying; Stripe also sends receipts if enabled — ours are canonical |
| Advertiser (campaign approved/exhausted, low wallet) | Email | Advertisers |
| Product/marketing | — | v1: none. Requires explicit opt-in consent when introduced (GDPR) |

### Delivery pipeline
- `notify` Celery queue, isolated from `ingest` (alert latency never queues behind a 50 MB parse).
- Each send: render template in recipient locale → provider call → `notifications` row updated on provider callback (delivered/failed/bounced) → hard bounces suppress the address and surface a banner to the merchant.
- **Cost governance:** every SMS logs `cost_micro_usd`; Prometheus counter per class and per destination country; daily budget alarm; per-merchant SMS caps with digest collapse ([07-analytics.md §3](07-analytics.md)).
- Quiet hours 21:00–08:00 *merchant-local* for non-critical, non-verification messages — matters when the ops team and the merchant are 7 timezones apart.
- SMS length engineering: es/fr accents push messages from GSM-7 to UCS-2 (70 chars/segment); templates are written GSM-7-safe where possible (accent-stripped SMS variant is acceptable for SMS only); template CI check computes segment count per locale.

### Template catalog (initial)
```
verify.email               alerts.stockout.sms        billing.payment_failed
verify.phone_otp           alerts.stockout_digest     billing.renewal_reminder
auth.password_reset        alerts.velocity_spike      billing.payment_receipt
security.new_key           alerts.predictive_stockout advertiser.campaign_approved
security.password_changed  upload.completed_with_errors advertiser.wallet_low
security.new_device
```
Each exists ×3 locales ×(email|sms as applicable), versioned in-repo, rendered via the same ICU formatter, covered by snapshot tests.
