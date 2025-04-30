import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefreshIndicatorProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function RefreshIndicator({ lastUpdated, onRefresh, isLoading = false }: RefreshIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else if (seconds < 86400) setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
      else setTimeAgo(`${Math.floor(seconds / 86400)}d ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {isLoading ? 'Updating...' : lastUpdated ? `Updated ${timeAgo}` : 'Never updated'}
      </span>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md h-6 w-6 transition-all",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isLoading && "animate-spin"
        )}
        aria-label={isLoading ? "Refreshing data" : "Refresh data"}
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}