// Servizio API ottimizzato per gestire 500 richieste mensili - 1 richiesta per sport al giorno
import { OddsApiEvent, OddsApiSport } from './oddsApi';
import { emergencyApiManager } from './emergencyApiManager';
import { dailyApiManager } from './dailyApiManager';

const BASE_URL = 'https://api.the-odds-api.com/v4';

// Configurazione ottimizzazione giornaliera
const DAILY_CONFIG = {
  // Limiti mensili
  MONTHLY_LIMIT: 500,
  
  // Aggiornamenti giornalieri (1 per sport)
  DAILY_QUOTA: 6,
  HOURS_BETWEEN_UPDATES: 24,
  
  // Cache TTL (Time To Live in millisecondi)
  CACHE_TTL: {
    QUOTES: 24 * 60 * 60 * 1000,    // 24 ore per le quote (aggiornamento giornaliero)
    SPORTS: 7 * 24 * 60 * 60 * 1000, // 7 giorni per la lista sport
    STATUS: 60 * 60 * 1000           // 1 ora per lo status API
  }
};

// Sport prioritizzati per l'Italia (1 richiesta al giorno per sport)
const SPORT_PRIORITIES = [
  'soccer_italy_serie_a',      // Serie A - massima priorità
  'soccer_epl',                // Premier League
  'soccer_uefa_champs_league', // Champions League
  'basketball_nba',            // NBA
  'tennis_atp_french_open',    // ATP Tennis
  'americanfootball_nfl'       // NFL
];

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  sport?: string;
}

interface DailyApiStats {
  requestsToday: number;
  requestsThisMonth: number;
  dailyQuota: number;
  monthlyLimit: number;
  lastUpdate: Date | null;
  sportsUpdatedToday: string[];
  nextSportToUpdate: string | null;
}

export class OptimizedOddsApiService {
  private cache = new Map<string, CacheEntry<any>>();
  private lastUpdateTimes = new Map<string, number>();

  constructor() {
    this.startDailyUpdateScheduler();
  }

  private getCurrentApiKey(): string {
    return dailyApiManager.getApiKey();
  }

  private updateDailyStats(sport: string, requestsRemaining: number, requestsUsed: number) {
    dailyApiManager.recordRequest(sport, requestsRemaining, requestsUsed);
    
    console.log(`📊 Aggiornamento API giornaliero completato:`);
    console.log(`• Sport: ${sport}`);
    console.log(`• Richieste usate oggi: ${dailyApiManager.getDailyStats().today.used}/${DAILY_CONFIG.DAILY_QUOTA}`);
    console.log(`• Richieste usate questo mese: ${requestsUsed}/${DAILY_CONFIG.MONTHLY_LIMIT}`);
    console.log(`• Richieste rimanenti: ${requestsRemaining}`);
  }

  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number, sport?: string) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      sport
    });
  }

  private async makeApiRequest(endpoint: string, params: any = {}, sport?: string): Promise<any> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Controlla cache prima (priorità alla cache per ridurre richieste)
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit per ${endpoint} (sport: ${sport || 'unknown'})`);
      return cached;
    }

    // Controlla se possiamo fare richieste oggi
    if (!dailyApiManager.canMakeRequest()) {
      const stats = dailyApiManager.getDailyStats();
      throw new Error(`DAILY_LIMIT_REACHED: Quota giornaliera esaurita (${stats.today.used}/${stats.today.quota})`);
    }

    // Se è specificato uno sport, controlla se può essere aggiornato
    if (sport && !dailyApiManager.canUpdateSport(sport)) {
      throw new Error(`SPORT_ALREADY_UPDATED: Sport ${sport} già aggiornato oggi`);
    }

    // Costruisci URL con la nuova chiave API
    const apiKey = this.getCurrentApiKey();
    const queryParams = new URLSearchParams({
      apiKey,
      ...params
    });
    
    const url = `${BASE_URL}${endpoint}?${queryParams}`;

    try {
      console.log(`🔄 Richiesta API per ${sport || endpoint}...`);
      const response = await fetch(url);
      
      // Aggiorna statistiche utilizzo
      const remaining = parseInt(response.headers.get('x-requests-remaining') || '0');
      const used = parseInt(response.headers.get('x-requests-used') || '0');
      
      if (sport) {
        this.updateDailyStats(sport, remaining, used);
      }

      if (!response.ok) {
        if (response.status === 401) {
          console.error('🔑 Chiave API non valida o limite raggiunto');
          throw new Error('API_LIMIT_REACHED');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Salva in cache con TTL esteso (24 ore per aggiornamenti giornalieri)
      const ttl = endpoint.includes('/odds') 
        ? DAILY_CONFIG.CACHE_TTL.QUOTES 
        : DAILY_CONFIG.CACHE_TTL.SPORTS;
      
      this.setCache(cacheKey, data, ttl, sport);
      
      return data;
    } catch (error) {
      console.error(`❌ Errore API ${endpoint}:`, error);
      throw error;
    }
  }

  async getOddsOptimized(sport: string): Promise<OddsApiEvent[]> {
    try {
      return await this.makeApiRequest(`/sports/${sport}/odds`, {
        regions: 'eu',
        markets: 'h2h',
        oddsFormat: 'decimal'
      }, sport);
    } catch (error) {
      console.error(`Errore nel recupero quote per ${sport}:`, error);
      return [];
    }
  }

  async getDailySportsUpdate(): Promise<OddsApiEvent[]> {
    const allEvents: OddsApiEvent[] = [];
    const stats = dailyApiManager.getDailyStats();

    console.log(`🔄 Aggiornamento giornaliero programmato:`);
    console.log(`• Richieste oggi: ${stats.today.used}/${stats.today.quota}`);
    console.log(`• Sport da aggiornare: ${stats.sports.remaining}`);

    // Ottieni il prossimo sport da aggiornare
    const nextSport = dailyApiManager.getNextSportToUpdate();
    
    if (!nextSport) {
      console.log('✅ Tutti gli sport sono stati aggiornati oggi');
      return allEvents;
    }

    try {
      console.log(`🎯 Aggiornamento sport prioritario: ${nextSport}`);
      const events = await this.getOddsOptimized(nextSport);
      
      if (events.length > 0) {
        allEvents.push(...events);
        this.lastUpdateTimes.set(nextSport, Date.now());
        console.log(`✅ ${nextSport}: ${events.length} eventi aggiornati`);
      }
    } catch (error) {
      console.error(`❌ Errore per ${nextSport}:`, error);
      
      if ((error as Error).message.includes('DAILY_LIMIT_REACHED')) {
        console.log('🛑 Limite giornaliero raggiunto, stop aggiornamenti');
      }
    }

    return allEvents;
  }

  private startDailyUpdateScheduler() {
    // Controlla ogni ora se ci sono sport da aggiornare
    setInterval(() => {
      const nextSport = dailyApiManager.getNextSportToUpdate();
      if (nextSport) {
        console.log(`⏰ Controllo programmato: sport ${nextSport} disponibile per aggiornamento`);
        this.getDailySportsUpdate().catch(console.error);
      }
    }, 60 * 60 * 1000); // Ogni ora

    // Primo controllo dopo 10 secondi
    setTimeout(() => {
      this.getDailySportsUpdate().catch(console.error);
    }, 10000);
  }

  async getApiStatus() {
    const cacheKey = 'daily_api_status';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const dailyStats = dailyApiManager.getDailyStats();
      
      const status = {
        isActive: true,
        apiKey: this.getCurrentApiKey().substring(0, 8) + '...',
        dailyStats,
        cacheSize: this.cache.size,
        supportedSports: SPORT_PRIORITIES,
        updateFrequency: 'Giornaliera (1 richiesta per sport)',
        nextUpdate: dailyStats.nextUpdate
      };

      this.setCache(cacheKey, status, DAILY_CONFIG.CACHE_TTL.STATUS);
      return status;
    } catch (error) {
      return {
        isActive: false,
        error: (error as Error).message,
        dailyStats: dailyApiManager.getDailyStats(),
        cacheSize: this.cache.size
      };
    }
  }

  // Metodo per forzare aggiornamento di uno sport specifico (solo se non aggiornato oggi)
  async forceUpdateSport(sport: string): Promise<OddsApiEvent[]> {
    if (!dailyApiManager.canUpdateSport(sport)) {
      throw new Error(`Sport ${sport} già aggiornato oggi. Prossimo aggiornamento domani.`);
    }

    console.log(`🔄 Aggiornamento forzato per ${sport}`);
    
    // Rimuovi dalla cache
    const cacheKey = this.getCacheKey(`/sports/${sport}/odds`, {
      regions: 'eu',
      markets: 'h2h',
      oddsFormat: 'decimal'
    });
    this.cache.delete(cacheKey);
    
    return await this.getOddsOptimized(sport);
  }

  // Pulisci cache scaduta
  cleanExpiredCache() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🧹 Cache pulita, ${this.cache.size} elementi rimanenti`);
  }

  // Ottieni statistiche dettagliate giornaliere
  getDetailedStats() {
    const dailyStats = dailyApiManager.getDailyStats();
    
    return {
      daily: dailyStats.today,
      monthly: dailyStats.month,
      sports: dailyStats.sports,
      lastUpdate: dailyStats.lastUpdate,
      nextUpdate: dailyStats.nextUpdate,
      cacheStats: {
        size: this.cache.size,
        entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
          key,
          sport: entry.sport,
          age: Math.round((Date.now() - entry.timestamp) / (60 * 1000)), // minuti
          ttl: Math.round(entry.ttl / (60 * 60 * 1000)) // ore
        }))
      },
      systemStatus: {
        updateFrequency: 'Giornaliera',
        apiKey: this.getCurrentApiKey().substring(0, 8) + '...',
        supportedSports: SPORT_PRIORITIES.length
      }
    };
  }
}

// Istanza globale del servizio API ottimizzato
let optimizedApiInstance: OptimizedOddsApiService | null = null;

export function getOptimizedOddsApi(): OptimizedOddsApiService {
  if (!optimizedApiInstance) {
    optimizedApiInstance = new OptimizedOddsApiService();
  }
  return optimizedApiInstance;
}

// Esporta l'istanza per compatibilità
export const optimizedOddsApi = {
  getApiStatus: () => getOptimizedOddsApi().getApiStatus(),
  getDailySportsUpdate: () => getOptimizedOddsApi().getDailySportsUpdate(),
  forceUpdateSport: (sport: string) => getOptimizedOddsApi().forceUpdateSport(sport),
  cleanExpiredCache: () => getOptimizedOddsApi().cleanExpiredCache(),
  getDetailedStats: () => getOptimizedOddsApi().getDetailedStats()
}; 