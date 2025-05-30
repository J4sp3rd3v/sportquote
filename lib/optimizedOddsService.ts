// Servizio Ottimizzato per Quote Sportive - 2025
// Utilizza il sistema API unificato e gestione bookmaker ottimizzata

import { unifiedApiManager } from './unifiedApiManager';
import { optimizedBookmakerManager } from './optimizedBookmakerManager';
import { testDataGenerator } from './testDataGenerator';
import { Match } from '@/types';

export interface OptimizedMatch {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  bookmakers: OptimizedBookmaker[];
  bestOdds: {
    home: { bookmaker: string; odds: number };
    away: { bookmaker: string; odds: number };
    draw?: { bookmaker: string; odds: number };
  };
  arbitrageOpportunity?: {
    profit: number;
    stakes: { [bookmaker: string]: number };
  };
}

export interface OptimizedBookmaker {
  id: string;
  name: string;
  displayName: string;
  verified: boolean;
  category: string;
  odds: {
    home: number;
    away: number;
    draw?: number;
  };
  handicapOdds?: {
    home: number;
    away: number;
    handicap: number;
  }[];
  overUnder?: {
    over: number;
    under: number;
    total: number;
  }[];
  lastUpdate: string;
}

export interface SportCategory {
  key: string;
  name: string;
  matches: OptimizedMatch[];
  lastUpdate: string;
  nextUpdate: string;
}

export class OptimizedOddsService {
  private static instance: OptimizedOddsService;
  
  // Mapping sport API -> categorie app
  private readonly SPORT_MAPPING = {
    'soccer_italy_serie_a': { sport: 'calcio', league: 'serie-a', name: 'Serie A' },
    'soccer_epl': { sport: 'calcio', league: 'premier-league', name: 'Premier League' },
    'soccer_uefa_champs_league': { sport: 'calcio', league: 'champions-league', name: 'Champions League' },
    'basketball_nba': { sport: 'basket', league: 'nba', name: 'NBA' },
    'tennis_atp_french_open': { sport: 'tennis', league: 'atp', name: 'ATP Tennis' },
    'americanfootball_nfl': { sport: 'football-americano', league: 'nfl', name: 'NFL' }
  };

  constructor() {}

  static getInstance(): OptimizedOddsService {
    if (!OptimizedOddsService.instance) {
      OptimizedOddsService.instance = new OptimizedOddsService();
    }
    return OptimizedOddsService.instance;
  }

  // Ottieni quote per uno sport specifico
  async getSportOdds(sportKey: string): Promise<OptimizedMatch[]> {
    try {
      console.log(`🔄 Caricamento quote per ${sportKey}...`);
      
      const apiData = await unifiedApiManager.getSportOdds(sportKey);
      
      if (!apiData || !Array.isArray(apiData)) {
        console.warn(`Nessun dato ricevuto per ${sportKey}, utilizzo dati di test`);
        return this.getTestDataForSport(sportKey);
      }

      const optimizedMatches = this.convertApiDataToMatches(apiData, sportKey);
      
      console.log(`✅ ${optimizedMatches.length} partite caricate per ${sportKey}`);
      
      return optimizedMatches;
      
    } catch (error) {
      console.error(`❌ Errore caricamento quote ${sportKey}:`, error);
      console.log(`🎲 Utilizzo dati di test per ${sportKey}`);
      
      // Utilizza dati di test come fallback
      return this.getTestDataForSport(sportKey);
    }
  }

  // Ottieni tutte le quote disponibili
  async getAllSportsOdds(): Promise<SportCategory[]> {
    const categories: SportCategory[] = [];
    const sportsConfig = unifiedApiManager.getSportsConfig();
    
    for (const sport of sportsConfig) {
      if (!sport.enabled) continue;
      
      try {
        const matches = await this.getSportOdds(sport.key);
        const mapping = this.SPORT_MAPPING[sport.key as keyof typeof this.SPORT_MAPPING];
        
        if (mapping && matches.length > 0) {
          categories.push({
            key: sport.key,
            name: mapping.name,
            matches,
            lastUpdate: new Date().toISOString(),
            nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ore
          });
        }
        
      } catch (error) {
        console.error(`Errore caricamento ${sport.key}:`, error);
        // Continua con gli altri sport
      }
    }
    
    return categories;
  }

  // Ottieni il prossimo sport da aggiornare
  getNextSportToUpdate() {
    return unifiedApiManager.getNextSportToUpdate();
  }

  // Aggiorna automaticamente il prossimo sport
  async updateNextSport(): Promise<{ success: boolean; sport?: string; matches?: number; error?: string }> {
    const nextSport = this.getNextSportToUpdate();
    
    if (!nextSport) {
      return {
        success: false,
        error: 'Nessun sport disponibile per aggiornamento'
      };
    }
    
    try {
      const matches = await this.getSportOdds(nextSport.key);
      
      return {
        success: true,
        sport: nextSport.name,
        matches: matches.length
      };
      
    } catch (error) {
      return {
        success: false,
        sport: nextSport.name,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  }

  // Converti dati API in formato ottimizzato
  private convertApiDataToMatches(apiData: any[], sportKey: string): OptimizedMatch[] {
    return apiData.map(event => {
      const optimizedBookmakers = this.processBookmakers(event.bookmakers || []);
      const bestOdds = this.calculateBestOdds(optimizedBookmakers);
      const arbitrageOpportunity = this.calculateArbitrage(optimizedBookmakers);
      
      return {
        id: event.id || `${event.home_team}_${event.away_team}_${Date.now()}`,
        sport: this.getSportCategory(sportKey),
        league: this.getLeagueName(sportKey),
        homeTeam: this.normalizeTeamName(event.home_team),
        awayTeam: this.normalizeTeamName(event.away_team),
        commenceTime: event.commence_time,
        bookmakers: optimizedBookmakers,
        bestOdds,
        arbitrageOpportunity
      };
    });
  }

  // Processa bookmaker dall'API
  private processBookmakers(apiBookmakers: any[]): OptimizedBookmaker[] {
    const processedBookmakers: OptimizedBookmaker[] = [];
    
    for (const apiBookmaker of apiBookmakers) {
      const bookmakerName = apiBookmaker.title || apiBookmaker.key;
      const normalizedName = optimizedBookmakerManager.normalizeBookmakerName(bookmakerName);
      const config = optimizedBookmakerManager.getBookmakerConfig(normalizedName);
      
      // Processa solo bookmaker supportati
      if (!config) {
        console.log(`Bookmaker non supportato: ${bookmakerName}`);
        continue;
      }
      
      // Estrai quote H2H (1X2 o 1-2)
      const h2hMarket = apiBookmaker.markets?.find((m: any) => m.key === 'h2h');
      if (!h2hMarket || !h2hMarket.outcomes) {
        continue;
      }
      
      const outcomes = h2hMarket.outcomes;
      const homeOutcome = outcomes.find((o: any) => o.name === apiBookmaker.home_team || o.name.includes('Home'));
      const awayOutcome = outcomes.find((o: any) => o.name === apiBookmaker.away_team || o.name.includes('Away'));
      const drawOutcome = outcomes.find((o: any) => o.name === 'Draw' || o.name === 'Tie');
      
      if (!homeOutcome || !awayOutcome) {
        continue;
      }

      // Processa quote handicap
      const handicapOdds = this.processHandicapMarkets(apiBookmaker.markets || []);
      
      // Processa quote over/under
      const overUnderOdds = this.processOverUnderMarkets(apiBookmaker.markets || []);
      
      const bookmaker: OptimizedBookmaker = {
        id: config.id,
        name: config.name,
        displayName: config.displayName,
        verified: config.verified,
        category: config.category,
        odds: {
          home: homeOutcome.price,
          away: awayOutcome.price,
          draw: drawOutcome?.price
        },
        lastUpdate: apiBookmaker.last_update || new Date().toISOString()
      };

      // Aggiungi handicap se disponibili
      if (handicapOdds.length > 0) {
        bookmaker.handicapOdds = handicapOdds;
      }

      // Aggiungi over/under se disponibili
      if (overUnderOdds.length > 0) {
        bookmaker.overUnder = overUnderOdds;
      }
      
      processedBookmakers.push(bookmaker);
    }
    
    // Ordina per priorità (premium prima)
    return processedBookmakers.sort((a, b) => {
      const aConfig = optimizedBookmakerManager.getBookmakerConfig(a.id);
      const bConfig = optimizedBookmakerManager.getBookmakerConfig(b.id);
      
      if (!aConfig || !bConfig) return 0;
      
      return aConfig.priority - bConfig.priority;
    });
  }

  // Calcola le migliori quote
  private calculateBestOdds(bookmakers: OptimizedBookmaker[]) {
    let bestHome = { bookmaker: '', odds: 0 };
    let bestAway = { bookmaker: '', odds: 0 };
    let bestDraw = { bookmaker: '', odds: 0 };
    
    for (const bookmaker of bookmakers) {
      if (bookmaker.odds.home > bestHome.odds) {
        bestHome = { bookmaker: bookmaker.displayName, odds: bookmaker.odds.home };
      }
      
      if (bookmaker.odds.away > bestAway.odds) {
        bestAway = { bookmaker: bookmaker.displayName, odds: bookmaker.odds.away };
      }
      
      if (bookmaker.odds.draw && bookmaker.odds.draw > bestDraw.odds) {
        bestDraw = { bookmaker: bookmaker.displayName, odds: bookmaker.odds.draw };
      }
    }
    
    const result: any = { home: bestHome, away: bestAway };
    if (bestDraw.odds > 0) {
      result.draw = bestDraw;
    }
    
    return result;
  }

  // Calcola opportunità di arbitraggio
  private calculateArbitrage(bookmakers: OptimizedBookmaker[]) {
    if (bookmakers.length < 2) return undefined;
    
    const bestOdds = this.calculateBestOdds(bookmakers);
    
    // Calcola arbitraggio per 1X2
    if (bestOdds.draw) {
      const totalImpliedProb = (1 / bestOdds.home.odds) + (1 / bestOdds.away.odds) + (1 / bestOdds.draw.odds);
      
      if (totalImpliedProb < 1) {
        const profit = ((1 / totalImpliedProb) - 1) * 100;
        
        if (profit > 0.5) { // Solo arbitraggi > 0.5%
          return {
            profit: Math.round(profit * 100) / 100,
            stakes: {
              [bestOdds.home.bookmaker]: Math.round((1 / bestOdds.home.odds) / totalImpliedProb * 100),
              [bestOdds.away.bookmaker]: Math.round((1 / bestOdds.away.odds) / totalImpliedProb * 100),
              [bestOdds.draw.bookmaker]: Math.round((1 / bestOdds.draw.odds) / totalImpliedProb * 100)
            }
          };
        }
      }
    } else {
      // Calcola arbitraggio per 1-2
      const totalImpliedProb = (1 / bestOdds.home.odds) + (1 / bestOdds.away.odds);
      
      if (totalImpliedProb < 1) {
        const profit = ((1 / totalImpliedProb) - 1) * 100;
        
        if (profit > 0.5) {
          return {
            profit: Math.round(profit * 100) / 100,
            stakes: {
              [bestOdds.home.bookmaker]: Math.round((1 / bestOdds.home.odds) / totalImpliedProb * 100),
              [bestOdds.away.bookmaker]: Math.round((1 / bestOdds.away.odds) / totalImpliedProb * 100)
            }
          };
        }
      }
    }
    
    return undefined;
  }

  // Utility functions
  private getSportCategory(sportKey: string): string {
    const mapping = this.SPORT_MAPPING[sportKey as keyof typeof this.SPORT_MAPPING];
    return mapping?.sport || 'altro';
  }

  private getLeagueName(sportKey: string): string {
    const mapping = this.SPORT_MAPPING[sportKey as keyof typeof this.SPORT_MAPPING];
    return mapping?.league || sportKey;
  }

  private normalizeTeamName(teamName: string): string {
    return teamName
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^(FC|AC|AS|US|SS|ASD)\s+/i, '')
      .replace(/\s+(FC|AC|AS|US|SS|ASD)$/i, '');
  }

  // Ottieni statistiche del servizio
  getServiceStats() {
    const apiStats = unifiedApiManager.getDetailedStats();
    const bookmakerStats = optimizedBookmakerManager.getBookmakerStats();
    
    return {
      api: apiStats,
      bookmakers: bookmakerStats,
      sports: {
        supported: Object.keys(this.SPORT_MAPPING).length,
        mapping: this.SPORT_MAPPING
      },
      lastUpdate: new Date().toISOString()
    };
  }

  // Reset sistema per test
  resetSystem() {
    unifiedApiManager.forceReset();
    console.log('🔄 Sistema quote ottimizzato resettato');
  }

  // Aggiorna sport specifico
  async updateSportOdds(sport: string): Promise<{ success: boolean; matches?: OptimizedMatch[]; error?: string }> {
    try {
      const matches = await this.getSportOdds(sport);
      return {
        success: true,
        matches
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  }

  // Aggiorna tutti gli sport
  async updateAllSports(): Promise<{ success: boolean; allMatches?: OptimizedMatch[]; error?: string }> {
    try {
      const categories = await this.getAllSportsOdds();
      const allMatches = categories.flatMap(category => category.matches);
      
      return {
        success: true,
        allMatches
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  }

  // Ottieni partite dalla cache per uno sport
  getCachedMatches(sport: string): OptimizedMatch[] {
    // Per ora ritorna array vuoto - implementazione cache futura
    console.log(`Cache richiesta per sport: ${sport}`);
    return [];
  }

  // Ottieni tutte le partite dalla cache
  getAllCachedMatches(): OptimizedMatch[] {
    // Per ora ritorna array vuoto - implementazione cache futura
    console.log('Cache richiesta per tutti gli sport');
    return [];
  }

  // Genera dati di test per uno sport specifico
  private getTestDataForSport(sportKey: string): OptimizedMatch[] {
    try {
      const testMatches = testDataGenerator.generateMatchesForSport(sportKey, 8);
      const matches = testDataGenerator.convertToMatches(testMatches);
      
      // Converte Match[] in OptimizedMatch[]
      return matches.map(match => this.convertMatchToOptimized(match, sportKey));
    } catch (error) {
      console.error(`Errore generazione dati test per ${sportKey}:`, error);
      return [];
    }
  }

  // Processa mercati handicap
  private processHandicapMarkets(markets: any[]): { home: number; away: number; handicap: number }[] {
    const handicapOdds: { home: number; away: number; handicap: number }[] = [];
    
    // Cerca mercati handicap (spread, point_spread, handicap)
    const handicapMarkets = markets.filter(m => 
      m.key === 'spreads' || 
      m.key === 'point_spreads' || 
      m.key === 'handicap' ||
      m.key === 'asian_handicap'
    );
    
    for (const market of handicapMarkets) {
      if (!market.outcomes || market.outcomes.length < 2) continue;
      
      const homeOutcome = market.outcomes.find((o: any) => 
        o.name.includes('Home') || o.point < 0
      );
      const awayOutcome = market.outcomes.find((o: any) => 
        o.name.includes('Away') || o.point > 0
      );
      
      if (homeOutcome && awayOutcome) {
        handicapOdds.push({
          home: homeOutcome.price,
          away: awayOutcome.price,
          handicap: homeOutcome.point || 0
        });
      }
    }
    
    return handicapOdds;
  }

  // Processa mercati over/under
  private processOverUnderMarkets(markets: any[]): { over: number; under: number; total: number }[] {
    const overUnderOdds: { over: number; under: number; total: number }[] = [];
    
    // Cerca mercati totali (totals, over_under)
    const totalMarkets = markets.filter(m => 
      m.key === 'totals' || 
      m.key === 'over_under' ||
      m.key === 'total_goals'
    );
    
    for (const market of totalMarkets) {
      if (!market.outcomes || market.outcomes.length < 2) continue;
      
      const overOutcome = market.outcomes.find((o: any) => 
        o.name === 'Over' || o.name.includes('Over')
      );
      const underOutcome = market.outcomes.find((o: any) => 
        o.name === 'Under' || o.name.includes('Under')
      );
      
      if (overOutcome && underOutcome) {
        overUnderOdds.push({
          over: overOutcome.price,
          under: underOutcome.price,
          total: overOutcome.point || underOutcome.point || 2.5
        });
      }
    }
    
    return overUnderOdds;
  }

  // Converte Match in OptimizedMatch
  private convertMatchToOptimized(match: Match, sportKey: string): OptimizedMatch {
    const optimizedBookmakers: OptimizedBookmaker[] = match.odds.map(odd => {
      const config = optimizedBookmakerManager.getBookmakerConfig(odd.bookmaker);
      
      const bookmaker: OptimizedBookmaker = {
        id: config?.id || odd.bookmaker.toLowerCase().replace(/\s+/g, '-'),
        name: config?.name || odd.bookmaker,
        displayName: config?.displayName || odd.bookmaker,
        verified: config?.verified || false,
        category: config?.category || 'standard',
        odds: {
          home: odd.home,
          away: odd.away,
          draw: odd.draw
        },
        lastUpdate: odd.lastUpdated.toISOString()
      };

      // Aggiungi handicap se disponibili
      if (odd.handicap && odd.handicap.length > 0) {
        bookmaker.handicapOdds = odd.handicap.map(h => ({
          home: h.home,
          away: h.away,
          handicap: h.handicap
        }));
      }

      return bookmaker;
    });

    const bestOdds = this.calculateBestOdds(optimizedBookmakers);
    const arbitrageOpportunity = this.calculateArbitrage(optimizedBookmakers);

    return {
      id: match.id,
      sport: this.getSportCategory(sportKey),
      league: this.getLeagueName(sportKey),
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      commenceTime: match.date.toISOString(),
      bookmakers: optimizedBookmakers,
      bestOdds,
      arbitrageOpportunity
    };
  }
}

// Istanza singleton
export const optimizedOddsService = OptimizedOddsService.getInstance(); 