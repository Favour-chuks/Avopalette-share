import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, CirclePlus, Italic, Underline } from "lucide-react";
import ColorPicker from "./color-picker";
import { Slider } from "./ui/slider";

interface SideBarProps {
  initialColors: string[];
  onColorsChange: (updatedColors: string[]) => void;
  onDensityChange: (updatedDensity: number) => void;
  onActiveItemChange: (item: string) => void;
}

function SideBar({
  initialColors,
  onColorsChange,
  onDensityChange,
  onActiveItemChange,
}: SideBarProps) {
  const [activeItem, setActiveItem] = useState("");
  const [density, setDensity] = useState(10);
  const [selectedColors, setSelectedColors] = useState(initialColors);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    colorIndex: null as number | null,
  });

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const handleDensityChange = (newDensity: number) => {
    setDensity(newDensity);
    onDensityChange(newDensity);
  };

  const handleColorChange = (index: number, newRgba: string) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = newRgba;
    setSelectedColors(updatedColors);
    onColorsChange(updatedColors);
  };

  const handleRemoveColor = () => {
    if (contextMenu.colorIndex === null) return;
    const updatedColors = selectedColors.filter(
      (_, i) => i !== contextMenu.colorIndex
    );
    setSelectedColors(updatedColors);
    onColorsChange(updatedColors);
    setContextMenu({ visible: false, x: 0, y: 0, colorIndex: null });
  };

  const handleAddColor = () => {
    if (selectedColors.length >= 6) return;
    const newColors = [...selectedColors, "rgba(128,128,128,1)"];
    setSelectedColors(newColors);
    onColorsChange(newColors);
  };

  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    const menuWidth = 150;
    const menuHeight = 50;

    const x =
      event.clientX + menuWidth > window.innerWidth
        ? event.clientX - menuWidth
        : event.clientX;

    const y =
      event.clientY + menuHeight > window.innerHeight
        ? event.clientY - menuHeight
        : event.clientY;

    setContextMenu({ visible: true, x, y, colorIndex: index });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu({ visible: false, x: 0, y: 0, colorIndex: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu.visible]);

  return (
    <div className="flex flex-col gap-4 h-full w-[200px]">
      {/* Color Picker Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-lg font-semibold">Color Picker</h2>
        <div className="flex justify-between">
          {selectedColors.map((color, index) => (
            <div
              key={`${color}-${index}`}
              className="relative group overflow-hidden"
              onContextMenu={(e) => handleContextMenu(e, index)}
            >
              <ColorPicker index={index} rgba={color} onChange={handleColorChange} />
            </div>
          ))}
          {selectedColors.length < 6 && (
            <button
              onClick={handleAddColor}
              className="bg-gray-200 h-[35px] w-[35px] rounded-full flex items-center justify-center"
            >
              <CirclePlus className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.colorIndex !== null && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={handleRemoveColor}
            className="text-red-500 hover:text-red-700"
          >
            Remove Color
          </button>
        </div>
      )}

      {/* Toggle Group Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col gap-2 min-h-[58px]"
      >
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
      </motion.div>

      {/* Density Slider Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-lg font-semibold">Density</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Low</span>
          <Slider
            min={20}
            max={150}
            value={[density]}
            onValueChange={(value) => setDensity(value[0])}
            onValueCommit={(value) => handleDensityChange(value[0])}
            className="w-full"
          />
          <span className="text-sm">High</span>
        </div>
      </motion.div>
    </div>
  );
}

export default SideBar;
