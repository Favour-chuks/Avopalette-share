import MosaicCanvas from "./components/mosiac/testMosiac";
import MainPage from "./components/pages/main";

function App() {
  return (
    <>
      <MosaicCanvas
        density={10}
        colors={[
          "rgba(239, 17, 17, 1)",
          "rgba(229, 143, 14, 1)",
          "rgba(168, 239, 17, 1)",
          "rgba(17, 225, 132, 1)",
          "rgba(16, 227, 233, 1)",
          "rgba(16, 45, 243, 1)",
        ]}
        width={500}
        height={500}
        aspectRatio={1.0}
      />
      <MainPage />
    </>
  );
}

export default App;
