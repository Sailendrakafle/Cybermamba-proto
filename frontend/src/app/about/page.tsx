import React from 'react';

export default function About() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About EchoMon</h1>
      
      <section className="space-y-6">
        <p className="text-lg">
          Welcome to EchoMon, your comprehensive network monitoring solution. Our platform
          provides real-time insights into your network performance and device connectivity.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            We strive to make network monitoring simple and accessible, helping you maintain
            optimal network performance and quickly identify potential issues before they
            impact your operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Real-time network monitoring</li>
              <li>Device connectivity tracking</li>
              <li>Performance metrics</li>
              <li>Automated alerts</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Next.js frontend</li>
              <li>Django backend</li>
              <li>Real-time updates</li>
              <li>Responsive design</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
          Version 1.0.0 | © 2025 EchoMon. All rights reserved.
        </p>
      </section>
    </main>
  );
}