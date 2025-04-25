import { useState, useEffect } from "react";
import MainPage from "./components/pages/main";
import PixiMosiac from "./components/mosiac/pixiCanvas";
// import MosaicCanvas from "./components/mosiac/mosiacCanvasShaded";
function App() {
  const [isScreenCompatible, setIsScreenCompatible] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const screenWidth = window.innerWidth;
      // Set the condition for compatibility (e.g., minimum width of 768px)
      setIsScreenCompatible(screenWidth >= 768);
    };

    // Check screen size on initial render
    checkScreenSize();

    // Add event listener to handle screen resizing
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isScreenCompatible) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Screen Size Not Supported
          </h1>
          <p className="text-gray-700">
            This application is not compatible with your current screen size.
            Please use a device with a larger screen.
          </p>
        </div>
      </div>
    );
  }
  

  const generateRandomHexColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, "0")}`;
  };

  const generateHexColors = (count: number) => {
    const colors = new Set<string>();
    while (colors.size < count) {
      colors.add(generateRandomHexColor());
    }
    return Array.from(colors);
  };

  const hexColors = generateHexColors(1000);
  
  
  return (
    <>
       <PixiMosiac
        width={800}
        height={800}
        density={200000}
        colors={hexColors}
      />
      {/* <MosaicCanvas
        width={800}
        height={800}
        density={10}
        colors={hexColors}
      />  */}
      <MainPage />
    </>
  );
}

export default App;
