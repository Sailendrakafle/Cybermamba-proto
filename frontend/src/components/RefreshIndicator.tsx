import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshIndicatorProps {
  lastUpdated: Date;
  onRefresh: () => void;
}

export function RefreshIndicator({ lastUpdated, onRefresh }: RefreshIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Updated {timeAgo}</span>
      <button
        onClick={onRefresh}
        className="inline-flex items-center justify-center rounded-md h-6 w-6 hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Refresh data"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}