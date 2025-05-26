'use client';

import React, { useState, useEffect } from 'react';
import BookmakerFrame from './BookmakerFrame';
import BookmakerLinkHandler from './BookmakerLinkHandler';
import { getBookmakerInfo, isBookmakerSupported } from '@/lib/bookmakerLinks';

interface SmartBookmakerHandlerProps {
  bookmakerName: string;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    sport: string;
  };
  children: React.ReactNode;
  className?: string;
  preferredMethod?: 'iframe' | 'redirect' | 'auto';
}

export default function SmartBookmakerHandler({ 
  bookmakerName, 
  matchInfo, 
  children, 
  className = '',
  preferredMethod = 'auto'
}: SmartBookmakerHandlerProps) {
  const [bookmakerInfo, setBookmakerInfo] = useState<any>(null);

  useEffect(() => {
    // Ottieni informazioni sul bookmaker
    const info = getBookmakerInfo(bookmakerName);
    setBookmakerInfo(info);
    
    console.log(`SmartBookmakerHandler - Bookmaker: "${bookmakerName}"`, {
      isSupported: info.isSupported,
      hasDirectLink: info.hasDirectLink,
      baseUrl: info.baseUrl,
      normalizedName: info.normalizedName,
      originalName: bookmakerName
    });
    
    // Debug aggiuntivo per bookmaker non supportati
    if (!info.isSupported) {
      console.warn(`⚠️ Bookmaker non supportato: "${bookmakerName}"`);
      console.warn('URL generato:', info.baseUrl);
      console.warn('Controlla se il nome è presente in BOOKMAKER_BASE_URLS');
    }
  }, [bookmakerName, preferredMethod]);

  // Se il bookmaker non è supportato, mostra un avviso
  if (bookmakerInfo && !bookmakerInfo.isSupported) {
    console.error(`🚨 SmartBookmakerHandler: Bookmaker "${bookmakerName}" non supportato!`);
    console.error('URL fallback generato:', bookmakerInfo.baseUrl);
    
    return (
      <div 
        className={`cursor-pointer opacity-50 ${className}`}
        onClick={(e) => {
          e.preventDefault();
          console.error(`Click su bookmaker non supportato: "${bookmakerName}"`);
          alert(`ERRORE: ${bookmakerName} non è configurato nel sistema. Contatta il supporto.`);
        }}
        title={`${bookmakerName} - Non ancora supportato`}
      >
        {children}
      </div>
    );
  }

  // Usa sempre BookmakerLinkHandler per massima compatibilità
  return (
    <BookmakerLinkHandler
      bookmakerName={bookmakerName}
      bookmakerUrl={bookmakerInfo?.baseUrl || ''}
      matchInfo={matchInfo}
      className={className}
    >
      {children}
    </BookmakerLinkHandler>
  );
} 