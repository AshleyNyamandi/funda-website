import React, { createContext, useState } from 'react';
import type { Descendant } from 'slate';

export type EditorContentContextType = {
  content: Descendant[];
  setContent: (next: Descendant[]) => void;
};

export const EditorContentContext = createContext<EditorContentContextType | undefined>(undefined);

const DEFAULT_CONTENT: Descendant[] = [
  { type: 'paragraph', children: [{ text: '' }] } as any,
];

export const EditorProvider = ({
  children,
  initialContent = DEFAULT_CONTENT,
}: {
  children: React.ReactNode;
  initialContent?: Descendant[];
}) => {
  const [content, setContent] = useState<Descendant[]>(initialContent);

  return (
    <EditorContentContext.Provider value={{ content, setContent }}>
      {children}
    </EditorContentContext.Provider>
  );
};

export default EditorProvider;
