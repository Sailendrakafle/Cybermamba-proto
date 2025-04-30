'use client';

import { NetworkDevices } from '@/components/NetworkDevices';
import { SpeedTest } from '@/components/SpeedTest';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Network Monitor</h1>
        <div className="space-y-6">
          <SpeedTest />
          <NetworkDevices />
        </div>
      </main>
    </div>
  );
}
