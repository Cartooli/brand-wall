export const CATEGORIES = [
  "Food & Bev",
  "Fashion",
  "Tech",
  "Wellness",
  "Home",
  "Beauty",
  "Art",
  "Music",
  "Sports",
  "Pets",
  "Gaming",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CAT_COLORS: Record<string, string> = {
  "Food & Bev": "#FF6B35",
  Fashion: "#FF006E",
  Tech: "#3A86FF",
  Wellness: "#06D6A0",
  Home: "#FFBE0B",
  Beauty: "#E63946",
  Art: "#8338EC",
  Music: "#FB5607",
  Sports: "#4CC9F0",
  Pets: "#F72585",
  Gaming: "#00F5D4",
};
