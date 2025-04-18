import { useEffect, useMemo, useLayoutEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";

const generateColors = (
  rows: number,
  cols: number,
  colors: string[]
): string[] => {
  if (colors.length === 0) {
    throw new Error("Colors array is empty! Please provide at least one color.");
  }

  return Array.from({ length: rows * cols }, (_, i) => colors[i % colors.length]);
};

interface CanvasMosaicProps {
  density: number;
  colors: string[];
  width: number;
  height: number;
  setLoading?: (value: boolean) => void;
  onLoadingChange?: (value: boolean) => void;
}

export default function CanvasMosaic({
  density,
  colors,
  width,
  height,
  setLoading,
  onLoadingChange,
}: CanvasMosaicProps) {
  const rows = useMemo(() => Math.max(1, Math.floor(height / density)), [height, density]);
  const cols = useMemo(() => Math.max(1, Math.floor(width / density)), [width, density]);

  const pixelSize = useMemo(() => density, [density]);

  // Inform parent we're loading
  useEffect(() => {
    setLoading?.(true);
    onLoadingChange?.(true);
  }, [rows, cols, colors, setLoading, onLoadingChange]);

  const tiles = useMemo(() => {
    const flatColors = generateColors(rows, cols, colors);
    return flatColors.map((fill, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      return {
        key: `${row}-${col}`,
        x: col * pixelSize,
        y: row * pixelSize,
        fill,
      };
    });
  }, [rows, cols, colors, pixelSize]);

  // Inform parent we're done rendering
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      setLoading?.(false);
      onLoadingChange?.(false);
    });
    console.time("draw");
    console.log("Tiles drawn:", tiles.length);
    console.timeEnd("draw");

    return () => cancelAnimationFrame(id);
  }, [tiles, setLoading, onLoadingChange]);

  return (
    <Stage width={width} height={height}>
      <Layer>
        {tiles.map((tile) => (
          <Rect
            key={tile.key}
            x={tile.x}
            y={tile.y}
            width={pixelSize}
            height={pixelSize}
            fill={tile.fill}
          />
        ))}
      </Layer>
    </Stage>
  );
}




// * can render up to density 1 

/** 
 * ! TODO: 
 * ! 1. color correction 
 * !
 */


import { 
  // useEffect,
   useRef, useState } from "react";
import { Application, Graphics, Container } from "pixi.js";
import TileWorker from "../../src/workers/computeTiles.workers.ts?worker";

interface Props {
  width: number;
  height: number;
  density: number;
  colors: string[];
}

export function PixiMosaic({ width, height, density, colors }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null); // Ref to hold the div where the canvas will mount
  const appRef = useRef<Application | null>(null); // Ref to hold the PixiJS Application instance
  const workerRef = useRef<Worker | null>(null); // Ref to hold the Web Worker instance
  const [loading, setLoading] = useState(true); // State to track loading UI
  const [isMounted, setIsMounted] = useState(false); // Lazy load: track whether component is visible

  useEffect(() => {
    // Guard clause: don’t do anything unless component is visible and canvas is mounted
    if (!isMounted || !canvasRef.current || !colors.length) return;

    // ✅ Create and assign the web worker
    const worker = new TileWorker();
    workerRef.current = worker;

    // ✅ Create and assign the PixiJS application
    const app = new Application();
    appRef.current = app;

    let destroyed = false; // Flag to prevent side-effects if component unmounts early

    const init = async () => {
      // Initialize the PixiJS app with size and settings
      await app.init({
        width,
        height,
        background: "#ffffff",
        antialias: true,
      });

      // Make sure canvas container exists
      if (!canvasRef.current) {
        console.warn("Canvas container not found");
        return;
      }

      // Mount Pixi's canvas into the DOM
      canvasRef.current.appendChild(app.canvas);

      // Add a container to group all the graphics
      const container = new Container();
      app.stage.addChild(container);

      // 🚀 Send data to the Web Worker to do heavy grid math
      worker.postMessage({ width, height, density, colors });

      // 🎯 Handle worker response — draw colored tiles based on grid data
      worker.onmessage = (e) => {
        if (destroyed) return; // Prevent running if app already unmounted

        const data = e.data as { x: number; y: number; color: string }[];
        for (const { x, y, color } of data) {
          const g = new Graphics();
          g.beginFill(parseInt(color.replace("#", ""), 16)); // Convert hex color to number
          g.drawRect(x, y, density, density); // Draw square tile
          g.endFill();
          container.addChild(g);
        }

        // Done drawing, remove loading indicator
        setLoading(false);
      };

      // Handle worker-level errors
      worker.onerror = (e) => {
        console.error("Worker error", e);
      };
    };

    init(); // Kick off everything

    // ✅ Cleanup on unmount: destroy worker + Pixi app
    return () => {
      destroyed = true;
      worker.terminate(); // Kill worker thread
      app.destroy(true, { children: true }); // Clean up Pixi memory
    };
  }, [isMounted, width, height, density, colors]);

  // 👀 Lazy mount logic: only load Pixi when component is visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsMounted(true); // Only when it's in view
    });

    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect(); // Clean up observer
  }, []);

  return (
    <div>
      {/* 👻 Optional loading indicator while the grid is rendering */}
      {loading && <p>Loading...</p>}
      {/* 🎨 Div where PixiJS will mount its canvas */}
      <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
