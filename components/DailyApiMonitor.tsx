'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Activity, TrendingUp, AlertCircle, Calendar, Target } from 'lucide-react';
import { dailyApiManager } from '@/lib/dailyApiManager';

export default function DailyApiMonitor() {
  const [stats, setStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const dailyStats = dailyApiManager.getDailyStats();
      setStats(dailyStats);
    };

    // Aggiorna subito
    updateStats();

    // Aggiorna ogni 30 secondi
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-dark-600 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-dark-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'text-success-400';
    if (percentage < 80) return 'text-warning-400';
    return 'text-red-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-success-500';
    if (percentage < 80) return 'bg-warning-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <Activity className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Monitor API Giornaliero</h3>
            <p className="text-sm text-dark-300">
              Chiave: 4815fd45...
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
        >
          {isExpanded ? 'Nascondi' : 'Dettagli'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Richieste Oggi */}
        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-300 text-sm">Oggi</span>
            <Calendar className="h-4 w-4 text-primary-400" />
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {stats.today.used}/{stats.today.quota}
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(stats.today.percentage)}`}
              style={{ width: `${Math.min(stats.today.percentage, 100)}%` }}
            ></div>
          </div>
          <div className={`text-xs ${getStatusColor(stats.today.percentage)}`}>
            {stats.today.remaining} rimanenti
          </div>
        </div>

        {/* Richieste Mese */}
        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-300 text-sm">Questo Mese</span>
            <TrendingUp className="h-4 w-4 text-warning-400" />
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {stats.month.used}/{stats.month.limit}
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(stats.month.percentage)}`}
              style={{ width: `${Math.min(stats.month.percentage, 100)}%` }}
            ></div>
          </div>
          <div className={`text-xs ${getStatusColor(stats.month.percentage)}`}>
            {stats.month.remaining} rimanenti
          </div>
        </div>

        {/* Sport Aggiornati */}
        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-300 text-sm">Sport Oggi</span>
            <Target className="h-4 w-4 text-accent-400" />
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {stats.sports.updatedToday}/{stats.sports.total}
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2 mb-2">
            <div 
              className="h-2 rounded-full bg-accent-500 transition-all duration-300"
              style={{ width: `${(stats.sports.updatedToday / stats.sports.total) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-accent-400">
            {stats.sports.remaining} da aggiornare
          </div>
        </div>
      </div>

      {/* Ultimo Aggiornamento */}
      {stats.lastUpdate && (
        <div className="bg-dark-700/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-success-400" />
              <span className="text-sm text-dark-300">Ultimo aggiornamento:</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {stats.lastUpdate.time}
              </div>
              <div className="text-xs text-dark-400">
                {stats.lastUpdate.relative}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prossimo Aggiornamento */}
      <div className="bg-primary-900/20 border border-primary-500/30 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${stats.nextUpdate.available ? 'bg-success-400 animate-pulse' : 'bg-warning-400'}`}></div>
            <span className="text-sm text-primary-300">Prossimo aggiornamento:</span>
          </div>
          <div className="text-sm text-white">
            {stats.nextUpdate.message}
          </div>
        </div>
      </div>

      {/* Dettagli Espansi */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-dark-700">
          <h4 className="text-sm font-semibold text-white mb-3">Dettagli Sistema</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Frequenza aggiornamenti:</span>
                <span className="text-white">Giornaliera</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Sport supportati:</span>
                <span className="text-white">6</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Limite giornaliero:</span>
                <span className="text-white">6 richieste</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Limite mensile:</span>
                <span className="text-white">500 richieste</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Modalità:</span>
                <span className="text-success-400">Ottimizzata</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Cache TTL:</span>
                <span className="text-white">24 ore</span>
              </div>
            </div>
          </div>

          {/* Avviso Importante */}
          <div className="mt-4 bg-warning-900/20 border border-warning-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-warning-400 mt-0.5" />
              <div className="text-warning-200 text-sm">
                <strong>Sistema Ottimizzato:</strong> Ogni sport viene aggiornato una volta al giorno per preservare le 500 richieste mensili. 
                Per aggiornamenti più frequenti, considera l'upgrade al piano Pro.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 