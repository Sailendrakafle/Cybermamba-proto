import React, { useState, useEffect } from 'react';
import { networkApi } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  timestamp: string;
  server: {
    host: string;
    name: string;
    location: string;
  };
}

export function SpeedTest() {
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  // Fetch the most recent speed test result
  const fetchLatestResult = async () => {
    try {
      setIsLoading(true);
      const response = await networkApi.getLatestSpeedTest();
      if (response.data && response.data.data) {
        setResult(response.data.data);
        setLastTestTime(new Date(response.data.data.timestamp));
      }
    } catch (err) {
      console.error('Error fetching latest speed test:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run a new speed test
  const runSpeedTest = async () => {
    try {
      setIsRunning(true);
      setProgress(0);
      setError(null);
      
      // Start the speed test
      await networkApi.startSpeedTest();
      
      // Poll for results
      const intervalId = setInterval(async () => {
        try {
          const status = await networkApi.getSpeedTestStatus();
          if (status.data.status === 'completed') {
            clearInterval(intervalId);
            fetchLatestResult();
            setIsRunning(false);
            setProgress(100);
          } else if (status.data.status === 'running') {
            setProgress(status.data.progress || 
              (status.data.phase === 'download' ? 30 : 
               status.data.phase === 'upload' ? 60 : 10));
          } else if (status.data.status === 'error') {
            clearInterval(intervalId);
            setError('Speed test failed. Please try again.');
            setIsRunning(false);
          }
        } catch (err) {
          clearInterval(intervalId);
          setError('Failed to get speed test status.');
          setIsRunning(false);
        }
      }, 2000);
    } catch (err) {
      setError('Failed to start speed test. Please try again.');
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchLatestResult();
  }, []);

  const formatSpeed = (speed: number) => {
    return speed < 1 ? `${(speed * 1000).toFixed(0)} Kbps` : `${speed.toFixed(1)} Mbps`;
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Network Speed Test</h2>
        <div className="text-sm text-gray-500">
          {lastTestTime && !isRunning ? (
            <>Last test: {lastTestTime.toLocaleString()}</>
          ) : isRunning ? (
            <>Speed test in progress...</>
          ) : (
            <>No recent tests</>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {isRunning && (
        <div className="mb-4">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">
            {progress < 40 ? 'Testing download speed...' : 
             progress < 80 ? 'Testing upload speed...' : 'Finalizing results...'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500 mb-1">Download</p>
          {isLoading ? (
            <Skeleton className="h-7 w-full" />
          ) : (
            <p className="text-lg font-bold">
              {result ? formatSpeed(result.download) : '---'}
            </p>
          )}
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500 mb-1">Upload</p>
          {isLoading ? (
            <Skeleton className="h-7 w-full" />
          ) : (
            <p className="text-lg font-bold">
              {result ? formatSpeed(result.upload) : '---'}
            </p>
          )}
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500 mb-1">Ping</p>
          {isLoading ? (
            <Skeleton className="h-7 w-full" />
          ) : (
            <p className="text-lg font-bold">
              {result ? `${result.ping.toFixed(0)} ms` : '---'}
            </p>
          )}
        </div>
      </div>

      {result && !isRunning && (
        <div className="text-sm text-gray-600 mb-4">
          <p>Server: {result.server.name} ({result.server.location})</p>
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={runSpeedTest}
          disabled={isRunning || isLoading}
          className={isRunning ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isRunning ? "Running Test..." : "Run Speed Test"}
        </Button>
      </div>
    </Card>
  );
}