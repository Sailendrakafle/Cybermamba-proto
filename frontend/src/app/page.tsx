'use client';

import { NetworkDevices } from '@/components/NetworkDevices';
import { SpeedTest } from '@/components/SpeedTest';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Cybermamba</h1>
          <p className="text-lg mb-8">Your comprehensive network monitoring solution</p>
        </div>
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <SpeedTest />
            <NetworkDevices />
          </div>
        </div>
      </main>
    </div>
  );
}
