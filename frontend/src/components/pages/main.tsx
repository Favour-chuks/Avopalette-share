import { Separator } from "@/components/ui/separator";
import SideBar from "../sidebar";
import Header from "../header";
import ArtComponent from "../art-component";
import { useState, useEffect, useRef } from "react"; // ✅ Import useEffect
import ErrorBoundary from "../errorHandlers/error";
import { ArtComponentRef } from "../art-component"; // Update this path if needed



export function useElementSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current ) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.min(entry.contentRect.width, 100); // Max 100px width
      const aspectRatio = ref.current ? parseFloat(ref.current.dataset.aspectRatio || "1") : 1; // Default to 1 if undefined
      const height = width / aspectRatio; // Calc height
      setSize({ width, height });
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return size;
}
export default function MainPage() {
  const [colors, setColors] = useState<string[]>(["rgba(128,128,128,1)"]);
  const [density, setDensity] = useState(1);
  const [activeItem, setActiveItem] = useState("");
  const [orientation, setOrientation] = useState("Landscape");
  const [aspectRatio, setAspectRatio] = useState(1.618);
  const [isLoading, setIsLoading] = useState(false);

  const divRef = useRef<HTMLDivElement | null>(null);
  const artComponentRef = useRef<ArtComponentRef | null>(null);
  
  const { width, height } = useElementSize(divRef);
  
  const orientationToAspectRatio: Record<string, number> = {
    Landscape: 1.618,
    Portrait: 1.33,
    Square: 1,
  };

  const handleColorsChange = (updatedColors: string[]) => {
    setColors(updatedColors);
  };

  const handleDensityChange = (updatedDensity: number) => {
    setDensity(updatedDensity);
  };

  const handleActiveItemChange = (item: string) => {
    setActiveItem(item);
  };

  const handleAspectRatioChange = (aspectRatio: string) => {
    setOrientation(aspectRatio);
  };

  
  useEffect(() => {
    setIsLoading(true);}, [colors, activeItem, density]);

  useEffect(() => {
    setAspectRatio(orientationToAspectRatio[orientation] || 1);
  }, [orientation]);

  return (
    <div className="h-[100vh] p-[24px]">
      <div className="border-gray-200 border rounded-xl h-full flex flex-col">
        <Header
          orientation={orientation}
          onAspectRatioChange={handleAspectRatioChange}
          aspectRatios={[
            { value: "1.618", label: "Landscape" },
            { value: "1.33", label: "Portrait" },
            { value: "1", label: "Square" },
          ]}
          artComponentRef={artComponentRef}
        />

        <Separator />
        <div className="flex-1 flex flex-row p-[24px] h-full gap-[24px] overflow-clip">
          <div
            className="relative w-full max-w-[1000px] bg-amber-700 p-5 h-[100] flex flex-col items-center justify-center overflow-hidden "
          >
            <ErrorBoundary>
              <ArtComponent
                height={height}
                width={width}
                density={density}
                colors={colors}
                activeItem={activeItem}
                isLoading={isLoading}
                AspectRatio={aspectRatio}
                ref={artComponentRef}
              />
            </ErrorBoundary>
          </div>

          <div className="mx-auto flex">
            <Separator orientation="vertical" className="mr-6" />
            <SideBar
              initialColors={colors}
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

