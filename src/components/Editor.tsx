import { useState, useCallback, useMemo, useContext } from 'react';
import type { KeyboardEvent } from 'react';
import type { Descendant, Node } from 'slate';
import { createEditor, Editor, Transforms, Element as SlateElement } from 'slate';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import * as katex from 'katex';
import 'katex/dist/katex.min.css';
import { Bold, Italic, List, Code, Heading1 } from 'lucide-react';
import { Link } from 'react-router';

// Use the extracted editor modules
import Element from './editor/Element';
import Leaf from './editor/Leaf';
import Toolbar from './editor/Toolbar';
import type { CustomElement } from './editor/types';
import { toggleBoldMark, toggleItalicMark, toggleUnderlineMark, insertMath } from './editor/helpers';
import { EditorContentContext } from '../context/EditorContext';

// Main Editor Component
export default function TeachingMaterialsEditor() {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  
  // State for math modal
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathInput, setMathInput] = useState('');
  const [mathDisplay, setMathDisplay] = useState<'inline' | 'block'>('block');
  const [useDisplayStyle, setUseDisplayStyle] = useState(false);
  const [editingMathPath, setEditingMathPath] = useState<number[] | null>(null);
  
// Content comes from EditorContentContext when available; otherwise use local state.
const ctx = useContext(EditorContentContext);
const [localContent, setLocalContent] = useState<Descendant[]>([
  {
    type: 'heading-one',
    children: [{ text: 'Newton\'s Laws of Motion' }],
  } as CustomElement,
  {
    type: 'paragraph',
    children: [
      { text: 'Three fundamental principles describing motion and forces.' },
    ],
  } as CustomElement,
  {
    type: 'heading-two',
    children: [{ text: 'The Three Laws' }],
  } as CustomElement,
  {
    type: 'bulleted-list',
    children: [
      {
        type: 'list-item',
        children: [{ text: 'Law of Inertia: Objects at rest stay at rest' }],
      },
      {
        type: 'list-item',
        children: [{ text: 'F = ma: Force equals mass times acceleration' }],
      },
      {
        type: 'list-item',
        children: [{ text: 'Action-Reaction: Every force has an equal opposite force' }],
      },
    ] as CustomElement[],
  } as CustomElement,
  {
    type: 'code',
    children: [{ text: 'F = m × a\n// Force (N) = mass (kg) × acceleration (m/s²)' }],
  } as CustomElement,
]);

const content = ctx ? ctx.content : localContent;
const setContent = ctx ? ctx.setContent : setLocalContent;

  // Stable empty fallback to ensure Slate always receives a list of elements.
  // This prevents the "initialValue is invalid" error when `initialValue` is undefined
  // (e.g., due to a race or external mutation). We keep it memoized so the
  // reference stays stable across renders.
  const EMPTY_CONTENT = useMemo<Descendant[]>(
    () => [{ type: 'paragraph', children: [{ text: '' }] } as CustomElement],
    []
  );

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} onMathEdit={(el) => {
    if (el.type === 'math') {
      setMathInput(el.latex);
      setMathDisplay(el.display || 'block');
      setUseDisplayStyle(el.latex.includes('\\displaystyle'));
      setEditingMathPath(null); // Could store path for later, but not needed for now
      setShowMathModal(true);
    }
  }} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  // Keyboard shortcuts for formatting (Cmd/Ctrl + B/I/U) and math (Cmd/Ctrl+Shift+E)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Handle Cmd/Ctrl+Shift+E for math modal
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        setMathInput('');
        setMathDisplay('block');
        setUseDisplayStyle(false);
        setEditingMathPath(null);
        setShowMathModal(true);
        return;
      }

      if (!(event.ctrlKey || event.metaKey)) return;

      const key = event.key.toLowerCase();
      if (key === 'b') {
        event.preventDefault();
        toggleBoldMark(editor);
      } else if (key === 'i') {
        event.preventDefault();
        toggleItalicMark(editor);
      } else if (key === 'u') {
        event.preventDefault();
        toggleUnderlineMark(editor);
      }
    },
    [editor]
  );

  // Make certain non-text blocks (divider, image) easy to delete: if Backspace/Delete
  // is pressed and such a node is immediately before/after the selection, remove it.
  const handleDeleteDivider = useCallback(
    (event: KeyboardEvent) => {
      if (!editor.selection || !ReactEditor.isFocused(editor)) return false;

      const removableMatch = (n: Node) => SlateElement.isElement(n) && ((n as SlateElement).type === 'divider' || (n as SlateElement).type === 'image');

      if (event.key === 'Backspace') {
        const prev = Editor.previous(editor, {
          at: editor.selection,
          match: removableMatch,
        });
        if (prev) {
          event.preventDefault();
          const [, path] = prev as any;
          Transforms.removeNodes(editor, { at: path });
          return true;
        }
      }

      if (event.key === 'Delete') {
        const next = Editor.next(editor, {
          at: editor.selection,
          match: removableMatch,
        });
        if (next) {
          event.preventDefault();
          const [, path] = next as any;
          Transforms.removeNodes(editor, { at: path });
          return true;
        }
      }

      return false;
    },
    [editor]
  );

  const handleSave = () => {
    console.log('Saving content:', content);
    alert('Content saved! Check console for data.');
  };

  // Handle math insertion from modal
  const handleInsertMath = () => {
    if (mathInput.trim()) {
      // If editing an existing math node, find and replace it
      if (editingMathPath) {
        Transforms.setNodes(
          editor,
          { 
            latex: mathInput,
            display: mathDisplay,
          } as Partial<CustomElement>,
          { at: editingMathPath }
        );
      } else {
        // Insert new math node
        const latex = useDisplayStyle && !mathInput.includes('\\displaystyle') 
          ? `\\displaystyle ${mathInput}` 
          : mathInput;
        insertMath(editor, latex, mathDisplay);
      }
      setMathInput('');
      setMathDisplay('block');
      setUseDisplayStyle(false);
      setEditingMathPath(null);
      setShowMathModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Notes
          </h1>
          <p className="text-gray-600">
            Create engaging educational content with rich formatting options.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Slate editor={editor} initialValue={content ?? EMPTY_CONTENT} onChange={setContent}>
                <div className="border-b">
                  <Toolbar editor={editor} onInsertMath={() => setShowMathModal(true)} />
                </div>
                
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={(e) => {
                    // Try deleting adjacent divider nodes first; if nothing removed,
                    // fall back to formatting shortcuts handler.
                    if (!(handleDeleteDivider as any)(e)) {
                      (handleKeyDown as any)(e);
                    }
                  }}
                  placeholder="Start writing your teaching materials here..."
                  className="p-6 min-h-[500px] focus:outline-none"
                  spellCheck
                  autoFocus
                />
              </Slate>
              
              <div className="border-t p-4 bg-gray-50 flex justify-between">
                <div className="text-sm text-gray-500">
                  Word Count: {JSON.stringify(content).split(' ').length} words
                </div>
                <div className="space-x-2">
                  {/* <button
                    onClick={() => setContent([{ type: 'paragraph', children: [{ text: '' }] } as CustomElement])}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    type="button"
                  >
                    Clear
                  </button> */}
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Save Draft
                  </button>
                  <Link to="preview"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Publish
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Formatting Guide */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Formatting Guide</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Bold size={16} className="text-gray-400" />
                  <span><strong>Bold</strong> - Ctrl+B</span>
                </li>
                <li className="flex items-center gap-2">
                  <Italic size={16} className="text-gray-400" />
                  <span><em>Italic</em> - Ctrl+I</span>
                </li>
                <li className="flex items-center gap-2">
                  <List size={16} className="text-gray-400" />
                  <span>Lists - Use toolbar buttons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code size={16} className="text-gray-400" />
                  <span>Code blocks - For examples</span>
                </li>
                <li className="flex items-center gap-2">
                  <Heading1 size={16} className="text-gray-400" />
                  <span>Headings - Structure your content</span>
                </li>
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Teaching Tips</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Start with clear learning objectives</li>
                <li>• Use headings to organize content</li>
                <li>• Include code examples for technical topics</li>
                <li>• Add images for visual learners</li>
                <li>• Use quotes for important concepts</li>
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Document Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-gray-700">
                    {content.length}
                  </div>
                  <div className="text-gray-500">Blocks</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-700">
                    {JSON.stringify(content).length}
                  </div>
                  <div className="text-gray-500">Characters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Math Modal */}
      {showMathModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingMathPath ? 'Edit Equation' : 'Insert Equation'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Enter LaTeX code below</p>
            </div>

            {/* Main content - flex column on mobile, row on lg */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Input & Preview section */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* LaTeX Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">LaTeX Code</label>
                    <textarea
                      value={mathInput}
                      onChange={(e) => setMathInput(e.target.value)}
                      placeholder="e.g., \frac{a}{b}, E=mc^2, \int_0^1 x dx"
                      className="w-full h-20 sm:h-24 p-2 sm:p-3 border border-gray-300 rounded text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  {/* Display Mode */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">Display Mode</label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <label className="flex items-center text-xs sm:text-sm text-gray-700">
                        <input
                          type="radio"
                          checked={mathDisplay === 'inline'}
                          onChange={() => setMathDisplay('inline')}
                          className="mr-2"
                        />
                        Inline (smaller, fits text)
                      </label>
                      <label className="flex items-center text-xs sm:text-sm text-gray-700">
                        <input
                          type="radio"
                          checked={mathDisplay === 'block'}
                          onChange={() => setMathDisplay('block')}
                          className="mr-2"
                        />
                        Block (larger, standalone)
                      </label>
                    </div>
                  </div>

                  {/* Display Style Checkbox */}
                  {mathDisplay === 'block' && (
                    <label className="flex items-center text-xs sm:text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={useDisplayStyle}
                        onChange={(e) => setUseDisplayStyle(e.target.checked)}
                        className="mr-2"
                      />
                      Use display style (larger integral/sum signs)
                    </label>
                  )}

                  {/* Live Preview */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Preview</label>
                    <div
                      className="min-h-16 max-h-32 sm:max-h-40 overflow-y-auto border border-gray-200 rounded p-3 bg-white flex items-center justify-center"
                      dangerouslySetInnerHTML={{
                        __html: mathInput
                          ? katex.renderToString(useDisplayStyle && mathDisplay === 'block' ? `\\displaystyle ${mathInput}` : mathInput, {
                              displayMode: mathDisplay === 'block',
                              throwOnError: false,
                              trust: true,
                            })
                          : '<span class="text-gray-400 text-xs">Preview will appear here...</span>',
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={handleInsertMath}
                      disabled={!mathInput.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {editingMathPath ? 'Update Equation' : 'Insert Equation'}
                    </button>
                    <button
                      onClick={() => {
                        setShowMathModal(false);
                        setMathInput('');
                        setEditingMathPath(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* LaTeX Cheat-sheet - Mobile: below, Desktop: right sidebar */}
              <div className="w-full lg:w-72 lg:border-l border-t lg:border-t-0 border-gray-200 p-4 sm:p-6 bg-gray-50 overflow-y-auto max-h-64 lg:max-h-full">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">LaTeX Cheat-sheet</h3>
                
                <div className="space-y-3 text-xs sm:text-sm">
                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Fractions & Roots</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">\frac{'{'} a {'}'} {'{'} b {'}'}</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\sqrt{'{'} x {'}'}</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\sqrt[3]{'{'} x {'}'}</code>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Powers & Subscripts</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">x^{'{'} 2 {'}'}</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">x_{'{'} n {'}'}</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">x^{'{'} 2 {'}'}_{'{'}n{'}'}</code>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Calculus</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">\int_0^1 x^2 dx</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\sum_{'{'} i=1 {'}'}^n i</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\lim_{'{'} x \to 0 {'}'} f(x)</code>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Greek Letters</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">\alpha, \beta, \gamma</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\pi, \phi, \psi</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\Sigma, \Delta, \Omega</code>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Relations</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">\leq, \geq, \approx</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\in, \subset, \cup</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\forall, \exists</code>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Matrices</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">\begin{'{'} pmatrix {'}'}</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">a & b \\ c & d</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\end{'{'} pmatrix {'}'}</code>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600">Fonts</summary>
                    <div className="space-y-1 font-mono text-xs bg-white p-2 rounded border border-gray-200 mt-1">
                      <code className="text-gray-700 text-[10px] sm:text-xs">\mathbf{'{'} x {'}'} — bold</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\mathit{'{'} x {'}'} — italic</code>
                      <code className="text-gray-700 text-[10px] sm:text-xs">\mathcal{'{'} L {'}'} — callig.</code>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}