'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Node as TiptapNode } from '@tiptap/core';
import { Grid3x3, Edit, Trash2, Plus } from 'lucide-react';
import styled from 'styled-components';

interface TiptapEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

interface MenuBarProps {
  editor: Editor | null;
}

// Define Figure extension to allow figure and figcaption elements
const Figure = TiptapNode.create({
  name: 'figure',
  group: 'block',
  content: 'image figcaption?',
  draggable: true,
  parseHTML() {
    return [
      {
        tag: 'figure',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['figure', { class: 'image-container', draggable: 'true', ...HTMLAttributes }, 0]
  },
});

// Define Figcaption extension
const Figcaption = TiptapNode.create({
  name: 'figcaption',
  content: 'inline*',
  parseHTML() {
    return [
      {
        tag: 'figcaption',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['figcaption', { class: 'image-description', ...HTMLAttributes }, 0]
  },
});

// Image Modal Component
const ImageModal = ({ 
  isOpen, 
  onClose, 
  onInsert,
  initialData = null
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onInsert: (url: string, alt: string, description: string) => void;
  initialData?: { src: string; alt: string; description: string } | null;
}) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [description, setDescription] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set initial data if provided (for editing existing images)
  useEffect(() => {
    if (isOpen && initialData) {
      setUrl(initialData.src);
      setAlt(initialData.alt || '');
      
      // Clean the description text if it exists
      if (initialData.description) {
        // Remove any paragraph tags and clean up the text
        const cleanDescription = initialData.description
          .replace(/<\/?p>/g, '')  // Remove p tags
          .replace(/<br\s*\/?>/g, '\n') // Convert <br> to newlines
          .trim();
        
        setDescription(cleanDescription);
      } else {
        setDescription('');
      }
    }
  }, [isOpen, initialData]);
  
  useEffect(() => {
    // Focus input when modal opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Handle escape key to close
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      // Reset values when modal closes
      if (!initialData) {
        setUrl('');
        setAlt('');
        setDescription('');
      }
    };
  }, [isOpen, onClose, initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onInsert(url.trim(), alt.trim(), description.trim());
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-medium mb-4">{initialData ? 'Edit Image' : 'Insert Image'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description of the image for accessibility"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (displayed below image)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional caption or description to display under the image"
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                url.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
              }`}
            >
              {initialData ? 'Update' : 'Insert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Table Insert Modal Component
const TableInsertModal = ({ 
  isOpen, 
  onClose, 
  onInsert 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onInsert: (rows: number, cols: number) => void 
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Handle escape key to close
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      // Reset values when modal closes
      setRows(3);
      setCols(3);
    };
  }, [isOpen, onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInsert(rows, cols);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-medium mb-4">Insert Table</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rows
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Columns
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: MenuBarProps) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<{ src: string; alt: string; description: string } | null>(null);
  
  if (!editor) {
    return null;
  }

  const handleEditImage = () => {
    // Check if cursor is inside an image
    const { state } = editor;
    let foundImage = false;
    
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
      if (node.type && node.type.name === 'image' && !foundImage) {
        // Found an image in the selection
        const { src, alt } = node.attrs;
        let description = '';
        
        // Look for description in nearby figcaption
        const parent = state.doc.resolve(state.selection.from).parent;
        if (parent.type && parent.type.name === 'figure') {
          parent.forEach((childNode) => {
            if (childNode.type && childNode.type.name === 'figcaption') {
              description = childNode.textContent || '';
            }
          });
        }
        
        setImageToEdit({ src, alt, description });
        setImageModalOpen(true);
        foundImage = true;
        return false; // Stop traversal
      }
      return true; // Continue traversal
    });
    
    if (!foundImage) {
      // No image found, just open modal for insertion
      setImageToEdit(null);
      setImageModalOpen(true);
    }
  };

  const insertTable = (rows: number, cols: number) => {
    // Create table structure with the specified number of rows and columns
    const tableContent = [];
    
    // Create header row
    const headerRow = {
      type: 'tableRow',
      content: Array(cols).fill(0).map(() => ({ 
        type: 'tableHeader', 
        content: [{ type: 'paragraph', content: [] }] 
      }))
    };
    tableContent.push(headerRow);
    
    // Create remaining rows
    for (let i = 1; i < rows; i++) {
      const row = {
        type: 'tableRow',
        content: Array(cols).fill(0).map(() => ({ 
          type: 'tableCell', 
          content: [{ type: 'paragraph', content: [] }] 
        }))
      };
      tableContent.push(row);
    }
    
    // Insert the table
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'table',
        content: tableContent
      })
      .run();
  };

  return (
    <>
      <div className="border-b border-gray-200 bg-gray-100 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bold') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bold">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('italic') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-italic">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('strike') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Strike"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-strikethrough">
            <path d="M17.3 5H6.7a.7.7 0 0 0-.7.7v1.6c0 .4.3.7.7.7h10.6a.7.7 0 0 0 .7-.7V5.7a.7.7 0 0 0-.7-.7z" />
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <path d="M6.7 19h10.6a.7.7 0 0 0 .7-.7v-1.6a.7.7 0 0 0-.7-.7H6.7a.7.7 0 0 0-.7.7v1.6c0 .4.3.7.7.7z" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('code') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-code">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
        <div className="border-r mx-1 border-gray-300" />
        
        {/* Headings section - improved layout */}
        <div className="flex items-center rounded overflow-hidden border border-gray-300">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-blue-800' : 'bg-white text-gray-700'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 border-l border-gray-300 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-blue-800' : 'bg-white text-gray-700'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 border-l border-gray-300 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-blue-800' : 'bg-white text-gray-700'
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>
        
        <div className="border-r mx-1 border-gray-300" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bulletList') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <circle cx="3" cy="6" r="1"></circle>
            <circle cx="3" cy="12" r="1"></circle>
            <circle cx="3" cy="18" r="1"></circle>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('orderedList') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Ordered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list-ordered">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
        <div className="border-r mx-1 border-gray-300" />
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('blockquote') ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
          }`}
          title="Blockquote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700"
          title="Horizontal Rule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        
        {/* Add new table and image buttons */}
        <div className="border-r mx-1 border-gray-300" />
        <button
          onClick={() => setTableModalOpen(true)}
          className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700"
          title="Insert Table"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </button>
        <button
          onClick={handleEditImage}
          className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700"
          title="Insert Image (with alt text and description)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        
        <div className="border-r mx-1 border-gray-300" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700"
          title="Undo"
          disabled={!editor.can().undo()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-left">
            <polyline points="9 14 4 9 9 4"></polyline>
            <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700"
          title="Redo"
          disabled={!editor.can().redo()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-right">
            <polyline points="15 14 20 9 15 4"></polyline>
            <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
          </svg>
        </button>
        
        {/* Image modal */}
        <ImageModal 
          isOpen={imageModalOpen} 
          onClose={() => setImageModalOpen(false)} 
          onInsert={(url, alt, description) => {
            // Delete any existing selection if editing an image
            if (imageToEdit) {
              editor.commands.deleteSelection();
            }
            
            // Create content with the proper node structure
            if (description) {
              // With description - create a figure with an image and figcaption
              editor.chain().focus().insertContent({
                type: 'figure',
                content: [
                  {
                    type: 'image',
                    attrs: {
                      src: url,
                      alt: alt
                    }
                  },
                  {
                    type: 'figcaption',
                    content: [
                      {
                        type: 'text',
                        text: description
                      }
                    ]
                  }
                ]
              }).run();
            } else {
              // Without description - just insert the image
              editor.chain().focus().setImage({
                src: url,
                alt: alt
              }).run();
            }
          }}
          initialData={imageToEdit}
        />
        
        {/* Table modal */}
        <TableInsertModal
          isOpen={tableModalOpen}
          onClose={() => setTableModalOpen(false)}
          onInsert={insertTable}
        />
      </div>
    </>
  );
};

const TableControls = ({ editor, position }: { editor: Editor; position: { top: number; left: number } }) => {
  return editor ? (
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
  ) : null;
};

const ImageControls = ({ editor, position }: { editor: Editor; position: { top: number; left: number } }) => {
  const handleEditImage = () => {
    // Find image node at current selection
    const { state } = editor;
    const { from } = state.selection;
    
    // Look for image at or near the current selection
    let imageSrc = '';
    let imageAlt = '';
    let imagePos = -1;
    
    state.doc.nodesBetween(from - 10, from + 10, (node, pos) => {
      if (node.type?.name === 'image' && !imageSrc) {
        // Safely access the attrs using optional chaining
        imageSrc = node.attrs?.src || '';
        imageAlt = node.attrs?.alt || '';
        imagePos = pos;
        return false;
      }
      return true;
    });

    if (!imageSrc) return;
    
    // Check for figcaption (description)
    let description = '';
    const figureNode = state.doc.nodeAt(imagePos - 1);
    if (figureNode && figureNode.type.name === 'figure') {
      const figcaptionNode = figureNode.content.content.find((n: { type: { name: string } }) => n.type.name === 'figcaption');
      if (figcaptionNode) {
        description = figcaptionNode.textContent || '';
      }
    }

    // Find and click the image button in MenuBar
    const imageButton = document.querySelector('button[title="Insert Image (with alt text and description)"]');
    if (imageButton && imageButton instanceof HTMLElement) {
      // Use a type cast for window.__imageEditData that's safer than 'any'
      (window as unknown as { __imageEditData: { src: string; alt: string; description: string } }).__imageEditData = {
        src: imageSrc,
        alt: imageAlt,
        description
      };
      imageButton.click();
    }
  };

  return editor ? (
    <div
      className="absolute bg-white shadow-md rounded p-1 flex gap-1 border border-gray-200 z-50"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button
        onClick={handleEditImage}
        className="p-1 hover:bg-gray-100 rounded"
        title="Edit image"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteNode('figure').run()}
        className="p-1 hover:bg-gray-100 rounded"
        title="Delete image"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ) : null;
};

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

  figure {
    position: relative;
    cursor: grab;
    transition: all 0.2s ease;
    user-select: none;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
    }
    
    &::after {
      content: '✏️';
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: white;
      border-radius: 4px;
      padding: 4px;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    &:hover::after {
      opacity: 1;
    }
  }
  
  figcaption {
    text-align: center;
    font-style: italic;
    margin-top: 8px;
    color: #666;
    pointer-events: none;
  }
  
  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    pointer-events: none; /* Prevent direct interaction with the image */
    -webkit-user-drag: none; /* Disable native image dragging in browsers */
    user-select: none; /* Prevent text selection on image */
  }
  
  .ProseMirror {
    min-height: 100px;
    padding: 0.5rem;
    &:focus {
      outline: none;
    }
    
    > * + * {
      margin-top: 0.75em;
    }
    
    h1 {
      margin-top: 0;
    }
  }
`;

export default function TiptapEditor({ initialContent = '', onChange }: TiptapEditorProps) {
  // Ensure initialContent is properly formatted for the editor
  const formattedContent = initialContent.trim() || '<p></p>';
  const [tableMenuPosition, setTableMenuPosition] = useState({ top: 0, left: 0, show: false });
  const [imageMenuPosition, setImageMenuPosition] = useState({ top: 0, left: 0, show: false });
  const [contextMenu, setContextMenu] = useState<{ 
    show: boolean; 
    top: number; 
    left: number; 
    type: 'image'; 
    data: { src: string; alt: string; description: string } 
  } | null>(null);
  
  // Add global style to handle dragging
  useEffect(() => {
    // Create a style element for global CSS
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .ProseMirror figure {
        cursor: grab !important;
      }
      .ProseMirror figure img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        user-select: none !important;
      }
      .ProseMirror figure figcaption {
        pointer-events: none !important;
      }
      /* While dragging */
      .ProseMirror-selectednode {
        outline: 2px solid #3b82f6 !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'min-w-full border-collapse border border-gray-300',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-t border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 py-2 px-4 text-left font-medium text-gray-700',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2 text-gray-700',
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: 'centered-image',
          draggable: 'false', // Set image to not be draggable
        },
      }),
      Figure,
      Figcaption,
    ],
    content: formattedContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Handle table controls positioning
      if (editor.isActive('table')) {
        const view = editor.view;
        const { from } = view.state.selection;
        const start = view.coordsAtPos(from);
        
        setTableMenuPosition({
          top: start.top - 50,
          left: start.left,
          show: true
        });
      } else {
        setTableMenuPosition(prev => ({ ...prev, show: false }));
      }
      
      // Handle image controls positioning
      if (editor.isActive('image') || editor.isActive('figure')) {
        const view = editor.view;
        const { from } = view.state.selection;
        const start = view.coordsAtPos(from);
        
        setImageMenuPosition({
          top: start.top - 50,
          left: start.left,
          show: true
        });
      } else {
        setImageMenuPosition(prev => ({ ...prev, show: false }));
      }
    },
    onFocus: ({ editor }) => {
      checkForTableSelection(editor);
    },
    onBlur: () => {
      // Add a small delay to allow for clicking controls
      setTimeout(() => {
        setTableMenuPosition(prev => ({ ...prev, show: false }));
      }, 200);
    },
  });
  
  // Add right-click event listener for images
  useEffect(() => {
    if (editor) {
      const handleContextMenu = (e: MouseEvent) => {
        // Check if right-clicking on an image
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
          e.preventDefault();
          
          // Get image details
          const img = target as HTMLImageElement;
          const src = img.getAttribute('src') || '';
          const alt = img.getAttribute('alt') || '';
          
          // Try to find description (figcaption)
          let description = '';
          const figureParent = img.closest('figure');
          if (figureParent) {
            const caption = figureParent.querySelector('figcaption.image-description');
            if (caption) {
              // Get text content directly to avoid paragraph wrapping issues
              description = caption.textContent || '';
            }
          }
          
          // Show context menu
          setContextMenu({
            show: true,
            top: e.clientY,
            left: e.clientX,
            type: 'image',
            data: { src, alt, description }
          });
          
          // Select the image in the editor
          editor.commands.focus();
        }
      };
      
      // Handle click to close the context menu
      const handleClick = () => {
        setContextMenu(null);
      };
      
      // Add and clean up event listeners
      const editorElement = editor.view.dom;
      editorElement.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', handleClick);
      
      return () => {
        editorElement.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('click', handleClick);
      };
    }
  }, [editor]);
  
  // Handle figure click to make the edit button work
  useEffect(() => {
    if (!editor) return;
    
    const handleFigureClick = (event: MouseEvent) => {
      // If click target is not inside a figure, return
      const figure = (event.target as HTMLElement).closest('figure');
      if (!figure) return;
      
      // If click is not in the edit button area (top-right corner), return
      const rect = figure.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const editButtonArea = { x: rect.width - 30, y: 0, width: 30, height: 30 };
      
      const isInEditArea = 
        x >= editButtonArea.x && 
        x <= editButtonArea.x + editButtonArea.width && 
        y >= editButtonArea.y && 
        y <= editButtonArea.y + editButtonArea.height;
      
      if (isInEditArea) {
        // Get image data from the figure
        const img = figure.querySelector('img');
        
        if (img) {
          const src = img.getAttribute('src') || '';
          
          // Make the editor select the image
          const view = editor.view;
          const { doc } = view.state;
          
          let imagePos = -1;
          doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs.src === src) {
              imagePos = pos;
              return false;
            }
            return true;
          });
          
          if (imagePos >= 0) {
            // Set selection to the image
            editor.commands.setNodeSelection(imagePos);
          }
        }
      }
    };
    
    document.addEventListener('click', handleFigureClick);
    
    return () => {
      document.removeEventListener('click', handleFigureClick);
    };
  }, [editor]);

  const checkForTableSelection = useCallback((editor: Editor) => {
    if (!editor) return;
    
    // Check if table is active
    const isTableActive = editor.isActive('table');
    
    if (isTableActive) {
      // Get the DOM representation
      const dom = editor.view.dom;
      const editorRect = dom.getBoundingClientRect();
      
      // First try: Get position from ProseMirror's selection
      try {
        const { from } = editor.state.selection;
        const pos = editor.view.coordsAtPos(from);
        
        if (pos) {
          setTableMenuPosition({
            top: pos.top - editorRect.top,
            left: pos.left - editorRect.left,
            show: true
          });
          return;
        }
      } catch (e) {
        // If coordsAtPos fails, continue to other methods
        console.log('Could not get position from selection', e);
      }
      
      // Second try: Find the selected cell
      const selectedCell = dom.querySelector('.selectedCell') as HTMLElement;
      if (selectedCell) {
        const cellRect = selectedCell.getBoundingClientRect();
        
        setTableMenuPosition({
          top: cellRect.top - editorRect.top,
          left: cellRect.left - editorRect.left,
          show: true
        });
        return;
      }
      
      // Third try: Use the table element itself
      const table = dom.querySelector('table') as HTMLElement;
      if (table) {
        const tableRect = table.getBoundingClientRect();
        
        setTableMenuPosition({
          top: tableRect.top - editorRect.top,
          left: tableRect.left - editorRect.left,
          show: true
        });
        return;
      }
      
      // Last resort: Default position
      setTableMenuPosition({ top: 10, left: 10, show: true });
    } else {
      setTableMenuPosition(prev => ({ ...prev, show: false }));
    }
  }, []);

  // Set up event listeners to track cursor position
  useEffect(() => {
    if (editor) {
      const handleClick = () => {
        checkForTableSelection(editor);
      };
      
      const handleMouseUp = () => {
        if (editor.isActive('table')) {
          checkForTableSelection(editor);
        }
      };
      
      // Add event listeners
      editor.view.dom.addEventListener('click', handleClick);
      editor.view.dom.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        // Clean up event listeners
        editor.view.dom.removeEventListener('click', handleClick);
        editor.view.dom.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [editor, checkForTableSelection]);

  return (
    <EditorContainer className="prose dark:prose-invert">
      <MenuBar editor={editor} />
      {tableMenuPosition.show && (
        <TableControls editor={editor!} position={tableMenuPosition} />
      )}
      {imageMenuPosition.show && (
        <ImageControls editor={editor!} position={imageMenuPosition} />
      )}
      <EditorContent editor={editor} />
      {contextMenu && contextMenu.show && (
        <div 
          className="fixed bg-white shadow-lg border border-gray-200 rounded z-50 py-1"
          style={{ 
            top: `${contextMenu.top}px`, 
            left: `${contextMenu.left}px`,
          }}
        >
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              // First we select the image
              editor?.chain().focus().run();
              
              // Then we find and target the image modal through the MenuBar
              document.querySelectorAll('button').forEach(button => {
                if (button.title?.includes('Insert Image')) {
                  button.click();
                }
              });
              
              setContextMenu(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            Edit Image
          </button>
        </div>
      )}
    </EditorContainer>
  );
} 