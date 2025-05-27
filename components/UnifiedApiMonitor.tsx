'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Database, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Zap,
  Calendar,
  Target
} from 'lucide-react';
import { unifiedApiManager } from '@/lib/unifiedApiManager';

interface ApiStats {
  daily: {
    used: number;
    quota: number;
    remaining: number;
    percentage: number;
  };
  monthly: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  sports: {
    total: number;
    updatedToday: number;
    remaining: number;
    nextToUpdate: string;
  };
  cache: {
    size: number;
    entries: Array<{
      key: string;
      age: number;
      ttl: number;
    }>;
  };
  lastUpdate: {
    timestamp: number;
    date: string;
    time: string;
  } | null;
}

interface UnifiedApiMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export default function UnifiedApiMonitor({ 
  className = '', 
  showDetails = true 
}: UnifiedApiMonitorProps) {
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    
    // Aggiorna ogni 30 secondi
    const interval = setInterval(loadStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiStats = unifiedApiManager.getDetailedStats();
      setStats(apiStats);
      
    } catch (err) {
      console.error('Errore caricamento statistiche API:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage < 60) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage < 60) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (percentage < 80) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTimeAgo = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m fa`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h fa`;
    const days = Math.floor(hours / 24);
    return `${days}g fa`;
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Caricamento statistiche API...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Errore: {error}</span>
        </div>
        <button 
          onClick={loadStats}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">
            Sistema API Unificato
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Ottimizzato 2025
          </span>
          <button 
            onClick={loadStats}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Aggiorna"
          >
            <Activity className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Utilizzo Giornaliero */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Utilizzo Giornaliero</span>
          </div>
          <div className="flex items-center">
            {getStatusIcon(stats.daily.percentage)}
            <span className={`text-sm font-bold ml-1 ${getStatusColor(stats.daily.percentage)}`}>
              {stats.daily.percentage}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(stats.daily.percentage)}`}
            style={{ width: `${Math.min(stats.daily.percentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{stats.daily.used} usate</span>
          <span>{stats.daily.remaining} rimanenti</span>
          <span>{stats.daily.quota} quota</span>
        </div>
      </div>

      {/* Utilizzo Mensile */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <BarChart3 className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Utilizzo Mensile</span>
          </div>
          <div className="flex items-center">
            {getStatusIcon(stats.monthly.percentage)}
            <span className={`text-sm font-bold ml-1 ${getStatusColor(stats.monthly.percentage)}`}>
              {stats.monthly.percentage}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(stats.monthly.percentage)}`}
            style={{ width: `${Math.min(stats.monthly.percentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{stats.monthly.used} usate</span>
          <span>{stats.monthly.remaining} rimanenti</span>
          <span>{stats.monthly.limit} limite</span>
        </div>
      </div>

      {/* Sport Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Target className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Sport Aggiornati Oggi</span>
          </div>
          <span className="text-sm text-gray-600">
            {stats.sports.updatedToday}/{stats.sports.total}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-gray-600">Aggiornati</div>
            <div className="text-lg font-semibold text-green-600">
              {stats.sports.updatedToday}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-gray-600">Rimanenti</div>
            <div className="text-lg font-semibold text-blue-600">
              {stats.sports.remaining}
            </div>
          </div>
        </div>
        
        {stats.sports.nextToUpdate !== 'Nessuno' && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
            <span className="text-blue-700">
              🎯 Prossimo aggiornamento: <strong>{stats.sports.nextToUpdate}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Cache Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Database className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Cache Sistema</span>
          </div>
          <span className="text-sm text-gray-600">
            {stats.cache.size} entries
          </span>
        </div>
        
        {stats.cache.size > 0 && (
          <div className="text-xs text-gray-500">
            Cache attiva per ridurre richieste API
          </div>
        )}
      </div>

      {/* Ultimo Aggiornamento */}
      {stats.lastUpdate && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Ultimo Aggiornamento</span>
            </div>
            <span className="text-sm text-gray-600">
              {stats.lastUpdate.time}
            </span>
          </div>
        </div>
      )}

      {/* Dettagli Cache (se richiesti) */}
      {showDetails && stats.cache.entries.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Dettaglio Cache</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stats.cache.entries.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex justify-between text-xs text-gray-500">
                <span className="truncate mr-2">{entry.key}</span>
                <span>{formatTimeAgo(entry.age)}</span>
              </div>
            ))}
            {stats.cache.entries.length > 5 && (
              <div className="text-xs text-gray-400 text-center">
                ... e altri {stats.cache.entries.length - 5} entries
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            <span>Sistema ottimizzato per 1 aggiornamento/sport/giorno</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Cache 24h</span>
          </div>
        </div>
      </div>
    </div>
  );
} 