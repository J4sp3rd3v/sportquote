export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  updateFrequency: 'hour' | 'minute' | 'second';
  updateIntervalMs: number;
  features: string[];
  maxRequests: number;
  description: string;
  popular?: boolean;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'inactive' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  usage: {
    requests: number;
    lastReset: Date;
  };
}

// Piani di abbonamento disponibili
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    updateFrequency: 'hour',
    updateIntervalMs: 60 * 60 * 1000, // 1 ora
    maxRequests: 100,
    features: [
      'Aggiornamenti ogni ora',
      '100 richieste al mese',
      'Quote da 20+ bookmaker',
      'Confronto base',
      'Supporto email'
    ],
    description: 'Perfetto per iniziare a confrontare le quote'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    currency: 'EUR',
    interval: 'month',
    updateFrequency: 'minute',
    updateIntervalMs: 60 * 1000, // 1 minuto
    maxRequests: 1000,
    features: [
      'Aggiornamenti ogni minuto',
      '1.000 richieste al mese',
      'Quote da 54+ bookmaker',
      'Analisi avanzate',
      'Notifiche push',
      'Cronologia quote',
      'Supporto prioritario'
    ],
    description: 'Per scommettitori seri che vogliono le quote più fresche',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: 'EUR',
    interval: 'month',
    updateFrequency: 'second',
    updateIntervalMs: 30 * 1000, // 30 secondi
    maxRequests: 5000,
    features: [
      'Aggiornamenti ogni 30 secondi',
      '5.000 richieste al mese',
      'Quote da 54+ bookmaker',
      'API dedicata',
      'Analisi predittive AI',
      'Arbitraggi automatici',
      'Alerts personalizzati',
      'Supporto 24/7',
      'Accesso beta features'
    ],
    description: 'La soluzione completa per professionisti del betting'
  }
];

class SubscriptionManager {
  private currentSubscription: UserSubscription | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSubscription();
    this.startUpdateCycle();
  }

  // Carica l'abbonamento dal localStorage
  private loadSubscription(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monitorquote_subscription');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.currentSubscription = {
            ...parsed,
            startDate: new Date(parsed.startDate),
            endDate: new Date(parsed.endDate),
            usage: {
              ...parsed.usage,
              lastReset: new Date(parsed.usage.lastReset)
            }
          };
        } catch (error) {
          console.error('Errore nel caricamento abbonamento:', error);
          this.setDefaultSubscription();
        }
      } else {
        this.setDefaultSubscription();
      }
    }
  }

  // Imposta l'abbonamento gratuito di default
  private setDefaultSubscription(): void {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    this.currentSubscription = {
      planId: 'free',
      status: 'active',
      startDate: now,
      endDate: endDate,
      autoRenew: false,
      usage: {
        requests: 0,
        lastReset: now
      }
    };
    this.saveSubscription();
  }

  // Salva l'abbonamento nel localStorage
  private saveSubscription(): void {
    if (typeof window !== 'undefined' && this.currentSubscription) {
      localStorage.setItem('monitorquote_subscription', JSON.stringify(this.currentSubscription));
    }
  }

  // Avvia il ciclo di aggiornamento basato sul piano
  private startUpdateCycle(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    const plan = this.getCurrentPlan();
    if (plan) {
      this.updateInterval = setInterval(() => {
        this.triggerUpdate();
      }, plan.updateIntervalMs);
    }
  }

  // Trigger per aggiornamento quote
  private triggerUpdate(): void {
    if (this.canMakeRequest()) {
      // Emetti evento per aggiornare le quote
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('monitorquote:update', {
          detail: { source: 'subscription_manager' }
        }));
      }
    }
  }

  // Ottiene il piano corrente
  getCurrentPlan(): SubscriptionPlan | null {
    if (!this.currentSubscription) return null;
    return SUBSCRIPTION_PLANS.find(plan => plan.id === this.currentSubscription!.planId) || null;
  }

  // Ottiene l'abbonamento corrente
  getCurrentSubscription(): UserSubscription | null {
    return this.currentSubscription;
  }

  // Verifica se l'utente può fare una richiesta
  canMakeRequest(): boolean {
    if (!this.currentSubscription) return false;

    const plan = this.getCurrentPlan();
    if (!plan) return false;

    // Verifica se l'abbonamento è attivo
    if (this.currentSubscription.status !== 'active') return false;

    // Verifica se l'abbonamento è scaduto
    if (new Date() > this.currentSubscription.endDate) {
      this.currentSubscription.status = 'expired';
      this.saveSubscription();
      return false;
    }

    // Reset mensile delle richieste
    const now = new Date();
    const lastReset = this.currentSubscription.usage.lastReset;
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      this.currentSubscription.usage.requests = 0;
      this.currentSubscription.usage.lastReset = now;
      this.saveSubscription();
    }

    // Verifica limite richieste
    return this.currentSubscription.usage.requests < plan.maxRequests;
  }

  // Incrementa il contatore delle richieste
  incrementRequestCount(): void {
    if (this.currentSubscription) {
      this.currentSubscription.usage.requests++;
      this.saveSubscription();
    }
  }

  // Cambia piano di abbonamento
  changePlan(planId: string): boolean {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan || !this.currentSubscription) return false;

    this.currentSubscription.planId = planId;
    
    // Se è un upgrade, estendi la data di scadenza
    if (plan.price > 0) {
      const now = new Date();
      const endDate = new Date(now);
      if (plan.interval === 'month') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      this.currentSubscription.endDate = endDate;
      this.currentSubscription.status = 'active';
    }

    this.saveSubscription();
    this.startUpdateCycle(); // Riavvia il ciclo con la nuova frequenza
    return true;
  }

  // Ottiene le statistiche di utilizzo
  getUsageStats(): {
    requestsUsed: number;
    requestsLimit: number;
    percentageUsed: number;
    daysRemaining: number;
    updateFrequency: string;
  } {
    const plan = this.getCurrentPlan();
    const subscription = this.getCurrentSubscription();

    if (!plan || !subscription) {
      return {
        requestsUsed: 0,
        requestsLimit: 0,
        percentageUsed: 0,
        daysRemaining: 0,
        updateFrequency: 'Non disponibile'
      };
    }

    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const percentageUsed = (subscription.usage.requests / plan.maxRequests) * 100;

    let updateFrequencyText = '';
    switch (plan.updateFrequency) {
      case 'hour':
        updateFrequencyText = 'Ogni ora';
        break;
      case 'minute':
        updateFrequencyText = 'Ogni minuto';
        break;
      case 'second':
        updateFrequencyText = 'Ogni 30 secondi';
        break;
    }

    return {
      requestsUsed: subscription.usage.requests,
      requestsLimit: plan.maxRequests,
      percentageUsed: Math.round(percentageUsed),
      daysRemaining,
      updateFrequency: updateFrequencyText
    };
  }

  // Cleanup
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Istanza singleton
let subscriptionManagerInstance: SubscriptionManager | null = null;

export function getSubscriptionManager(): SubscriptionManager {
  if (!subscriptionManagerInstance) {
    subscriptionManagerInstance = new SubscriptionManager();
  }
  return subscriptionManagerInstance;
}

export default SubscriptionManager; 