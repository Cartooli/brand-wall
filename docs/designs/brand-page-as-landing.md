# Brand page as shareable landing

**Goal:** Let a new brand use a **single shareable link** that opens their “page” and drives traffic to them, so Brand Wall can act as a lightweight webpage substitute (no per-brand site required).

**Out of scope for this PR:** Full CMS, custom branding per brand, auth, or backend persistence changes. In scope: **routes + deep link + metadata only**, reusing existing static brand data.

---

## 1. User stories

- As a **brand**, I can share a link that opens **my** card (or a page about me) so recipients see me first, not the whole country wall.
- As a **recipient**, I open the link and land on that brand (modal open or dedicated view), then I can visit the brand’s site or explore the wall.
- As a **sharer**, when I paste the link in social/DMs, the preview shows the **brand name and description**, not the generic “The Brand Wall” card.

---

## 2. Scope (tight)

| Deliverable | Detail |
|-------------|--------|
| **Per-brand URL** | One canonical URL per brand, e.g. `/[country]/[slug]` or `/b/[slug]` (slug from `name`: lowercase, hyphenated, unique per country). |
| **Route behavior** | Visiting the URL shows the main wall with **that country** selected and **that brand’s modal open** (or a minimal standalone “brand page” that reuses the modal content + CTA to real site). No new data model — resolve slug from existing `BRANDS` + country. |
| **Share link** | “Share this brand” uses the **brand URL** (e.g. `https://www.brandwall.online/b/spribe` or `https://www.brandwall.online/georgia/spribe`), not `?country=georgia`. |
| **Deep link** | Existing `?country=georgia` continues to work; add `?brand=spribe` (or equivalent) so homepage can open with that brand’s modal open. Brand route is canonical; query param is optional for backwards compatibility. |
| **Per-brand metadata** | For the brand route: dynamic `generateMetadata` (or equivalent) — `title`, `description`, `og:image` (optional: reuse site OG or simple per-brand OG). So shared links show brand name + one-line description in unfurls. |
| **Slug derivation** | Slug from `brand.name`: normalize (lowercase, replace spaces/special with `-`), ensure uniqueness per country (e.g. append index or id if collision). No new fields in data if we derive slug at runtime. |

### Explicitly out of scope

- New backend or DB; new admin UI; custom OG image per brand; auth; analytics; A/B tests; i18n string changes beyond any new UI for “Share” or “Open on wall”.

---

## 3. Implementation approaches

**Approach A — Minimal (query + modal only)**  
- No new route. Add `?brand=spribe` (and optionally `?country=georgia`). Homepage reads it and opens that brand’s modal. Share URL stays `?country=...&brand=...`.  
- **Pros:** Smallest diff, no new pages. **Cons:** No per-brand URL, no per-brand metadata/OG, weak as “webpage substitute.”

**Approach B — Brand route + modal (recommended)**  
- New route: `/[country]/[slug]` (e.g. `/georgia/spribe`). Page: layout + country filter + open that brand’s modal (same `BrandModal` as today). Share link = brand URL. `generateMetadata` for that route returns brand name + description.  
- **Pros:** Shareable brand URL, good SEO/unfurls, minimal new UI (reuse modal). **Cons:** Need slug→brand resolution and 404 for unknown slug.

**Approach C — Brand route + standalone page**  
- Same as B but a dedicated “brand page” layout (no full wall grid), then CTA to “Visit site” and “Explore wall.”  
- **Pros:** Feels most like “their” page. **Cons:** More UI and layout work; can be a follow-up.

**Recommendation:** **B** for this PR — brand URL + modal + metadata. Gets “shareable link that drives traffic to the brand” and “substitute for a webpage” without a big scope increase.

---

## 4. Files likely touched

- **New:** `src/app/[country]/[slug]/page.tsx` (and optional `layout.tsx` if needed).
- **New:** `src/data/slugs.ts` or equivalent: `getBrandByCountrySlug(country, slug)` (and slug generation from `brand.name`), or inlined in the page.
- **Modified:** `src/components/BrandModal.tsx` — share URL = brand URL.
- **Modified:** `src/app/page.tsx` — read `brand` from query, open modal on load when present.
- **Modified:** `src/app/[country]/[slug]/page.tsx` — `generateMetadata` for dynamic OG/title/description.
- Optional: `src/app/[country]/[slug]/opengraph-image.tsx` for per-brand OG image (or defer).

No new API routes, no DB, no new dependencies if slug is derived from existing data.

---

## 5. Design scope

- **Information hierarchy:** Brand route: brand first (modal or hero), then “Visit site” and “Explore the wall.”
- **States:** Loading (resolving slug), Found (modal open), Not found (404 or redirect to country wall).
- **Empty/error:** Unknown or invalid slug → 404 or redirect to `/?country=xyz` with message.
- **Responsive/a11y:** Reuse existing modal and wall patterns; no new breakpoints.

---

## 6. Design decisions (from plan-design-review)

*No DESIGN.md in repo; decisions align with existing Brand Wall patterns and universal design principles.*

### 6.1 Information architecture
- **Brand route:** First: wall with correct country; overlaying it: brand modal (same component as today). Second: “Visit {brand}” CTA. Third: “Share this brand” and close. No new nav or chrome.
- **Homepage with ?brand=:** Same as today; only initial state includes selectedBrand so modal opens on load. Hierarchy unchanged.

```
  [Brand route GET /country/slug]
       │
       ▼
  ┌─────────────────────────────────────┐
  │  Wall (country selected)             │
  │  ┌─────────────────────────────┐    │
  │  │  Brand modal (open)         │    │
  │  │  Primary: Visit site        │    │
  │  │  Secondary: Share, Close    │    │
  │  └─────────────────────────────┘    │
  └─────────────────────────────────────┘
```

### 6.2 Interaction state coverage
| Feature           | LOADING      | EMPTY        | ERROR        | SUCCESS              | PARTIAL |
|-------------------|-------------|--------------|--------------|----------------------|---------|
| Brand route       | Sync resolve; no spinner | N/A   | 404 page    | Wall + modal open    | N/A     |
| Home ?brand=      | Same as home | Invalid slug → no modal | N/A   | Modal open for brand | N/A     |
| Share brand       | N/A         | N/A          | Copy fallback| Link copied / shared | N/A     |

- **404:** Use Next.js default 404 or a minimal custom page: “Brand not found” + link to country wall (e.g. “Explore Georgia →”). No generic “Not found” without context.

### 6.3 User journey
| Step | User does        | User feels        | Plan specifies? |
|------|------------------|-------------------|-----------------|
| 1    | Clicks shared brand link | Curious           | Land on wall + modal for that brand |
| 2    | Sees modal       | “This is the brand” | Same modal as today; brand name, desc, Visit CTA |
| 3    | Clicks Visit     | Leaves to brand site | Existing behavior |
| 4    | Closes modal     | Sees wall         | Explore other brands (existing) |

### 6.4 AI slop risk
- **Mitigation:** Reuse existing BrandModal and wall; no new hero, cards, or generic “landing” layout. Brand route is the same UI as homepage with pre-selected country and open modal. Specific: “Spribe on The Brand Wall” in metadata, not “Discover brands.”

### 6.5 Design system alignment
- No DESIGN.md. Use existing: DM Mono, Newsreader, dark background (#050508), modal styling from BrandModal, existing ShareButton and URLBar. No new tokens or components.

### 6.6 Responsive & accessibility
- **Responsive:** Brand route renders same layout as home (existing breakpoints). Modal already responsive (padding 20, maxWidth 500). No new breakpoints.
- **A11y:** Reuse modal focus trap and escape-to-close (verify existing behavior). Share button: existing ShareButton (Web Share API + copy fallback). 404: ensure link to country wall is focusable and has visible focus style.

### 6.7 Unresolved design decisions
- **404 layout:** Use Next.js default or minimal custom (recommend: custom “Brand not found” + link to country). Decision: implement minimal custom for brand route 404 so user can recover to wall.
- **URL shape:** `/[country]/[slug]` (e.g. `/georgia/spribe`) confirmed; no `/b/[slug]` to avoid global slug collisions.

---

## 7. Success criteria

- Every brand has a stable, shareable URL.
- Sharing that URL shows brand name and description in link previews.
- Visiting the URL lands the user on that brand (modal open) with one click to the brand’s real site or to explore the wall.
