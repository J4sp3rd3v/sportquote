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
  private updateInterval: number = 60; // 1 ora
  private intervalId: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null; // Per il timeout fino alla prossima ora
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

    console.log(`🚀 Avvio aggiornamento automatico ogni ora a orari fissi`);
    this.isRunning = true;

    // Prima esecuzione immediata
    this.performUpdate();

    // Calcola il tempo fino alla prossima ora intera
    this.scheduleNextHourlyUpdate();
  }

  // Programma l'aggiornamento alla prossima ora intera
  private scheduleNextHourlyUpdate(): void {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Prossima ora alle :00

    const timeUntilNextHour = nextHour.getTime() - now.getTime();

    console.log(`⏰ Prossimo aggiornamento programmato alle ${nextHour.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`);

    // Programma il primo aggiornamento alla prossima ora
    this.timeoutId = setTimeout(() => {
      if (this.isRunning) {
        this.performUpdate();
        
        // Dopo il primo aggiornamento, programma aggiornamenti ogni ora esatta
        this.intervalId = setInterval(() => {
          this.performUpdate();
        }, 60 * 60 * 1000); // Ogni ora esatta
      }
    }, timeUntilNextHour);
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

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
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
    let nextUpdate: Date | null = null;
    
    if (this.isRunning) {
      const now = new Date();
      nextUpdate = new Date(now);
      nextUpdate.setHours(now.getHours() + 1, 0, 0, 0); // Prossima ora alle :00
    }

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
    if (!this.isRunning) {
      return null;
    }

    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Prossima ora alle :00

    const timeRemaining = nextHour.getTime() - now.getTime();
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

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Ottieni l'ultimo aggiornamento formattato
  public getFormattedLastUpdate(): string {
    if (!this.lastUpdate) {
      return 'Mai eseguito';
    }

    const now = new Date();
    const diffMs = now.getTime() - this.lastUpdate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Appena aggiornato';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minuti fa`;
    } else if (diffHours < 24) {
      return `${diffHours} ore fa`;
    } else if (diffDays === 1) {
      return 'Ieri alle ' + this.lastUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } else {
      return this.lastUpdate.toLocaleString('it-IT', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
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
      return 'Sistema di aggiornamento attivo. Dati aggiornati automaticamente ogni ora.';
    } else if (percentage < 80) {
      return 'Utilizzo API moderato. Aggiornamenti automatici ogni ora per ottimizzare le richieste.';
    } else if (percentage < 95) {
      return 'Limite API in avvicinamento. Solo aggiornamenti automatici programmati.';
    } else {
      return 'Limite API raggiunto. Per aggiornamenti in tempo reale, considera l\'upgrade del piano.';
    }
  }
}

// Esporta l'istanza singleton
export const autoUpdateService = AutoUpdateService.getInstance(); 