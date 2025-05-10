/**
 * News API client
 */
import { API_BASE_URL } from '../config';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  publish_date: string;
  image: string | null;
  url: string;
}

export const newsAPI = {
  /**
   * Get all news items
   */
  async getNews(): Promise<NewsItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/news/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Get a single news item by ID
   * @param id News item ID
   */
  async getNewsItem(id: number): Promise<NewsItem> {
    const response = await fetch(`${API_BASE_URL}/api/news/${id}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news item: ${response.status}`);
    }
    return response.json();
  }
}
