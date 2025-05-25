'use client';

import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DataSourceToggleProps {
  useRealData: boolean;
  onToggle: () => void;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  apiStatus: {
    status: string;
    remainingRequests: string | null;
    usedRequests: string | null;
  } | null;
  onRefresh: () => void;
}

export default function DataSourceToggle({
  useRealData,
  onToggle,
  loading,
  error,
  lastUpdate,
  apiStatus,
  onRefresh
}: DataSourceToggleProps) {
  const formatLastUpdate = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Toggle Switch */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                useRealData ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  useRealData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              {useRealData ? (
                <Wifi className="h-5 w-5 text-primary-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-gray-400" />
              )}
              <span className="font-medium text-gray-900">
                {useRealData ? 'Quote Reali' : 'Dati Simulati'}
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {useRealData && (
              <>
                {loading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Caricamento...</span>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Errore API</span>
                  </div>
                )}
                
                {!loading && !error && lastUpdate && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Connesso</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls and Info */}
        <div className="flex items-center space-x-4">
          {useRealData && (
            <>
              {/* Last Update */}
              {lastUpdate && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Aggiornato: {formatLastUpdate(lastUpdate)}</span>
                </div>
              )}

              {/* API Status */}
              {apiStatus && (
                <div className="text-sm text-gray-600">
                  <span>Richieste: {apiStatus.usedRequests || 0}</span>
                  {apiStatus.remainingRequests && (
                    <span className="ml-2">Rimanenti: {apiStatus.remainingRequests}</span>
                  )}
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Aggiorna</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {useRealData && error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Errore nel caricamento delle quote reali</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Verifica la connessione internet e la validità della chiave API. 
                Puoi continuare ad usare i dati simulati.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Message */}
      {useRealData && !error && !loading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Quote reali attive</h4>
              <p className="text-sm text-blue-700 mt-1">
                Le quote vengono aggiornate automaticamente ogni 5 minuti da The Odds API.
                Include Serie A, Premier League, La Liga, Bundesliga, Champions League e altri sport.
              </p>
            </div>
          </div>
        </div>
      )}

      {!useRealData && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <WifiOff className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Modalità simulazione</h4>
              <p className="text-sm text-gray-700 mt-1">
                Stai visualizzando dati simulati per scopi dimostrativi. 
                Attiva "Quote Reali" per vedere le quote live dai bookmakers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 