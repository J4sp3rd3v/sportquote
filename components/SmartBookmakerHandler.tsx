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
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [useRedirect, setUseRedirect] = useState(false);
  const [bookmakerInfo, setBookmakerInfo] = useState<any>(null);

  // Lista di bookmaker che tipicamente bloccano iframe
  const iframeBlockedBookmakers = [
    'bet365',
    'betfair',
    'william hill',
    'ladbrokes',
    'coral',
    'paddy power',
    'pokerstars',
    'bwin'
  ];

  useEffect(() => {
    // Ottieni informazioni sul bookmaker
    const info = getBookmakerInfo(bookmakerName);
    setBookmakerInfo(info);
    
    console.log(`SmartBookmakerHandler - Bookmaker: ${bookmakerName}`, {
      isSupported: info.isSupported,
      hasDirectLink: info.hasDirectLink,
      baseUrl: info.baseUrl,
      normalizedName: info.normalizedName
    });

    const isIframeBlocked = iframeBlockedBookmakers.some(blocked => 
      bookmakerName.toLowerCase().includes(blocked.toLowerCase())
    );

    // Determina il metodo migliore basato sulle preferenze e le caratteristiche del bookmaker
    if (preferredMethod === 'iframe' && !isIframeBlocked && info.isSupported) {
      setUseRedirect(false);
    } else if (preferredMethod === 'redirect' || isIframeBlocked || !info.isSupported) {
      setUseRedirect(true);
    } else {
      // Auto: prova iframe per bookmaker compatibili e supportati, altrimenti redirect
      setUseRedirect(isIframeBlocked || !info.isSupported);
    }
  }, [bookmakerName, preferredMethod]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!bookmakerInfo) {
      console.error('Informazioni bookmaker non disponibili');
      return;
    }

    console.log(`Click su ${bookmakerName} - Metodo: ${useRedirect ? 'redirect' : 'iframe'}`);

    if (useRedirect) {
      // Non fare nulla qui, lascia che BookmakerLinkHandler gestisca
      return;
    }

    // Prova prima con iframe
    setIframeUrl(bookmakerInfo.baseUrl);
    setShowIframe(true);
  };

  const handleIframeClose = () => {
    setShowIframe(false);
    setIframeUrl('');
  };

  const handleIframeError = () => {
    console.warn(`Iframe fallito per ${bookmakerName}, passando a redirect`);
    // Se iframe fallisce, passa al redirect
    setShowIframe(false);
    setUseRedirect(true);
  };

  // Se il bookmaker non è supportato, mostra un avviso
  if (bookmakerInfo && !bookmakerInfo.isSupported) {
    return (
      <div 
        className={`cursor-pointer ${className}`}
        onClick={(e) => {
          e.preventDefault();
          alert(`${bookmakerName} non è ancora supportato. Stiamo lavorando per aggiungerlo presto!`);
        }}
        title={`${bookmakerName} - Non ancora supportato`}
      >
        {children}
      </div>
    );
  }

  if (useRedirect) {
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

  return (
    <>
      <div 
        onClick={handleClick}
        className={`cursor-pointer ${className}`}
        title={`Apri ${bookmakerName}${matchInfo ? ` per ${matchInfo.homeTeam} vs ${matchInfo.awayTeam}` : ''}`}
      >
        {children}
      </div>

      {/* Iframe Modal */}
      {showIframe && (
        <BookmakerFrame
          url={iframeUrl}
          bookmakerName={bookmakerName}
          matchInfo={matchInfo}
          isOpen={showIframe}
          onClose={handleIframeClose}
        />
      )}
    </>
  );
} 