# 11 — Billing & Subscriptions

Two money flows: **merchant subscriptions** (recurring) and **advertiser wallet top-ups** (prepaid, [08-ads.md](08-ads.md)). Both go through the same `payments` table and provider abstraction.

## 1. Payment providers

| Provider | Role | Flow |
|---|---|---|
| **Stripe** | Primary, all launch markets | Checkout Sessions (cards, SEPA debit, Apple/Google Pay, Link) + Billing subscriptions + customer portal + **Stripe Tax** |
| **Mercado Pago** | Phase 2, LATAM (local cards, OXXO cash, installments — significantly raises conversion in MX/AR) | Same abstraction; added when LATAM revenue justifies it |
| **Flutterwave / Paystack** | Phase 2, West Africa (mobile money, local cards) | Same abstraction |
| `manual` | Admin-recorded payments (bank transfer for large advertisers) | Audited admin action |

Provider abstraction `integrations/payments/`: `create_checkout(purpose, amount, currency, metadata) -> checkout_url`, `verify(provider_ref) -> VerifiedPayment`, `parse_webhook(request) -> Event`. Adding a provider touches nothing outside this package.

**Subscriptions are true auto-renew** via Stripe Billing (card/SEPA on file): Stripe owns the renewal charge, smart retries, and card-updater; our system is a projection of Stripe's subscription state, reconciled by webhook (`customer.subscription.*`, `invoice.*`) and a daily sweep. The customer portal handles card updates, invoice history, and cancellation — we build no card-management UI.

## 2. Subscription lifecycle

```
free ──checkout──▶ active ──renewal charge fails──▶ past_due (Stripe smart retries, ~2 wks)
                     ▲                                   │ retries exhausted
                     │ payment recovered                 ▼
                     └───────────────────── grace (7d, full features, banner) → expired → free
active ──cancel (portal or in-app)──▶ canceled (runs out period) → free
```

- Dunning: Stripe retries + our localized emails at fail/T+3/T+7; in-app banner throughout `past_due`/`grace`.
- Downgrade to free never deletes data immediately: history beyond 90 d becomes invisible (entitlement) but premium-era rows are retained 13 months ([03-data-model.md §10](03-data-model.md)) — re-upgrading restores everything instantly. Kindness plus a re-conversion lever, disclosed in the UI.
- Excess team members on downgrade: seats beyond 1 deactivated (owner picks; default most recent first), reactivated on re-upgrade.
- Sync API keys: suspended (not deleted) while on free.
- Proration: monthly↔annual switches handled by Stripe proration; our `domain/billing.py` only mirrors and displays it. All money display logic unit-tested to the cent.

## 3. Entitlements enforcement

- Single source: `plans.entitlements` JSON → snapshot cached in Redis (`ent:{merchant_id}`, 60 s) → attached to request context by middleware.
- Checks happen in exactly one layer per concern: quotas at the rate-limit middleware, feature gates via `require_entitlement("sync_api")` dependency, data-visibility (history window) in the query-builder helper.
- Plan changes (webhook-driven) bump the entitlement cache and the dashboard cache version → take effect within seconds of Stripe confirming.
- Kill-switch/feature flags share this mechanism (platform-level pseudo-entitlements).

## 4. Webhook handling (one discipline, all providers)

1. Verify signature + timestamp ([05-security.md §7](05-security.md)); respond 200 fast; process in worker.
2. Idempotent on provider event id / `payments.provider_ref` unique constraint.
3. **Always re-fetch the object from the provider API**; compare amount/currency/status against our records; mismatch → flagged + Sentry alert (fraud attempt or integration bug).
4. On success: activate/extend subscription or credit wallet (transactional with ledger); send localized receipt; audit log.
5. Reconciliation: daily sweep comparing our subscription states against Stripe's (drift alarm); weekly ledger vs Stripe payout report.

## 5. Pricing & taxes (launch; config, not code)

| Plan | Price | Notes |
|---|---|---|
| Free | 0 | Ad-supported |
| Premium monthly | **$19 / €19** | SMB-analytics market anchor; validated in beta willingness-to-pay interviews |
| Premium annual | **$190 / €190** (2 months free) | |
| Regional pricing | e.g. MX$249/mo | Purchasing-power-adjusted plan rows per market (`premium_monthly_mx`), enabled per-country when data supports it — plan rows, zero code |

- **Stripe Tax** computes and files-ready EU VAT (OSS), UK VAT, and applicable sales taxes; prices displayed tax-exclusive for B2B with tax itemized at checkout; VAT-ID reverse-charge for EU B2B customers collected at checkout.
- Invoices/receipts: Stripe-generated invoice PDFs (localized) are canonical; listed under Billing in-app.

## 6. Financial reporting (internal)

Admin metrics endpoint + monthly job: MRR, active premium count by market, churn, ARPU, ad revenue, SMS cost by country, provider fees. Ledgers exportable as CSV for the accountant. All ledger amounts integer micro-units; formatting at the edge.

## 7. Refund policy mechanics

Admin-initiated only in v1 (support flow): Stripe refund API; wallet refunds only for unspent balances on advertiser account closure. 14-day EU consumer withdrawal right honored by policy for first-time subscriptions (B2B SaaS is technically exempt, but honoring it cheaply buys trust and avoids disputes). Every refund audit-logged with reason code; chargeback webhook auto-suspends the associated advertiser wallet pending review.
