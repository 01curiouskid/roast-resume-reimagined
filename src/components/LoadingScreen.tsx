
import React, { useEffect, useState } from 'react';
import { getRandomLoadingMessage } from '@/utils/roast-utils';

interface LoadingScreenProps {
  isExtraSpicy: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isExtraSpicy }) => {
  const [loadingMessage, setLoadingMessage] = useState('');

  // Change the loading message every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingMessage(getRandomLoadingMessage());
    }, 2000);

    // Initialize with a random message
    setLoadingMessage(getRandomLoadingMessage());

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-roast-primary border-t-transparent rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          {isExtraSpicy ? '🔥' : '😈'}
        </div>
      </div>
      
      <p className="text-xl font-bold mb-2 animate-pulse-glow">
        {loadingMessage}
      </p>
      
      <p className="text-sm text-muted-foreground">
        {isExtraSpicy 
          ? "Cranking up the temperature... 🌶️🔥" 
          : "Preparing your roast... 🍗"}
      </p>
    </div>
  );
};

export default LoadingScreen;
