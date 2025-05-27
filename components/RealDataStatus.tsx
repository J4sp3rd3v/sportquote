'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Clock } from 'lucide-react';

interface RealDataStatusProps {
  hasRealData: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  stats: {
    requestsUsed: number;
    requestsRemaining: number;
    monthlyLimit: number;
    cacheSize: number;
    canMakeRequests: boolean;
  };
  onRefresh: () => void;
}

export default function RealDataStatus({
  hasRealData,
  isLoading,
  error,
  lastUpdate,
  stats,
  onRefresh
}: RealDataStatusProps) {
  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
    if (error) return <XCircle className="h-5 w-5 text-red-400" />;
    if (hasRealData) return <CheckCircle className="h-5 w-5 text-green-400" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Caricamento dati reali...';
    if (error) return 'Errore dati reali';
    if (hasRealData) return 'Dati reali attivi';
    return 'Nessun dato reale';
  };

  const getStatusColor = () => {
    if (isLoading) return 'border-blue-500 bg-blue-500/10';
    if (error) return 'border-red-500 bg-red-500/10';
    if (hasRealData) return 'border-green-500 bg-green-500/10';
    return 'border-yellow-500 bg-yellow-500/10';
  };

  const usagePercentage = (stats.requestsUsed / stats.monthlyLimit) * 100;

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-white">{getStatusText()}</span>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading || !stats.canMakeRequests}
          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
        >
          {isLoading ? 'Caricamento...' : 'Aggiorna'}
        </button>
      </div>

      {/* Messaggio di errore */}
      {error && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Statistiche API */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="text-center">
          <div className="text-dark-400">Richieste Usate</div>
          <div className="font-bold text-white">{stats.requestsUsed}/{stats.monthlyLimit}</div>
        </div>
        
        <div className="text-center">
          <div className="text-dark-400">Rimanenti</div>
          <div className={`font-bold ${stats.requestsRemaining > 50 ? 'text-green-400' : stats.requestsRemaining > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
            {stats.requestsRemaining}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-dark-400">Cache</div>
          <div className="font-bold text-blue-400">{stats.cacheSize} voci</div>
        </div>
        
        <div className="text-center">
          <div className="text-dark-400">Ultimo Aggiornamento</div>
          <div className="font-bold text-white text-xs">
            {lastUpdate ? lastUpdate.toLocaleTimeString('it-IT') : 'Mai'}
          </div>
        </div>
      </div>

      {/* Barra di utilizzo */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-dark-400 mb-1">
          <span>Utilizzo API Mensile</span>
          <span>{usagePercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              usagePercentage < 50 ? 'bg-green-500' : 
              usagePercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Avvisi */}
      {!stats.canMakeRequests && (
        <div className="mt-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm">
          🚫 Limite mensile API raggiunto. Nessuna nuova richiesta possibile.
        </div>
      )}

      {stats.requestsRemaining <= 10 && stats.canMakeRequests && (
        <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-yellow-300 text-sm">
          ⚠️ Attenzione: Solo {stats.requestsRemaining} richieste rimanenti questo mese.
        </div>
      )}

      {hasRealData && (
        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/50 rounded text-green-300 text-sm">
          ✅ Sistema attivo con dati reali: Ligue 1, Champions League, NBA, NFL, NHL, UFC/MMA
        </div>
      )}

      {!hasRealData && !error && (
        <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-yellow-300 text-sm">
          ⚠️ Nessun dato reale disponibile. Solo sport con partite verificate: Ligue 1, Champions League, NBA, NFL, NHL, UFC/MMA
        </div>
      )}
    </div>
  );
} 