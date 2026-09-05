# Cinematic Suq: shared sample continuity

Requirement scope: SDLC §1.2, FR-U-4/5/12, FR-G-6, FR-E-1, FR-D-12, NFR-5/6/9/10. These are fictional marketing demonstrations, not completed application requirements.

The route-level memory provider owns source choice, role review and confirmation, sale status, customer-evidence availability, and dashboard metric/time/stock selections. Source/role changes invalidate review confirmation. A sale requires preview and applies at most once; cancel, undo and reset restore the appropriate state. Neither sale nor review mutates historical fixtures. Customer analysis becomes unavailable everywhere when evidence is disabled.

The demo reuses the landing sale flow and the canonical source review; it no longer exposes a second independent field-review workflow. Reset stays focused and announces completion. Language persistence is unchanged; scenario state uses neither browser storage nor network requests.

Validation: web lint, TypeScript, 70 component/unit tests, production build (119.9 KB initial JavaScript gzip against 200 KB), documentation lint, diff whitespace validation. Chromium exercised EN/ES/FR landing-to-demo sale and customer continuity, reset focus, browser Back, and axe WCAG 2/2.1 A/AA with contrast enabled: passed. The concept PDF was regenerated from its Markdown source.

This checkpoint precedes the cinematic layout. Final viewport, motion, forced-color and recording evidence belongs to the third delivery. Physical assistive-technology and merchant comprehension reviews are still human follow-up; no conversion improvement is claimed.
