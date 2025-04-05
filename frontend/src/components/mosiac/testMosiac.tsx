import { useMemo } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";

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
  const adjustedWidth = width;
  const adjustedHeight = aspectRatio && aspectRatio > 0 ? width / aspectRatio : height;

  const rows = Math.max(1, Math.floor(adjustedHeight / density));
  const cols = Math.max(1, Math.floor(adjustedWidth / density));

  // Correct use of `useMemo`
  const colorData = useMemo(() => 
    Array.from({ length: rows * cols }, (_, index) => colors[index % colors.length]), 
    [rows, cols, colors]
  );

  const gradientMap = useMemo(() => 
    precomputeGradientMap(rows, cols, adjustedWidth, adjustedHeight), 
    [rows, cols, adjustedWidth, adjustedHeight]
  );

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

              // Extract all RGB values properly
              const match = gradientColor.match(/\d+/g);
              const colorValue = match ? parseInt(match[0], 10) : 0;
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
