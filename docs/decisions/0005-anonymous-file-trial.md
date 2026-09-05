# ADR 0005: Anonymous file trial as an ephemeral inference preview

Status: Proposed for product and security decision. Not accepted; no
implementation is authorized by this note.

Requirements: FR-U-1, FR-U-2, FR-U-3, FR-U-4, FR-A-1, FR-U-12; SDLC §§5.5,
5.12, 5.13; NFR-8, NFR-9, NFR-10. Written against SDLC v3.0; re-check against
the v4 amendment if that is adopted.

## Context

The inference pipeline is the product's technical moat, and the landing page
cannot let a visitor touch it. The demo shows a fixed fictional merchant; a
visitor who wants to know whether Suq understands their own export has to
create an account first. The landing revision plan (section 8) lists this as
the open discovery item and names the questions a proposal must resolve: the
FR-A-1 verified-account upload rule, isolation, file size and type limits,
abuse and compute budgets, retention and deletion, personal-data handling,
and the difference between an inference preview and committed ingestion.

FR-A-1 requires a verified email before uploads are allowed. That rule
protects workspaces from unverified data and protects the platform from
anonymous storage cost. It was written for uploads that load records. The
proposal below is designed so that nothing is loaded.

## Proposal

Offer a "Try your file" control on the landing page that runs the first
stages of the ingestion pipeline on a submitted file and returns the proposed
domain model with a parsed preview, then discards the file.

### What the preview is and is not

| Property | Preview | Committed ingestion |
|---|---|---|
| Pipeline stages | Structural inference, column profiling, domain reconciliation (SDLC §5.5 stages 2–4) | All stages including load, rollups, and derived state |
| Output | Proposed fields with types, roles, confidence, evidence, and a parsed preview of at most 20 rows | Records in a workspace |
| Workspace | None created | Required, tenant-scoped |
| Storage | File held in memory or tmpfs for the request only; never written to object storage | Raw upload retained per SDLC retention rules |
| State | Computes nothing that persists | Updates rollups and derived state |
| Account | None | Verified email per FR-A-1 |

Because the preview loads no records into any workspace, it does not conflict
with the purpose of FR-A-1. The decision required is whether FR-A-1's wording
should say "before data is loaded into a workspace" so the boundary is
explicit, or whether a separate FR-A-1a should define the anonymous preview.
Either is acceptable; silently reading the existing text as permitting the
preview is not.

### Limits and controls

- Size: 2 MB and 2,000 rows, enforced at the edge before application code and
  again after parsing. Rows beyond the limit are not read.
- Types: delimited text and spreadsheets only. Images and PDFs are excluded
  from the trial because extraction runs in the heavy worker with an
  order-of-magnitude higher cost; they remain available after signup.
- Processing: the isolated inference worker with a 10-second budget; a timeout
  returns a plain explanation, never a partial model.
- Rate limits: a new policy class `trial.preview` at 5 per hour per IP and a
  platform daily budget with a kill switch, added to the SDLC §5.12 table.
- Abuse: magic-byte verification, decompression bounds, and the self-hosted
  proof-of-work challenge before submission, all already specified for
  uploads in §5.13.
- Personal data: sample values for columns whose profile resembles
  identifiers, phone numbers, or emails are masked in the preview. Structured
  logs carry structural statistics only, never values, field names, or
  filenames.
- Retention: none. The file is discarded when the response is sent. The
  proposed model, keyed by content hash and holding no row values, may be
  cached for 15 minutes solely to support the signup handoff below.
- Disclosure: the control states before submission that the file is
  processed transiently on EU infrastructure, that nothing is saved, and that
  a preview is not an import. The result screen repeats that nothing is
  saved.

### Handoff to signup

"Continue with this file" leads to signup. After verification, if the user
submits a file with the same content hash within the cache window, the
cached proposal is offered as the starting point for review. The file itself
never crosses the boundary; the user re-submits it, so FR-A-1 is satisfied at
the moment data is loaded.

### Measurement

Events `trial_file_submitted`, `trial_preview_viewed`, and
`trial_continue_selected`, with properties limited to source category,
row-count bucket, locale, device class, and outcome. Filenames, field names,
values, and any user-entered text are never transmitted, consistent with the
landing plan's measurement rules.

## Alternatives considered

1. Sample-only demo (current). Exposes nothing of the moat; a visitor cannot
   learn whether their own records would work.
2. Trial behind email capture. Converts the interaction into a lead but
   gates the most persuasive moment behind friction, and collecting the
   address requires the same design note the landing plan already requires
   for early access.
3. Ephemeral preview (this proposal), with optional email capture offered
   after the preview rather than before it.

Recommendation: alternative 3.

## Risks

- Cost abuse through repeated submissions: bounded by size, rate class, and
  the daily kill switch; the worker budget caps the cost of any one request.
- Visitors assuming the file was saved: addressed by disclosure before and
  after, and by the absence of any account.
- Inference performing poorly on hostile or unusual files in public: this is
  the honest outcome the product claims to handle, and every such file is a
  candidate for the labelled fixture corpus, with the submitter's consent
  requested explicitly and never assumed.
- Regulatory reading of transient processing: no personal data is stored, but
  the disclosure must still describe the processing; legal review of the
  disclosure text is a dependency.

## Sequencing and decision

This proposal depends on the inference worker, which is Phase 1 work, and on
the landing revision PRs 1–3 landing first so the trial joins a coherent page.
It is not part of the landing revision plan's PR sequence.

Decisions required before any implementation: the product owner on the
FR-A-1 wording, the tech lead on the security controls above, and legal
review of the disclosure. Record the outcome by changing this note's status
and, if accepted, adding the `trial.preview` rate class to SDLC §5.12 in the
same checkpoint.
