'use client';

import { useState } from 'react';
import CmsEditor from './CmsEditor';
import MarkdownEditor from './MarkdownEditor';
import { CmsData } from './CmsEditor';
import { EMPTY_CMS_DATA } from '../utils/constants';

interface FileEditorProps {
  initialContent?: string;
  filePath?: string;
  onSave?: (data: CmsData | string, isRawContent?: boolean) => void;
}

export default function FileEditor({ initialContent = '', filePath = '', onSave }: FileEditorProps) {
  const isMarkdownFile = filePath.toLowerCase().endsWith('.md');
  const isCmsJsonFile = filePath.toLowerCase().endsWith('.cms.json');
  
  // Parse initial content if it's a CMS JSON file
  const parseCmsJsonContent = (content: string): CmsData => {
    try {
      // If the content is empty, return empty CMS data
      if (!content || content.trim() === '') {
        return { ...EMPTY_CMS_DATA };
      }
      
      // Parse the JSON content
      const parsedContent = JSON.parse(content);
      
      return {
        content: parsedContent.content || '',
        metadata: {
          title: parsedContent.metadata?.title || '',
          description: parsedContent.metadata?.description || '',
          keywords: parsedContent.metadata?.keywords || '',
          canonicalUrl: parsedContent.metadata?.canonicalUrl || '',
        },
        social: {
          ogTitle: parsedContent.social?.ogTitle || '',
          ogDescription: parsedContent.social?.ogDescription || '',
          ogImage: parsedContent.social?.ogImage || '',
          twitterTitle: parsedContent.social?.twitterTitle || '',
          twitterDescription: parsedContent.social?.twitterDescription || '',
          twitterImage: parsedContent.social?.twitterImage || '',
          twitterCardType: parsedContent.social?.twitterCardType || 'summary_large_image',
        },
      };
    } catch (e) {
      console.error('Error parsing CMS JSON content:', e);
      return { ...EMPTY_CMS_DATA };
    }
  };

  // Initialize state
  const [contentData] = useState<CmsData>(isCmsJsonFile ? parseCmsJsonContent(initialContent) : { ...EMPTY_CMS_DATA });
  const [markdownContent, setMarkdownContent] = useState<string>(initialContent);

  // Handle content changes in the markdown editor
  const handleMarkdownChange = (content: string) => {
    setMarkdownContent(content);
  };

  // Handle saving markdown content
  const handleMarkdownSave = (content: string) => {
    if (onSave) {
      onSave(content, true);
    }
  };

  return (
    <div>
      {isMarkdownFile ? (
        <MarkdownEditor 
          initialContent={markdownContent} 
          onChange={handleMarkdownChange} 
          onSave={handleMarkdownSave} 
        />
      ) : isCmsJsonFile ? (
        <CmsEditor 
          initialData={contentData} 
          onSave={onSave || (() => {})} 
        />
      ) : (
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-medium">Unsupported file type</p>
          <p>This editor only supports Markdown (.md) and CMS JSON (.cms.json) files.</p>
        </div>
      )}
    </div>
  );
} 