import React, { useRef } from 'react';
import { Editor } from 'slate';
import {
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
  Heading1,
  Heading2,
  Quote,
  Code,
  Image as ImageIcon,
  Divide,
  Sigma,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Subscript,
  Superscript
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import {
  toggleBlock,
  toggleList,
  toggleCodeBlock,
  isCodeBlockActive,
  toggleBoldMark,
  toggleItalicMark,
  toggleUnderlineMark,
  toggleSuperscript,
  toggleSubscript,
  toggleHighlight,
  isHighlightActive,
  toggleAlign,
  isAlignActive,
  insertImage,
  insertDivider,
  isBlockActive,
  isBoldMarkActive,
  isItalicMarkActive,
  isUnderlineMarkActive,
  isSuperscriptActive,
  isSubscriptActive,
} from './helpers';

const Toolbar = ({ editor, onInsertMath }: { editor: Editor; onInsertMath: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    insertImage(editor, url);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => toggleBlock(editor, 'heading-one')}
          isActive={isBlockActive(editor, 'heading-one')}
          icon={Heading1}
          tooltip="Heading 1"
        />
        <ToolbarButton
          onClick={() => toggleBlock(editor, 'heading-two')}
          isActive={isBlockActive(editor, 'heading-two')}
          icon={Heading2}
          tooltip="Heading 2"
        />
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => toggleAlign(editor, 'left')}
          isActive={isAlignActive(editor, 'left')}
          icon={AlignLeft}
          tooltip="Align left"
        />
        <ToolbarButton
          onClick={() => toggleAlign(editor, 'center')}
          isActive={isAlignActive(editor, 'center')}
          icon={AlignCenter}
          tooltip="Align center"
        />
        <ToolbarButton
          onClick={() => toggleAlign(editor, 'right')}
          isActive={isAlignActive(editor, 'right')}
          icon={AlignRight}
          tooltip="Align right"
        />
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => toggleBoldMark(editor)}
          isActive={isBoldMarkActive(editor)}
          icon={Bold}
          tooltip="Bold"
        />
        <ToolbarButton
          onClick={() => toggleItalicMark(editor)}
          isActive={isItalicMarkActive(editor)}
          icon={Italic}
          tooltip="Italic"
        />
        <ToolbarButton
          onClick={() => toggleUnderlineMark(editor)}
          isActive={isUnderlineMarkActive(editor)}
          icon={Underline}
          tooltip="Underline"
        />
        <ToolbarButton
          onClick={() => toggleSuperscript(editor)}
          isActive={isSuperscriptActive(editor)}
          icon={Superscript}
          tooltip="Superscript"
        />
        <ToolbarButton
          onClick={() => toggleSubscript(editor)}
          isActive={isSubscriptActive(editor)}
          icon={Subscript}
          tooltip="Subscript"
        />
        <div className="flex items-center gap-1 ml-2">
          {[ '#fff59d', '#a7f3d0', '#fecaca', '#c7d2fe' ].map((c) => (
            <button
              key={c}
              onClick={() => toggleHighlight(editor, c)}
              title={`Highlight ${c}`}
              className={`w-5 h-5 rounded-sm border ${isHighlightActive(editor, c) ? 'ring-2 ring-blue-400' : 'border-gray-300'}`}
              style={{ backgroundColor: c }}
              type="button"
            />
          ))}
          <button
            onClick={() => toggleHighlight(editor, '')}
            title="Clear highlight"
            className="ml-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-red-300"
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => toggleList(editor, 'bulleted-list')}
          isActive={isBlockActive(editor, 'bulleted-list')}
          icon={List}
          tooltip="Bulleted List"
        />
        <ToolbarButton
          onClick={() => toggleList(editor, 'numbered-list')}
          isActive={isBlockActive(editor, 'numbered-list')}
          icon={ListOrdered}
          tooltip="Numbered List"
        />
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => toggleBlock(editor, 'quote')}
          isActive={isBlockActive(editor, 'quote')}
          icon={Quote}
          tooltip="Quote"
        />
        <ToolbarButton
          onClick={() => toggleCodeBlock(editor)}
          isActive={isCodeBlockActive(editor)}
          icon={Code}
          tooltip="Code Block"
        />
      </div>

      <div className="flex items-center gap-1">
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            icon={ImageIcon}
            tooltip="Insert Image (choose file)"
          />
        </>
        <ToolbarButton
          onClick={() => insertDivider(editor)}
          icon={Divide}
          tooltip="Insert Divider"
        />
        <ToolbarButton
          onClick={onInsertMath}
          icon={Sigma}
          tooltip="Insert Equation (Ctrl+Shift+E)"
        />
      </div>
    </div>
  );
};

export default Toolbar;
