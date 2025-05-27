'use client';

import { useState, useEffect, useCallback } from 'react';
import { realOddsService } from '@/lib/realOddsService';
import { Match } from '@/types';

interface UseOnlyRealOddsReturn {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  stats: {
    requestsUsed: number;
    requestsRemaining: number;
    monthlyLimit: number;
    cacheSize: number;
    canMakeRequests: boolean;
  };
  refreshOdds: () => Promise<void>;
  hasRealData: boolean;
}

export function useOnlyRealOdds(): UseOnlyRealOddsReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [hasRealData, setHasRealData] = useState(false);

  const refreshOdds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasRealData(false);

    try {
      console.log('🔄 Caricamento SOLO dati reali...');
      
      const realMatches = await realOddsService.getAllRealMatches();
      
      if (realMatches.length === 0) {
        throw new Error('NESSUNA_PARTITA_REALE_DISPONIBILE');
      }

      setMatches(realMatches);
      
      // Usa il timestamp dell'ultimo aggiornamento reale, non quello attuale
      const realUpdateTime = realOddsService.getLastRealUpdate();
      setLastUpdate(realUpdateTime || new Date());
      setHasRealData(true);
      
      console.log(`✅ ${realMatches.length} partite reali caricate con successo`);
      if (realUpdateTime) {
        console.log(`📅 Ultimo aggiornamento reale: ${realUpdateTime.toLocaleString('it-IT')}`);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      
      console.error('❌ ERRORE CARICAMENTO DATI REALI:', errorMessage);
      
      // Messaggi di errore specifici
      if (errorMessage.includes('LIMITE_MENSILE_RAGGIUNTO')) {
        setError('🚫 Limite mensile API raggiunto. Riprova il prossimo mese.');
      } else if (errorMessage.includes('API_KEY_INVALIDA')) {
        setError('🔑 Chiave API non valida. Contatta l\'amministratore.');
      } else if (errorMessage.includes('LIMITE_RICHIESTE_SUPERATO')) {
        setError('⏰ Limite richieste superato. Riprova tra qualche minuto.');
      } else if (errorMessage.includes('NESSUNA_PARTITA_REALE')) {
        setError('📅 Nessuna partita reale disponibile al momento.');
      } else if (errorMessage.includes('NESSUNO_SPORT_DISPONIBILE')) {
        setError('🏆 Nessun campionato attivo con partite disponibili.');
      } else {
        setError(`❌ Errore caricamento dati reali: ${errorMessage}`);
      }
      
      // NON caricare dati falsi - lascia array vuoto
      setMatches([]);
      setHasRealData(false);
      
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carica dati al mount
  useEffect(() => {
    refreshOdds();
  }, [refreshOdds]);

  // Ottieni statistiche del servizio
  const stats = realOddsService.getServiceStats();

  return {
    matches,
    isLoading,
    error,
    lastUpdate,
    stats,
    refreshOdds,
    hasRealData
  };
} 