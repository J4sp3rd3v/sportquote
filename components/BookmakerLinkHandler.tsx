'use client';

import React from 'react';

interface BookmakerLinkHandlerProps {
  bookmakerName: string;
  bookmakerUrl: string;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    sport: string;
  };
  children: React.ReactNode;
  className?: string;
}

export default function BookmakerLinkHandler({ 
  bookmakerName, 
  bookmakerUrl, 
  matchInfo, 
  children, 
  className = '' 
}: BookmakerLinkHandlerProps) {

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`Apertura diretta ${bookmakerName}:`, bookmakerUrl);

    // Apertura diretta in nuova scheda senza popup
    window.open(bookmakerUrl, '_blank', 'noopener,noreferrer');
  };



  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
      title={`Apri ${bookmakerName}${matchInfo ? ` per ${matchInfo.homeTeam} vs ${matchInfo.awayTeam}` : ''}`}
    >
      {children}
    </div>
  );
} 