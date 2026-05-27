/** localStorage helpers for saved palettes. */

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[]; // hex without #
  createdAt: number;
}

const STORAGE_KEY = "palette-saved";

function read(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedPalette[];
  } catch {
    return [];
  }
}

function write(palettes: SavedPalette[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
}

export function getSavedPalettes(): SavedPalette[] {
  return read();
}

export function savePalette(name: string, colors: string[]): SavedPalette {
  const palettes = read();
  const entry: SavedPalette = {
    id: crypto.randomUUID(),
    name,
    colors,
    createdAt: Date.now(),
  };
  palettes.unshift(entry);
  write(palettes);
  return entry;
}

export function deletePalette(id: string): void {
  const palettes = read().filter((p) => p.id !== id);
  write(palettes);
}
