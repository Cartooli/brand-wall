import { CAT_COLORS } from "./categories";

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateColor(name: string, cat: string): string {
  const base = CAT_COLORS[cat] || "#888888";
  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);
  const rand = seededRandom(name.charCodeAt(0) * 100 + name.length * 7);
  const shift = Math.floor(rand() * 30) - 15;
  return `rgb(${Math.min(255, Math.max(30, r + shift))}, ${Math.min(255, Math.max(30, g + shift))}, ${Math.min(255, Math.max(30, b + shift))})`;
}
