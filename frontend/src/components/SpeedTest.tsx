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
    <div>
      <div>
        <h2>Network Speed Test</h2>
        <div>
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
        <div>
          <p>{error}</p>
        </div>
      )}

      {isRunning && (
        <div>
          <div>
            <div
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>
            {progress < 40 ? 'Testing download speed...' : 
             progress < 80 ? 'Testing upload speed...' : 'Finalizing results...'}
          </p>
        </div>
      )}

      <div>
        <div>
          <p>Download</p>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <p>
              {result ? formatSpeed(result.download) : '---'}
            </p>
          )}
        </div>
        <div>
          <p>Upload</p>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <p>
              {result ? formatSpeed(result.upload) : '---'}
            </p>
          )}
        </div>
        <div>
          <p>Ping</p>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <p>
              {result ? `${result.ping.toFixed(0)} ms` : '---'}
            </p>
          )}
        </div>
      </div>

      {result && !isRunning && (
        <div>
          <p>Server: {result.server.name} ({result.server.location})</p>
        </div>
      )}

      <div>
        <button 
          onClick={runSpeedTest}
          disabled={isRunning || isLoading}
        >
          {isRunning ? "Running Test..." : "Run Speed Test"}
        </button>
      </div>
    </div>
  );
}