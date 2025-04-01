'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  imagePlugin,
  InsertImage,
  codeBlockPlugin,
  CodeToggle,
  codeMirrorPlugin,
  directivesPlugin,
  linkPlugin,
  InsertCodeBlock,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  CodeMirrorEditor,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  linkDialogPlugin,
  AdmonitionDirectiveDescriptor,
  InsertAdmonition
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import '../styles/editor.css';

interface MarkdownEditorProps {
  initialContent: string;
  onChange?: (content: string) => void;
  onSave: (content: string) => void;
}

export default function MarkdownEditor({ initialContent, onChange, onSave }: MarkdownEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (newContent: string) => {
    // No longer processing content - using it exactly as provided
    setContent(newContent);
    setUnsavedChanges(true);
    
    // Still call onChange for tracking changes, but don't trigger save
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleSave = () => {
    onSave(content);
    setUnsavedChanges(false);
  };

  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-700">
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M9 12v-7a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-9a2 2 0 0 0 -2 2v3" />
            <path d="M5 15h4" />
            <path d="M7 13v4" />
          </svg>
          <h2 className="text-sm font-medium text-gray-700">Markdown Editor</h2>
        </div>
        <button 
          onClick={handleSave}
          disabled={!unsavedChanges}
          className={`px-3 py-1 rounded text-sm font-medium ${
            unsavedChanges 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {unsavedChanges ? 'Save Changes' : 'Saved'}
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        <MDXEditor
          ref={editorRef}
          markdown={content}
          onChange={handleChange}
          plugins={[
            headingsPlugin(),
            listsPlugin({
              checkboxClassName: 'mdx-checkbox',
              enableTaskList: true,
              styleList: true
            }),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
            imagePlugin(),
            linkDialogPlugin(),
            diffSourcePlugin({
              viewMode: 'rich-text',
              diffMarkdown: initialContent
            }),
            directivesPlugin({
              directiveDescriptors: [
                AdmonitionDirectiveDescriptor
              ]
            }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: 'JavaScript',
                javascript: 'JavaScript',
                ts: 'TypeScript',
                typescript: 'TypeScript',
                jsx: 'JSX',
                tsx: 'TSX',
                css: 'CSS',
                html: 'HTML',
                json: 'JSON',
                md: 'Markdown',
                python: 'Python',
                py: 'Python',
                bash: 'Bash',
                sh: 'Shell',
                php: 'PHP',
                go: 'Go',
                rust: 'Rust',
                ruby: 'Ruby',
                java: 'Java',
                c: 'C',
                cpp: 'C++',
                csharp: 'C#',
                xml: 'XML',
                yaml: 'YAML',
                sql: 'SQL',
                tex: 'LaTeX',
                math: 'Math'
              }
            }),
            codeBlockPlugin({
              defaultCodeBlockLanguage: 'text',
              codeBlockEditorDescriptors: [
                { 
                  match: () => true,
                  priority: 1,
                  Editor: CodeMirrorEditor
                }
              ]
            }),
            linkPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <BlockTypeSelect />
                  <CreateLink />
                  <InsertImage />
                  <InsertTable />
                  <InsertThematicBreak />
                  <ListsToggle />
                  <CodeToggle />
                  <InsertCodeBlock />
                  <InsertAdmonition />
                  <DiffSourceToggleWrapper>
                    <></>

                  </DiffSourceToggleWrapper>
                  <ConditionalContents
                    options={[
                      {
                        when: editor => editor?.editorType === 'codeblock',
                        contents: () => <ChangeCodeMirrorLanguage />
                      }
                    ]}
                  />
                </>
              )
            })
          ]}
          contentEditableClassName="prose max-w-none h-full min-h-[600px]"
          className="h-full relative mdx-editor-container"
          spellCheck={false}
        />
      </div>
    </div>
  );
} 