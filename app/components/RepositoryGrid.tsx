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
          href={`/repository/${repo.id}`} 
          key={repo.id}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{repo.name}</h2>
          <p className="text-gray-600">
            {repo.documentCount} CMS documents
          </p>
        </Link>
      ))}
    </div>
  );
} 