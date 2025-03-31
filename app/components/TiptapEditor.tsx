'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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

  return (
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
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
        }`}
        title="Heading 1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-type">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
        <span className="text-xs ml-1">1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
        }`}
        title="Heading 2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-type">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
        <span className="text-xs ml-1">2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-blue-800' : 'bg-white border border-gray-300 text-gray-700'
        }`}
        title="Heading 3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-type">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
        <span className="text-xs ml-1">3</span>
      </button>
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
  );
};

export default function TiptapEditor({ initialContent = '', onChange }: TiptapEditorProps) {
  // Ensure initialContent is properly formatted for the editor
  const formattedContent = initialContent.trim() || '<p></p>';
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: formattedContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none" 
      />
    </div>
  );
} 