
import { useContext } from 'react';
import { EditorContentContext } from '../context/EditorContext';

export const useEditorContent = () => {
  const context = useContext(EditorContentContext);
  
  if (context === undefined) {
    throw new Error('useEditorContent must be used within an EditorProvider');
  }
  
  return context;
};