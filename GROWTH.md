# Growth & cold start: Georgia (ka) first

Tactics to quickly grow coverage and usage in the starting market — **Georgia (country)** — and to make sharing, referral, and virality loops effective.

---

## 1. Cold start: what we did on the product

- **Favicon & OG image** — `app/icon.tsx` and `app/opengraph-image.tsx` so every link (Facebook, WhatsApp, Telegram, etc.) shows a clear card with “The Brand Wall” and “Featured: Georgia”.
- **Full metadata** — `og:title`, `og:description`, `twitter:card`, `twitter:title`, `twitter:description` so crawlers and shares look correct in all locales.
- **Native sharing** — ShareButton uses Web Share API when available (mobile), else “Copy link”. Used in:
  - **Georgia hero**: “Share Georgia’s wall” → `?country=georgia` so shared links open on Georgia.
  - **Brand modal**: “Share this brand” → share text + `?country=<country>`.
  - **After submit**: “Share that you submitted” → pre-filled text + homepage link (referral loop).
- **Deep links** — `?country=georgia` (and other country keys) set the active country on load so shared links land on the right view.
- **No breaking changes** — All of the above is additive; existing flows and UI are unchanged.

---

## 2. Cold start: Georgia (ka) on the site

- **Lead with Georgia** — Georgia is the only `featured` country and appears first in nav and in the hero.
- **Hero copy** — EN/KA copy highlights: 24+ brands, $180M VC 2024, 1,500+ startups, 8,000 years of winemaking, qvevri → gaming unicorns.
- **Share Georgia’s wall** — One tap to share a link that opens directly on Georgia; pre-filled share text in EN/KA.
- **Submit + share** — After “Submit a brand”, we prompt “Share that you submitted” so submitters become referrers.

---

## 3. Facebook (and social) for Georgia

- **Post format**  
  - Short hook (e.g. “24 Georgian brands on one wall.”).  
  - One or two concrete stats (e.g. $180M VC 2024, 1,500+ startups).  
  - CTA: “Explore Georgia →” with link `https://www.brandwall.online/?country=georgia`.  
  - Optional: one hero image (use the same look as `opengraph-image`: dark gradient, “The Brand Wall”, “Featured: Georgia”).

- **Audience**  
  - Georgia-focused: Tbilisi, startups, tech, wine, tourism, expats.  
  - Interest targeting: Georgian startups, Caucasus tech, Georgian wine, Tbilisi.

- **Content angles**  
  - “From Spribe to Binekhi: 24 Georgian brands on The Brand Wall.”  
  - “$180M in VC in 2024. See who’s building in Georgia.”  
  - “Know a Georgian brand that should be on the wall? Submit it — and share after.”

- **Frequency**  
  - 2–3 posts per week to start.  
  - Reuse the same CTA link so every share benefits from the same OG card and deep link.

- **Paid (optional)**  
  - Small budget on Meta (Facebook/Instagram) with geo = Georgia (and optionally Armenia, Azerbaijan, expat Georgians abroad).  
  - Creative = OG image or a simple “Georgia” card; caption = one of the angles above; link = `?country=georgia`.

---

## 4. Virality and referral loops (current)

| Loop | Trigger | Action | Outcome |
|------|--------|--------|--------|
| **Share Georgia** | User on Georgia hero | Clicks “Share Georgia’s wall” | Friend gets link with `?country=georgia` → lands on Georgia |
| **Share brand** | User opens a brand modal | Clicks “Share this brand” | Friend gets brand name + link with `?country=...` |
| **Share after submit** | User submits a brand | Clicks “Share that you submitted” | Friend gets “I submitted to The Wall” + homepage link |

All shares use the same canonical domain and OG image so every paste looks consistent and on-brand.

---

## 5. Gamification (light, no backend)

- **Copy-only** (already in place): “Live · X brands indexed · Y countries” in the header gives a sense of scale.
- **Possible next steps** (optional, no breaking changes):  
  - “You explored N countries” after switching countries a few times (client-only state).  
  - “X brands discovered” in session (count of distinct brand modals opened).  
  - Badge-style line under the hero: “Be the first to share Georgia’s wall today” (resets daily via client date).

These can be added later without changing existing behavior.

---

## 6. Checklist: sharing and discovery

- [x] Favicon (`/icon`) — pixel-style, on-brand.
- [x] OG image (`/opengraph-image`) — 1200×630, title + tagline + “Featured: Georgia”.
- [x] `og:title`, `og:description`, `twitter:*` in layout.
- [x] ShareButton with Web Share + copy fallback.
- [x] Share from Georgia hero, brand modal, and post-submit.
- [x] Deep link `?country=...` for shared URLs.
- [x] EN + KA strings for all share CTAs.

---

## 7. What to measure

- **Traffic**: Visits to `/?country=georgia` (and other `?country=` values) to see share/referral effectiveness.
- **Submissions**: Submissions with country = Georgia (and “Share that you submitted” clicks if you add a simple event).
- **Social**: Facebook/Instagram reach and link clicks for Georgia-focused posts.

Use UTM on paid and key posts if needed, e.g. `?country=georgia&utm_source=facebook&utm_medium=social&utm_campaign=georgia_launch`.
