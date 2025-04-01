import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Image, 
  Table, 
  Link,
  Code
} from 'lucide-react';

interface InsertToolbarProps {
  editor: Editor;
  onImageClick: () => void;
  onTableClick: () => void;
}

const InsertToolbar: React.FC<InsertToolbarProps> = ({ 
  editor, 
  onImageClick, 
  onTableClick 
}) => {
  if (!editor) return null;

  const handleLinkClick = () => {
    const url = window.prompt('Enter the URL');
    
    if (url) {
      // We'll implement this later with a proper link extension
      window.alert('Link functionality will be implemented with proper extension');
    }
  };
  
  const ToolbarButton = ({ 
    onClick, 
    title, 
    children 
  }: { 
    onClick: () => void; 
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700"
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="flex gap-1">
      <ToolbarButton
        onClick={onImageClick}
        title="Insert Image"
      >
        <Image className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onTableClick}
        title="Insert Table"
      >
        <Table className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={handleLinkClick}
        title="Insert Link"
      >
        <Link className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

export default InsertToolbar; 