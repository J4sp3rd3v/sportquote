'use client';

import React from 'react';
import { Clock, RefreshCw, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface DailyUpdateStatusProps {
  lastUpdate: Date | null;
  nextUpdate: Date | null;
  isDataFresh: boolean;
  isUpdating: boolean;
  matchesCount: number;
  updateCount: number;
  hoursUntilNext: number;
  minutesUntilNext: number;
  errors: string[];
  onForceUpdate: () => void;
  requestsUsed?: number;
  requestsRemaining?: number;
  updatedToday?: boolean;
}

export default function DailyUpdateStatus({
  lastUpdate,
  nextUpdate,
  isDataFresh,
  isUpdating,
  matchesCount,
  updateCount,
  hoursUntilNext,
  minutesUntilNext,
  errors,
  onForceUpdate,
  requestsUsed = 0,
  requestsRemaining = 500,
  updatedToday = false
}: DailyUpdateStatusProps) {
  
  const getStatusIcon = () => {
    if (isUpdating) return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
    if (errors.length > 0) return <XCircle className="h-5 w-5 text-red-400" />;
    if (updatedToday && matchesCount > 0) return <CheckCircle className="h-5 w-5 text-green-400" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
  };

  const getStatusText = () => {
    if (isUpdating) return 'Aggiornamento in corso...';
    if (errors.length > 0) return 'Errore aggiornamento';
    if (updatedToday && matchesCount > 0) return 'Aggiornato oggi alle 12:00';
    if (updatedToday && matchesCount === 0) return 'Aggiornato oggi - Nessuna partita';
    return 'In attesa aggiornamento giornaliero';
  };

  const getStatusColor = () => {
    if (isUpdating) return 'border-blue-500 bg-blue-500/10';
    if (errors.length > 0) return 'border-red-500 bg-red-500/10';
    if (updatedToday && matchesCount > 0) return 'border-green-500 bg-green-500/10';
    return 'border-yellow-500 bg-yellow-500/10';
  };

  const formatTimeUntilNext = () => {
    if (hoursUntilNext === 0 && minutesUntilNext === 0) {
      return 'Aggiornamento imminente';
    }
    
    if (hoursUntilNext > 0) {
      return `${hoursUntilNext}h ${minutesUntilNext}m`;
    }
    
    return `${minutesUntilNext}m`;
  };

  const getApiUsageColor = () => {
    const percentage = (requestsUsed / 500) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-white">Sistema Aggiornamento Giornaliero</span>
          <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
            API Reale
          </span>
        </div>
        
        <button
          onClick={onForceUpdate}
          disabled={isUpdating || requestsRemaining <= 0}
          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
        >
          {isUpdating ? 'Aggiornando...' : 'Aggiorna Ora'}
        </button>
      </div>

      {/* Status principale */}
      <div className="mb-4">
        <div className="text-lg font-semibold text-white mb-1">
          {getStatusText()}
        </div>
        <div className="text-sm text-dark-300">
          {matchesCount > 0 ? 
            `${matchesCount} partite reali caricate` : 
            'Nessuna partita disponibile oggi'
          }
        </div>
      </div>

      {/* Utilizzo API */}
      <div className="mb-4 p-3 bg-dark-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-300">Utilizzo API Mensile</span>
          <span className={`text-sm font-bold ${getApiUsageColor()}`}>
            {requestsUsed}/500
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              requestsUsed >= 450 ? 'bg-red-500' : 
              requestsUsed >= 350 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((requestsUsed / 500) * 100, 100)}%` }}
          />
        </div>
        <div className="text-xs text-dark-400 mt-1">
          {requestsRemaining} richieste rimanenti questo mese
        </div>
      </div>

      {/* Informazioni temporali */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-dark-400 text-xs mb-1">Ultimo Aggiornamento</div>
          <div className="font-bold text-white text-sm">
            {lastUpdate ? (
              <>
                <div>{lastUpdate.toLocaleDateString('it-IT')}</div>
                <div className="text-xs text-dark-300">{lastUpdate.toLocaleTimeString('it-IT')}</div>
              </>
            ) : (
              'Mai'
            )}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-dark-400 text-xs mb-1">Prossimo Aggiornamento</div>
          <div className="font-bold text-white text-sm">
            {nextUpdate ? (
              <>
                <div>{nextUpdate.toLocaleDateString('it-IT')}</div>
                <div className="text-xs text-primary-400">ore 12:00</div>
              </>
            ) : (
              'Non programmato'
            )}
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="text-center mb-4">
        <div className="text-dark-400 text-xs mb-1">Tempo rimanente</div>
        <div className="text-xl font-bold text-primary-400">
          {formatTimeUntilNext()}
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-4 gap-3 text-center text-sm border-t border-dark-600 pt-3">
        <div>
          <div className="text-dark-400">Partite</div>
          <div className="font-bold text-white">{matchesCount}</div>
        </div>
        <div>
          <div className="text-dark-400">Richieste</div>
          <div className="font-bold text-white">{requestsUsed}</div>
        </div>
        <div>
          <div className="text-dark-400">Oggi</div>
          <div className={`font-bold ${updatedToday ? 'text-green-400' : 'text-yellow-400'}`}>
            {updatedToday ? '✓' : '✗'}
          </div>
        </div>
        <div>
          <div className="text-dark-400">Stato</div>
          <div className={`font-bold ${isDataFresh ? 'text-green-400' : 'text-yellow-400'}`}>
            {isDataFresh ? 'Fresco' : 'Cache'}
          </div>
        </div>
      </div>

      {/* Errori */}
      {errors.length > 0 && (
        <div className="mt-4 p-2 bg-red-900/30 border border-red-500/50 rounded">
          <div className="text-red-300 text-sm font-medium mb-1">Ultimi errori:</div>
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="text-red-300 text-xs">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avviso limite API */}
      {requestsUsed >= 450 && (
        <div className="mt-4 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded">
          <div className="text-yellow-300 text-sm font-medium mb-1">⚠️ Attenzione:</div>
          <div className="text-yellow-300 text-xs">
            Limite API quasi raggiunto. Evita aggiornamenti manuali non necessari.
          </div>
        </div>
      )}

      {/* Info sistema */}
      <div className="mt-4 p-2 bg-dark-800/50 rounded text-xs text-dark-400">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>Aggiornamento automatico alle 12:00 ogni giorno</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Clock className="h-3 w-3" />
          <span>Cache 24 ore - Una sola richiesta API al giorno</span>
        </div>
      </div>
    </div>
  );
} 