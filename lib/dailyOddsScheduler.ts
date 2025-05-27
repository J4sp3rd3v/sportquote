// Sistema di Aggiornamento Quote Giornaliero
// Aggiorna automaticamente le partite 1 volta al giorno alle 12:00

import { realOddsService } from './realOddsService';
import { Match } from '@/types';

interface DailySchedulerState {
  lastUpdate: number;
  nextUpdate: number;
  isUpdating: boolean;
  matches: Match[];
  updateCount: number;
  errors: string[];
}

export class DailyOddsScheduler {
  private static instance: DailyOddsScheduler;
  
  private readonly UPDATE_HOUR = 12; // 12:00
  private readonly UPDATE_MINUTE = 0;
  private readonly STORAGE_KEY = 'dailyOddsScheduler';
  
  private state: DailySchedulerState;
  private updateTimer: NodeJS.Timeout | null = null;
  private isClient: boolean = false;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.state = this.loadState();
    this.scheduleNextUpdate();
  }

  static getInstance(): DailyOddsScheduler {
    if (!DailyOddsScheduler.instance) {
      DailyOddsScheduler.instance = new DailyOddsScheduler();
    }
    return DailyOddsScheduler.instance;
  }

  // Carica stato da localStorage
  private loadState(): DailySchedulerState {
    if (!this.isClient) {
      return this.getDefaultState();
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Verifica se è un nuovo giorno
        const now = new Date();
        const lastUpdateDate = new Date(parsed.lastUpdate);
        
        if (this.isNewDay(lastUpdateDate, now)) {
          console.log('📅 Nuovo giorno rilevato - Reset stato');
          return this.getDefaultState();
        }
        
        return {
          ...this.getDefaultState(),
          ...parsed,
          matches: parsed.matches || []
        };
      }
    } catch (error) {
      console.error('❌ Errore caricamento stato scheduler:', error);
    }

    return this.getDefaultState();
  }

  // Stato di default
  private getDefaultState(): DailySchedulerState {
    const now = new Date();
    const nextUpdate = this.calculateNextUpdate(now);
    
    return {
      lastUpdate: 0,
      nextUpdate: nextUpdate.getTime(),
      isUpdating: false,
      matches: [],
      updateCount: 0,
      errors: []
    };
  }

  // Salva stato in localStorage
  private saveState(): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('❌ Errore salvataggio stato scheduler:', error);
    }
  }

  // Verifica se è un nuovo giorno
  private isNewDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() !== date2.toDateString();
  }

  // Calcola prossimo aggiornamento
  private calculateNextUpdate(from: Date): Date {
    const next = new Date(from);
    next.setHours(this.UPDATE_HOUR, this.UPDATE_MINUTE, 0, 0);
    
    // Se l'orario è già passato oggi, programma per domani
    if (next <= from) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  }

  // Programma prossimo aggiornamento
  private scheduleNextUpdate(): void {
    if (!this.isClient) return;

    // Cancella timer esistente
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const now = new Date();
    const nextUpdate = new Date(this.state.nextUpdate);
    const msUntilUpdate = nextUpdate.getTime() - now.getTime();

    if (msUntilUpdate <= 0) {
      // È ora di aggiornare
      this.performDailyUpdate();
    } else {
      // Programma aggiornamento
      console.log(`⏰ Prossimo aggiornamento programmato: ${nextUpdate.toLocaleString('it-IT')}`);
      console.log(`⏱️ Tempo rimanente: ${Math.round(msUntilUpdate / 1000 / 60)} minuti`);
      
      this.updateTimer = setTimeout(() => {
        this.performDailyUpdate();
      }, msUntilUpdate);
    }
  }

  // Esegue aggiornamento giornaliero
  private async performDailyUpdate(): Promise<void> {
    if (this.state.isUpdating) {
      console.log('⚠️ Aggiornamento già in corso');
      return;
    }

    console.log('🔄 === AGGIORNAMENTO GIORNALIERO INIZIATO ===');
    
    this.state.isUpdating = true;
    this.state.errors = [];
    this.saveState();

    try {
      // Carica nuove partite
      const newMatches = await realOddsService.getAllRealMatches();
      
      // Aggiorna stato
      const now = new Date();
      this.state.lastUpdate = now.getTime();
      this.state.nextUpdate = this.calculateNextUpdate(now).getTime();
      this.state.matches = newMatches;
      this.state.updateCount++;
      this.state.isUpdating = false;
      
      console.log(`✅ Aggiornamento completato: ${newMatches.length} partite caricate`);
      console.log(`📊 Aggiornamento #${this.state.updateCount}`);
      console.log(`⏰ Prossimo aggiornamento: ${new Date(this.state.nextUpdate).toLocaleString('it-IT')}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      
      console.error('❌ Errore aggiornamento giornaliero:', errorMessage);
      
      this.state.errors.push(`${new Date().toISOString()}: ${errorMessage}`);
      this.state.isUpdating = false;
      
      // Riprova tra 1 ora in caso di errore
      const retryTime = new Date();
      retryTime.setHours(retryTime.getHours() + 1);
      this.state.nextUpdate = retryTime.getTime();
      
      console.log(`🔄 Nuovo tentativo programmato: ${retryTime.toLocaleString('it-IT')}`);
    }

    this.saveState();
    this.scheduleNextUpdate();
  }

  // Ottieni partite correnti (cache giornaliera)
  getMatches(): Match[] {
    return this.state.matches;
  }

  // Verifica se i dati sono aggiornati
  isDataFresh(): boolean {
    if (this.state.matches.length === 0) return false;
    
    const now = new Date();
    const lastUpdate = new Date(this.state.lastUpdate);
    
    // Dati freschi se aggiornati oggi
    return !this.isNewDay(lastUpdate, now);
  }

  // Ottieni timestamp ultimo aggiornamento
  getLastUpdate(): Date | null {
    if (this.state.lastUpdate === 0) return null;
    return new Date(this.state.lastUpdate);
  }

  // Ottieni timestamp prossimo aggiornamento
  getNextUpdate(): Date {
    return new Date(this.state.nextUpdate);
  }

  // Ottieni statistiche
  getStats() {
    const now = new Date();
    const lastUpdate = this.getLastUpdate();
    const nextUpdate = this.getNextUpdate();
    const timeUntilNext = nextUpdate.getTime() - now.getTime();
    
    return {
      lastUpdate,
      nextUpdate,
      matchesCount: this.state.matches.length,
      updateCount: this.state.updateCount,
      isUpdating: this.state.isUpdating,
      isDataFresh: this.isDataFresh(),
      hoursUntilNext: Math.max(0, Math.round(timeUntilNext / 1000 / 60 / 60)),
      minutesUntilNext: Math.max(0, Math.round((timeUntilNext % (1000 * 60 * 60)) / 1000 / 60)),
      errors: this.state.errors.slice(-3) // Ultimi 3 errori
    };
  }

  // Forza aggiornamento manuale (solo per admin/test)
  async forceUpdate(): Promise<boolean> {
    if (this.state.isUpdating) {
      console.log('⚠️ Aggiornamento già in corso');
      return false;
    }

    console.log('🔄 Aggiornamento manuale forzato');
    await this.performDailyUpdate();
    return true;
  }

  // Verifica se è necessario aggiornare
  shouldUpdate(): boolean {
    const now = new Date();
    return now.getTime() >= this.state.nextUpdate || !this.isDataFresh();
  }

  // Reset per test
  reset(): void {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    
    this.state = this.getDefaultState();
    this.saveState();
    this.scheduleNextUpdate();
    
    console.log('🔄 Scheduler resettato');
  }

  // Cleanup
  destroy(): void {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  }
}

// Istanza singleton
export const dailyOddsScheduler = DailyOddsScheduler.getInstance(); 