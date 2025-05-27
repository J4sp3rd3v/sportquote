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

  // Aggiorna statistiche
  const updateStats = useCallback(() => {
    const serviceStats = realOddsService.getServiceStats();
    const now = new Date();
    const timeDiff = serviceStats.nextUpdateTime.getTime() - now.getTime();
    const hoursUntilNext = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60)));
    const minutesUntilNext = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
    
    setStats({
      matchesCount: matches.length,
      updateCount: serviceStats.requestsUsed,
      hoursUntilNext,
      minutesUntilNext,
      errors: error ? [error] : [],
      requestsUsed: serviceStats.requestsUsed,
      requestsRemaining: serviceStats.requestsRemaining,
      updatedToday: serviceStats.updatedToday
    });
    
    setNextUpdate(serviceStats.nextUpdateTime);
  }, [matches.length, error]);

  // Carica partite dalla cache (sempre disponibile)
  const loadFromCache = useCallback(() => {
    console.log('📦 Caricamento partite dalla cache...');
    
    const cachedMatches = realOddsService.getCachedMatchesOnly();
    const lastRealUpdate = realOddsService.getLastRealUpdate();
    
    setMatches(cachedMatches);
    setLastUpdate(lastRealUpdate);
    setIsDataFresh(cachedMatches.length > 0);
    
    console.log(`✅ ${cachedMatches.length} partite caricate dalla cache`);
    
    return cachedMatches.length > 0;
  }, []);

  // Aggiornamento completo (con richieste API)
  const performUpdate = useCallback(async (force: boolean = false) => {
    if (isUpdating && !force) return false;
    
    setIsUpdating(true);
    setError(null);
    
    try {
      console.log(`🔄 ${force ? 'Aggiornamento forzato' : 'Aggiornamento automatico'}...`);
      
      const updatedMatches = await realOddsService.getAllRealMatches(force);
      const lastRealUpdate = realOddsService.getLastRealUpdate();
      
      setMatches(updatedMatches);
      setLastUpdate(lastRealUpdate);
      setIsDataFresh(updatedMatches.length > 0);
      
      console.log(`✅ ${updatedMatches.length} partite aggiornate`);
      
      return true;
      
    } catch (err) {
      console.error('❌ Errore aggiornamento:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      
      // In caso di errore, mantieni i dati dalla cache
      loadFromCache();
      
      return false;
      
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, loadFromCache]);

  // Forza aggiornamento manuale
  const forceUpdate = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      return await performUpdate(true);
    } finally {
      setIsLoading(false);
    }
  }, [performUpdate]);

  // Inizializzazione: SEMPRE carica dalla cache prima
  useEffect(() => {
    console.log('🚀 Inizializzazione useDailyOdds...');
    
    // STEP 1: Carica immediatamente dalla cache (se disponibile)
    const hasCachedData = loadFromCache();
    
    // STEP 2: Controlla se serve aggiornamento (in background)
    const serviceStats = realOddsService.getServiceStats();
    if (serviceStats.shouldUpdateNow) {
      console.log('⏰ Aggiornamento automatico necessario');
      performUpdate(false);
    } else if (!hasCachedData) {
      console.log('📦 Nessuna cache disponibile, forzo aggiornamento');
      performUpdate(true);
    } else {
      console.log('✅ Cache disponibile, aggiornamento non necessario');
    }
    
  }, []); // Solo all'inizializzazione

  // Aggiornamento statistiche periodico
  useEffect(() => {
    updateStats();
    
    const interval = setInterval(() => {
      updateStats();
      
      // Controlla se è ora di aggiornare automaticamente
      const serviceStats = realOddsService.getServiceStats();
      if (serviceStats.shouldUpdateNow && !isUpdating) {
        console.log('⏰ Ora di aggiornamento automatico');
        performUpdate(false);
      }
    }, 60000); // Ogni minuto
    
    return () => clearInterval(interval);
  }, [updateStats, performUpdate, isUpdating]);

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