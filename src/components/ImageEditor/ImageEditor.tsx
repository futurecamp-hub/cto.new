import { useImageEditor } from '../contexts/ImageEditorContext';
import UploadScreen from '../screens/UploadScreen';
import EditScreen from '../screens/EditScreen';
import ResultScreen from '../screens/ResultScreen';

export default function ImageEditor() {
  const { state } = useImageEditor();

  return (
    <div className="relative h-full bg-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cto-primary to-blue-600 z-50" />
      
      {state.currentScreen === 'upload' && <UploadScreen />}
      {state.currentScreen === 'edit' && <EditScreen />}
      {state.currentScreen === 'result' && <ResultScreen />}
    </div>
  );
}
