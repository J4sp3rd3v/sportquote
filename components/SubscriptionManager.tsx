'use client';

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Zap, 
  Check, 
  X, 
  Star, 
  TrendingUp, 
  Shield, 
  Clock,
  BarChart3,
  Download,
  Users
} from 'lucide-react';
import { 
  getSubscriptionManager, 
  SUBSCRIPTION_PLANS, 
  SubscriptionPlan,
  UserSubscription
} from '@/lib/subscriptionManager';

interface SubscriptionManagerProps {
  className?: string;
}

export default function SubscriptionManager({ className = '' }: SubscriptionManagerProps) {
  const [subscriptionManager] = useState(() => getSubscriptionManager());
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [usageStats, setUsageStats] = useState({
    requestsUsed: 0,
    requestsLimit: 0,
    percentageUsed: 0,
    daysRemaining: 0,
    updateFrequency: 'Non disponibile'
  });
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Aggiorna i dati dell'abbonamento
  const updateSubscriptionData = () => {
    const subscription = subscriptionManager.getCurrentSubscription();
    const plan = subscriptionManager.getCurrentPlan();
    const stats = subscriptionManager.getUsageStats();
    
    setCurrentSubscription(subscription);
    setCurrentPlan(plan);
    setUsageStats(stats);
  };

  useEffect(() => {
    updateSubscriptionData();
    
    // Aggiorna ogni 30 secondi
    const interval = setInterval(updateSubscriptionData, 30000);
    
    return () => clearInterval(interval);
  }, [subscriptionManager]);

  const handleUpgrade = (plan: SubscriptionPlan) => {
    const success = subscriptionManager.changePlan(plan.id);
    if (success) {
      updateSubscriptionData();
      if (plan.id !== 'free') {
        alert(`Piano ${plan.name} attivato con successo! 🎉`);
      }
    } else {
      alert('Errore nell\'attivazione del piano. Riprova.');
    }
    setSelectedPlan(null);
  };

  const handleCancel = () => {
    const success = subscriptionManager.changePlan('free');
    if (success) {
      updateSubscriptionData();
      alert('Piano cancellato. Sei tornato al piano gratuito.');
    }
    setShowCancelConfirm(false);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Users className="h-5 w-5" />;
      case 'pro': return <Crown className="h-5 w-5" />;
      case 'premium': return <Star className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'text-dark-400 border-dark-600';
      case 'pro': return 'text-primary-400 border-primary-500';
      case 'premium': return 'text-accent-400 border-accent-500';
      default: return 'text-dark-400 border-dark-600';
    }
  };

  const getPlanBgColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'bg-dark-600 text-dark-400';
      case 'pro': return 'bg-primary-500/20 text-primary-400';
      case 'premium': return 'bg-accent-500/20 text-accent-400';
      default: return 'bg-dark-600 text-dark-400';
    }
  };

  if (!currentSubscription || !currentPlan) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Plan Status */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getPlanBgColor(currentPlan.id)}`}>
              {getPlanIcon(currentPlan.id)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Piano {currentPlan.name}
              </h3>
              <p className="text-sm text-dark-400">
                {currentPlan.price > 0 ? `€${currentPlan.price}/${currentPlan.interval === 'month' ? 'mese' : 'anno'}` : 'Gratuito'}
              </p>
            </div>
          </div>
          
          {currentPlan.id !== 'free' && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="px-3 py-1 text-xs text-danger-400 border border-danger-500/30 rounded-lg hover:bg-danger-500/10 transition-colors"
            >
              Cancella
            </button>
          )}
        </div>

        {/* Usage Stats */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dark-400">Richieste utilizzate</span>
              <span className="text-white">
                {usageStats.requestsUsed.toLocaleString()} / {usageStats.requestsLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  usageStats.percentageUsed > 90 
                    ? 'bg-gradient-to-r from-danger-500 to-danger-400' 
                    : usageStats.percentageUsed > 70
                      ? 'bg-gradient-to-r from-warning-500 to-warning-400'
                      : 'bg-gradient-to-r from-success-500 to-success-400'
                }`}
                style={{ width: `${Math.min(100, usageStats.percentageUsed)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-dark-400 mt-1">
              <span>{usageStats.percentageUsed}% utilizzato</span>
              <span>{(usageStats.requestsLimit - usageStats.requestsUsed).toLocaleString()} rimanenti</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-primary-400" />
                <span className="text-xs text-dark-400">Aggiornamenti</span>
              </div>
              <div className="text-sm font-medium text-white">
                {usageStats.updateFrequency}
              </div>
            </div>
            
            <div className="bg-dark-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-success-400" />
                <span className="text-xs text-dark-400">Giorni rimanenti</span>
              </div>
              <div className="text-sm font-medium text-white">
                {usageStats.daysRemaining} giorni
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Piani disponibili</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentPlan.id === plan.id;
            const isPopular = plan.popular;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-dark-800 border rounded-xl p-6 transition-all duration-200 hover:scale-105 ${
                  isCurrent 
                    ? getPlanColor(plan.id) + ' ring-2 ring-current/20' 
                    : 'border-dark-700 hover:border-dark-600'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      PIÙ POPOLARE
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-lg mb-3 ${getPlanBgColor(plan.id)}`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">{plan.name}</h4>
                  <p className="text-sm text-dark-400 mb-3">{plan.description}</p>
                  <div className="text-3xl font-bold text-white">
                    {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-dark-400">
                        /{plan.interval === 'month' ? 'mese' : 'anno'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-success-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-dark-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => isCurrent ? null : handleUpgrade(plan)}
                  disabled={isCurrent}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isCurrent
                      ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
                      : plan.id === 'premium'
                        ? 'bg-accent-gradient text-white hover:shadow-lg hover:shadow-accent-500/25'
                        : plan.id === 'pro'
                          ? 'bg-primary-gradient text-white hover:shadow-lg hover:shadow-primary-500/25'
                          : 'bg-dark-600 text-white hover:bg-dark-500'
                  }`}
                >
                  {isCurrent ? 'Piano Attuale' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Conferma Cancellazione</h3>
            <p className="text-dark-300 mb-6">
              Sei sicuro di voler cancellare il tuo abbonamento? Tornerai al piano gratuito con funzionalità limitate.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-danger-500 text-white py-2 px-4 rounded-lg hover:bg-danger-600 transition-colors"
              >
                Sì, Cancella
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-dark-700 text-white py-2 px-4 rounded-lg hover:bg-dark-600 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-white mb-1">Garanzia di Soddisfazione</h4>
            <p className="text-sm text-dark-400">
              Puoi cambiare o cancellare il tuo piano in qualsiasi momento. 
              I piani a pagamento includono una garanzia di rimborso di 7 giorni.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 