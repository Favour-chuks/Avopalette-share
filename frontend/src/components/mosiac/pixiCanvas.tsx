import { useEffect, useRef, useState } from "react";
import {
  Application,
  Geometry,
  Buffer,
  Shader,
  Mesh,
  Container,
  BufferUsage,
  GlProgram,
} from "pixi.js";
import ComputeWorker from "../../workers/computeGrid.workers.ts?worker";
import ColorWorker from "../../workers/processColors.workers.ts?worker";

interface Props {
  width: number;
  height: number;
  density: number;
  colors: string[];
  setLoading?: (loading: boolean) => void;
}

export default function PixiMosaic({
  width,
  height,
  density,
  colors,
  setLoading,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [gridData, setGridData] = useState<{ x: number; y: number }[] | null>(null);
  const [colorData, setColorData] = useState<string[] | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const mountTimeRef = useRef<number>(performance.now());

  // ========== STEP 1: COMPUTE GRID AND COLORS ==========
  useEffect(() => {
    let destroyed = false;

    const computeWorker = new ComputeWorker();
    const colorWorker = new ColorWorker();

    setLoading?.(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      computeWorker.postMessage({ width, height, density });
    }, 300);

    computeWorker.onmessage = (e) => {
      if (destroyed) return;

      const grid = e.data;
      setGridData(grid);

      colorWorker.postMessage({ colors, tileCount: grid.length });
    };

    colorWorker.onmessage = (e) => {
      if (destroyed) return;

      setColorData(e.data);
      setLoading?.(false);
    };

    return () => {
      destroyed = true;
      computeWorker.terminate();
      colorWorker.terminate();
    };
  }, [width, height, density, colors, setLoading]);

  // ========== STEP 2: RENDER ONCE DATA IS READY ==========
  useEffect(() => {
    if (!gridData || !colorData || !canvasRef.current) return;

    const app = new Application();
    appRef.current = app;

    const init = async () => {
      await app.init({
        width,
        height,
        background: "#000000",
        antialias: true,
        resolution: window.devicePixelRatio,
      });

      if (!canvasRef.current) return;

      canvasRef.current.innerHTML = ""; // Clear previous canvas
      canvasRef.current.appendChild(app.canvas);

      const timeToPaint = performance.now() - mountTimeRef.current;
      console.log(`🎨 Pixi canvas mounted in ${timeToPaint.toFixed(2)}ms`);

      const container = new Container();
      app.stage.addChild(container);

      const positions: number[] = [];
      const colorsAttr: number[] = [];
      const tileSize = Math.sqrt((width * height) / density);

      for (let i = 0; i < gridData.length; i++) {
        const { x, y } = gridData[i];
        const color = colorData[i];
        if (!color) continue;

        const rgb = parseInt(color.replace("#", ""), 16);
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = rgb & 255;

        // Push 6 vertices for 2 triangles per tile
        positions.push(x, y, x + tileSize, y, x, y + tileSize);
        positions.push(x + tileSize, y, x + tileSize, y + tileSize, x, y + tileSize);

        for (let j = 0; j < 6; j++) {
          colorsAttr.push(r / 255, g / 255, b / 255);
        }
      }

      const geometry = new Geometry();
      geometry.addAttribute("a_position", {
        buffer: new Buffer({
          data: new Float32Array(positions),
          usage: BufferUsage.STATIC,
        }),
        format: "float32x2",
      });
      geometry.addAttribute("a_color", {
        buffer: new Buffer({
          data: new Float32Array(colorsAttr),
          usage: BufferUsage.STATIC,
        }),
        format: "float32x3",
      });


      const vertexSrc = `
        precision mediump float;
        attribute vec2 a_position;
        attribute vec3 a_color;
        varying vec3 vColor;

        void main() {
          gl_Position = vec4((a_position / vec2(${width.toFixed(1)}, ${height.toFixed(1)})) * 2.0 - 1.0, 0, 1);
          vColor = a_color;
        }
      `;

      const fragmentSrc = `
        precision mediump float;
        varying vec3 vColor;

        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `;

      const program = new GlProgram({ vertex: vertexSrc, fragment: fragmentSrc });
      const shader = new Shader({ glProgram: program });
      const mesh = new Mesh({ geometry, shader });

      container.addChild(mesh);
    };

    init();

    return () => {
      app.destroy(true, { children: true });
    };
  }, [gridData, colorData, width, height, density]);

  return <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
