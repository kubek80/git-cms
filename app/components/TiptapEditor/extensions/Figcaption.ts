import { Node } from "@tiptap/core";

// Define Figcaption extension for image captions
export const Figcaption = Node.create({
  name: "figcaption",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "figcaption",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figcaption", { class: "image-description", ...HTMLAttributes }, 0];
  },
});
