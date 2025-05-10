'use client';

import { NetworkDevices } from '@/components/NetworkDevices';
import { SpeedTest } from '@/components/SpeedTest';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkPermissions } from '@/lib/hooks/useNetworkPermissions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RSSFeed } from '@/components/RSSFeed';
import { EchoQuiz } from '@/components/EchoQuiz';
import { useEffect, useState } from 'react';
import { newsAPI } from '@/services/api';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  publish_date: string;
}

export default function Home() {
  const { networkStatus, speedTest, loading, error } = useNetworkPermissions();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsAPI.getNews();
        setNewsItems(data.slice(0, 3)); // Get only the latest 3 news items
      } catch (err) {
        setNewsError('Failed to load news');
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to EchoMon</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your comprehensive network monitoring solution
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {error}. Some features may not be available in your browser.
            </AlertDescription>
          </Alert>
        ) : !networkStatus || !speedTest ? (
          <Alert>
            <AlertDescription>
              To use all features of EchoMon, please grant permission to access your network status and perform speed tests. 
              These permissions are required to:
              <ul className="list-disc list-inside mt-2">
                <li>Monitor connected devices on your network</li>
                <li>Measure network speed and performance</li>
                <li>Provide real-time network statistics</li>
              </ul>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6 mt-8">
          {/* Main dashboard cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <SpeedTest permissionsGranted={speedTest} />
            <NetworkDevices permissionsGranted={networkStatus} />
            
            {/* Latest News Card */}
            <Card>
              <CardHeader>
                <CardTitle>Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                {newsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                ) : newsError ? (
                  <p className="text-red-500">{newsError}</p>
                ) : (
                  <div className="space-y-4">
                    {newsItems.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.publish_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{item.summary}</p>
                        <a
                          href={`/news#${item.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Read more →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RSS Feed */}
            <RSSFeed />
          </div>

          {/* Cyber Quiz Section */}
          <div className="mt-8">
            <EchoQuiz />
          </div>
        </div>
      </main>
    </div>
  );
}
