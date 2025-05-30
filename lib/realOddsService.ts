// Servizio Quote Reali - SOLO DATI VERIFICATI
// Nessun fallback su dati falsi - Solo partite e quote reali
// AGGIORNAMENTO GIORNALIERO AUTOMATICO

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
  
  // API Key reale per The Odds API - AGGIORNATA
  private readonly API_KEY = '795ce1cc44a461d5918138561b1134bc';
  private readonly BASE_URL = 'https://api.the-odds-api.com/v4';
  
  // Limite richieste: 500/mese per piano gratuito
  private readonly MONTHLY_LIMIT = 500;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ore per aggiornamento giornaliero
  private readonly DAILY_UPDATE_HOUR = 12; // Aggiornamento alle 12:00
  
  private cache = new Map<string, { data: any; timestamp: number; lastRealUpdate: number }>();
  private requestCount = 0;
  private lastRealUpdate: number = 0;
  private lastDailyUpdate: string = '';
  
  constructor() {
    this.loadRequestCount();
    this.loadLastDailyUpdate();
    this.loadCacheFromStorage();
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

  private loadLastDailyUpdate(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastDailyUpdate');
      if (saved) {
        this.lastDailyUpdate = saved;
      }
    }
  }

  private saveLastDailyUpdate(): void {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      this.lastDailyUpdate = today;
      localStorage.setItem('lastDailyUpdate', today);
    }
  }

  private shouldUpdateToday(): boolean {
    const today = new Date().toDateString();
    const now = new Date();
    const currentHour = now.getHours();
    
    console.log(`🕐 Debug aggiornamento: Ora corrente: ${currentHour}:${now.getMinutes()}, Ora aggiornamento: ${this.DAILY_UPDATE_HOUR}:00`);
    console.log(`📅 Debug aggiornamento: Oggi: ${today}, Ultimo aggiornamento: ${this.lastDailyUpdate}`);
    
    // Se già aggiornato oggi, non aggiornare di nuovo
    if (this.lastDailyUpdate === today) {
      console.log(`✅ Già aggiornato oggi (${this.lastDailyUpdate})`);
      return false;
    }
    
    // Se non è ancora l'ora dell'aggiornamento (12:00), non aggiornare
    if (currentHour < this.DAILY_UPDATE_HOUR) {
      console.log(`⏰ Non è ancora ora di aggiornare (${currentHour} < ${this.DAILY_UPDATE_HOUR})`);
      return false;
    }
    
    console.log(`🔄 È ora di aggiornare! (${currentHour} >= ${this.DAILY_UPDATE_HOUR} e non aggiornato oggi)`);
    return true;
  }

  private canMakeRequest(): boolean {
    return this.requestCount < this.MONTHLY_LIMIT;
  }

  private async makeApiRequest(endpoint: string, forceUpdate: boolean = false): Promise<any> {
    const cacheKey = endpoint;
    
    // Controlla cache solo se non è un aggiornamento forzato
    if (!forceUpdate) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log(`📦 Cache hit per ${endpoint} (valida per ${Math.round((this.CACHE_DURATION - (Date.now() - cached.timestamp)) / (1000 * 60 * 60))} ore)`);
        return cached.data;
      }
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
      
      // Salva in cache con timestamp reale aggiornamento
      const realUpdateTime = Date.now();
      this.lastRealUpdate = realUpdateTime;
      
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        lastRealUpdate: realUpdateTime
      });
      
      // Salva cache persistente
      this.saveCacheToStorage();
      
      console.log(`✅ Dati reali ricevuti: ${Array.isArray(data) ? data.length : 1} elementi`);
      console.log(`📊 Richieste utilizzate: ${this.requestCount}/${this.MONTHLY_LIMIT}`);
      console.log(`💾 Cache salvata: ${this.cache.size} elementi totali`);
      
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
  async getRealMatchesForSport(sportKey: string, forceUpdate: boolean = false): Promise<Match[]> {
    try {
      const endpoint = `/sports/${sportKey}/odds?apiKey=${this.API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`;
      const apiData: RealApiResponse[] = await this.makeApiRequest(endpoint, forceUpdate);
      
      if (!Array.isArray(apiData) || apiData.length === 0) {
        console.warn(`⚠️ Nessuna partita reale trovata per ${sportKey}`);
        return [];
      }

      const matches = this.convertApiDataToMatches(apiData, sportKey);

      console.log(`✅ ${matches.length} partite reali caricate per ${sportKey}`);
      
      return matches;
      
    } catch (error) {
      console.error(`❌ Errore caricamento partite reali per ${sportKey}:`, error);
      return [];
    }
  }

  // Ottieni tutte le partite reali per tutti i campionati attivi
  async getAllRealMatches(forceUpdate: boolean = false): Promise<Match[]> {
    try {
      console.log('🔄 Controllo aggiornamento giornaliero...');
      
      // Controlla se è necessario aggiornare oggi
      const needsUpdate = forceUpdate || this.shouldUpdateToday();
      
      if (!needsUpdate) {
        console.log('📅 Aggiornamento giornaliero già effettuato o non ancora necessario');
        
        // Prova a restituire dati dalla cache
        const cachedData = this.getCachedMatches();
        if (cachedData.length > 0) {
          console.log(`📦 Restituisco ${cachedData.length} partite dalla cache`);
          return cachedData;
        } else {
          console.log('📦 Cache vuota, ma non è ancora ora di aggiornare. Restituisco array vuoto.');
          return [];
        }
      }
      
      console.log('🔄 Avvio aggiornamento giornaliero delle partite reali...');
      
      const availableSports = await this.getAvailableSports();
      
      if (availableSports.length === 0) {
        throw new Error('NESSUNO_SPORT_DISPONIBILE');
      }

      const allMatches: Match[] = [];
      
      // Carica partite per ogni sport disponibile
      for (const sportKey of availableSports) {
        try {
          const matches = await this.getRealMatchesForSport(sportKey, needsUpdate);
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

      // Marca come aggiornato oggi solo se abbiamo ottenuto dati
      this.saveLastDailyUpdate();
      
      console.log(`✅ Aggiornamento giornaliero completato: ${allMatches.length} partite reali caricate`);
      console.log(`📊 Richieste utilizzate: ${this.requestCount}/${this.MONTHLY_LIMIT}`);
      
      return allMatches;
      
    } catch (error) {
      console.error('❌ Errore aggiornamento giornaliero:', error);
      
      // In caso di errore, prova a restituire dati dalla cache se disponibili
      const cachedData = this.getCachedMatches();
      if (cachedData.length > 0) {
        console.log(`📦 Errore API, restituisco ${cachedData.length} partite dalla cache`);
        return cachedData;
      }
      
      throw error;
    }
  }

  // Ottieni partite dalla cache senza fare richieste API
  private getCachedMatches(): Match[] {
    const allMatches: Match[] = [];
    
    Array.from(this.cache.entries()).forEach(([key, cached]) => {
      if (key.includes('/odds?') && Array.isArray(cached.data)) {
        // Riconverti i dati dalla cache
        const sportKey = key.split('/')[2];
        const matches = this.convertApiDataToMatches(cached.data, sportKey);
        allMatches.push(...matches);
      }
    });
    
    return allMatches;
  }

  // Funzione pubblica per ottenere sempre i dati dalla cache (per caricamento iniziale)
  getCachedMatchesOnly(): Match[] {
    console.log(`🔍 getCachedMatchesOnly: cache.size=${this.cache.size}, window=${typeof window !== 'undefined'}`);
    
    // Assicurati che la cache sia caricata dal localStorage
    if (typeof window !== 'undefined') {
      // Forza ricaricamento dal localStorage ogni volta
      this.loadCacheFromStorage();
    }
    
    const cachedMatches = this.getCachedMatches();
    console.log(`📦 Caricamento dalla cache: ${cachedMatches.length} partite disponibili`);
    
    return cachedMatches;
  }

  // Converte dati API in formato Match (estratto per riuso)
  private convertApiDataToMatches(apiData: RealApiResponse[], sportKey: string): Match[] {
    const now = new Date();
    const upcomingMatches = apiData.filter(match => {
      const matchDate = new Date(match.commence_time);
      return matchDate > now;
    });

    return upcomingMatches.map(apiMatch => {
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
  }

  // Ottieni statistiche del servizio
  getServiceStats() {
    const now = new Date();
    const today = now.toDateString();
    const currentHour = now.getHours();
    
    // Calcola prossimo aggiornamento
    let nextUpdate = new Date();
    if (currentHour >= this.DAILY_UPDATE_HOUR) {
      // Se è già passata l'ora di oggi, prossimo aggiornamento domani
      nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    nextUpdate.setHours(this.DAILY_UPDATE_HOUR, 0, 0, 0);
    
    return {
      requestsUsed: this.requestCount,
      requestsRemaining: this.MONTHLY_LIMIT - this.requestCount,
      monthlyLimit: this.MONTHLY_LIMIT,
      cacheSize: this.cache.size,
      canMakeRequests: this.canMakeRequest(),
      lastDailyUpdate: this.lastDailyUpdate || 'Mai',
      updatedToday: this.lastDailyUpdate === today,
      nextUpdateTime: nextUpdate,
      shouldUpdateNow: this.shouldUpdateToday(),
      dailyUpdateHour: this.DAILY_UPDATE_HOUR
    };
  }

  // Ottieni timestamp dell'ultimo aggiornamento reale
  getLastRealUpdate(): Date | null {
    if (this.lastRealUpdate === 0) return null;
    return new Date(this.lastRealUpdate);
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

  // Aggiornamento forzato (per pulsante manuale)
  async forceUpdate(): Promise<Match[]> {
    console.log('🔄 Aggiornamento forzato richiesto...');
    return this.getAllRealMatches(true);
  }

  // Carica cache dal localStorage
  private loadCacheFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        console.log('🔄 Tentativo caricamento cache dal localStorage...');
        
        const savedCache = localStorage.getItem('realOddsCache');
        const savedLastUpdate = localStorage.getItem('realOddsLastUpdate');
        
        console.log(`📦 localStorage check: cache=${!!savedCache}, lastUpdate=${!!savedLastUpdate}`);
        
        if (savedCache && savedLastUpdate) {
          const cacheData = JSON.parse(savedCache);
          this.lastRealUpdate = parseInt(savedLastUpdate);
          
          // Pulisci cache esistente
          this.cache.clear();
          
          // Ricostruisci la cache Map
          Object.entries(cacheData).forEach(([key, value]: [string, any]) => {
            this.cache.set(key, value);
          });
          
          console.log(`✅ Cache caricata dal localStorage: ${this.cache.size} elementi`);
          console.log(`📅 Ultimo aggiornamento: ${new Date(this.lastRealUpdate).toLocaleString('it-IT')}`);
        } else {
          console.log('⚠️ Nessuna cache trovata nel localStorage');
        }
      } catch (error) {
        console.warn('❌ Errore caricamento cache dal localStorage:', error);
      }
    } else {
      console.log('⚠️ Window non disponibile per localStorage');
    }
  }

  // Salva cache nel localStorage
  private saveCacheToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const cacheObject = Object.fromEntries(this.cache);
        localStorage.setItem('realOddsCache', JSON.stringify(cacheObject));
        localStorage.setItem('realOddsLastUpdate', this.lastRealUpdate.toString());
        console.log(`💾 Cache salvata nel localStorage: ${this.cache.size} elementi`);
      } catch (error) {
        console.warn('⚠️ Errore salvataggio cache nel localStorage:', error);
      }
    }
  }

  // Verifica se abbiamo dati validi in cache
  hasValidCache(): boolean {
    if (this.cache.size === 0) {
      // Prova a caricare dal localStorage
      this.loadCacheFromStorage();
    }
    
    // Controlla se ci sono dati di partite in cache
    const hasMatchData = Array.from(this.cache.keys()).some(key => key.includes('/odds?'));
    
    // Controlla se i dati non sono troppo vecchi (più di 48 ore)
    const now = Date.now();
    const maxAge = 48 * 60 * 60 * 1000; // 48 ore
    const isNotTooOld = this.lastRealUpdate > 0 && (now - this.lastRealUpdate) < maxAge;
    
    console.log(`🔍 Verifica cache: hasMatchData=${hasMatchData}, isNotTooOld=${isNotTooOld}, cacheSize=${this.cache.size}`);
    
    return hasMatchData && isNotTooOld;
  }
}

// Istanza singleton
export const realOddsService = RealOddsService.getInstance(); 