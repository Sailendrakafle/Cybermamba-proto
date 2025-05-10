'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { IconMenu2, IconX, IconSun, IconMoon } from '@tabler/icons-react';
import { AuthDialog } from '../auth/AuthDialog';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <header>
        <nav>
          <div>
            <div>
              <Link href="/">
                <span>
                  EchoMon
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div>
              <button
                onClick={toggleMenu}
              >
                {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </button>
            </div>

            {/* Desktop menu */}
            <div>
              <Link href="/">
                Home
              </Link>
              <Link href="/about">
                About
              </Link>
              <Link href="/news">
                News
              </Link>
              <button
                onClick={() => setIsAuthDialogOpen(true)}
              >
                Login
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div>
              <Link href="/">
                Home
              </Link>
              <Link href="/about">
                About
              </Link>
              <Link href="/news">
                News
              </Link>
              <button
                onClick={() => setIsAuthDialogOpen(true)}
              >
                Login
              </button>
              <button
                onClick={toggleTheme}
              >
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </button>
            </div>
          )}
        </nav>
      </header>

      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </>
  );
}
