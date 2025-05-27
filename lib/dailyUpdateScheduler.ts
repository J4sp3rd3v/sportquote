// Sistema di Aggiornamento Automatico Giornaliero - 2025
// Gestisce l'aggiornamento automatico delle quote una volta al giorno per sport

import { unifiedApiManager } from './unifiedApiManager';
import { optimizedOddsService } from './optimizedOddsService';

interface DailyScheduleState {
  lastDailyUpdate: string; // YYYY-MM-DD
  sportsSchedule: {
    [sportKey: string]: {
      scheduledTime: string; // HH:MM
      lastUpdate: string; // YYYY-MM-DD HH:MM:SS
      nextUpdate: string; // YYYY-MM-DD HH:MM:SS
      status: 'pending' | 'completed' | 'failed';
    };
  };
  isRunning: boolean;
  intervalId: number | null;
}

export class DailyUpdateScheduler {
  private static instance: DailyUpdateScheduler;
  private state: DailyScheduleState;
  
  // Orari di aggiornamento per ogni sport (distribuiti nella giornata)
  private readonly SPORT_SCHEDULE = {
    'soccer_italy_serie_a': '08:00',      // Serie A - 8:00
    'soccer_epl': '09:00',                // Premier League - 9:00
    'soccer_uefa_champs_league': '10:00', // Champions League - 10:00
    'basketball_nba': '11:00',            // NBA - 11:00
    'tennis_atp_french_open': '12:00',    // ATP Tennis - 12:00
    'americanfootball_nfl': '13:00'       // NFL - 13:00
  };

  private constructor() {
    this.state = this.loadState();
    this.initializeSchedule();
  }

  static getInstance(): DailyUpdateScheduler {
    if (!DailyUpdateScheduler.instance) {
      DailyUpdateScheduler.instance = new DailyUpdateScheduler();
    }
    return DailyUpdateScheduler.instance;
  }

  private loadState(): DailyScheduleState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailyUpdateScheduler');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.warn('Errore caricamento stato scheduler:', error);
        }
      }
    }

    return {
      lastDailyUpdate: '',
      sportsSchedule: {},
      isRunning: false,
      intervalId: null
    };
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailyUpdateScheduler', JSON.stringify(this.state));
    }
  }

  private initializeSchedule(): void {
    const today = new Date().toISOString().split('T')[0];
    
    // Inizializza schedule per ogni sport se non esiste
    Object.entries(this.SPORT_SCHEDULE).forEach(([sportKey, scheduledTime]) => {
      if (!this.state.sportsSchedule[sportKey]) {
        this.state.sportsSchedule[sportKey] = {
          scheduledTime,
          lastUpdate: '',
          nextUpdate: this.calculateNextUpdate(scheduledTime),
          status: 'pending'
        };
      }
    });

    // Reset giornaliero se necessario
    if (this.state.lastDailyUpdate !== today) {
      this.resetDailySchedule();
    }

    this.saveState();
  }

  private calculateNextUpdate(scheduledTime: string): string {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
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

  private resetDailySchedule(): void {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`🔄 Reset schedule giornaliero - ${today}`);
    
    this.state.lastDailyUpdate = today;
    
    // Reset status di tutti gli sport
    Object.keys(this.state.sportsSchedule).forEach(sportKey => {
      this.state.sportsSchedule[sportKey].status = 'pending';
      this.state.sportsSchedule[sportKey].nextUpdate = this.calculateNextUpdate(
        this.state.sportsSchedule[sportKey].scheduledTime
      );
    });
  }

  // Avvia il sistema di aggiornamento automatico
  start(): void {
    if (this.state.isRunning) {
      console.log('📅 Scheduler già in esecuzione');
      return;
    }

    console.log('🚀 Avvio Daily Update Scheduler');
    this.state.isRunning = true;
    
    // Controlla ogni minuto se ci sono aggiornamenti da fare
    this.state.intervalId = window.setInterval(() => {
      this.checkAndExecuteUpdates();
    }, 60000); // 1 minuto

    // Prima esecuzione immediata
    this.checkAndExecuteUpdates();
    
    this.saveState();
  }

  // Ferma il sistema
  stop(): void {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
    
    this.state.isRunning = false;
    this.saveState();
    
    console.log('⏹️ Daily Update Scheduler fermato');
  }

  // Controlla e esegue aggiornamenti programmati
  private async checkAndExecuteUpdates(): Promise<void> {
    const now = new Date();
    
    for (const [sportKey, schedule] of Object.entries(this.state.sportsSchedule)) {
      const nextUpdate = new Date(schedule.nextUpdate);
      
      // Se è il momento di aggiornare e lo sport non è già stato aggiornato oggi
      if (now >= nextUpdate && schedule.status === 'pending') {
        await this.updateSport(sportKey);
      }
    }
  }

  // Aggiorna uno sport specifico
  private async updateSport(sportKey: string): Promise<void> {
    console.log(`🔄 Aggiornamento automatico: ${sportKey}`);
    
    try {
      // Marca come in corso
      this.state.sportsSchedule[sportKey].status = 'pending';
      
      // Esegui aggiornamento
      const result = await unifiedApiManager.updateSport(sportKey);
      
      if (result.success) {
        // Successo
        this.state.sportsSchedule[sportKey].status = 'completed';
        this.state.sportsSchedule[sportKey].lastUpdate = new Date().toISOString();
        this.state.sportsSchedule[sportKey].nextUpdate = this.calculateNextUpdate(
          this.state.sportsSchedule[sportKey].scheduledTime
        );
        
        console.log(`✅ ${sportKey} aggiornato: ${result.matches || 0} partite`);
        
        // Emetti evento per notificare l'aggiornamento
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dailyUpdate:completed', {
            detail: { 
              sport: sportKey,
              matches: result.matches || 0,
              timestamp: new Date().toISOString()
            }
          }));
        }
        
      } else {
        // Errore
        this.state.sportsSchedule[sportKey].status = 'failed';
        console.error(`❌ Errore aggiornamento ${sportKey}:`, result.error);
      }
      
    } catch (error) {
      this.state.sportsSchedule[sportKey].status = 'failed';
      console.error(`❌ Errore aggiornamento ${sportKey}:`, error);
    }
    
    this.saveState();
  }

  // Forza aggiornamento di uno sport
  async forceUpdateSport(sportKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.updateSport(sportKey);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      };
    }
  }

  // Forza aggiornamento di tutti gli sport
  async forceUpdateAll(): Promise<void> {
    console.log('🔄 Aggiornamento forzato di tutti gli sport');
    
    for (const sportKey of Object.keys(this.state.sportsSchedule)) {
      await this.updateSport(sportKey);
      // Pausa tra aggiornamenti per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Ottieni statistiche del scheduler
  getScheduleStats() {
    const now = new Date();
    const stats = {
      isRunning: this.state.isRunning,
      lastDailyUpdate: this.state.lastDailyUpdate,
      sports: Object.entries(this.state.sportsSchedule).map(([sportKey, schedule]) => {
        const nextUpdate = new Date(schedule.nextUpdate);
        const timeUntilNext = nextUpdate.getTime() - now.getTime();
        
        return {
          sport: sportKey,
          scheduledTime: schedule.scheduledTime,
          status: schedule.status,
          lastUpdate: schedule.lastUpdate,
          nextUpdate: schedule.nextUpdate,
          timeUntilNext: timeUntilNext > 0 ? Math.round(timeUntilNext / (1000 * 60)) : 0, // minuti
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
    
    return stats;
  }

  // Reset completo per test
  reset(): void {
    this.stop();
    this.state = {
      lastDailyUpdate: '',
      sportsSchedule: {},
      isRunning: false,
      intervalId: null
    };
    this.initializeSchedule();
    console.log('🔄 Daily Update Scheduler resettato');
  }
}

// Istanza singleton
export const dailyUpdateScheduler = DailyUpdateScheduler.getInstance(); 