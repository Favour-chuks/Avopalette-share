import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import CanvasMosiac from "./mosiac/canvasMosiac";
import MosaicCanvas from "./mosiac/testMosiac";

interface ArtComponentProps {
  density?: number;
  colors?: string[];
  activeItem?: string;
  orintation?: string;
}

function ArtComponent({
  density,
  colors,
  activeItem,
  orintation,
}: ArtComponentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(0);

  // Update aspectRatio when orintation changes
  useEffect(() => {
    switch (orintation) {
      case "Landscape":
        setAspectRatio(1.618);
        break;
      case "Portrait":
        setAspectRatio(1.33);
        break;
      case "Square":
        setAspectRatio(1);
        break;
      default:
        setAspectRatio(0); // Default value if orientation is invalid
        break;
    }
  }, [orintation]); // Dependency array ensures this runs only when orintation changes

  // Check if required props are provided
  const hasProps = density !== undefined && colors?.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !hasProps) {
    return (
      <main className="flex-1 h-full w-full p-[16px] rounded-xl overflow-auto">
        <Skeleton
          className="bg-gray-300"
          style={{
            width: "100%",
            height: `calc(100% / ${aspectRatio || 1})`, // Fallback to 1 if aspectRatio is 0
          }}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 h-full w-full p-[16px] rounded-xl overflow-auto">
      <div className="h-full w-full">
        {/* Conditional Rendering Based on activeItem */}
        {activeItem === "bold" && (
          <div>
            <CanvasMosiac
              density={density}
              colors={colors}
              width={500}
              height={500}
            />
          </div>
        )}
        {activeItem === "italic" && (
          <div>
            <MosaicCanvas
              density={density || 10}
              colors={[
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#FFFF00",
                "#FF00FF",
                "#00FFFF",
              ]}
              aspectRatio={aspectRatio}
              width={500}
              height={500}
            />
          </div>
        )}
        {activeItem === "strikethrough" && (
          <div>
            <h3 className="text-md line-through">Strikethrough Mode</h3>
            <p>Strikethrough mode is currently disabled.</p>
          </div>
        )}
        {!activeItem && (
          <div>
            <h3 className="text-md">No Mode Selected</h3>
            <p>Please select a mode to see the content.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ArtComponent;
