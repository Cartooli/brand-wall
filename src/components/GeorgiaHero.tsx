"use client";

interface GeorgiaHeroProps {
  onExplore: () => void;
}

export default function GeorgiaHero({ onExplore }: GeorgiaHeroProps) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        padding: "36px 28px",
        marginBottom: 28,
        background: "linear-gradient(135deg, #1a0008 0%, #0D0A1A 40%, #0a0a18 100%)",
        border: "1px solid #E4002B22",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: `radial-gradient(circle at 20% 50%, #E4002B 1px, transparent 1px),
                            radial-gradient(circle at 80% 30%, #E4002B 1px, transparent 1px),
                            radial-gradient(circle at 60% 80%, #E4002B 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 80px 80px, 45px 45px",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#E4002B",
              boxShadow: "0 0 12px #E4002B88",
              animation: "pulseGlow 2s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#E4002B",
            }}
          >
            Featured Country &middot; {"\u10E1\u10D0\u10E5\u10D0\u10E0\u10D7\u10D5\u10D4\u10DA\u10DD"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#E4002B" }}>Georgia</span> {"\u{1F1EC}\u{1F1EA}"}
            </div>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 12,
                color: "#666",
                lineHeight: 1.6,
                maxWidth: 420,
              }}
            >
              8,000 years of winemaking. Tbilisi&apos;s tech ecosystem raised a record $180M in 2024. From qvevri cellars to
              crash-game unicorns &mdash; the Caucasus is building.
            </p>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {[
              { n: "24", l: "Brands" },
              { n: "$180M", l: "VC 2024" },
              { n: "1,500+", l: "Startups" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: 22,
                    color: "#E4002B",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: 8,
                    color: "#444",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 3,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onExplore}
          style={{
            marginTop: 20,
            padding: "11px 24px",
            borderRadius: 8,
            border: "1px solid #E4002B",
            background: "#E4002B18",
            color: "#E4002B",
            fontFamily: "var(--font-dm-mono)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            transition: "all 0.2s",
          }}
        >
          Explore /country/georgia &rarr;
        </button>
      </div>
    </div>
  );
}
