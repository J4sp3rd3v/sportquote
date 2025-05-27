'use client';

import React, { useState } from 'react';
import { Play, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { unifiedApiManager } from '@/lib/unifiedApiManager';

interface ApiTestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
  requestsUsed?: number;
}

interface ApiTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiTestPanel({ isOpen, onClose }: ApiTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ApiTestResult[]>([]);

  const testApiCall = async () => {
    setIsLoading(true);
    
    try {
      const stats = unifiedApiManager.getDetailedStats();
      
      // Test chiamata API
      const nextSport = unifiedApiManager.getNextSportToUpdate();
      
      if (!nextSport) {
        setResults(prev => [...prev, {
          success: false,
          error: 'Nessuno sport da aggiornare disponibile',
          timestamp: Date.now()
        }]);
        return;
      }

      // Simula una chiamata API
      const result = await unifiedApiManager.updateSport(nextSport.key);
      
      setResults(prev => [...prev, {
        success: result.success,
        data: result.success ? { sport: nextSport.name, matches: result.matches } : undefined,
        error: result.success ? undefined : result.error,
        timestamp: Date.now(),
        requestsUsed: stats.daily.used + 1
      }]);
      
    } catch (error) {
      setResults(prev => [...prev, {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStats = () => {
    return unifiedApiManager.getDetailedStats();
  };

  if (!isOpen) return null;

  const stats = getStats();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Test API Sistema Unificato
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Statistiche API</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Oggi:</span>
                  <div className="font-semibold">{stats.daily.used}/{stats.daily.quota}</div>
                </div>
                <div>
                  <span className="text-gray-500">Mese:</span>
                  <div className="font-semibold">{stats.monthly.used}/{stats.monthly.limit}</div>
                </div>
                <div>
                  <span className="text-gray-500">Sport aggiornati:</span>
                  <div className="font-semibold">{stats.sports.updatedToday}/{stats.sports.total}</div>
                </div>
                <div>
                  <span className="text-gray-500">Cache:</span>
                  <div className="font-semibold">{stats.cache.size} entries</div>
                </div>
              </div>
            </div>

            {/* Test Controls */}
            <div className="mb-6">
              <div className="flex space-x-3">
                <button
                  onClick={testApiCall}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Testing...' : 'Test Prossimo Sport'}
                </button>
                <button
                  onClick={clearResults}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Pulisci Risultati
                </button>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Risultati Test ({results.length})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium text-sm">
                              {result.success ? 'Test Riuscito' : 'Test Fallito'}
                            </div>
                            {result.data && (
                              <div className="text-sm text-gray-600 mt-1">
                                Sport: {result.data.sport} | Partite: {result.data.matches}
                              </div>
                            )}
                            {result.error && (
                              <div className="text-sm text-red-600 mt-1">
                                Errore: {result.error}
                              </div>
                            )}
                            {result.requestsUsed && (
                              <div className="text-xs text-gray-500 mt-1">
                                Richieste utilizzate: {result.requestsUsed}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString('it-IT')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 