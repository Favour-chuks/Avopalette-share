interface ComputeMessage {
 width: number;
 height: number;
 density: number;
}

onmessage = function (e: MessageEvent<ComputeMessage>) {
 const { width, height, density } = e.data;
 const tileSize = Math.sqrt((width * height) / density);
 const grid: { x: number; y: number }[] = [];

 for (let y = 0; y < height; y += tileSize) {
   for (let x = 0; x < width; x += tileSize) {
     grid.push({ x, y });
   }
 }

 postMessage(grid);
};
