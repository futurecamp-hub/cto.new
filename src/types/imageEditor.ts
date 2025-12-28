export type Template = {
  id: string;
  name: string;
  marketplace: 'WB' | 'Ozon' | 'Both';
  description: string;
}

export type Style = 'minimal' | 'premium' | 'eco' | 'fashion' | 'tech' | 'lifestyle';
export type Mood = 'clean' | 'warm' | 'bright' | 'dark' | 'professional';

export type EditorState = {
  originalImage: File | null;
  originalImageUrl: string | null;
  marketplace: 'WB' | 'Ozon' | 'Both';
  selectedTemplate: Template | null;
  selectedStyles: Style[];
  selectedMood: Mood | null;
  userDescription: string;
  generatedPrompt?: string;
  enhancedImageUrl?: string;
  currentScreen: 'upload' | 'edit' | 'result';
}

export type ImageEditorContextType = {
  state: EditorState;
  updateState: (partial: Partial<EditorState>) => void;
  resetEditor: () => void;
}
