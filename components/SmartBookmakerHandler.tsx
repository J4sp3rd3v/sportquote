'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { optimizedBookmakerManager } from '@/lib/optimizedBookmakerManager';

interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  sport: string;
  league?: string;
}

interface SmartBookmakerHandlerProps {
  bookmakerName: string;
  matchInfo: MatchInfo;
  onBookmakerOpen?: (url: string, bookmakerName: string, matchInfo: MatchInfo) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function SmartBookmakerHandler({
  bookmakerName,
  matchInfo,
  onBookmakerOpen,
  className = '',
  children
}: SmartBookmakerHandlerProps) {
  
  const handleClick = () => {
    const info = optimizedBookmakerManager.getBookmakerInfo(bookmakerName);
    
    if (info.isSupported && info.config) {
      // Chiama il callback se fornito
      if (onBookmakerOpen) {
        onBookmakerOpen(info.config.baseUrl, info.config.displayName, matchInfo);
      }
      
      // Apri il bookmaker
      optimizedBookmakerManager.openBookmaker(bookmakerName, matchInfo);
    } else {
      console.warn(`Bookmaker ${bookmakerName} non supportato`);
      
      // Fallback: cerca su Google
      const searchQuery = `${bookmakerName} scommesse ${matchInfo.homeTeam} ${matchInfo.awayTeam}`;
      const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      
      if (onBookmakerOpen) {
        onBookmakerOpen(fallbackUrl, bookmakerName, matchInfo);
      }
      
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const info = optimizedBookmakerManager.getBookmakerInfo(bookmakerName);
  const isSupported = info.isSupported;
  const isVerified = info.config?.verified || false;

  return (
    <button
      onClick={handleClick}
      className={`${className} ${
        isSupported 
          ? 'hover:opacity-90 transition-opacity' 
          : 'opacity-75 hover:opacity-60'
      }`}
      title={
        isSupported 
          ? `Apri ${info.config?.displayName || bookmakerName}${isVerified ? ' (Verificato)' : ''}`
          : `Cerca ${bookmakerName} su Google`
      }
    >
      {children || (
        <div className="flex items-center">
          <ExternalLink className="w-4 h-4 mr-2" />
          <span>{info.config?.displayName || bookmakerName}</span>
          {isVerified && (
            <span className="ml-1 text-green-500" title="Verificato">✓</span>
          )}
        </div>
      )}
    </button>
  );
} 