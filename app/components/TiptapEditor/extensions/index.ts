import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

// Import Figure and Figcaption from their own files
import { Figure } from "./Figure";
import { Figcaption } from "./Figcaption";

// Export extensions for use elsewhere
export { Figure, Figcaption };

// Export all extensions that will be used in the editor
export const getExtensions = () => [
  StarterKit,
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "min-w-full border-collapse border border-gray-300",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border-t border-gray-300",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class:
        "border border-gray-300 bg-gray-100 py-2 px-4 text-left font-medium text-gray-700",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-300 p-2 text-gray-700",
    },
  }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: "centered-image",
      draggable: "false",
      style:
        "max-width: 100% !important; width: auto !important; height: auto !important; display: block !important; margin: 0 auto !important; border-radius: 4px !important;",
    },
  }),
  Figure,
  Figcaption,
];
