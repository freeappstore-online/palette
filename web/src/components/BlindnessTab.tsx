import {
  hexToRgb,
  rgbToHex,
  simulateColorBlindness,
  type ColorBlindnessType,
} from "../lib/color";
import ColorSwatch from "./ColorSwatch";

const TYPES: { type: ColorBlindnessType; label: string; description: string }[] = [
  {
    type: "protanopia",
    label: "Protanopia",
    description: "Reduced red sensitivity (~1% of males)",
  },
  {
    type: "deuteranopia",
    label: "Deuteranopia",
    description: "Reduced green sensitivity (~6% of males)",
  },
  {
    type: "tritanopia",
    label: "Tritanopia",
    description: "Reduced blue sensitivity (rare, ~0.01%)",
  },
];

interface Props {
  palette: string[];
}

export default function BlindnessTab({ palette }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        See how your current palette appears to people with different types of
        color vision deficiency.
      </p>

      {/* Original */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Normal vision</h3>
        <div className="flex gap-2">
          {palette.map((hex) => (
            <ColorSwatch key={hex} hex={hex} showDetails={false} size="md" />
          ))}
        </div>
      </div>

      {/* Simulations */}
      {TYPES.map(({ type, label, description }) => (
        <div key={type}>
          <h3 className="mb-1 text-sm font-semibold">{label}</h3>
          <p className="mb-2 text-xs" style={{ color: "var(--muted)" }}>
            {description}
          </p>
          <div className="flex gap-2">
            {palette.map((hex) => {
              const rgb = hexToRgb(hex);
              if (!rgb) return null;
              const simulated = simulateColorBlindness(rgb, type);
              const simHex = rgbToHex(simulated);
              return (
                <ColorSwatch
                  key={`${type}-${hex}`}
                  hex={simHex}
                  showDetails={false}
                  size="md"
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
