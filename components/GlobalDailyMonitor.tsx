'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Globe, CheckCircle, XCircle, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { globalDailyUpdater } from '@/lib/globalDailyUpdater';

interface GlobalDailyStats {
  isSystemActive: boolean;
  lastGlobalUpdate: string;
  lastUpdateTime: string;
  nextScheduledUpdate: string;
  hoursUntilNext: number;
  dailyUpdateHour: number;
  systemStats: {
    totalDaysActive: number;
    successfulUpdates: number;
    failedUpdates: number;
    lastError?: string;
  };
  sportsStatus: Array<{
    sport: string;
    status: 'fresh' | 'stale' | 'updating';
    lastUpdate: string;
    isToday: boolean;
  }>;
  summary: {
    totalSports: number;
    freshToday: number;
    stale: number;
    updating: number;
  };
}

export default function GlobalDailyMonitor() {
  const [stats, setStats] = useState<GlobalDailyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carica statistiche globali
  const loadGlobalStats = () => {
    const globalStats = globalDailyUpdater.getGlobalDailyStats();
    setStats(globalStats);
  };

  // Avvia/ferma sistema globale
  const toggleGlobalSystem = () => {
    if (stats?.isSystemActive) {
      globalDailyUpdater.stopGlobalSystem();
    } else {
      globalDailyUpdater.startGlobalSystem();
    }
    loadGlobalStats();
  };

  // Forza aggiornamento giornaliero
  const forceDailyUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await globalDailyUpdater.forceDailyUpdate();
      if (result.success) {
        console.log('Aggiornamento forzato completato');
      } else {
        console.error('Errore aggiornamento forzato:', result.message);
      }
      loadGlobalStats();
    } catch (error) {
      console.error('Errore aggiornamento forzato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset sistema globale
  const resetGlobalSystem = () => {
    globalDailyUpdater.resetGlobalSystem();
    loadGlobalStats();
  };

  // Formatta nome sport
  const formatSportName = (sportKey: string): string => {
    const mapping: { [key: string]: string } = {
      'soccer_italy_serie_a': 'Serie A',
      'soccer_epl': 'Premier League',
      'soccer_uefa_champs_league': 'Champions League',
      'basketball_nba': 'NBA',
      'tennis_atp_french_open': 'ATP Tennis',
      'americanfootball_nfl': 'NFL'
    };
    return mapping[sportKey] || sportKey;
  };

  // Ottieni icona status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'updating':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'stale':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Ottieni colore status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'fresh':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'updating':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'stale':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Ascolta eventi globali
  useEffect(() => {
    const handleGlobalDailyUpdate = () => {
      loadGlobalStats();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('globalDailyUpdate:completed', handleGlobalDailyUpdate);
      return () => {
        window.removeEventListener('globalDailyUpdate:completed', handleGlobalDailyUpdate);
      };
    }
  }, []);

  // Carica statistiche iniziali e aggiorna ogni 30 secondi
  useEffect(() => {
    loadGlobalStats();
    const interval = setInterval(loadGlobalStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const areQuotesFresh = globalDailyUpdater.areQuotesFreshToday();
  const lastUpdateTime = globalDailyUpdater.getLastGlobalUpdateTime();
  const nextUpdate = globalDailyUpdater.getNextScheduledUpdate();

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Globe className="h-6 w-6 text-green-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Sistema Giornaliero Globale</h2>
          <div className="ml-3 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
            1 AGGIORNAMENTO/GIORNO
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            stats.isSystemActive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <Calendar className="h-4 w-4" />
            <div className={`w-2 h-2 rounded-full ${
              stats.isSystemActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}></div>
            <span>{stats.isSystemActive ? 'Sistema Attivo' : 'Sistema Inattivo'}</span>
          </div>
        </div>
      </div>

      {/* Status Aggiornamento Oggi */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <h3 className="font-medium text-green-200">
                {areQuotesFresh ? 'Quote Aggiornate Oggi' : 'Quote Non Aggiornate Oggi'}
              </h3>
              <p className="text-sm text-green-300">
                {lastUpdateTime 
                  ? `Ultimo aggiornamento: ${lastUpdateTime.toLocaleString('it-IT')}`
                  : 'Nessun aggiornamento effettuato'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${areQuotesFresh ? 'text-green-400' : 'text-red-400'}`}>
              {areQuotesFresh ? '✅' : '❌'}
            </div>
            <div className="text-xs text-green-300">
              Prossimo: {stats.hoursUntilNext}h
            </div>
          </div>
        </div>
      </div>

      {/* Prossimo Aggiornamento */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <h3 className="font-medium text-blue-200">Prossimo Aggiornamento Globale</h3>
              <p className="text-sm text-blue-300">
                {nextUpdate.toLocaleDateString('it-IT')} alle {stats.dailyUpdateHour}:00
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{stats.hoursUntilNext}h</div>
            <div className="text-xs text-blue-300">rimanenti</div>
          </div>
        </div>
      </div>

      {/* Statistiche Globali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.systemStats.totalDaysActive}</div>
          <div className="text-sm text-dark-400">Giorni Attivi</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.summary.freshToday}</div>
          <div className="text-sm text-dark-400">Aggiornati Oggi</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.summary.stale}</div>
          <div className="text-sm text-dark-400">Non Aggiornati</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.systemStats.totalDaysActive > 0 
              ? Math.round((stats.systemStats.successfulUpdates / stats.systemStats.totalDaysActive) * 100)
              : 0}%
          </div>
          <div className="text-sm text-dark-400">Tasso Successo</div>
        </div>
      </div>

      {/* Controlli Globali */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={toggleGlobalSystem}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            stats.isSystemActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {stats.isSystemActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <span>{stats.isSystemActive ? 'Ferma' : 'Avvia'} Sistema Giornaliero</span>
        </button>

        <button
          onClick={forceDailyUpdate}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          <span>Forza Aggiornamento Oggi</span>
        </button>

        <button
          onClick={resetGlobalSystem}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Sistema</span>
        </button>
      </div>

      {/* Lista Sport */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Status Sport Oggi</h3>
        
        {stats.sportsStatus.map((sport) => (
          <div
            key={sport.sport}
            className={`border rounded-lg p-4 ${getStatusColor(sport.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(sport.status)}
                <div>
                  <h4 className="font-medium text-white">{formatSportName(sport.sport)}</h4>
                  <div className="text-sm opacity-80">
                    {sport.lastUpdate ? (
                      <span>
                        Ultimo aggiornamento: {new Date(sport.lastUpdate).toLocaleString('it-IT')}
                        {sport.isToday && <span className="ml-2 text-green-400">• Oggi</span>}
                      </span>
                    ) : (
                      <span>Mai aggiornato</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm px-2 py-1 rounded-full border ${getStatusColor(sport.status)}`}>
                  {sport.status === 'fresh' ? 'Aggiornato' :
                   sport.status === 'updating' ? 'Aggiornando...' : 'Non Aggiornato'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Sistema */}
      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <div className="flex items-start">
          <Globe className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-200 mb-2">Sistema Giornaliero Globale</h4>
            <ul className="text-sm text-green-300 space-y-1">
              <li>• <strong>1 Aggiornamento al Giorno</strong>: Alle {stats.dailyUpdateHour}:00 per tutto il sito</li>
              <li>• <strong>Condiviso da Tutti</strong>: Tutti gli utenti vedono le stesse quote</li>
              <li>• <strong>Efficienza API</strong>: Solo 6 richieste al giorno invece di centinaia</li>
              <li>• <strong>Quote Stabili</strong>: Rimangono invariate per 24 ore</li>
              <li>• <strong>Aggiornamento Automatico</strong>: Ogni giorno alla stessa ora</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ultimo Check */}
      <div className="mt-4 text-center text-xs text-dark-400">
        Sistema controllato ogni minuto • Prossimo controllo: {new Date(Date.now() + 60000).toLocaleTimeString('it-IT')}
      </div>
    </div>
  );
} 