'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { IconMenu2, IconX, IconSun, IconMoon } from '@tabler/icons-react';
import { AuthDialog } from './AuthDialog';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/echomon-logo.svg" 
                  alt="EchoMon Logo" 
                  width={40}
                  height={40}
                  className="transition-transform duration-200 hover:scale-105" 
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-black dark:to-white bg-clip-text text-transparent">
                  EchoMon
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground p-2"
              >
                {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                News
              </Link>
              <button
                onClick={() => setIsAuthDialogOpen(true)}
                className="btn-primary"
              >
                Login
              </button>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground p-2"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-border/40 space-y-4">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/news" className="block text-muted-foreground hover:text-primary transition-colors">
                News
              </Link>
              <button
                onClick={() => setIsAuthDialogOpen(true)}
                className="w-full btn-primary"
              >
                Login
              </button>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-2 rounded-md bg-accent text-accent-foreground"
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