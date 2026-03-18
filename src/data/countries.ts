export interface Country {
  name: string;
  nameEn: string;
  flag: string;
  accent: string;
  bg: string;
  code: string;
  featured?: boolean;
}

export const COUNTRIES: Record<string, Country> = {
  georgia: { name: "\u10E1\u10D0\u10E5\u10D0\u10E0\u10D7\u10D5\u10D4\u10DA\u10DD", nameEn: "Georgia", flag: "\u{1F1EC}\u{1F1EA}", accent: "#E4002B", bg: "#0D0A1A", code: "ka", featured: true },
  usa: { name: "United States", nameEn: "United States", flag: "\u{1F1FA}\u{1F1F8}", accent: "#E63946", bg: "#0D1B2A", code: "en" },
  japan: { name: "\u65E5\u672C", nameEn: "Japan", flag: "\u{1F1EF}\u{1F1F5}", accent: "#FF006E", bg: "#1A0A2E", code: "ja" },
  uk: { name: "United Kingdom", nameEn: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", accent: "#3A86FF", bg: "#0B132B", code: "en" },
  mexico: { name: "M\u00E9xico", nameEn: "Mexico", flag: "\u{1F1F2}\u{1F1FD}", accent: "#06D6A0", bg: "#0A1628", code: "es" },
  korea: { name: "\uB300\uD55C\uBBFC\uAD6D", nameEn: "South Korea", flag: "\u{1F1F0}\u{1F1F7}", accent: "#8338EC", bg: "#110A1F", code: "ko" },
  nigeria: { name: "Nigeria", nameEn: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", accent: "#FFBE0B", bg: "#1A1A0A", code: "en" },
  brazil: { name: "Brasil", nameEn: "Brazil", flag: "\u{1F1E7}\u{1F1F7}", accent: "#FB5607", bg: "#1B0E05", code: "pt" },
  germany: { name: "Deutschland", nameEn: "Germany", flag: "\u{1F1E9}\u{1F1EA}", accent: "#FF006E", bg: "#0D0D1A", code: "de" },
  india: { name: "\u092D\u093E\u0930\u0924", nameEn: "India", flag: "\u{1F1EE}\u{1F1F3}", accent: "#F77F00", bg: "#1A0F05", code: "hi" },
  france: { name: "France", nameEn: "France", flag: "\u{1F1EB}\u{1F1F7}", accent: "#4361EE", bg: "#0A0E1F", code: "fr" },
};
