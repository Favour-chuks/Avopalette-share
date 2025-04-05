import { useEffect, useState, useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, CirclePlus, Italic, Underline } from "lucide-react";
import ColorPicker from "./color-picker";
import { Slider } from "./ui/slider";

interface SideBarProps {
  initialColors: string[];
  onDensityChange: (density: number) => void;
  onActiveItemChange: (item: string) => void;
  onColorsChange: (rgbaColors: string[]) => void;
}

function SideBar({
  initialColors,
  onColorsChange,
  onDensityChange,
  onActiveItemChange,
}: SideBarProps) {
  const [activeItem, setActiveItem] = useState(""); // Default value
  const [density, setDensity] = useState(10);
  const [selectedColors, setSelectedColors] = useState(initialColors);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    colorIndex: number | null;
  }>({ visible: false, x: 0, y: 0, colorIndex: null });

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Selected colors updated:", selectedColors);
  }, [selectedColors]);

  // Handle Density Change (only update after user releases slider)
  const handleDensityChange = (newDensity: number) => {
    setDensity(newDensity);
    onDensityChange(newDensity);
  };

  // Handle Color Change
  const handleColorChange = (index: number, newRgba: string) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = newRgba;
    setSelectedColors(updatedColors);
    onColorsChange(updatedColors);
  };

  // Handle Remove Color
  const handleRemoveColor = () => {
    if (contextMenu.colorIndex === null) return;
    const updatedColors = selectedColors.filter(
      (_, i) => i !== contextMenu.colorIndex
    );
    setSelectedColors(updatedColors);
    onColorsChange(updatedColors);
    setContextMenu({ visible: false, x: 0, y: 0, colorIndex: null });
  };

  // Handle Add Color (limit to 6)
  const handleAddColor = () => {
    if (selectedColors.length >= 6) return;
    setSelectedColors([...selectedColors, "rgba(128,128,128,1)"]);
    onColorsChange([...selectedColors, "rgba(128,128,128,1)"]);
  };

  // Handle Context Menu (right-click)
  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    const viewportHeight = window.innerHeight;
    const menuHeight = 50; // Approx height of menu

    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY + menuHeight > viewportHeight ? event.clientY - menuHeight : event.clientY, // Prevent overflow
      colorIndex: index,
    });
  };

  // Handle Clicking Outside Context Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ visible: false, x: 0, y: 0, colorIndex: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu.visible]);

  return (
    <div className="flex flex-col gap-4 h-full w-[200px]">
      {/* Color Picker Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Color Picker</h2>
        <div className="flex justify-between">
          {selectedColors.map((color, index) => (
            <div
              key={`${color}-${index}`}
              className="relative group"
              onContextMenu={(e) => handleContextMenu(e, index)}
            >
              <ColorPicker index={index} rgba={color} onChange={handleColorChange} />
            </div>
          ))}
          {/* Add Color Button */}
          {selectedColors.length < 6 && (
            <button
              onClick={handleAddColor}
              className="bg-gray-200 h-[35px] w-[35px] rounded-full"
            >
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
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={handleRemoveColor} className="text-red-500 hover:text-red-700">
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
          className="w-full bg-gray-200 p-1 rounded-lg"
        >
          <ToggleGroupItem value="bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" disabled>
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
            min={20}
            max={150}
            value={[density]}
            onValueChange={(value) => {setDensity(value[0]); console.log(value[0])}}
            onValueCommit={(value) => handleDensityChange(value[0])} // Update only when user releases
            className="w-full"
          />
          <span className="text-sm">High</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
