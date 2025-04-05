import { useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";

const generateColors = (rows: number, cols: number, colors: string[]) => {
  console.log("Generating colors...", colors);
  
  if (colors.length === 0) {
    console.warn("Warning: Colors array is empty! Using fallback color.");
    colors = ["#808080"]; // Default color if empty
  }

  return Array.from({ length: rows * cols }, (_, index) => ({
    color: colors[index % colors.length],
  }));
};

interface CanvasMosiacProps {
  density: number;
  colors: string[];
  width: number;
  height: number;
}

export default function CanvasMosiac({ density, colors, width, height }: CanvasMosiacProps) {
  const rows = Math.floor(height / density);
  const cols = Math.floor(width / density);
  const pixelSize = density;

  // Memoize colorData to avoid unnecessary recalculations
  const colorData = useMemo(() => generateColors(rows, cols, colors), [rows, cols, colors]);

  return (
    <Stage width={width} height={height}>
      <Layer>
        {colorData.map((data, index) => (
          <Rect
            key={index}
            x={(index % cols) * pixelSize}
            y={Math.floor(index / cols) * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={data.color}
          />
        ))}
      </Layer>
    </Stage>
  );
}
