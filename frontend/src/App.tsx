// import CollageIndex from "./assets/components/collageIndex";
// import ColorGrid from "./assets/components/colorGrid";
// import Footer from "./assets/components/footer";
// import MosaicCanvas from "./components/mosiac/mosiacCanvasShaded";
// import Share from "./assets/components/share";
// import { Button } from "./components/ui/button";
import MosaicCanvas from "./components/mosiac/testMosiac";
import MainPage from "./components/pages/main";
// import Page from "./components/pages/pages";
// import ScewedCanvasMosaic from "./assets/components/styles/mosiac/scewedMosiac";
// import ShareButton from "./assets/components/share";

function App() {
  return (
    <>
    
      <MosaicCanvas 
        density={10} 
        colors={["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]} 
        width={500} 
        height={500} 
        aspectRatio={1.618}
      />
      <MainPage/>
    </>
  );
}

export default App;
