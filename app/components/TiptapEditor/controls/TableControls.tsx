import React from 'react';
import { Editor } from '@tiptap/react';
import { Grid3x3, Trash2, Plus } from 'lucide-react';

interface TableControlsProps {
  editor: Editor;
  position: { top: number; left: number };
}

const TableControls: React.FC<TableControlsProps> = ({ editor, position }) => {
  if (!editor) return null;

  return (
    <div
      className="absolute bg-white shadow-md rounded p-1 flex gap-1 border border-gray-200 z-50"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Add column before"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Add column after"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Delete column"
      >
        <Grid3x3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addRowBefore().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Add row before"
      >
        <Plus className="w-4 h-4 rotate-90" />
      </button>
      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Add row after"
      >
        <Plus className="w-4 h-4 rotate-90" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Delete row"
      >
        <Grid3x3 className="w-4 h-4 rotate-90" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Delete table"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TableControls; 