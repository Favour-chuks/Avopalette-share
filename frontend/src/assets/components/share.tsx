import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

interface ComponentProps {
  children: React.ReactNode;
}

function Share({ children }: ComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null); // Reference for the div

  const handleDownload = async () => {
    if (containerRef.current) {
      try {
        // Convert the component into an image using html2canvas
        const canvas = await html2canvas(containerRef.current);
        const image = canvas.toDataURL("image/png");

        // Download the image
        const link = document.createElement("a");
        link.download = "collage.png";
        link.href = image;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    } else {
      console.error("Container reference is null");
    }
  };

  const handleShare = async () => {
    if (containerRef.current) {
      try {
        // Convert the component into an image using html2canvas
        const canvas = await html2canvas(containerRef.current);
        const image = canvas.toDataURL("image/png");

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([], "")] })) {
          try {
            const blob = await fetch(image).then((res) => res.blob());
            const file = new File([blob], "share.png", { type: "image/png" });
            await navigator.share({
              title: 'Avo pics Palette',
              files: [file],
            });
          } catch (error) {
            console.error("Share failed:", error);
          }
        } else {
          // Fallback: Download the image
          const link = document.createElement("a");
          link.download = "AvopicsPalette.png";
          link.href = image;
          link.click();
        }
      } catch (error) {
        console.error("Error generating image:", error);
      }
    } else {
      console.error("Container reference is null");
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <div ref={containerRef}>
          {children}
        </div>
      </div>

      {/* buttons and stuff */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px'
      }}>
        <button
          onClick={handleShare}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Share
        </button>

        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Share;