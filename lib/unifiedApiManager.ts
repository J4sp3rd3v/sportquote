// Sistema Unificato di Gestione API - Versione Ottimizzata 2025
// Sostituisce tutti i sistemi API esistenti con gestione unificata

export interface ApiState {
  lastUpdate: string; // YYYY-MM-DD
  lastUpdateTime: number;
  requestsToday: number;
  requestsThisMonth: number;
  sportsUpdatedToday: string[];
  dailyQuota: number;
  monthlyLimit: number;
  currentApiKey: string;
}

export interface SportConfig {
  key: string;
  name: string;
  priority: number;
  category: string;
  enabled: boolean;
}

export class UnifiedApiManager {
  private static instance: UnifiedApiManager;
  private state: ApiState;
  
  // Configurazione API unificata
  private readonly API_KEY = '4815fd45ad14363aea162bef71a91b06';
  private readonly BASE_URL = 'https://api.the-odds-api.com/v4';
  private readonly DAILY_QUOTA = 6; // 1 richiesta per sport al giorno
  private readonly MONTHLY_LIMIT = 500;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 ore

  // Sport configurati con priorità
  private readonly SPORTS_CONFIG: SportConfig[] = [
    { key: 'soccer_italy_serie_a', name: 'Serie A', priority: 1, category: 'calcio', enabled: true },
    { key: 'soccer_epl', name: 'Premier League', priority: 2, category: 'calcio', enabled: true },
    { key: 'soccer_uefa_champs_league', name: 'Champions League', priority: 3, category: 'calcio', enabled: true },
    { key: 'basketball_nba', name: 'NBA', priority: 4, category: 'basket', enabled: true },
    { key: 'tennis_atp_french_open', name: 'ATP Tennis', priority: 5, category: 'tennis', enabled: true },
    { key: 'americanfootball_nfl', name: 'NFL', priority: 6, category: 'football-americano', enabled: true }
  ];

  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor() {
    this.state = this.loadState();
    this.checkDailyReset();
  }

  static getInstance(): UnifiedApiManager {
    if (!UnifiedApiManager.instance) {
      UnifiedApiManager.instance = new UnifiedApiManager();
    }
    return UnifiedApiManager.instance;
  }

  private loadState(): ApiState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unifiedApiState');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.warn('Errore caricamento stato API:', error);
        }
      }
    }

    return {
      lastUpdate: '',
      lastUpdateTime: 0,
      requestsToday: 0,
      requestsThisMonth: 0,
      sportsUpdatedToday: [],
      dailyQuota: this.DAILY_QUOTA,
      monthlyLimit: this.MONTHLY_LIMIT,
      currentApiKey: this.API_KEY
    };
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unifiedApiState', JSON.stringify(this.state));
    }
  }

  private checkDailyReset(): void {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.state.lastUpdate !== today) {
      console.log(`🔄 Reset giornaliero API - ${today}`);
      
      this.state.lastUpdate = today;
      this.state.requestsToday = 0;
      this.state.sportsUpdatedToday = [];
      
      // Pulisci cache vecchia
      this.cleanExpiredCache();
      
      this.saveState();
    }
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Verifica se possiamo fare una richiesta
  canMakeRequest(): boolean {
    this.checkDailyReset();
    
    if (this.state.requestsToday >= this.DAILY_QUOTA) {
      console.warn(`🚫 Quota giornaliera esaurita: ${this.state.requestsToday}/${this.DAILY_QUOTA}`);
      return false;
    }
    
    if (this.state.requestsThisMonth >= this.MONTHLY_LIMIT) {
      console.error(`🚫 Limite mensile raggiunto: ${this.state.requestsThisMonth}/${this.MONTHLY_LIMIT}`);
      return false;
    }
    
    return true;
  }

  // Verifica se uno sport può essere aggiornato
  canUpdateSport(sportKey: string): boolean {
    this.checkDailyReset();
    
    if (this.state.sportsUpdatedToday.includes(sportKey)) {
      console.log(`⏰ Sport ${sportKey} già aggiornato oggi`);
      return false;
    }
    
    return this.canMakeRequest();
  }

  // Ottieni il prossimo sport da aggiornare
  getNextSportToUpdate(): SportConfig | null {
    const availableSports = this.SPORTS_CONFIG.filter(sport => 
      sport.enabled && this.canUpdateSport(sport.key)
    );
    
    if (availableSports.length === 0) {
      return null;
    }
    
    // Ritorna lo sport con priorità più alta
    return availableSports.sort((a, b) => a.priority - b.priority)[0];
  }

  // Esegui richiesta API con cache
  async makeApiRequest(endpoint: string, params: any = {}, sportKey?: string): Promise<any> {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    
    // Controlla cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`📦 Cache hit per ${endpoint}`);
      return cached.data;
    }

    // Verifica limiti
    if (!this.canMakeRequest()) {
      throw new Error('DAILY_LIMIT_REACHED');
    }

    if (sportKey && !this.canUpdateSport(sportKey)) {
      throw new Error(`SPORT_ALREADY_UPDATED: ${sportKey}`);
    }

    // Costruisci URL
    const queryParams = new URLSearchParams({
      apiKey: this.API_KEY,
      ...params
    });
    
    const url = `${this.BASE_URL}${endpoint}?${queryParams}`;

    try {
      console.log(`🔄 Richiesta API: ${endpoint} ${sportKey ? `(${sportKey})` : ''}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API_UNAUTHORIZED');
        }
        throw new Error(`HTTP_${response.status}`);
      }

      const data = await response.json();
      
      // Aggiorna contatori
      this.recordRequest(sportKey);
      
      // Salva in cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: this.CACHE_TTL
      });
      
      return data;
      
    } catch (error) {
      console.error(`❌ Errore API ${endpoint}:`, error);
      throw error;
    }
  }

  // Registra una richiesta
  private recordRequest(sportKey?: string): void {
    const now = Date.now();
    
    this.state.requestsToday++;
    this.state.requestsThisMonth++;
    this.state.lastUpdateTime = now;
    
    if (sportKey) {
      this.state.sportsUpdatedToday.push(sportKey);
    }
    
    console.log(`📊 Richiesta registrata:`);
    console.log(`• Oggi: ${this.state.requestsToday}/${this.DAILY_QUOTA}`);
    console.log(`• Mese: ${this.state.requestsThisMonth}/${this.MONTHLY_LIMIT}`);
    
    this.saveState();
  }

  // Ottieni quote per uno sport
  async getSportOdds(sportKey: string): Promise<any> {
    return this.makeApiRequest(
      `/sports/${sportKey}/odds`,
      {
        regions: 'eu',
        markets: 'h2h',
        oddsFormat: 'decimal'
      },
      sportKey
    );
  }

  // Ottieni lista sport
  async getSports(): Promise<any> {
    return this.makeApiRequest('/sports');
  }

  // Ottieni statistiche dettagliate
  getDetailedStats() {
    this.checkDailyReset();
    
    const today = this.state;
    const remainingToday = this.DAILY_QUOTA - today.requestsToday;
    const remainingMonth = this.MONTHLY_LIMIT - today.requestsThisMonth;
    
    return {
      daily: {
        used: today.requestsToday,
        quota: this.DAILY_QUOTA,
        remaining: remainingToday,
        percentage: Math.round((today.requestsToday / this.DAILY_QUOTA) * 100)
      },
      monthly: {
        used: today.requestsThisMonth,
        limit: this.MONTHLY_LIMIT,
        remaining: remainingMonth,
        percentage: Math.round((today.requestsThisMonth / this.MONTHLY_LIMIT) * 100)
      },
      sports: {
        total: this.SPORTS_CONFIG.length,
        updatedToday: today.sportsUpdatedToday.length,
        remaining: this.SPORTS_CONFIG.length - today.sportsUpdatedToday.length,
        nextToUpdate: this.getNextSportToUpdate()?.name || 'Nessuno'
      },
      cache: {
        size: this.cache.size,
        entries: (() => {
          const entries: any[] = [];
          this.cache.forEach((entry, key) => {
            entries.push({
              key,
              age: Math.round((Date.now() - entry.timestamp) / (60 * 1000)), // minuti
              ttl: Math.round(entry.ttl / (60 * 60 * 1000)) // ore
            });
          });
          return entries;
        })()
      },
      lastUpdate: today.lastUpdateTime ? {
        timestamp: today.lastUpdateTime,
        date: new Date(today.lastUpdateTime).toLocaleDateString('it-IT'),
        time: new Date(today.lastUpdateTime).toLocaleTimeString('it-IT')
      } : null
    };
  }

  // Reset forzato per test
  forceReset(): void {
    this.state.lastUpdate = '';
    this.state.requestsToday = 0;
    this.state.sportsUpdatedToday = [];
    this.cache.clear();
    this.saveState();
    console.log('🔄 Reset forzato completato');
  }

  // Ottieni configurazione sport
  getSportsConfig(): SportConfig[] {
    return this.SPORTS_CONFIG;
  }

  // Abilita/disabilita sport
  toggleSport(sportKey: string, enabled: boolean): void {
    const sport = this.SPORTS_CONFIG.find(s => s.key === sportKey);
    if (sport) {
      sport.enabled = enabled;
      this.saveState();
    }
  }
}

// Istanza singleton
export const unifiedApiManager = UnifiedApiManager.getInstance(); 