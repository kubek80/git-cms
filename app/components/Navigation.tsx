'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/cms', label: 'CMS Editor' },
    { href: '/file', label: 'File Editor' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">GitCMS</span>
            </div>
            <div className="ml-6 flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-600 text-gray-900'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <a
              href="https://github.com/yourusername/gitcms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 ml-4"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 