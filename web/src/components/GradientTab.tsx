import { useState } from "react";
import { generateGradientCss, type GradientType } from "../lib/color";

interface Props {
  palette: string[];
  onCopyText: (text: string) => void;
}

export default function GradientTab({ palette, onCopyText }: Props) {
  const [selected, setSelected] = useState<boolean[]>(
    palette.map((_, i) => i < 2),
  );
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(90);

  const colors = palette.filter((_, i) => selected[i]);
  const hasEnough = colors.length >= 2;
  const css = hasEnough ? generateGradientCss(colors, gradientType, angle) : "";

  const toggleColor = (i: number) => {
    setSelected((prev) => prev.map((v, j) => (j === i ? !v : v)));
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Pick 2 or more colors from your palette to generate a CSS gradient.
      </p>

      {/* Color toggles */}
      <div className="flex flex-wrap gap-2">
        {palette.map((hex, i) => (
          <button
            key={i}
            onClick={() => toggleColor(i)}
            className="flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-mono transition-colors"
            style={{
              borderColor: selected[i] ? "var(--accent)" : "var(--line)",
              background: selected[i] ? "var(--panel)" : "transparent",
              color: "var(--ink)",
            }}
          >
            <div
              className="h-5 w-5 rounded"
              style={{ backgroundColor: `#${hex}` }}
            />
            #{hex.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Type & angle controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            Type
          </label>
          <select
            value={gradientType}
            onChange={(e) => setGradientType(e.target.value as GradientType)}
            className="rounded-lg border px-3 py-1.5 text-sm"
            style={{
              background: "var(--panel)",
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {gradientType === "linear" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
              Angle
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-32 accent-[var(--accent)]"
            />
            <span className="text-sm font-mono">{angle}deg</span>
          </div>
        )}
      </div>

      {/* Preview */}
      {hasEnough && (
        <>
          <div
            className="h-48 w-full rounded-xl shadow-inner"
            style={{ background: css }}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
              CSS
            </label>
            <div
              className="rounded-lg border p-3 font-mono text-xs break-all"
              style={{
                background: "var(--panel)",
                borderColor: "var(--line)",
              }}
            >
              background: {css};
            </div>
            <button
              onClick={() => onCopyText(`background: ${css};`)}
              className="w-fit rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              Copy CSS
            </button>
          </div>
        </>
      )}

      {!hasEnough && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Select at least 2 colors to preview a gradient.
        </p>
      )}
    </div>
  );
}
