import { useState, useEffect, useCallback } from 'react';
import { optimizedOddsApi } from '@/lib/optimizedOddsApi';
import { OddsApiService } from '@/lib/oddsApi';
import { Match } from '@/types';

interface UseOptimizedOddsReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  useRealData: boolean;
  apiStats: any;
  toggleDataSource: () => void;
  forceRefresh: () => void;
  refreshSport: (sport: string) => void;
}

export function useOptimizedOdds(): UseOptimizedOddsReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Determina se usare API reale in base all'ambiente
  useEffect(() => {
    const shouldUseRealData = () => {
      // In produzione, usa API reale di default
      if (process.env.NODE_ENV === 'production') {
        const urlParams = new URLSearchParams(window.location.search);
        return !urlParams.has('usemock'); // Usa API reale a meno che non sia specificato usemock
      }
      
      // In development, usa mock di default
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has('useapi'); // Usa API reale solo se specificato useapi
    };

    setUseRealData(shouldUseRealData());
  }, []);

  // Carica dati mock come fallback
  const loadMockData = useCallback(async () => {
    try {
      const { matches: mockMatches } = await import('@/data/mockData');
      return mockMatches;
    } catch (error) {
      console.error('Errore nel caricamento dati mock:', error);
      return [];
    }
  }, []);

  // Carica dati dall'API ottimizzata
  const loadRealData = useCallback(async () => {
    try {
      setError(null);
      
      // Ottieni statistiche API
      const stats = await optimizedOddsApi.getApiStatus();
      setApiStats(stats);
      
             if (!stats?.isActive) {
         throw new Error('API non disponibile');
       }

      // Ottieni eventi da API ottimizzata
      const apiEvents = await optimizedOddsApi.getMultipleSportsOptimized();
      
      if (apiEvents.length === 0) {
        throw new Error('Nessun dato disponibile dall\'API');
      }

      // Converti nel formato dell'app
      const oddsService = new OddsApiService();
      const convertedMatches = oddsService.convertToAppFormat(apiEvents);
      
      console.log(`✅ Caricati ${convertedMatches.length} match dall'API ottimizzata`);
      return convertedMatches;
      
    } catch (error) {
      console.error('Errore API ottimizzata:', error);
      setError((error as Error).message);
      
      // Fallback automatico ai dati mock
      console.log('🔄 Fallback automatico ai dati simulati');
      return await loadMockData();
    }
  }, [loadMockData]);

  // Carica dati in base alla modalità selezionata
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = useRealData ? await loadRealData() : await loadMockData();
      setMatches(data);
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
      setError('Errore nel caricamento dei dati');
      
      // Fallback finale ai dati mock
      try {
        const mockData = await loadMockData();
        setMatches(mockData);
      } catch (mockError) {
        console.error('Errore anche nel caricamento mock:', mockError);
        setMatches([]);
      }
    } finally {
      setLoading(false);
    }
  }, [useRealData, loadRealData, loadMockData]);

  // Caricamento iniziale
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Aggiornamento periodico per API reale (ogni 15 minuti)
  useEffect(() => {
    if (!useRealData) return;

    const interval = setInterval(() => {
      console.log('🔄 Aggiornamento periodico programmato');
      loadData();
    }, 15 * 60 * 1000); // 15 minuti

    return () => clearInterval(interval);
  }, [useRealData, loadData]);

  // Aggiorna statistiche API periodicamente
  useEffect(() => {
    if (!useRealData) return;

    const updateStats = async () => {
      try {
        const stats = await optimizedOddsApi.getApiStatus();
        setApiStats(stats);
      } catch (error) {
        console.error('Errore aggiornamento statistiche:', error);
      }
    };

    // Aggiorna statistiche ogni 5 minuti
    const interval = setInterval(updateStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [useRealData]);

  // Toggle tra dati reali e mock
  const toggleDataSource = useCallback(() => {
    setUseRealData(prev => {
      const newValue = !prev;
      console.log(`🔄 Cambio sorgente dati: ${newValue ? 'API Reale' : 'Dati Simulati'}`);
      return newValue;
    });
  }, []);

  // Forza aggiornamento completo
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Aggiornamento forzato richiesto');
    
    if (useRealData) {
      // Pulisci cache per forzare nuove richieste
      optimizedOddsApi.cleanExpiredCache();
    }
    
    await loadData();
  }, [useRealData, loadData]);

  // Aggiorna sport specifico (solo per API reale)
  const refreshSport = useCallback(async (sport: string) => {
    if (!useRealData) {
      console.log('Aggiornamento sport disponibile solo con API reale');
      return;
    }

    try {
      setLoading(true);
      console.log(`🔄 Aggiornamento forzato per sport: ${sport}`);
      
      const events = await optimizedOddsApi.forceUpdateSport(sport);
      
      if (events.length > 0) {
        // Converti e aggiorna solo le partite di questo sport
        const oddsService = new OddsApiService();
        const convertedMatches = oddsService.convertToAppFormat(events);
        
        setMatches(prevMatches => {
          // Rimuovi le partite esistenti di questo sport e aggiungi quelle nuove
          const filteredMatches = prevMatches.filter(match => match.sport !== sport);
          return [...filteredMatches, ...convertedMatches];
        });
        
        console.log(`✅ Aggiornate ${convertedMatches.length} partite per ${sport}`);
      }
    } catch (error) {
      console.error(`Errore aggiornamento sport ${sport}:`, error);
      setError(`Errore aggiornamento ${sport}: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [useRealData]);

  return {
    matches,
    loading,
    error,
    useRealData,
    apiStats,
    toggleDataSource,
    forceRefresh,
    refreshSport
  };
} 