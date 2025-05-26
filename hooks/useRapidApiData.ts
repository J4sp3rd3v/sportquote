'use client';

import { useState, useEffect } from 'react';
import { rapidApiFootball } from '@/lib/rapidApiFootball';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  date: Date;
  status: 'upcoming' | 'live' | 'finished';
  odds: Array<{
    home: number;
    away: number;
    draw?: number;
    bookmaker: string;
    lastUpdated: Date;
  }>;
  bestOdds: {
    home: { odds: number; bookmaker: string };
    away: { odds: number; bookmaker: string };
    draw?: { odds: number; bookmaker: string };
  };
  venue?: string;
  round?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  leagueName?: string;
  leagueLogo?: string;
}

export interface UseRapidApiDataReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  apiStats: {
    used: number;
    total: number;
    percentage: number;
  };
  refreshData: () => Promise<void>;
  testConnection: () => Promise<boolean>;
}

export function useRapidApiData(): UseRapidApiDataReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Statistiche API
  const getApiStats = () => ({
    used: rapidApiFootball.getRequestCount(),
    total: rapidApiFootball.getMaxRequests(),
    percentage: rapidApiFootball.getUsagePercentage()
  });

  // Test connessione API
  const testConnection = async (): Promise<boolean> => {
    try {
      const status = await rapidApiFootball.checkApiStatus();
      return status.status === 'active';
    } catch (error) {
      console.error('Errore test connessione:', error);
      return false;
    }
  };

  // Carica dati da RapidAPI
  const loadRapidApiData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Caricamento dati da RapidAPI...');
      
      // Ottieni dati per tutti i campionati principali
      const allMatches = await rapidApiFootball.getAllMainLeaguesOdds();
      
      if (allMatches.length === 0) {
        throw new Error('Nessuna partita trovata');
      }

      setMatches(allMatches);
      console.log(`✅ Caricate ${allMatches.length} partite da RapidAPI`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      console.error('❌ Errore caricamento RapidAPI:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh manuale dei dati
  const refreshData = async () => {
    await loadRapidApiData();
  };

  // Carica dati all'avvio (solo se non ci sono già dati)
  useEffect(() => {
    if (matches.length === 0) {
      loadRapidApiData();
    }
  }, []);

  return {
    matches,
    loading,
    error,
    apiStats: getApiStats(),
    refreshData,
    testConnection
  };
}

// Hook semplificato per ottenere solo le statistiche API
export function useRapidApiStats() {
  const [stats, setStats] = useState({
    used: 0,
    total: 500,
    percentage: 0
  });

  useEffect(() => {
    const updateStats = () => {
      setStats({
        used: rapidApiFootball.getRequestCount(),
        total: rapidApiFootball.getMaxRequests(),
        percentage: rapidApiFootball.getUsagePercentage()
      });
    };

    // Aggiorna subito
    updateStats();

    // Aggiorna ogni 30 secondi
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return stats;
} 