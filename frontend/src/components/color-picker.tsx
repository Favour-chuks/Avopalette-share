import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Slider } from "@/components/ui/slider";

interface ColorPickerProps {
  index: number;
  rgba: string; // e.g. "rgba(255, 0, 0, 0.5)"
  onChange: (index: number, newRgba: string) => void;
}

// Utility: RGBA -> HEX + alpha
const parseRgba = (rgba: string): { hex: string; opacity: number } => {
  const match = rgba.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([01]?\.?\d*)?\)/
  );
  if (!match) return { hex: "#808080", opacity: 1 }; // fallback

  const [, r, g, b, a] = match;
  const hex = `#${[r, g, b]
    .map((val) => Number(val).toString(16).padStart(2, "0"))
    .join("")}`;
  const opacity = a !== undefined ? parseFloat(a) : 1;
  return { hex, opacity };
};

// Utility: HEX + alpha -> RGBA
const toRgbaString = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ index, rgba, onChange }) => {
  const { hex, opacity } = parseRgba(rgba);

  const [localHex, setLocalHex] = useState(hex);
  const [localOpacity, setLocalOpacity] = useState(opacity);

  // Sync when rgba prop changes
  useEffect(() => {
    const parsed = parseRgba(rgba);
    setLocalHex(parsed.hex);
    setLocalOpacity(parsed.opacity);
  }, [rgba]);

  const updateParent = (newHex: string, newOpacity: number) => {
    const rgbaString = toRgbaString(newHex, newOpacity);
    onChange(index, rgbaString);
  };

  const handleHexChange = (value: string) => {
    const isValid = /^#([0-9A-F]{6})$/i.test(value);
    if (isValid) {
      setLocalHex(value);
      updateParent(value, localOpacity);
    }
  };

  const handleOpacityChange = (value: number) => {
    setLocalOpacity(value);
    updateParent(localHex, value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="w-[35px] h-[35px] rounded-full border cursor-pointer"
          style={{ backgroundColor: toRgbaString(localHex, localOpacity) }}
        />
      </PopoverTrigger>
      <PopoverContent className="bg-white p-4 z-10 rounded-md shadow-xl flex flex-col gap-4">
        {/* Color Picker */}
        <HexColorPicker
          color={localHex}
          onChange={(newColor) => {
            setLocalHex(newColor);
            updateParent(newColor, localOpacity);
          }}
        />

        {/* Manual Input */}
        <label className="text-sm flex flex-col gap-1">
          HEX Color:
          <input
            type="text"
            value={localHex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm"
          />
        </label>

        {/* Opacity */}
        <label className="text-sm flex flex-col gap-1">
          Opacity: {Math.round(localOpacity * 100)}%
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[localOpacity]}
            onValueChange={(value) => handleOpacityChange(value[0])}
          />
        </label>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
