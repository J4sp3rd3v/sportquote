'use client';

import { useState, useEffect } from 'react';

interface NavigationData {
  bookmakerName: string;
  originalUrl: string;
  timestamp: number;
}

export function useNavigationOverlay() {
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Controlla se siamo stati reindirizzati da SitoSport
    const checkForNavigation = () => {
      try {
        const stored = sessionStorage.getItem('sitosport_navigation');
        if (stored) {
          const data: NavigationData = JSON.parse(stored);
          
          // Controlla se il timestamp è recente (ultimi 5 minuti)
          const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
          if (data.timestamp > fiveMinutesAgo) {
            setNavigationData(data);
            setShowOverlay(true);
          } else {
            // Rimuovi dati scaduti
            sessionStorage.removeItem('sitosport_navigation');
          }
        }
      } catch (error) {
        console.error('Errore nel controllo navigazione:', error);
      }
    };

    // Controlla immediatamente
    checkForNavigation();

    // Controlla anche quando la finestra torna in focus
    const handleFocus = () => {
      checkForNavigation();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const closeOverlay = () => {
    setShowOverlay(false);
    sessionStorage.removeItem('sitosport_navigation');
  };

  return {
    navigationData,
    showOverlay,
    closeOverlay
  };
} 