import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const hexToRgba = (hex: string, opacity: number): string => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ColorPickerProps {
  color: string;
  opacity: number;
  index: number;
  onChange: (index: number, color: string, opacity: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  opacity,
  index,
  onChange,
}) => {
  const [localOpacity, setLocalOpacity] = useState(opacity); // Local state for tracking opacity

  const handleOpacityChange = (newOpacity: number) => {
    setLocalOpacity(newOpacity);
    onChange(index, color, newOpacity);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-[35px] h-[35px] rounded-full"
          style={{
            backgroundColor: hexToRgba(color, localOpacity),
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="bg-white w-fit p-4 z-2 flex flex-col gap-3 shadow-xl">
        {/* Color Picker */}
        <HexColorPicker
          color={color}
          onChange={(newColor) => onChange(index, newColor, localOpacity)}
        />

        {/* Opacity Controls */}
        <div className="flex flex-col gap-2">
          <label className="text-sm flex justify-between items-center">
            Opacity:
            <span className="inline-flex items-center w-12 border border-transparent px-1 py-0.5 rounded-md text-sm text-muted-foreground hover:border-border">
              <input
                className="w-10 text-right text-sm text-muted-foreground 
                           border-0 appearance-none 
                           focus:outline-none focus:ring-0 focus:border-transparent 
                           [&::-webkit-inner-spin-button]:appearance-none 
                           [&::-webkit-outer-spin-button]:appearance-none 
                           [&::-moz-appearance:textfield]"
                type="number"
                min={0}
                max={100}
                value={Math.round(localOpacity * 100)}
                onChange={(e) => {
                  let newValue = Math.min(100, Math.max(0, Number(e.target.value))); // Ensure within range
                  handleOpacityChange(newValue / 100);
                }}
              />
              %
            </span>
          </label>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[localOpacity]} // Sync with state
            onValueChange={(value) => handleOpacityChange(value[0])}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
