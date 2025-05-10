import React from 'react';
import { Button } from '../ui/button';

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
    <div>
      <Button 
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </Button>
      {lastUpdated && (
        <span>
          Last updated: {formatTimeAgo(lastUpdated)}
        </span>
      )}
    </div>
  );
}
