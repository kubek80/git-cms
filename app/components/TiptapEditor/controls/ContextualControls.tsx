import React from 'react';
import { Editor } from '@tiptap/react';
import TableControls from './TableControls';
import ImageControls from './ImageControls';

interface ContextualControlsProps {
  editor: Editor;
  tablePosition: { top: number; left: number; show: boolean };
  imagePosition: { top: number; left: number; show: boolean };
}

const ContextualControls: React.FC<ContextualControlsProps> = ({ 
  editor, 
  tablePosition, 
  imagePosition 
}) => {
  if (!editor) return null;

  return (
    <>
      {tablePosition.show && (
        <TableControls editor={editor} position={tablePosition} />
      )}
      {imagePosition.show && (
        <ImageControls editor={editor} position={imagePosition} />
      )}
    </>
  );
};

export default ContextualControls; 