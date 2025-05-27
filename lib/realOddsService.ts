// Servizio Quote Reali - SOLO DATI VERIFICATI
// Nessun fallback su dati falsi - Solo partite e quote reali

import { Match, Odds } from '@/types';
import { activeSeasonsManager } from './activeSeasonsManager';

interface RealApiResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

export class RealOddsService {
  private static instance: RealOddsService;
  
  // API Key reale per The Odds API
  private readonly API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY || '4815fd45ad14363aea162bef71a91b06';
  private readonly BASE_URL = 'https://api.the-odds-api.com/v4';
  
  // Limite richieste: 500/mese per piano gratuito
  private readonly MONTHLY_LIMIT = 500;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 ora
  
  private cache = new Map<string, { data: any; timestamp: number }>();
  private requestCount = 0;
  
  constructor() {
    this.loadRequestCount();
  }

  static getInstance(): RealOddsService {
    if (!RealOddsService.instance) {
      RealOddsService.instance = new RealOddsService();
    }
    return RealOddsService.instance;
  }

  private loadRequestCount(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('realOddsRequestCount');
      if (saved) {
        const data = JSON.parse(saved);
        const now = new Date();
        const savedDate = new Date(data.date);
        
        // Reset contatore se è un nuovo mese
        if (now.getMonth() !== savedDate.getMonth() || now.getFullYear() !== savedDate.getFullYear()) {
          this.requestCount = 0;
          this.saveRequestCount();
        } else {
          this.requestCount = data.count || 0;
        }
      }
    }
  }

  private saveRequestCount(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('realOddsRequestCount', JSON.stringify({
        count: this.requestCount,
        date: new Date().toISOString()
      }));
    }
  }

  private canMakeRequest(): boolean {
    return this.requestCount < this.MONTHLY_LIMIT;
  }

  private async makeApiRequest(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    
    // Controlla cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`📦 Cache hit per ${endpoint}`);
      return cached.data;
    }

    // Verifica limite richieste
    if (!this.canMakeRequest()) {
      throw new Error(`LIMITE_MENSILE_RAGGIUNTO: ${this.requestCount}/${this.MONTHLY_LIMIT}`);
    }

    const url = `${this.BASE_URL}${endpoint}`;
    
    try {
      console.log(`🔄 Richiesta API reale: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API_KEY_INVALIDA');
        }
        if (response.status === 429) {
          throw new Error('LIMITE_RICHIESTE_SUPERATO');
        }
        throw new Error(`HTTP_ERROR_${response.status}`);
      }

      const data = await response.json();
      
      // Incrementa contatore e salva
      this.requestCount++;
      this.saveRequestCount();
      
      // Salva in cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      console.log(`✅ Dati reali ricevuti: ${Array.isArray(data) ? data.length : 1} elementi`);
      console.log(`📊 Richieste utilizzate: ${this.requestCount}/${this.MONTHLY_LIMIT}`);
      
      return data;
      
    } catch (error) {
      console.error(`❌ Errore API reale:`, error);
      throw error;
    }
  }

  // Ottieni sport disponibili con partite reali
  async getAvailableSports(): Promise<string[]> {
    try {
      const sports = await this.makeApiRequest(`/sports?apiKey=${this.API_KEY}`);
      
      // Filtra solo sport con campionati attivi
      const activeLeagues = activeSeasonsManager.getActiveLeagues();
      const activeSportKeys = activeLeagues.map(league => league.key);
      
      const availableSports = sports
        .filter((sport: any) => activeSportKeys.includes(sport.key))
        .map((sport: any) => sport.key);
      
      console.log(`🏆 Sport disponibili con partite reali: ${availableSports.join(', ')}`);
      
      return availableSports;
      
    } catch (error) {
      console.error('❌ Errore recupero sport disponibili:', error);
      return [];
    }
  }

  // Ottieni partite reali per uno sport
  async getRealMatchesForSport(sportKey: string): Promise<Match[]> {
    try {
      const endpoint = `/sports/${sportKey}/odds?apiKey=${this.API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`;
      const apiData: RealApiResponse[] = await this.makeApiRequest(endpoint);
      
      if (!Array.isArray(apiData) || apiData.length === 0) {
        console.warn(`⚠️ Nessuna partita reale trovata per ${sportKey}`);
        return [];
      }

      // Filtra solo partite future (non iniziate)
      const now = new Date();
      const upcomingMatches = apiData.filter(match => {
        const matchDate = new Date(match.commence_time);
        return matchDate > now;
      });

      if (upcomingMatches.length === 0) {
        console.warn(`⚠️ Nessuna partita futura trovata per ${sportKey}`);
        return [];
      }

      // Converte in formato Match
      const matches: Match[] = upcomingMatches.map(apiMatch => {
        const odds: Odds[] = [];
        
        // Processa bookmaker
        apiMatch.bookmakers.forEach(bookmaker => {
          const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
          if (!h2hMarket || h2hMarket.outcomes.length < 2) return;
          
          const homeOutcome = h2hMarket.outcomes.find(o => o.name === apiMatch.home_team);
          const awayOutcome = h2hMarket.outcomes.find(o => o.name === apiMatch.away_team);
          const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');
          
          if (homeOutcome && awayOutcome) {
            odds.push({
              home: homeOutcome.price,
              away: awayOutcome.price,
              draw: drawOutcome?.price,
              bookmaker: bookmaker.title,
              lastUpdated: new Date(bookmaker.last_update)
            });
          }
        });

        // Solo partite con almeno 2 bookmaker
        if (odds.length < 2) {
          return null;
        }

        const leagueInfo = activeSeasonsManager.getActiveLeagues()
          .find(league => league.key === sportKey);

        return {
          id: apiMatch.id,
          homeTeam: apiMatch.home_team,
          awayTeam: apiMatch.away_team,
          league: leagueInfo?.name || apiMatch.sport_title,
          sport: leagueInfo?.sport || 'sport',
          date: new Date(apiMatch.commence_time),
          status: 'upcoming' as const,
          odds
        };
      }).filter(Boolean) as Match[];

      console.log(`✅ ${matches.length} partite reali caricate per ${sportKey}`);
      
      return matches;
      
    } catch (error) {
      console.error(`❌ Errore caricamento partite reali per ${sportKey}:`, error);
      return [];
    }
  }

  // Ottieni tutte le partite reali per tutti i campionati attivi
  async getAllRealMatches(): Promise<Match[]> {
    try {
      console.log('🔄 Caricamento di TUTTE le partite reali...');
      
      const availableSports = await this.getAvailableSports();
      
      if (availableSports.length === 0) {
        throw new Error('NESSUNO_SPORT_DISPONIBILE');
      }

      const allMatches: Match[] = [];
      
      // Carica partite per ogni sport disponibile
      for (const sportKey of availableSports) {
        try {
          const matches = await this.getRealMatchesForSport(sportKey);
          allMatches.push(...matches);
          
          // Pausa tra richieste per evitare rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Errore per sport ${sportKey}:`, error);
          // Continua con gli altri sport
        }
      }

      if (allMatches.length === 0) {
        throw new Error('NESSUNA_PARTITA_REALE_TROVATA');
      }

      console.log(`🎉 TOTALE PARTITE REALI CARICATE: ${allMatches.length}`);
      console.log(`📊 Sport con partite: ${availableSports.length}`);
      console.log(`🔢 Richieste API utilizzate: ${this.requestCount}/${this.MONTHLY_LIMIT}`);
      
      return allMatches;
      
    } catch (error) {
      console.error('❌ ERRORE CRITICO - Impossibile caricare partite reali:', error);
      throw error;
    }
  }

  // Ottieni statistiche del servizio
  getServiceStats() {
    return {
      requestsUsed: this.requestCount,
      requestsRemaining: this.MONTHLY_LIMIT - this.requestCount,
      monthlyLimit: this.MONTHLY_LIMIT,
      cacheSize: this.cache.size,
      canMakeRequests: this.canMakeRequest()
    };
  }

  // Reset per test (solo in sviluppo)
  resetForTesting(): void {
    if (process.env.NODE_ENV === 'development') {
      this.requestCount = 0;
      this.cache.clear();
      this.saveRequestCount();
      console.log('🔄 Servizio quote reali resettato per test');
    }
  }
}

// Istanza singleton
export const realOddsService = RealOddsService.getInstance(); 