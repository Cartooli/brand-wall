# Design Plan Review: Brand page as shareable landing

**Plan:** `docs/designs/brand-page-as-landing.md`  
**Branch:** main  
**Date:** 2026-03-18

---

## PRE-REVIEW SYSTEM AUDIT
- **UI scope:** New route `[country]/[slug]`, homepage query handling, BrandModal share URL, metadata. Design scope: yes.
- **DESIGN.md:** None. Review calibrated to existing codebase patterns and universal design principles.
- **Existing patterns:** BrandModal (dark card, accent bar, tags, Visit CTA, ShareButton), wall grid, URLBar, CountryNav — all reused; no new components.

---

## Step 0: Design Scope Assessment

### 0A. Initial Design Rating
**6/10** — Plan specified hierarchy and states at a high level but lacked: interaction state table, explicit 404 treatment, user journey storyboard, responsive/a11y specifics, and unresolved decisions (404 layout, URL shape). A 10 would have all states specified per feature, 404 copy and recovery, and a11y notes for modal/share.

### 0B. DESIGN.md Status
No design system found. Proceeding with universal design principles and alignment to existing Brand Wall UI (BrandModal, wall, ShareButton).

### 0C. Existing Design Leverage
- Reuse: BrandModal (layout, typography, CTAs), ShareButton, wall grid, URLBar, CountryNav. No new layout or component library.
- Slug and metadata are non-visual; only “what’s on screen” for brand route = existing wall + existing modal.

### 0D. Focus Areas
Full 7 passes applied to bring plan to design-complete. Gaps addressed in Passes 1–7 and written into plan Section 6.

---

## Pass 1: Information Architecture — 6/10 → 8/10
- **Gap:** Plan did not diagram what the user sees first, second, third on the brand route.
- **Fix:** Added Section 6.1: brand route = wall (country) + modal (brand) with primary CTA “Visit site,” secondary Share/Close. ASCII diagram added.
- **Re-rate:** 8/10 — IA clear; mobile nav order already defined by existing layout.

---

## Pass 2: Interaction State Coverage — 5/10 → 8/10
- **Gap:** No table for loading/empty/error/success/partial per feature.
- **Fix:** Added Section 6.2: table for Brand route, Home ?brand=, Share. Specified 404 as error state with “Brand not found” + link to country wall.
- **Re-rate:** 8/10 — All states covered; empty for brand route is N/A (404 covers “no brand”).

---

## Pass 3: User Journey & Emotional Arc — 5/10 → 8/10
- **Gap:** No storyboard of user steps and feelings.
- **Fix:** Added Section 6.3: 4-step journey (click link → see modal → visit or close → explore). Emotional arc: curious → oriented → action.
- **Re-rate:** 8/10 — Journey is simple; no multi-screen flow.

---

## Pass 4: AI Slop Risk — 7/10 → 8/10
- **Gap:** “Reuse modal” could still lead to generic hero or card if interpreted loosely.
- **Fix:** Added Section 6.4: Explicit “no new hero, cards, or generic landing.” Brand route = same UI as home with pre-selected state. Metadata specific: “Spribe on The Brand Wall.”
- **Re-rate:** 8/10 — Intent is specific.

---

## Pass 5: Design System Alignment — 6/10 → 8/10
- **Gap:** No DESIGN.md to align to.
- **Fix:** Added Section 6.5: Use existing fonts (DM Mono, Newsreader), background #050508, existing modal and ShareButton. No new tokens.
- **Re-rate:** 8/10 — Aligned to current codebase.

---

## Pass 6: Responsive & Accessibility — 5/10 → 8/10
- **Gap:** “Reuse existing” was vague; no a11y callouts.
- **Fix:** Added Section 6.6: Same breakpoints as home; modal padding/maxWidth already responsive. A11y: verify modal focus trap and escape; ShareButton already has fallback; 404 link focusable and visible focus style.
- **Re-rate:** 8/10 — Responsive and a11y specified at plan level; implementation can verify.

---

## Pass 7: Unresolved Design Decisions — 2 resolved
- **404 layout:** Resolved — minimal custom “Brand not found” + link to country wall (not default Next 404 only).
- **URL shape:** Resolved — `/[country]/[slug]` confirmed; no `/b/[slug]`.

---

## NOT in scope
- New design system or DESIGN.md.
- Standalone brand-only page layout.
- Per-brand custom imagery or OG creative.
- New breakpoints or a11y tooling beyond verification of existing patterns.

---

## What already exists
- BrandModal, ShareButton, wall grid, URLBar, CountryNav — all reused.
- Dark theme, typography, spacing — no new design tokens.

---

## TODOS.md updates (design)
- None required. Per-brand OG image already deferred in CEO/Eng reviews (product/eng TODO).

---

## Completion Summary

| Item                | Result |
|---------------------|--------|
| System audit        | No DESIGN.md; UI scope confirmed |
| Step 0              | Initial 6/10; full 7 passes |
| Pass 1 (IA)         | 6/10 → 8/10 |
| Pass 2 (States)     | 5/10 → 8/10 |
| Pass 3 (Journey)    | 5/10 → 8/10 |
| Pass 4 (AI Slop)    | 7/10 → 8/10 |
| Pass 5 (Design sys) | 6/10 → 8/10 |
| Pass 6 (Responsive) | 5/10 → 8/10 |
| Pass 7 (Decisions)  | 2 resolved |
| NOT in scope       | Written |
| What already exists| Written |
| Decisions made     | Added to plan Section 6 |
| Overall design score | 6/10 → 8/10 |

**Verdict:** Plan is design-complete for implementation. Run `/design-review` after implementation for visual QA.

---

## Review Log
Persisted to `~/.gstack/projects/brandwall/main-reviews.jsonl`.
