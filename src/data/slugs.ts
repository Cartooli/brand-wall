import { Brand, BRANDS } from "@/data/brands";
import { COUNTRIES } from "@/data/countries";

const CANONICAL_BASE = "https://www.brandwall.online";

/**
 * Normalize brand name to URL slug: lowercase, replace non-alphanumeric with hyphen.
 * Collapses multiple hyphens and trims. First match wins per country for lookups.
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") || "brand";
}

/**
 * Resolve country + slug to brand. Returns null if country invalid or slug not found.
 * Uses first brand in country that matches slug (stable order from BRANDS).
 */
export function getBrandByCountrySlug(
  country: string,
  slug: string
): (Brand & { country: string }) | null {
  const c = country.toLowerCase();
  if (!COUNTRIES[c] || !BRANDS[c]) return null;
  const normalized = slug.toLowerCase().trim();
  if (!normalized) return null;
  for (const brand of BRANDS[c]) {
    if (toSlug(brand.name) === normalized) {
      return { ...brand, country: c };
    }
  }
  return null;
}

/**
 * Canonical URL for a brand's shareable page.
 */
export function brandPageUrl(country: string, brand: Brand): string {
  const slug = toSlug(brand.name);
  return `${CANONICAL_BASE}/${country.toLowerCase()}/${slug}`;
}
