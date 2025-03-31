'use client';

import { useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import CMSJavaScriptEditor from './CMSJavaScriptEditor';

interface FileEditorProps {
  filePath: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

export default function FileEditor({ filePath, initialContent, onSave }: FileEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMarkdown = filePath.endsWith('.md');
  const isCMSJS = filePath.endsWith('.cmsjs');

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-semibold truncate">{filePath}</h1>
        <div className="flex items-center gap-4">
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white">
        {isMarkdown && (
          <MarkdownEditor
            initialContent={initialContent}
            onChange={setContent}
          />
        )}
        {isCMSJS && (
          <CMSJavaScriptEditor
            initialContent={initialContent}
            onChange={setContent}
          />
        )}
        {!isMarkdown && !isCMSJS && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              Unsupported file type. Only .md and .cmsjs files are supported.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 