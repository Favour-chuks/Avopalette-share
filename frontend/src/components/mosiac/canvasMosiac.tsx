import { Stage, Layer, Rect } from 'react-konva';

const generateColors = (rows: number, cols: number, colors: string[]) => {
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
  const colorData = generateColors(rows, cols, colors);

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