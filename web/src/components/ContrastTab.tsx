import { useState } from "react";
import { hexToRgb, checkContrast } from "../lib/color";

interface Props {
  palette: string[];
}

export default function ContrastTab({ palette }: Props) {
  const [colorA, setColorA] = useState(palette[0] ?? "000000");
  const [colorB, setColorB] = useState(palette[palette.length - 1] ?? "ffffff");

  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  const result = rgbA && rgbB ? checkContrast(rgbA, rgbB) : null;

  const Badge = ({ pass, label }: { pass: boolean; label: string }) => (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        background: pass ? "var(--success)" : "var(--error)",
        color: "#fff",
      }}
    >
      {pass ? "✓" : "✗"} {label}
    </span>
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Select two colors to check their WCAG 2.1 contrast ratio.
      </p>

      <div className="flex flex-wrap gap-4">
        {/* Color A */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            Foreground
          </label>
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-lg border"
              style={{ backgroundColor: `#${colorA}`, borderColor: "var(--line)" }}
            />
            <select
              value={colorA}
              onChange={(e) => setColorA(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm font-mono"
              style={{
                background: "var(--panel)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            >
              {palette.map((c) => (
                <option key={`a-${c}`} value={c}>
                  #{c.toUpperCase()}
                </option>
              ))}
              <option value="000000">#000000</option>
              <option value="ffffff">#FFFFFF</option>
            </select>
          </div>
        </div>

        {/* Color B */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            Background
          </label>
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-lg border"
              style={{ backgroundColor: `#${colorB}`, borderColor: "var(--line)" }}
            />
            <select
              value={colorB}
              onChange={(e) => setColorB(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm font-mono"
              style={{
                background: "var(--panel)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            >
              {palette.map((c) => (
                <option key={`b-${c}`} value={c}>
                  #{c.toUpperCase()}
                </option>
              ))}
              <option value="000000">#000000</option>
              <option value="ffffff">#FFFFFF</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      {result && (
        <>
          <div
            className="rounded-xl p-8"
            style={{ backgroundColor: `#${colorB}` }}
          >
            <p
              className="text-lg font-semibold"
              style={{ color: `#${colorA}` }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: `#${colorA}` }}
            >
              Normal body text at 16px. Check readability across sizes.
            </p>
            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: `#${colorA}` }}
            >
              Large heading text (24px bold)
            </p>
          </div>

          {/* Ratio */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{result.ratio.toFixed(2)}</span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                : 1 contrast ratio
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge pass={result.aa} label="AA Normal" />
              <Badge pass={result.aaLarge} label="AA Large" />
              <Badge pass={result.aaa} label="AAA Normal" />
              <Badge pass={result.aaaLarge} label="AAA Large" />
            </div>

            <p className="text-xs" style={{ color: "var(--muted)" }}>
              AA requires {"≥"}4.5:1 for normal text, {"≥"}3:1 for large text.
              AAA requires {"≥"}7:1 for normal text, {"≥"}4.5:1 for large text.
            </p>
          </div>

          {/* Quick matrix */}
          <div>
            <h3
              className="mb-3 text-sm font-semibold"
              style={{ color: "var(--muted)" }}
            >
              Palette contrast matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="text-xs">
                <thead>
                  <tr>
                    <th className="p-1" />
                    {palette.map((c) => (
                      <th key={`h-${c}`} className="p-1">
                        <div
                          className="h-6 w-6 rounded"
                          style={{ backgroundColor: `#${c}` }}
                          title={`#${c}`}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {palette.map((rowC) => {
                    const rowRgb = hexToRgb(rowC);
                    return (
                      <tr key={`r-${rowC}`}>
                        <td className="p-1">
                          <div
                            className="h-6 w-6 rounded"
                            style={{ backgroundColor: `#${rowC}` }}
                            title={`#${rowC}`}
                          />
                        </td>
                        {palette.map((colC) => {
                          const colRgb = hexToRgb(colC);
                          if (!rowRgb || !colRgb)
                            return <td key={`c-${colC}`} className="p-1">-</td>;
                          const r = checkContrast(rowRgb, colRgb);
                          return (
                            <td
                              key={`c-${colC}`}
                              className="p-1 text-center font-mono"
                              style={{
                                color: r.aa
                                  ? "var(--success)"
                                  : r.aaLarge
                                    ? "var(--warning)"
                                    : "var(--error)",
                              }}
                              title={`${r.ratio.toFixed(2)}:1`}
                            >
                              <span
                                className="inline-block rounded px-1 py-0.5"
                                style={{
                                  backgroundColor: `#${colC}`,
                                  color: `#${rowC}`,
                                }}
                              >
                                {r.ratio.toFixed(1)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
