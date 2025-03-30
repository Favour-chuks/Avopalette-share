import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import CanvasMosiac from './mosiac/canvasMosiac';

function ArtComponent({ density, colors, activeItem }: { density?: number; colors?: string[]; activeItem?: string; 
  }) {
  const [isLoading, setIsLoading] = useState(true);

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
        <Skeleton className="h-full w-full bg-gray-300" />
      </main>
    );
  }

  return (
    <main className="flex-1 h-full w-full p-[16px] rounded-xl overflow-auto">
      <div className="h-full w-full">
        {/* Conditional Rendering Based on activeItem */}
        {activeItem === 'bold' && (
          <div>
            <CanvasMosiac
              density={density}
              colors={colors}
              width={500}
              height={500}
            />
          </div>
        )}
        {activeItem === 'italic' && (
          <div>
            <MosaicCanvas
              density={density}
              colors={colors}
              width={500}
              height={500}
            />
            </div>
        )}
        {activeItem === 'strikethrough' && (
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