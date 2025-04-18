/**
 * ! still need to set the watermark image that ill be using
 */

import { toJpeg, toPng, toBlob } from 'html-to-image';
import piexif from 'piexifjs';

interface Metadata {
  description?: Record<string, string>;
  title?: Record<string, string>;
  keywords?: Record<string, string>;
  author?: string;
  copyright?: string;
  software?: string;
  lang?: string;
}

interface ImageExporterOptions {
  element: HTMLElement | null;
  metadata?: Metadata;
  filename?: string;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  watermark?: string | HTMLImageElement;
}

type UserRole = 'admin' | 'paid' | 'free';

export default class ImageExporter {
  private element: HTMLElement | null;
  private metadata: Metadata;
  private filename: string;
  private quality: number;
  private format: 'jpeg' | 'webp' | 'png';
  private watermark: string | HTMLImageElement | undefined;

  constructor({
    element,
    metadata = {},
    filename = 'export',
    quality = 0.95,
    format = 'jpeg',
    watermark,
  }: ImageExporterOptions) {
    this.element = element;
    this.metadata = metadata;
    this.quality = Math.min(Math.max(quality, 0), 1); // ✅ Clamp between 0 and 1
    this.format = format;
    this.watermark = watermark;

    const cleanFilename = filename?.trim() || 'Untitled-01';
    this.filename = `${cleanFilename}.${format}`; // ✅ Avoid empty filenames
  }

  setWatermarkBasedOnUserRole(userRole: UserRole): void {
    if (userRole === 'admin' || userRole === 'paid') {
      this.watermark = undefined;
    } else if (userRole === 'free') {
      // const logo = new Image();
      // logo.src = '/path/to/free-user-logo.png';
      this.watermark =  "memory made. pixiart" // logo; //! this was suppsed to be the logo before
    }
  }

  private _strToByteArray(str: string): number[] {
    return Array.from(new TextEncoder().encode(str));
  }

  private _generateExif(): Record<string, any> {
    const {
      description = {},
      title = {},
      keywords = {},
      author = '',
      copyright = '',
      software = 'ImageExporter (React)',
      lang = 'en',
    } = this.metadata;

    const fallbackLang = lang || 'en';
    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    return {
      '0th': {
        [piexif.ImageIFD.ImageDescription]: description[fallbackLang] || '',
        [piexif.ImageIFD.Artist]: author,
        [piexif.ImageIFD.Copyright]: copyright,
        [piexif.ImageIFD.Software]: software,
        [piexif.ImageIFD.DateTime]: now,
        [piexif.ImageIFD.XPTitle]: this._strToByteArray(title[fallbackLang] || ''),
        [piexif.ImageIFD.XPKeywords]: this._strToByteArray(keywords[fallbackLang] || ''),
      },
      Exif: {
        [piexif.ExifIFD.UserComment]: this._strToByteArray(
          JSON.stringify({ description, title, keywords }, null, 2)
        ),
      },
      GPS: {},
    };
  }

  private async _addWatermark(dataUrl: string): Promise<string> {
    if (!this.watermark) return dataUrl;
  
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
  
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  
    if (typeof this.watermark === 'string') {
      // Config
      const fontSize = Math.max(16, img.width * 0.015);
      const padding = 20;
      const text = this.watermark.toLowerCase();
      ctx.font = `${fontSize}px 'Courier New', monospace`;
  
      // Measure text width and height
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;
  
      const x = img.width - textWidth - padding;
      const y = img.height - padding;
  
      // Sample background color to decide on text color
      const sampleX = Math.floor(img.width - 10);
      const sampleY = Math.floor(img.height - 10);
      const sample = ctx.getImageData(sampleX, sampleY, 1, 1).data;
      const brightness = (sample[0] * 299 + sample[1] * 587 + sample[2] * 114) / 1000;
      const isDarkBackground = brightness < 128;
  
      // Draw translucent background strip
      ctx.fillStyle = isDarkBackground ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      ctx.fillRect(x - 10, y - textHeight + 5, textWidth + 20, textHeight);
  
      // Draw text with shadow
      ctx.shadowColor = isDarkBackground ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = isDarkBackground ? '#ffffff' : '#000000';
      ctx.fillText(text, x, y);
    }
  
    return canvas.toDataURL(`image/${this.format === 'jpeg' ? 'jpeg' : 'png'}`);
  }
  

  async generatePreview(userRole: UserRole): Promise<string | null> {
    if (!this.element) {
      console.error('Element not found.');
      return null;
    }

    try {
      this.setWatermarkBasedOnUserRole(userRole);

      let dataUrl: string;
      if (this.format === 'jpeg') {
        dataUrl = await toJpeg(this.element, { quality: this.quality });
      } else if (this.format === 'png') {
        dataUrl = await toPng(this.element, { quality: this.quality });
      } else if (this.format === 'webp') {
        const blob = await toBlob(this.element, { quality: this.quality, type: 'image/webp' });
        if (!blob) throw new Error('Failed to create blob for webp format');
        dataUrl = URL.createObjectURL(blob);
      } else {
        throw new Error('Unsupported image format');
      }

      return await this._addWatermark(dataUrl);
    } catch (error) {
      console.error('Error generating preview image:', error);
      return null;
    }
  }

  async download(userRole: UserRole): Promise<void> {
    if (!this.element) {
      console.error('Element not found.');
      return;
    }

    try {
      this.setWatermarkBasedOnUserRole(userRole);

      let dataUrl: string;
      if (this.format === 'jpeg') {
        dataUrl = await toJpeg(this.element, { quality: this.quality });
      } else if (this.format === 'png') {
        dataUrl = await toPng(this.element, { quality: this.quality });
      } else if (this.format === 'webp') {
        const blob = await toBlob(this.element, { quality: this.quality, type: 'image/webp' });
        if (!blob) throw new Error('Failed to create blob for webp format');
        dataUrl = URL.createObjectURL(blob);
      } else {
        throw new Error('Unsupported image format');
      }

      dataUrl = await this._addWatermark(dataUrl);

      let finalDataUrl = dataUrl;
      if (this.format === 'jpeg' && dataUrl.startsWith('data:image/jpeg')) {
        const exifBytes = piexif.dump(this._generateExif());
        finalDataUrl = piexif.insert(exifBytes, dataUrl);
      } else if (this.format === 'jpeg') {
        console.warn("Skipping EXIF embed — not a valid JPEG base64 string");
      }

      const link = document.createElement('a');
      link.download = this.filename;
      link.href = finalDataUrl;
      link.click();

      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  }
}
