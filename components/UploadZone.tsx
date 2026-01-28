import React, { useCallback } from 'react';
import { ImagePlus, Camera } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  disabled: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, previewUrl, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="absolute inset-0 w-full h-full group cursor-pointer tap-highlight-transparent"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
      />
      
      {!previewUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-zinc-50/50">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm">
            <ImagePlus className="w-6 h-6 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
          </div>
          <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
            Tap to Select
          </p>
        </div>
      )}
      
      {/* Minimal hover hint when image exists */}
      {previewUrl && !disabled && (
         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
             <span className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-white font-medium text-xs md:text-sm bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                 Change Image
             </span>
         </div>
      )}
    </div>
  );
};

export default UploadZone;