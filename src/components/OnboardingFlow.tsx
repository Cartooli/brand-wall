"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { CATEGORIES } from "@/data/categories";
import { useLocale } from "@/lib/i18n/context";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export interface OnboardingAnswers {
  countries: string[];
  categories: string[];
  brandName: string;
  brandUrl: string;
  brandCat: string;
  brandCountry: string;
  brandDesc: string;
}

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

const navBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "1px solid #222",
  background: "transparent",
  color: "#888",
  fontFamily: "var(--font-dm-mono)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
};

interface OnboardingFlowProps {
  onComplete: (answers: OnboardingAnswers) => void;
  /** Pre-select when user landed via e.g. /country/georgia (/?country=georgia). */
  initialCountries?: string[];
  initialCategories?: string[];
}

export default function OnboardingFlow({
  onComplete,
  initialCountries = [],
  initialCategories = [],
}: OnboardingFlowProps) {
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    countries: initialCountries,
    categories: initialCategories,
    brandName: "",
    brandUrl: "",
    brandCat: "",
    brandCountry: initialCountries.length === 1 ? initialCountries[0] : "",
    brandDesc: "",
  });
  const [submittedBrand, setSubmittedBrand] = useState(false);

  const steps = [
    {
      title: t("onboarding", "step1_title"),
      subtitle: t("onboarding", "step1_subtitle"),
      type: "multi" as const,
      options: Object.entries(COUNTRIES).map(([k, v]) => ({ key: k, label: `${v.flag} ${v.nameEn}` })),
      field: "countries" as const,
    },
    {
      title: t("onboarding", "step2_title"),
      subtitle: t("onboarding", "step2_subtitle"),
      type: "multi" as const,
      options: CATEGORIES.map((c) => ({ key: c, label: t("categories", c) })),
      field: "categories" as const,
    },
    {
      title: t("onboarding", "step3_title"),
      subtitle: t("onboarding", "step3_subtitle"),
      type: "submit" as const,
    },
  ];

  const current = steps[step];

  const toggle = (field: "countries" | "categories", key: string) => {
    setAnswers((a) => ({
      ...a,
      [field]: a[field].includes(key) ? a[field].filter((k) => k !== key) : [...a[field], key],
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "#050508",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <LanguageSwitcher />
      </div>
      <div style={{ maxWidth: 560, width: "100%", animation: "fadeIn 0.5s ease" }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                height: 3,
                flex: 1,
                borderRadius: 2,
                background: i <= step ? "#E4002B" : "#1a1a1a",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 8,
            letterSpacing: "-0.03em",
          }}
        >
          {current.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 13,
            color: "#555",
            marginBottom: 32,
          }}
        >
          {current.subtitle}
        </div>

        {/* Body */}
        {current.type === "multi" && "options" in current && "field" in current && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {current.options.map((opt) => {
              const selected = answers[current.field].includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => toggle(current.field, opt.key)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: selected ? "1px solid #E4002B" : "1px solid #222",
                    background: selected ? "#E4002B18" : "#0c0c0c",
                    color: selected ? "#E4002B" : "#777",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {current.type === "submit" && !submittedBrand && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                placeholder={t("onboarding", "placeholder_brand_name")}
                value={answers.brandName}
                onChange={(e) => setAnswers((a) => ({ ...a, brandName: e.target.value }))}
                style={inputBaseStyle}
              />
              <input
                type="text"
                placeholder={t("onboarding", "placeholder_url")}
                value={answers.brandUrl}
                onChange={(e) => setAnswers((a) => ({ ...a, brandUrl: e.target.value }))}
                style={inputBaseStyle}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <select
                value={answers.brandCountry}
                onChange={(e) => setAnswers((a) => ({ ...a, brandCountry: e.target.value }))}
                style={selectStyle}
              >
                <option value="">{t("common", "country")}</option>
                {Object.entries(COUNTRIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.flag} {v.nameEn}
                  </option>
                ))}
              </select>
              <select
                value={answers.brandCat}
                onChange={(e) => setAnswers((a) => ({ ...a, brandCat: e.target.value }))}
                style={selectStyle}
              >
                <option value="">{t("common", "category")}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t("categories", c)}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder={t("onboarding", "placeholder_pitch")}
              value={answers.brandDesc}
              onChange={(e) => setAnswers((a) => ({ ...a, brandDesc: e.target.value }))}
              style={{ ...inputBaseStyle, height: 60, resize: "none" }}
            />
            {answers.brandName && (
              <button
                onClick={() => setSubmittedBrand(true)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "#E4002B",
                  color: "#fff",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {t("onboarding", "submit_to_wall")} &rarr;
              </button>
            )}
          </div>
        )}

        {current.type === "submit" && submittedBrand && (
          <div
            style={{
              padding: 24,
              borderRadius: 12,
              border: "1px solid #E4002B33",
              background: "#E4002B08",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>&#10022;</div>
            <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 13, color: "#E4002B", fontWeight: 600 }}>
              {answers.brandName} {t("onboarding", "submitted")}
            </div>
            <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "#555", marginTop: 4 }}>
              {t("onboarding", "curation_review")}
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : null)}
            style={{
              ...navBtnStyle,
              opacity: step === 0 ? 0.3 : 1,
              cursor: step === 0 ? "default" : "pointer",
            }}
          >
            &larr; {t("common", "back")}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onComplete(answers)} style={{ ...navBtnStyle, color: "#555" }}>
              {t("common", "skip")}
            </button>
            <button
              onClick={() => {
                if (step < steps.length - 1) setStep(step + 1);
                else onComplete(answers);
              }}
              style={{
                ...navBtnStyle,
                background: "#E4002B",
                color: "#fff",
                border: "1px solid #E4002B",
              }}
            >
              {step === steps.length - 1 ? `${t("onboarding", "enter_wall")} \u2192` : `${t("common", "next")} \u2192`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
