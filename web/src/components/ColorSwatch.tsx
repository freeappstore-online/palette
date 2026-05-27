import { textColorForBg, hexToRgb, rgbToHsl } from "../lib/color";

interface Props {
  hex: string;
  locked?: boolean;
  onToggleLock?: () => void;
  onCopy?: () => void;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ColorSwatch({
  hex,
  locked,
  onToggleLock,
  onCopy,
  showDetails = true,
  size = "lg",
}: Props) {
  const textColor = textColorForBg(hex);
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb) : null;

  const heightClass =
    size === "sm" ? "h-16" : size === "md" ? "h-24" : "min-h-[140px] flex-1";

  return (
    <div
      className={`relative flex flex-col items-center justify-end rounded-xl ${heightClass} cursor-pointer select-none p-3 transition-shadow hover:shadow-lg`}
      style={{ backgroundColor: `#${hex}`, color: textColor }}
      onClick={onCopy}
      title="Click to copy hex"
    >
      {onToggleLock && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className="absolute top-2 right-2 rounded-full p-1.5 text-lg opacity-70 transition-opacity hover:opacity-100"
          style={{ background: "rgba(128,128,128,0.25)" }}
          title={locked ? "Unlock" : "Lock"}
        >
          {locked ? "\u{1F512}" : "\u{1F513}"}
        </button>
      )}

      {showDetails && (
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-base font-bold tracking-wide">
            #{hex.toUpperCase()}
          </span>
          {rgb && (
            <span className="text-xs opacity-75">
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </span>
          )}
          {hsl && (
            <span className="text-xs opacity-75">
              hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
