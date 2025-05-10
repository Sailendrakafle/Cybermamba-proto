'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { subscriberApi } from '@/services/api';

export default function Subscribe() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await subscriberApi.subscribe({
        name: formData.name,
        email: formData.email,
        agreed_to_terms: formData.agreeToTerms
      });

      router.push('/subscribe/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to EchoMon</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  required
                />
                <label htmlFor="terms">
                  I agree to the{' '}
                  <a href="/terms">
                    Terms of Use
                  </a>
                </label>
              </div>

              {error && (
                <div>{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}