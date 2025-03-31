import React, { useState } from 'react';

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

interface PullRequestListProps {
  pullRequests: PullRequest[];
  isLoading: boolean;
  error: string | null;
  onMerge: (prNumber: number) => Promise<void>;
  repositoryId: string;
}

export default function PullRequestList({ 
  pullRequests,
  isLoading,
  error,
  onMerge,
  repositoryId
}: PullRequestListProps) {
  const [merging, setMerging] = useState<number | null>(null);

  const handleMerge = async (prNumber: number) => {
    try {
      setMerging(prNumber);
      await onMerge(prNumber);
      // Refresh the page to update PR list
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to merge pull request');
    } finally {
      setMerging(null);
    }
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading pull requests...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (pullRequests.length === 0) {
    return <div className="text-gray-600">No pull requests found for this file.</div>;
  }

  const openPRs = pullRequests.filter(pr => pr.state === 'open');
  const closedPRs = pullRequests.filter(pr => pr.state === 'closed');

  return (
    <div className="space-y-6">
      {openPRs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Open Pull Requests</h2>
          <div className="space-y-2">
            {openPRs.map((pr) => (
              <div
                key={pr.number}
                className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={pr.user.avatar_url}
                    alt={pr.user.login}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {pr.title}
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          open
                        </span>
                        {pr.mergeable === false && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            conflicts
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <a
                          href={pr.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View on GitHub
                        </a>
                        {pr.mergeable && (
                          <button
                            onClick={() => handleMerge(pr.number)}
                            disabled={merging === pr.number}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {merging === pr.number ? 'Merging...' : 'Merge'}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      #{pr.number} by {pr.user.login} • 
                      Updated {new Date(pr.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {closedPRs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Closed Pull Requests</h2>
          <div className="space-y-2">
            {closedPRs.map((pr) => (
              <div
                key={pr.number}
                className="block p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={pr.user.avatar_url}
                    alt={pr.user.login}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {pr.title}
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          closed
                        </span>
                      </h3>
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View on GitHub
                      </a>
                    </div>
                    <p className="text-sm text-gray-600">
                      #{pr.number} by {pr.user.login} • 
                      Updated {new Date(pr.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 