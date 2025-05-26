'use client';

import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { 
  useApiManager, 
  SUBSCRIPTION_PLANS, 
  SubscriptionPlan,
  getUsagePercentage,
  getRemainingRequests
} from '@/lib/apiManager';

interface SubscriptionManagerProps {
  className?: string;
}

export default function SubscriptionManager({ className = '' }: SubscriptionManagerProps) {
  const { 
    usage, 
    subscriptionPlan, 
    isSubscribed, 
    setSubscription, 
    cancelSubscription 
  } = useApiManager();
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentUsagePercentage = subscriptionPlan ? getUsagePercentage(usage, subscriptionPlan) : 0;
  const remainingRequests = subscriptionPlan ? getRemainingRequests(usage, subscriptionPlan) : 0;

  const handleUpgrade = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      cancelSubscription();
    } else {
      setSubscription(plan);
      // Qui andresti alla pagina di pagamento
      alert(`Reindirizzamento al pagamento per il piano ${plan.name}...`);
    }
    setSelectedPlan(null);
  };

  const handleCancel = () => {
    cancelSubscription();
    setShowCancelConfirm(false);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Shield className="h-5 w-5" />;
      case 'pro': return <Zap className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Plan Status */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              subscriptionPlan?.id === 'premium' 
                ? 'bg-accent-500/20 text-accent-400' 
                : subscriptionPlan?.id === 'pro'
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-dark-600 text-dark-400'
            }`}>
              {getPlanIcon(subscriptionPlan?.id || 'free')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Piano {subscriptionPlan?.name}
              </h3>
              <p className="text-sm text-dark-400">
                {isSubscribed ? `€${subscriptionPlan?.price}/mese` : 'Gratuito'}
              </p>
            </div>
          </div>
          
          {isSubscribed && (
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
                {usage.requests.toLocaleString()} / {subscriptionPlan?.requests.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  currentUsagePercentage > 90 
                    ? 'bg-gradient-to-r from-danger-500 to-danger-400' 
                    : currentUsagePercentage > 70
                      ? 'bg-gradient-to-r from-warning-500 to-warning-400'
                      : 'bg-gradient-to-r from-success-500 to-success-400'
                }`}
                style={{ width: `${Math.min(100, currentUsagePercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-dark-400 mt-1">
              <span>{Math.round(currentUsagePercentage)}% utilizzato</span>
              <span>{remainingRequests.toLocaleString()} rimanenti</span>
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
                Ogni {subscriptionPlan?.updateInterval === 1 ? '1 min' : 
                  subscriptionPlan?.updateInterval && subscriptionPlan.updateInterval < 1 ? '30 sec' : 
                  `${subscriptionPlan?.updateInterval} min`}
              </div>
            </div>
            
            <div className="bg-dark-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-success-400" />
                <span className="text-xs text-dark-400">Questo mese</span>
              </div>
              <div className="text-sm font-medium text-white">
                {usage.requests.toLocaleString()} richieste
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
            const isCurrent = subscriptionPlan?.id === plan.id;
            const isPopular = plan.id === 'pro';
            
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
                  <div className={`inline-flex p-3 rounded-lg mb-3 ${
                    plan.id === 'premium' 
                      ? 'bg-accent-500/20 text-accent-400' 
                      : plan.id === 'pro'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-dark-600 text-dark-400'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-white">
                    {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                    {plan.price > 0 && <span className="text-sm text-dark-400">/mese</span>}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-success-400 flex-shrink-0" />
                      <span className="text-sm text-dark-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => isCurrent ? null : setSelectedPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isCurrent
                      ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
                      : plan.id === 'premium'
                        ? 'bg-accent-gradient text-white hover:shadow-lg hover:shadow-accent-500/25'
                        : plan.id === 'pro'
                          ? 'bg-primary-gradient text-white hover:shadow-lg hover:shadow-primary-500/25'
                          : 'bg-dark-700 text-white hover:bg-dark-600'
                  }`}
                >
                  {isCurrent ? 'Piano attuale' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Conferma {selectedPlan.price === 0 ? 'downgrade' : 'upgrade'}
            </h3>
            <p className="text-dark-300 mb-6">
              {selectedPlan.price === 0 
                ? 'Sei sicuro di voler tornare al piano gratuito? Perderai l\'accesso alle funzionalità premium.'
                : `Stai per passare al piano ${selectedPlan.name} per €${selectedPlan.price}/mese.`
              }
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-2 px-4 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => handleUpgrade(selectedPlan)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  selectedPlan.price === 0
                    ? 'bg-danger-600 text-white hover:bg-danger-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Cancella abbonamento
            </h3>
            <p className="text-dark-300 mb-6">
              Sei sicuro di voler cancellare il tuo abbonamento? Tornerai al piano gratuito alla fine del periodo di fatturazione.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 px-4 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
              >
                Mantieni abbonamento
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2 px-4 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
              >
                Cancella
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 