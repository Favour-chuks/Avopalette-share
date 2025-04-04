import { Separator } from "@/components/ui/separator";
import SideBar from "../sidebar";
import Header from "../header";
import ArtComponent from "../art-component";
import { useState, useEffect } from "react"; // ✅ Import useEffect
import ErrorBoundary from "../errorHandlers/error";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export default function MainPage() {
  const [colors, setColors] = useState<string[]>(["rgba(128,128,128,1)"]);
  const [density, setDensity] = useState(1);
  const [activeItem, setActiveItem] = useState("");
  const [orientation, setOrientation] = useState("Landscape"); // Default orientation
  const [aspectRatio, setAspectRatio] = useState(1.618); // ✅ Define aspectRatio

  // Map orientation to aspect ratio
  const orientationToAspectRatio: Record<string, number> = {
    Landscape: 1.618,
    Portrait: 1.33,
    Square: 1,
  };

  const handleColorsChange = (updatedColors: string[]) => {
    console.log("Updated colors:", updatedColors);
    setColors(updatedColors);
  };

  const handleDensityChange = (updatedDensity: number) => {
    console.log("Updated density:", updatedDensity);
    setDensity(updatedDensity);
  };

  const handleActiveItemChange = (item: string) => {
    console.log("Active item changed to:", item);
    setActiveItem(item);
  };

  const handleAspectRatioChange = (aspectRatio: string) => {
    setOrientation(aspectRatio);
  };

  // Predefined orientation options
  const aspectRatios = [
    { value: "1.618", label: "Landscape" },
    { value: "1.33", label: "Portrait" },
    { value: "1", label: "Square" },
  ];

  useEffect(() => {
    setAspectRatio(orientationToAspectRatio[orientation] || 1); // Default to 1 if orientation is invalid
  }, [orientation]);

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
          <AspectRatio ratio={aspectRatio}>
            <ErrorBoundary>
              <ArtComponent
                density={density}
                colors={colors}
                activeItem={activeItem}
                aspectRatio={aspectRatio} // Pass aspectRatio to ArtComponent
              />
            </ErrorBoundary>
          </AspectRatio>

          <div className="ml-auto flex">
            <Separator orientation="vertical" className="mr-6" />
            {/* Sidebar */}
            <SideBar
              initialColors={colors} // Now contains rgba values
              onColorsChange={handleColorsChange}
              onDensityChange={handleDensityChange}
              onActiveItemChange={handleActiveItemChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
