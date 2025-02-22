import { useState, useEffect, useMemo, useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const generateColors = (rows: number, cols: number): string[] => {
  return Array.from({ length: rows * cols }, () => 
    `#${Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0')}`
  );
};

const calculateGradientColor = (x: number, y:any, width:any, height:any): string => {
  const distanceToEdgeX = Math.min(x, width - x);
  const distanceToEdgeY = Math.min(y, height - y);
  const distanceToEdge = Math.min(distanceToEdgeX, distanceToEdgeY);
  const maxDistance = Math.min(width, height) * 0.2; // 20% of the smaller dimension
  const t = Math.min(distanceToEdge / maxDistance, 1);
  const colorValue = Math.floor((1 - t) * 255); // Adjusted to make the edges white and the center black
  return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
};

export default function MosaicCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set dimensions
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pixelSize = 10;
  const rows = Math.floor(dimensions.height / pixelSize);
  const cols = Math.floor(dimensions.width / pixelSize);

  const colors = useMemo(() => generateColors(rows, cols), [rows, cols]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {colors.map((color, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = col * pixelSize;
            const y = row * pixelSize;
            const gradientColor = calculateGradientColor(x, y, dimensions.width, dimensions.height);

            // Replace 80% of the dark section with randomly generated colors
            const randomColorThreshold = 0.8;
            const match = gradientColor.match(/\d+/g);
            const colorValue = match ? parseInt(match[0], 10) : 0; // Extract the grayscale value
            const useRandomColor = Math.random() < randomColorThreshold && colorValue < 50; // Adjust threshold as needed

            return (
              <Rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={pixelSize}
                height={pixelSize}
                fill={useRandomColor ? color : gradientColor}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}