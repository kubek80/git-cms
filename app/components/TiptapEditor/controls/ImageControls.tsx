import React from 'react';
import { Editor } from '@tiptap/react';
import { Edit, Trash2 } from 'lucide-react';

interface ImageControlsProps {
  editor: Editor;
  position: { top: number; left: number };
}

const ImageControls: React.FC<ImageControlsProps> = ({ editor, position }) => {
  if (!editor) return null;

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
      // Store image data in window for the menubar to access
      (window as unknown as { __imageEditData: { src: string; alt: string; description: string } }).__imageEditData = {
        src: imageSrc,
        alt: imageAlt,
        description
      };
      imageButton.click();
    }
  };

  return (
    <div
      className="absolute bg-white shadow-md rounded-md p-1.5 flex gap-2 border border-gray-300 z-50"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button
        onClick={handleEditImage}
        className="p-1.5 hover:bg-blue-50 rounded-md text-gray-800"
        title="Edit image"
      >
        <Edit className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteNode('figure').run()}
        className="p-1.5 hover:bg-red-50 rounded-md text-gray-800"
        title="Delete image"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ImageControls; 