'use client';

import { useState, useEffect, useCallback } from 'react';

interface NavigationData {
  bookmakerName: string;
  originalUrl: string;
  timestamp: number;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    sport: string;
  };
}

export function useNavigationOverlay() {
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const checkForNavigation = useCallback(() => {
    try {
      const stored = sessionStorage.getItem('monitorquote_navigation');
      if (stored) {
        const data: NavigationData = JSON.parse(stored);
        
        // Controlla se il timestamp è recente (ultimi 30 minuti per essere più permissivi)
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
        if (data.timestamp > thirtyMinutesAgo) {
          setNavigationData(data);
          setShowOverlay(true);
          
          // Aggiorna il timestamp per mantenere la sessione attiva
          const updatedData = { ...data, timestamp: Date.now() };
          sessionStorage.setItem('monitorquote_navigation', JSON.stringify(updatedData));
          
          console.log('Barra di navigazione attivata per:', data.bookmakerName);
        } else {
          // Rimuovi dati scaduti
          sessionStorage.removeItem('monitorquote_navigation');
          console.log('Dati di navigazione scaduti, rimossi');
        }
      }
    } catch (error) {
      console.error('Errore nel controllo navigazione:', error);
      // In caso di errore, rimuovi i dati corrotti
      sessionStorage.removeItem('monitorquote_navigation');
    }
  }, []);

  useEffect(() => {
    // Controlla immediatamente al mount
    checkForNavigation();

    // Controlla quando la finestra torna in focus (utente torna dalla scheda del bookmaker)
    const handleFocus = () => {
      checkForNavigation();
    };

    // Controlla anche quando cambia la visibilità della pagina
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNavigation();
      }
    };

    // Controlla periodicamente se l'utente è ancora sulla pagina
    const intervalCheck = setInterval(() => {
      if (showOverlay) {
        checkForNavigation();
      }
    }, 10000); // Ogni 10 secondi

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalCheck);
    };
  }, [checkForNavigation, showOverlay]);

  const closeOverlay = useCallback(() => {
    setShowOverlay(false);
    setNavigationData(null);
    sessionStorage.removeItem('monitorquote_navigation');
    console.log('Barra di navigazione chiusa');
  }, []);

  const updateNavigationData = useCallback((newData: Partial<NavigationData>) => {
    if (navigationData) {
      const updatedData = { ...navigationData, ...newData, timestamp: Date.now() };
      setNavigationData(updatedData);
      sessionStorage.setItem('monitorquote_navigation', JSON.stringify(updatedData));
    }
  }, [navigationData]);

  // Funzione per salvare manualmente i dati di navigazione (utile per i componenti)
  const saveNavigationData = useCallback((data: Omit<NavigationData, 'timestamp'>) => {
    const navigationData: NavigationData = {
      ...data,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem('monitorquote_navigation', JSON.stringify(navigationData));
    console.log('Dati di navigazione salvati per:', data.bookmakerName);
  }, []);

  return {
    navigationData,
    showOverlay,
    closeOverlay,
    updateNavigationData,
    saveNavigationData,
    checkForNavigation
  };
} 