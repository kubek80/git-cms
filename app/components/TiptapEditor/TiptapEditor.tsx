import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';

// Import custom extensions
import { Figure, Figcaption } from './extensions';

// Import toolbar components
import { EditorToolbar } from './toolbar';

// Import modals
import { ImageModal, TableModal } from './modals';

// Import contextual controls
import { ContextualControls } from './controls';

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
}) => {
  // State for modals
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  
  // State for image editing
  const [imageToEdit, setImageToEdit] = useState<{
    src: string;
    alt: string;
    description?: string;
  } | null>(null);

  // Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Figure,
      Figcaption,
      Image.configure({
        inline: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Handlers for image actions
  const handleImageSubmit = useCallback(
    (src: string, alt: string, description?: string) => {
      if (!editor) return;

      if (imageToEdit) {
        // Find the current image node and replace it
        // Logic to replace the image goes here
        setImageToEdit(null);
      } else {
        // Insert a new image
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
              ...(description
                ? [
                    {
                      type: 'figcaption',
                      content: [
                        {
                          type: 'text',
                          text: description,
                        },
                      ],
                    },
                  ]
                : []),
            ],
          })
          .run();
      }

      setImageModalOpen(false);
    },
    [editor, imageToEdit]
  );

  // Handlers for table actions
  const handleTableCreate = useCallback(
    (rows: number, cols: number) => {
      if (!editor) return;

      editor
        .chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: true })
        .run();

      setTableModalOpen(false);
    },
    [editor]
  );

  // Handle clicking on edit button in image
  const handleFigureClick = useCallback(
    (event: MouseEvent) => {
      if (!editor) return;

      const target = event.target as HTMLElement;
      const figure = target.closest('figure.image-container');
      
      if (!figure) return;
      
      // Calculate click position
      const rect = figure.getBoundingClientRect();
      const isTopRightCorner = 
        event.clientX > rect.right - 30 && 
        event.clientY < rect.top + 30;
      
      if (!isTopRightCorner) return;
      
      // Get image data
      const img = figure.querySelector('img');
      const figcaption = figure.querySelector('figcaption');
      
      if (!img) return;
      
      setImageToEdit({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        description: figcaption?.textContent || undefined,
      });
      
      setImageModalOpen(true);
    },
    [editor]
  );
  
  // Add event listener for the figure click
  useEffect(() => {
    if (!editor) return;
    
    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleFigureClick);
    
    return () => {
      editorElement.removeEventListener('click', handleFigureClick);
    };
  }, [editor, handleFigureClick]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-editor border border-gray-300 rounded-md overflow-hidden">
      {!readOnly && (
        <EditorToolbar 
          editor={editor} 
          openImageModal={() => {
            setImageToEdit(null);
            setImageModalOpen(true);
          }} 
          openTableModal={() => setTableModalOpen(true)} 
        />
      )}
      
      <div className="relative">
        <EditorContent editor={editor} className="prose max-w-none p-4" />
        
        {!readOnly && <ContextualControls editor={editor} />}
      </div>
      
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          setImageToEdit(null);
        }}
        onSubmit={handleImageSubmit}
        initialImage={imageToEdit}
      />
      
      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onSubmit={handleTableCreate}
      />
    </div>
  );
};

export default TiptapEditor; 