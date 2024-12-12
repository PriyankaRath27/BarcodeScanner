import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { scanBarcodeFromImage } from '../utils/barcodeUtils';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const barcodeValue = await scanBarcodeFromImage(file);
      onScan(barcodeValue);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error processing image');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isProcessing}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
        disabled={isProcessing}
      >
        <Camera className="w-5 h-5" />
        {isProcessing ? 'Processing...' : 'Upload Barcode Image'}
      </button>
    </div>
  );
};

export default BarcodeScanner;