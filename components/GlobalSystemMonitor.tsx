'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Server, Clock, CheckCircle, XCircle, AlertTriangle, Play, Pause, RefreshCw, Zap } from 'lucide-react';
import { serverSideScheduler } from '@/lib/serverSideScheduler';

interface GlobalStats {
  isSystemActive: boolean;
  lastGlobalUpdate: string;
  globalStats: {
    totalUpdatesToday: number;
    successfulUpdates: number;
    failedUpdates: number;
    lastSystemCheck: string;
  };
  sports: Array<{
    sport: string;
    scheduledTime: string;
    status: 'pending' | 'completed' | 'failed';
    lastUpdate: string;
    nextUpdate: string;
    timeUntilNext: number;
    attempts: number;
    lastError?: string;
    isOverdue: boolean;
  }>;
  summary: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
  };
}

export default function GlobalSystemMonitor() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextUpdate, setNextUpdate] = useState<{ sport: string; time: string; minutes: number } | null>(null);

  // Carica statistiche globali
  const loadGlobalStats = () => {
    const globalStats = serverSideScheduler.getGlobalStats();
    const nextScheduled = serverSideScheduler.getNextScheduledUpdate();
    
    setStats(globalStats);
    setNextUpdate(nextScheduled);
  };

  // Avvia/ferma sistema globale
  const toggleGlobalSystem = () => {
    if (stats?.isSystemActive) {
      serverSideScheduler.stopGlobalSystem();
    } else {
      serverSideScheduler.startGlobalSystem();
    }
    loadGlobalStats();
  };

  // Forza aggiornamento globale
  const forceGlobalUpdate = async () => {
    setIsLoading(true);
    try {
      await serverSideScheduler.forceGlobalUpdateAll();
      loadGlobalStats();
    } catch (error) {
      console.error('Errore aggiornamento globale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset sistema globale
  const resetGlobalSystem = () => {
    serverSideScheduler.resetGlobalSystem();
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

  // Formatta tempo rimanente
  const formatTimeUntilNext = (minutes: number): string => {
    if (minutes <= 0) return 'Ora';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Ottieni icona status
  const getStatusIcon = (status: string, isOverdue: boolean) => {
    if (isOverdue) return <AlertTriangle className="h-4 w-4 text-orange-400" />;
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Ottieni colore status
  const getStatusColor = (status: string, isOverdue: boolean): string => {
    if (isOverdue) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Ascolta eventi globali
  useEffect(() => {
    const handleGlobalUpdate = () => {
      loadGlobalStats();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('globalUpdate:completed', handleGlobalUpdate);
      return () => {
        window.removeEventListener('globalUpdate:completed', handleGlobalUpdate);
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

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Globe className="h-6 w-6 text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Sistema Globale di Aggiornamento</h2>
          <div className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
            SERVER-SIDE
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            stats.isSystemActive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <Server className="h-4 w-4" />
            <div className={`w-2 h-2 rounded-full ${
              stats.isSystemActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}></div>
            <span>{stats.isSystemActive ? 'Sistema Attivo' : 'Sistema Inattivo'}</span>
          </div>
        </div>
      </div>

      {/* Prossimo Aggiornamento */}
      {nextUpdate && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <h3 className="font-medium text-blue-200">Prossimo Aggiornamento Globale</h3>
                <p className="text-sm text-blue-300">
                  {formatSportName(nextUpdate.sport)} alle {nextUpdate.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{nextUpdate.minutes}m</div>
              <div className="text-xs text-blue-300">rimanenti</div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiche Globali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.globalStats.totalUpdatesToday}</div>
          <div className="text-sm text-dark-400">Aggiornamenti Oggi</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.globalStats.successfulUpdates}</div>
          <div className="text-sm text-dark-400">Successi</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.globalStats.failedUpdates}</div>
          <div className="text-sm text-dark-400">Fallimenti</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.globalStats.totalUpdatesToday > 0 
              ? Math.round((stats.globalStats.successfulUpdates / stats.globalStats.totalUpdatesToday) * 100)
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
          {stats.isSystemActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{stats.isSystemActive ? 'Ferma' : 'Avvia'} Sistema Globale</span>
        </button>

        <button
          onClick={forceGlobalUpdate}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          <span>Aggiornamento Globale Forzato</span>
        </button>

        <button
          onClick={resetGlobalSystem}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Sistema</span>
        </button>
      </div>

      {/* Lista Sport Globali */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Status Aggiornamenti Globali</h3>
        
        {stats.sports.map((sport) => (
          <div
            key={sport.sport}
            className={`border rounded-lg p-4 ${getStatusColor(sport.status, sport.isOverdue)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(sport.status, sport.isOverdue)}
                <div>
                  <h4 className="font-medium text-white">{formatSportName(sport.sport)}</h4>
                  <div className="flex items-center space-x-4 text-sm opacity-80">
                    <span>Orario: {sport.scheduledTime}</span>
                    {sport.lastUpdate && (
                      <span>Ultimo: {new Date(sport.lastUpdate).toLocaleString('it-IT')}</span>
                    )}
                    {sport.attempts > 0 && (
                      <span>Tentativi: {sport.attempts}/3</span>
                    )}
                  </div>
                  {sport.lastError && (
                    <div className="text-xs text-red-300 mt-1">
                      Errore: {sport.lastError}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm px-2 py-1 rounded-full border ${getStatusColor(sport.status, sport.isOverdue)}`}>
                  {sport.isOverdue ? 'In Ritardo' : 
                   sport.status === 'completed' ? 'Completato' :
                   sport.status === 'failed' ? 'Fallito' : 'In Attesa'}
                </div>
                {sport.status === 'pending' && (
                  <div className="text-xs opacity-60 mt-1">
                    Prossimo: {formatTimeUntilNext(sport.timeUntilNext)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Sistema Globale */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start">
          <Server className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-200 mb-2">Sistema Globale Server-Side</h4>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• <strong>Aggiornamenti Centralizati</strong>: Una sola istanza aggiorna per tutto il sito</li>
              <li>• <strong>Indipendente dagli Utenti</strong>: Funziona anche senza utenti connessi</li>
              <li>• <strong>Retry Automatico</strong>: Fino a 3 tentativi con pausa di 5 minuti</li>
              <li>• <strong>Broadcast Globale</strong>: Notifica tutti i client connessi</li>
              <li>• <strong>Persistenza</strong>: Stato salvato e recuperato automaticamente</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ultimo Check */}
      {stats.globalStats.lastSystemCheck && (
        <div className="mt-4 text-center text-xs text-dark-400">
          Ultimo controllo sistema: {new Date(stats.globalStats.lastSystemCheck).toLocaleString('it-IT')}
        </div>
      )}
    </div>
  );
} 