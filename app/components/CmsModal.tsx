'use client';

import { useRef, useEffect, useState } from 'react';
import { CmsData } from './CmsEditor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CmsData;
  onSaveToRepository: (data: string) => void;
}

export default function CmsModal({ isOpen, onClose, cmsData, onSaveToRepository }: CmsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // Format the data as JavaScript object
  const jsContent = `export default {
  // Content section - contains the HTML content from the editor
  content: ${JSON.stringify(cmsData.content, null, 2)},
  
  // Metadata section - contains SEO related information
  metadata: ${JSON.stringify(cmsData.metadata, null, 2)},
  
  // Social section - contains social sharing information
  social: ${JSON.stringify(cmsData.social, null, 2)}
};`;

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus trap and escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Copy to clipboard functionality
  const handleCopy = () => {
    navigator.clipboard.writeText(jsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle download
  const handleDownload = () => {
    const blob = new Blob([jsContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.cmsjs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle saving to repository
  const handleSaveToRepository = () => {
    // We need to pass the raw JavaScript string, not the structured data object
    const contentToSave = jsContent;
    onSaveToRepository(contentToSave);
    onClose();
  };

  if (!isOpen) return null;

  const codeStyle = isDarkTheme ? vscDarkPlus : vs;
  const bgColor = isDarkTheme ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkTheme ? '#FFFFFF' : '#1E1E1E';

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-800">Export CMSJS File</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDarkTheme ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded hover:bg-opacity-80 focus:outline-none focus:ring-2 ${
                isDarkTheme 
                  ? "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
              }`}
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
            {copied && (
              <div className="copied-notification">Copied!</div>
            )}
          </div>
          
          <div className="w-full h-full min-h-[400px] font-mono rounded-md overflow-hidden">
            <SyntaxHighlighter 
              language="javascript" 
              style={codeStyle} 
              customStyle={{ 
                margin: 0, 
                minHeight: '400px', 
                borderRadius: '0.375rem',
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '14px',
              }}
              className={`syntax-highlighter ${isDarkTheme ? 'dark' : 'light'}`}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
            >
              {jsContent}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleSaveToRepository}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save to Repository
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
} 