'use client';

import { useState, useEffect, useCallback } from 'react';
import { oddsApi, OddsApiEvent } from '@/lib/oddsApi';
import { Match } from '@/types';

interface UseRealOddsReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  apiStatus: {
    status: string;
    remainingRequests: string | null;
    usedRequests: string | null;
  } | null;
  categoryStats: {
    calcio: { count: number; leagues: string[] };
    tennis: { count: number; leagues: string[] };
    basket: { count: number; leagues: string[] };
    altro: { count: number; leagues: string[] };
  } | null;
  refreshData: () => Promise<void>;
  useRealData: boolean;
  toggleDataSource: () => void;
}

export function useRealOdds(): UseRealOddsReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [categoryStats, setCategoryStats] = useState<any>(null);
  
  // Attiva automaticamente l'API reale in produzione
  const [useRealData, setUseRealData] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDev = process.env.NODE_ENV === 'development';
      const forceMock = window.location.search.includes('usemock=true');
      
      // In produzione usa sempre API reale, a meno che non sia forzato mock
      if (process.env.NODE_ENV === 'production') {
        return !forceMock;
      }
      
      // In development usa API reale solo se specificato
      const forceApi = window.location.search.includes('useapi=true');
      return forceApi;
    }
    
    // Default: produzione = API reale, development = mock
    return process.env.NODE_ENV === 'production';
  });

  // Funzione per recuperare i dati dall'API
  const fetchRealOdds = useCallback(async () => {
    if (!useRealData) return;

    setLoading(true);
    setError(null);

    try {
      // Verifica lo stato dell'API
      const status = await oddsApi.checkApiStatus();
      setApiStatus(status);

      if (status.status === 'error') {
        throw new Error('API non disponibile');
      }

      // Recupera le quote per sport multipli
      const apiEvents = await oddsApi.getMultipleSportsOdds();
      
      if (apiEvents.length === 0) {
        throw new Error('Nessun dato disponibile dall\'API');
      }

      // Calcola statistiche per categoria
      const stats = oddsApi.getStatsByCategory(apiEvents);
      setCategoryStats(stats);

      // Converti i dati nel formato dell'app
      const convertedMatches = oddsApi.convertToAppFormat(apiEvents);
      
      setMatches(convertedMatches);
      setLastUpdate(new Date());
      
      console.log(`✅ Caricati ${convertedMatches.length} eventi reali dall'API`);
      console.log('📊 Statistiche per categoria:', stats);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      console.error('❌ Errore nel caricamento delle quote reali:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [useRealData]);

  // Funzione per aggiornare manualmente i dati
  const refreshData = useCallback(async () => {
    await fetchRealOdds();
  }, [fetchRealOdds]);

  // Funzione per alternare tra dati reali e simulati
  const toggleDataSource = useCallback(() => {
    setUseRealData(prev => !prev);
    setError(null);
    setMatches([]);
    setCategoryStats(null);
  }, []);

  // Carica i dati quando useRealData cambia
  useEffect(() => {
    if (useRealData) {
      fetchRealOdds();
    } else {
      // Reset quando si torna ai dati simulati
      setMatches([]);
      setLastUpdate(null);
      setApiStatus(null);
      setError(null);
      setCategoryStats(null);
    }
  }, [useRealData, fetchRealOdds]);

  // Auto-refresh più frequente in produzione per quote sempre aggiornate
  useEffect(() => {
    if (!useRealData) return;

    // In produzione refresh ogni 2 minuti, in development ogni 5 minuti
    const refreshInterval = process.env.NODE_ENV === 'production' ? 2 * 60 * 1000 : 5 * 60 * 1000;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh delle quote...');
      fetchRealOdds();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [useRealData, fetchRealOdds]);

  return {
    matches,
    loading,
    error,
    lastUpdate,
    apiStatus,
    categoryStats,
    refreshData,
    useRealData,
    toggleDataSource
  };
} 