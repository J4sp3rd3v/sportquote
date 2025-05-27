// Sistema di gestione API giornaliera - 1 richiesta per sport al giorno
import { emergencyApiManager } from './emergencyApiManager';

export interface DailyApiState {
  lastUpdate: string; // Data ultimo aggiornamento (YYYY-MM-DD)
  lastUpdateTime: number; // Timestamp ultimo aggiornamento
  requestsToday: number; // Richieste fatte oggi
  requestsThisMonth: number; // Richieste totali del mese
  sportsUpdatedToday: string[]; // Sport aggiornati oggi
  nextUpdateTime: number; // Prossimo aggiornamento consentito
  dailyQuota: number; // Quota giornaliera massima
  monthlyLimit: number; // Limite mensile
}

export interface SportUpdateInfo {
  sport: string;
  lastUpdate: number;
  nextAllowedUpdate: number;
  canUpdate: boolean;
  requestsUsed: number;
}

export class DailyApiManager {
  private static instance: DailyApiManager;
  private state: DailyApiState;
  
  // Configurazione API
  private readonly API_KEY = '4815fd45ad14363aea162bef71a91b06'; // Nuova chiave API
  private readonly DAILY_QUOTA = 6; // Massimo 6 richieste al giorno (1 per sport)
  private readonly MONTHLY_LIMIT = 500; // Limite mensile
  private readonly HOURS_BETWEEN_UPDATES = 24; // 24 ore tra aggiornamenti
  
  // Sport supportati
  private readonly SUPPORTED_SPORTS = [
    'soccer_italy_serie_a',
    'soccer_epl', 
    'soccer_uefa_champs_league',
    'basketball_nba',
    'tennis_atp_french_open',
    'americanfootball_nfl'
  ];

  constructor() {
    this.state = this.loadState();
    this.checkDailyReset();
  }

  static getInstance(): DailyApiManager {
    if (!DailyApiManager.instance) {
      DailyApiManager.instance = new DailyApiManager();
    }
    return DailyApiManager.instance;
  }

  private loadState(): DailyApiState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailyApiState');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.warn('Errore nel caricamento stato API giornaliera:', error);
        }
      }
    }

    return {
      lastUpdate: '',
      lastUpdateTime: 0,
      requestsToday: 0,
      requestsThisMonth: 0,
      sportsUpdatedToday: [],
      nextUpdateTime: 0,
      dailyQuota: this.DAILY_QUOTA,
      monthlyLimit: this.MONTHLY_LIMIT
    };
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailyApiState', JSON.stringify(this.state));
    }
  }

  private checkDailyReset(): void {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (this.state.lastUpdate !== today) {
      console.log(`🔄 Reset giornaliero API - Nuovo giorno: ${today}`);
      
      // Reset contatori giornalieri
      this.state.lastUpdate = today;
      this.state.requestsToday = 0;
      this.state.sportsUpdatedToday = [];
      this.state.nextUpdateTime = 0;
      
      this.saveState();
    }
  }

  private checkMonthlyReset(): void {
    const currentMonth = new Date().getMonth();
    const lastUpdateMonth = new Date(this.state.lastUpdateTime).getMonth();
    
    if (currentMonth !== lastUpdateMonth) {
      console.log(`🔄 Reset mensile API - Nuovo mese`);
      this.state.requestsThisMonth = 0;
      this.saveState();
    }
  }

  getApiKey(): string {
    return this.API_KEY;
  }

  canMakeRequest(): boolean {
    this.checkDailyReset();
    this.checkMonthlyReset();
    
    // Controlla limiti giornalieri
    if (this.state.requestsToday >= this.DAILY_QUOTA) {
      console.warn(`🚫 Quota giornaliera esaurita: ${this.state.requestsToday}/${this.DAILY_QUOTA}`);
      return false;
    }
    
    // Controlla limiti mensili
    if (this.state.requestsThisMonth >= this.MONTHLY_LIMIT) {
      console.error(`🚫 Limite mensile raggiunto: ${this.state.requestsThisMonth}/${this.MONTHLY_LIMIT}`);
      return false;
    }
    
    // Controlla sistema di emergenza
    if (!emergencyApiManager.canMakeApiRequest()) {
      console.warn('🚨 Sistema di emergenza attivo - richiesta bloccata');
      return false;
    }
    
    return true;
  }

  canUpdateSport(sport: string): boolean {
    this.checkDailyReset();
    
    // Controlla se lo sport è già stato aggiornato oggi
    if (this.state.sportsUpdatedToday.includes(sport)) {
      console.log(`⏰ Sport ${sport} già aggiornato oggi`);
      return false;
    }
    
    return this.canMakeRequest();
  }

  recordRequest(sport: string, remainingRequests?: number, usedRequests?: number): void {
    const now = Date.now();
    
    this.state.requestsToday++;
    this.state.requestsThisMonth++;
    this.state.lastUpdateTime = now;
    this.state.sportsUpdatedToday.push(sport);
    
    // Aggiorna sistema di emergenza se abbiamo i dati
    if (remainingRequests !== undefined && usedRequests !== undefined) {
      emergencyApiManager.updateApiUsage(remainingRequests, usedRequests);
      this.state.requestsThisMonth = usedRequests; // Sincronizza con dati reali
    }
    
    console.log(`📊 Richiesta registrata per ${sport}:`);
    console.log(`• Oggi: ${this.state.requestsToday}/${this.DAILY_QUOTA}`);
    console.log(`• Mese: ${this.state.requestsThisMonth}/${this.MONTHLY_LIMIT}`);
    console.log(`• Orario: ${new Date(now).toLocaleString('it-IT')}`);
    
    this.saveState();
  }

  getSportsUpdateInfo(): SportUpdateInfo[] {
    this.checkDailyReset();
    
    return this.SUPPORTED_SPORTS.map(sport => {
      const wasUpdatedToday = this.state.sportsUpdatedToday.includes(sport);
      const canUpdate = this.canUpdateSport(sport);
      
      return {
        sport,
        lastUpdate: wasUpdatedToday ? this.state.lastUpdateTime : 0,
        nextAllowedUpdate: wasUpdatedToday ? 
          this.state.lastUpdateTime + (this.HOURS_BETWEEN_UPDATES * 60 * 60 * 1000) : 
          Date.now(),
        canUpdate,
        requestsUsed: this.state.requestsThisMonth
      };
    });
  }

  getNextSportToUpdate(): string | null {
    const sportsInfo = this.getSportsUpdateInfo();
    const availableSports = sportsInfo.filter(info => info.canUpdate);
    
    if (availableSports.length === 0) {
      return null;
    }
    
    // Priorità: Serie A > Premier League > Champions > NBA > Tennis > NFL
    const priorities = [
      'soccer_italy_serie_a',
      'soccer_epl',
      'soccer_uefa_champs_league', 
      'basketball_nba',
      'tennis_atp_french_open',
      'americanfootball_nfl'
    ];
    
    for (const sport of priorities) {
      if (availableSports.find(info => info.sport === sport)) {
        return sport;
      }
    }
    
    return availableSports[0].sport;
  }

  getDailyStats() {
    this.checkDailyReset();
    this.checkMonthlyReset();
    
    const sportsInfo = this.getSportsUpdateInfo();
    const updatedToday = sportsInfo.filter(info => info.lastUpdate > 0).length;
    const remainingToday = this.DAILY_QUOTA - this.state.requestsToday;
    const remainingThisMonth = this.MONTHLY_LIMIT - this.state.requestsThisMonth;
    
    return {
      today: {
        used: this.state.requestsToday,
        quota: this.DAILY_QUOTA,
        remaining: remainingToday,
        percentage: Math.round((this.state.requestsToday / this.DAILY_QUOTA) * 100)
      },
      month: {
        used: this.state.requestsThisMonth,
        limit: this.MONTHLY_LIMIT,
        remaining: remainingThisMonth,
        percentage: Math.round((this.state.requestsThisMonth / this.MONTHLY_LIMIT) * 100)
      },
      sports: {
        total: this.SUPPORTED_SPORTS.length,
        updatedToday,
        remaining: this.SUPPORTED_SPORTS.length - updatedToday
      },
      lastUpdate: this.state.lastUpdateTime ? {
        timestamp: this.state.lastUpdateTime,
        date: new Date(this.state.lastUpdateTime).toLocaleDateString('it-IT'),
        time: new Date(this.state.lastUpdateTime).toLocaleTimeString('it-IT'),
        relative: this.getRelativeTime(this.state.lastUpdateTime)
      } : null,
      nextUpdate: this.getNextUpdateInfo()
    };
  }

  private getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m fa`;
    }
    return `${minutes}m fa`;
  }

  private getNextUpdateInfo() {
    const nextSport = this.getNextSportToUpdate();
    
    if (!nextSport) {
      // Calcola quando sarà possibile il prossimo aggiornamento
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      return {
        available: false,
        nextSport: null,
        nextTime: tomorrow.getTime(),
        message: 'Prossimo aggiornamento domani'
      };
    }
    
    return {
      available: true,
      nextSport,
      nextTime: Date.now(),
      message: `Pronto per aggiornare ${this.getSportDisplayName(nextSport)}`
    };
  }

  private getSportDisplayName(sport: string): string {
    const names: Record<string, string> = {
      'soccer_italy_serie_a': 'Serie A',
      'soccer_epl': 'Premier League',
      'soccer_uefa_champs_league': 'Champions League',
      'basketball_nba': 'NBA',
      'tennis_atp_french_open': 'ATP Tennis',
      'americanfootball_nfl': 'NFL'
    };
    
    return names[sport] || sport;
  }

  // Metodo per forzare reset (solo per testing)
  forceReset(): void {
    console.log('🔄 Reset forzato sistema API giornaliera');
    this.state = {
      lastUpdate: '',
      lastUpdateTime: 0,
      requestsToday: 0,
      requestsThisMonth: 0,
      sportsUpdatedToday: [],
      nextUpdateTime: 0,
      dailyQuota: this.DAILY_QUOTA,
      monthlyLimit: this.MONTHLY_LIMIT
    };
    this.saveState();
  }

  // Metodo per simulare aggiornamento (testing)
  simulateUpdate(sport: string): void {
    if (this.canUpdateSport(sport)) {
      this.recordRequest(sport, 500 - this.state.requestsThisMonth - 1, this.state.requestsThisMonth + 1);
      console.log(`✅ Simulato aggiornamento per ${sport}`);
    } else {
      console.log(`❌ Impossibile aggiornare ${sport}`);
    }
  }
}

// Istanza singleton
export const dailyApiManager = DailyApiManager.getInstance(); 