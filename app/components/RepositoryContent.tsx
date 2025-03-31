'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="branch" className="text-sm font-medium text-gray-700">
          Branch:
        </label>
        <select
          id="branch"
          className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          onChange={(e) => onBranchChange(e.target.value)}
          defaultValue="main"
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

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