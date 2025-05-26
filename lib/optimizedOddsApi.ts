// Servizio API ottimizzato per gestire 500 richieste mensili
import { OddsApiEvent, OddsApiSport } from './oddsApi';
import { emergencyApiManager } from './emergencyApiManager';

// Pool di chiavi API per rotazione
const API_KEYS = [
  'f9fddbc4c5be58bd8e9e13ad9c91a3cc'  // Chiave attiva (490 richieste rimanenti)
];

const BASE_URL = 'https://api.the-odds-api.com/v4';

// Configurazione ottimizzazione
const OPTIMIZATION_CONFIG = {
  // Limiti mensili per chiave
  MONTHLY_LIMIT: 500,
  
  // Soglie di utilizzo
  WARNING_THRESHOLD: 400,  // 80% del limite
  CRITICAL_THRESHOLD: 450, // 90% del limite
  
  // Intervalli di aggiornamento (in minuti)
  UPDATE_INTERVALS: {
    HIGH_PRIORITY: 30,    // Serie A, Premier League (ogni 30 min)
    MEDIUM_PRIORITY: 60,  // Altri campionati principali (ogni ora)
    LOW_PRIORITY: 120,    // Sport secondari (ogni 2 ore)
    EMERGENCY: 180        // Modalità risparmio (ogni 3 ore)
  },
  
  // Cache TTL (Time To Live in millisecondi)
  CACHE_TTL: {
    QUOTES: 30 * 60 * 1000,    // 30 minuti per le quote
    SPORTS: 24 * 60 * 60 * 1000, // 24 ore per la lista sport
    STATUS: 5 * 60 * 1000       // 5 minuti per lo status API
  }
};

// Sport prioritizzati per l'Italia
const SPORT_PRIORITIES = {
  HIGH: [
    'soccer_italy_serie_a',      // Serie A - massima priorità
    'soccer_epl',                // Premier League
    'soccer_uefa_champs_league'  // Champions League
  ],
  MEDIUM: [
    'soccer_spain_la_liga',      // La Liga
    'soccer_germany_bundesliga', // Bundesliga
    'soccer_france_ligue_one',   // Ligue 1
    'basketball_nba',            // NBA
    'tennis_atp_french_open'     // ATP
  ],
  LOW: [
    'basketball_euroleague',
    'tennis_wta_french_open',
    'americanfootball_nfl',
    'icehockey_nhl'
  ]
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface ApiUsageStats {
  keyIndex: number;
  requestsUsed: number;
  requestsRemaining: number;
  lastReset: number;
  lastRequest: number;
}

export class OptimizedOddsApiService {
  private cache = new Map<string, CacheEntry<any>>();
  private currentKeyIndex = 0;
  private usageStats: ApiUsageStats[] = [];
  private lastUpdateTimes = new Map<string, number>();
  private isEmergencyMode = false;

  constructor() {
    this.initializeUsageStats();
    this.startScheduledUpdates();
  }

  private initializeUsageStats() {
    this.usageStats = API_KEYS.map((_, index) => ({
      keyIndex: index,
      requestsUsed: 0,
      requestsRemaining: OPTIMIZATION_CONFIG.MONTHLY_LIMIT,
      lastReset: Date.now(),
      lastRequest: 0
    }));

    // Carica statistiche salvate dal localStorage (se disponibile)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apiUsageStats');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Verifica se i dati sono del mese corrente
          const currentMonth = new Date().getMonth();
          const savedMonth = new Date(parsed[0]?.lastReset || 0).getMonth();
          
          if (currentMonth === savedMonth) {
            this.usageStats = parsed;
          }
                 } catch (error) {
           console.warn('Errore nel caricamento statistiche API:', error as Error);
        }
      }
    }
  }

  private saveUsageStats() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiUsageStats', JSON.stringify(this.usageStats));
    }
  }

  private getCurrentApiKey(): string {
    return API_KEYS[this.currentKeyIndex];
  }

  private selectBestApiKey(): string {
    // Trova la chiave con più richieste rimanenti
    const bestKey = this.usageStats.reduce((best, current) => 
      current.requestsRemaining > best.requestsRemaining ? current : best
    );

    this.currentKeyIndex = bestKey.keyIndex;
    return API_KEYS[this.currentKeyIndex];
  }

  private updateUsageStats(requestsRemaining: number, requestsUsed: number) {
    const stats = this.usageStats[this.currentKeyIndex];
    stats.requestsRemaining = requestsRemaining;
    stats.requestsUsed = requestsUsed;
    stats.lastRequest = Date.now();
    
    this.saveUsageStats();

    // Aggiorna il sistema di emergenza
    emergencyApiManager.updateApiUsage(requestsRemaining, requestsUsed);
    
    // Controlla se entrare in modalità emergenza
    const totalRemaining = this.usageStats.reduce((sum, stat) => sum + stat.requestsRemaining, 0);
    this.isEmergencyMode = totalRemaining < 50; // Meno di 50 richieste rimanenti

    console.log(`📊 API Usage - Chiave ${this.currentKeyIndex + 1}: ${requestsUsed}/${OPTIMIZATION_CONFIG.MONTHLY_LIMIT} usate, ${requestsRemaining} rimanenti`);
    
    if (this.isEmergencyMode) {
      console.warn('🚨 MODALITÀ EMERGENZA ATTIVATA - Richieste limitate');
    }
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

  private setCache<T>(key: string, data: T, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private async makeApiRequest(endpoint: string, params: any = {}): Promise<any> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Controlla cache prima
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit per ${endpoint}`);
      return cached;
    }

    // Controlla sistema di emergenza
    if (!emergencyApiManager.canMakeApiRequest()) {
      const timeUntilNext = emergencyApiManager.getTimeUntilNextRequest();
      const hoursUntilNext = Math.ceil(timeUntilNext / (60 * 60 * 1000));
      throw new Error(`EMERGENCY_MODE: Prossima richiesta consentita tra ${hoursUntilNext} ore`);
    }

    // Seleziona la migliore chiave API
    const apiKey = this.selectBestApiKey();
    
    // Costruisci URL
    const queryParams = new URLSearchParams({
      apiKey,
      ...params
    });
    
    const url = `${BASE_URL}${endpoint}?${queryParams}`;

    try {
      const response = await fetch(url);
      
      // Aggiorna statistiche utilizzo
      const remaining = parseInt(response.headers.get('x-requests-remaining') || '0');
      const used = parseInt(response.headers.get('x-requests-used') || '0');
      this.updateUsageStats(remaining, used);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('🔑 Chiave API non valida o limite raggiunto');
          // Prova con la prossima chiave
          this.currentKeyIndex = (this.currentKeyIndex + 1) % API_KEYS.length;
          throw new Error('API_LIMIT_REACHED');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Salva in cache
      const ttl = endpoint.includes('/odds') 
        ? OPTIMIZATION_CONFIG.CACHE_TTL.QUOTES 
        : OPTIMIZATION_CONFIG.CACHE_TTL.SPORTS;
      
      this.setCache(cacheKey, data, ttl);
      
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
      });
    } catch (error) {
      console.error(`Errore nel recupero quote per ${sport}:`, error);
      return [];
    }
  }

  async getMultipleSportsOptimized(): Promise<OddsApiEvent[]> {
    const allEvents: OddsApiEvent[] = [];
    const now = Date.now();

    // Determina quali sport aggiornare in base alla priorità e al tempo trascorso
    const sportsToUpdate = this.getSportsToUpdate(now);

    console.log(`🔄 Aggiornamento programmato: ${sportsToUpdate.length} sport da aggiornare`);

    for (const sport of sportsToUpdate) {
      try {
        const events = await this.getOddsOptimized(sport);
        if (events.length > 0) {
          allEvents.push(...events);
          this.lastUpdateTimes.set(sport, now);
          console.log(`✅ ${sport}: ${events.length} eventi aggiornati`);
        }

        // Pausa tra richieste per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
             } catch (error) {
         console.error(`❌ Errore per ${sport}:`, error as Error);
        
                 if ((error as Error).message === 'API_LIMIT_REACHED') {
          console.log('🛑 Limite API raggiunto, interrompo aggiornamenti');
          break;
        }
      }
    }

    return allEvents;
  }

  private getSportsToUpdate(now: number): string[] {
    const sportsToUpdate: string[] = [];
    
    // Determina intervallo in base alla modalità
    const getInterval = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
      if (this.isEmergencyMode) {
        return OPTIMIZATION_CONFIG.UPDATE_INTERVALS.EMERGENCY;
      }
      
      switch (priority) {
        case 'HIGH': return OPTIMIZATION_CONFIG.UPDATE_INTERVALS.HIGH_PRIORITY;
        case 'MEDIUM': return OPTIMIZATION_CONFIG.UPDATE_INTERVALS.MEDIUM_PRIORITY;
        case 'LOW': return OPTIMIZATION_CONFIG.UPDATE_INTERVALS.LOW_PRIORITY;
      }
    };

    // Controlla sport ad alta priorità
    for (const sport of SPORT_PRIORITIES.HIGH) {
      const lastUpdate = this.lastUpdateTimes.get(sport) || 0;
      const interval = getInterval('HIGH') * 60 * 1000; // Converti in ms
      
      if (now - lastUpdate >= interval) {
        sportsToUpdate.push(sport);
      }
    }

    // Se non siamo in modalità emergenza, aggiungi sport a media priorità
    if (!this.isEmergencyMode) {
      for (const sport of SPORT_PRIORITIES.MEDIUM) {
        const lastUpdate = this.lastUpdateTimes.get(sport) || 0;
        const interval = getInterval('MEDIUM') * 60 * 1000;
        
        if (now - lastUpdate >= interval) {
          sportsToUpdate.push(sport);
        }
      }
    }

    // Solo se abbiamo molte richieste rimanenti, aggiungi sport a bassa priorità
    const totalRemaining = this.usageStats.reduce((sum, stat) => sum + stat.requestsRemaining, 0);
    if (totalRemaining > 100) {
      for (const sport of SPORT_PRIORITIES.LOW) {
        const lastUpdate = this.lastUpdateTimes.get(sport) || 0;
        const interval = getInterval('LOW') * 60 * 1000;
        
        if (now - lastUpdate >= interval) {
          sportsToUpdate.push(sport);
        }
      }
    }

    return sportsToUpdate;
  }

  private startScheduledUpdates() {
    // Aggiornamento ogni 15 minuti
    setInterval(() => {
      this.getMultipleSportsOptimized().catch(console.error);
    }, 15 * 60 * 1000);

    // Primo aggiornamento dopo 5 secondi
    setTimeout(() => {
      this.getMultipleSportsOptimized().catch(console.error);
    }, 5000);
  }

  async getApiStatus() {
    const cacheKey = 'api_status';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${BASE_URL}/sports/?apiKey=${this.getCurrentApiKey()}`);
      
      const status = {
        isActive: response.ok,
        currentKey: this.currentKeyIndex + 1,
        totalKeys: API_KEYS.length,
        usageStats: this.usageStats,
        isEmergencyMode: this.isEmergencyMode,
        cacheSize: this.cache.size
      };

      this.setCache(cacheKey, status, OPTIMIZATION_CONFIG.CACHE_TTL.STATUS);
      return status;
         } catch (error) {
       return {
         isActive: false,
         error: (error as Error).message,
        currentKey: this.currentKeyIndex + 1,
        totalKeys: API_KEYS.length,
        usageStats: this.usageStats,
        isEmergencyMode: this.isEmergencyMode,
        cacheSize: this.cache.size
      };
    }
  }

  // Metodo per forzare aggiornamento di uno sport specifico
  async forceUpdateSport(sport: string): Promise<OddsApiEvent[]> {
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

  // Ottieni statistiche dettagliate
  getDetailedStats() {
    const totalUsed = this.usageStats.reduce((sum, stat) => sum + stat.requestsUsed, 0);
    const totalRemaining = this.usageStats.reduce((sum, stat) => sum + stat.requestsRemaining, 0);
    const totalLimit = API_KEYS.length * OPTIMIZATION_CONFIG.MONTHLY_LIMIT;

    return {
      totalRequests: {
        used: totalUsed,
        remaining: totalRemaining,
        limit: totalLimit,
        percentage: Math.round((totalUsed / totalLimit) * 100)
      },
      keyStats: this.usageStats,
      cacheStats: {
        size: this.cache.size,
        hitRate: 0 // TODO: implementare tracking hit rate
      },
      systemStatus: {
        isEmergencyMode: this.isEmergencyMode,
        currentKey: this.currentKeyIndex + 1,
        lastUpdates: Object.fromEntries(this.lastUpdateTimes)
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
  getMultipleSportsOptimized: () => getOptimizedOddsApi().getMultipleSportsOptimized(),
  forceUpdateSport: (sport: string) => getOptimizedOddsApi().forceUpdateSport(sport),
  cleanExpiredCache: () => getOptimizedOddsApi().cleanExpiredCache(),
  getDetailedStats: () => getOptimizedOddsApi().getDetailedStats()
}; 