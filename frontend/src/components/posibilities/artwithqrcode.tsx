import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function AbstractArtWithQR({ imageUrl, qrData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawImageWithQR = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      await img.decode();

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const qrUrl = await QRCode.toDataURL(qrData);
      const qrImg = new Image();
      qrImg.src = qrUrl;
      await qrImg.decode();

      const qrSize = Math.floor(img.width * 0.1);
      ctx.globalAlpha = 0.7;
      ctx.drawImage(qrImg, img.width - qrSize - 20, img.height - qrSize - 20, qrSize, qrSize);
      ctx.globalAlpha = 1;
    };

    drawImageWithQR();
  }, [imageUrl, qrData]);

  return <canvas ref={canvasRef} className="w-full h-auto rounded-2xl shadow-lg" />;
}  
