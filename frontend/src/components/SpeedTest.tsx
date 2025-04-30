import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import useSWR from 'swr';
import { networkApi } from '../services/api';
import { RefreshIndicator } from './RefreshIndicator';
import { useState } from 'react';

interface SpeedTestData {
  download: number;
  upload: number;
  ping: number;
}

export function SpeedTest() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { data, error, isLoading, mutate } = useSWR('/speed', networkApi.getSpeedTest);
  
  const handleRefresh = async () => {
    await mutate();
    setLastUpdated(new Date());
  };

  if (error) return (
    <Card>
      <CardHeader>
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
  
  if (isLoading) return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Network Speed</CardTitle>
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
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

  const speedData: SpeedTestData = data?.data?.speed_test;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Network Speed</CardTitle>
        <RefreshIndicator lastUpdated={lastUpdated} onRefresh={handleRefresh} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Download</p>
            <p className="text-2xl font-bold tracking-tight">{speedData?.download} Mbps</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Upload</p>
            <p className="text-2xl font-bold tracking-tight">{speedData?.upload} Mbps</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ping</p>
            <p className="text-2xl font-bold tracking-tight">{speedData?.ping} ms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}