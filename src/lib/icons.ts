import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

import { getInitials, shiftHexColor } from "./utils.js";

const ICONSET_SPECS = [
  { file: "icon_16x16.png", size: 16 },
  { file: "icon_16x16@2x.png", size: 32 },
  { file: "icon_32x32.png", size: 32 },
  { file: "icon_32x32@2x.png", size: 64 },
  { file: "icon_128x128.png", size: 128 },
  { file: "icon_128x128@2x.png", size: 256 },
  { file: "icon_256x256.png", size: 256 },
  { file: "icon_256x256@2x.png", size: 512 },
  { file: "icon_512x512.png", size: 512 },
  { file: "icon_512x512@2x.png", size: 1024 },
] as const;

const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256] as const;

export async function generateIconAssets(targetDir: string, appName: string, themeColor: string): Promise<void> {
  const assetsDir = join(targetDir, "assets");
  const iconsetDir = join(targetDir, "icon.iconset");
  await mkdir(assetsDir, { recursive: true });
  await mkdir(iconsetDir, { recursive: true });

  const svg = createIconSvg(appName, themeColor);
  await writeFile(join(assetsDir, "icon.svg"), svg, "utf8");

  const iconBuffers = new Map<number, Uint8Array>();
  for (const spec of ICONSET_SPECS) {
    const buffer = renderSvgToPng(svg, spec.size);
    iconBuffers.set(spec.size, buffer);
    await writeFile(join(iconsetDir, spec.file), buffer);
  }

  await writeFile(join(assetsDir, "icon.png"), iconBuffers.get(512) ?? renderSvgToPng(svg, 512));

  const icoBuffer = await pngToIco(
    ICO_SIZES.map((size) => Buffer.from(iconBuffers.get(size) ?? renderSvgToPng(svg, size))),
  );
  await writeFile(join(assetsDir, "icon.ico"), icoBuffer);
}

function renderSvgToPng(svg: string, size: number): Uint8Array {
  const rendered = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: size,
    },
  }).render();

  return rendered.asPng();
}

function createIconSvg(appName: string, themeColor: string): string {
  const darkColor = shiftHexColor(themeColor, -28);
  const lightColor = shiftHexColor(themeColor, 42);
  const initials = getInitials(appName);

  return `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="orb" x1="96" y1="64" x2="944" y2="960" gradientUnits="userSpaceOnUse">
      <stop stop-color="${lightColor}" />
      <stop offset="1" stop-color="${darkColor}" />
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 228) rotate(46.8) scale(520 520)">
      <stop stop-color="#FFFFFF" stop-opacity="0.55" />
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="120" y="164" width="784" height="784" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="40" stdDeviation="44" flood-color="#050816" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="1024" height="1024" rx="240" fill="#0D1526" />
  <rect x="92" y="92" width="840" height="840" rx="216" fill="url(#orb)" />
  <rect x="92" y="92" width="840" height="840" rx="216" fill="url(#glow)" />
  <g filter="url(#shadow)">
    <path d="M256 332C256 289.6 290.4 255 332.8 255H691.2C733.6 255 768 289.6 768 332V690.4C768 732.8 733.6 767.2 691.2 767.2H332.8C290.4 767.2 256 732.8 256 690.4V332Z" fill="#07101D" fill-opacity="0.26"/>
    <path d="M320 384C320 348.7 348.7 320 384 320H640C675.3 320 704 348.7 704 384V640C704 675.3 675.3 704 640 704H384C348.7 704 320 675.3 320 640V384Z" fill="#0A1222" fill-opacity="0.24"/>
  </g>
  <circle cx="756" cy="262" r="88" fill="#F3F7FF" fill-opacity="0.16" />
  <circle cx="250" cy="792" r="120" fill="#04101E" fill-opacity="0.2" />
  <text x="512" y="580" text-anchor="middle" font-size="288" font-weight="700" font-family="Avenir Next, Inter, Arial, sans-serif" fill="#F8FBFF">${initials}</text>
</svg>`.trimStart();
}
