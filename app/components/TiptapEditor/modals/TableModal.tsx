import React, { useState } from 'react';
import { Editor } from '@tiptap/react';

interface TableModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

const TableModal: React.FC<TableModalProps> = ({ editor, isOpen, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editor) return;
    
    // Insert the table
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Insert Table</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Rows
            </label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 2)}
              min="2"
              max="10"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Columns
            </label>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 2)}
              min="2"
              max="10"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableModal; 