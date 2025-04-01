import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";

interface ImagePosition {
  top: number;
  left: number;
  show: boolean;
}

/**
 * Hook for managing image controls positioning
 */
export const useImageControls = (editor: Editor | null) => {
  const [imagePosition, setImagePosition] = useState<ImagePosition>({
    top: 0,
    left: 0,
    show: false,
  });

  // Update position when editor selection changes
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      // Handle image controls positioning - place in top right corner
      if (editor.isActive("image") || editor.isActive("figure")) {
        const view = editor.view;
        const { from } = view.state.selection;

        // Find the figure node in the DOM
        let figureNode = null;

        // Try to locate the figure element around the current selection
        const $pos = view.state.doc.resolve(from);
        let depth = $pos.depth;
        while (depth > 0) {
          const node = $pos.node(depth);
          if (node.type.name === "figure") {
            // Found a figure, now get its DOM representation
            try {
              const domPos = view.coordsAtPos(from);
              const dom = document.elementFromPoint(domPos.left, domPos.top);
              if (dom) {
                figureNode = dom.closest("figure");
              }
            } catch (e) {
              console.log("Could not find figure DOM element", e);
            }
            break;
          }
          depth--;
        }

        if (figureNode) {
          const rect = figureNode.getBoundingClientRect();
          const editorRect = editor.view.dom.getBoundingClientRect();

          setImagePosition({
            top: rect.top - editorRect.top + 10, // Position at the top
            left: rect.right - editorRect.left - 120, // Position at the right with offset for menu width
            show: true,
          });
        } else {
          // Fallback to default positioning if figure not found
          const start = view.coordsAtPos(from);
          setImagePosition({
            top: start.top - 50,
            left: start.left,
            show: true,
          });
        }
      } else {
        setImagePosition((prev) => ({ ...prev, show: false }));
      }
    };

    // Listen for selection updates
    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  return imagePosition;
};

export default useImageControls;
