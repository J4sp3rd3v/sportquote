// Sistema di Aggiornamento Giornaliero Globale
// 1 aggiornamento al giorno per tutto il sito - condiviso da tutti gli utenti

import { unifiedApiManager } from './unifiedApiManager';
import { optimizedOddsService } from './optimizedOddsService';

interface GlobalDailyState {
  lastGlobalUpdate: string; // YYYY-MM-DD
  lastUpdateTime: string; // YYYY-MM-DD HH:MM:SS
  nextScheduledUpdate: string; // YYYY-MM-DD HH:MM:SS
  isSystemActive: boolean;
  dailyUpdateHour: number; // Ora dell'aggiornamento giornaliero (es. 12 per le 12:00)
  globalQuotesData: {
    [sportKey: string]: {
      lastUpdate: string;
      matches: any[];
      status: 'fresh' | 'stale' | 'updating';
    };
  };
  systemStats: {
    totalDaysActive: number;
    successfulUpdates: number;
    failedUpdates: number;
    lastError?: string;
  };
}

export class GlobalDailyUpdater {
  private static instance: GlobalDailyUpdater;
  private state: GlobalDailyState;
  private checkInterval: NodeJS.Timeout | null = null;
  
  // Configurazione globale
  private readonly DAILY_UPDATE_HOUR = 12; // 12:00 ogni giorno
  private readonly CHECK_INTERVAL = 60000; // Controlla ogni minuto
  private readonly STORAGE_KEY = 'monitorquote_global_daily';
  
  // Sport da aggiornare quotidianamente
  private readonly DAILY_SPORTS = [
    'soccer_italy_serie_a',
    'soccer_epl', 
    'soccer_uefa_champs_league',
    'basketball_nba',
    'tennis_atp_french_open',
    'americanfootball_nfl'
  ];

  private constructor() {
    this.state = this.loadGlobalState();
    this.initializeGlobalSystem();
  }

  static getInstance(): GlobalDailyUpdater {
    if (!GlobalDailyUpdater.instance) {
      GlobalDailyUpdater.instance = new GlobalDailyUpdater();
    }
    return GlobalDailyUpdater.instance;
  }

  private loadGlobalState(): GlobalDailyState {
    // In produzione questo sarebbe in un database condiviso
    // Per ora usiamo localStorage come simulazione
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.warn('[GLOBAL] Errore caricamento stato:', error);
        }
      }
    }

    return {
      lastGlobalUpdate: '',
      lastUpdateTime: '',
      nextScheduledUpdate: this.calculateNextDailyUpdate(),
      isSystemActive: false,
      dailyUpdateHour: this.DAILY_UPDATE_HOUR,
      globalQuotesData: {},
      systemStats: {
        totalDaysActive: 0,
        successfulUpdates: 0,
        failedUpdates: 0
      }
    };
  }

  private saveGlobalState(): void {
    // In produzione questo andrebbe in un database condiviso
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    }
    
    console.log(`[GLOBAL] 💾 Stato salvato - Ultimo aggiornamento: ${this.state.lastGlobalUpdate}`);
  }

  private calculateNextDailyUpdate(): string {
    const now = new Date();
    const today = new Date(now);
    today.setHours(this.DAILY_UPDATE_HOUR, 0, 0, 0);
    
    // Se l'orario di oggi è già passato, programma per domani
    if (today.getTime() <= now.getTime()) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }
    
    return today.toISOString();
  }

  private initializeGlobalSystem(): void {
    const today = new Date().toISOString().split('T')[0];
    
    // Inizializza dati globali per ogni sport se non esistono
    this.DAILY_SPORTS.forEach(sportKey => {
      if (!this.state.globalQuotesData[sportKey]) {
        this.state.globalQuotesData[sportKey] = {
          lastUpdate: '',
          matches: [],
          status: 'stale'
        };
      }
    });

    // Aggiorna il prossimo aggiornamento programmato
    this.state.nextScheduledUpdate = this.calculateNextDailyUpdate();
    
    this.saveGlobalState();
    
    console.log(`[GLOBAL] 🌐 Sistema inizializzato - Prossimo aggiornamento: ${new Date(this.state.nextScheduledUpdate).toLocaleString('it-IT')}`);
  }

  // Avvia il sistema globale
  startGlobalSystem(): void {
    if (this.state.isSystemActive) {
      console.log('[GLOBAL] 📅 Sistema già attivo');
      return;
    }

    console.log('[GLOBAL] 🚀 Avvio Sistema Globale Giornaliero');
    this.state.isSystemActive = true;
    
    // Controlla ogni minuto se è il momento dell'aggiornamento giornaliero
    this.checkInterval = setInterval(() => {
      this.checkDailyUpdate();
    }, this.CHECK_INTERVAL);

    // Controllo immediato
    this.checkDailyUpdate();
    
    this.saveGlobalState();
  }

  // Ferma il sistema globale
  stopGlobalSystem(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    this.state.isSystemActive = false;
    this.saveGlobalState();
    
    console.log('[GLOBAL] ⏹️ Sistema Globale fermato');
  }

  // Controlla se è il momento dell'aggiornamento giornaliero
  private async checkDailyUpdate(): Promise<void> {
    const now = new Date();
    const nextUpdate = new Date(this.state.nextScheduledUpdate);
    
    console.log(`[GLOBAL] ⏰ Controllo aggiornamento giornaliero - ${now.toLocaleTimeString('it-IT')}`);
    
    // Se è il momento dell'aggiornamento giornaliero
    if (now >= nextUpdate) {
      await this.executeDailyGlobalUpdate();
    }
  }

  // Esegue l'aggiornamento giornaliero globale
  private async executeDailyGlobalUpdate(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`[GLOBAL] 🔄 AGGIORNAMENTO GIORNALIERO GLOBALE - ${today}`);
    
    // Marca tutti gli sport come "updating"
    this.DAILY_SPORTS.forEach(sportKey => {
      this.state.globalQuotesData[sportKey].status = 'updating';
    });
    
    let successCount = 0;
    let failCount = 0;
    
    // Aggiorna tutti gli sport in sequenza
    for (const sportKey of this.DAILY_SPORTS) {
      try {
        console.log(`[GLOBAL] 📊 Aggiornamento ${sportKey}...`);
        
        const result = await unifiedApiManager.updateSport(sportKey);
        
        if (result.success) {
          // Salva i dati globalmente
          this.state.globalQuotesData[sportKey] = {
            lastUpdate: new Date().toISOString(),
            matches: [], // I dati verranno caricati dal servizio
            status: 'fresh'
          };
          
          successCount++;
          console.log(`[GLOBAL] ✅ ${sportKey} aggiornato: ${result.matches || 0} partite`);
        } else {
          this.state.globalQuotesData[sportKey].status = 'stale';
          failCount++;
          console.error(`[GLOBAL] ❌ Errore ${sportKey}:`, result.error);
        }
        
        // Pausa tra aggiornamenti per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        this.state.globalQuotesData[sportKey].status = 'stale';
        failCount++;
        console.error(`[GLOBAL] ❌ Errore ${sportKey}:`, error);
      }
    }
    
    // Aggiorna statistiche globali
    this.state.lastGlobalUpdate = today;
    this.state.lastUpdateTime = new Date().toISOString();
    this.state.nextScheduledUpdate = this.calculateNextDailyUpdate();
    this.state.systemStats.totalDaysActive++;
    
    if (successCount > 0) {
      this.state.systemStats.successfulUpdates++;
    }
    if (failCount > 0) {
      this.state.systemStats.failedUpdates++;
    }
    
    console.log(`[GLOBAL] 📊 Aggiornamento completato: ${successCount} successi, ${failCount} fallimenti`);
    console.log(`[GLOBAL] 📅 Prossimo aggiornamento: ${new Date(this.state.nextScheduledUpdate).toLocaleString('it-IT')}`);
    
    // Broadcast evento globale a tutti i client
    this.broadcastGlobalUpdate(successCount, failCount);
    
    this.saveGlobalState();
  }

  // Broadcast evento a tutti i client connessi
  private broadcastGlobalUpdate(successCount: number, failCount: number): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('globalDailyUpdate:completed', {
        detail: { 
          date: this.state.lastGlobalUpdate,
          time: this.state.lastUpdateTime,
          successCount,
          failCount,
          nextUpdate: this.state.nextScheduledUpdate,
          source: 'global_daily_system'
        }
      }));
    }
  }

  // Forza aggiornamento immediato (solo per admin)
  async forceDailyUpdate(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[GLOBAL] 🔄 Aggiornamento forzato richiesto');
      await this.executeDailyGlobalUpdate();
      return {
        success: true,
        message: 'Aggiornamento giornaliero forzato completato'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Errore durante aggiornamento forzato'
      };
    }
  }

  // Ottieni statistiche del sistema globale
  getGlobalDailyStats() {
    const now = new Date();
    const nextUpdate = new Date(this.state.nextScheduledUpdate);
    const timeUntilNext = nextUpdate.getTime() - now.getTime();
    const hoursUntilNext = Math.round(timeUntilNext / (1000 * 60 * 60));
    
    return {
      isSystemActive: this.state.isSystemActive,
      lastGlobalUpdate: this.state.lastGlobalUpdate,
      lastUpdateTime: this.state.lastUpdateTime,
      nextScheduledUpdate: this.state.nextScheduledUpdate,
      hoursUntilNext: hoursUntilNext > 0 ? hoursUntilNext : 0,
      dailyUpdateHour: this.state.dailyUpdateHour,
      systemStats: this.state.systemStats,
      sportsStatus: this.DAILY_SPORTS.map(sportKey => ({
        sport: sportKey,
        status: this.state.globalQuotesData[sportKey]?.status || 'stale',
        lastUpdate: this.state.globalQuotesData[sportKey]?.lastUpdate || '',
        isToday: this.state.globalQuotesData[sportKey]?.lastUpdate?.startsWith(new Date().toISOString().split('T')[0]) || false
      })),
      summary: {
        totalSports: this.DAILY_SPORTS.length,
        freshToday: this.DAILY_SPORTS.filter(sport => 
          this.state.globalQuotesData[sport]?.status === 'fresh' &&
          this.state.globalQuotesData[sport]?.lastUpdate?.startsWith(new Date().toISOString().split('T')[0])
        ).length,
        stale: this.DAILY_SPORTS.filter(sport => 
          this.state.globalQuotesData[sport]?.status === 'stale'
        ).length,
        updating: this.DAILY_SPORTS.filter(sport => 
          this.state.globalQuotesData[sport]?.status === 'updating'
        ).length
      }
    };
  }

  // Verifica se le quote sono aggiornate oggi
  areQuotesFreshToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.state.lastGlobalUpdate === today;
  }

  // Ottieni il timestamp dell'ultimo aggiornamento globale
  getLastGlobalUpdateTime(): Date | null {
    if (this.state.lastUpdateTime) {
      return new Date(this.state.lastUpdateTime);
    }
    return null;
  }

  // Ottieni il prossimo aggiornamento programmato
  getNextScheduledUpdate(): Date {
    return new Date(this.state.nextScheduledUpdate);
  }

  // Reset completo del sistema (solo per admin)
  resetGlobalSystem(): void {
    this.stopGlobalSystem();
    
    this.state = {
      lastGlobalUpdate: '',
      lastUpdateTime: '',
      nextScheduledUpdate: this.calculateNextDailyUpdate(),
      isSystemActive: false,
      dailyUpdateHour: this.DAILY_UPDATE_HOUR,
      globalQuotesData: {},
      systemStats: {
        totalDaysActive: 0,
        successfulUpdates: 0,
        failedUpdates: 0
      }
    };
    
    this.initializeGlobalSystem();
    console.log('[GLOBAL] 🔄 Sistema globale resettato completamente');
  }

  // Verifica se il sistema è attivo
  isSystemActive(): boolean {
    return this.state.isSystemActive;
  }
}

// Istanza singleton globale
export const globalDailyUpdater = GlobalDailyUpdater.getInstance(); 