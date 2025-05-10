'use client';

import { useEffect, useState } from 'react';
import { newsAPI } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  publish_date: string;
  image: string | null;
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsAPI.getNews();
        setNewsItems(data);
      } catch (err) {
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Latest News</h1>
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Latest News</h1>
      
      <div>
        {newsItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div>
                <span>
                  {new Date(item.publish_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                />
              )}
              <p>
                {item.summary}
              </p>
              <div>
                {item.content}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {newsItems.length === 0 && (
          <div>
            No news articles available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}