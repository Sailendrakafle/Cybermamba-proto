import React from 'react';
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
import { SWR_CONFIGS } from '@/lib/utils';
import { Progress } from "@/components/ui/progress";

interface SpeedTestData {
  download_speed: number;
  upload_speed: number;
  ping: number;
  timestamp: string;
}

interface SpeedTestProps {
  permissionsGranted: boolean;
}

interface SpeedTestError {
  error: string;
  error_type: 'server_error' | 'download_error' | 'upload_error' | 'ping_error' | 'unknown';
  details?: string;
}

const getSpeedRating = (speed: number): { rating: string; color: string } => {
  if (speed >= 100) return { rating: 'Excellent', color: 'text-green-500 dark:text-green-400' };
  if (speed >= 50) return { rating: 'Good', color: 'text-blue-500 dark:text-blue-400' };
  if (speed >= 25) return { rating: 'Fair', color: 'text-yellow-500 dark:text-yellow-400' };
  return { rating: 'Poor', color: 'text-red-500 dark:text-red-400' };
};

const getPingRating = (ping: number): { rating: string; color: string } => {
  if (ping < 20) return { rating: 'Excellent', color: 'text-green-500 dark:text-green-400' };
  if (ping < 50) return { rating: 'Good', color: 'text-blue-500 dark:text-blue-400' };
  if (ping < 100) return { rating: 'Fair', color: 'text-yellow-500 dark:text-yellow-400' };
  return { rating: 'Poor', color: 'text-red-500 dark:text-red-400' };
};

export function SpeedTest({ permissionsGranted }: SpeedTestProps) {
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const loadingSteps = ['Connecting...', 'Testing download...', 'Testing upload...', 'Measuring latency...'];
  const [currentStep, setCurrentStep] = React.useState(0);

  const { data, error, isLoading, mutate } = useSWR<SpeedTestData>(
    permissionsGranted ? '/api/network/speed' : null,
    async () => {
      const response = await networkApi.getSpeedTest();
      return response.data;
    },
    SWR_CONFIGS.speedTest
  );

  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) return prev;
          const increment = Math.floor(Math.random() * 15) + 5;
          const next = Math.min(prev + increment, 95);
          setCurrentStep(Math.floor((next / 95) * (loadingSteps.length - 1)));
          return next;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        setLoadingProgress(0);
        setCurrentStep(0);
      };
    }
  }, [isLoading]);

  const getErrorMessage = (error: any) => {
    const speedTestError = error?.response?.data as SpeedTestError;
    if (speedTestError?.error) {
      return speedTestError.error;
    }
    return 'Failed to load speed test. Please try again later.';
  };

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
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
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
          <div className="space-y-4">
            <Alert>
              <AlertDescription>{loadingSteps[currentStep]}</AlertDescription>
            </Alert>
            <Progress value={loadingProgress} className="w-full" />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const speedData = data || { 
    download_speed: 0, 
    upload_speed: 0, 
    ping: 0, 
    timestamp: '' 
  };

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
              {speedData.download_speed.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">Mbps</span>
            </p>
            <p className={`text-xs ${getSpeedRating(speedData.download_speed).color}`}>
              {getSpeedRating(speedData.download_speed).rating}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Upload</p>
            <p className="text-2xl font-bold tracking-tight">
              {speedData.upload_speed.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">Mbps</span>
            </p>
            <p className={`text-xs ${getSpeedRating(speedData.upload_speed).color}`}>
              {getSpeedRating(speedData.upload_speed).rating}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ping</p>
            <p className="text-2xl font-bold tracking-tight">
              {speedData.ping.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">ms</span>
            </p>
            <p className={`text-xs ${getPingRating(speedData.ping).color}`}>
              {getPingRating(speedData.ping).rating}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}