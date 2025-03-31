'use client';

import { useState } from 'react';
import CmsEditor from './CmsEditor';
import { CmsData } from './CmsEditor';
import { DEFAULT_CMSJS_TEMPLATE, EMPTY_CMS_DATA } from '../utils/constants';

interface FileEditorProps {
  initialContent?: string;
  onSave?: (data: CmsData | string, isRawContent?: boolean) => void;
}

export default function FileEditor({ initialContent = '', onSave }: FileEditorProps) {
  // Parse initial content if it's a CMSJS file
  const parseCmsJsContent = (content: string): CmsData => {
    try {
      // Check if it's the default template
      if (content === DEFAULT_CMSJS_TEMPLATE || 
          content.includes('// Add your CMS configuration here')) {
        return { ...EMPTY_CMS_DATA };
      }
      
      // Try to parse the content as a CMSJS file
      if (content.includes('export default {')) {
        // Extract the object portion from the export default statement
        const objectMatch = content.match(/export default\s*(\{[\s\S]*\});?/);
        if (objectMatch && objectMatch[1]) {
          const objectString = objectMatch[1];
          
          // Extract the content section
          const contentMatch = objectString.match(/content:\s*("[^"]*"|'[^']*'|`[^`]*`)/);
          const contentValue = contentMatch ? contentMatch[1].slice(1, -1) : '';
          
          // Try to extract metadata and social objects
          const metadataMatch = objectString.match(/metadata:\s*(\{[\s\S]*?\})/);
          const socialMatch = objectString.match(/social:\s*(\{[\s\S]*?\})/);
          
          let metadata = {
            title: '',
            description: '',
            keywords: '',
            canonicalUrl: '',
          };
          
          let social = {
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            twitterTitle: '',
            twitterDescription: '',
            twitterImage: '',
            twitterCardType: 'summary_large_image' as const,
          };
          
          // Parse metadata if available
          if (metadataMatch) {
            try {
              // Replace JSON-stringified values with actual values
              const metadataStr = metadataMatch[1].replace(/"([^"]*)"/g, (match, p1) => `"${p1}"`);
              const metadataObj = Function(`return ${metadataStr}`)();
              metadata = { ...metadata, ...metadataObj };
            } catch (e) {
              console.error('Error parsing metadata:', e);
            }
          }
          
          // Parse social if available
          if (socialMatch) {
            try {
              // Replace JSON-stringified values with actual values
              const socialStr = socialMatch[1].replace(/"([^"]*)"/g, (match, p1) => `"${p1}"`);
              const socialObj = Function(`return ${socialStr}`)();
              social = { ...social, ...socialObj };
            } catch (e) {
              console.error('Error parsing social data:', e);
            }
          }
          
          return {
            content: contentValue,
            metadata,
            social,
          };
        }
      }
      
      // If we can't parse it, just use the content as-is
      return {
        ...EMPTY_CMS_DATA,
        content: content,
      };
    } catch (e) {
      console.error('Error parsing CMSJS content:', e);
      return { ...EMPTY_CMS_DATA };
    }
  };

  // Initialize content using the parser
  const [content, setContent] = useState<CmsData>(parseCmsJsContent(initialContent));

  const handleSave = (data: CmsData | string, isRawContent?: boolean) => {
    if (isRawContent) {
      // This is raw file content (string)
      console.log('Handling raw file content:', typeof data === 'string' ? data.substring(0, 100) + '...' : 'Not a string');
      if (onSave) {
        onSave(data, true);
      }
    } else {
      // This is structured CMS data
      const cmsData = data as CmsData;
      setContent(cmsData);
      if (onSave) {
        onSave(cmsData);
      }
    }
  };

  return (
    <div className="file-editor">
      <CmsEditor 
        initialData={content} 
        onSave={handleSave} 
      />
    </div>
  );
} 