'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Zap, RefreshCw } from 'lucide-react';
import { useApiManager, formatCountdown } from '@/lib/apiManager';

interface CountdownTimerProps {
  className?: string;
  showDetails?: boolean;
}

export default function CountdownTimer({ className = '', showDetails = true }: CountdownTimerProps) {
  const { 
    countdown, 
    nextUpdate, 
    isUpdating, 
    subscriptionPlan, 
    updateCountdown 
  } = useApiManager();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Aggiorna il countdown ogni secondo
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateCountdown]);

  if (!mounted) {
    return (
      <div className={`animate-pulse bg-dark-800 rounded-lg p-4 ${className}`}>
        <div className="h-6 bg-dark-700 rounded mb-2"></div>
        <div className="h-4 bg-dark-700 rounded w-3/4"></div>
      </div>
    );
  }

  const formattedCountdown = formatCountdown(countdown);
  const isNearUpdate = countdown < 60000; // Meno di 1 minuto
  const progressPercentage = subscriptionPlan 
    ? Math.max(0, 100 - (countdown / (subscriptionPlan.updateInterval * 60 * 1000)) * 100)
    : 0;

  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${
            isUpdating 
              ? 'bg-accent-500/20 text-accent-400' 
              : isNearUpdate 
                ? 'bg-warning-500/20 text-warning-400'
                : 'bg-primary-500/20 text-primary-400'
          }`}>
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              {isUpdating ? 'Aggiornamento in corso...' : 'Prossimo aggiornamento'}
            </h3>
            {showDetails && subscriptionPlan && (
              <p className="text-xs text-dark-400">
                Piano {subscriptionPlan.name} • Ogni {subscriptionPlan.updateInterval === 1 ? '1 minuto' : 
                  subscriptionPlan.updateInterval < 1 ? '30 secondi' : 
                  `${subscriptionPlan.updateInterval} minuti`}
              </p>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isUpdating 
            ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' 
            : isNearUpdate 
              ? 'bg-warning-500/20 text-warning-400 border border-warning-500/30'
              : 'bg-success-500/20 text-success-400 border border-success-500/30'
        }`}>
          {isUpdating ? 'LIVE' : isNearUpdate ? 'PRESTO' : 'ATTIVO'}
        </div>
      </div>

      {/* Countdown Display */}
      {!isUpdating && (
        <div className="space-y-3">
          {/* Timer principale */}
          <div className="text-center">
            <div className={`text-2xl font-bold font-mono ${
              isNearUpdate ? 'text-warning-400' : 'text-white'
            }`}>
              {formattedCountdown}
            </div>
            <div className="text-xs text-dark-400 mt-1">
              {new Date(nextUpdate).toLocaleTimeString('it-IT')}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-dark-400">
              <span>Progresso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  isNearUpdate 
                    ? 'bg-gradient-to-r from-warning-500 to-warning-400' 
                    : 'bg-gradient-to-r from-primary-500 to-primary-400'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          {showDetails && (
            <div className="flex items-center justify-between pt-2 border-t border-dark-700">
              <div className="flex items-center space-x-1 text-xs text-dark-400">
                <Zap className="h-3 w-3" />
                <span>Auto-refresh attivo</span>
              </div>
              <button 
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                onClick={() => window.location.reload()}
              >
                Aggiorna ora
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isUpdating && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-accent-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Sincronizzazione quote...</span>
          </div>
          <div className="mt-2 text-xs text-dark-400">
            Aggiornamento da {subscriptionPlan?.name || 'API'} in corso
          </div>
        </div>
      )}
    </div>
  );
} 