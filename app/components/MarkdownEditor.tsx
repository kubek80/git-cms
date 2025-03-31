'use client';

import { useState, useEffect } from 'react';
import {
  MDXEditor,
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
  CodeMirrorEditor
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import '../styles/editor.css';

interface MarkdownEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function MarkdownEditor({ initialContent, onChange }: MarkdownEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isRawMode, setIsRawMode] = useState(false);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (newContent: string) => {
    // Process content to ensure code blocks have valid language
    const processedContent = newContent.replace(/```(N\/A|null|undefined|\s*)/g, '```js');
    setContent(processedContent);
    onChange(processedContent);
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
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <h2 className="text-sm font-medium text-gray-700">Editor Mode</h2>
        <button
          onClick={() => setIsRawMode(!isRawMode)}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isRawMode ? 'Rich Text' : 'Raw Markdown'}
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        {isRawMode ? (
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            className="raw-markdown"
            spellCheck="false"
            placeholder="Start writing your markdown content here..."
          />
        ) : (
          <MDXEditor
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
                  sql: 'SQL'
                }
              }),
              codeBlockPlugin({
                defaultCodeBlockLanguage: 'js',
                codeBlockEditorDescriptors: [
                  { 
                    match: () => true,
                    priority: 1,
                    Editor: CodeMirrorEditor
                  }
                ]
              }),
              directivesPlugin(),
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
          />
        )}
      </div>
      
      <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 p-2 rounded shadow text-sm z-10">
        Tip: Use ```javascript (or any language name) to create syntax-highlighted code blocks
      </div>
    </div>
  );
} 