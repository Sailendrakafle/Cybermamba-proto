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
      
      if (response) {
        setResult(response);
        setLastTestTime(new Date(response.timestamp));
      }
    } catch (err) {
      console.error('Error fetching latest speed test:', err);
      setError('Failed to load speed test results');
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
      
      // Start the speed test in the background
      await networkApi.startSpeedTest();
      
      // Poll for progress updates
      const pollInterval = setInterval(async () => {
        try {
          const status = await networkApi.getSpeedTestStatus();
          
          if (status.progress < 100) {
            setProgress(status.progress);
          } else {
            clearInterval(pollInterval);
            setProgress(100);
            
            // Get the completed results
            const response = await networkApi.getLatestSpeedTest();
            if (response) {
              setResult(response);
              setLastTestTime(new Date(response.timestamp));
            }
            
            setIsRunning(false);
          }
        } catch (e) {
          clearInterval(pollInterval);
          console.error('Error polling speed test status:', e);
          setError('Error monitoring speed test progress');
          setIsRunning(false);
        }
      }, 1000);
    } catch (err) {
      console.error('Error starting speed test:', err);
      setError('Failed to start speed test');
      setIsRunning(false);
    }
  };

  // On component mount, fetch the latest result
  useEffect(() => {
    fetchLatestResult();
  }, []);

  // Format bytes to a human-readable format (e.g., MB/s)
  const formatSpeed = (bytesPerSecond: number): string => {
    const mbps = bytesPerSecond / (1024 * 1024);
    return `${mbps.toFixed(2)} Mbps`;
  };

  return (
    <div>
      <div>
        <h3>Network Speed</h3>
      </div>

      <div>
        {isLoading && !result ? (
          <div>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>
            {result ? (
              <div>
                <div>
                  <div>
                    <div>Download</div>
                    <div>{formatSpeed(result.download)}</div>
                  </div>
                  
                  <div>
                    <div>Upload</div>
                    <div>{formatSpeed(result.upload)}</div>
                  </div>
                  
                  <div>
                    <div>Ping</div>
                    <div>{result.ping.toFixed(1)} ms</div>
                  </div>
                </div>

                {lastTestTime && (
                  <div>
                    Last Test: {lastTestTime.toLocaleString()}
                  </div>
                )}
                
                {result.server && (
                  <div>
                    Server: {result.server.name} ({result.server.location})
                  </div>
                )}
              </div>
            ) : (
              <div>No speed tests have been run yet</div>
            )}
          </div>
        )}
        
        {isRunning ? (
          <div>
            <div>
              <div 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div>{progress}%</div>
          </div>
        ) : (
          <Button 
            onClick={runSpeedTest}
            disabled={isLoading}
          >
            Run Speed Test
          </Button>
        )}
      </div>
    </div>
  );
}
