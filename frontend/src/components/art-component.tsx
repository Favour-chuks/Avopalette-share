import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

const CanvasMosiac = lazy(() => import("./mosiac/canvasMosiac"));
const MosaicCanvas = lazy(() => import("./mosiac/testMosiac"));

interface ArtComponentProps {
  density?: number;
  colors?: string[];
  activeItem?: string;
  aspectRatio: number;
}

function ArtComponent({ density = 10, colors = ["rgba(0,0,0,1)"], activeItem, aspectRatio }: ArtComponentProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Memoized values
  const safeAspectRatio = useMemo(() => Math.max(aspectRatio, 1), [aspectRatio]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !activeItem) {
    return (
      <main className="flex-1 h-full w-full p-[16px] rounded-xl overflow-auto">
        <Skeleton className="bg-gray-300" style={{ width: "100%", height: `calc(100% / ${safeAspectRatio})` }} />
      </main>
    );
  }

  return (
    <main className="flex-1 h-full w-full p-[16px] rounded-xl">
      <Suspense fallback={<Skeleton className="w-full h-full bg-gray-200" />}>
        {activeItem === "bold" && <CanvasMosiac density={density} colors={colors} width={500} height={500} />}
        {activeItem === "italic" && <MosaicCanvas density={density} colors={colors} aspectRatio={safeAspectRatio} width={500} height={500} />}
      </Suspense>
    </main>
  );
}

export default ArtComponent;
