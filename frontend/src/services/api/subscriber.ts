/**
 * Subscriber API client
 */
import { API_BASE_URL } from '../config';

interface SubscriberData {
  name: string;
  email: string;
  agreed_to_terms: boolean;
}

export const subscriberApi = {
  /**
   * Subscribe a new user
   * @param data Subscriber data
   */
  async subscribe(data: SubscriberData) {
    const response = await fetch(`${API_BASE_URL}/api/subscribers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Subscription failed');
    }

    return response.json();
  }
}
