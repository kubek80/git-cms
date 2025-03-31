'use client';

import { useState } from 'react';

interface FileEditorProps {
  filePath: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

export default function FileEditor({ 
  filePath, 
  initialContent, 
  onSave 
}: FileEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold break-all">{filePath}</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save & Create PR'}
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[600px] font-mono p-4 border rounded resize-none"
      />
    </div>
  );
} 