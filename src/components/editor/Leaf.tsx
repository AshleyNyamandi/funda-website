import type { RenderLeafProps } from 'slate-react';
// JSX runtime provides React automatically; explicit import removed to avoid unused variable lint

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let styledChildren = children;
  
  if ((leaf as any).bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }
  if ((leaf as any).italic) {
    styledChildren = <em>{styledChildren}</em>;
  }
  if ((leaf as any).underline) {
    styledChildren = <u>{styledChildren}</u>;
  }
  if ((leaf as any).code) {
    styledChildren = <code className="bg-gray-100 px-1 rounded font-mono text-sm">{styledChildren}</code>;
  }
  // Superscript / Subscript
  if ((leaf as any).superscript) {
    styledChildren = <sup className="align-super text-[0.8em]">{styledChildren}</sup>;
  } else if ((leaf as any).subscript) {
    styledChildren = <sub className="align-sub text-[0.8em]">{styledChildren}</sub>;
  }
  // Highlight (background color)
  if ((leaf as any).highlight) {
    styledChildren = (
      <span style={{ backgroundColor: (leaf as any).highlight, padding: '0 .15em', borderRadius: 3 }}>
        {styledChildren}
      </span>
    );
  }
  
  return <span {...attributes}>{styledChildren}</span>;
};

export default Leaf;
