'use client';

import { NetworkDevices } from '@/components/NetworkDevices';
import { SpeedTest } from '@/components/SpeedTest';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto p-4 md:p-8">
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
