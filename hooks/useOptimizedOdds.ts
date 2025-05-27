import { useState, useEffect, useCallback } from 'react';
import { optimizedOddsService } from '@/lib/optimizedOddsService';
import { unifiedApiManager } from '@/lib/unifiedApiManager';
import { Match } from '@/types';

interface UseOptimizedOddsReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  useRealData: boolean;
  apiStats: any;
  lastUpdate: number | null;
  categoryStats: any;
  toggleDataSource: () => void;
  forceRefresh: () => Promise<void>;
  refreshSport: (sportKey: string) => Promise<void>;
}

export function useOptimizedOdds(): UseOptimizedOddsReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRealData] = useState(true); // Sempre usa dati reali
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  // Carica le quote ottimizzate
  const loadOptimizedOdds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Caricamento quote ottimizzate...');
      
      const categories = await optimizedOddsService.getAllSportsOdds();
      
      // Converti le categorie in formato Match[]
      const allMatches: Match[] = [];
      
      for (const category of categories) {
        for (const optimizedMatch of category.matches) {
                     const match: Match = {
             id: optimizedMatch.id,
             sport: optimizedMatch.sport,
             league: optimizedMatch.league,
             homeTeam: optimizedMatch.homeTeam,
             awayTeam: optimizedMatch.awayTeam,
             date: new Date(optimizedMatch.commenceTime),
             status: 'upcoming' as const,
             odds: optimizedMatch.bookmakers.map(bm => ({
               bookmaker: bm.displayName,
               home: bm.odds.home,
               away: bm.odds.away,
               draw: bm.odds.draw,
               lastUpdated: new Date(bm.lastUpdate)
             }))
           };
          
          allMatches.push(match);
        }
      }
      
      setMatches(allMatches);
      setLastUpdate(Date.now());
      
      console.log(`✅ ${allMatches.length} partite caricate da ${categories.length} categorie`);
      
    } catch (err) {
      console.error('❌ Errore caricamento quote:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      
      // In caso di errore, mantieni le partite esistenti se disponibili
      if (matches.length === 0) {
        setMatches([]);
      }
    } finally {
      setLoading(false);
    }
  }, [matches.length]);

  // Forza aggiornamento
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Aggiornamento forzato...');
    await loadOptimizedOdds();
  }, [loadOptimizedOdds]);

  // Aggiorna sport specifico
  const refreshSport = useCallback(async (sportKey: string) => {
    try {
      console.log(`🔄 Aggiornamento ${sportKey}...`);
      
      const sportMatches = await optimizedOddsService.getSportOdds(sportKey);
      
      // Aggiorna solo le partite di questo sport
      setMatches(prevMatches => {
        const otherMatches = prevMatches.filter(m => {
          // Rimuovi partite del sport che stiamo aggiornando
          const sportMapping = {
            'soccer_italy_serie_a': 'calcio',
            'soccer_epl': 'calcio',
            'soccer_uefa_champs_league': 'calcio',
            'basketball_nba': 'basket',
            'tennis_atp_french_open': 'tennis',
            'americanfootball_nfl': 'football-americano'
          };
          
          const targetSport = sportMapping[sportKey as keyof typeof sportMapping];
          return m.sport !== targetSport;
        });
        
                 // Aggiungi nuove partite
         const newMatches: Match[] = sportMatches.map(optimizedMatch => ({
           id: optimizedMatch.id,
           sport: optimizedMatch.sport,
           league: optimizedMatch.league,
           homeTeam: optimizedMatch.homeTeam,
           awayTeam: optimizedMatch.awayTeam,
           date: new Date(optimizedMatch.commenceTime),
           status: 'upcoming' as const,
           odds: optimizedMatch.bookmakers.map(bm => ({
             bookmaker: bm.displayName,
             home: bm.odds.home,
             away: bm.odds.away,
             draw: bm.odds.draw,
             lastUpdated: new Date(bm.lastUpdate)
           }))
         }));
        
        return [...otherMatches, ...newMatches];
      });
      
      setLastUpdate(Date.now());
      
    } catch (err) {
      console.error(`❌ Errore aggiornamento ${sportKey}:`, err);
      setError(err instanceof Error ? err.message : 'Errore aggiornamento sport');
    }
  }, []);

  // Caricamento iniziale
  useEffect(() => {
    loadOptimizedOdds();
  }, [loadOptimizedOdds]);

  // Ottieni statistiche API
  const apiStats = unifiedApiManager.getDetailedStats();
  
  // Calcola statistiche per categoria
  const categoryStats = {
    calcio: matches.filter(m => m.sport === 'calcio').length,
    basket: matches.filter(m => m.sport === 'basket').length,
    tennis: matches.filter(m => m.sport === 'tennis').length,
    'football-americano': matches.filter(m => m.sport === 'football-americano').length,
    totale: matches.length
  };

  return {
    matches,
    loading,
    error,
    useRealData,
    apiStats,
    lastUpdate,
    categoryStats,
    toggleDataSource: () => {}, // Non più necessario, sempre dati reali
    forceRefresh,
    refreshSport
  };
} 