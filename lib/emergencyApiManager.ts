// Sistema di gestione emergenza API per preservare le richieste rimanenti
export interface EmergencyApiState {
  isEmergencyMode: boolean;
  remainingRequests: number;
  usedRequests: number;
  lastCheck: number;
  emergencyActivatedAt: number | null;
  canMakeRequest: boolean;
  nextAllowedRequest: number;
}

export class EmergencyApiManager {
  private static instance: EmergencyApiManager;
  private state: EmergencyApiState;
  private readonly EMERGENCY_THRESHOLD = 50; // Attiva emergenza sotto 50 richieste
  private readonly CRITICAL_THRESHOLD = 10;  // Blocca tutto sotto 10 richieste
  private readonly MIN_INTERVAL_HOURS = 2;   // Minimo 2 ore tra richieste in emergenza

  constructor() {
    this.state = this.loadState();
  }

  static getInstance(): EmergencyApiManager {
    if (!EmergencyApiManager.instance) {
      EmergencyApiManager.instance = new EmergencyApiManager();
    }
    return EmergencyApiManager.instance;
  }

  private loadState(): EmergencyApiState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('emergencyApiState');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.warn('Errore nel caricamento stato emergenza:', error);
        }
      }
    }

    return {
      isEmergencyMode: false,
      remainingRequests: 500,
      usedRequests: 0,
      lastCheck: Date.now(),
      emergencyActivatedAt: null,
      canMakeRequest: true,
      nextAllowedRequest: Date.now()
    };
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emergencyApiState', JSON.stringify(this.state));
    }
  }

  updateApiUsage(remainingRequests: number, usedRequests: number): void {
    const now = Date.now();
    const wasEmergencyMode = this.state.isEmergencyMode;

    this.state.remainingRequests = remainingRequests;
    this.state.usedRequests = usedRequests;
    this.state.lastCheck = now;

    // Attiva modalità emergenza se necessario
    if (remainingRequests <= this.EMERGENCY_THRESHOLD && !this.state.isEmergencyMode) {
      this.state.isEmergencyMode = true;
      this.state.emergencyActivatedAt = now;
      console.warn(`🚨 MODALITÀ EMERGENZA ATTIVATA - Solo ${remainingRequests} richieste rimanenti`);
    }

    // Aggiorna permessi richieste
    this.updateRequestPermissions();

    // Log cambiamenti significativi
    if (!wasEmergencyMode && this.state.isEmergencyMode) {
      this.logEmergencyActivation();
    }

    this.saveState();
  }

  private updateRequestPermissions(): void {
    const now = Date.now();

    if (this.state.remainingRequests <= this.CRITICAL_THRESHOLD) {
      // Modalità critica: blocca tutte le richieste automatiche
      this.state.canMakeRequest = false;
      this.state.nextAllowedRequest = now + (24 * 60 * 60 * 1000); // 24 ore
      console.error(`🔴 MODALITÀ CRITICA - Solo ${this.state.remainingRequests} richieste rimanenti. Richieste bloccate.`);
    } else if (this.state.isEmergencyMode) {
      // Modalità emergenza: limita richieste
      const timeSinceLastRequest = now - this.state.lastCheck;
      const minInterval = this.MIN_INTERVAL_HOURS * 60 * 60 * 1000;

      this.state.canMakeRequest = timeSinceLastRequest >= minInterval;
      if (!this.state.canMakeRequest) {
        this.state.nextAllowedRequest = this.state.lastCheck + minInterval;
      }
    } else {
      // Modalità normale
      this.state.canMakeRequest = true;
      this.state.nextAllowedRequest = now;
    }
  }

  private logEmergencyActivation(): void {
    console.warn(`
🚨 SISTEMA DI EMERGENZA API ATTIVATO
=====================================
📊 Richieste rimanenti: ${this.state.remainingRequests}
📈 Richieste usate: ${this.state.usedRequests}/500
⏰ Attivato alle: ${new Date(this.state.emergencyActivatedAt!).toLocaleString('it-IT')}

🔧 MISURE ATTIVATE:
• Aggiornamenti automatici disabilitati
• Solo richieste manuali ogni ${this.MIN_INTERVAL_HOURS} ore
• Cache estesa al massimo
• Fallback ai dati simulati

💡 RACCOMANDAZIONI:
• Evitare aggiornamenti frequenti
• Usare principalmente dati in cache
• Attendere il reset mensile delle richieste
=====================================
    `);
  }

  canMakeApiRequest(): boolean {
    this.updateRequestPermissions();
    return this.state.canMakeRequest;
  }

  getTimeUntilNextRequest(): number {
    const now = Date.now();
    return Math.max(0, this.state.nextAllowedRequest - now);
  }

  getEmergencyStatus(): EmergencyApiState {
    return { ...this.state };
  }

  forceAllowRequest(): boolean {
    if (this.state.remainingRequests <= 5) {
      console.error('🔴 IMPOSSIBILE FORZARE - Troppe poche richieste rimanenti');
      return false;
    }

    console.warn('⚠️ RICHIESTA FORZATA - Utilizzando richiesta di emergenza');
    this.state.nextAllowedRequest = Date.now() + (this.MIN_INTERVAL_HOURS * 60 * 60 * 1000);
    this.saveState();
    return true;
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.state.remainingRequests <= this.CRITICAL_THRESHOLD) {
      recommendations.push('🔴 CRITICO: Evitare qualsiasi richiesta API non essenziale');
      recommendations.push('📱 Utilizzare solo dati in cache o simulati');
      recommendations.push('⏳ Attendere il reset mensile delle richieste');
    } else if (this.state.isEmergencyMode) {
      recommendations.push('🟡 EMERGENZA: Limitare richieste a una ogni 2 ore');
      recommendations.push('💾 Massimizzare l\'uso della cache');
      recommendations.push('🔄 Preferire aggiornamenti manuali');
    } else {
      recommendations.push('✅ Utilizzo normale consentito');
      recommendations.push('📊 Monitorare l\'utilizzo regolarmente');
    }

    return recommendations;
  }

  resetEmergencyMode(): void {
    console.log('🔄 Reset modalità emergenza (solo per testing)');
    this.state.isEmergencyMode = false;
    this.state.emergencyActivatedAt = null;
    this.state.canMakeRequest = true;
    this.state.nextAllowedRequest = Date.now();
    this.saveState();
  }
}

// Istanza singleton
export const emergencyApiManager = EmergencyApiManager.getInstance(); 