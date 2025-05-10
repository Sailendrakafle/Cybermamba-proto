import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Thank you for subscribing to EchoMon! We&apos;ve received your subscription request
              and will keep you updated with our latest news and features.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}