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
  onForceUpdate
}: DailyUpdateStatusProps) {
  
  const getStatusIcon = () => {
    if (isUpdating) return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
    if (errors.length > 0) return <XCircle className="h-5 w-5 text-red-400" />;
    if (isDataFresh && matchesCount > 0) return <CheckCircle className="h-5 w-5 text-green-400" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
  };

  const getStatusText = () => {
    if (isUpdating) return 'Aggiornamento in corso...';
    if (errors.length > 0) return 'Errore aggiornamento';
    if (isDataFresh && matchesCount > 0) return 'Dati aggiornati oggi';
    return 'In attesa aggiornamento';
  };

  const getStatusColor = () => {
    if (isUpdating) return 'border-blue-500 bg-blue-500/10';
    if (errors.length > 0) return 'border-red-500 bg-red-500/10';
    if (isDataFresh && matchesCount > 0) return 'border-green-500 bg-green-500/10';
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

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-white">Sistema Aggiornamento Giornaliero</span>
        </div>
        
        <button
          onClick={onForceUpdate}
          disabled={isUpdating}
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
          {isDataFresh ? 
            `${matchesCount} partite caricate oggi` : 
            'Nessuna partita disponibile'
          }
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
      <div className="grid grid-cols-3 gap-3 text-center text-sm border-t border-dark-600 pt-3">
        <div>
          <div className="text-dark-400">Partite</div>
          <div className="font-bold text-white">{matchesCount}</div>
        </div>
        <div>
          <div className="text-dark-400">Aggiornamenti</div>
          <div className="font-bold text-white">{updateCount}</div>
        </div>
        <div>
          <div className="text-dark-400">Stato</div>
          <div className={`font-bold ${isDataFresh ? 'text-green-400' : 'text-yellow-400'}`}>
            {isDataFresh ? 'Fresco' : 'Vecchio'}
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

      {/* Info sistema */}
      <div className="mt-4 p-2 bg-dark-800/50 rounded text-xs text-dark-400">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>Aggiornamento automatico alle 12:00 ogni giorno</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Clock className="h-3 w-3" />
          <span>Quote valide per 24 ore - Condivise da tutti gli utenti</span>
        </div>
      </div>
    </div>
  );
} 