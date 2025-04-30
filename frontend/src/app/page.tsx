'use client';

import { useState } from 'react';
import { NetworkDevices } from '@/components/NetworkDevices';
import { SpeedTest } from '@/components/SpeedTest';
import { SubscribeDialog } from '@/components/SubscribeDialog';

export default function Home() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Cybermamba</h1>
          <p className="text-lg mb-8">Your comprehensive network monitoring solution</p>
          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Subscribe Now
          </button>
        </div>
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <SpeedTest />
            <NetworkDevices />
          </div>
        </div>
        <SubscribeDialog
          open={isSubscribeOpen}
          onOpenChange={setIsSubscribeOpen}
        />
      </main>
    </div>
  );
}
