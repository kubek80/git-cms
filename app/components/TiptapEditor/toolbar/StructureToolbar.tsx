import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered
} from 'lucide-react';

interface StructureToolbarProps {
  editor: Editor;
}

const StructureToolbar: React.FC<StructureToolbarProps> = ({ editor }) => {
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
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

export default StructureToolbar; 