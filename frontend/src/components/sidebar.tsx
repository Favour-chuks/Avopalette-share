import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, CirclePlus, Italic, Underline } from "lucide-react";
import ColorPicker from "./color-picker";
import React from "react";
import { Slider } from "./ui/slider";

interface SideBarProps {
  initialColors: string[]; // e.g. ["rgba(255,0,0,0.8)"]
  onDensityChange: (density: number) => void;
  onActiveItemChange: (item: string) => void;
  onColorsChange: (rgbaColors: string[]) => void; // updated to return a single rgba list
}

function SideBar({
  initialColors,
  onColorsChange,
  onDensityChange,
  onActiveItemChange,
}: SideBarProps) {
  const [activeItem, setActiveItem] = useState("");
  const [density, setDensity] = useState(1);
  const [selectedColors, setSelectedColors] = useState(initialColors);

  // State for context menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    colorIndex: number | null;
  }>({ visible: false, x: 0, y: 0, colorIndex: null });

  useEffect(() => {
    console.log("Selected colors updated:", selectedColors);
  }, [selectedColors]);

  const handleDensityChange = (newDensity: number) => {
    setDensity(newDensity);
    onDensityChange(newDensity); // Notify parent component
  };

  const handleColorChange = (index: number, newRgba: string) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = newRgba;
    setSelectedColors(updatedColors);
    onColorsChange(updatedColors); // now returns only rgba list
  };

  const handleRemoveColor = () => {
    console.log("Removing color at index:", contextMenu.colorIndex);
    console.log("Current colors:", selectedColors);
    if (contextMenu.colorIndex === null) return;

    const updatedColors = selectedColors.filter(
      (_, i) => i !== contextMenu.colorIndex
    );
    setSelectedColors(updatedColors);
    onColorsChange(updatedColors);
  };

  const handleAddColor = () => {
    if (selectedColors.length >= 6) return;
    const newColors = [...selectedColors, "rgba(128,128,128,1)"];
    setSelectedColors(newColors);
    onColorsChange(newColors);
  };

  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    event.preventDefault(); // Prevent the default browser context menu
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      colorIndex: index,
    });
  };

  const contextMenuRef = React.useRef<HTMLDivElement | null>(null);
  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, colorIndex: null });
  };

  return (
    <div
      className="flex flex-col gap-4 h-full w-[200px]"
      onClick={handleCloseContextMenu}>
      {/* Color Picker Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Color Picker</h2>
        <div className="flex justify-between">
          {selectedColors.map((color, index) => (
            <div
              key={`${color}-${index}`} // Use a combination of color and index as the key
              className="relative group"
              onContextMenu={(e) => handleContextMenu(e, index)} // Right-click handler
              onClick={(e) => e.stopPropagation()}>
              <ColorPicker
                index={index}
                rgba={color}
                onChange={handleColorChange}
              />
            </div>
          ))}
          {/* Add Color Button */}
          {selectedColors.length < 6 && (
            <button
              onClick={handleAddColor}
              className="bg-gray-200 h-[35px] w-[35px] rounded-full">
              <CirclePlus className="h-4 w-4 mx-auto my-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.colorIndex !== null && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white border border-gray-300 shadow-lg rounded-md p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button
            onClick={() => handleRemoveColor()}
            className="text-red-500 hover:text-red-700">
            Remove Color
          </button>
        </div>
      )}

      {/* Toggle Group Section */}
      <div className="flex flex-col gap-2 min-h-[58px]">
        <h2 className="text-lg font-semibold">Mode</h2>
        <ToggleGroup
          type="single"
          value={activeItem}
          onValueChange={(value) => {
            if (value) {
              setActiveItem(value);
              onActiveItemChange(value);
            }
          }}
          size="custom"
          className="w-full bg-gray-200 p-1 rounded-lg">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
            disabled>
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Density Slider Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Density</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Low</span>
          <Slider
            min={5}
            max={1000}
            value={[density]} // Sync with state
            onValueChange={(value: number[]) => handleDensityChange(value[0])}
            className="w-full"
          />
          <span className="text-sm">High</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
