import { useImageEditor } from '../contexts/ImageEditorContext';
import { useState, useRef, useCallback } from 'react';

export default function UploadScreen() {
  const { updateState } = useImageEditor();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateState({
          originalImage: file,
          originalImageUrl: imageUrl,
          currentScreen: 'edit'
        });
      };
      reader.readAsDataURL(file);
    }
  }, [updateState]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cto-gray to-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Image Editor</h1>
          <p className="text-lg text-gray-600">Enhance your product photos for marketplaces</p>
        </div>

        <div
          className={`
            relative border-4 border-dashed rounded-3xl p-20 text-center cursor-pointer
            transition-all duration-300 ease-in-out transform
            ${isDragging 
              ? 'border-cto-primary bg-blue-50 scale-105' 
              : 'border-gray-300 bg-white/80 hover:border-cto-primary hover:bg-gray-50 hover:scale-105'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cto-primary to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Upload your product photo
          </h2>
          <p className="text-gray-600 text-lg mb-2">Drag and drop your image here</p>
          <p className="text-gray-500 mb-6">or click to browse</p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Supports JPG, PNG
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cto-primary to-blue-600 text-white text-lg font-semibold rounded-full hover:from-blue-600 hover:to-cto-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Select File
          </button>
        </div>
      </div>
    </div>
  );
}
