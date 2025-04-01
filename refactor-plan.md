# TiptapEditor Refactoring Plan

## Component Structure

```
app/components/TiptapEditor/
  - TiptapEditor.tsx (main component)
  - extensions/
    - index.ts (exports all extensions)
    - Figure.ts
    - Figcaption.ts
  - toolbar/
    - EditorToolbar.tsx
    - FormattingToolbar.tsx
    - StructureToolbar.tsx
    - InsertToolbar.tsx
  - controls/
    - ContextualControls.tsx
    - TableControls.tsx
    - ImageControls.tsx
  - modals/
    - ImageModal.tsx
    - TableModal.tsx
  - context-menu/
    - ContextMenu.tsx
  - styles/
    - EditorStyles.tsx
    - GlobalStyles.tsx
  - hooks/
    - useTableControls.ts
    - useImageControls.ts
  - index.ts (main export file)
```

## Tasks

### Setup and Structure
- [ ] Create folder structure
- [ ] Create initial index.ts file
- [ ] Set up exports/imports between files

### Extension Components
- [ ] Extract Figure extension to its own file
- [ ] Extract Figcaption extension to its own file
- [ ] Create extensions/index.ts with all extensions configuration

### Toolbar Components
- [ ] Create EditorToolbar component
- [ ] Extract FormattingToolbar component (bold, italic, etc.)
- [ ] Extract StructureToolbar component (headings, lists, etc.)
- [ ] Extract InsertToolbar component (table, image, etc.)

### Contextual Controls
- [ ] Create ContextualControls parent component
- [ ] Extract TableControls component
- [ ] Extract ImageControls component
- [ ] Implement proper positioning logic in hook files

### Modal Components
- [ ] Extract ImageModal component
- [ ] Extract TableModal component
- [ ] Ensure modals work with editor context

### Context Menu
- [ ] Extract ContextMenu component
- [ ] Ensure proper event handling

### Styling
- [ ] Create EditorStyles component with styled-components
- [ ] Extract global styles to GlobalStyles component
- [ ] Ensure consistent styling across components

### Main Component
- [ ] Refactor TiptapEditor to use all the new components
- [ ] Implement proper state management
- [ ] Ensure component communication works correctly

### Testing and Refinement
- [ ] Test all components individually
- [ ] Test components integration
- [ ] Fix any styling or functionality issues
- [ ] Ensure backward compatibility

## Benefits of Refactoring
- Improved code organization and maintainability
- Better separation of concerns
- Easier to add new features
- More testable components
- Better performance through optimized rendering 