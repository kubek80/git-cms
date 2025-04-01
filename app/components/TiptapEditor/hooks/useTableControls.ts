import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";

interface TablePosition {
  top: number;
  left: number;
  show: boolean;
}

/**
 * Hook for managing table controls positioning
 */
export const useTableControls = (editor: Editor | null) => {
  const [tablePosition, setTablePosition] = useState<TablePosition>({
    top: 0,
    left: 0,
    show: false,
  });

  // Update position when editor selection changes
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      if (editor.isActive("table")) {
        const view = editor.view;
        const { from } = view.state.selection;
        const start = view.coordsAtPos(from);

        setTablePosition({
          top: start.top - 50,
          left: start.left,
          show: true,
        });
      } else {
        setTablePosition((prev) => ({ ...prev, show: false }));
      }
    };

    // Listen for selection updates
    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  return tablePosition;
};

export default useTableControls;
