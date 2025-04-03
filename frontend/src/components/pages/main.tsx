import { Separator } from "@/components/ui/separator";
import SideBar from "../sidebar";
import Header from "../header";
import ArtComponent from "../art-component";
import { useState } from "react";

export default function MainPage() {
  const [colors, setColors] = useState<string[]>(["#808080"]);
  const [opacities, setOpacities] = useState<number[]>([1]);
  const [density, setDensity] = useState(1);
  const [activeItem, setActiveItem] = useState("");
  const [orientation, setOrientation] = useState("Landscape"); // Default orientation

  const handleColorsChange = (updatedColors: string[], updatedOpacities: number[]) => {
    console.log("Updated colors:", updatedColors);
    console.log("Updated opacities:", updatedOpacities);
    setColors(updatedColors); // Update colors in state
    setOpacities(updatedOpacities); // Update opacities in state
  };

  const handleDensityChange = (updatedDensity: number) => {
    console.log("Updated density:", updatedDensity);
    setDensity(updatedDensity); // Update density in state
  };
  const handleActiveItemChange = (item: string) => {
    console.log("Active item changed to:", item);
    setActiveItem(item); // Update active item in state
  };


  const handleAspectRatioChange = (aspectRatio: string) => {
    setOrientation(aspectRatio); // Update the orientation state
  };

  // Predefined orientation options
  const aspectRatios = [
    { value: "Landscape", label: "Landscape" },
    { value: "Portrait", label: "Portrait" },
    { value: "Square", label: "Square" },
  ];

  return (
    <div className="h-[100vh] p-[24px]">
      <div className="h-full border-gray-200 border rounded-xl">
        {/* Pass orientation, setter, and options to Header */}
        <Header
          orientation={orientation}
          onAspectRatioChange={handleAspectRatioChange}
          aspectRatios={aspectRatios}
        />
        <Separator />
        <div className="flex flex-row h-full p-[24px] gap-[24px] overflow-clip">
          {/* Pass the selected orientation to ArtComponent */}
          <ArtComponent orintation={orientation} density={density} activeItem={activeItem} />

          {/* Sidebar */}
          <SideBar
            initialColors={colors} // Provide default colors
            initialOpacities={opacities} // Provide default opacities
            onColorsChange={handleColorsChange}
            onDensityChange={handleDensityChange}
            onActiveItemChange={handleActiveItemChange}
          />
        </div>
      </div>
    </div>
  );
}