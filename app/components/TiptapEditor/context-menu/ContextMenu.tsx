import React from 'react';
import { Editor } from '@tiptap/react';

interface ContextMenuProps {
  editor: Editor | null;
  contextMenu: {
    show: boolean;
    top: number;
    left: number;
    type: 'image';
    data: { src: string; alt: string; description: string };
  } | null;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  editor, 
  contextMenu, 
  onClose 
}) => {
  if (!editor || !contextMenu || !contextMenu.show) return null;

  const handleEditImage = () => {
    // Store image data in window for the edit modal
    const windowWithImageData = window as unknown as { 
      __imageEditData?: { 
        src: string; 
        alt: string; 
        description: string 
      } 
    };
    
    windowWithImageData.__imageEditData = {
      src: contextMenu.data.src,
      alt: contextMenu.data.alt,
      description: contextMenu.data.description
    };
    
    // Find and click the image button in MenuBar
    const imageButton = document.querySelector('button[title="Insert Image (with alt text and description)"]');
    if (imageButton && imageButton instanceof HTMLElement) {
      imageButton.click();
    }
    
    onClose();
  };

  const handleDeleteImage = () => {
    if (editor && contextMenu.type === 'image') {
      editor.chain().focus().deleteNode('figure').run();
    }
    onClose();
  };

  return (
    <div
      className="absolute bg-white shadow-md rounded p-2 z-50 border border-gray-200"
      style={{ top: `${contextMenu.top}px`, left: `${contextMenu.left}px` }}
    >
      {contextMenu.type === 'image' && (
        <>
          <button
            onClick={handleEditImage}
            className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded"
          >
            Edit Image
          </button>
          <button
            onClick={handleDeleteImage}
            className="block w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 rounded"
          >
            Delete Image
          </button>
        </>
      )}
    </div>
  );
};

export default ContextMenu; 