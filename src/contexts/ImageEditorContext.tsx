import { createContext, useContext, useEffect, useState } from 'react';
import { EditorState, ImageEditorContextType } from '../types/imageEditor';
import { IMAGE_EDITOR_TEMPLATES } from '../constants/imageEditorTemplates';

const defaultState: EditorState = {
  originalImage: null,
  originalImageUrl: null,
  marketplace: 'Both',
  selectedTemplate: null,
  selectedStyles: [],
  selectedMood: null,
  userDescription: '',
  currentScreen: 'upload',
};

const ImageEditorContext = createContext<ImageEditorContextType | null>(null);

export function ImageEditorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EditorState>(() => {
    const savedState = localStorage.getItem('cto_image_editor_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          ...defaultState,
          ...parsed,
          originalImage: null, // Files can't be serialized
          selectedTemplate: parsed.selectedTemplateId 
            ? IMAGE_EDITOR_TEMPLATES.find(t => t.id === parsed.selectedTemplateId) || null
            : null,
        };
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    const stateToSave = {
      ...state,
      originalImage: null,
      selectedTemplateId: state.selectedTemplate?.id || null,
    };
    localStorage.setItem('cto_image_editor_state', JSON.stringify(stateToSave));
  }, [state]);

  const updateState = (partial: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const resetEditor = () => {
    setState(defaultState);
    localStorage.removeItem('cto_image_editor_state');
  };

  return (
    <ImageEditorContext.Provider value={{ state, updateState, resetEditor }}>
      {children}
    </ImageEditorContext.Provider>
  );
}

export function useImageEditor() {
  const context = useContext(ImageEditorContext);
  if (!context) {
    throw new Error('useImageEditor must be used within ImageEditorProvider');
  }
  return context;
}
