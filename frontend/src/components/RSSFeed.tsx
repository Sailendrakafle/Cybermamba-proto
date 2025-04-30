import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RSSItem {
  title: string;
  link: string;
  date: string;
}

// Helper function for consistent date formatting
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

export function RSSFeed() {
  const [feed, setFeed] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const fetchRSS = async () => {
        try {
          // Using a proxy service to fetch RSS feed and avoid CORS issues
          const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
          if (!response.ok) throw new Error('Failed to fetch RSS feed');
          
          const data = await response.json();
          const items = data.items.slice(0, 5).map((item: any) => ({
            title: item.title,
            link: item.link,
            date: formatDate(item.pubDate)
          }));
          
          setFeed(items);
        } catch (err) {
          setError('Failed to load cybersecurity news feed');
        } finally {
          setLoading(false);
        }
      };

      fetchRSS();
    }
  }, [mounted]);

  // Show loading skeleton during SSR and initial client-side render
  if (!mounted || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cybersecurity News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cybersecurity News</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cybersecurity News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feed.map((item, index) => (
            <div key={index} className="space-y-1">
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline block font-medium"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}