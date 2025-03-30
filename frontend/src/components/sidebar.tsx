import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import ColorPicker from "./color-picker";
import { SelectAspectRatio } from "./aspect-ratio-selector";

function SideBar() {
  const [activeItem, setActiveItem] = useState("");
  const [density, setDensity] = useState(1);
  const [selectedColors, setSelectedColors] = useState([
    "#aabbcc",
    "#ddeeff",
    "#112233",
    "#445566",
    "#778899",
  ]);
  const [opacities, setOpacities] = useState([1, 1, 1, 1, 1]); // Default opacity = 1 for all

  const handleDensityChange = (newDensity: number) => {
    setDensity(newDensity);
    // Placeholder for inherited function call
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
  };

  return (
    <div className="flex flex-col gap-4 h-full w-[200px]">
      {/* Color Picker Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Color Picker</h2>
        <div className="flex justify-between">
          {selectedColors.map((color, index) => (
            <ColorPicker
              key={index}
              index={index}
              color={color}
              opacity={opacities[index]}
              onChange={handleColorChange}
            />
          ))}
        </div>
      </div>

      {/* Toggle Group Section */}
      <div className="flex flex-col gap-2 min-h-[58px]">
        <h2 className="text-lg font-semibold">Mode</h2>
        <ToggleGroup
          type="single"
          value={activeItem}
          onValueChange={(value) => setActiveItem(value)}
          size="custom"
          className="w-full bg-gray-200 p-1 rounded-lg"
        >
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
            disabled
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Density Slider Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Density</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Low</span>
          <input
            type="range"
            min="1"
            max="100000"
            value={density}
            onChange={(e) => handleDensityChange(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">High</span>
        </div>
      </div>

      {/* this is for the aspect ratio toggle */}

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Density</h2>
        <div className="flex items-center gap-2">
          {/* this is going to return the aspect ratio that would be passed in to the item */}
          <SelectAspectRatio/>
          </div>
      </div>
    </div>
  );
}

export default SideBar;