import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  highlight?: string;
};

export type CustomElement =
  | { type: 'paragraph'; align?: 'left' | 'center' | 'right'; children: CustomText[] }
  | { type: 'heading-one'; align?: 'left' | 'center' | 'right'; children: CustomText[] }
  | { type: 'heading-two'; align?: 'left' | 'center' | 'right'; children: CustomText[] }
  | { type: 'bulleted-list'; children: CustomElement[] }
  | { type: 'numbered-list'; children: CustomElement[] }
  | { type: 'list-item'; children: CustomText[] }
  | { type: 'quote'; children: CustomText[] }
  | { type: 'code'; children: CustomText[] }
  | { type: 'image'; url: string; children: CustomText[] }
  | { type: 'math'; latex: string; display?: 'inline' | 'block'; children: CustomText[] }
  | { type: 'divider'; children: CustomText[] };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export {};
