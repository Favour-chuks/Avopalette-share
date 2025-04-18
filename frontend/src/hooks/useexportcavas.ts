import { useCallback } from "react";
import { ArtComponentRef } from "../components/art-component"; // Update this path if needed

type ExportParams = {
  title: string;
  description: string;
  keyword: string;
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
};

export function useExportCanvas(ref: React.RefObject<ArtComponentRef | null>) {
  const exportCanvas = useCallback(
    async ({ title, description, keyword, setIsDownloading, setPreview }: ExportParams) => {
      if (!ref.current) {
        console.warn("❌ exportCanvas called but ref is null");
        return;
      }

      try {
        setIsDownloading(true);
        await ref.current.exportCanvas({
          title,
          description,
          keyword,
          setIsDownloading,
          setPreview,
        });
      } catch (err) {
        console.error("💥 Error exporting canvas:", err);
      } finally {
        setIsDownloading(false);
      }
    },
    [ref]
  );

  return { exportCanvas };
}
