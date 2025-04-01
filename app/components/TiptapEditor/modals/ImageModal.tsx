import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface ImageModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    src: string;
    alt: string;
    description: string;
  };
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  editor, 
  isOpen, 
  onClose, 
  initialData 
}) => {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [description, setDescription] = useState('');

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      // Check for window global variable for edit data
      const windowWithImageData = window as unknown as { 
        __imageEditData?: { 
          src: string; 
          alt: string; 
          description: string 
        } 
      };
      
      if (windowWithImageData.__imageEditData) {
        setSrc(windowWithImageData.__imageEditData.src || '');
        setAlt(windowWithImageData.__imageEditData.alt || '');
        setDescription(windowWithImageData.__imageEditData.description || '');
        // Clear the global after using it
        delete windowWithImageData.__imageEditData;
      } else if (initialData) {
        setSrc(initialData.src || '');
        setAlt(initialData.alt || '');
        setDescription(initialData.description || '');
      } else {
        setSrc('');
        setAlt('');
        setDescription('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editor || !src) return;
    
    // Insert the image with a figure and figcaption
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'figure',
        content: [
          {
            type: 'image',
            attrs: {
              src,
              alt,
            },
          },
          {
            type: 'figcaption',
            content: description ? [{ type: 'text', text: description }] : [],
          },
        ],
      })
      .run();
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Image' : 'Insert Image'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Image URL
            </label>
            <input
              type="text"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Image description for accessibility"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Caption
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Optional image caption"
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
              {initialData ? 'Update' : 'Insert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageModal; 