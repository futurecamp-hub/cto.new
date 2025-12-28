import { useImageEditor } from '../contexts/ImageEditorContext';
import { useState, useRef, useEffect } from 'react';

export default function ResultScreen() {
  const { state, updateState } = useImageEditor();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, 
        ((clientX - rect.left) / rect.width) * 100
      ));
      setSliderPosition(percentage);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging]);

  const handleDownload = () => {
    if (!state.originalImageUrl) return;
    
    const link = document.createElement('a');
    link.href = state.originalImageUrl;
    link.download = 'enhanced-product-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveTemplate = () => {
    updateState({ selectedTemplate: null });
  };

  if (!state.originalImageUrl) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cto-gray to-white">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhancement Result</h1>
          <p className="text-lg text-gray-600">Compare before and after</p>
        </div>

        {/* Before/After Slider */}
        <div className="mb-8">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden" ref={containerRef}>
            <div className="relative aspect-video">
              {/* Before Image */}
              <img 
                src={state.originalImageUrl} 
                alt="Before" 
                className="absolute inset-0 w-full h-full object-contain bg-gray-100"
              />
              
              {/* After Image (currently showing original) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src={state.enhancedImageUrl || state.originalImageUrl} 
                  alt="After" 
                  className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                />
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-cto-primary cursor-ew-resize group"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cto-primary rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                Before
              </div>
              <div className="absolute top-4 right-4 bg-cto-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                After
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Info */}
        {state.generatedPrompt && (
          <div className="mb-8">
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="flex items-center text-cto-primary font-medium hover:text-blue-600 transition-colors"
            >
              <svg className={`w-5 h-5 mr-2 transform transition-transform ${showPrompt ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showPrompt ? 'Hide' : 'Show'} Prompt
            </button>
            
            {showPrompt && (
              <div className="mt-4 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{state.generatedPrompt}</p>
              </div>
            )}
          </div>
        )}

        {/* Template Badge */}
        {state.selectedTemplate && (
          <div className="mb-8">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <span className="font-medium">{state.selectedTemplate.name}</span>
              <button
                onClick={handleRemoveTemplate}
                className="ml-3 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          <button
            onClick={() => updateState({ currentScreen: 'edit' })}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Refine
          </button>

          <button
            onClick={() => alert('Template saving feature coming soon!')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
            </svg>
            Save as Template
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => updateState({ currentScreen: 'upload' })}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Upload
          </button>
        </div>
      </div>
    </div>
  );
}
