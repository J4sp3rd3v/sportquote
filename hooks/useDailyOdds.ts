'use client';

import { useState, useEffect, useCallback } from 'react';
import { dailyOddsScheduler } from '@/lib/dailyOddsScheduler';
import { Match } from '@/types';

interface UseDailyOddsReturn {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  nextUpdate: Date | null;
  isDataFresh: boolean;
  isUpdating: boolean;
  stats: {
    matchesCount: number;
    updateCount: number;
    hoursUntilNext: number;
    minutesUntilNext: number;
    errors: string[];
  };
  forceUpdate: () => Promise<boolean>;
  hasRealData: boolean;
}

export function useDailyOdds(): UseDailyOddsReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [isDataFresh, setIsDataFresh] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState({
    matchesCount: 0,
    updateCount: 0,
    hoursUntilNext: 0,
    minutesUntilNext: 0,
    errors: [] as string[]
  });

  // Aggiorna stato dal scheduler
  const updateState = useCallback(() => {
    try {
      const schedulerStats = dailyOddsScheduler.getStats();
      const currentMatches = dailyOddsScheduler.getMatches();
      
      setMatches(currentMatches);
      setLastUpdate(schedulerStats.lastUpdate);
      setNextUpdate(schedulerStats.nextUpdate);
      setIsDataFresh(schedulerStats.isDataFresh);
      setIsUpdating(schedulerStats.isUpdating);
      setStats({
        matchesCount: schedulerStats.matchesCount,
        updateCount: schedulerStats.updateCount,
        hoursUntilNext: schedulerStats.hoursUntilNext,
        minutesUntilNext: schedulerStats.minutesUntilNext,
        errors: schedulerStats.errors
      });
      
      // Reset errore se ci sono dati freschi
      if (schedulerStats.isDataFresh && currentMatches.length > 0) {
        setError(null);
      } else if (currentMatches.length === 0 && !schedulerStats.isUpdating) {
        setError('Nessuna partita disponibile. Prossimo aggiornamento alle 12:00');
      }
      
    } catch (err) {
      console.error('❌ Errore aggiornamento stato:', err);
      setError('Errore sistema aggiornamento giornaliero');
    }
  }, []);

  // Forza aggiornamento manuale
  const forceUpdate = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await dailyOddsScheduler.forceUpdate();
      
      if (success) {
        // Aggiorna stato dopo l'aggiornamento
        setTimeout(updateState, 1000);
      } else {
        setError('Aggiornamento già in corso');
      }
      
      return success;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore aggiornamento';
      setError(errorMessage);
      return false;
      
    } finally {
      setIsLoading(false);
    }
  }, [updateState]);

  // Inizializzazione e aggiornamenti periodici
  useEffect(() => {
    // Carica stato iniziale
    updateState();
    
    // Aggiorna stato ogni minuto per tenere sincronizzato il countdown
    const interval = setInterval(updateState, 60000);
    
    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [updateState]);

  // Verifica se ci sono dati reali
  const hasRealData = matches.length > 0 && isDataFresh;

  return {
    matches,
    isLoading,
    error,
    lastUpdate,
    nextUpdate,
    isDataFresh,
    isUpdating,
    stats,
    forceUpdate,
    hasRealData
  };
} 