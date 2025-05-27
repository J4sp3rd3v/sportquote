'use client';

import { unifiedApiManager } from './unifiedApiManager';
import { optimizedOddsService } from './optimizedOddsService';

export interface AutoUpdateStats {
  isRunning: boolean;
  lastUpdate: Date | null;
  nextUpdate: Date | null;
  apiRequestsUsed: number;
  maxApiRequests: number;
  timeToNextUpdate: string;
  currentSport: string | null;
  sportsUpdatedToday: number;
  totalSports: number;
}

class AutoUpdateService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastUpdate: Date | null = null;
  private nextUpdate: Date | null = null;
  private currentSport: string | null = null;

  // Intervallo di aggiornamento: 4 ore (14400000 ms)
  private readonly UPDATE_INTERVAL = 4 * 60 * 60 * 1000;

  start() {
    if (this.isRunning) {
      console.log('🔄 AutoUpdate già in esecuzione');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Avvio AutoUpdate Service');

    // Prima esecuzione immediata
    this.performUpdate();

    // Programma aggiornamenti periodici
    this.intervalId = setInterval(() => {
      this.performUpdate();
    }, this.UPDATE_INTERVAL);

    this.calculateNextUpdate();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.nextUpdate = null;
    this.currentSport = null;
    console.log('⏹️ AutoUpdate Service fermato');
  }

  private async performUpdate() {
    try {
      console.log('🔄 Inizio aggiornamento automatico...');
      
      // Ottieni il prossimo sport da aggiornare
      const nextSport = unifiedApiManager.getNextSportToUpdate();
      
      if (!nextSport) {
        console.log('⏭️ Nessuno sport da aggiornare disponibile');
        return;
      }

      this.currentSport = nextSport.name;
      
      // Aggiorna lo sport
      const result = await optimizedOddsService.updateNextSport();
      
      if (result.success) {
        this.lastUpdate = new Date();
        console.log(`✅ Sport ${result.sport} aggiornato con successo: ${result.matches} partite`);
      } else {
        console.error(`❌ Errore aggiornamento ${result.sport}:`, result.error);
      }
      
      this.currentSport = null;
      this.calculateNextUpdate();
      
    } catch (error) {
      console.error('❌ Errore durante l\'aggiornamento automatico:', error);
      this.currentSport = null;
    }
  }

  private calculateNextUpdate() {
    if (this.isRunning) {
      this.nextUpdate = new Date(Date.now() + this.UPDATE_INTERVAL);
    }
  }

  getStats(): AutoUpdateStats {
    const apiStats = unifiedApiManager.getDetailedStats();
    
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      nextUpdate: this.nextUpdate,
      apiRequestsUsed: apiStats.daily.used,
      maxApiRequests: apiStats.daily.quota,
      timeToNextUpdate: this.getTimeToNextUpdate(),
      currentSport: this.currentSport,
      sportsUpdatedToday: apiStats.sports.updatedToday,
      totalSports: apiStats.sports.total
    };
  }

  private getTimeToNextUpdate(): string {
    if (!this.nextUpdate || !this.isRunning) {
      return 'Non programmato';
    }

    const now = new Date();
    const diff = this.nextUpdate.getTime() - now.getTime();

    if (diff <= 0) {
      return 'In corso...';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Forza un aggiornamento immediato
  async forceUpdate(): Promise<void> {
    console.log('🔄 Aggiornamento forzato richiesto');
    await this.performUpdate();
  }

  // Resetta il timer
  resetTimer() {
    if (this.isRunning && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.performUpdate();
      }, this.UPDATE_INTERVAL);
      this.calculateNextUpdate();
      console.log('🔄 Timer AutoUpdate resettato');
    }
  }
}

export const autoUpdateService = new AutoUpdateService(); 