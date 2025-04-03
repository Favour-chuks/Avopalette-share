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
  const [localColor, setLocalColor] = useState(color); // Local state for color
  const [localOpacity, setLocalOpacity] = useState(opacity); // Local state for opacity

  const handleOpacityChange = (newOpacity: number) => {
    setLocalOpacity(newOpacity);
    onChange(index, localColor, newOpacity);
  };

  const handleColorInputChange = (inputValue: string) => {
    let newColor = inputValue;

    // Validate and convert RGB to HEX if necessary
    if (/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i.test(inputValue)) {
      const rgbMatch = inputValue.match(/\d+/g);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        newColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)}`;
      }
    }

    // Ensure valid HEX format
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      setLocalColor(newColor); // Update local color state
      onChange(index, newColor, localOpacity); // Notify parent component
    } else {
      console.error("Invalid color format. Please use HEX or RGB.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-[35px] h-[35px] rounded-full"
          style={{
            backgroundColor: hexToRgba(localColor, localOpacity),
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="bg-white w-fit p-4 z-2 flex flex-col gap-3 shadow-xl">
        {/* Color Picker */}
        <HexColorPicker
          color={localColor}
          onChange={(newColor) => {
            setLocalColor(newColor); // Update local color state
            onChange(index, newColor, localOpacity); // Notify parent component
          }}
        />

        {/* Color Input Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm flex justify-between items-center">
            Color:
            <input
              className="w-full border border-border px-2 py-1 rounded-md text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-border"
              type="text"
              value={localColor}
              onChange={(e) => handleColorInputChange(e.target.value)}
              placeholder="Enter HEX or RGB"
            />
          </label>
        </div>

        {/* Opacity Controls */}
        <div className="flex flex-col gap-2">
          <label className="text-sm flex justify-between items-center">
            Opacity:
            <span className="inline-flex items-center gap-0.5 w-12 border border-transparent px-1 py-0.5 rounded-md text-sm text-muted-foreground hover:border-border focus-within:border-border">
              <input
                className="w-6 justify-center align-center text-right text-sm text-muted-foreground 
                           border-0 appearance-none 
                           focus:outline-none focus:ring-0 focus:border-0 
                           [&::-webkit-inner-spin-button]:appearance-none 
                           [&::-webkit-outer-spin-button]:appearance-none 
                           [&::-moz-appearance:textfield]:appearance-none"
                type="number"
                min={0}
                max={100}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.length > 3) {
                    e.target.value = e.target.value.slice(0, 3); // Keep only first 3 digits
                  }
                }}
                value={Math.round(localOpacity * 100)}
                onChange={(e) => {
                  let newValue = Math.min(
                    100,
                    Math.max(0, Number(e.target.value))
                  ); // Ensure within range
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
