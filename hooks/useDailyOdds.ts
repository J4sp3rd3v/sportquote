'use client';

import { useState, useEffect, useCallback } from 'react';
import { realOddsService } from '@/lib/realOddsService';
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
    requestsUsed: number;
    requestsRemaining: number;
    updatedToday: boolean;
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const [stats, setStats] = useState({
    matchesCount: 0,
    updateCount: 0,
    hoursUntilNext: 0,
    minutesUntilNext: 0,
    errors: [] as string[],
    requestsUsed: 0,
    requestsRemaining: 0,
    updatedToday: false
  });

  // Carica partite dal servizio
  const loadMatches = useCallback(async (forceUpdate: boolean = false) => {
    if (isUpdating && !forceUpdate) return;
    
    setIsUpdating(true);
    setError(null);
    
    try {
      console.log(`🔄 ${forceUpdate ? 'Aggiornamento forzato' : 'Caricamento partite dal servizio'}...`);
      
      const loadedMatches = await realOddsService.getAllRealMatches(forceUpdate);
      const serviceStats = realOddsService.getServiceStats();
      const lastRealUpdate = realOddsService.getLastRealUpdate();
      
      setMatches(loadedMatches);
      setLastUpdate(lastRealUpdate);
      setNextUpdate(serviceStats.nextUpdateTime);
      setIsDataFresh(loadedMatches.length > 0);
      
      // Calcola ore e minuti fino al prossimo aggiornamento
      const now = new Date();
      const timeDiff = serviceStats.nextUpdateTime.getTime() - now.getTime();
      const hoursUntilNext = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60)));
      const minutesUntilNext = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
      
      setStats({
        matchesCount: loadedMatches.length,
        updateCount: serviceStats.requestsUsed,
        hoursUntilNext,
        minutesUntilNext,
        errors: [],
        requestsUsed: serviceStats.requestsUsed,
        requestsRemaining: serviceStats.requestsRemaining,
        updatedToday: serviceStats.updatedToday
      });
      
      if (loadedMatches.length > 0) {
        console.log(`✅ ${loadedMatches.length} partite caricate con successo`);
      } else {
        console.log('📅 Nessuna partita disponibile (aggiornamento non necessario)');
      }
      
    } catch (err) {
      console.error('❌ Errore caricamento partite:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      
      // Aggiorna comunque le statistiche del servizio
      const serviceStats = realOddsService.getServiceStats();
      setStats(prev => ({
        ...prev,
        errors: [errorMessage],
        requestsUsed: serviceStats.requestsUsed,
        requestsRemaining: serviceStats.requestsRemaining,
        updatedToday: serviceStats.updatedToday
      }));
      
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating]);

  // Forza aggiornamento manuale
  const forceUpdate = useCallback(async (): Promise<boolean> => {
    if (isUpdating) {
      console.log('⚠️ Aggiornamento già in corso');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      await loadMatches(true);
      return true;
      
    } catch (err) {
      console.error('❌ Errore aggiornamento forzato:', err);
      return false;
      
    } finally {
      setIsLoading(false);
    }
  }, [loadMatches, isUpdating]);

  // Inizializzazione e aggiornamenti periodici
  useEffect(() => {
    // Evita caricamenti multipli
    if (hasInitialized) return;
    
    // PRIMA: Carica sempre dalla cache per mostrare dati immediatamente
    const cachedMatches = realOddsService.getCachedMatchesOnly();
    if (cachedMatches.length > 0) {
      setMatches(cachedMatches);
      setIsDataFresh(true);
      const lastRealUpdate = realOddsService.getLastRealUpdate();
      setLastUpdate(lastRealUpdate);
      
      // Aggiorna anche le statistiche
      const serviceStats = realOddsService.getServiceStats();
      setNextUpdate(serviceStats.nextUpdateTime);
      
      const now = new Date();
      const timeDiff = serviceStats.nextUpdateTime.getTime() - now.getTime();
      const hoursUntilNext = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60)));
      const minutesUntilNext = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
      
      setStats({
        matchesCount: cachedMatches.length,
        updateCount: serviceStats.requestsUsed,
        hoursUntilNext,
        minutesUntilNext,
        errors: [],
        requestsUsed: serviceStats.requestsUsed,
        requestsRemaining: serviceStats.requestsRemaining,
        updatedToday: serviceStats.updatedToday
      });
      
      console.log(`✅ ${cachedMatches.length} partite caricate dalla cache all'avvio`);
    }
    
    // DOPO: Controlla se serve aggiornamento (solo se necessario)
    loadMatches(false).finally(() => {
      setHasInitialized(true);
    });
    
  }, [loadMatches, hasInitialized]);

  // Aggiornamenti periodici separati dall'inizializzazione
  useEffect(() => {
    if (!hasInitialized) return;
    
    // Aggiorna statistiche ogni minuto per countdown
    const interval = setInterval(() => {
      const serviceStats = realOddsService.getServiceStats();
      const now = new Date();
      const timeDiff = serviceStats.nextUpdateTime.getTime() - now.getTime();
      const hoursUntilNext = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60)));
      const minutesUntilNext = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
      
      setStats(prev => ({
        ...prev,
        hoursUntilNext,
        minutesUntilNext,
        requestsUsed: serviceStats.requestsUsed,
        requestsRemaining: serviceStats.requestsRemaining,
        updatedToday: serviceStats.updatedToday
      }));
      
      setNextUpdate(serviceStats.nextUpdateTime);
      
      // Se è ora di aggiornare e non è già in corso, avvia aggiornamento automatico
      if (serviceStats.shouldUpdateNow && !isUpdating) {
        console.log('⏰ Ora di aggiornamento giornaliero automatico');
        loadMatches(false);
      }
    }, 60000);
    
    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [hasInitialized, loadMatches, isUpdating]);

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