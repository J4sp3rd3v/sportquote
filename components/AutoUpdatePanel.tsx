'use client';

import React, { useState } from 'react';
import { X, Play, Square, RefreshCw, Clock, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';

interface AutoUpdatePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AutoUpdatePanel({ isOpen, onClose }: AutoUpdatePanelProps) {
  const autoUpdate = useAutoUpdate();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleForceUpdate = async () => {
    if (!autoUpdate.canRequestManualUpdate) {
      alert('Limite API quasi raggiunto. Aggiornamento manuale non consentito.');
      return;
    }

    setIsUpdating(true);
    try {
      await autoUpdate.forceUpdate();
    } catch (error) {
      console.error('Errore nell\'aggiornamento forzato:', error);
      alert('Errore durante l\'aggiornamento: ' + (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = () => {
    if (!autoUpdate.isRunning) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (!autoUpdate.isRunning) return <Square className="h-5 w-5 text-red-600" />;
    return <Play className="h-5 w-5 text-green-600" />;
  };

  const getApiUsageColor = () => {
    const percentage = (autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getApiUsageBg = () => {
    const percentage = (autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests) * 100;
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Sistema Aggiornamento Automatico</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stato Sistema */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              {getStatusIcon()}
              <span className="ml-2">Stato Sistema</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Stato</p>
                <p className={`font-medium ${getStatusColor()}`}>
                  {autoUpdate.isRunning ? 'Attivo' : 'Inattivo'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Intervallo</p>
                <p className="font-medium text-gray-900">{autoUpdate.stats.updateInterval} minuti</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aggiornamenti Totali</p>
                <p className="font-medium text-gray-900">{autoUpdate.stats.totalUpdates}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prossimo Aggiornamento</p>
                <p className="font-medium text-blue-600">{autoUpdate.timeToNextUpdate}</p>
              </div>
            </div>
          </div>

          {/* Utilizzo API */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="ml-2">Utilizzo API</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Richieste utilizzate</span>
                <span className={`font-medium ${getApiUsageColor()}`}>
                  {autoUpdate.stats.apiRequestsUsed} / {autoUpdate.stats.maxApiRequests}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getApiUsageBg()}`}
                  style={{ 
                    width: `${Math.min((autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  Percentuale utilizzo: {Math.round((autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests) * 100)}%
                </span>
                <span className="text-gray-600">
                  Rimanenti: {autoUpdate.stats.maxApiRequests - autoUpdate.stats.apiRequestsUsed}
                </span>
              </div>
            </div>
          </div>

          {/* Informazioni Temporali */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="ml-2">Informazioni Temporali</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-gray-600">Ultimo Aggiornamento</p>
                <p className="font-medium text-gray-900">
                  {autoUpdate.formattedLastUpdate}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prossimo Aggiornamento Programmato</p>
                <p className="font-medium text-gray-900">
                  {autoUpdate.stats.nextUpdate 
                    ? autoUpdate.stats.nextUpdate.toLocaleString('it-IT')
                    : 'Non programmato'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Messaggio Limiti */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {autoUpdate.canRequestManualUpdate ? (
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-blue-800">{autoUpdate.limitMessage}</p>
                {!autoUpdate.canRequestManualUpdate && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Per aggiornamenti in tempo reale e senza limiti, considera l'upgrade a un piano premium.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Controlli */}
          <div className="flex flex-wrap gap-3">
            {autoUpdate.isRunning ? (
              <button
                onClick={autoUpdate.stopAutoUpdate}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="h-4 w-4" />
                <span>Ferma Sistema</span>
              </button>
            ) : (
              <button
                onClick={autoUpdate.startAutoUpdate}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Avvia Sistema</span>
              </button>
            )}

            <button
              onClick={handleForceUpdate}
              disabled={!autoUpdate.canRequestManualUpdate || isUpdating}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoUpdate.canRequestManualUpdate && !isUpdating
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Aggiornando...' : 'Aggiornamento Manuale'}</span>
            </button>

            <button
              onClick={autoUpdate.refreshStats}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Aggiorna Statistiche</span>
            </button>
          </div>

          {/* Note */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Il sistema si aggiorna automaticamente ogni ora per ottimizzare l'uso delle API</p>
            <p>• Gli aggiornamenti manuali sono limitati quando l'utilizzo API supera il 90%</p>
            <p>• Il sistema si ferma automaticamente quando l'utilizzo API raggiunge il 95%</p>
            <p>• Per aggiornamenti più frequenti, considera l'upgrade a un piano premium</p>
          </div>
        </div>
      </div>
    </div>
  );
} 