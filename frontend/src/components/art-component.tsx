import React, {
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import ImageExporter from "../utils/captureImage";

// Lazy-loaded canvas renderers
const MosaicCanvas = lazy(() => import("./mosiac/mosiacCanvasShaded"));
const PixiMosiac = lazy(() => import("./mosiac/pixiCanvas"));

const MosaicWrapper: React.FC<{
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({ children, containerRef }) => (
  <main
    id="art-preview" // ✅ Set an explicit ID
    ref={containerRef}
    className="w-full h-[100%] flex flex-col p-4 text-gray-500 items-center justify-center"
  >
    {children}
  </main>
);

interface ArtComponentProps {
  density?: number;
  colors?: string[];
  activeItem?: string;
  width: number;
  height: number;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  AspectRatio?: number;
}

export interface ArtComponentRef {
  exportCanvas: ({
    title,
    description,
    keyword,
    setIsDownloading,
    setPreview,
  }: {
    title: string;
    description: string;
    keyword: string;
    setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>;
    setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  }) => Promise<void>;
}

const ArtComponent = forwardRef<ArtComponentRef, ArtComponentProps>(
  (
    {
      density = 10,
      colors = ["rgba(0,0,0,1)"],
      activeItem,
      width,
      height,
      isLoading,
      setIsLoading,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const [deferredSize, setDeferredSize] = useState({ width: 100, height: 100 });

    const aspectRatio = width && height ? width / height : 1.618;

    const fadeVariant = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
    };

    const exportCanvas = async ({
      title,
      description,
      keyword,
      setIsDownloading,
      setPreview,
      role = "free",
    }: {
      title: string;
      description: string;
      keyword: string;
      setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>;
      setPreview: React.Dispatch<React.SetStateAction<string | null>>;
      role?: "admin" | "paid" | "free"; // 👈 required for `role = "free"` to work
    }) => {
      if (!containerRef.current) return;

      setIsDownloading(true);

      try {
        const exporter = new ImageExporter({
          element: containerRef.current,
          metadata: {
            title: { en: title },
            description: { en: description },
            keywords: { en: keyword },
            author: "Favour Chuks Okolo",
            copyright: `© ${new Date().getFullYear()} Avopalette`,
          },
          filename: title,
          quality: 0.95,
          format: "jpeg",
        });
        

      const previewImage = await exporter.generatePreview(role);
      if (previewImage) {
        setPreview(previewImage);
      }

      await exporter.download(role);
      } catch (error) {
      console.error("Error capturing component:", error);
      } finally {
      setIsDownloading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      exportCanvas,
    }));

    // Defer width/height if available
    useEffect(() => {
      const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
      schedule(() => {
        setDeferredSize({ width, height });
      });
    }, [width, height]);

    // Reset canvas visibility on item change
    useEffect(() => {
      setCanvasReady(false);
    }, [activeItem]);

    const PlaceholderSkeleton = () => (
      <Skeleton
        className="bg-gray-300"
        style={{
          width: `${deferredSize.width}px`,
          height: `${deferredSize.height}px`,
        }}
      />
    );

    return (
      <MosaicWrapper containerRef={containerRef}>
        <AnimatePresence mode="wait">
          {!activeItem ? (
            <motion.p
              key="no-selection"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-lg"
            >
              🎨 Select a style to begin creating your art
            </motion.p>
          ) : isLoading ? (
            <motion.div
              key="loading"
              className="w-full h-full flex items-center justify-center"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PlaceholderSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key={activeItem}
              className="w-full h-full flex items-center justify-center"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onAnimationComplete={() => {
                setCanvasReady(true); // ✅ Only one state now
              }}
            >
              <div style={{ width: deferredSize.width, height: deferredSize.height }}>
                {canvasReady && (
                  <Suspense fallback={<PlaceholderSkeleton />}>
                    {activeItem === "bold" ? (
                      <PixiMosiac
                        width={deferredSize.width}
                        height={deferredSize.height}
                        density={density}
                        colors={colors}
                        setLoading={setIsLoading}
                      />
                    ) : activeItem === "italic" ? (
                      <MosaicCanvas
                        width={deferredSize.width}
                        height={deferredSize.height}
                        density={density}
                        colors={colors}
                        aspectRatio={aspectRatio}
                        setLoading={setIsLoading}
                      />
                    ) : null}
                  </Suspense>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MosaicWrapper>
    );
  }
);

export default ArtComponent;
