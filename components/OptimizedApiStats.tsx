'use client';

import { useState, useEffect } from 'react';
import { optimizedOddsApi } from '@/lib/optimizedOddsApi';

interface ApiStatsProps {
  className?: string;
}

export default function OptimizedApiStats({ className = '' }: ApiStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const detailedStats = optimizedOddsApi.getDetailedStats();
        const apiStatus = await optimizedOddsApi.getApiStatus();
        
        setStats({
          ...detailedStats,
          apiStatus
        });
      } catch (error) {
        console.error('Errore caricamento statistiche:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    
    // Aggiorna ogni 30 secondi
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600 text-sm">❌ Errore nel caricamento statistiche API</p>
      </div>
    );
  }

  const { totalRequests, keyStats, cacheStats, systemStatus, apiStatus } = stats;

  const getStatusColor = (percentage: number) => {
    if (percentage < 60) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage < 60) return '🟢';
    if (percentage < 80) return '🟡';
    return '🔴';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Statistiche API Ottimizzata
        </h3>
        <div className="flex items-center space-x-2">
          {systemStatus.isEmergencyMode && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              🚨 Modalità Emergenza
            </span>
          )}
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Chiave {systemStatus.currentKey}/{keyStats.length}
          </span>
        </div>
      </div>

      {/* Utilizzo Totale */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Utilizzo Totale</span>
          <span className={`text-sm font-bold ${getStatusColor(totalRequests.percentage)}`}>
            {getStatusIcon(totalRequests.percentage)} {totalRequests.percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              totalRequests.percentage < 60 ? 'bg-green-500' :
              totalRequests.percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(totalRequests.percentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{totalRequests.used} usate</span>
          <span>{totalRequests.remaining} rimanenti</span>
          <span>{totalRequests.limit} totali</span>
        </div>
      </div>

      {/* Statistiche per Chiave */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Dettaglio per Chiave API</h4>
        <div className="space-y-2">
          {keyStats.map((key: any, index: number) => {
            const percentage = Math.round((key.requestsUsed / 500) * 100);
            return (
              <div key={index} className="bg-gray-50 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">
                    Chiave {index + 1} {index === systemStatus.currentKey - 1 && '(Attiva)'}
                  </span>
                  <span className={`text-xs ${getStatusColor(percentage)}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      percentage < 60 ? 'bg-green-400' :
                      percentage < 80 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{key.requestsUsed}/500</span>
                  <span>{key.requestsRemaining} rimanenti</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cache e Sistema */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded p-3">
          <div className="text-xs text-blue-600 font-medium mb-1">Cache</div>
          <div className="text-lg font-bold text-blue-800">{cacheStats.size}</div>
          <div className="text-xs text-blue-600">elementi salvati</div>
        </div>
        <div className={`rounded p-3 ${apiStatus?.isActive ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`text-xs font-medium mb-1 ${apiStatus?.isActive ? 'text-green-600' : 'text-red-600'}`}>
            Stato API
          </div>
          <div className={`text-lg font-bold ${apiStatus?.isActive ? 'text-green-800' : 'text-red-800'}`}>
            {apiStatus?.isActive ? '✅ Attiva' : '❌ Non Attiva'}
          </div>
          <div className={`text-xs ${apiStatus?.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {apiStatus?.isActive ? 'Funzionante' : 'Errore connessione'}
          </div>
        </div>
      </div>

      {/* Ultimi Aggiornamenti */}
      {systemStatus.lastUpdates && Object.keys(systemStatus.lastUpdates).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ultimi Aggiornamenti</h4>
          <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
            {Object.entries(systemStatus.lastUpdates).map(([sport, timestamp]) => (
              <div key={sport} className="flex justify-between text-xs text-gray-600 py-1">
                <span className="font-medium">{sport}</span>
                <span>{new Date(timestamp as number).toLocaleTimeString('it-IT')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Azioni */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => optimizedOddsApi.cleanExpiredCache()}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
          >
            🧹 Pulisci Cache
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
          >
            🔄 Ricarica
          </button>
        </div>
      </div>
    </div>
  );
} 