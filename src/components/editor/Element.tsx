import * as katex from 'katex';
import 'katex/dist/katex.min.css';
import type { RenderElementProps } from 'slate-react';
// React import isn't used directly but JSX requires the jsx runtime; keep file as-is.
import type { CustomElement } from './types';

const Element = ({ attributes, children, element, onMathEdit }: RenderElementProps & { onMathEdit?: (el: CustomElement) => void }) => {
  const elAny = element as any;
  const alignClass = elAny && elAny.align === 'center' ? 'text-center' : elAny && elAny.align === 'right' ? 'text-right' : 'text-left';
  switch ((element as any).type) {
    case 'heading-one':
      return <h1 className={`text-3xl font-bold mt-6 mb-4 ${alignClass}`} {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 className={`text-2xl font-semibold mt-5 mb-3 ${alignClass}`} {...attributes}>{children}</h2>;
    case 'bulleted-list':
      return <ul className="list-disc pl-6 my-4" {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol className="list-decimal pl-6 my-4" {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'quote':
      return <blockquote className={`border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600 ${alignClass}`} {...attributes}>{children}</blockquote>;
    case 'code':
      return (
        <pre className={`bg-gray-100 p-4 rounded my-4 font-mono text-sm overflow-x-auto ${alignClass}`}>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case 'image':
      return (
        <div className="my-6" {...attributes}>
          <img 
            src={(element as any).url} 
            alt="" 
            className="max-w-full h-auto rounded-lg shadow-md"
            contentEditable={false}
          />
          {children}
        </div>
      );
    case 'math':
      return (
        <div 
          className={`my-4 p-2 border border-blue-200 rounded bg-blue-50 cursor-pointer hover:bg-blue-100 ${
            (element as any).display === 'block' ? 'text-center py-4' : 'inline'
          }`}
          {...attributes}
          contentEditable={false}
          onDoubleClick={() => onMathEdit?.(element as CustomElement)}
        >
          <div 
            className="font-serif pointer-events-none"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString((element as any).latex, { throwOnError: false, displayMode: (element as any).display === 'block' }),
            }}
          />
          {children}
        </div>
      );
    case 'divider':
      return (
        <div className="my-8" {...attributes} contentEditable={false}>
          <hr className="border-t-2 border-gray-300" />
          {children}
        </div>
      );
    default:
      return <p className={`my-3 leading-relaxed ${alignClass}`} {...attributes}>{children}</p>;
  }
};

export default Element;
