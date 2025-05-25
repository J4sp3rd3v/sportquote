'use client';

import React, { useState, useEffect } from 'react';
import BookmakerFrame from './BookmakerFrame';
import BookmakerLinkHandler from './BookmakerLinkHandler';
import { getBookmakerInfo } from '@/lib/bookmakerLinks';

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

  // Lista di bookmaker che tipicamente bloccano iframe
  const iframeBlockedBookmakers = [
    'bet365',
    'betfair',
    'william hill',
    'ladbrokes',
    'coral',
    'paddy power'
  ];

  const bookmakerInfo = getBookmakerInfo(bookmakerName);
  const bookmakerUrl = bookmakerInfo.baseUrl;

  const isIframeBlocked = iframeBlockedBookmakers.some(blocked => 
    bookmakerName.toLowerCase().includes(blocked.toLowerCase())
  );

  useEffect(() => {
    // Determina il metodo migliore basato sulle preferenze e le caratteristiche del bookmaker
    if (preferredMethod === 'iframe' && !isIframeBlocked) {
      setUseRedirect(false);
    } else if (preferredMethod === 'redirect' || isIframeBlocked) {
      setUseRedirect(true);
    } else {
      // Auto: prova iframe per bookmaker compatibili, altrimenti redirect
      setUseRedirect(isIframeBlocked);
    }
  }, [preferredMethod, isIframeBlocked]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (useRedirect) {
      // Non fare nulla qui, lascia che BookmakerLinkHandler gestisca
      return;
    }

    // Prova prima con iframe
    setIframeUrl(bookmakerUrl);
    setShowIframe(true);
  };

  const handleIframeClose = () => {
    setShowIframe(false);
    setIframeUrl('');
  };

  const handleIframeError = () => {
    // Se iframe fallisce, passa al redirect
    setShowIframe(false);
    setUseRedirect(true);
  };

  if (useRedirect) {
    return (
      <BookmakerLinkHandler
        bookmakerName={bookmakerName}
        bookmakerUrl={bookmakerUrl}
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