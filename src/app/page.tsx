"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Brand, BRANDS, SIZE_MAP } from "@/data/brands";
import { COUNTRIES } from "@/data/countries";
import { useLocale } from "@/lib/i18n/context";
import OnboardingFlow, { OnboardingAnswers } from "@/components/OnboardingFlow";
import CountryNav from "@/components/CountryNav";
import FilterBar from "@/components/FilterBar";
import GeorgiaHero from "@/components/GeorgiaHero";
import BrandBlock from "@/components/BrandBlock";
import BrandModal from "@/components/BrandModal";
import Stats from "@/components/Stats";
import URLBar from "@/components/URLBar";
import SubmitBrand from "@/components/SubmitBrand";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const VALID_COUNTRIES = new Set(Object.keys(COUNTRIES));

type BrandWithCountry = Brand & { country: string };

function HomeContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeCountry, setActiveCountry] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<BrandWithCountry | null>(null);
  const [search, setSearch] = useState("");

  // Deep-link: ?country=georgia (or other) opens with that country selected (referral/share links)
  useEffect(() => {
    const country = searchParams.get("country");
    if (country && VALID_COUNTRIES.has(country)) {
      setActiveCountry(country);
    }
  }, [searchParams]);

  const handleOnboardingComplete = (answers: OnboardingAnswers) => {
    setShowOnboarding(false);
    if (answers.countries?.length === 1) setActiveCountry(answers.countries[0]);
    if (answers.categories?.length === 1) setActiveCat(answers.categories[0]);
  };

  const brands = useMemo(() => {
    let result: BrandWithCountry[] = [];
    const countries = activeCountry === "all" ? Object.keys(BRANDS) : [activeCountry];
    countries.forEach((c) => {
      (BRANDS[c] || []).forEach((b) => result.push({ ...b, country: c }));
    });
    if (activeCat !== "all") result = result.filter((b) => b.cat === activeCat);
    if (search)
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.desc.toLowerCase().includes(search.toLowerCase()) ||
          b.cat.toLowerCase().includes(search.toLowerCase())
      );
    result.sort((a, b) => SIZE_MAP[b.size] - SIZE_MAP[a.size]);
    return result;
  }, [activeCountry, activeCat, search]);

  const cellSize = 38;

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const countryCount = Object.keys(COUNTRIES).length;
  const brandCount = Object.values(BRANDS).flat().length;

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff" }}>
      <div style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#06D6A0",
                animation: "pulseGlow 2s ease infinite",
                boxShadow: "0 0 10px #06D6A066",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#06D6A0",
              }}
            >
              {t("landing", "live")} &middot; {brandCount} {t("landing", "brands_indexed")} &middot;{" "}
              {countryCount} {t("landing", "countries")}
            </span>
          </div>
          <LanguageSwitcher />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginBottom: 8,
          }}
        >
          {t("landing", "title")}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 13,
            color: "#555",
            maxWidth: 520,
            lineHeight: 1.55,
            marginBottom: 24,
          }}
        >
          {t("landing", "subtitle").replace("{count}", String(countryCount))}
        </p>

        <URLBar activeCountry={activeCountry} />

        <CountryNav activeCountry={activeCountry} onSelect={setActiveCountry} />

        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <FilterBar activeCat={activeCat} onSelect={setActiveCat} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("common", "search")}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #1a1a1a",
              background: "#0c0c0c",
              color: "#fff",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 12,
              outline: "none",
              width: 140,
            }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <Stats brands={brands} country={activeCountry} />
        </div>
      </div>

      <div style={{ padding: "24px 24px 16px", maxWidth: 1200, margin: "0 auto" }}>
        {(activeCountry === "all" || activeCountry === "georgia") && (
          <GeorgiaHero onExplore={() => setActiveCountry("georgia")} />
        )}

        {brands.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#333",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 13,
            }}
          >
            {t("landing", "no_brands")}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
              gap: 3,
            }}
          >
            {brands.map((brand, i) => (
              <BrandBlock
                key={`${brand.country}-${brand.name}`}
                brand={brand}
                cellSize={cellSize}
                delay={Math.min(i * 15, 600)}
                onClick={setSelectedBrand}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <SubmitBrand />
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #111", padding: 24, textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 8,
            color: "#282828",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          {t("landing", "footer_inspired")} &middot; {t("landing", "footer_pixel")} &middot;{" "}
          {new Date().getFullYear()}
        </div>
      </div>

      <BrandModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  );
}

function HomeFallback() {
  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff" }}>
      <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto", fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "#444" }}>
        Loading…
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
