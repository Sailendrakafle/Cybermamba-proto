'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cybermamba. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <Link 
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Use
            </Link>
            <Link 
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Dashboard
            </Link>
            <Link 
              href="/subscribe"
              className="text-sm btn-primary"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}