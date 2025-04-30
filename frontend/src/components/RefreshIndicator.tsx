import { useState, useEffect } from 'react';
import { BiRefresh } from 'react-icons/bi';

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
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>Updated {timeAgo}</span>
      <button
        onClick={onRefresh}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Refresh data"
      >
        <BiRefresh className="w-5 h-5" />
      </button>
    </div>
  );
}