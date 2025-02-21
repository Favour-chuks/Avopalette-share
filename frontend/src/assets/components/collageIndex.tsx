import React, { useState, useEffect, useRef } from 'react';
// import html2canvas from 'html2canvas';

interface Image {
  src: string;
  left: number;
  top: number;
  rotation: number;
}

interface componentProps {
  children: React.ReactNode;
}

function CollageIndex({ children }: componentProps) {
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
  const imageSize = 200; // Initial image size in pixels

  const resizeImage = async (src: string, width: number, height: number): Promise<string> => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
    }
    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    const loadImages = async () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const totalWidth = containerWidth + padding * 15;
        const totalHeight = containerHeight + padding * 15;

        const imagesToRender: Image[] = [];
        for (let i = 0; i < maxImages; i++) {
          // Randomize position within the container
          const randomLeft = Math.random() * (totalWidth - imageSize) - (10 * padding);
          const randomTop = Math.random() * (totalHeight - imageSize) - (10 * padding);
          const randomImage = predefinedImages[Math.floor(Math.random() * predefinedImages.length)];
          const resizedImage = await resizeImage(randomImage, imageSize, imageSize);
          imagesToRender.push({
            src: resizedImage,
            left: randomLeft,
            top: randomTop,
            rotation: Math.random() * 360, // Random rotation for each image
          });
        }
        setImages(imagesToRender);
      }
    };

    loadImages();
  }, [containerRef]);

  return (
    <div>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '80vw',
            height: '80vh',
            backgroundColor: 'blue',
            overflow: 'clip',
          }}
        >
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
              className="textContainer"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollageIndex;