'use client';

import { oddsApi } from './oddsApi';

export interface AutoUpdateStats {
  lastUpdate: Date | null;
  nextUpdate: Date | null;
  totalUpdates: number;
  apiRequestsUsed: number;
  maxApiRequests: number;
  isRunning: boolean;
  updateInterval: number; // in minuti
}

export class AutoUpdateService {
  private static instance: AutoUpdateService;
  private updateInterval: number = 30; // 30 minuti
  private intervalId: NodeJS.Timeout | null = null;
  private lastUpdate: Date | null = null;
  private totalUpdates: number = 0;
  private isRunning: boolean = false;
  private subscribers: Array<(data: any) => void> = [];

  private constructor() {}

  public static getInstance(): AutoUpdateService {
    if (!AutoUpdateService.instance) {
      AutoUpdateService.instance = new AutoUpdateService();
    }
    return AutoUpdateService.instance;
  }

  // Avvia l'aggiornamento automatico
  public startAutoUpdate(): void {
    if (this.isRunning) {
      console.log('⚠️ Aggiornamento automatico già in corso');
      return;
    }

    console.log(`🚀 Avvio aggiornamento automatico ogni ${this.updateInterval} minuti`);
    this.isRunning = true;

    // Prima esecuzione immediata
    this.performUpdate();

    // Programma aggiornamenti successivi
    this.intervalId = setInterval(() => {
      this.performUpdate();
    }, this.updateInterval * 60 * 1000); // Converti minuti in millisecondi
  }

  // Ferma l'aggiornamento automatico
  public stopAutoUpdate(): void {
    if (!this.isRunning) {
      console.log('⚠️ Aggiornamento automatico non è in corso');
      return;
    }

    console.log('🛑 Fermo aggiornamento automatico');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Esegue l'aggiornamento dei dati
  private async performUpdate(): Promise<void> {
    try {
      console.log('🔄 Inizio aggiornamento automatico dati...');
      const startTime = Date.now();

      // Ottieni i dati aggiornati da The Odds API
      const events = await oddsApi.getMultipleSportsOdds();
      
      if (events.length === 0) {
        console.log('⚠️ Nessun evento trovato durante l\'aggiornamento');
        return;
      }

      // Converti in formato app
      const convertedData = oddsApi.convertToAppFormat(events);

      // Aggiorna statistiche
      this.lastUpdate = new Date();
      this.totalUpdates++;

      const duration = Date.now() - startTime;
      console.log(`✅ Aggiornamento completato in ${duration}ms`);
      console.log(`📊 Aggiornati ${convertedData.length} eventi`);
      console.log(`🔢 API Requests: ${oddsApi.getRequestCount()}/${oddsApi.getMaxRequests()}`);

      // Notifica i subscribers
      this.notifySubscribers(convertedData);

    } catch (error) {
      console.error('❌ Errore durante l\'aggiornamento automatico:', error);
      
      // Se abbiamo superato il limite API, ferma gli aggiornamenti
      if (oddsApi.getUsagePercentage() >= 95) {
        console.log('🚨 Limite API quasi raggiunto, fermo aggiornamenti automatici');
        this.stopAutoUpdate();
      }
    }
  }

  // Aggiungi un subscriber per ricevere i dati aggiornati
  public subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    
    // Ritorna una funzione per rimuovere il subscriber
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notifica tutti i subscribers
  private notifySubscribers(data: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Errore nel notificare subscriber:', error);
      }
    });
  }

  // Ottieni le statistiche dell'aggiornamento automatico
  public getStats(): AutoUpdateStats {
    const nextUpdate = this.isRunning && this.lastUpdate 
      ? new Date(this.lastUpdate.getTime() + (this.updateInterval * 60 * 1000))
      : null;

    return {
      lastUpdate: this.lastUpdate,
      nextUpdate,
      totalUpdates: this.totalUpdates,
      apiRequestsUsed: oddsApi.getRequestCount(),
      maxApiRequests: oddsApi.getMaxRequests(),
      isRunning: this.isRunning,
      updateInterval: this.updateInterval
    };
  }

  // Forza un aggiornamento manuale (solo per admin/debug)
  public async forceUpdate(): Promise<void> {
    if (oddsApi.getUsagePercentage() >= 90) {
      throw new Error('Limite API quasi raggiunto. Aggiornamento manuale non consentito.');
    }

    console.log('🔧 Aggiornamento manuale forzato');
    await this.performUpdate();
  }

  // Ottieni il tempo rimanente al prossimo aggiornamento
  public getTimeToNextUpdate(): number | null {
    if (!this.isRunning || !this.lastUpdate) {
      return null;
    }

    const nextUpdate = new Date(this.lastUpdate.getTime() + (this.updateInterval * 60 * 1000));
    const now = new Date();
    const timeRemaining = nextUpdate.getTime() - now.getTime();

    return Math.max(0, timeRemaining);
  }

  // Ottieni il tempo rimanente formattato
  public getFormattedTimeToNextUpdate(): string {
    const timeRemaining = this.getTimeToNextUpdate();
    
    if (timeRemaining === null) {
      return 'Non programmato';
    }

    if (timeRemaining === 0) {
      return 'In corso...';
    }

    const minutes = Math.floor(timeRemaining / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Verifica se l'utente può richiedere aggiornamenti manuali
  public canRequestManualUpdate(): boolean {
    return oddsApi.getUsagePercentage() < 90;
  }

  // Messaggio per l'utente sui limiti
  public getUpdateLimitMessage(): string {
    const percentage = oddsApi.getUsagePercentage();
    
    if (percentage < 50) {
      return 'Sistema di aggiornamento attivo. Dati aggiornati automaticamente ogni 30 minuti.';
    } else if (percentage < 80) {
      return 'Utilizzo API moderato. Aggiornamenti automatici ogni 30 minuti per ottimizzare le richieste.';
    } else if (percentage < 95) {
      return 'Limite API in avvicinamento. Solo aggiornamenti automatici programmati.';
    } else {
      return 'Limite API raggiunto. Per aggiornamenti in tempo reale, considera l\'upgrade del piano.';
    }
  }
}

// Esporta l'istanza singleton
export const autoUpdateService = AutoUpdateService.getInstance(); 