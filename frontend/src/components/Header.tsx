'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { IconMenu2, IconX, IconSun, IconMoon } from '@tabler/icons-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/cybermamba-logo.svg" alt="CyberMamba Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                CyberMamba
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link href="/news" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              News
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
            >
              {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link href="/" className="block text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="/about" className="block text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link href="/news" className="block text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              News
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full text-left p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}