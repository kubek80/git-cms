import { Node } from "@tiptap/core";

// Define Figure extension to allow figure and figcaption elements
export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "image figcaption?",
  draggable: true,
  parseHTML() {
    return [
      {
        tag: "figure",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      {
        class: "image-container",
        draggable: "true",
        style:
          "width: 100%; margin: 2rem auto; padding: 1rem; box-sizing: border-box;",
        ...HTMLAttributes,
      },
      0,
    ];
  },
});
