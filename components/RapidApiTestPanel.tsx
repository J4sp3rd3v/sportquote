'use client';

import React, { useState } from 'react';
import { X, Play, Database, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { rapidApiFootball } from '@/lib/rapidApiFootball';

interface RapidApiTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RapidApiTestPanel({ isOpen, onClose }: RapidApiTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedLeague, setSelectedLeague] = useState<number>(865927); // Campionato esempio default

  const leagues = [
    { id: 865927, name: 'Campionato Esempio', country: 'Test' },
    { id: 135, name: 'Serie A', country: 'Italia' },
    { id: 39, name: 'Premier League', country: 'Inghilterra' },
    { id: 140, name: 'La Liga', country: 'Spagna' },
    { id: 78, name: 'Bundesliga', country: 'Germania' },
    { id: 61, name: 'Ligue 1', country: 'Francia' },
    { id: 2, name: 'Champions League', country: 'Europa' },
    { id: 136, name: 'Serie B', country: 'Italia' }
  ];

  const runApiTest = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      console.log('🚀 Avvio test RapidAPI Football...');
      
      const startTime = Date.now();
      
      // Test 1: Verifica stato API
      console.log('📡 Test 1: Verifica stato API...');
      const statusResult = await rapidApiFootball.checkApiStatus();
      
      // Test 2: Ottieni partite per il campionato selezionato
      console.log(`⚽ Test 2: Recupero partite ${leagues.find(l => l.id === selectedLeague)?.name}...`);
      const fixtures = await rapidApiFootball.getFixturesForLeague(selectedLeague);
      
      // Test 3: Ottieni quote per il campionato selezionato
      console.log(`💰 Test 3: Recupero quote ${leagues.find(l => l.id === selectedLeague)?.name}...`);
      const odds = await rapidApiFootball.getOddsForLeague(selectedLeague);
      
      // Test 4: Test completo con tutti i campionati principali (solo primi 3 per non consumare troppe richieste)
      console.log('🏆 Test 4: Test campionati multipli (limitato)...');
      const mainLeagues = [135, 39, 140]; // Solo Serie A, Premier, La Liga per il test
      const multiLeagueResults = [];
      
      for (const leagueId of mainLeagues) {
        try {
          const leagueFixtures = await rapidApiFootball.getFixturesForLeague(leagueId);
          multiLeagueResults.push({
            leagueId,
            name: leagues.find(l => l.id === leagueId)?.name,
            fixtures: leagueFixtures.length,
            success: true
          });
        } catch (error) {
          multiLeagueResults.push({
            leagueId,
            name: leagues.find(l => l.id === leagueId)?.name,
            fixtures: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Errore sconosciuto'
          });
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      const results = {
        success: true,
        duration,
        timestamp: new Date().toISOString(),
        apiStatus: statusResult,
        selectedLeague: {
          id: selectedLeague,
          name: leagues.find(l => l.id === selectedLeague)?.name,
          fixtures: fixtures.length,
          odds: odds?.api?.results || 0
        },
        multiLeague: multiLeagueResults,
        apiUsage: {
          used: rapidApiFootball.getRequestCount(),
          total: rapidApiFootball.getMaxRequests(),
          percentage: rapidApiFootball.getUsagePercentage()
        },
        summary: {
          totalFixtures: fixtures.length,
          totalOdds: odds?.api?.results || 0,
          totalLeaguesTested: multiLeagueResults.length,
          successfulLeagues: multiLeagueResults.filter(r => r.success).length
        }
      };

      setTestResults(results);
      console.log('✅ Test RapidAPI completato:', results);

    } catch (error) {
      console.error('❌ Errore durante il test:', error);
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        timestamp: new Date().toISOString(),
        apiUsage: {
          used: rapidApiFootball.getRequestCount(),
          total: rapidApiFootball.getMaxRequests(),
          percentage: rapidApiFootball.getUsagePercentage()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Test RapidAPI Football</h2>
              <p className="text-purple-100 text-sm">Verifica connessione e dati API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Controls */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campionato da testare:
                </label>
                <select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  {leagues.map(league => (
                    <option key={league.id} value={league.id}>
                      {league.name} ({league.country})
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={runApiTest}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Avvia Test</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* API Usage */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Utilizzo API
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {rapidApiFootball.getRequestCount()}
                </div>
                <div className="text-sm text-blue-700">Richieste Usate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {rapidApiFootball.getRemainingRequests()}
                </div>
                <div className="text-sm text-blue-700">Rimanenti</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {rapidApiFootball.getUsagePercentage()}%
                </div>
                <div className="text-sm text-blue-700">Utilizzo</div>
              </div>
            </div>
          </div>

          {/* Results */}
          {testResults && (
            <div className="space-y-4">
              {/* Summary */}
              <div className={`p-4 rounded-lg ${testResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {testResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h3 className={`font-semibold ${testResults.success ? 'text-green-900' : 'text-red-900'}`}>
                    {testResults.success ? 'Test Completato con Successo' : 'Test Fallito'}
                  </h3>
                  {testResults.duration && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {testResults.duration}ms
                    </span>
                  )}
                </div>
                
                {testResults.error && (
                  <p className="text-red-700 text-sm">{testResults.error}</p>
                )}
              </div>

              {/* Detailed Results */}
              {testResults.success && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* API Status */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Stato API</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-medium ${testResults.apiStatus.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {testResults.apiStatus.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status Code:</span>
                        <span className="font-medium">{testResults.apiStatus.statusCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected League */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Campionato Testato</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Nome:</span>
                        <span className="font-medium">{testResults.selectedLeague.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Partite:</span>
                        <span className="font-medium text-blue-600">{testResults.selectedLeague.fixtures}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quote:</span>
                        <span className="font-medium text-green-600">{testResults.selectedLeague.odds}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi League Results */}
              {testResults.multiLeague && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Test Campionati Multipli</h4>
                  <div className="space-y-2">
                    {testResults.multiLeague.map((league: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          {league.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{league.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {league.success ? `${league.fixtures} partite` : 'Errore'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Stats */}
              {testResults.summary && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Riepilogo</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">{testResults.summary.totalFixtures}</div>
                      <div className="text-xs text-gray-600">Partite Totali</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">{testResults.summary.totalOdds}</div>
                      <div className="text-xs text-gray-600">Quote Totali</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">{testResults.summary.successfulLeagues}</div>
                      <div className="text-xs text-gray-600">Campionati OK</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-orange-600">{testResults.apiUsage.percentage}%</div>
                      <div className="text-xs text-gray-600">API Usata</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">ℹ️ Informazioni</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Questo test verifica la connessione a RapidAPI Football</li>
              <li>• Ogni test consuma alcune richieste API dal tuo limite giornaliero</li>
              <li>• I dati mostrati sono reali e aggiornati</li>
              <li>• Il test multiplo è limitato a 3 campionati per risparmiare richieste</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 