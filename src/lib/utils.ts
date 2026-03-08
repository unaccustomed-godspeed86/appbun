import { existsSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";

export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (!slug) {
    return "appbun-app";
  }

  return /^\d/.test(slug) ? `appbun-${slug}` : slug;
}

export function toTitleCase(input: string): string {
  return input
    .split(/[\s.-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function deriveNameFromUrl(rawUrl: string): string {
  const { hostname } = new URL(rawUrl);
  const host = hostname.replace(/^www\./, "");
  const firstLabel = host.split(".")[0] ?? host;
  return toTitleCase(firstLabel);
}

export function deriveIdentifier(rawUrl: string, fallbackSlug: string): string {
  const { hostname } = new URL(rawUrl);
  const parts = hostname
    .replace(/^www\./, "")
    .split(".")
    .filter(Boolean)
    .map((part) => part.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .reverse();

  const slugPart = fallbackSlug.replace(/-/g, "").toLowerCase();
  const uniqueParts = [...parts];
  if (!uniqueParts.includes(slugPart)) {
    uniqueParts.push(slugPart || "appbun");
  }

  return uniqueParts.join(".");
}

export function normalizeHexColor(color?: string): string | undefined {
  if (!color) {
    return undefined;
  }

  const trimmed = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return undefined;
}

export function deriveThemeColor(seed: string): string {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  const hue = hash % 360;
  return hslToHex(hue, 68, 44);
}

export function hslToHex(h: number, s: number, l: number): string {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hueSection = h / 60;
  const x = chroma * (1 - Math.abs((hueSection % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hueSection >= 0 && hueSection < 1) {
    red = chroma;
    green = x;
  } else if (hueSection >= 1 && hueSection < 2) {
    red = x;
    green = chroma;
  } else if (hueSection >= 2 && hueSection < 3) {
    green = chroma;
    blue = x;
  } else if (hueSection >= 3 && hueSection < 4) {
    green = x;
    blue = chroma;
  } else if (hueSection >= 4 && hueSection < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = lightness - chroma / 2;
  const toHex = (value: number) => Math.round((value + match) * 255).toString(16).padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

export function shiftHexColor(hex: string, amount: number): string {
  const normalized = normalizeHexColor(hex) ?? "#2563eb";
  const r = clamp(parseInt(normalized.slice(1, 3), 16) + amount, 0, 255);
  const g = clamp(parseInt(normalized.slice(3, 5), 16) + amount, 0, 255);
  const b = clamp(parseInt(normalized.slice(5, 7), 16) + amount, 0, 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ensureSafeOutputDirectory(target: string): string {
  const resolved = resolve(target);
  if (!existsSync(resolved)) {
    return resolved;
  }

  const entries = readdirSync(resolved).filter((entry) => entry !== ".DS_Store");
  if (entries.length > 0) {
    throw new Error(`Refusing to write into non-empty directory: ${resolved}`);
  }

  return resolved;
}

export function prettyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function escapeTemplateLiteral(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

export function getInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "AB";
  }

  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }

  return `${words[0]![0] ?? "A"}${words[1]![0] ?? "B"}`.toUpperCase();
}

export function displayPath(target: string): string {
  return basename(target) === target ? target : resolve(target);
}
