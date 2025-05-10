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
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <div>
        <div>
          <h2>Subscribe to EchoMon</h2>
          <p>
            Sign up to receive network monitoring alerts and updates.
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
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
                name="email"
                required
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
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
