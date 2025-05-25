'use client';

import React, { useState, useEffect } from 'react';
import { optimizedOddsApi } from '@/lib/optimizedOddsApi';

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function DebugPanel({ isVisible, onToggle }: DebugPanelProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshDebugInfo = async () => {
    setIsLoading(true);
    try {
      const [apiStatus, detailedStats] = await Promise.all([
        optimizedOddsApi.getApiStatus(),
        optimizedOddsApi.getDetailedStats()
      ]);

      setDebugInfo({
        apiStatus,
        detailedStats,
        timestamp: new Date().toLocaleTimeString('it-IT')
      });
    } catch (error) {
      console.error('Errore nel recupero info debug:', error);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        timestamp: new Date().toLocaleTimeString('it-IT')
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      refreshDebugInfo();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Apri pannello debug"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md w-full max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">🔧 Debug Panel</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshDebugInfo}
            disabled={isLoading}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {debugInfo ? (
        <div className="space-y-3 text-xs">
          <div className="text-gray-500">
            Ultimo aggiornamento: {debugInfo.timestamp}
          </div>

          {debugInfo.error ? (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="font-medium text-red-800">Errore</div>
              <div className="text-red-600">{debugInfo.error}</div>
            </div>
          ) : (
            <>
              {/* Stato API */}
              <div className="bg-gray-50 border border-gray-200 rounded p-2">
                <div className="font-medium text-gray-800 mb-1">Stato API</div>
                <div className="space-y-1">
                  <div>
                    Status: <span className={`font-medium ${debugInfo.apiStatus?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {debugInfo.apiStatus?.isActive ? 'Attiva' : 'Inattiva'}
                    </span>
                  </div>
                  <div>Chiave corrente: {debugInfo.apiStatus?.currentKey}/{debugInfo.apiStatus?.totalKeys}</div>
                  <div>Cache size: {debugInfo.apiStatus?.cacheSize || 0}</div>
                  <div>
                    Modalità emergenza: <span className={`font-medium ${debugInfo.apiStatus?.isEmergencyMode ? 'text-red-600' : 'text-green-600'}`}>
                      {debugInfo.apiStatus?.isEmergencyMode ? 'SÌ' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistiche dettagliate */}
              {debugInfo.detailedStats && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <div className="font-medium text-blue-800 mb-1">Statistiche Utilizzo</div>
                  <div className="space-y-1">
                    <div>
                      Richieste: {debugInfo.detailedStats.totalRequests?.used || 0}/{debugInfo.detailedStats.totalRequests?.limit || 500}
                    </div>
                    <div>
                      Rimanenti: {debugInfo.detailedStats.totalRequests?.remaining || 0}
                    </div>
                    <div>
                      Utilizzo: {debugInfo.detailedStats.totalRequests?.percentage || 0}%
                    </div>
                  </div>
                </div>
              )}

              {/* Azioni rapide */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="font-medium text-yellow-800 mb-1">Azioni</div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      optimizedOddsApi.cleanExpiredCache();
                      refreshDebugInfo();
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 w-full"
                  >
                    Pulisci Cache
                  </button>
                  <button
                    onClick={() => {
                      optimizedOddsApi.forceUpdateSport('soccer_italy_serie_a');
                      setTimeout(refreshDebugInfo, 2000);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 w-full"
                  >
                    Aggiorna Serie A
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Caricamento info debug...
        </div>
      )}
    </div>
  );
} 