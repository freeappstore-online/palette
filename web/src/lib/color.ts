/** All color math from scratch — no dependencies. */

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

// ---------------------------------------------------------------------------
// HSL <-> RGB <-> Hex
// ---------------------------------------------------------------------------

/** HSL to RGB. h in [0,360], s,l in [0,100]. Returns r,g,b in [0,255]. */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/** RGB to HSL. r,g,b in [0,255]. Returns h in [0,360], s,l in [0,100]. */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** RGB to 6-char hex (no #). */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/** Hex string (with or without #) to RGB. */
export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace(/^#/, "");
  if (clean.length === 3) {
    const r = parseInt(clean[0]! + clean[0]!, 16);
    const g = parseInt(clean[1]! + clean[1]!, 16);
    const b = parseInt(clean[2]! + clean[2]!, 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb);
}

// ---------------------------------------------------------------------------
// Random color
// ---------------------------------------------------------------------------

export function randomHsl(): HSL {
  return {
    h: Math.floor(Math.random() * 360),
    s: 40 + Math.floor(Math.random() * 45), // 40-84 — vivid but not neon
    l: 35 + Math.floor(Math.random() * 40), // 35-74 — readable range
  };
}

export function randomHex(): string {
  return hslToHex(randomHsl());
}

// ---------------------------------------------------------------------------
// Color harmony
// ---------------------------------------------------------------------------

export type HarmonyMode =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split-complementary"
  | "tetradic"
  | "monochromatic";

function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

export function generateHarmony(base: HSL, mode: HarmonyMode): HSL[] {
  const { h, s, l } = base;
  switch (mode) {
    case "complementary":
      return [base, { h: wrapHue(h + 180), s, l }];
    case "analogous":
      return [
        { h: wrapHue(h - 30), s, l },
        base,
        { h: wrapHue(h + 30), s, l },
      ];
    case "triadic":
      return [base, { h: wrapHue(h + 120), s, l }, { h: wrapHue(h + 240), s, l }];
    case "split-complementary":
      return [base, { h: wrapHue(h + 150), s, l }, { h: wrapHue(h + 210), s, l }];
    case "tetradic":
      return [
        base,
        { h: wrapHue(h + 90), s, l },
        { h: wrapHue(h + 180), s, l },
        { h: wrapHue(h + 270), s, l },
      ];
    case "monochromatic":
      return [
        { h, s, l: Math.max(l - 30, 10) },
        { h, s, l: Math.max(l - 15, 15) },
        base,
        { h, s, l: Math.min(l + 15, 85) },
        { h, s, l: Math.min(l + 30, 95) },
      ];
  }
}

// Pad harmony results to exactly `count` colors by spreading across lightness
export function generateHarmonyPalette(
  base: HSL,
  mode: HarmonyMode,
  count: number,
): HSL[] {
  const raw = generateHarmony(base, mode);
  if (raw.length >= count) return raw.slice(0, count);

  // Fill remaining slots with lightness variations
  const result = [...raw];
  let i = 0;
  while (result.length < count) {
    const src = raw[i % raw.length]!;
    const offset = (Math.floor(i / raw.length) + 1) * 12;
    const newL = i % 2 === 0 ? src.l + offset : src.l - offset;
    result.push({ h: src.h, s: src.s, l: Math.max(10, Math.min(90, newL)) });
    i++;
  }
  return result.slice(0, count);
}

// ---------------------------------------------------------------------------
// WCAG contrast ratio (per WCAG 2.1)
// ---------------------------------------------------------------------------

/** Relative luminance of an sRGB color. */
export function relativeLuminance(rgb: RGB): number {
  const linearize = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

/** Contrast ratio between two colors, always >= 1. */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface WcagResult {
  ratio: number;
  aa: boolean;       // normal text >= 4.5
  aaLarge: boolean;  // large text >= 3
  aaa: boolean;      // normal text >= 7
  aaaLarge: boolean; // large text >= 4.5
}

export function checkContrast(a: RGB, b: RGB): WcagResult {
  const ratio = contrastRatio(a, b);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

// ---------------------------------------------------------------------------
// Color-blindness simulation (daltonization matrices)
// ---------------------------------------------------------------------------

export type ColorBlindnessType = "protanopia" | "deuteranopia" | "tritanopia";

/**
 * Simulate color blindness using the Brettel/Vienot matrices.
 * All transforms operate on linearized sRGB then convert back.
 */
export function simulateColorBlindness(rgb: RGB, type: ColorBlindnessType): RGB {
  const linearize = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const delinearize = (c: number) => {
    const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(s * 255)));
  };

  const lr = linearize(rgb.r);
  const lg = linearize(rgb.g);
  const lb = linearize(rgb.b);

  // Vienot 1999 simulation matrices
  let sr: number, sg: number, sb: number;

  switch (type) {
    case "protanopia":
      sr = 0.56667 * lr + 0.43333 * lg + 0.0 * lb;
      sg = 0.55833 * lr + 0.44167 * lg + 0.0 * lb;
      sb = 0.0 * lr + 0.24167 * lg + 0.75833 * lb;
      break;
    case "deuteranopia":
      sr = 0.625 * lr + 0.375 * lg + 0.0 * lb;
      sg = 0.7 * lr + 0.3 * lg + 0.0 * lb;
      sb = 0.0 * lr + 0.3 * lg + 0.7 * lb;
      break;
    case "tritanopia":
      sr = 0.95 * lr + 0.05 * lg + 0.0 * lb;
      sg = 0.0 * lr + 0.43333 * lg + 0.56667 * lb;
      sb = 0.0 * lr + 0.475 * lg + 0.525 * lb;
      break;
  }

  return { r: delinearize(sr), g: delinearize(sg), b: delinearize(sb) };
}

// ---------------------------------------------------------------------------
// Gradient CSS generation
// ---------------------------------------------------------------------------

export type GradientType = "linear" | "radial";

export function generateGradientCss(
  colors: string[],
  type: GradientType,
  angle: number,
): string {
  const stops = colors
    .map((c, i) => {
      const pct = colors.length === 1 ? 0 : Math.round((i / (colors.length - 1)) * 100);
      return `#${c} ${pct}%`;
    })
    .join(", ");

  if (type === "radial") {
    return `radial-gradient(circle, ${stops})`;
  }
  return `linear-gradient(${angle}deg, ${stops})`;
}

// ---------------------------------------------------------------------------
// Export formats
// ---------------------------------------------------------------------------

export function toCssVariables(hexColors: string[]): string {
  return hexColors
    .map((c, i) => `  --color-${i + 1}: #${c};`)
    .join("\n");
}

export function toTailwindConfig(hexColors: string[]): string {
  const entries = hexColors
    .map((c, i) => `      '${i + 1}': '#${c}',`)
    .join("\n");
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}

export function toJson(hexColors: string[]): string {
  const obj = Object.fromEntries(hexColors.map((c, i) => [`color${i + 1}`, `#${c}`]));
  return JSON.stringify(obj, null, 2);
}

export function toSvgSwatches(hexColors: string[]): string {
  const w = 100;
  const totalW = hexColors.length * w;
  const rects = hexColors
    .map((c, i) => `  <rect x="${i * w}" y="0" width="${w}" height="100" fill="#${c}" />`)
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="100" viewBox="0 0 ${totalW} 100">\n${rects}\n</svg>`;
}

// ---------------------------------------------------------------------------
// Text color for readability on a given background
// ---------------------------------------------------------------------------

export function textColorForBg(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const lum = relativeLuminance(rgb);
  return lum > 0.179 ? "#000000" : "#ffffff";
}
