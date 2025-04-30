import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Lock, Wifi } from "lucide-react";
import useSWR from 'swr';
import { networkApi } from '../services/api';
import { RefreshIndicator } from './RefreshIndicator';

interface SpeedTestData {
  download: number;
  upload: number;
  ping: number;
}

interface SpeedTestProps {
  permissionsGranted: boolean;
}

export function SpeedTest({ permissionsGranted }: SpeedTestProps) {
  const { data, error, isLoading, mutate } = useSWR(
    permissionsGranted ? '/api/network/speed' : null,
    networkApi.getSpeedTest
  );

  const handleRefresh = () => {
    mutate();
  };

  const lastUpdated = data?.timestamp ? new Date(data.timestamp) : null;

  if (!permissionsGranted) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Network Speed</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please grant permissions to perform network speed tests.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Network Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load speed test. Please try again later.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Network Speed</CardTitle>
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>Running speed test...</AlertDescription>
          </Alert>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const speedData: SpeedTestData = data?.data?.speed_test || { download: 0, upload: 0, ping: 0 };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <CardTitle>Network Speed</CardTitle>
          <Wifi className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <RefreshIndicator 
          lastUpdated={lastUpdated} 
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Download</p>
            <p className="text-2xl font-bold tracking-tight">
              {speedData.download.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">Mbps</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Upload</p>
            <p className="text-2xl font-bold tracking-tight">
              {speedData.upload.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">Mbps</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ping</p>
            <p className="text-2xl font-bold tracking-tight">
              {speedData.ping.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">ms</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}