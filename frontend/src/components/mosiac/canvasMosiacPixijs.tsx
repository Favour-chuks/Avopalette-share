import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { string2hex } from "@pixi/utils";

interface MosaicPixiCgrapanvasProps {
  width: number;
  height: number;
  density: number;
  colors: string[];
}

export default function MosaicPixiCanvas({
  width,
  height,
  density,
  colors,
}: MosaicPixiCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0xffffff,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    canvasRef.current?.appendChild(app.view as HTMLCanvasElement);

    const container = new PIXI.Container();
    app.stage.addChild(container);

    const rows = Math.floor(height / density);
    const cols = Math.floor(width / density);

    const innerWidth = width * 0.8;
    const innerHeight = height * 0.8;
    const innerX = width * 0.1;
    const innerY = height * 0.1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * density;
        const y = row * density;

        const inCore =
          x >= innerX &&
          x < innerX + innerWidth &&
          y >= innerY &&
          y < innerY + innerHeight;

        const graphics = new PIXI.Graphics();

        let fillColor: string;

        if (inCore) {
          // 🎨 Random color from provided array
          fillColor =
            colors[Math.floor(Math.random() * colors.length)] || "#999999";
        } else {
          // 🌑 Border grayscale gradient
          const distanceToEdgeX = Math.min(x, width - x);
          const distanceToEdgeY = Math.min(y, height - y);
          const distanceToEdge = Math.min(distanceToEdgeX, distanceToEdgeY);
          const maxDistance = Math.min(width, height) * 0.2;

          const t = Math.min(distanceToEdge / maxDistance, 1);
          const value = Math.floor((1 - t) * 255);
          fillColor = `rgb(${value}, ${value}, ${value})`;
        }

        graphics.beginFill(string2hex(fillColor));
        graphics.drawRect(x, y, density, density);
        graphics.endFill();
        container.addChild(graphics);
      }
    }

    return () => {
      app.destroy(true, { children: true });
    };
  }, [width, height, density, colors]);

  return <div ref={canvasRef} className="w-full h-full" />;
}

//! this code worked but the gradient wasnt dark enough
// import { Application, Container, Graphics } from 'pixi.js';

// (async () => {
// // Helper function to convert hex or rgb string to a number
// const string2hex = (color) => {
//   if (color.startsWith("#")) {
//     return parseInt(color.slice(1), 16);
//   }

//   const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//   if (match) {
//     const [, r, g, b] = match.map(Number);
//     return (r << 16) + (g << 8) + b;
//   }

//   return 0x999999; // fallback color
// }
//   const width = 600;
//   const height = 600;
//   const density = 5;
//   const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFD700"];

//   // create a new application
//   const app = new Application();

//   // initialize the app
//   await app.init({ background: '#1099bb', width, height });
//   document.body.appendChild(app.canvas);

//   const container = new Container();
//   app.stage.addChild(container);

//   const rows = Math.floor(height / density);
//   const cols = Math.floor(width / density);

//   const innerWidth = width * 0.8;
//   const innerHeight = height * 0.8;
//   const innerX = width * 0.1;
//   const innerY = height * 0.1;

//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const x = col * density;
//       const y = row * density;

//       const inCore =
//         x >= innerX &&
//         x < innerX + innerWidth &&
//         y >= innerY &&
//         y < innerY + innerHeight;

//       const graphics = new Graphics();

//       let fillColor;

//       if (inCore) {
//         fillColor =
//           colors[Math.floor(Math.random() * colors.length)] || "#999999";
//       } else {
//         const distanceToEdgeX = Math.min(x, width - x);
//         const distanceToEdgeY = Math.min(y, height - y);
//         const distanceToEdge = Math.min(distanceToEdgeX, distanceToEdgeY);
//         const maxDistance = Math.min(width, height) * 0.2;

//         const t = Math.min(distanceToEdge / maxDistance, 1);
//         const value = Math.floor((1 - t) * 255);
//         fillColor = `rgb(${value}, ${value}, ${value})`;
//       }

//       graphics.beginFill(string2hex(fillColor));
//       graphics.drawRect(x, y, density, density);
//       graphics.endFill();
//       container.addChild(graphics);
//     }
//   }
// })();
