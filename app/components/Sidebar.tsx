'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-full">
      <div className="mb-8">
        <h1 className="text-xl font-bold">GitHub CMS</h1>
      </div>
      <nav className="space-y-2">
        <Link 
          href="/"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Repositories
        </Link>
        <Link 
          href="/settings"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          GitHub Settings
        </Link>
      </nav>
    </div>
  );
} 