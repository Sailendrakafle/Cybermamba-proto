'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <div>
        <div>
          <div>
            © {new Date().getFullYear()} EchoMon. All rights reserved.
          </div>
          <div>
            <Link 
              href="/terms"
            >
              Terms of Use
            </Link>
            <Link 
              href="/admin"
            >
              Admin Dashboard
            </Link>
            <Link 
              href="/subscribe"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
