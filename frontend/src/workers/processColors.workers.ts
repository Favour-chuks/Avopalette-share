// processColors.worker.ts
interface ColorMessage {
 colors: string[];
 tileCount: number;
}

onmessage = function (e: MessageEvent<ColorMessage>) {
 const { colors, tileCount } = e.data;
 const colorData: string[] = [];

 for (let i = 0; i < tileCount; i++) {
   const color = colors[i % colors.length];
   colorData.push(color);
 }

 postMessage(colorData);
};
