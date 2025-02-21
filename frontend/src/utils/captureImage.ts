import html2canvas from 'html2canvas';

export const captureImage = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png');
};