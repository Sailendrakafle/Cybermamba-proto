import React from 'react';
import { Button } from './ui/button';

interface RefreshIndicatorProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function RefreshIndicator({ 
  lastUpdated, 
  onRefresh, 
  isLoading 
}: RefreshIndicatorProps) {
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };
  
  return (
    <div className="flex items-center gap-2 text-sm">
      {lastUpdated && (
        <span className="text-gray-500">
          Updated {formatTimeAgo(lastUpdated)}
        </span>
      )}
      <Button
        onClick={onRefresh}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${isLoading ? 'animate-spin' : ''}`}
        >
          <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h3" />
          <path d="M18 3v6h-6" />
        </svg>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
}