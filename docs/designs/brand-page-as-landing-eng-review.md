# Eng Plan Review: Brand page as shareable landing

**Plan:** `docs/designs/brand-page-as-landing.md`  
**Branch:** main  
**Base branch:** main  
**Date:** 2026-03-18

---

## Step 0: Scope Challenge

1. **What existing code already partially solves each sub-problem?**
   - **Slug resolution:** None. Add `toSlug(name)` and `getBrandByCountrySlug(country, slug)` over `BRANDS` (or inline in route).
   - **Per-brand URL:** None. New dynamic route `[country]/[slug]`.
   - **Share URL:** `BrandModal` currently passes `url={...?country=...}`; change to brand URL helper.
   - **Metadata:** Root layout has static metadata; new route uses `generateMetadata({ params })`.
   - **Deep link:** Homepage already reads `searchParams.get("country")`; add `brand` and resolve to open modal.
   - Plan reuses BRANDS, BrandModal, ShareButton, homepage layout; no parallel rebuild.

2. **Minimum set of changes that achieves the stated goal**
   - New: `src/data/slugs.ts` (or equivalent): `toSlug`, `getBrandByCountrySlug`.
   - New: `src/app/[country]/[slug]/page.tsx`: validate country, resolve slug, `notFound()` or render (redirect to home with state or render same wall+modal).
   - Modified: `BrandModal.tsx` — share URL = `brandPageUrl(country, brand)`.
   - Modified: `src/app/page.tsx` — read `brand` from searchParams, resolve to BrandWithCountry, set initial selectedBrand in useEffect.
   - Defer: per-brand opengraph-image.

3. **Complexity check**
   - Plan touches ~6 files (2 new, 4 modified). Two “new” modules: slug utils + one route. Under 8 files and 2 new logical services; acceptable. Same goal cannot be achieved with fewer parts without dropping per-brand URL or metadata.

4. **TODOS cross-reference**
   - No TODOS.md yet. CEO review proposed one TODO: per-brand OG image. Eng review concurs: defer.

5. **Completeness check**
   - Plan is complete for Approach B: route, metadata, share URL, deep link. Tests and 404 handling are in scope; no shortcut.

---

## Section 1: Architecture Review

- **System design:** Single new route; slug layer is pure functions over BRANDS. No new services or API.
- **Dependency graph:** `[country]/[slug]/page` → slugs.ts (or inline) + BRANDS, COUNTRIES. Home page → searchParams + slugs for initial brand. BrandModal → brandPageUrl(country, brand).
- **Data flow:** Path params → validate → lookup → render or notFound. No new bottlenecks.
- **Scaling:** In-memory lookup; acceptable for current data size.
- **Security:** Country allowlist; slug used only for lookup. No injection surface.
- **Production failure:** Slug lookup cannot “fail” in a way that isn’t “not found” (no network/IO). notFound() is the correct response.

**ASCII: Request flow**
```
  GET /[country]/[slug]
       │
       ├─ country ∉ COUNTRIES → notFound()
       │
       └─ getBrandByCountrySlug(country, slug)
              │
              ├─ null → notFound()
              │
              └─ brand → generateMetadata() + render page (wall + modal for brand)
```

---

## Section 2: Code Quality Review

- **DRY:** Centralize slug derivation and lookup in one module (`slugs.ts`). Single `brandPageUrl(country, brand)` used by BrandModal and anywhere else that needs the canonical URL.
- **Naming:** `toSlug`, `getBrandByCountrySlug`, `brandPageUrl` — clear and consistent.
- **Error handling:** No rescues needed; notFound() and “ignore invalid ?brand=” cover cases. No silent failures.
- **Existing diagrams:** No ASCII in current codebase for this feature; add brief comment in slugs.ts or route if logic is non-obvious (e.g. collision handling).
- **Over/under-engineering:** Plan is “engineered enough”: one route, one util module, minimal state on home.

---

## Section 3: Test Review

**Test diagram**
```
  NEW UX FLOWS:
    - Visit brand URL → wall + modal
    - Share brand → copy brand URL
    - Home ?brand= → modal open

  NEW DATA FLOWS:
    - Path params → getBrandByCountrySlug → brand | null
    - searchParams.brand → resolve → setSelectedBrand

  NEW CODEPATHS:
    - toSlug(name)
    - getBrandByCountrySlug(country, slug)
    - generateMetadata in [country]/[slug]
    - Homepage useEffect for brand param
    - BrandModal share URL from brandPageUrl

  NEW ERROR PATHS:
    - Unknown slug → notFound()
    - Invalid country → notFound()
    - Invalid ?brand= → ignore
```

**Coverage**
- **Unit:** `toSlug()` — normal name, spaces, special chars, empty (if allowed). `getBrandByCountrySlug()` — known brand, unknown slug, invalid country, collision (if any).
- **Integration:** GET `/[country]/[slug]` 200 for known, 404 for unknown; metadata in response (or document title). Homepage with `?brand=...` (manual or E2E).
- **E2E:** Open brand URL → modal visible; share → link is brand URL; open link in new tab → same brand.

**Test plan artifact:** Written to `~/.gstack/projects/brandwall/robn-main-test-plan-20260318-120000.md` and summarized above.

---

## Section 4: Performance Review

- **N+1 / DB:** None; static in-memory data.
- **Memory:** Slug list per country is small; no concern.
- **Caching:** Not required for static BRANDS.
- **Slow paths:** Slug resolution is O(n) per country; n is small. generateMetadata is cheap.

---

## NOT in scope
- New backend or DB; per-brand OG image (deferred); standalone brand-only page; auth; analytics; i18n beyond necessary copy.

---

## What already exists
- `BRANDS`, `COUNTRIES` — data source for slug and metadata.
- `BrandModal`, `ShareButton` — reuse; only URL prop changes.
- Homepage `useSearchParams` — extend for `brand`.
- Next.js App Router — `generateMetadata`, `notFound`, dynamic segments.

---

## Failure modes
| CODEPATH           | FAILURE MODE     | RESCUED? | TEST? | USER SEES? |
|--------------------|------------------|----------|-------|------------|
| Brand route        | Unknown slug     | Y        | Y     | 404        |
| Brand route        | Invalid country  | Y        | Y     | 404        |
| Home ?brand=       | Invalid slug     | Y        | Y     | No modal   |

No critical gaps (no silent failures).

---

## TODOS.md updates (proposed)
1. **Per-brand Open Graph image** — Dynamic opengraph-image for brand route. P2. Deferred from this PR.

---

## Completion summary
- Step 0: Scope accepted; Approach B; minimum set identified.
- Architecture: 0 blocking issues; diagram in review.
- Code quality: DRY and naming guidance; no violations.
- Test review: Diagram produced; test plan artifact written; unit/integration/E2E scoped.
- Performance: No concerns.
- NOT in scope: Written.
- What already exists: Written.
- Failure modes: 0 critical gaps.
- Lake score: Complete option chosen (Approach B with tests and 404).

---

## Review log
Persisted to `~/.gstack/projects/brandwall/main-reviews.jsonl`.
