import { useState, useEffect } from "react";
import {
  getSavedPalettes,
  savePalette,
  deletePalette,
  type SavedPalette,
} from "../lib/storage";

interface Props {
  palette: string[];
  onLoadPalette: (colors: string[]) => void;
  onCopyHex: (hex: string) => void;
}

export default function SavedTab({ palette, onLoadPalette, onCopyHex }: Props) {
  const [saved, setSaved] = useState<SavedPalette[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setSaved(getSavedPalettes());
  }, []);

  const handleSave = () => {
    const label = name.trim() || `Palette ${saved.length + 1}`;
    savePalette(label, palette);
    setSaved(getSavedPalettes());
    setName("");
  };

  const handleDelete = (id: string) => {
    deletePalette(id);
    setSaved(getSavedPalettes());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Save current */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My palette"
            className="w-48 rounded-lg border px-3 py-1.5 text-sm"
            style={{
              background: "var(--panel)",
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
          />
        </div>
        <button
          onClick={handleSave}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Save current palette
        </button>
      </div>

      {/* Preview of current */}
      <div className="flex gap-1">
        {palette.map((hex, i) => (
          <div
            key={i}
            className="h-8 flex-1 first:rounded-l-lg last:rounded-r-lg"
            style={{ backgroundColor: `#${hex}` }}
          />
        ))}
      </div>

      {/* Gallery */}
      {saved.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No saved palettes yet. Generate a palette and save it here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-2 rounded-xl border p-3"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold truncate">{p.name}</span>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs px-2 py-0.5 rounded hover:opacity-80"
                  style={{ color: "var(--error)" }}
                  title="Delete"
                >
                  Delete
                </button>
              </div>

              <div className="flex gap-0.5 rounded-lg overflow-hidden">
                {p.colors.map((hex, i) => (
                  <div
                    key={i}
                    className="h-10 flex-1 cursor-pointer transition-transform hover:scale-y-110"
                    style={{ backgroundColor: `#${hex}` }}
                    onClick={() => onCopyHex(hex)}
                    title={`#${hex.toUpperCase()} — click to copy`}
                  />
                ))}
              </div>

              <button
                onClick={() => onLoadPalette(p.colors)}
                className="text-xs font-medium"
                style={{ color: "var(--accent)" }}
              >
                Load this palette
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
