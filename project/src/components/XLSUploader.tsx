import React, { useRef } from 'react';
import { FileUp } from 'lucide-react';

interface XLSUploaderProps {
  onUpload: (file: File) => void;
}

const XLSUploader: React.FC<XLSUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
      >
        <FileUp className="w-5 h-5" />
        Upload XLS Database
      </button>
    </div>
  );
};

export default XLSUploader;