import React from 'react'
import * as katex from 'katex'
import type { Descendant, Text as SlateTextType, Element as SlateElementType } from 'slate'

export type TextLeaf = SlateTextType & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  highlight?: string | boolean;
};

export type RichElement = SlateElementType & {
  type?: string;
  align?: 'left' | 'center' | 'right';
  url?: string;
  display?: 'block' | 'inline';
  latex?: string;
  children: Descendant[];
};

export const applyLeafMarks = (text: string, leaf: TextLeaf): React.ReactNode => {
  let node: React.ReactNode = text;

  if (leaf.code) node = <code className="bg-gray-100 px-1 rounded font-mono text-sm">{node}</code>;
  if (leaf.superscript) node = <sup className="align-super text-[0.8em]">{node}</sup>;
  else if (leaf.subscript) node = <sub className="align-sub text-[0.8em]">{node}</sub>;
  if (leaf.bold) node = <strong>{node}</strong>;
  if (leaf.italic) node = <em>{node}</em>;
  if (leaf.underline) node = <u>{node}</u>;
  if (leaf.highlight) node = (
    <span style={{ backgroundColor: typeof leaf.highlight === 'string' ? leaf.highlight : undefined, padding: '0 .15em', borderRadius: 3 }}>{node}</span>
  );

  return node;
};

export const renderChildren = (children: Descendant[], renderNodeFn: (n: Descendant) => React.ReactNode): React.ReactNode => (
  children.map((leaf: Descendant, idx: number) => {
    if ((leaf as SlateTextType).text !== undefined) {
      const textLeaf = leaf as TextLeaf;
      return <React.Fragment key={idx}>{applyLeafMarks(textLeaf.text, textLeaf)}</React.Fragment>;
    }
    // If nested element inside children
    return <React.Fragment key={idx}>{renderNodeFn(leaf)}</React.Fragment>;
  })
);

export const renderNode = (node: Descendant, idx?: number): React.ReactNode => {
  const elem = node as RichElement;
  const alignClass = elem && elem.align === 'center' ? 'text-center' : elem && elem.align === 'right' ? 'text-right' : 'text-left';

  const renderNodeFn = (n: Descendant) => renderNode(n);

  switch (elem.type) {
    case 'heading-one':
      return <h1 key={idx} className={`text-2xl font-bold text-black mt-6 mb-4 ${alignClass}`}>{renderChildren(elem.children, renderNodeFn)}</h1>;
    case 'heading-two':
      return <h2 key={idx} className={`text-xl font-semibold text-black mt-5 mb-3 ${alignClass}`}>{renderChildren(elem.children, renderNodeFn)}</h2>;
    case 'bulleted-list':
      return <ul key={idx} className="list-disc pl-6 my-4 text-black">{(elem.children || []).map((li: Descendant, i: number) => <li key={i}>{renderChildren((li as RichElement).children, renderNodeFn)}</li>)}</ul>;
    case 'numbered-list':
      return <ol key={idx} className="list-decimal pl-6 my-4 text-black">{(elem.children || []).map((li: Descendant, i: number) => <li key={i}>{renderChildren((li as RichElement).children, renderNodeFn)}</li>)}</ol>;
    case 'quote':
      return <blockquote key={idx} className={`border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600  ${alignClass}`}>{renderChildren(elem.children, renderNodeFn)}</blockquote>;
    case 'code':
      return <pre key={idx} className={`bg-gray-100 p-4 rounded my-4 font-mono text-sm overflow-x-auto text-black ${alignClass}`}><code>{elem.children && elem.children.map((c: Descendant) => ((c as SlateTextType).text ?? '')).join('')}</code></pre>;
    case 'image':
      return (
        <div key={idx} className="my-6">
          <img src={elem.url} alt="" className="max-w-full h-auto rounded-lg shadow-md" />
        </div>
      );
    case 'math':
      return (
        <div key={idx} className={`my-4 p-2 border border-blue-200 rounded bg-blue-50 ${elem.display === 'block' ? 'text-center py-4' : 'inline'}`}>
          <div dangerouslySetInnerHTML={{ __html: katex.renderToString(elem.latex ?? '', { throwOnError: false, displayMode: elem.display === 'block' }) }} />
        </div>
      );
    case 'divider':
      return <div key={idx} className="my-8"><hr className="border-t-2 border-gray-300" /></div>;
    default:
      return <p key={idx} className={`my-3 leading-relaxed text-black ${alignClass}`}>{renderChildren((elem.children ?? []) as Descendant[], renderNodeFn)}</p>;
  }
}

export default renderNode
