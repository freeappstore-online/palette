import { curatedPalettes } from "../lib/curated";

interface Props {
  onLoadPalette: (colors: string[]) => void;
  onSavePalette: (name: string, colors: string[]) => void;
  onCopyHex: (hex: string) => void;
}

export default function ExploreTab({
  onLoadPalette,
  onSavePalette,
  onCopyHex,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Browse 30 curated palettes. Click a swatch to copy its hex, or load a
        palette to start editing.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {curatedPalettes.map((p) => (
          <div
            key={p.name}
            className="flex flex-col gap-2 rounded-xl border p-3"
            style={{ borderColor: "var(--line)" }}
          >
            <span className="text-sm font-semibold">{p.name}</span>

            <div className="flex gap-0.5 rounded-lg overflow-hidden">
              {p.colors.map((hex, i) => (
                <div
                  key={i}
                  className="h-12 flex-1 cursor-pointer transition-transform hover:scale-y-110"
                  style={{ backgroundColor: `#${hex}` }}
                  onClick={() => onCopyHex(hex)}
                  title={`#${hex.toUpperCase()} — click to copy`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onLoadPalette(p.colors)}
                className="text-xs font-medium"
                style={{ color: "var(--accent)" }}
              >
                Load
              </button>
              <button
                onClick={() => onSavePalette(p.name, p.colors)}
                className="text-xs font-medium"
                style={{ color: "var(--success)" }}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
