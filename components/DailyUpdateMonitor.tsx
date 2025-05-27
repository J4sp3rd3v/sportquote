'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, CheckCircle, XCircle, AlertCircle, Calendar, Zap } from 'lucide-react';
import { dailyUpdateScheduler } from '@/lib/dailyUpdateScheduler';

interface ScheduleStats {
  isRunning: boolean;
  lastDailyUpdate: string;
  sports: Array<{
    sport: string;
    scheduledTime: string;
    status: 'pending' | 'completed' | 'failed';
    lastUpdate: string;
    nextUpdate: string;
    timeUntilNext: number;
    isOverdue: boolean;
  }>;
  summary: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
  };
}

export default function DailyUpdateMonitor() {
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carica statistiche
  const loadStats = () => {
    const scheduleStats = dailyUpdateScheduler.getScheduleStats();
    setStats(scheduleStats);
  };

  // Avvia/ferma scheduler
  const toggleScheduler = () => {
    if (stats?.isRunning) {
      dailyUpdateScheduler.stop();
    } else {
      dailyUpdateScheduler.start();
    }
    loadStats();
  };

  // Forza aggiornamento di uno sport
  const forceUpdateSport = async (sportKey: string) => {
    setIsLoading(true);
    try {
      await dailyUpdateScheduler.forceUpdateSport(sportKey);
      loadStats();
    } catch (error) {
      console.error('Errore aggiornamento sport:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forza aggiornamento di tutti gli sport
  const forceUpdateAll = async () => {
    setIsLoading(true);
    try {
      await dailyUpdateScheduler.forceUpdateAll();
      loadStats();
    } catch (error) {
      console.error('Errore aggiornamento completo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset scheduler
  const resetScheduler = () => {
    dailyUpdateScheduler.reset();
    loadStats();
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
    if (isOverdue) return <AlertCircle className="h-4 w-4 text-orange-400" />;
    
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
    if (isOverdue) return 'text-orange-400 bg-orange-500/10';
    
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10';
      case 'failed':
        return 'text-red-400 bg-red-500/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  // Ascolta eventi di aggiornamento
  useEffect(() => {
    const handleUpdateCompleted = () => {
      loadStats();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('dailyUpdate:completed', handleUpdateCompleted);
      return () => {
        window.removeEventListener('dailyUpdate:completed', handleUpdateCompleted);
      };
    }
  }, []);

  // Carica statistiche iniziali e aggiorna ogni 30 secondi
  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
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
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Sistema Aggiornamento Giornaliero</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            stats.isRunning 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              stats.isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}></div>
            <span>{stats.isRunning ? 'Attivo' : 'Inattivo'}</span>
          </div>
        </div>
      </div>

      {/* Statistiche Riepilogo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.summary.total}</div>
          <div className="text-sm text-dark-400">Sport Totali</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.summary.completed}</div>
          <div className="text-sm text-dark-400">Completati Oggi</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.summary.pending}</div>
          <div className="text-sm text-dark-400">In Attesa</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.summary.failed}</div>
          <div className="text-sm text-dark-400">Falliti</div>
        </div>
      </div>

      {/* Controlli */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={toggleScheduler}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            stats.isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {stats.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{stats.isRunning ? 'Ferma' : 'Avvia'} Scheduler</span>
        </button>

        <button
          onClick={forceUpdateAll}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          <span>Aggiorna Tutti</span>
        </button>

        <button
          onClick={resetScheduler}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Lista Sport */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Programma Aggiornamenti</h3>
        
        {stats.sports.map((sport) => (
          <div
            key={sport.sport}
            className="bg-dark-700/50 border border-dark-600 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(sport.status, sport.isOverdue)}
                <div>
                  <h4 className="font-medium text-white">{formatSportName(sport.sport)}</h4>
                  <div className="flex items-center space-x-4 text-sm text-dark-400">
                    <span>Orario: {sport.scheduledTime}</span>
                    {sport.lastUpdate && (
                      <span>Ultimo: {new Date(sport.lastUpdate).toLocaleString('it-IT')}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-sm px-2 py-1 rounded-full ${getStatusColor(sport.status, sport.isOverdue)}`}>
                    {sport.isOverdue ? 'In Ritardo' : 
                     sport.status === 'completed' ? 'Completato' :
                     sport.status === 'failed' ? 'Fallito' : 'In Attesa'}
                  </div>
                  {sport.status === 'pending' && (
                    <div className="text-xs text-dark-400 mt-1">
                      Prossimo: {formatTimeUntilNext(sport.timeUntilNext)}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => forceUpdateSport(sport.sport)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  Aggiorna
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Sistema */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-200 mb-2">Come Funziona</h4>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Ogni sport ha un orario di aggiornamento fisso (8:00-13:00)</li>
              <li>• Il sistema controlla ogni minuto se ci sono aggiornamenti da fare</li>
              <li>• Ogni sport viene aggiornato una sola volta al giorno</li>
              <li>• Reset automatico a mezzanotte per il giorno successivo</li>
              <li>• Preserva le 500 richieste mensili con 6 richieste giornaliere</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 