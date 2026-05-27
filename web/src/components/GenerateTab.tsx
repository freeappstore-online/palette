import { useState, useEffect, useCallback } from "react";
import { randomHex, type HarmonyMode, generateHarmonyPalette, hexToHsl, hslToHex, randomHsl } from "../lib/color";
import ColorSwatch from "./ColorSwatch";

const HARMONY_MODES: { value: HarmonyMode; label: string }[] = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "split-complementary", label: "Split-complementary" },
  { value: "tetradic", label: "Tetradic" },
  { value: "monochromatic", label: "Monochromatic" },
];

interface Props {
  onCopyHex: (hex: string) => void;
  palette: string[];
  setPalette: (p: string[]) => void;
}

export default function GenerateTab({ onCopyHex, palette, setPalette }: Props) {
  const [locks, setLocks] = useState<boolean[]>([false, false, false, false, false]);
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode | "random">("random");

  const generate = useCallback(() => {
    if (harmonyMode === "random") {
      setPalette(
        palette.map((c, i) => (locks[i] ? c : randomHex())),
      );
    } else {
      const baseHsl = randomHsl();
      const harmony = generateHarmonyPalette(baseHsl, harmonyMode, 5);
      setPalette(
        harmony.map((hsl, i) => (locks[i] ? palette[i]! : hslToHex(hsl))),
      );
    }
  }, [harmonyMode, locks, palette, setPalette]);

  const handleHarmonyFromBase = useCallback(
    (mode: HarmonyMode, baseHex: string) => {
      const baseHsl = hexToHsl(baseHex);
      if (!baseHsl) return;
      const harmony = generateHarmonyPalette(baseHsl, mode, 5);
      setPalette(harmony.map((hsl, i) => (locks[i] ? palette[i]! : hslToHex(hsl))));
    },
    [locks, palette, setPalette],
  );

  // Spacebar = new palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  const toggleLock = (i: number) => {
    setLocks((prev) => prev.map((v, j) => (j === i ? !v : v)));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={harmonyMode}
          onChange={(e) => {
            const mode = e.target.value as HarmonyMode | "random";
            setHarmonyMode(mode);
            if (mode !== "random" && palette[0]) {
              handleHarmonyFromBase(mode, palette[0]);
            }
          }}
          className="rounded-lg border px-3 py-2 text-sm font-medium"
          style={{
            background: "var(--panel)",
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        >
          <option value="random">Random</option>
          {HARMONY_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <button
          onClick={generate}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Generate
        </button>

        <span className="text-xs" style={{ color: "var(--muted)" }}>
          Press Space for a new palette
        </span>
      </div>

      {/* Palette swatches */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {palette.map((hex, i) => (
          <ColorSwatch
            key={i}
            hex={hex}
            locked={locks[i]}
            onToggleLock={() => toggleLock(i)}
            onCopy={() => onCopyHex(hex)}
          />
        ))}
      </div>
    </div>
  );
}
