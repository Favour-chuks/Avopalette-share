// import CollageIndex from "./assets/components/collageIndex";
// import ColorGrid from "./assets/components/colorGrid";
import MosaicCanvas from "./assets/components/styles/mosiac/mosiacCanvasShaded";
// import ScewedCanvasMosaic from "./assets/components/styles/mosiac/scewedMosiac";
// import ShareButton from "./assets/components/share"

function App() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* <CollageIndex>
      <ColorGrid/>
      </CollageIndex>       */}
      {/* <ShareButton/> */}
      {/* <ScewedCanvasMosaic/> */}
      <MosaicCanvas />
      <div style={{
        display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%', // Ensure the parent container has a defined height
              width: '100%', // Ensure the parent container has a defined width
              position: 'absolute',
              top: 0,
              left: 0}}>
        <div
          style={{
            height: "80%",
            width: "80%",
            padding: '5%',
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            zIndex: 1,
            backdropFilter: "blur(8px)", // Apply blur to the background
            WebkitBackdropFilter: "blur(8px)", // For Safari support
          }}>
          <h1>Your React Component</h1>
          <p>This is a paragraph.</p>
        </div>

      </div>
    </div>
  );
}

export default App;
