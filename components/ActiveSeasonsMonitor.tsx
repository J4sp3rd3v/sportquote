'use client';

import React, { useState, useEffect } from 'react';
import { activeSeasonsManager } from '@/lib/activeSeasonsManager';
import { Calendar, Trophy, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface SeasonsStats {
  total: number;
  active: number;
  inactive: number;
  upcoming: number;
  activeLeagues: Array<{
    key: string;
    name: string;
    sport: string;
    country: string;
    endDate: Date;
  }>;
  upcomingLeagues: Array<{
    key: string;
    name: string;
    sport: string;
    country: string;
    startDate?: Date;
  }>;
}

export default function ActiveSeasonsMonitor() {
  const [stats, setStats] = useState<SeasonsStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carica statistiche stagioni
  const loadStats = () => {
    const seasonsStats = activeSeasonsManager.getSeasonsStats();
    setStats(seasonsStats);
  };

  // Forza aggiornamento
  const forceUpdate = () => {
    setIsLoading(true);
    try {
      activeSeasonsManager.forceUpdate();
      loadStats();
    } catch (error) {
      console.error('Errore aggiornamento stagioni:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carica dati al mount
  useEffect(() => {
    loadStats();
    
    // Aggiorna ogni ora
    const interval = setInterval(loadStats, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'calcio': return '⚽';
      case 'basket': return '🏀';
      case 'tennis': return '🎾';
      case 'football-americano': return '🏈';
      default: return '🏆';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilEnd = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">📅 Stagioni Attive</h2>
        </div>
        <button
          onClick={forceUpdate}
          disabled={isLoading}
          className="btn-secondary text-sm"
        >
          {isLoading ? 'Aggiornando...' : 'Aggiorna'}
        </button>
      </div>

      {/* Statistiche Generali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-dark-400">Totali</div>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-sm text-green-300">Attive</div>
        </div>
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.inactive}</div>
          <div className="text-sm text-red-300">Finite</div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.upcoming}</div>
          <div className="text-sm text-blue-300">Prossime</div>
        </div>
      </div>

      {/* Campionati Attivi */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          Campionati Attivi ({stats.active})
        </h3>
        
        {stats.activeLeagues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.activeLeagues.map((league) => {
              const daysLeft = getDaysUntilEnd(league.endDate);
              const isEndingSoon = daysLeft <= 30;
              
              return (
                <div
                  key={league.key}
                  className={`p-4 rounded-lg border ${
                    isEndingSoon 
                      ? 'bg-yellow-900/20 border-yellow-500/50' 
                      : 'bg-green-900/20 border-green-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getSportIcon(league.sport)}</span>
                      <div>
                        <h4 className="font-medium text-white">{league.name}</h4>
                        <p className="text-sm text-dark-400">{league.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        isEndingSoon ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} giorni` : 'Ultimo giorno'}
                      </div>
                      <div className="text-xs text-dark-400">
                        Fine: {formatDate(league.endDate)}
                      </div>
                    </div>
                  </div>
                  
                  {isEndingSoon && (
                    <div className="flex items-center text-xs text-yellow-400 mt-2">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Stagione in scadenza
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-dark-400">
            <XCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nessun campionato attivo al momento</p>
          </div>
        )}
      </div>

      {/* Prossimi Campionati */}
      {stats.upcomingLeagues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-400 mr-2" />
            Prossimi Campionati ({stats.upcoming})
          </h3>
          
          <div className="space-y-3">
            {stats.upcomingLeagues.map((league) => (
              <div
                key={league.key}
                className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getSportIcon(league.sport)}</span>
                    <div>
                      <h4 className="font-medium text-white">{league.name}</h4>
                      <p className="text-sm text-dark-400">{league.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-400">
                      {league.startDate ? formatDate(league.startDate) : 'TBD'}
                    </div>
                    <div className="text-xs text-dark-400">Inizio stagione</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Sistema */}
      <div className="mt-6 p-4 bg-dark-700/30 rounded-lg border border-dark-600">
        <div className="flex items-center text-sm text-dark-300">
          <Trophy className="h-4 w-4 mr-2" />
          <span>
            Sistema automatico: solo campionati in corso vengono mostrati e aggiornati
          </span>
        </div>
      </div>
    </div>
  );
} 