import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code
} from 'lucide-react';

interface FormattingToolbarProps {
  editor: Editor;
}

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ editor }) => {
  if (!editor) return null;
  
  const ToolbarButton = ({ 
    isActive, 
    onClick, 
    title, 
    children 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="flex gap-1">
      <ToolbarButton
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

export default FormattingToolbar; 