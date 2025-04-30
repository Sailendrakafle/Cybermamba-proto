'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SWRConfig } from 'swr';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRConfig 
          value={{
            refreshInterval: 30000, // Refresh every 30 seconds
            revalidateOnFocus: true,
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
