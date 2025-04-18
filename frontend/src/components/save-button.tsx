import React, { useState } from "react";
import { ImageDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import { DialogDemo } from "./popup";
// import ImageExporter from "../utils/captureImage";
import { useExportCanvas } from "@/hooks/useexportcavas";

useExportCanvas;
interface SaveButtonProps {
  artComponentRef: React.RefObject<HTMLDivElement | null>; // Reference to the component to capture
  title: string; // Title for the download
  description?: string; // Description for the preview
  keyword?: string; // Keywords for the image
}

const SaveButton: React.FC<SaveButtonProps> = ({
  artComponentRef,
  title,
  description = "Preview of the captured component", // Default description
  keyword,
}) => {
  const [preview, setPreview] = useState<string | null>(null); // Preview image URL
  const [isDownloading, setIsDownloading] = useState(false); // Loading state

  // const handleSave = async () => {
  //   if (!artComponentRef.current) return;

  //   setIsDownloading(true);

  //   try {
  //     // Create an instance of ImageExporter
  //     const exporter = new ImageExporter({
  //       elementId: artComponentRef.current?.id || "",
  //       metadata: {
  //         title: {
  //           en: "Component Preview",
  //         },
  //         description: {
  //           en: description,
  //         },
  //         keywords: {
  //           en: keyword || "preview, component, image",
  //         },
  //         author: "Your Name",
  //         copyright: `© ${new Date().getFullYear()} Your Company`,
  //       },
  //       filename: `${title}.jpg`,
  //       quality: 0.95,
  //     });

  //     // Generate preview image
  //     const previewImage = await exporter.generatePreview();
  //     if (previewImage) {
  //       setPreview(previewImage); // Set preview image URL
  //     }

  //     // Download the image with EXIF metadata
  //     await exporter.download();
  //   } catch (error) {
  //     console.error("Error capturing component:", error);
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const handleClick = () => {
    useExportCanvas({
      title,
      description: description || "Preview of the captured component",
      keyword: keyword || "generative, pixel, wow",
      setIsDownloading,
      setPreview,
    });
  };
  return (
    <div className="save-button">
      <Button
        onClick={handleClick}
        onClickCapture={() => {
          console.log(
            "this is the component reference",
            artComponentRef.current
          );
        }}
        disabled={isDownloading}
        size="custom"
        variant="outline"
        className="min-w-[70px] bg-blue-500 text-white hover:bg-blue-500 px-2 py-1">
        {isDownloading ? "Downloading..." : <ImageDownIcon />}
      </Button>

      {preview && (
        <>
          <DialogDemo
            trigger={isDownloading}
            onClose={() => setPreview(null)}
            title={title}
            previewImageUrl={preview} // Pass the preview image URL to the dialog
          />
        </>
      )}
    </div>
  );
};

export default SaveButton;
