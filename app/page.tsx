'use client';

import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import RepositoryGrid from './components/RepositoryGrid';
import { getRepositories } from './lib/github';
import type { Repository } from './components/RepositoryGrid';

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const repos = await getRepositories();
        setRepositories(repos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Your Repositories</h1>
        
        {loading && (
          <div className="text-gray-600">Loading repositories...</div>
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

        {!loading && !error && repositories.length === 0 && (
          <div className="text-gray-600">
            No repositories found. Make sure you have repositories with a content directory.
          </div>
        )}

        {!loading && !error && repositories.length > 0 && (
          <RepositoryGrid repositories={repositories} />
        )}
      </div>
    </Layout>
  );
}
