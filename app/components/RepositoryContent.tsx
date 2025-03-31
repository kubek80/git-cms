'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
}

interface RepositoryContentProps {
  repositoryId: string;
  branches: string[];
  files: FileItem[];
  onBranchChange?: (branch: string) => void;
}

export default function RepositoryContent({ 
  repositoryId, 
  branches,
  files,
  onBranchChange
}: RepositoryContentProps) {
  const [currentBranch, setCurrentBranch] = useState(branches[0] || 'main');

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
    onBranchChange?.(branch);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select 
          value={currentBranch}
          onChange={(e) => handleBranchChange(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        {files.map((file) => (
          <Link 
            key={file.path}
            href={file.type === 'file' 
              ? `/repository/${repositoryId}/edit/${file.path}`
              : `/repository/${repositoryId}/folder/${file.path}`
            }
            className="flex items-center p-3 bg-white rounded hover:bg-gray-50 transition-colors"
          >
            <span className="mr-3">
              {file.type === 'folder' ? '📁' : '📄'}
            </span>
            <span>{file.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 