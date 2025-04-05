import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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

  // Optimized: Store context menu state in a useRef to avoid frequent re-renders.
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [contextVisible, setContextVisible] = useState(false);
  const contextMenuPosition = useRef({ x: 0, y: 0, colorIndex: Number(null) });

  /* 
     - useCallback prevents unnecessary re-creation of functions.
     - This ensures the function reference remains stable across renders.
  */
  const handleDensityChange = useCallback((newDensity: number) => {
    setDensity(newDensity);
    onDensityChange(newDensity);
  }, [onDensityChange]);

  /* 
     - Use useCallback to avoid unnecessary re-renders of child components.
     - This function now uses the functional state update pattern.
  */
  const handleColorChange = useCallback((index: number, newRgba: string) => {
    setSelectedColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[index] = newRgba;
      onColorsChange(updatedColors);
      return updatedColors;
    });
  }, [onColorsChange]);

  /* 
     - UseRef for context menu position instead of state to prevent unnecessary re-renders.
     - Only update state when necessary.
  */
  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    contextMenuPosition.current = { x: event.clientX, y: event.clientY, colorIndex: index };
    setContextVisible(true);
  };

  /* 
     - useEffect ensures event listeners for clicking outside the menu are only added when necessary.
     - This prevents memory leaks and performance issues.
  */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextVisible(false);
      }
    };

    if (contextVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextVisible]);

  /* 
     - Memoize the color elements to prevent unnecessary re-renders.
  */
  const colorElements = useMemo(
    () =>
      selectedColors.map((color, index) => (
        <div key={index} onContextMenu={(e) => handleContextMenu(e, index)}>
          <ColorPicker index={index} rgba={color} onChange={handleColorChange} />
        </div>
      )),
    [selectedColors, handleColorChange]
  );

  /* 
     - Debounce function to prevent rapid state updates from the slider.
     - This helps avoid performance issues caused by frequent re-renders.
  */
  const debounce = (fn: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  /* 
     - Memoize the debounced function so it's not recreated on every render.
  */
  const handleDensityChangeDebounced = useMemo(() => debounce(handleDensityChange, 300), [handleDensityChange]);

  return (
    <div className="flex flex-col gap-4 h-full w-[200px]">
      {/* Color Picker Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Color Picker</h2>
        <div className="flex justify-between">
          {colorElements}
          {/* Add Color Button */}
          {selectedColors.length < 6 && (
            <button
              onClick={() => {
                setSelectedColors([...selectedColors, "rgba(128,128,128,1)"]);
                onColorsChange([...selectedColors, "rgba(128,128,128,1)"]);
              }}
              className="bg-gray-200 h-[35px] w-[35px] rounded-full"
            >
              <CirclePlus className="h-4 w-4 mx-auto my-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextVisible && contextMenuPosition.current.colorIndex !== null && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white border border-gray-300 shadow-lg rounded-md p-2"
          style={{ top: contextMenuPosition.current.y, left: contextMenuPosition.current.x }}
        >
          <button
            onClick={() => {
              const updatedColors = selectedColors.filter((_, i) => i !== contextMenuPosition.current.colorIndex);
              setSelectedColors(updatedColors);
              onColorsChange(updatedColors);
              setContextVisible(false);
            }}
            className="text-red-500 hover:text-red-700"
          >
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
            min={5}
            max={150}
            value={[density]}
            onValueChange={(value) => handleDensityChangeDebounced(value[0])}
            onValueCommit={(value) => handleDensityChange(value[0])}
            className="w-full"
          />
          <span className="text-sm">High</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
