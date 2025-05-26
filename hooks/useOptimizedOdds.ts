import { useState, useEffect, useCallback } from 'react';
import { optimizedOddsApi } from '@/lib/optimizedOddsApi';
import { OddsApiService } from '@/lib/oddsApi';
import { fallbackDataService } from '@/lib/fallbackDataService';
import { emergencyApiManager } from '@/lib/emergencyApiManager';
import { Match } from '@/types';

interface UseOptimizedOddsReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  useRealData: boolean;
  apiStats: any;
  lastUpdate: Date | null;
  categoryStats: any;
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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [categoryStats, setCategoryStats] = useState<any>(null);

  // Usa sempre API reale (non più supporto per dati mock)
  useEffect(() => {
    setUseRealData(true);
  }, []);

  // Carica dati di fallback statici
  const loadFallbackData = useCallback(async () => {
    try {
      console.log('🔄 Caricamento dati di fallback per modalità emergenza');
      const fallbackMatches = fallbackDataService.getFallbackMatches();
      console.log(`✅ Caricati ${fallbackMatches.length} match di fallback`);
      return fallbackMatches;
    } catch (error) {
      console.error('Errore nel caricamento dati di fallback:', error);
      return [];
    }
  }, []);

  // Carica dati dall'API ottimizzata
  const loadRealData = useCallback(async () => {
    try {
      setError(null);
      
      // Controlla sistema di emergenza prima di fare richieste
      const emergencyState = emergencyApiManager.getEmergencyStatus();
      if (emergencyState.isEmergencyMode && !emergencyApiManager.canMakeApiRequest()) {
        console.warn('🚨 Sistema in modalità emergenza - usando dati di fallback');
        setError('Sistema in modalità emergenza - preservando richieste API');
        return await loadFallbackData();
      }
      
      // Ottieni statistiche API con controllo di sicurezza
      let stats = null;
      try {
        stats = await optimizedOddsApi.getApiStatus();
        setApiStats(stats);
      } catch (statsError) {
        console.warn('Errore nel recupero statistiche API:', statsError);
        // Continua comunque con il caricamento dati
      }
      
      if (stats && typeof stats === 'object' && 'isActive' in stats && !stats.isActive) {
        throw new Error('API non disponibile');
      }

      // Ottieni eventi da API ottimizzata
      const apiEvents = await optimizedOddsApi.getMultipleSportsOptimized();
      
      if (!apiEvents || apiEvents.length === 0) {
        throw new Error('Nessun dato disponibile dall\'API');
      }

      // Converti nel formato dell'app con controllo di sicurezza
      const oddsService = new OddsApiService();
      const convertedMatches = oddsService.convertToAppFormat(apiEvents);
      
      console.log(`✅ Caricati ${convertedMatches.length} match dall'API ottimizzata`);
      return convertedMatches;
      
    } catch (error) {
      console.error('Errore API ottimizzata:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto API';
      
      // Se è un errore di emergenza, usa dati di fallback
      if (errorMessage.includes('EMERGENCY_MODE')) {
        console.warn('🚨 Modalità emergenza attivata - usando dati di fallback');
        setError('Modalità emergenza: preservando richieste API rimanenti');
        return await loadFallbackData();
      }
      
      setError(errorMessage);
      
      // Fallback automatico ai dati di fallback
      console.log('🔄 Fallback automatico ai dati di fallback');
      return await loadFallbackData();
    }
  }, [loadFallbackData]);

  // Carica dati dall'API reale
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await loadRealData();
      setMatches(data);
      setLastUpdate(new Date());
      
      // Calcola statistiche per categoria se ci sono dati
      if (data.length > 0) {
        const stats = {
          calcio: { count: data.filter(m => m.sport === 'calcio').length, leagues: [] },
          tennis: { count: data.filter(m => m.sport === 'tennis').length, leagues: [] },
          basket: { count: data.filter(m => m.sport === 'basket').length, leagues: [] },
          altro: { count: data.filter(m => !['calcio', 'tennis', 'basket'].includes(m.sport)).length, leagues: [] }
        };
        setCategoryStats(stats);
      }
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
      setError('Errore nel caricamento dei dati');
      
      // Fallback finale ai dati di fallback
      try {
        const fallbackData = await loadFallbackData();
        setMatches(fallbackData);
      } catch (fallbackError) {
        console.error('Errore anche nel caricamento fallback:', fallbackError);
        setMatches([]);
      }
    } finally {
      setLoading(false);
    }
  }, [loadRealData, loadFallbackData]);

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

  // Toggle disabilitato - ora usiamo sempre API reale
  const toggleDataSource = useCallback(() => {
    console.log('Toggle disabilitato - usiamo sempre API reale');
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
    lastUpdate,
    categoryStats,
    toggleDataSource,
    forceRefresh,
    refreshSport
  };
} 