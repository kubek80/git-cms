'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Layout from '@/app/components/Layout';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import FileEditor from '@/app/components/FileEditor';
import PullRequestList from '@/app/components/PullRequestList';
import { getFileContent, createPullRequest, getFilePullRequests, mergePullRequest } from '@/app/lib/github';

interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  mergeable?: boolean;
  mergeable_state?: string;
}

export default function FilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'content';
  
  const repositoryId = decodeURIComponent(params.id as string);
  const encodedPath = (params.path as string[]);
  const path = encodedPath.map(segment => decodeURIComponent(segment)).join('/');
  
  const [content, setContent] = useState('');
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === 'content') {
          const fileContent = await getFileContent(repositoryId, path);
          setContent(fileContent);
        } else if (tab === 'history') {
          const prs = await getFilePullRequests(repositoryId, path);
          setPullRequests(prs);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repositoryId, path, tab]);

  const handleSave = async (newContent: string) => {
    try {
      await createPullRequest(repositoryId, path, newContent);
      alert('Changes saved and pull request created!');
      // Refresh the page to show the new PR
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const handleMerge = async (prNumber: number) => {
    await mergePullRequest(repositoryId, prNumber);
  };

  const breadcrumbItems = [
    { label: 'Repositories', href: '/' },
    { label: repositoryId, href: `/repository/${encodeURIComponent(repositoryId)}` },
    { label: path }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{path}</h1>
          <div className="flex gap-2">
            <a
              href={`/repository/${encodeURIComponent(repositoryId)}/file/${encodedPath.join('/')}?tab=content`}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                tab === 'content'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 bg-white'
              }`}
            >
              Content
            </a>
            <a
              href={`/repository/${encodeURIComponent(repositoryId)}/file/${encodedPath.join('/')}?tab=history`}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                tab === 'history'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 bg-white'
              }`}
            >
              History
            </a>
          </div>
        </div>

        {tab === 'history' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Note about updates</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Due to GitHub API caching, changes may not be reflected immediately. It may take a few minutes for new pull requests or updates to appear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-gray-600">Loading...</div>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {tab === 'content' ? (
              <FileEditor
                filePath={path}
                initialContent={content}
                onSave={handleSave}
              />
            ) : (
              <PullRequestList
                pullRequests={pullRequests}
                isLoading={loading}
                error={error}
                onMerge={handleMerge}
                repositoryId={repositoryId}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 