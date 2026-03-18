import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/data/countries";
import { BRANDS } from "@/data/brands";
import { toSlug } from "@/data/slugs";

const BASE = "https://www.brandwall.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/submit`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  for (const country of Object.keys(COUNTRIES)) {
    urls.push({
      url: `${BASE}/country/${country}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const [country, brands] of Object.entries(BRANDS)) {
    for (const brand of brands) {
      urls.push({
        url: `${BASE}/${country}/${toSlug(brand.name)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return urls;
}
