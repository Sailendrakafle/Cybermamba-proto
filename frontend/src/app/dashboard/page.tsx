'use client';

import { useEffect } from 'react';
import { NetworkDevices } from '@/components/NetworkDevices';
import { SpeedTest } from '@/components/SpeedTest';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkPermissions } from '@/lib/hooks/useNetworkPermissions';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { networkStatus, speedTest, loading, error } = useNetworkPermissions();

  useEffect(() => {
    if (!loading && (!networkStatus || !speedTest)) {
      router.push('/'); // Redirect to home if permissions aren't granted
    }
  }, [loading, networkStatus, speedTest, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !networkStatus || !speedTest) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <Alert variant="destructive">
            <AlertDescription>
              Network permissions are required to access the dashboard. Please grant permissions on the home page.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your network performance and connected devices
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <SpeedTest permissionsGranted={speedTest} />
            <NetworkDevices permissionsGranted={networkStatus} />
          </div>
        </div>
      </main>
    </div>
  );
}