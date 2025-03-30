import { useMemo } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";

const generateColors = (rows: number, cols: number, colors: string[]) => {
  return useMemo(() => 
    Array.from({ length: rows * cols }, (_, index) => colors[index % colors.length]), 
  [rows, cols]); // Removed `colors` to avoid unnecessary recalculations
};

const precomputeGradientMap = (rows: number, cols: number, width: number, height: number) => {
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
}

export default function MosaicCanvas({ density, colors, width, height, aspectRatio }: MosaicCanvasProps) {
  const adjustedWidth = aspectRatio ? width : width;
  const adjustedHeight = aspectRatio ? width / aspectRatio : height;

  const rows = Math.floor(adjustedHeight / density);
  const cols = Math.floor(adjustedWidth / density);

  const colorData = generateColors(rows, cols, colors);
  const gradientMap = useMemo(() => precomputeGradientMap(rows, cols, adjustedWidth, adjustedHeight), [rows, cols]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Stage width={adjustedWidth} height={adjustedHeight}>
        <Layer>
          <Group>
            {colorData.map((color, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const x = col * density;
              const y = row * density;

              const gradientColor = gradientMap[index];
              const colorValue = parseInt(gradientColor.match(/\d+/)?.[0] || "0", 10);
              const useRandomColor = Math.random() < 0.8 && colorValue < 50;

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={density}
                  height={density}
                  fill={useRandomColor ? color : gradientColor}
                />
              );
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
