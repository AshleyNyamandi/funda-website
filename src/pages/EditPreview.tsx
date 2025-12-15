import React from 'react';
import { useEditorContent } from '../hooks/useEditorContent';
import * as katex from 'katex';

const applyLeafMarks = (text: string, leaf: any) => {
  let node: React.ReactNode = text;

  if (leaf.code) node = <code className="bg-gray-100 px-1 rounded font-mono text-sm">{node}</code>;
  if (leaf.superscript) node = <sup className="align-super text-[0.8em]">{node}</sup>;
  else if (leaf.subscript) node = <sub className="align-sub text-[0.8em]">{node}</sub>;
  if (leaf.bold) node = <strong>{node}</strong>;
  if (leaf.italic) node = <em>{node}</em>;
  if (leaf.underline) node = <u>{node}</u>;
  if (leaf.highlight) node = (
    <span style={{ backgroundColor: leaf.highlight, padding: '0 .15em', borderRadius: 3 }}>{node}</span>
  );

  return node;
};

const renderChildren = (children: any[]) => (
  children.map((leaf: any, idx: number) => {
    if (leaf.text !== undefined) {
      return <React.Fragment key={idx}>{applyLeafMarks(leaf.text, leaf)}</React.Fragment>;
    }
    // If nested element inside children
    return <React.Fragment key={idx}>{renderNode(leaf)}</React.Fragment>;
  })
);

const renderNode = (node: any, idx?: number): React.ReactNode => {
  const alignClass = node && node.align === 'center' ? 'text-center' : node && node.align === 'right' ? 'text-right' : 'text-left';

  switch (node.type) {
    case 'heading-one':
      return <h1 key={idx} className={`text-2xl font-bold text-black mt-6 mb-4 ${alignClass}`}>{renderChildren(node.children)}</h1>;
    case 'heading-two':
      return <h2 key={idx} className={`text-xl font-semibold text-black mt-5 mb-3 ${alignClass}`}>{renderChildren(node.children)}</h2>;
    case 'bulleted-list':
      return <ul key={idx} className="list-disc pl-6 my-4 text-black">{(node.children || []).map((li: any, i: number) => <li key={i}>{renderChildren(li.children)}</li>)}</ul>;
    case 'numbered-list':
      return <ol key={idx} className="list-decimal pl-6 my-4 text-black">{(node.children || []).map((li: any, i: number) => <li key={i}>{renderChildren(li.children)}</li>)}</ol>;
    case 'quote':
      return <blockquote key={idx} className={`border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600  ${alignClass}`}>{renderChildren(node.children)}</blockquote>;
    case 'code':
      return <pre key={idx} className={`bg-gray-100 p-4 rounded my-4 font-mono text-sm overflow-x-auto text-black ${alignClass}`}><code>{node.children && node.children.map((c: any) => c.text).join('')}</code></pre>;
    case 'image':
      return (
        <div key={idx} className="my-6">
          <img src={node.url} alt="" className="max-w-full h-auto rounded-lg shadow-md" />
        </div>
      );
    case 'math':
      return (
        <div key={idx} className={`my-4 p-2 border border-blue-200 rounded bg-blue-50 ${node.display === 'block' ? 'text-center py-4' : 'inline'}`}>
          <div dangerouslySetInnerHTML={{ __html: katex.renderToString(node.latex, { throwOnError: false, displayMode: node.display === 'block' }) }} />
        </div>
      );
    case 'divider':
      return <div key={idx} className="my-8"><hr className="border-t-2 border-gray-300" /></div>;
    default:
      return <p key={idx} className={`my-3 leading-relaxed text-black ${alignClass}`}>{renderChildren(node.children || [])}</p>;
  }
};

const EditPreview: React.FC = () => {
  const { content } = useEditorContent();

  const handleNotesSubmit = () => {

  }

  return (
    <div className="min-h-screen">
      <div className='max-w-2xl mx-auto bg-white rounded shadow-sm p-6 mt-4'>
            {content && content.length > 0 ? (
          content.map((node: any, i: number) => (
            <React.Fragment key={i}>{renderNode(node, i)}</React.Fragment>
          ))
        ) : (
          <div className="text-sm text-gray-500">No content to preview.</div>
        )}
        <div className='border border-green-500'></div>

        <div className='text-black text-[0.675rem] mt-3'>
          {
            content && content.length > 0 ? (
              <div >
                <form onSubmit={handleNotesSubmit} className='flex flex-col gap-2 items-center justify-between'>
                <label htmlFor="topic" className='text-sm'>
                    Topic
                </label>
                <input 
                    id='topic' 
                    type="text" 
                    className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                    placeholder='E.g., Thermodymanics'
                    aria-required="true"
                    required
                />
                <label htmlFor="topic-number" className='text-sm'>
                    Topic Number according to the syllabus
                </label>
                <input 
                    id='topic-number' 
                    type="number" 
                    className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                    aria-required="true"
                    required
                />
                  <input type="number" />
                  <select required name="" id="" className='p-2 outline-green-500'>
                    <option value="">Form 1</option>
                    <option value="">Form 2</option>
                    <option value="">Form 3</option>
                    <option value="">Form 4</option>
                    <option value="">Form 5</option>
                    <option value="">Form 6</option>
                  </select>
                  <select name="" id="" className='p-2 outline-green-500'>
                    <option value="">Notes</option>
                    <option value="">Excerices</option>
                  </select>
                  <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      type='submit'

                  >Publish</button>
                </form>
              </div>
            ): ""
          }
        </div>
      </div>
    </div>
  );
};

export default EditPreview;