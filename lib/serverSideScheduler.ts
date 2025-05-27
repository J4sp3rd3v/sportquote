// Sistema di Aggiornamento Lato Server - Indipendente dagli Utenti
// Gestisce gli aggiornamenti delle quote a livello di sito, non per singolo utente

import { unifiedApiManager } from './unifiedApiManager';

interface ServerScheduleState {
  lastGlobalUpdate: string; // YYYY-MM-DD
  sportsSchedule: {
    [sportKey: string]: {
      scheduledTime: string; // HH:MM
      lastUpdate: string; // YYYY-MM-DD HH:MM:SS
      nextUpdate: string; // YYYY-MM-DD HH:MM:SS
      status: 'pending' | 'completed' | 'failed';
      attempts: number;
      lastError?: string;
    };
  };
  isSystemActive: boolean;
  globalStats: {
    totalUpdatesToday: number;
    successfulUpdates: number;
    failedUpdates: number;
    lastSystemCheck: string;
  };
}

export class ServerSideScheduler {
  private static instance: ServerSideScheduler;
  private state: ServerScheduleState;
  private intervalId: NodeJS.Timeout | null = null;
  
  // Orari di aggiornamento globali per il sito
  private readonly GLOBAL_SCHEDULE = {
    'soccer_italy_serie_a': '08:00',      // Serie A - 8:00
    'soccer_epl': '09:00',                // Premier League - 9:00
    'soccer_uefa_champs_league': '10:00', // Champions League - 10:00
    'basketball_nba': '11:00',            // NBA - 11:00
    'tennis_atp_french_open': '12:00',    // ATP Tennis - 12:00
    'americanfootball_nfl': '13:00'       // NFL - 13:00
  };

  private readonly STORAGE_KEY = 'monitorquote_server_schedule';
  private readonly CHECK_INTERVAL = 60000; // 1 minuto
  private readonly MAX_RETRY_ATTEMPTS = 3;

  private constructor() {
    this.state = this.loadServerState();
    this.initializeGlobalSchedule();
  }

  static getInstance(): ServerSideScheduler {
    if (!ServerSideScheduler.instance) {
      ServerSideScheduler.instance = new ServerSideScheduler();
    }
    return ServerSideScheduler.instance;
  }

  private loadServerState(): ServerScheduleState {
    // In un ambiente reale, questo sarebbe salvato in un database
    // Per ora usiamo localStorage come simulazione di storage server
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.warn('Errore caricamento stato server:', error);
        }
      }
    }

    return {
      lastGlobalUpdate: '',
      sportsSchedule: {},
      isSystemActive: false,
      globalStats: {
        totalUpdatesToday: 0,
        successfulUpdates: 0,
        failedUpdates: 0,
        lastSystemCheck: ''
      }
    };
  }

  private saveServerState(): void {
    // In produzione questo andrebbe in un database
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    }
    
    // Log per monitoraggio server
    console.log(`[SERVER] Stato salvato - Aggiornamenti oggi: ${this.state.globalStats.totalUpdatesToday}`);
  }

  private initializeGlobalSchedule(): void {
    const today = new Date().toISOString().split('T')[0];
    
    // Inizializza schedule globale se non esiste
    Object.entries(this.GLOBAL_SCHEDULE).forEach(([sportKey, scheduledTime]) => {
      if (!this.state.sportsSchedule[sportKey]) {
        this.state.sportsSchedule[sportKey] = {
          scheduledTime,
          lastUpdate: '',
          nextUpdate: this.calculateNextGlobalUpdate(scheduledTime),
          status: 'pending',
          attempts: 0
        };
      }
    });

    // Reset giornaliero globale se necessario
    if (this.state.lastGlobalUpdate !== today) {
      this.resetGlobalSchedule();
    }

    this.saveServerState();
  }

  private calculateNextGlobalUpdate(scheduledTime: string): string {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const scheduledToday = new Date(now);
    scheduledToday.setHours(hours, minutes, 0, 0);
    
    // Se l'orario di oggi è già passato, programma per domani
    if (scheduledToday.getTime() <= now.getTime()) {
      const tomorrow = new Date(scheduledToday);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }
    
    return scheduledToday.toISOString();
  }

  private resetGlobalSchedule(): void {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`[SERVER] 🔄 Reset schedule globale - ${today}`);
    
    this.state.lastGlobalUpdate = today;
    this.state.globalStats = {
      totalUpdatesToday: 0,
      successfulUpdates: 0,
      failedUpdates: 0,
      lastSystemCheck: new Date().toISOString()
    };
    
    // Reset status di tutti gli sport
    Object.keys(this.state.sportsSchedule).forEach(sportKey => {
      this.state.sportsSchedule[sportKey].status = 'pending';
      this.state.sportsSchedule[sportKey].attempts = 0;
      this.state.sportsSchedule[sportKey].nextUpdate = this.calculateNextGlobalUpdate(
        this.state.sportsSchedule[sportKey].scheduledTime
      );
      delete this.state.sportsSchedule[sportKey].lastError;
    });
  }

  // Avvia il sistema globale (chiamato una sola volta dal server)
  startGlobalSystem(): void {
    if (this.state.isSystemActive) {
      console.log('[SERVER] 📅 Sistema globale già attivo');
      return;
    }

    console.log('[SERVER] 🚀 Avvio Sistema Globale di Aggiornamento');
    this.state.isSystemActive = true;
    
    // Controlla ogni minuto se ci sono aggiornamenti da fare
    this.intervalId = setInterval(() => {
      this.checkAndExecuteGlobalUpdates();
    }, this.CHECK_INTERVAL);

    // Prima esecuzione immediata
    this.checkAndExecuteGlobalUpdates();
    
    this.saveServerState();
  }

  // Ferma il sistema globale
  stopGlobalSystem(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.state.isSystemActive = false;
    this.saveServerState();
    
    console.log('[SERVER] ⏹️ Sistema Globale fermato');
  }

  // Controlla e esegue aggiornamenti globali
  private async checkAndExecuteGlobalUpdates(): Promise<void> {
    const now = new Date();
    this.state.globalStats.lastSystemCheck = now.toISOString();
    
    console.log(`[SERVER] ⏰ Controllo aggiornamenti globali - ${now.toLocaleTimeString('it-IT')}`);
    
    for (const [sportKey, schedule] of Object.entries(this.state.sportsSchedule)) {
      const nextUpdate = new Date(schedule.nextUpdate);
      
      // Se è il momento di aggiornare e lo sport non è già stato aggiornato oggi
      if (now >= nextUpdate && schedule.status === 'pending') {
        await this.executeGlobalUpdate(sportKey);
      }
    }
    
    this.saveServerState();
  }

  // Esegue aggiornamento globale per uno sport
  private async executeGlobalUpdate(sportKey: string): Promise<void> {
    const schedule = this.state.sportsSchedule[sportKey];
    
    console.log(`[SERVER] 🔄 Aggiornamento globale: ${sportKey} (tentativo ${schedule.attempts + 1})`);
    
    try {
      schedule.attempts++;
      this.state.globalStats.totalUpdatesToday++;
      
      // Esegui aggiornamento tramite API unificata
      const result = await unifiedApiManager.updateSport(sportKey);
      
      if (result.success) {
        // Successo
        schedule.status = 'completed';
        schedule.lastUpdate = new Date().toISOString();
        schedule.nextUpdate = this.calculateNextGlobalUpdate(schedule.scheduledTime);
        this.state.globalStats.successfulUpdates++;
        
        console.log(`[SERVER] ✅ ${sportKey} aggiornato globalmente: ${result.matches || 0} partite`);
        
        // Emetti evento globale per tutti i client connessi
        this.broadcastGlobalUpdate(sportKey, result.matches || 0);
        
      } else {
        // Errore - retry se possibile
        if (schedule.attempts < this.MAX_RETRY_ATTEMPTS) {
          console.log(`[SERVER] ⚠️ Retry ${sportKey} in 5 minuti (tentativo ${schedule.attempts}/${this.MAX_RETRY_ATTEMPTS})`);
          // Programma retry tra 5 minuti
          schedule.nextUpdate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        } else {
          schedule.status = 'failed';
          schedule.lastError = result.error;
          this.state.globalStats.failedUpdates++;
          console.error(`[SERVER] ❌ ${sportKey} fallito dopo ${this.MAX_RETRY_ATTEMPTS} tentativi:`, result.error);
        }
      }
      
    } catch (error) {
      schedule.lastError = error instanceof Error ? error.message : 'Errore sconosciuto';
      
      if (schedule.attempts < this.MAX_RETRY_ATTEMPTS) {
        // Retry tra 5 minuti
        schedule.nextUpdate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        console.log(`[SERVER] ⚠️ Errore ${sportKey}, retry in 5 minuti`);
      } else {
        schedule.status = 'failed';
        this.state.globalStats.failedUpdates++;
        console.error(`[SERVER] ❌ ${sportKey} fallito definitivamente:`, error);
      }
    }
  }

  // Broadcast evento globale a tutti i client
  private broadcastGlobalUpdate(sportKey: string, matches: number): void {
    // In un ambiente reale, questo userebbe WebSockets o Server-Sent Events
    // Per ora usiamo eventi del browser
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('globalUpdate:completed', {
        detail: { 
          sport: sportKey,
          matches,
          timestamp: new Date().toISOString(),
          source: 'server_global'
        }
      }));
    }
  }

  // Forza aggiornamento globale di tutti gli sport
  async forceGlobalUpdateAll(): Promise<void> {
    console.log('[SERVER] 🔄 Aggiornamento globale forzato di tutti gli sport');
    
    for (const sportKey of Object.keys(this.state.sportsSchedule)) {
      // Reset attempts per forzare l'aggiornamento
      this.state.sportsSchedule[sportKey].attempts = 0;
      this.state.sportsSchedule[sportKey].status = 'pending';
      
      await this.executeGlobalUpdate(sportKey);
      
      // Pausa tra aggiornamenti per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Ottieni statistiche globali del sistema
  getGlobalStats() {
    const now = new Date();
    
    return {
      isSystemActive: this.state.isSystemActive,
      lastGlobalUpdate: this.state.lastGlobalUpdate,
      globalStats: this.state.globalStats,
      sports: Object.entries(this.state.sportsSchedule).map(([sportKey, schedule]) => {
        const nextUpdate = new Date(schedule.nextUpdate);
        const timeUntilNext = nextUpdate.getTime() - now.getTime();
        
        return {
          sport: sportKey,
          scheduledTime: schedule.scheduledTime,
          status: schedule.status,
          lastUpdate: schedule.lastUpdate,
          nextUpdate: schedule.nextUpdate,
          timeUntilNext: timeUntilNext > 0 ? Math.round(timeUntilNext / (1000 * 60)) : 0,
          attempts: schedule.attempts,
          lastError: schedule.lastError,
          isOverdue: timeUntilNext < 0 && schedule.status === 'pending'
        };
      }),
      summary: {
        total: Object.keys(this.state.sportsSchedule).length,
        completed: Object.values(this.state.sportsSchedule).filter(s => s.status === 'completed').length,
        pending: Object.values(this.state.sportsSchedule).filter(s => s.status === 'pending').length,
        failed: Object.values(this.state.sportsSchedule).filter(s => s.status === 'failed').length
      }
    };
  }

  // Reset completo del sistema (solo per admin)
  resetGlobalSystem(): void {
    this.stopGlobalSystem();
    this.state = {
      lastGlobalUpdate: '',
      sportsSchedule: {},
      isSystemActive: false,
      globalStats: {
        totalUpdatesToday: 0,
        successfulUpdates: 0,
        failedUpdates: 0,
        lastSystemCheck: ''
      }
    };
    this.initializeGlobalSchedule();
    console.log('[SERVER] 🔄 Sistema globale resettato completamente');
  }

  // Verifica se il sistema è attivo (per client)
  isGlobalSystemActive(): boolean {
    return this.state.isSystemActive;
  }

  // Ottieni prossimo aggiornamento programmato
  getNextScheduledUpdate(): { sport: string; time: string; minutes: number } | null {
    const now = new Date();
    let nextUpdate: { sport: string; time: string; minutes: number } | null = null;
    let earliestTime = Infinity;
    
    Object.entries(this.state.sportsSchedule).forEach(([sportKey, schedule]) => {
      if (schedule.status === 'pending') {
        const updateTime = new Date(schedule.nextUpdate).getTime();
        const minutesUntil = Math.round((updateTime - now.getTime()) / (1000 * 60));
        
        if (updateTime < earliestTime && minutesUntil > 0) {
          earliestTime = updateTime;
          nextUpdate = {
            sport: sportKey,
            time: new Date(updateTime).toLocaleTimeString('it-IT'),
            minutes: minutesUntil
          };
        }
      }
    });
    
    return nextUpdate;
  }
}

// Istanza singleton globale
export const serverSideScheduler = ServerSideScheduler.getInstance(); 