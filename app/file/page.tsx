'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FileEditor from '../components/FileEditor';
import { CmsData } from '../components/CmsEditor';
import { DEFAULT_CMS_JSON_TEMPLATE } from '../utils/constants';

export default function FilePage() {
  const [savedData, setSavedData] = useState<CmsData | null>(null);
  const [savedRawContent, setSavedRawContent] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState<string>('');
  
  // Load the blank template when page loads
  useEffect(() => {
    // In a real app, this would come from the server or URL params
    // For now, just use our default template
    setInitialContent(DEFAULT_CMS_JSON_TEMPLATE);
  }, []);

  const handleSave = (data: CmsData | string, isRawContent?: boolean) => {
    if (isRawContent && typeof data === 'string') {
      // This is raw file content
      console.log('Saved raw content:', data.substring(0, 100) + '...');
      setSavedRawContent(data);
    } else {
      // This is structured CMS data
      console.log('Saved structured data:', data);
      setSavedData(data as CmsData);
    }
    // In a real application, you would save this data to your backend
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">File Editor</h1>
        <p className="mb-8 text-gray-700">
          Edit files using the CMSJS format. The editor will generate structured content
          with metadata and social information.
        </p>
        
        <FileEditor initialContent={initialContent} onSave={handleSave} />
        
        {savedRawContent && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Raw JS File Content:</h2>
            <pre className="bg-white p-4 rounded border overflow-auto max-h-48 text-gray-700">
              {savedRawContent}
            </pre>
          </div>
        )}
        
        {savedData && !savedRawContent && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Structured Data:</h2>
            <pre className="bg-white p-4 rounded border overflow-auto max-h-48 text-gray-700">
              {JSON.stringify(savedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Layout>
  );
} 