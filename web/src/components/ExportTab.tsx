import { useState } from "react";
import {
  toCssVariables,
  toTailwindConfig,
  toJson,
  toSvgSwatches,
} from "../lib/color";

type ExportFormat = "css" | "tailwind" | "json" | "svg";

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS Variables" },
  { value: "tailwind", label: "Tailwind Config" },
  { value: "json", label: "JSON" },
  { value: "svg", label: "SVG Swatches" },
];

interface Props {
  palette: string[];
  onCopyText: (text: string) => void;
}

export default function ExportTab({ palette, onCopyText }: Props) {
  const [format, setFormat] = useState<ExportFormat>("css");

  const getOutput = (): string => {
    switch (format) {
      case "css":
        return `:root {\n${toCssVariables(palette)}\n}`;
      case "tailwind":
        return toTailwindConfig(palette);
      case "json":
        return toJson(palette);
      case "svg":
        return toSvgSwatches(palette);
    }
  };

  const output = getOutput();

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Export your current palette in different formats.
      </p>

      {/* Format selector */}
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor:
                format === f.value ? "var(--accent)" : "var(--line)",
              background:
                format === f.value ? "var(--accent)" : "var(--panel)",
              color: format === f.value ? "#fff" : "var(--ink)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="flex gap-1 rounded-lg overflow-hidden">
        {palette.map((hex, i) => (
          <div
            key={i}
            className="h-10 flex-1"
            style={{ backgroundColor: `#${hex}` }}
          />
        ))}
      </div>

      {/* Output */}
      <pre
        className="overflow-x-auto rounded-xl border p-4 text-xs leading-relaxed font-mono"
        style={{
          background: "var(--panel)",
          borderColor: "var(--line)",
          color: "var(--ink)",
        }}
      >
        {output}
      </pre>

      <button
        onClick={() => onCopyText(output)}
        className="w-fit rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        style={{ background: "var(--accent)" }}
      >
        Copy to clipboard
      </button>

      {/* SVG visual preview */}
      {format === "svg" && (
        <div>
          <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--muted)" }}>
            Preview
          </h3>
          <div dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}
