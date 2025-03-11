import { Stage, Layer, Rect } from 'react-konva';

const generateColors = (rows:any, cols:any) => {
  return Array.from({ length: rows * cols }, () => 
    '#' + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0')
  );
};

export default function CanvasMosiac() {
  const rows = 80;
  const cols = 80;
  const pixelSize = 10;
  const colors = generateColors(rows, cols);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {colors.map((color, index) => (
          <Rect
            key={index}
            x={(index % cols) * pixelSize}
            y={Math.floor(index / cols) * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={color}
          />
        ))}
      </Layer>
    </Stage>
  );
}