import { useState, useCallback } from "react";
import { hslToHex, hslToRgb, hexToHsl, hexToRgb, type HSL } from "../lib/color";
import { textColorForBg } from "../lib/color";

interface Props {
  onCopyHex: (hex: string) => void;
}

export default function PickerTab({ onCopyHex }: Props) {
  const [hsl, setHsl] = useState<HSL>({ h: 210, s: 70, l: 55 });
  const [hexInput, setHexInput] = useState("");

  const hex = hslToHex(hsl);
  const rgb = hslToRgb(hsl);
  const textColor = textColorForBg(hex);

  const handleHexInput = useCallback(
    (value: string) => {
      setHexInput(value);
      const clean = value.replace(/^#/, "");
      if (clean.length === 6 || clean.length === 3) {
        const parsed = hexToHsl(clean);
        if (parsed) setHsl(parsed);
      }
    },
    [],
  );

  const handleRgbInput = useCallback(
    (channel: "r" | "g" | "b", value: string) => {
      const num = parseInt(value, 10);
      if (isNaN(num)) return;
      const clamped = Math.max(0, Math.min(255, num));
      const current = hexToRgb(hex);
      if (!current) return;
      const updated = { ...current, [channel]: clamped };
      const newHsl = hexToHsl(
        `${updated.r.toString(16).padStart(2, "0")}${updated.g.toString(16).padStart(2, "0")}${updated.b.toString(16).padStart(2, "0")}`,
      );
      if (newHsl) setHsl(newHsl);
    },
    [hex],
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Large preview swatch */}
      <div
        className="flex aspect-square w-full max-w-xs items-center justify-center rounded-2xl text-2xl font-bold shadow-lg lg:w-72"
        style={{ backgroundColor: `#${hex}`, color: textColor }}
      >
        #{hex.toUpperCase()}
      </div>

      <div className="flex flex-1 flex-col gap-5">
        {/* HSL sliders */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            HSL Sliders
          </label>

          <div className="flex items-center gap-3">
            <span className="w-8 text-xs font-medium" style={{ color: "var(--muted)" }}>H</span>
            <input
              type="range"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) => setHsl({ ...hsl, h: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              style={{
                background: `linear-gradient(to right, hsl(0,${hsl.s}%,${hsl.l}%), hsl(60,${hsl.s}%,${hsl.l}%), hsl(120,${hsl.s}%,${hsl.l}%), hsl(180,${hsl.s}%,${hsl.l}%), hsl(240,${hsl.s}%,${hsl.l}%), hsl(300,${hsl.s}%,${hsl.l}%), hsl(360,${hsl.s}%,${hsl.l}%))`,
                height: 8,
                borderRadius: 4,
              }}
            />
            <span className="w-10 text-right text-sm font-medium">{hsl.h}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 text-xs font-medium" style={{ color: "var(--muted)" }}>S</span>
            <input
              type="range"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(e) => setHsl({ ...hsl, s: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
            />
            <span className="w-10 text-right text-sm font-medium">{hsl.s}%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 text-xs font-medium" style={{ color: "var(--muted)" }}>L</span>
            <input
              type="range"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(e) => setHsl({ ...hsl, l: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
            />
            <span className="w-10 text-right text-sm font-medium">{hsl.l}%</span>
          </div>
        </div>

        {/* Hex input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            Hex
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">#</span>
            <input
              type="text"
              value={hexInput || hex}
              onChange={(e) => handleHexInput(e.target.value)}
              onFocus={() => setHexInput(hex)}
              onBlur={() => setHexInput("")}
              maxLength={7}
              className="w-28 rounded-lg border px-3 py-1.5 text-sm font-mono"
              style={{
                background: "var(--panel)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            />
          </div>
        </div>

        {/* RGB input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            RGB
          </label>
          <div className="flex items-center gap-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-1">
                <span className="text-xs font-medium uppercase" style={{ color: "var(--muted)" }}>
                  {ch}
                </span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbInput(ch, e.target.value)}
                  className="w-16 rounded-lg border px-2 py-1.5 text-sm font-mono"
                  style={{
                    background: "var(--panel)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={() => onCopyHex(hex)}
          className="w-fit rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Copy #{hex.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
