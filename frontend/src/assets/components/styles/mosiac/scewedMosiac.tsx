import { useEffect, useRef } from "react";

const ScewedCanvasMosaic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set the canvas width and height to be larger than the container's dimensions
      const containerWidth = canvas.offsetWidth;
      const containerHeight = canvas.offsetHeight;
      canvas.width = containerWidth * 1.5; // 50% larger than the container
      canvas.height = containerHeight * 1.5; // 50% larger than the container

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Define the width and height of the rectangles
        const rectWidth = Math.min(containerWidth, containerHeight) * 0.08; // 10% of the smaller dimension
        const rectHeight = Math.min(containerWidth, containerHeight) * 0.16; // 20% of the smaller dimension
        const overlapFactor = 20; // Controls overlapping randomness

        // Define the start and end colors for the gradient
        const startColor = { r: 255, g: 0, b: 0 }; // Red
        const endColor = { r: 0, g: 0, b: 255 }; // Blue

        for (let i = 0; i < 50000; i++) { // Increase the number of shapes
          const x = Math.random() * (width + overlapFactor) - overlapFactor;
          const y = Math.random() * (height + overlapFactor) - overlapFactor;
          const rotation = (Math.random() - 0.5) * 360; // Rotate randomly

          // Calculate the color based on the position with added randomness
          const t = x / width; // Interpolation factor based on x position
          const randomFactor = Math.random() * 0.2 - 0.1; // Random factor between -0.1 and 0.1
          const r = startColor.r + (t + randomFactor) * (endColor.r - startColor.r);
          const g = startColor.g + (t + randomFactor) * (endColor.g - startColor.g);
          const b = startColor.b + (t + randomFactor) * (endColor.b - startColor.b);
          const color = `rgba(${r}, ${g}, ${b}, 1)`; // Add transparency

          ctx.save();
          ctx.translate(x + rectWidth / 2, y + rectHeight / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillStyle = color;

          // Add shadow properties
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'; // Shadow color
          ctx.shadowBlur = 5; // Shadow blur radius
          ctx.shadowOffsetX = 5; // Horizontal shadow offset
          ctx.shadowOffsetY = 5; // Vertical shadow offset

          ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
          ctx.restore();
        }
      }
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ width: "150%", height: "150%", position: "absolute", top: "-25%", left: "-25%" }} />
    </div>
  );
};

export default ScewedCanvasMosaic;