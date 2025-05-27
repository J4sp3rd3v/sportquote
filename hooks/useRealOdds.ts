'use client';

import { useState, useEffect } from 'react';
import { optimizedOddsService, OptimizedMatch } from '@/lib/optimizedOddsService';
import { Match, Odds } from '@/types';

interface UseRealOddsReturn {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refreshOdds: () => Promise<void>;
}

// Funzione per convertire OptimizedMatch in Match
function convertOptimizedMatchToMatch(optimizedMatch: OptimizedMatch): Match {
  // Converti bookmaker in odds
  const odds: Odds[] = optimizedMatch.bookmakers.map(bookmaker => ({
    home: bookmaker.odds.home,
    away: bookmaker.odds.away,
    draw: bookmaker.odds.draw,
    bookmaker: bookmaker.displayName,
    lastUpdated: new Date(bookmaker.lastUpdate)
  }));

  return {
    id: optimizedMatch.id,
    homeTeam: optimizedMatch.homeTeam,
    awayTeam: optimizedMatch.awayTeam,
    league: optimizedMatch.league,
    sport: optimizedMatch.sport,
    date: new Date(optimizedMatch.commenceTime),
    status: 'upcoming' as const,
    odds
  };
}

export function useRealOdds(sport?: string): UseRealOddsReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const refreshOdds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (sport) {
        // Aggiorna sport specifico
        const result = await optimizedOddsService.updateSportOdds(sport);
        if (result.success && result.matches) {
          const convertedMatches = result.matches.map(convertOptimizedMatchToMatch);
          setMatches(convertedMatches);
          setLastUpdate(new Date());
        } else {
          setError(result.error || 'Errore durante l\'aggiornamento');
        }
      } else {
        // Aggiorna tutti gli sport
        const result = await optimizedOddsService.updateAllSports();
        if (result.success && result.allMatches) {
          const convertedMatches = result.allMatches.map(convertOptimizedMatchToMatch);
          setMatches(convertedMatches);
          setLastUpdate(new Date());
        } else {
          setError(result.error || 'Errore durante l\'aggiornamento');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carica i dati dalla cache al mount
    const loadCachedData = () => {
      try {
        if (sport) {
          const cachedMatches = optimizedOddsService.getCachedMatches(sport);
          if (cachedMatches.length > 0) {
            const convertedMatches = cachedMatches.map(convertOptimizedMatchToMatch);
            setMatches(convertedMatches);
            setLastUpdate(new Date());
          }
        } else {
          const allCachedMatches = optimizedOddsService.getAllCachedMatches();
          if (allCachedMatches.length > 0) {
            const convertedMatches = allCachedMatches.map(convertOptimizedMatchToMatch);
            setMatches(convertedMatches);
            setLastUpdate(new Date());
          }
        }
      } catch (err) {
        console.error('Errore caricamento cache:', err);
      }
    };

    loadCachedData();
  }, [sport]);

  return {
    matches,
    isLoading,
    error,
    lastUpdate,
    refreshOdds
  };
} 