# TiptapEditor Refactoring Plan

## Setup and Structure
- [x] Create folder structure
- [x] Create initial index.ts file

## Extension Components
- [x] Extract Figure extension to its own file
- [x] Extract Figcaption extension to its own file
- [x] Create extensions/index.ts with all extensions configuration

## Hooks
- [x] Extract useTableControls hook
- [x] Extract useImageControls hook
- [x] Create hooks/index.ts for exporting hooks

## Contextual Controls
- [x] Create ContextualControls parent component
- [x] Extract TableControls component
- [x] Extract ImageControls component
- [x] Implement proper positioning logic in hook files

## Modal Components
- [x] Extract ImageModal component
- [x] Extract TableModal component

## Context Menu
- [x] Extract ContextMenu component

## Toolbar Components
- [x] Create EditorToolbar parent component
- [x] Create FormattingToolbar (bold, italic, etc)
- [x] Create StructureToolbar (headings, lists, etc)
- [x] Create InsertToolbar (image, table, etc)
- [x] Create toolbar/index.ts

## Main Component
- [x] Refactor main TiptapEditor component
- [ ] Implement proper state management
- [x] Handle image editing properly

## Styling
- [x] Create EditorStyles component with styled-components
- [x] Extract global styles to GlobalStyles component

## Next Steps
- [ ] Fix remaining linter errors in components
- [ ] Add tests for all components
- [ ] Improve accessibility
- [ ] Add more extensions (link, mention, etc)
- [ ] Add more contextual controls
- [ ] Add more toolbar options 