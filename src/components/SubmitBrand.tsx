"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { CATEGORIES } from "@/data/categories";

const inputBaseStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #222",
  background: "#0c0c0c",
  color: "#fff",
  fontFamily: "var(--font-dm-mono)",
  fontSize: 12,
  outline: "none",
  flex: 1,
};

const selectStyle: React.CSSProperties = {
  ...inputBaseStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

export default function SubmitBrand() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", country: "", cat: "", desc: "" });

  if (submitted)
    return (
      <div
        style={{
          padding: 20,
          borderRadius: 12,
          border: "1px dashed #E4002B33",
          background: "#E4002B06",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "#E4002B" }}>
          &#10022; {form.name} submitted for curation
        </div>
      </div>
    );

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          padding: 20,
          borderRadius: 12,
          border: "1px dashed #222",
          background: "#0a0a0a",
          color: "#444",
          fontFamily: "var(--font-dm-mono)",
          fontSize: 12,
          cursor: "pointer",
          transition: "all 0.2s",
          textAlign: "center",
        }}
      >
        + Submit a brand to The Wall
      </button>
    );

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid #1a1a1a",
        background: "#0a0a0a",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 14,
        }}
      >
        Add a brand
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Brand name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={inputBaseStyle}
          />
          <input
            type="text"
            placeholder="URL"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            style={inputBaseStyle}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            style={selectStyle}
          >
            <option value="">Country</option>
            {Object.entries(COUNTRIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.flag} {v.nameEn}
              </option>
            ))}
          </select>
          <select
            value={form.cat}
            onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}
            style={selectStyle}
          >
            <option value="">Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="One-line pitch..."
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          style={{ ...inputBaseStyle, height: 48, resize: "none" }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #222",
              background: "transparent",
              color: "#888",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          {form.name && (
            <button
              onClick={() => setSubmitted(true)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #E4002B",
                background: "#E4002B",
                color: "#fff",
                fontFamily: "var(--font-dm-mono)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Submit &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
