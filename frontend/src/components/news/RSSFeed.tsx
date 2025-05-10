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
          const proxyUrl = 'https://api.allorigins.win/raw?url=';
          // The Krebs on Security RSS feed - a popular cybersecurity news source
          const targetUrl = encodeURIComponent('https://krebsonsecurity.com/feed/');
          
          const response = await fetch(`${proxyUrl}${targetUrl}`);
          const xmlText = await response.text();
          
          // Convert XML to DOM object
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          
          // Extract items from the RSS feed
          const items = xmlDoc.querySelectorAll('item');
          
          const feedData = Array.from(items).slice(0, 5).map((item) => {
            return {
              title: item.querySelector('title')?.textContent || 'No title',
              link: item.querySelector('link')?.textContent || '#',
              date: formatDate(item.querySelector('pubDate')?.textContent || ''),
            };
          });
          
          setFeed(feedData);
        } catch (err) {
          console.error('Failed to fetch RSS feed:', err);
          setError('Failed to load security news feed');
        } finally {
          setLoading(false);
        }
      };
      
      fetchRSS();
    }
  }, [mounted]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>EchoMon Security News</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton />
                <Skeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : feed.length > 0 ? (
          <div>
            {feed.map((item, index) => (
              <div key={index}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
                <div>{item.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No news items found</div>
        )}
      </CardContent>
    </Card>
  );
}
