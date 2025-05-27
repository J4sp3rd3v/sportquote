// Servizio per fornire dati di fallback quando l'API è in modalità emergenza
import { Match } from '@/types';

export class FallbackDataService {
  private static instance: FallbackDataService;

  static getInstance(): FallbackDataService {
    if (!FallbackDataService.instance) {
      FallbackDataService.instance = new FallbackDataService();
    }
    return FallbackDataService.instance;
  }

  getFallbackMatches(): Match[] {
    const now = new Date();
    const today = new Date(now);
    
    return [
      {
        id: 'fallback-1',
        homeTeam: 'Juventus',
        awayTeam: 'Inter',
        sport: 'calcio',
        league: 'Serie A',
        date: new Date(today.getTime() + 3 * 60 * 60 * 1000),
        status: 'upcoming',
        odds: [
          { bookmaker: 'Bet365', home: 2.10, away: 3.40, draw: 3.20, lastUpdated: new Date() },
          { bookmaker: 'William Hill', home: 2.05, away: 3.50, draw: 3.25, lastUpdated: new Date() },
          { bookmaker: 'Betfair', home: 2.15, away: 3.35, draw: 3.15, lastUpdated: new Date() }
        ]
      },
      {
        id: 'fallback-2',
        homeTeam: 'Milan',
        awayTeam: 'Napoli',
        sport: 'calcio',
        league: 'Serie A',
        date: new Date(today.getTime() + 5 * 60 * 60 * 1000),
        status: 'upcoming',
        odds: [
          { bookmaker: 'Bet365', home: 2.30, away: 3.10, draw: 3.40, lastUpdated: new Date() },
          { bookmaker: 'William Hill', home: 2.25, away: 3.15, draw: 3.45, lastUpdated: new Date() },
          { bookmaker: 'Betfair', home: 2.35, away: 3.05, draw: 3.35, lastUpdated: new Date() }
        ]
      },
      {
        id: 'fallback-3',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        sport: 'calcio',
        league: 'Premier League',
        date: new Date(today.getTime() + 4 * 60 * 60 * 1000),
        status: 'upcoming',
        odds: [
          { bookmaker: 'Bet365', home: 2.20, away: 3.20, draw: 3.50, lastUpdated: new Date() },
          { bookmaker: 'William Hill', home: 2.15, away: 3.25, draw: 3.55, lastUpdated: new Date() }
        ]
      },
      {
        id: 'fallback-4',
        homeTeam: 'Los Angeles Lakers',
        awayTeam: 'Boston Celtics',
        sport: 'basket',
        league: 'NBA',
        date: new Date(today.getTime() + 6 * 60 * 60 * 1000),
        status: 'upcoming',
        odds: [
          { bookmaker: 'Bet365', home: 1.90, away: 1.95, lastUpdated: new Date() },
          { bookmaker: 'William Hill', home: 1.88, away: 1.97, lastUpdated: new Date() }
        ]
      },
      // Partita con opportunità di arbitraggio (tennis)
      {
        id: 'arbitrage-tennis-1',
        homeTeam: 'Novak Djokovic',
        awayTeam: 'Rafael Nadal',
        sport: 'tennis',
        league: 'ATP Masters 1000',
        date: new Date(today.getTime() + 2 * 60 * 60 * 1000),
        status: 'upcoming',
        odds: [
          { bookmaker: 'Bet365', home: 2.20, away: 1.75, lastUpdated: new Date() },
          { bookmaker: 'William Hill', home: 1.80, away: 2.10, lastUpdated: new Date() },
          { bookmaker: 'Betfair', home: 2.15, away: 1.78, lastUpdated: new Date() }
        ]
      },
      // Partita con opportunità di arbitraggio (calcio)
      {
        id: 'arbitrage-football-1',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        sport: 'calcio',
        league: 'La Liga',
        date: new Date(today.getTime() + 4 * 60 * 60 * 1000),
        status: 'upcoming',
        odds: [
          { bookmaker: 'Bet365', home: 2.80, away: 2.60, draw: 3.40, lastUpdated: new Date() },
          { bookmaker: 'William Hill', home: 2.75, away: 2.65, draw: 3.45, lastUpdated: new Date() },
          { bookmaker: 'Betfair', home: 2.85, away: 2.55, draw: 3.35, lastUpdated: new Date() },
          { bookmaker: 'Unibet', home: 2.70, away: 2.70, draw: 3.50, lastUpdated: new Date() }
        ]
      }
    ];
  }

  getMatchesByCategory() {
    const matches = this.getFallbackMatches();
    
    return {
      calcio: matches.filter(m => m.sport === 'calcio'),
      tennis: matches.filter(m => m.sport === 'tennis'),
      basket: matches.filter(m => m.sport === 'basket'),
      altro: matches.filter(m => !['calcio', 'tennis', 'basket'].includes(m.sport))
    };
  }

  addEmergencyNotice(): string {
    return '⚠️ MODALITÀ EMERGENZA ATTIVA - Dati di esempio per preservare le richieste API';
  }
}

// Istanza singleton
export const fallbackDataService = FallbackDataService.getInstance(); 