import { useImageEditor } from '../contexts/ImageEditorContext';
import { useState, useEffect } from 'react';
import { IMAGE_EDITOR_TEMPLATES } from '../constants/imageEditorTemplates';
import type { Style, Mood, Template } from '../types/imageEditor';

export default function EditScreen() {
  const { state, updateState } = useImageEditor();
  const [description, setDescription] = useState(state.userDescription);

  useEffect(() => {
    setDescription(state.userDescription);
  }, [state.userDescription]);

  const handleTemplateSelect = (template: Template) => {
    updateState({ 
      selectedTemplate: template,
      marketplace: template.marketplace 
    });
  };

  const handleStyleToggle = (style: Style) => {
    const newStyles = state.selectedStyles.includes(style)
      ? state.selectedStyles.filter(s => s !== style)
      : [...state.selectedStyles, style];
    updateState({ selectedStyles: newStyles });
  };

  const handleMoodSelect = (mood: Mood) => {
    updateState({ selectedMood: mood });
  };

  const handleMarketplaceChange = (marketplace: 'WB' | 'Ozon' | 'Both') => {
    updateState({ marketplace });
  };

  const handleEnhance = () => {
    const prompt = `Improve this product image for ${state.marketplace} marketplace. 
Style: ${state.selectedStyles.join(', ') || 'not specified'}
Mood: ${state.selectedMood || 'not specified'}
Template: ${state.selectedTemplate?.name || 'none'}
Description: ${description}`;

    console.log('Enhancing image with parameters:', {
      marketplace: state.marketplace,
      template: state.selectedTemplate,
      styles: state.selectedStyles,
      mood: state.selectedMood,
      description,
      prompt
    });

    updateState({ 
      userDescription: description,
      generatedPrompt: prompt,
      currentScreen: 'result',
      enhancedImageUrl: state.originalImageUrl
    });
  };

  if (!state.originalImageUrl) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cto-gray to-white">
      <div className="flex h-screen">
        {/* Original Image Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Original product</h2>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
            <img 
              src={state.originalImageUrl} 
              alt="Original product" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Edit Controls */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhance Your Image</h1>
              <p className="text-lg text-gray-600">Customize settings for your marketplace</p>
            </div>

            {/* Marketplace Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Marketplace</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['WB', 'Ozon', 'Both'] as const).map((marketplace) => (
                  <button
                    key={marketplace}
                    onClick={() => handleMarketplaceChange(marketplace)}
                    className={`
                      flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300
                      ${state.marketplace === marketplace
                        ? 'bg-cto-primary text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {marketplace === 'Both' ? 'Both Marketplaces' : ` ${marketplace}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Templates</label>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {IMAGE_EDITOR_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`
                      flex-shrink-0 w-64 p-6 bg-white rounded-2xl border-2 cursor-pointer
                      transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                      ${state.selectedTemplate?.id === template.id
                        ? 'border-cto-primary bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cto-primary to-blue-600 rounded-xl mr-3 flex items-center justify-center text-white font-bold">
                        {template.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Styles (select multiple)</label>
              <div className="flex flex-wrap gap-3">
                {['minimal', 'premium', 'eco', 'fashion', 'tech', 'lifestyle'].map((style) => (
                  <button
                    key={style}
                    onClick={() => handleStyleToggle(style as Style)}
                    className={`
                      px-5 py-3 rounded-full font-medium transition-all duration-300 transform
                      ${state.selectedStyles.includes(style as Style)
                        ? 'bg-cto-primary text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }
                    `}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Mood (select one)</label>
              <div className="flex flex-wrap gap-3">
                {['clean', 'warm', 'bright', 'dark', 'professional'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood as Mood)}
                    className={`
                      px-5 py-3 rounded-2xl font-medium transition-all duration-300 transform
                      ${state.selectedMood === mood
                        ? 'bg-cto-primary text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }
                    `}
                  >
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Describe how you want the image to look
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Clean Apple-style studio photo, white background, premium lighting"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-cto-primary focus:outline-none transition-colors duration-300 resize-none"
                maxLength={500}
              />
              <div className="mt-2 text-right text-sm text-gray-500">
                {description.length}/500
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => updateState({ currentScreen: 'upload' })}
                className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
              >
                Back
              </button>
              <button
                onClick={handleEnhance}
                disabled={!state.originalImage}
                className={`
                  flex-1 px-8 py-4 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105
                  ${state.originalImage
                    ? 'bg-gradient-to-r from-cto-primary to-blue-600 text-white hover:from-blue-600 hover:to-cto-primary shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Enhance Image
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
