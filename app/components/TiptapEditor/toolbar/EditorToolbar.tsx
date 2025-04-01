import React from 'react';
import { Editor } from '@tiptap/react';
import FormattingToolbar from './FormattingToolbar';
import StructureToolbar from './StructureToolbar';
import InsertToolbar from './InsertToolbar';
import { ImageModal, TableModal } from '../modals';

interface EditorToolbarProps {
  editor: Editor;
  openImageModal: () => void;
  openTableModal: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor,
  openImageModal,
  openTableModal
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 p-2 bg-white flex flex-wrap gap-2 justify-between">
      <div className="flex gap-2">
        <FormattingToolbar editor={editor} />
        <div className="border-l border-gray-300 mx-1"></div>
        <StructureToolbar editor={editor} />
      </div>
      <InsertToolbar 
        editor={editor} 
        onImageClick={openImageModal} 
        onTableClick={openTableModal} 
      />
      
      <ImageModal 
        editor={editor} 
        isOpen={imageModalOpen} 
        onClose={() => setImageModalOpen(false)}
      />
      
      <TableModal 
        editor={editor} 
        isOpen={tableModalOpen} 
        onClose={() => setTableModalOpen(false)}
      />
    </div>
  );
};

export default EditorToolbar; 