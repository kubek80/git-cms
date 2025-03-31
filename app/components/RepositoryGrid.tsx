'use client';

import Link from 'next/link';

export interface Repository {
  id: string;
  name: string;
  documentCount: number;
}

interface RepositoryGridProps {
  repositories: Repository[];
}

export default function RepositoryGrid({ repositories }: RepositoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo) => (
        <Link 
          href={`/repository/${encodeURIComponent(repo.id)}`}
          key={repo.id}
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-900 transition-all"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-900">{repo.name}</h2>
          <p className="text-gray-700">
            {repo.documentCount} CMS documents
          </p>
        </Link>
      ))}
    </div>
  );
} 