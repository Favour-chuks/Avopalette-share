import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, CirclePlus, Italic, Underline } from "lucide-react";
import ColorPicker from "./color-picker";
import React from "react";
import { Slider } from "./ui/slider";

interface SideBarProps {
  initialColors: string[];
  initialOpacities: number[];
  onDensityChange: (density: number) => void;
  onActiveItemChange: (item: string) => void;
  onColorsChange: (colors: string[], opacities: number[]) => void;
}

function SideBar({
  initialColors,
  initialOpacities,
  onColorsChange,
  onDensityChange,
  onActiveItemChange
}: SideBarProps) {
  const [activeItem, setActiveItem] = useState("");
  const [density, setDensity] = useState(1);
  const [selectedColors, setSelectedColors] = useState(initialColors);
  const [opacities, setOpacities] = useState(initialOpacities);

  // State for context menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    colorIndex: number | null;
  }>({ visible: false, x: 0, y: 0, colorIndex: null });

  useEffect(() => {
    console.log("Selected colors updated:", selectedColors);
    console.log("Opacities updated:", opacities);
  }, [selectedColors, opacities]);

  const handleDensityChange = (newDensity: number) => {
    setDensity(newDensity);
    onDensityChange(newDensity); // Notify parent component
  };

  const handleColorChange = (
    index: number,
    newColor: string,
    newOpacity: number
  ) => {
    const updatedColors = [...selectedColors];
    const updatedOpacities = [...opacities];

    updatedColors[index] = newColor;
    updatedOpacities[index] = newOpacity;

    setSelectedColors(updatedColors);
    setOpacities(updatedOpacities);

    // Notify parent component of the changes
    onColorsChange(updatedColors, updatedOpacities);
  };

  const handleRemoveColor = () => {
    console.log("Removing color at index:", contextMenu.colorIndex);
    console.log("Current colors:", selectedColors);
    if (contextMenu.colorIndex !== null) {
      // Remove the color and opacity at the specified index
      const updatedColors = selectedColors.filter(
        (_, i) => i !== contextMenu.colorIndex
      );
      const updatedOpacities = opacities.filter(
        (_, i) => i !== contextMenu.colorIndex
      );

      setSelectedColors(updatedColors);
      setOpacities(updatedOpacities);

      // Notify parent component of the changes
      onColorsChange(updatedColors, updatedOpacities);

      // Hide context menu
      handleCloseContextMenu(new MouseEvent("click") as unknown as React.MouseEvent);
    }else {
      console.error("No color index selected for removal.");
    }
  };

  const handleAddColor = () => {
    if (selectedColors.length < 6) {
      const newColors = [...selectedColors, "#808080"]; // Add a default gray color
      const newOpacities = [...opacities, 1]; // Add default opacity
      setSelectedColors(newColors);
      setOpacities(newOpacities);
      onColorsChange(newColors, newOpacities); // Notify parent component
    }
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
  const handleCloseContextMenu = (event: React.MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
      setContextMenu({ visible: false, x: 0, y: 0, colorIndex: null });
    }
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
                color={color}
                opacity={opacities[index]}
                onChange={(newColor) => handleColorChange(index, newColor, opacities[index])}
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
          onValueChange={(value) => {setActiveItem(value); onActiveItemChange(value);}}
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
            min={1}
            max={1000}
            value={density} // Sync with state
            onValueChange={(value) => handleDensityChange(value)}
            className="w-full"
          />
          <span className="text-sm">High</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
