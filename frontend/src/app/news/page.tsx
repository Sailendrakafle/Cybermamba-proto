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
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Latest News</h1>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border dark:border-gray-700 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      
      <div className="space-y-8">
        {newsItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-gray-600 dark:text-gray-300">
                {item.summary}
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {item.content}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {newsItems.length === 0 && (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            No news articles available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}