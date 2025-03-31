'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/app/components/Layout';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RepositoryContent from '@/app/components/RepositoryContent';
import { getRepositoryContent, getFileBranches } from '@/app/lib/github';
import type { FileItem } from '@/app/components/RepositoryContent';

export default function RepositoryPage() {
  const params = useParams();
  const repositoryId = decodeURIComponent(params.id as string);
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesData, filesData] = await Promise.all([
          getFileBranches(repositoryId),
          getRepositoryContent(repositoryId, "(content)", currentBranch),
        ]);

        setBranches(branchesData);
        setFiles(filesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repositoryId, currentBranch]);

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
  };

  const breadcrumbItems = [
    { label: 'Repositories', href: '/' },
    { label: repositoryId }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold">Repository: {repositoryId}</h1>

        {loading && (
          <div className="text-gray-600">Loading repository content...</div>
        )}

        {error && (
          <div className="text-red-600">
            {error}
            {error.includes('token') && (
              <p className="mt-2">
                Please configure your GitHub token in the{' '}
                <a href="/settings" className="text-blue-600 hover:underline">
                  settings
                </a>
                .
              </p>
            )}
          </div>
        )}

        {!loading && !error && (
          <RepositoryContent
            repositoryId={repositoryId}
            branches={branches}
            files={files}
            onBranchChange={handleBranchChange}
          />
        )}
      </div>
    </Layout>
  );
} 