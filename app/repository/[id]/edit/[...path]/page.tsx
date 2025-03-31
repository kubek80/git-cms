'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import FileEditor from '@/app/components/FileEditor';
import { getFileContent, createPullRequest } from '@/app/lib/github';

export default function EditFilePage() {
  const params = useParams();
  const router = useRouter();
  const repositoryId = params.id as string;
  const path = (params.path as string[]).join('/');
  
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const fileContent = await getFileContent(repositoryId, path);
        setContent(fileContent);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch file content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [repositoryId, path]);

  const handleSave = async (newContent: string) => {
    try {
      await createPullRequest(repositoryId, path, newContent);
      alert('Changes saved and pull request created!');
      router.push(`/repository/${repositoryId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {loading && (
          <div className="text-gray-600">Loading file content...</div>
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
          <FileEditor
            filePath={path}
            initialContent={content}
            onSave={handleSave}
          />
        )}
      </div>
    </Layout>
  );
} 