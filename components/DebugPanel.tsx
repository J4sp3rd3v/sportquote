'use client';

import React, { useState, useEffect } from 'react';
import { Bug, Database, Activity, Settings } from 'lucide-react';
import { unifiedApiManager } from '@/lib/unifiedApiManager';
import { optimizedOddsService } from '@/lib/optimizedOddsService';

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function DebugPanel({ isVisible, onToggle }: DebugPanelProps) {
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadDebugData();
    }
  }, [isVisible]);

  const loadDebugData = async () => {
    setIsLoading(true);
    
    try {
      // Ottieni statistiche dal sistema unificato
      const apiStats = unifiedApiManager.getDetailedStats();
      const serviceStats = optimizedOddsService.getServiceStats();
      
      // Ottieni configurazione sport
      const sportsConfig = unifiedApiManager.getSportsConfig();
      
      setDebugData({
        apiStats,
        serviceStats,
        sportsConfig,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Errore caricamento debug data:', error);
      setDebugData({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceReset = () => {
    if (confirm('Sei sicuro di voler resettare il sistema? Questo cancellerà cache e contatori.')) {
      unifiedApiManager.forceReset();
      loadDebugData();
    }
  };

  const handleTestNextSport = async () => {
    try {
      const result = await optimizedOddsService.updateNextSport();
      alert(result.success 
        ? `Sport ${result.sport} aggiornato con ${result.matches} partite`
        : `Errore: ${result.error}`
      );
      loadDebugData();
    } catch (error) {
      alert(`Errore test: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Apri Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Bug className="w-5 h-5 mr-2" />
          <span className="font-medium">Debug Panel</span>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-80">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Caricamento debug data...</p>
          </div>
        ) : debugData?.error ? (
          <div className="text-red-600 text-sm">
            Errore: {debugData.error}
          </div>
        ) : debugData ? (
          <div className="space-y-4">
            {/* API Stats */}
            <div>
              <div className="flex items-center mb-2">
                <Activity className="w-4 h-4 mr-1 text-blue-500" />
                <span className="font-medium text-sm">API Stats</span>
              </div>
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                <div>Oggi: {debugData.apiStats.daily.used}/{debugData.apiStats.daily.quota}</div>
                <div>Mese: {debugData.apiStats.monthly.used}/{debugData.apiStats.monthly.limit}</div>
                <div>Sport aggiornati: {debugData.apiStats.sports.updatedToday}/{debugData.apiStats.sports.total}</div>
                <div>Cache: {debugData.apiStats.cache.size} entries</div>
              </div>
            </div>

            {/* Service Stats */}
            <div>
              <div className="flex items-center mb-2">
                <Database className="w-4 h-4 mr-1 text-green-500" />
                <span className="font-medium text-sm">Service Stats</span>
              </div>
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                <div>Bookmaker: {debugData.serviceStats.bookmakers.total} totali</div>
                <div>Verificati: {debugData.serviceStats.bookmakers.verified}</div>
                <div>Premium: {debugData.serviceStats.bookmakers.premium}</div>
                <div>Sport supportati: {debugData.serviceStats.sports.supported}</div>
              </div>
            </div>

            {/* Sports Config */}
            <div>
              <div className="flex items-center mb-2">
                <Settings className="w-4 h-4 mr-1 text-purple-500" />
                <span className="font-medium text-sm">Sports Config</span>
              </div>
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                {debugData.sportsConfig.map((sport: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{sport.name}</span>
                    <span className={sport.enabled ? 'text-green-600' : 'text-red-600'}>
                      {sport.enabled ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={loadDebugData}
                className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Aggiorna Debug Data
              </button>
              <button
                onClick={handleTestNextSport}
                className="w-full px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Test Prossimo Sport
              </button>
              <button
                onClick={handleForceReset}
                className="w-full px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Reset Sistema
              </button>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500 text-center">
              Aggiornato: {new Date(debugData.timestamp).toLocaleTimeString('it-IT')}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 