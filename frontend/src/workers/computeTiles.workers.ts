self.onmessage = function (e) {
 const { width, height, density, colors } = e.data;
 const result = [];

 const rows = Math.floor(height / density);
 const cols = Math.floor(width / density);

 for (let row = 0; row < rows; row++) {
   for (let col = 0; col < cols; col++) {
     const x = col * density;
     const y = row * density;
     const color = colors[Math.floor(Math.random() * colors.length)];
     result.push({ x, y, color });
   }
 }

 self.postMessage(result);
};
// This will be called if the worker encounters an error
self.onerror = function (e) {
  console.error("Worker error: ", e);
};