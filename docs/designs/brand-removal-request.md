# Brand removal request — CEO analysis

**Context:** Brand Wall profiles startups/brands by country. Data is currently static (`BRANDS` in code). There is no formal way for a brand to request removal. This doc considers whether to add one, how it should work, and how to make “you can leave” a trust signal that lowers risk for creating a profile.

**Branch:** main  
**Date:** 2026-03-18

---

## Step 0: Premise and scope

### 0A. Is this the right problem?

**Yes.** Real outcomes:

- **Brand outcome:** A company that has shut down or rebranded doesn’t want to be listed. Today they have no clear path except “hope someone sees a random contact and cares.”
- **Platform outcome:** Offering a visible, predictable removal path reduces perceived risk of being listed. “You can ask to be removed” is a strong trust signal for “submit your brand” and for brands considering whether to care about the wall.
- **If we do nothing:** Some brands will be stuck; others will hesitate to submit because there’s no exit. Both are worse than a simple, documented removal flow.

So the right problem is: **give brands a clear, low-friction way to request removal and commit to a predictable response.**

### 0B. What already exists

- **Data:** Static `BRANDS` in `src/data/brands.ts`. No backend, no DB.
- **Submit flow:** `SubmitBrand` is client-only; submission is “for curation,” not persisted by the app.
- **Surfaces:** Brand modal (Visit, Share); footer (inspired by…, pixel). No contact, privacy, or removal link.
- **Implied leverage:** Any removal flow today is manual (edit `brands.ts`, deploy). Automation later can consume the same “removal request” channel (form → email or DB).

### 0C. Dream state (12 months)

- Every brand (and every brand page) has a visible “Request removal” path.
- Requests are logged, verified with minimal friction, and resolved within a committed SLA.
- “You can request removal anytime” is stated on submit and in footer/legal, making profile creation feel low-risk.
- Removal is non-breaking: 404 or “no longer listed” for that brand; rest of the wall unchanged; no broken links that point to removed brands from external SEO if we add redirect or canonical handling.

---

## 1. Should there be a removal feature?

**Recommendation: Yes.**

| Reason | CEO lens |
|--------|----------|
| **Trust** | “You can remove your listing” directly reduces perceived risk of being profiled. Focus as subtraction: one clear exit beats vague “contact us.” |
| **Right thing** | Companies that cease operations or don’t want to be profiled deserve a named path, not silence. |
| **Scalability** | As the wall grows, ad-hoc removal (random DMs, email) doesn’t scale. A single, logged channel does. |
| **Legal/privacy** | A visible removal option supports “we respect control over how you’re presented” and helps with GDPR-style “object to processing” / “erase me” narratives. |

So the question is not *whether* to offer removal, but *how* (friction, verification, SLA, and messaging).

---

## 2. How should it work? (Use case: startup shuts down)

**Core flow:**

1. **Discover:** Brand (or ex-founder) finds “Request removal” from:
   - Brand modal (small link: “Request removal from the wall”),
   - Footer (“Contact / Request removal”),
   - Optional: dedicated `/request-removal` or `/contact` that pre-fills brand if coming from a brand URL.
2. **Submit:** Form collects: brand name (and/or country + slug or URL), requester email, short reason (optional: “Company closed”, “Rebranded”, “Don’t want to be listed”, “Other”). No login required.
3. **Delivery:** Request goes to a stable channel: email to ops (e.g. `removal@brandwall.online`) and/or a simple backend that stores requests (future).
4. **Resolution:** Human (or later, automated) removes the brand from data, deploys. Requester can get an optional “We’ve processed your request” confirmation.

**Non-breaking behavior:**

- **During request:** Nothing changes until you act; no auto-hide.
- **After removal:** Brand disappears from the wall. Its previous URL (e.g. `/georgia/acme`) should **404** or show a minimal “This brand is no longer listed” with a link to the country wall — not a broken page. Sitemap/build should exclude removed brands so we don’t promise URLs we then break.
- **Links:** External links to removed brands will 404. That’s acceptable if we document “we may remove listings on request.” Optional later: redirect to country wall with a query like `?removed=1` and a one-line message.

So: **request → logged → verified (lightweight) → resolved → 404 or “no longer listed” page; rest of site unchanged.**

---

## 3. Can it be automated?

**Short answer: partially now; more later.**

| Step | Automatable today? | Notes |
|------|--------------------|--------|
| **Collect request** | Yes | Form → email and/or store in DB. |
| **Verify requester** | Semi | Send a “Confirm removal request” link to the email; click = verified. No full automation of “is this the real brand?” without more signals. |
| **Remove from data** | No (static) | Today data is in code; removal = edit + deploy. Full automation would require a CMS or admin API that writes to the source of truth and triggers deploy. |
| **Notify requester** | Yes | Once removed, optional auto-email: “Your request has been processed.” |

**Practical split:**

- **Phase 1 (now):** Automated: form → email + optional “confirm your email” link; log in a simple store (e.g. Airtable, Notion, or a small DB) with status (pending / verified / done). Manual: actual edit of `brands.ts` and deploy.
- **Phase 2 (when you have backend):** Automated: verify email; optional “approve removal” button in admin that updates data and deploys (or flips a “hidden” flag so build excludes the brand). Optional: auto-reply when done.

So: **yes, automate request capture, verification (email confirm), and logging; keep the final “remove from listing” step human-approved until you have an admin layer.**

---

## 4. Does it need verification?

**Yes, but lightweight.**

**Risks without verification:**

- Malicious or mistaken removal requests (competitor, prank) could get a real brand removed.
- One email is weak proof of “authority” to act for the brand.

**Verification options:**

| Option | Effort | Security | Friction |
|--------|--------|----------|----------|
| **A) No verification** | None | Low; abuse possible | Zero |
| **B) Email confirmation only** | Low | Medium; proves control of email | One extra click |
| **C) Email from domain matching brand URL** | Low | Better; suggests affiliation | Fails for many (e.g. Gmail, ex-founders) |
| **D) Document upload / legal** | High | High | Too heavy for this product |

**Recommendation: B — Email confirmation.**

- Requester submits email → we send “Confirm removal request for [Brand]” link; request is “pending” until clicked.
- Optional: treat “email domain matches brand’s website domain” as auto-approved for later automation; others go to manual review.
- Log: email (hashed if you care), brand, timestamp, confirmed (y/n), resolved (y/n). No need for document verification unless you see abuse.

So: **yes, verify with a single “confirm your email” step; no need for heavy proof.**

---

## 5. SLA and logging

**SLA: 7 business days is reasonable.**

- **Promise:** “We’ll respond within 7 business days and remove the listing if the request is verified and valid.”
- **Respond** can mean: “We’ve received your request” (immediate auto-reply) and “We’ve processed your request” (after removal). The 7-day SLA applies to “processed” (listing removed or explicit denial with reason).
- **Logging:** Every request should be logged with: id, brand (name/slug/country), requester email (or hash), reason, status (pending / email_confirmed / approved / removed / rejected), timestamps (created, confirmed, resolved), and optional note. Retention: align with privacy (e.g. 12–24 months then anonymize or delete).

**Why 7 days:**

- Sets clear expectation; avoids “we’ll get to it sometime.”
- With manual edit + deploy, 7 days is achievable without heavy ops.
- If you automate more later, you can shorten (e.g. “within 48 hours”).

**Transparency:** State the SLA on the removal/contact page and in any footer link: “Removal requests: we aim to process within 7 business days.”

---

## 6. Making it low-risk and non-breaking (CEO lens)

**Design for trust:**

- **Explicit exit:** “You can request removal at any time” on the submit flow and near “Add your brand.” Reduces fear of permanence.
- **One place:** One visible path (e.g. “Request removal” in modal + footer). No hunting.
- **Predictable:** Clear steps (submit → confirm email → we process within 7 days). No silent black hole.
- **Reversible in principle:** If you ever support “re-list,” say so (“If your situation changes, you can ask to be re-listed”). Today you can keep it as “request removal” only and add re-list later.

**Non-breaking:**

- **Data:** Removal = remove from `BRANDS` (or mark hidden). Build/sitemap excludes removed brands.
- **URLs:** Removed brand URL returns 404 or a minimal “No longer listed” page with link to country wall. No 500, no broken layout.
- **Submit flow:** Unchanged; no dependency on removal for new submissions.
- **Existing links:** External links to removed brands will 404. Acceptable; document in footer/legal that listings can be removed on request.

**Copy that reinforces low risk:**

- On **SubmitBrand** or “Add your brand”: “You can request removal from the wall anytime — we process within 7 days.”
- In **Brand modal**: Small link “Request removal from the wall” (secondary, not prominent).
- **Footer**: “Request removal” or “Contact · Request removal” next to existing footer text.
- **Removal page**: “We’ll process verified requests within 7 business days. Your listing will be removed and the link will show a ‘no longer listed’ message.”

---

## 7. Implementation alternatives (0C-bis)

**APPROACH A — Minimal (link + email only)**  
- Add “Request removal” in modal and footer → `mailto:removal@brandwall.online?subject=Removal request: [Brand]` with body template (brand name, country, requester email, reason). No form, no DB, no verification.  
- **Effort:** S. **Risk:** Low. **Pros:** Zero backend, instant. **Cons:** No structured log, no verification, no SLA tracking. **Reuses:** Existing modal + footer.  
- **Completeness: 3/10** — no verification, no audit trail, no SLA.

**APPROACH B — Form + email + optional confirm (recommended)**  
- Dedicated page (e.g. `/request-removal` or `/contact`) with form: brand name + country (or slug/URL), requester email, reason. Form submits to API route or third-party (e.g. Formspree, Resend) → email to ops; optional “confirm your request” link that sets status to verified. Log requests in Airtable/Notion/DB with status and dates. Manual removal in code + deploy; optional “done” email. State 7-day SLA on page and footer.  
- **Effort:** M (human) / S (CC+gstack). **Risk:** Low. **Pros:** Logged, verifiable, SLA-able, one place. **Cons:** Requires one API route or form backend. **Reuses:** Existing routing, modal/footer links.  
- **Completeness: 8/10** — verification + log + SLA; only removal step is manual.

**APPROACH C — Full pipeline (form + verify + admin + optional auto-remove)**  
- As B, plus admin UI: list requests, “Approve” button that (when you have mutable data) removes brand or marks hidden and triggers deploy or rebuild. Optional auto-email when processed.  
- **Effort:** L (human) / M (CC+gstack). **Risk:** Medium (admin surface). **Pros:** Full audit, clear workflow. **Cons:** Needs backend and admin. **Reuses:** Same form and messaging.  
- **Completeness: 10/10** — full lifecycle; overkill until you have backend.

**RECOMMENDATION: Choose B** — Form + email + confirm + log + stated 7-day SLA. Balances trust, verification, and non-breaking behavior without building admin before you have a dynamic data model. Map to preferences: explicit over clever, minimal diff, observability (log), and “you can remove it” as a trust signal.

---

## 8. Summary: answers to your questions

| Question | Answer |
|----------|--------|
| **Should there be a feature for brands to request removal?** | Yes. Trust, fairness, scalability, and legal/privacy alignment all support it. |
| **How should it work?** | Visible “Request removal” (modal + footer) → form (brand, email, reason) → optional email confirm → logged → human removes from data → 404 or “no longer listed” for that brand; 7-day SLA. |
| **Can it be automated?** | Partially: capture, email confirm, and logging yes; actual removal from static data stays manual until you have backend/CMS; then you can automate “approve and remove.” |
| **Does it need verification?** | Yes, lightweight: “confirm your email” link; optional later: domain match = auto-approve. |
| **SLA and logging?** | Commit to “respond/process within 7 business days”; log every request (id, brand, email/status, timestamps); retention per privacy. |
| **Non-breaking and low-risk?** | Removal = 404 or “no longer listed” page; sitemap excludes removed brands; state “you can request removal anytime, we process within 7 days” on submit and footer so creating a profile feels low-risk. |

---

## 9. Suggested next steps

1. **Add the surface:** “Request removal” link in `BrandModal` (secondary) and in footer.
2. **Landing:** Either `mailto:` (A) or a `/request-removal` page with form (B). Recommendation: B.
3. **Backend:** One form handler (API route → email and/or write to a simple store); optional confirm link; log with status.
4. **Policy:** Document 7-day SLA and verification (email confirm) on the removal page and in footer/legal.
5. **Copy:** Add one line to submit flow and removal page: “You can request removal anytime — we process within 7 days.”
6. **When you remove:** Edit `brands.ts` (or future source of truth), deploy; ensure brand URL 404s or shows “no longer listed” and is excluded from sitemap.

### Env for email delivery (implementation)

To send removal requests to an inbox, set: `RESEND_API_KEY`, `REMOVAL_EMAIL_TO` (e.g. removal@brandwall.online), and optionally `REMOVAL_EMAIL_FROM`. If unset, the API returns 200 and logs to console.

---

## 10. NOT in scope (for this feature)

- Re-listing flow (can add later).
- Legal “right to be forgotten” full workflow (this is the product-level removal path; legal can reference it).
- Automated removal without human approval (until admin exists).
- Per-brand removal history visible to public (internal log only).

---

*This doc is a CEO-level plan for the removal feature. No code changes were made. For full implementation plan (architecture, errors, tests, deploy), run an eng review on this doc or a follow-up design.*
