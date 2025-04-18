import { useEffect, useMemo, useLayoutEffect } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";

const precomputeGradientMap = (
  rows: number,
  cols: number,
  width: number,
  height: number
) => {
  return Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (width / cols);
    const y = row * (height / rows);

    const distanceToEdgeX = Math.min(x, width - x);
    const distanceToEdgeY = Math.min(y, height - y);
    const distanceToEdge = Math.min(distanceToEdgeX, distanceToEdgeY);
    const maxDistance = Math.min(width, height) * 0.2;

    const t = Math.min(distanceToEdge / maxDistance, 1);
    const colorValue = Math.floor((1 - t) * 255);

    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  });
};

interface MosaicCanvasProps {
  density: number;
  colors: string[];
  width: number;
  height: number;
  aspectRatio?: number;
  setLoading?: (loading: boolean) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function MosaicCanvas({
  density,
  colors,
  width,
  height,
  aspectRatio,
  setLoading,
  onLoadingChange,
}: MosaicCanvasProps) {
  const adjustedWidth = useMemo(() => width, [width]);

  const adjustedHeight = useMemo(() => {
    return aspectRatio && aspectRatio > 0 ? width / aspectRatio : height;
  }, [aspectRatio, width, height]);

  const rows = useMemo(
    () => Math.max(1, Math.floor(adjustedHeight / density)),
    [adjustedHeight, density]
  );

  const cols = useMemo(
    () => Math.max(1, Math.floor(adjustedWidth / density)),
    [adjustedWidth, density]
  );

  // Trigger loading state on dependency change
  useEffect(() => {
    setLoading?.(true);
    onLoadingChange?.(true);
  }, [rows, cols, colors, setLoading, onLoadingChange]);

  const colorData = useMemo(() => {
    const safeColors = colors.length > 0 ? colors : ["#808080"];
    return Array.from({ length: rows * cols }, (_, index) =>
      safeColors[index % safeColors.length]
    );
  }, [rows, cols, colors]);

  const gradientMap = useMemo(
    () => precomputeGradientMap(rows, cols, adjustedWidth, adjustedHeight),
    [rows, cols, adjustedWidth, adjustedHeight]
  );

  const tiles = useMemo(() => {
    return colorData.map((color, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = col * density;
      const y = row * density;

      const gradientColor = gradientMap[index];
      const match = gradientColor.match(/\d+/g);
      const colorValue = match
        ? Math.floor((+match[0] + +match[1] + +match[2]) / 3)
        : 0;

      // Seeded pseudo-randomness for consistency
      const useRandomColor = (index * 37) % 100 < 80 && colorValue < 50;

      return {
        key: `${row}-${col}`,
        x,
        y,
        fill: useRandomColor ? color : gradientColor,
      };
    });
  }, [colorData, gradientMap, cols, density]);

  // Notify parent after tiles render
  useLayoutEffect(() => {
    const id = setTimeout(() => {
      setLoading?.(false);
      onLoadingChange?.(false);
      console.time("draw");
      console.log("Tiles drawn:", tiles.length);
      console.timeEnd("draw");
    }, 0);
    return () => clearTimeout(id);
  }, [tiles, setLoading, onLoadingChange]);

  return (
    <div className="mosaic-container">
      <Stage width={adjustedWidth} height={adjustedHeight}>
        <Layer>
          <Group>
            {tiles.map((tile) => (
              <Rect
                key={tile.key}
                x={tile.x}
                y={tile.y}
                width={density}
                height={density}
                fill={tile.fill}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
