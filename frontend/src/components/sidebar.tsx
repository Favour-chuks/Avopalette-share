import React from "react";
// import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { Slider } from "./ui/slider";
import ColorPicker from "./color-picker";

function SideBar() {
  const [activeItem, setActiveItem] = React.useState<string>("");
  const [density, setDensity] = React.useState<number[]>([50]);
  const [opacity, setOpacity] = React.useState<number[]>([100]);
  const [selectedColor, setSelectedColor] = React.useState<string[]>([
    "#aabbcc",
    "#ddeeff",
    "#112233",
    "#445566",
    "#778899",
  ]);

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...selectedColor];
    updatedColors[index] = newColor;
    setSelectedColor(updatedColors);
  };

  return (
    <div className="flex flex-col gap-[16px] h-full w-[200px]">
      <div>
        <h2>Color Picker</h2>
        <div>
          {selectedColor.map((index: any, color: any) => (
            <ColorPicker
              key={index}
              color={color}
              onColorChange={(newColor: string) =>
                handleColorChange(index, newColor)
              }
            />
          ))}
        </div>
      </div>
      {/* toggle groups */}
      <div className="flex flex-col gap-[8px] min-h-[58px]">
        <h2>Mode</h2>
        <ToggleGroup
          type="single"
          value={activeItem}
          onValueChange={(value) => setActiveItem(value)}
          size="custom"
          className="w-full bg-gray-200 p-1 rounded-lg">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* density sliders */}
      <div className="flex flex-col gap-[16px] min-h-[58px]">
        <span className="flex flex-row justify-between">
          <h2>Density</h2>{" "}
          <span className="flex justify-center w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {density}%
          </span>
        </span>
        <Slider
          defaultValue={density}
          max={100}
          step={1}
          onValueChange={(value) => setDensity(value)}
        />
      </div>

      {/* opacity sliders */}
      <div className="flex flex-col gap-[16px] min-h-[58px]">
        <span className="flex flex-row justify-between">
          <h2>opacity</h2>{" "}
          <span className="flex justify-center w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {opacity}%
          </span>
        </span>
        <Slider
          defaultValue={opacity}
          max={100}
          step={1}
          onValueChange={(value) => setOpacity(value)}
        />
      </div>
    </div>
  );
}

export default SideBar;
