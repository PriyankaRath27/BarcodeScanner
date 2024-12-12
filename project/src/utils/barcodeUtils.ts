import { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource } from '@zxing/library';

export const scanBarcodeFromImage = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.src = e.target?.result as string;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const length = imageData.width * imageData.height;
        const luminances = new Uint8ClampedArray(length);

        for (let i = 0; i < length; i++) {
          const r = imageData.data[i * 4];
          const g = imageData.data[i * 4 + 1];
          const b = imageData.data[i * 4 + 2];
          luminances[i] = ((r + g + b) / 3) & 0xFF;
        }

        const source = new RGBLuminanceSource(luminances, imageData.width, imageData.height);
        const bitmap = new BinaryBitmap(new HybridBinarizer(source));
        const reader = new MultiFormatReader();
        
        const result = reader.decode(bitmap);
        if (result) {
          resolve(result.getText());
        } else {
          reject(new Error('No barcode found in image'));
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process image'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(imageFile);
  });
};