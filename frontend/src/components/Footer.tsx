'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Cybermamba. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <Link 
              href="/terms"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Terms of Use
            </Link>
            <Link 
              href="/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Admin Dashboard
            </Link>
            <Link 
              href="/subscribe"
              className="text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}