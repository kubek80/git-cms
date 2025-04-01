'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { useCallback, useState } from 'react';

interface TiptapEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [] }] },
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [] }] },
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [] }] },
            ]
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [] }] },
            ]
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [] }] },
            ]
          }
        ]
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
          onClick={insertTable}
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
          onClick={addImage}
          className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700"
          title="Insert Image"
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
      </div>
    </>
  );
};

export default function TiptapEditor({ initialContent = '', onChange }: TiptapEditorProps) {
  // Ensure initialContent is properly formatted for the editor
  const formattedContent = initialContent.trim() || '<p></p>';
  const [tableMenuPosition, setTableMenuPosition] = useState({ top: 0, left: 0, show: false });
  
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
      Image,
    ],
    content: formattedContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
      checkForTableSelection(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      checkForTableSelection(editor);
    },
  });

  const checkForTableSelection = useCallback((editor: Editor) => {
    if (!editor) return;
    
    // Directly check if table is active
    const isTableActive = editor.isActive('table');
    
    if (isTableActive) {
      setTableMenuPosition({ top: 0, left: 0, show: true });
    } else {
      setTableMenuPosition(prev => ({ ...prev, show: false }));
    }
  }, []);

  // Simple Table Controls component that renders directly in the editor
  const TableControls = () => {
    if (!editor || !tableMenuPosition.show) return null;
    
    return (
      <div className="bg-white shadow-lg border border-gray-200 rounded mb-2 p-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
          title="Add Column Before"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M15 3v18"></path>
            <path d="M9 9h6"></path>
            <path d="M12 6v6"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
          title="Add Column After"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 9h6"></path>
            <path d="M18 6v6"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
          title="Add Row Before"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 9h6"></path>
            <path d="M12 6v6"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
          title="Add Row After"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18"></path>
            <path d="M3 9h18"></path>
            <path d="M9 15h6"></path>
            <path d="M12 12v6"></path>
          </svg>
        </button>
        <div className="h-6 border-r border-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="px-2 py-1 text-sm bg-red-50 hover:bg-red-100 rounded text-red-700 flex items-center"
          title="Delete Column"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 9l-6 6"></path>
            <path d="M9 9l6 6"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="px-2 py-1 text-sm bg-red-50 hover:bg-red-100 rounded text-red-700 flex items-center"
          title="Delete Row"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18"></path>
            <path d="M3 9h18"></path>
            <path d="M9 15l6-6"></path>
            <path d="M15 15l-6-6"></path>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="px-2 py-1 text-sm bg-red-100 hover:bg-red-200 rounded text-red-800 flex items-center"
          title="Delete Table"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="4" y1="4" x2="20" y2="20"></line>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden relative">
      <MenuBar editor={editor} />
      <div className="relative">
        {editor && tableMenuPosition.show && (
          <div className="absolute top-2 left-2 right-2 z-10">
            <TableControls />
          </div>
        )}
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-3 min-h-[300px] focus:outline-none editor-content" 
        />
      </div>
      <style jsx global>{`
        .editor-content .ProseMirror {
          min-height: 300px;
          padding: 12px;
          outline: none;
        }
        
        .editor-content table {
          border-collapse: collapse;
          margin: 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }
        
        .editor-content table td,
        .editor-content table th {
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
          min-width: 1em;
          padding: 8px;
          position: relative;
          vertical-align: top;
        }
        
        .editor-content table th {
          background-color: #f8fafc;
          font-weight: 500;
          text-align: left;
        }
        
        .editor-content table .selectedCell:after {
          background: rgba(59, 130, 246, 0.1);
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
        
        .editor-content .tableWrapper {
          padding: 1rem 0;
          overflow-x: auto;
        }
        
        .editor-content .resize-cursor {
          cursor: col-resize;
        }
        
        /* Add a highlight to tables when selected */
        .editor-content table.ProseMirror-selectednode {
          outline: 2px solid #3b82f6;
        }
      `}</style>
    </div>
  );
} 