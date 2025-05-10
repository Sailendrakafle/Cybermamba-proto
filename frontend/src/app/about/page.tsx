import React from 'react';

export default function About() {
  return (
    <main>
      <h1>About EchoMon</h1>
      
      <section>
        <p>
          Welcome to EchoMon, your comprehensive network monitoring solution. Our platform
          provides real-time insights into your network performance and device connectivity.
        </p>

        <div>
          <h2>Our Mission</h2>
          <p>
            We strive to make network monitoring simple and accessible, helping you maintain
            optimal network performance and quickly identify potential issues before they
            impact your operations.
          </p>
        </div>

        <div>
          <div>
            <h3>Key Features</h3>
            <ul>
              <li>Real-time network monitoring</li>
              <li>Device connectivity tracking</li>
              <li>Performance metrics</li>
              <li>Automated alerts</li>
            </ul>
          </div>

          <div>
            <h3>Technology Stack</h3>
            <ul>
              <li>Next.js frontend</li>
              <li>Django backend</li>
              <li>Real-time updates</li>
              <li>Responsive design</li>
            </ul>
          </div>
        </div>

        <p>
          Version 1.0.0 | © 2025 EchoMon. All rights reserved.
        </p>
      </section>
    </main>
  );
}