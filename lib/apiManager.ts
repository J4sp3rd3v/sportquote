import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipi per la gestione API
export interface ApiUsage {
  requests: number;
  lastReset: number;
  lastUpdate: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  requests: number;
  updateInterval: number; // in minuti
  features: string[];
}

export interface ApiManagerState {
  // Stato API
  usage: ApiUsage;
  isSubscribed: boolean;
  subscriptionPlan: SubscriptionPlan | null;
  nextUpdate: number;
  isUpdating: boolean;
  
  // Countdown
  countdown: number;
  
  // Azioni
  incrementUsage: () => void;
  resetUsage: () => void;
  setSubscription: (plan: SubscriptionPlan) => void;
  cancelSubscription: () => void;
  setNextUpdate: (timestamp: number) => void;
  setIsUpdating: (updating: boolean) => void;
  updateCountdown: () => void;
}

// Piani di abbonamento
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    requests: 500,
    updateInterval: 60, // ogni ora
    features: [
      '500 richieste/mese',
      'Aggiornamenti ogni ora',
      'Sport principali',
      'Supporto community'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    requests: 10000,
    updateInterval: 1, // ogni minuto
    features: [
      '10.000 richieste/mese',
      'Aggiornamenti ogni minuto',
      'Tutti gli sport',
      'Supporto prioritario',
      'API personalizzata',
      'Notifiche push'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    requests: 50000,
    updateInterval: 0.5, // ogni 30 secondi
    features: [
      '50.000 richieste/mese',
      'Aggiornamenti ogni 30 secondi',
      'Tutti gli sport + mercati speciali',
      'Supporto dedicato',
      'API illimitata',
      'Notifiche in tempo reale',
      'Analisi avanzate',
      'Export dati'
    ]
  }
];

// Store Zustand per la gestione API
export const useApiManager = create<ApiManagerState>()(
  persist(
    (set, get) => ({
      // Stato iniziale
      usage: {
        requests: 0,
        lastReset: Date.now(),
        lastUpdate: 0
      },
      isSubscribed: false,
      subscriptionPlan: SUBSCRIPTION_PLANS[0], // Piano gratuito di default
      nextUpdate: Date.now() + (60 * 60 * 1000), // Prossimo aggiornamento tra 1 ora
      isUpdating: false,
      countdown: 0,

      // Incrementa l'uso dell'API
      incrementUsage: () => set((state) => {
        const now = Date.now();
        const monthStart = new Date(now).setDate(1);
        
        // Reset se è un nuovo mese
        if (state.usage.lastReset < monthStart) {
          return {
            usage: {
              requests: 1,
              lastReset: now,
              lastUpdate: now
            }
          };
        }
        
        return {
          usage: {
            ...state.usage,
            requests: state.usage.requests + 1,
            lastUpdate: now
          }
        };
      }),

      // Reset dell'uso (nuovo mese)
      resetUsage: () => set(() => ({
        usage: {
          requests: 0,
          lastReset: Date.now(),
          lastUpdate: 0
        }
      })),

      // Imposta abbonamento
      setSubscription: (plan) => set(() => ({
        subscriptionPlan: plan,
        isSubscribed: plan.id !== 'free'
      })),

      // Cancella abbonamento
      cancelSubscription: () => set(() => ({
        subscriptionPlan: SUBSCRIPTION_PLANS[0],
        isSubscribed: false
      })),

      // Imposta prossimo aggiornamento
      setNextUpdate: (timestamp) => set(() => ({
        nextUpdate: timestamp
      })),

      // Imposta stato aggiornamento
      setIsUpdating: (updating) => set(() => ({
        isUpdating: updating
      })),

      // Aggiorna countdown
      updateCountdown: () => set((state) => {
        const now = Date.now();
        const remaining = Math.max(0, state.nextUpdate - now);
        return { countdown: remaining };
      })
    }),
    {
      name: 'api-manager-storage',
      partialize: (state) => ({
        usage: state.usage,
        isSubscribed: state.isSubscribed,
        subscriptionPlan: state.subscriptionPlan,
        nextUpdate: state.nextUpdate
      })
    }
  )
);

// Utility functions
export const formatCountdown = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const canMakeRequest = (usage: ApiUsage, plan: SubscriptionPlan): boolean => {
  return usage.requests < plan.requests;
};

export const getUsagePercentage = (usage: ApiUsage, plan: SubscriptionPlan): number => {
  return Math.min(100, (usage.requests / plan.requests) * 100);
};

export const getRemainingRequests = (usage: ApiUsage, plan: SubscriptionPlan): number => {
  return Math.max(0, plan.requests - usage.requests);
};

// Hook per il countdown in tempo reale
export const useCountdown = () => {
  const { countdown, updateCountdown, nextUpdate } = useApiManager();
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [updateCountdown]);
  
  return {
    countdown,
    formattedCountdown: formatCountdown(countdown),
    nextUpdate
  };
};

// Gestione automatica degli aggiornamenti
export const scheduleNextUpdate = (plan: SubscriptionPlan) => {
  const intervalMs = plan.updateInterval * 60 * 1000; // Converti minuti in millisecondi
  const nextUpdate = Date.now() + intervalMs;
  
  useApiManager.getState().setNextUpdate(nextUpdate);
  
  return nextUpdate;
};

// Verifica se è il momento di aggiornare
export const shouldUpdate = (nextUpdate: number): boolean => {
  return Date.now() >= nextUpdate;
}; 