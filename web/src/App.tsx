import { useState, useCallback } from "react";
import { randomHex } from "./lib/color";
import { savePalette } from "./lib/storage";
import { useToast } from "./hooks/useToast";
import ToastContainer from "./components/ToastContainer";
import GenerateTab from "./components/GenerateTab";
import PickerTab from "./components/PickerTab";
import ContrastTab from "./components/ContrastTab";
import BlindnessTab from "./components/BlindnessTab";
import GradientTab from "./components/GradientTab";
import SavedTab from "./components/SavedTab";
import ExportTab from "./components/ExportTab";
import ExploreTab from "./components/ExploreTab";

type Tab =
  | "generate"
  | "picker"
  | "contrast"
  | "blindness"
  | "gradient"
  | "saved"
  | "export"
  | "explore";

const TABS: { id: Tab; label: string }[] = [
  { id: "generate", label: "Generate" },
  { id: "picker", label: "Picker" },
  { id: "contrast", label: "Contrast" },
  { id: "blindness", label: "Blindness" },
  { id: "gradient", label: "Gradient" },
  { id: "saved", label: "Saved" },
  { id: "export", label: "Export" },
  { id: "explore", label: "Explore" },
];

function initialPalette(): string[] {
  return [randomHex(), randomHex(), randomHex(), randomHex(), randomHex()];
}

export default function App() {
  const [tab, setTab] = useState<Tab>("generate");
  const [palette, setPalette] = useState<string[]>(initialPalette);
  const { toasts, show } = useToast();

  const copyHex = useCallback(
    (hex: string) => {
      navigator.clipboard.writeText(`#${hex.toUpperCase()}`).then(() => {
        show(`Copied #${hex.toUpperCase()}`);
      });
    },
    [show],
  );

  const copyText = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        show("Copied to clipboard");
      });
    },
    [show],
  );

  const loadPalette = useCallback(
    (colors: string[]) => {
      // Ensure exactly 5 colors
      const padded = [...colors];
      while (padded.length < 5) padded.push(randomHex());
      setPalette(padded.slice(0, 5));
      setTab("generate");
      show("Palette loaded");
    },
    [show],
  );

  const handleSavePalette = useCallback(
    (name: string, colors: string[]) => {
      savePalette(name, colors);
      show(`Saved "${name}"`);
    },
    [show],
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-1">
        <h1
          className="font-display text-3xl font-bold tracking-tight"
        >
          Color Palette
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Generate, explore, and export color palettes
        </p>
      </header>

      {/* Tab bar */}
      <nav className="mb-6 flex gap-1 overflow-x-auto rounded-xl p-1" style={{ background: "var(--panel)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{
              background: tab === t.id ? "var(--accent)" : "transparent",
              color: tab === t.id ? "#fff" : "var(--ink)",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <main className="flex-1">
        {tab === "generate" && (
          <GenerateTab
            onCopyHex={copyHex}
            palette={palette}
            setPalette={setPalette}
          />
        )}
        {tab === "picker" && <PickerTab onCopyHex={copyHex} />}
        {tab === "contrast" && <ContrastTab palette={palette} />}
        {tab === "blindness" && <BlindnessTab palette={palette} />}
        {tab === "gradient" && (
          <GradientTab palette={palette} onCopyText={copyText} />
        )}
        {tab === "saved" && (
          <SavedTab
            palette={palette}
            onLoadPalette={loadPalette}
            onCopyHex={copyHex}
          />
        )}
        {tab === "export" && (
          <ExportTab palette={palette} onCopyText={copyText} />
        )}
        {tab === "explore" && (
          <ExploreTab
            onLoadPalette={loadPalette}
            onSavePalette={handleSavePalette}
            onCopyHex={copyHex}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-8 border-t pt-4 text-center text-xs"
        style={{ borderColor: "var(--line)", color: "var(--muted)" }}
      >
        Color Palette — a{" "}
        <a
          href="https://freeappstore.online"
          className="underline"
          style={{ color: "var(--accent)" }}
        >
          FreeAppStore
        </a>{" "}
        app
      </footer>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
