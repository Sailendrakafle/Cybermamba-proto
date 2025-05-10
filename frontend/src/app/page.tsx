'use client';

import { NetworkDevices } from '@/components/network/NetworkDevices';
import { SpeedTest } from '@/components/network/SpeedTest';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkPermissions } from '@/lib/hooks/useNetworkPermissions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RSSFeed } from '@/components/news/RSSFeed';
import { EchoQuiz } from '@/components/quiz/EchoQuiz';
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
    <div>
      <main>
        <div>
          <h1>Welcome to EchoMon</h1>
          <p>
            Your comprehensive network monitoring solution
          </p>
        </div>

        {loading ? (
          <div>
            {[...Array(4)].map((_, i) => (
              <div key={i}>Loading...</div>
            ))}
          </div>
        ) : error ? (
          <div>
            <p>
              {error}. Some features may not be available in your browser.
            </p>
          </div>
        ) : !networkStatus || !speedTest ? (
          <div>
            <p>
              To use all features of EchoMon, please grant permission to access your network status and perform speed tests. 
              These permissions are required to:
              <ul>
                <li>Monitor connected devices on your network</li>
                <li>Measure network speed and performance</li>
                <li>Provide real-time network statistics</li>
              </ul>
            </AlertDescription>
          </Alert>
        ) : null}

        <div>
          {/* Main dashboard cards */}
          <div>
            <SpeedTest permissionsGranted={speedTest} />
            <NetworkDevices permissionsGranted={networkStatus} />
            
            {/* Latest News Card */}
            <Card>
              <CardHeader>
                <CardTitle>Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                {newsLoading ? (
                  <div>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} />
                    ))}
                  </div>
                ) : newsError ? (
                  <p>{newsError}</p>
                ) : (
                  <div>
                    {newsItems.map((item) => (
                      <div key={item.id}>
                        <h3>{item.title}</h3>
                        <p>
                          {new Date(item.publish_date).toLocaleDateString()}
                        </p>
                        <p>{item.summary}</p>
                        <a
                          href={`/news#${item.id}`}
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

          {/* EchoMon Quiz Section */}
          <div>
            <EchoQuiz />
          </div>
        </div>
      </main>
    </div>
  );
}
