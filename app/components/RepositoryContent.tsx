'use client';

import { useState } from 'react';
import { createFile } from '@/app/lib/github';

export interface FileItem {
  name: string;
  path: string;
  type: string;
  download_url: string | null;
}

interface RepositoryContentProps {
  repositoryId: string;
  files: FileItem[];
  branches: string[];
  onBranchChange: (branch: string) => void;
}

export default function RepositoryContent({
  repositoryId,
  files,
  branches,
  onBranchChange,
}: RepositoryContentProps) {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileType, setFileType] = useState<'md' | 'cmsjs'>('md');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState(branches[0] || 'main');

  const handleCreateFile = async () => {
    if (!newFileName) return;
    
    // Remove any extension the user might have added
    const baseName = newFileName.replace(/\.(md|cmsjs)$/, '');
    const fullFileName = `${baseName}.${fileType}`;

    setIsCreating(true);
    setError(null);

    try {
      // Create initial content based on file type
      const initialContent = fileType === 'md' 
        ? '# New Document\n\nStart writing your content here...'
        : 'export default {\n  // Add your CMS configuration here\n};';

      // Create the file directly in main branch
      await createFile(repositoryId, fullFileName, initialContent);

      // Redirect to the file editor
      window.location.href = `/repository/${encodeURIComponent(repositoryId)}/file/${encodeURIComponent(fullFileName)}?tab=content`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create file');
      setIsCreating(false);
    }
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    onBranchChange(branch);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any file extension the user might type
    const value = e.target.value.replace(/\.(md|cmsjs)$/, '');
    setNewFileName(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label htmlFor="branch" className="text-sm font-medium text-gray-700">
            Branch:
          </label>
          <select
            id="branch"
            className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            onChange={(e) => handleBranchChange(e.target.value)}
            value={selectedBranch}
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFileType('md');
              setShowNewFileDialog(true);
              setNewFileName('');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New .md file
          </button>
          <button
            onClick={() => {
              setFileType('cmsjs');
              setShowNewFileDialog(true);
              setNewFileName('');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New .cmsjs file
          </button>
        </div>
      </div>

      {showNewFileDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              Create new {fileType === 'md' ? 'Markdown' : 'CMS JavaScript'} file
            </h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
                  File name
                </label>
                <div className="mt-1 relative">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="fileName"
                      id="fileName"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 rounded-md px-4 py-3 text-gray-900 pr-16"
                      placeholder="example"
                      value={newFileName}
                      onChange={handleFileNameChange}
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">.{fileType}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  File will be created in the main branch
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFileDialog(false);
                    setNewFileName('');
                    setError(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateFile}
                  disabled={!newFileName || isCreating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.path}>
              <a
                href={`/repository/${encodeURIComponent(repositoryId)}/file/${encodeURIComponent(file.path)}?tab=content`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {file.type === 'dir' ? (
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        {file.name}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 