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

// Utility: RGBA -> HEX + opacity
const parseRgba = (rgba: string): { hex: string; opacity: number } => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([01]?\.?\d*)?\)/);
  if (!match) return { hex: "#808080", opacity: 1 };

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

  const [tempHex, setTempHex] = useState(hex); // Local storage while editing
  const [tempOpacity, setTempOpacity] = useState(opacity);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // Track popover state

  // Sync with external updates
  useEffect(() => {
    if (rgba) {
      const parsed = parseRgba(rgba);
      setTempHex(parsed.hex);
      setTempOpacity(parsed.opacity);
    }
  }, [rgba]);

  // Update parent only when popover closes
  const handlePopoverClose = () => {
    const rgbaString = toRgbaString(tempHex, tempOpacity);
    onChange(index, rgbaString);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={(open) => {
      setIsPopoverOpen(open);
      if (!open) handlePopoverClose(); // Update parent only when closing
    }}>
      <PopoverTrigger asChild>
        <div
          className="w-[35px] h-[35px] rounded-full border cursor-pointer"
          style={{ backgroundColor: toRgbaString(tempHex, tempOpacity) }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="bg-white p-4 z-10 rounded-md shadow-xl flex flex-col gap-4"
        onMouseDown={(e) => e.stopPropagation()} // Prevent popover from closing
      >
        {/* Color Picker */}
        <HexColorPicker color={tempHex} onChange={setTempHex} />

        {/* HEX Input Field */}
        <label className="text-sm flex flex-col gap-1">
          HEX Color:
          <input
            type="text"
            value={tempHex}
            onChange={(e) => setTempHex(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm"
          />
        </label>

        {/* Opacity Slider */}
        <label className="text-sm flex flex-col gap-1">
          Opacity: {Math.round(tempOpacity * 100)}%
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[tempOpacity]}
            onValueChange={(value) => setTempOpacity(value[0])}
          />
        </label>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
