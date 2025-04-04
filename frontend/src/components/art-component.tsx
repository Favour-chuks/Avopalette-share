import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import CanvasMosiac from "./mosiac/canvasMosiac";
import MosaicCanvas from "./mosiac/testMosiac";

interface ArtComponentProps {
  density?: number;
  colors?: string[]; // Now expects rgba values
  activeItem?: string;
  aspectRatio: number;
}

function ArtComponent({
  density,
  colors,
  activeItem,
  aspectRatio,
}: ArtComponentProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Check if required props are provided
  const hasProps =
    density !== undefined && Array.isArray(colors) && colors.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !hasProps || !activeItem) {
    return (
      <main className="flex-1 h-full w-full p-[16px] rounded-xl overflow-auto">
        <Skeleton
          className="bg-gray-300"
          style={{
            width: "100%",
            height: `calc(100% / ${aspectRatio > 0 ? aspectRatio : 1})`, // Fallback to 1 if aspectRatio is 0
          }}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 h-full w-full p-[16px] rounded-xl">
      <div className="h-full w-full">
        {/* Conditional Rendering Based on activeItem */}
        {activeItem === "bold" && (
          <CanvasMosiac
            density={density || 10}
            colors={colors || ["rgba(0,0,0,1)"]} 
            width={500}
            height={500}
          />
        )}
        {activeItem === "italic" && (
          <MosaicCanvas
          density={density || 10}
          colors={colors || ["rgba(0,0,0,1)"]} 
          aspectRatio={aspectRatio > 0 ? aspectRatio : 1}
          width={500}
          height={500}
        />
        )}
        {activeItem === "strikethrough" && (
          <div>
            <h3 className="text-md line-through">Strikethrough Mode</h3>
            <p>Strikethrough mode is currently disabled.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ArtComponent;
