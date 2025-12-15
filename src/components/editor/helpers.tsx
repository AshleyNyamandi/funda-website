import { Editor, Transforms, Element as SlateElement } from 'slate';
import type { Node } from 'slate';
import type { Editor as SlateEditorType } from 'slate';
import type { CustomElement } from './types';

export const LIST_TYPES: CustomElement['type'][] = ['numbered-list', 'bulleted-list'];
export const ALIGNABLE_TYPES: CustomElement['type'][] = ['paragraph', 'heading-one', 'heading-two', 'quote', 'code'];

export const isBoldMarkActive = (editor: SlateEditorType) => {
  const marks = Editor.marks(editor as any);
  return marks ? (marks as any).bold === true : false;
};

export const isItalicMarkActive = (editor: SlateEditorType) => {
  const marks = Editor.marks(editor as any);
  return marks ? (marks as any).italic === true : false;
};

export const isUnderlineMarkActive = (editor: SlateEditorType) => {
  const marks = Editor.marks(editor as any);
  return marks ? (marks as any).underline === true : false;
};

export const isSuperscriptActive = (editor: SlateEditorType) => {
  const marks = Editor.marks(editor as any);
  return marks ? (marks as any).superscript === true : false;
};

export const isSubscriptActive = (editor: SlateEditorType) => {
  const marks = Editor.marks(editor as any);
  return marks ? (marks as any).subscript === true : false;
};

export const isCodeBlockActive = (editor: SlateEditorType) => {
  const [match] = Editor.nodes(editor as any, {
    match: (n: Node) => SlateElement.isElement(n) && (n as SlateElement).type === 'code',
  });
  return !!match;
};

export const isBlockActive = (editor: SlateEditorType, format: string) => {
  const [match] = Editor.nodes(editor as any, {
    match: (n: Node) => SlateElement.isElement(n) && (n as SlateElement).type === format,
  });
  return !!match;
};

export const toggleBoldMark = (editor: SlateEditorType) => {
  const isActive = isBoldMarkActive(editor);
  if (isActive) {
    Editor.removeMark(editor as any, 'bold');
  } else {
    Editor.addMark(editor as any, 'bold', true);
  }
};

export const toggleItalicMark = (editor: SlateEditorType) => {
  const isActive = isItalicMarkActive(editor);
  if (isActive) {
    Editor.removeMark(editor as any, 'italic');
  } else {
    Editor.addMark(editor as any, 'italic', true);
  }
};

export const toggleUnderlineMark = (editor: SlateEditorType) => {
  const isActive = isUnderlineMarkActive(editor);
  if (isActive) {
    Editor.removeMark(editor as any, 'underline');
  } else {
    Editor.addMark(editor as any, 'underline', true);
  }
};

export const toggleSuperscript = (editor: SlateEditorType) => {
  const isActive = isSuperscriptActive(editor);
  if (isActive) {
    Editor.removeMark(editor as any, 'superscript');
  } else {
    const marks = Editor.marks(editor as any);
    if (marks && (marks as any).subscript) Editor.removeMark(editor as any, 'subscript');
    Editor.addMark(editor as any, 'superscript', true);
  }
};

export const toggleSubscript = (editor: SlateEditorType) => {
  const isActive = isSubscriptActive(editor);
  if (isActive) {
    Editor.removeMark(editor as any, 'subscript');
  } else {
    const marks = Editor.marks(editor as any);
    if (marks && (marks as any).superscript) Editor.removeMark(editor as any, 'superscript');
    Editor.addMark(editor as any, 'subscript', true);
  }
};

export const isHighlightActive = (editor: SlateEditorType, color: string) => {
  const marks = Editor.marks(editor as any);
  return marks ? (marks as any).highlight === color : false;
};

export const toggleHighlight = (editor: SlateEditorType, color: string) => {
  const marks = Editor.marks(editor as any);
  const current = marks && (marks as any).highlight;
  if (!color) {
    // clear highlight
    Editor.removeMark(editor as any, 'highlight');
    return;
  }
  if (current === color) {
    Editor.removeMark(editor as any, 'highlight');
  } else {
    Editor.addMark(editor as any, 'highlight', color);
  }
};

export const isAlignActive = (editor: SlateEditorType, align: 'left' | 'center' | 'right') => {
  const [matchWithAlign] = Editor.nodes(editor as any, {
    match: (n: Node) => SlateElement.isElement(n) && ((n as any).align === align),
  });
  if (align === 'left') {
    const [anyAlign] = Editor.nodes(editor as any, {
      match: (n: Node) => SlateElement.isElement(n) && ((n as any).align !== undefined),
    });
    return !anyAlign || !!matchWithAlign;
  }
  return !!matchWithAlign;
};

export const toggleAlign = (editor: SlateEditorType, align: 'left' | 'center' | 'right') => {
  const isActive = isAlignActive(editor, align);
  Transforms.setNodes(
    editor as any,
    { align: isActive ? undefined : align } as Partial<SlateElement>,
    {
      match: (n: Node) => SlateElement.isElement(n) && ALIGNABLE_TYPES.includes((n as any).type),
      split: true,
    }
  );
};

export const toggleBlock = (editor: SlateEditorType, format: CustomElement['type']) => {
  const isList = LIST_TYPES.includes(format as any);
  const isActive = isBlockActive(editor as any, format as string);

  if (isList) {
    Transforms.unwrapNodes(editor as any, {
      match: (n: Node) => SlateElement.isElement(n) && LIST_TYPES.includes((n as SlateElement).type as CustomElement['type']),
      split: true,
    });
  }

  Transforms.setNodes(
    editor as any,
    { type: isActive ? 'paragraph' : isList ? 'list-item' : format } as Partial<SlateElement>,
    { match: (n: Node) => SlateElement.isElement(n) && Editor.isBlock(editor as any, n as CustomElement), split: true }
  );

  if (!isActive && isList) {
    const block: SlateElement = { type: format as string, children: [] } as SlateElement;
    Transforms.wrapNodes(editor as any, block, {
      match: (n: Node) => SlateElement.isElement(n) && (n as SlateElement).type === 'list-item',
    });
  }
};

export const toggleList = (editor: SlateEditorType, format: 'numbered-list' | 'bulleted-list') => {
  toggleBlock(editor, format);
};

export const toggleCodeBlock = (editor: SlateEditorType) => {
  toggleBlock(editor, 'code');
};

export const insertImage = (editor: SlateEditorType, url: string) => {
  const image: CustomElement = { type: 'image', url, children: [{ text: '' }] } as CustomElement;
  Transforms.insertNodes(editor as any, image as unknown as Node);
};

export const insertDivider = (editor: SlateEditorType) => {
  const divider: CustomElement = { type: 'divider', children: [{ text: '' }] } as CustomElement;
  Transforms.insertNodes(editor as any, divider as unknown as Node);
};

export const insertMath = (editor: SlateEditorType, latex: string, display: 'inline' | 'block' = 'block') => {
  const math: CustomElement = { type: 'math', latex, display, children: [{ text: '' }] } as CustomElement;
  Transforms.insertNodes(editor as any, math as unknown as Node);
};
