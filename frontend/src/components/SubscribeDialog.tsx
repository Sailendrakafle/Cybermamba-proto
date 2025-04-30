import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { subscriberApi } from '@/services/api';

interface SubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscribeDialog({ open, onOpenChange }: SubscribeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      await subscriberApi.subscribe({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        agreed_to_terms: true,
      });
      onOpenChange(false);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Subscribe</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}