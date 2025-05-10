import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Thank you for subscribing to EchoMon! We&apos;ve received your subscription request
              and will keep you updated with our latest news and features.
            </p>
            <div>
              <Link 
                href="/"
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