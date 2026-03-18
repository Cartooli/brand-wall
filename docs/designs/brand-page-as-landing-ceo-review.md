# CEO Plan Review: Brand page as shareable landing

**Plan:** `docs/designs/brand-page-as-landing.md`  
**Branch:** main  
**Base branch:** main  
**Mode selected:** SELECTIVE EXPANSION  
**Date:** 2026-03-18

---

## PRE-REVIEW SYSTEM AUDIT

- **Git:** Recent history shows GROWTH.md, ShareButton, i18n, QA fixes, canonical domain. No in-flight PR; branch is main.
- **Diff:** Design doc and this review are new; no code diff yet (plan-only).
- **TODOS.md:** None in repo. No prior deferred work to cross-reference.
- **Design doc:** `docs/designs/brand-page-as-landing.md` exists; Approach B (brand route + modal) recommended.
- **Frontend/UI scope:** New route `[country]/[slug]`, homepage query read for `?brand=`, BrandModal share URL change, metadata. DESIGN_SCOPE: yes.
- **Taste:** Reuse existing modal, URLBar, CountryNav, ShareButton patterns. Avoid new one-off layouts; keep slug resolution in one place.

---

## Step 0: Nuclear Scope Challenge + Mode Selection

### 0A. Premise Challenge
- **Right problem?** Yes. Brands cannot today drive traffic to themselves via a single link; share is country-level only. Making the brand the first-class share target is the right framing.
- **User outcome:** Brand gets a shareable URL that opens “their” view and shows their name in previews. Direct path: per-brand route + metadata.
- **If we did nothing:** Directory remains country-centric; “webpage substitute” stays out of reach. Real pain for brands wanting a simple landing.

### 0B. Existing Code Leverage
- **BRANDS + COUNTRIES:** Slug resolution can live in a small module (e.g. `src/data/slugs.ts`) or in the route; no new data source.
- **BrandModal:** Reuse as-is for content and CTA; only share URL changes to brand URL.
- **Homepage:** Already reads `searchParams` for `country`; add `brand` and resolve to `BrandWithCountry` to open modal on load.
- **generateMetadata:** Next.js App Router supports dynamic metadata per route; use in `[country]/[slug]/page.tsx`.
- Not rebuilding—extending existing flows.

### 0C. Dream State Mapping
```
  CURRENT STATE                    THIS PLAN                        12-MONTH IDEAL
  Country-only share URLs    -->    Per-brand URLs + metadata  -->   Brand as identity layer:
  Modal share = ?country=           /georgia/spribe, OG title/desc   optional standalone page,
  No per-brand SEO                 ?brand= on home for deep link     per-brand OG image, analytics
```

### 0C-bis. Implementation Alternatives

**APPROACH A: Query + modal only**
- Summary: Add `?brand=spribe` (and `?country=georgia`); homepage opens modal; share URL stays query-based.
- Effort: S  Risk: Low  Pros: Smallest diff.  Cons: No per-brand URL or metadata.  Reuses: page.tsx, BrandModal.
- Completeness: 3/10 — does not achieve “webpage substitute” or share preview.

**APPROACH B: Brand route + modal (recommended)**
- Summary: New route `[country]/[slug]`; page renders wall + that country + that brand’s modal; share = brand URL; generateMetadata for title/description.
- Effort: M  Risk: Low  Pros: Canonical URL, SEO/unfurls, minimal UI.  Cons: Slug resolution + 404.  Reuses: BRANDS, BrandModal, layout.
- Completeness: 8/10 — achieves goal; per-brand OG image deferred.

**APPROACH C: Brand route + standalone page**
- Summary: Same as B but dedicated brand-only layout (no grid), then “Visit site” and “Explore wall.”
- Effort: L  Risk: Low  Pros: Feels most like “their” page.  Cons: More UI, more layout.  Reuses: Brand content, CTA.
- Completeness: 9/10 — better UX, larger scope.

**RECOMMENDATION:** Choose B — best balance for a tight PR; achieves shareable brand URL and metadata without new layout work.

### 0D. Mode: SELECTIVE EXPANSION
- Scope held: Approach B (brand route + modal + metadata).
- Expansion opportunities considered:
  - Per-brand OG image → DEFERRED (TODOS.md).
  - `?brand=` on homepage → ACCEPTED (small, improves share flexibility).
  - Standalone brand page → SKIPPED (keep PR tight).

### 0E. Temporal Interrogation
- **Hour 1:** Slug derivation: normalize name (lowercase, replace non-alphanumeric with `-`), handle collisions (e.g. first match by order or append `-2`). Decide: slug in URL is country-scoped (e.g. `/georgia/spribe`).
- **Hour 2–3:** Route `[country]/[slug]`: validate country against COUNTRIES, resolve slug to brand, 404 if not found. Render: redirect to home with `?country=X&brand=Y` OR render home content in place with modal open (same component tree).
- **Hour 4–5:** generateMetadata: async, receive params; look up brand; return title/description; optional image. ShareButton URL in BrandModal: build brand URL from country + slug(brand.name).
- **Hour 6+:** 404 page or redirect for unknown slug; test slug edge cases (special chars, long names, duplicates).

### 0F. Mode Selection
**SELECTIVE EXPANSION** — Hold scope to Approach B; accepted one expansion: `?brand=` deep link on homepage. Deferred: per-brand OG image.

---

## Section 1: Architecture Review

- **Component boundaries:** New route `app/[country]/[slug]/page.tsx` — server component that resolves slug, then either redirects to `/?country=X&brand=Y` or renders client content that opens modal. Alternative: brand route renders same HomeContent with initial state (country + selectedBrand) so one tree.
- **Data flow:** Request → validate country/slug → getBrandByCountrySlug(country, slug) → notFound() or render. Slug resolution is pure function over BRANDS.
- **Coupling:** BrandModal and ShareButton need brand URL helper (country + slug). Homepage needs to read `brand` from searchParams and resolve to BrandWithCountry to set initial selectedBrand.
- **Scaling:** Static data; slug lookup O(n) per country. Acceptable for current dataset size.
- **Security:** No new auth or user input beyond path params; validate country against allowlist, slug against derived set. No injection risk if slug is not rendered as HTML without escaping (React default).
- **Rollback:** Revert deploy; no DB migrations. Feature is additive.

**ASCII: System architecture**
```
  User request
       │
       ▼
  /[country]/[slug]  ──► validate country ∈ COUNTRIES
       │                      │
       │                      ▼
       │               getBrandByCountrySlug(country, slug)
       │                      │
       │              ┌───────┴───────┐
       │              ▼               ▼
       │           notFound()      generateMetadata() + render page
       │                                 │
       │                                 ▼
       │                            HomeContent with initialCountry + initialBrand
       │                                 │
       │                                 ▼
       │                            BrandModal open for initialBrand; share URL = brandPageUrl(country, brand)
       │
  /?country=...&brand=...  ──► HomeContent useEffect: set country + resolve brand → setSelectedBrand
```

---

## Section 2: Error & Rescue Map

| METHOD/CODEPATH              | WHAT CAN GO WRONG        | EXCEPTION CLASS / HANDLING     |
|------------------------------|---------------------------|--------------------------------|
| getBrandByCountrySlug        | country not in COUNTRIES | Caller validates first         |
|                              | slug not found            | Return null → notFound()      |
| generateMetadata             | params undefined          | Next.js guarantees in route    |
|                              | brand null                | Return generic or notFound     |
| Homepage ?brand=             | invalid slug             | Resolve; if null, ignore param |

No rescues needed in application code for slug lookup—synchronous, in-memory. notFound() is the explicit path for unknown slug.

---

## Section 3: Security & Threat Model

- **Attack surface:** New path segment `[country]` and `[slug]`. Country validated against VALID_COUNTRIES; slug used only for lookup (no eval, no SQL).
- **Input validation:** Country: allowlist. Slug: normalize to [a-z0-9-]; reject or 404 on no match. Max length reasonable (e.g. 100).
- **Authorization:** Public read-only; no auth.
- **Injection:** Slug is not interpolated into HTML unsafely (React). Metadata uses brand.name/desc (controlled data).
- **Threat:** Low. Mitigated by allowlist and derived slug set.

---

## Section 4: Data Flow & Interaction Edge Cases

**Data flow**
```
  [country], [slug] ──► validate ──► getBrandByCountrySlug ──► brand | null
       │                    │                    │
       ▼                    ▼                    ▼
  invalid country     notFound()            null → notFound()
  → notFound()                              brand → render + metadata
```

**Interaction edge cases**
- **Brand route, unknown slug:** 404 or redirect to country wall. Handled: notFound().
- **Homepage ?brand=invalid:** Ignore; do not open modal. Handled: resolve returns null.
- **Double-click share:** No state change. OK.
- **Navigate away with modal open:** Existing behavior; no new edge case.

---

## Section 5: Code Quality Review

- **DRY:** Slug derivation in one place (e.g. `toSlug(name)`, `getBrandByCountrySlug`). Share URL construction: single helper `brandPageUrl(country, brand)`.
- **Naming:** `getBrandByCountrySlug`, `toSlug`, `brandPageUrl` — clear.
- **Minimal diff:** Reuse HomeContent or a shared wall+modal component; avoid duplicating wall layout in brand route.

---

## Section 6: Test Review

**New UX flows:** Visit /georgia/spribe → wall + modal open. Share brand → copy link = brand URL. Homepage ?country=georgia&brand=spribe → modal open.

**New codepaths:** Slug normalization; lookup by country+slug; 404 for unknown slug; generateMetadata for brand route; ShareButton URL from brand.

**Test plan:** Unit: toSlug(), getBrandByCountrySlug() for known/unknown/collision. Integration: GET /georgia/spribe 200 with title; GET /georgia/nonexistent 404. E2E: open brand URL, see modal; share, paste link, see same brand.

---

## Section 7: Performance Review

- No N+1; no DB. Slug lookup is in-memory scan per country — acceptable.
- generateMetadata runs per request; lightweight.
- No new caching required for static data.

---

## Section 8: Observability & Debuggability

- Logging: Optional log for 404 (country/slug) for debugging bad links.
- No new metrics required for MVP.
- Runbook: Unknown slug → 404; check slug derivation if brands were added with special characters.

---

## Section 9: Deployment & Rollout Review

- No migrations. Deploy as usual. Rollback: revert.
- Feature flag optional; not required for additive route.
- Post-deploy: Visit one brand URL, check metadata in social debugger.

---

## Section 10: Long-Term Trajectory Review

- **Debt:** Per-brand OG image deferred; add later if needed.
- **Reversibility:** High (5/5)—remove route and query handling.
- **Path dependency:** Brand route becomes canonical share target; changing URL shape later would break shared links.

---

## Section 11: Design & UX Review

- **IA:** Brand route: brand first (modal), then “Visit site” and “Explore the wall” (existing modal CTAs).
- **States:** Loading (slug resolve is sync, so minimal); Found (modal open); Not found (404).
- **Responsive/a11y:** Reuse existing modal and wall; no new breakpoints. Keyboard and screen reader: existing modal behavior.
- **Recommendation:** Run /plan-design-review for full 7-pass design review; run /design-review after implementation for visual QA.

---

## NOT in scope

- New backend or DB.
- Custom OG image per brand (deferred to TODOS.md).
- Standalone brand-only page (no wall grid).
- Auth, analytics, A/B tests.
- i18n string changes beyond any new “Share” copy.

---

## What already exists

- `BRANDS`, `COUNTRIES` — slug resolution and metadata source.
- `BrandModal` — content and CTA; only share URL changes.
- `ShareButton` — accepts URL prop.
- Homepage `useSearchParams` for `country` — extend for `brand`.
- Next.js `generateMetadata` and `notFound()`.

---

## Dream state delta

Plan moves from “country-only share” to “per-brand URL + metadata.” Twelve-month ideal adds per-brand OG image and optional standalone brand page; this PR is the necessary first step.

---

## Error & Rescue Registry

| Codepath           | Exception / failure     | Rescued? | Action        | User sees   |
|--------------------|-------------------------|----------|---------------|-------------|
| getBrandByCountrySlug | slug not found        | N/A      | Return null   | notFound()  |
| generateMetadata     | brand null             | N/A      | notFound()    | 404         |
| Home ?brand=         | invalid slug           | N/A      | Ignore param  | No modal    |

---

## Failure Modes Registry

| CODEPATH        | FAILURE MODE      | RESCUED? | TEST? | USER SEES? | LOGGED? |
|-----------------|-------------------|----------|-------|------------|---------|
| Brand route     | Unknown slug      | Y        | Y     | 404        | Optional |
| Brand route     | Invalid country   | Y        | Y     | 404        | Optional |
| Home ?brand=    | Invalid slug      | Y        | Y     | No modal   | No       |

No critical gaps.

---

## TODOS.md updates (proposed)

1. **Per-brand Open Graph image** — Dynamic opengraph-image for `[country]/[slug]` so shared links show brand-specific image. Effort: M. Priority: P2. Deferred from this PR.

---

## Diagrams

1. **System architecture:** See Section 1 (ASCII).
2. **Data flow:** Request → validate → lookup → render or notFound.
3. **State:** Brand route has two outcomes: found (render with modal) or not found (404).

---

## Completion Summary

| Item              | Status |
|-------------------|--------|
| Mode              | SELECTIVE EXPANSION |
| Step 0            | Approach B accepted; ?brand= accepted; per-brand OG deferred |
| Section 1 (Arch)  | 0 critical issues |
| Section 2 (Errors)| Mapped; no silent failures |
| Section 3 (Security) | Low threat; mitigated |
| Section 4 (Data/UX) | Edge cases mapped |
| Section 5 (Quality) | DRY and naming noted |
| Section 6 (Tests) | Test plan outlined |
| Section 7 (Perf)  | No concerns |
| Section 8 (Observ) | Optional log for 404 |
| Section 9 (Deploy) | Additive; no rollback complexity |
| Section 10 (Future) | Reversibility high |
| Section 11 (Design) | IA and states specified; recommend design review |
| NOT in scope      | Written |
| What already exists | Written |
| Dream state delta | Written |
| Error/rescue registry | Complete |
| Failure modes     | 0 critical gaps |
| TODOS.md          | 1 item proposed |
| CEO plan          | Written to ~/.gstack/projects/brandwall/ceo-plans/ |

---

## Review Log

Persisted to `~/.gstack/projects/brandwall/main-reviews.jsonl` (skill format).

## Review Readiness Dashboard

After implementation: run Eng Review (required), then optionally CEO and Design. Verdict will be CLEARED when Eng Review passes.
