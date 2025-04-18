import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
// import ColorGrid from './colorintersection';

interface Image {
  src: string;
  left: number;
  top: number;
  rotation: number;
}

interface componentProps {
  children: React.ReactNode;
}


function  CollageIndex ({children}:componentProps) {
  const containerRef = useRef<HTMLDivElement>(null); // Reference for the div
  const [images, setImages] = useState<Image[]>([]); // State to hold images
  const predefinedImages = [
    '/images/img1.png',
    '/images/img2.jpg',
    '/images/img3.jpg',
    '/images/img4.jpg',
  ]; // Replace with your actual image URLs
  const maxImages = 200; // Maximum number of images to generate
  const padding = 10; // Extra spacing around the container for overflow
  const imageSize = 150; // Initial image size in pixels
  let title;
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // imageSize = 70; // Initial image size in pixels
      const totalWidth = containerWidth + padding * 15;
      const totalHeight = containerHeight + padding * 15;

      const imagesToRender: Image[] = [];
      for (let i = 0; i < maxImages; i++) {
        // Randomize position within the container
        const randomLeft = Math.random() * (totalWidth - imageSize) - (10 * padding);
        const randomTop = Math.random() * (totalHeight - imageSize) - (10 * padding);
        const randomImage = predefinedImages[Math.floor(Math.random() * predefinedImages.length)];
        imagesToRender.push({
          src: randomImage,
          left: randomLeft,
          top: randomTop,
          rotation: Math.random() * 360, // Random rotation for each image
        });
      }
      setImages(imagesToRender);
    }
  }, [containerRef]);

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
  }
  //* to handle image sharing
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
              title: title || 'share palette',
              files: [file],
            });
          } catch (error) {
            console.error("Share failed:", error);
          }
        } else {
          // Fallback: Download the image
          const link = document.createElement("a");
          link.download = "share.png";
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
    <div style={{
    display:'grid',
    placeItems:'center',
  }}>
    <div ref={containerRef} style={{ 
      position: 'relative', 
      width: '80vw', 
      height: '80vh',  
      backgroundColor: 'blue',
      overflow: 'clip',
      }}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          style={{
            position: 'absolute',
            left: `${image.left}px`,
            top: `${image.top}px`,
            width: `${imageSize}px`,
            height: `${imageSize}px`,
            transform: `rotate(${image.rotation}deg)`,
            margin: '10px',
          }}
          className="rounded"
          alt={`Collage image ${index}`}
        />
      ))}
       <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', // Ensure the parent container has a defined height
          width: '100%', // Ensure the parent container has a defined width
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            height: '60%',
            width: '80%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 1,
            backdropFilter: 'blur(8px)', // Apply blur to the background
            WebkitBackdropFilter: 'blur(8px)', // For Safari support
            // borderRadius: '10px',
          }}
          className='textContainer'
        >
         {children}
        </div>
      </div>
    </div>
    </div>

{/* buttons and stuff */}
    <div style={{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      gap:'20px',
      marginTop:'20px'
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
      share
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
      download
    </button>
    </div>
  </div>
  );
};

export default CollageIndex;