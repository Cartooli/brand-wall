import { ImageResponse } from "next/og";

export const alt = "The Brand Wall — A pixel mosaic of indie brands from 11 countries. Every block is a brand. Every path is a country.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050508 0%, #0D0A1A 50%, #1a0008 100%)",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              background: "#E4002B",
              borderRadius: 4,
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: "#E4002B",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Featured: Georgia 🇬🇪
          </span>
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: "#fff",
            margin: 0,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          The Brand Wall
        </h1>
        <p
          style={{
            fontSize: 24,
            color: "#888",
            marginTop: 16,
            textAlign: "center",
            maxWidth: 800,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.4,
          }}
        >
          A pixel mosaic of indie brands from 11 countries. Every block is a brand. Every path is a country.
        </p>
        <p
          style={{
            fontSize: 18,
            color: "#555",
            marginTop: 32,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          brandwall.online
        </p>
      </div>
    ),
    { ...size }
  );
}
