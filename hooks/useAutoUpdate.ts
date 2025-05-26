'use client';

import { useState, useEffect, useCallback } from 'react';
import { autoUpdateService, AutoUpdateStats } from '@/lib/autoUpdateService';

export interface UseAutoUpdateReturn {
  stats: AutoUpdateStats;
  isRunning: boolean;
  timeToNextUpdate: string;
  canRequestManualUpdate: boolean;
  limitMessage: string;
  startAutoUpdate: () => void;
  stopAutoUpdate: () => void;
  forceUpdate: () => Promise<void>;
  refreshStats: () => void;
}

export function useAutoUpdate(): UseAutoUpdateReturn {
  const [stats, setStats] = useState<AutoUpdateStats>(() => autoUpdateService.getStats());
  const [timeToNextUpdate, setTimeToNextUpdate] = useState<string>('');

  // Aggiorna le statistiche
  const refreshStats = useCallback(() => {
    const newStats = autoUpdateService.getStats();
    setStats(newStats);
  }, []);

  // Aggiorna il countdown
  const updateCountdown = useCallback(() => {
    const formattedTime = autoUpdateService.getFormattedTimeToNextUpdate();
    setTimeToNextUpdate(formattedTime);
  }, []);

  // Avvia l'aggiornamento automatico
  const startAutoUpdate = useCallback(() => {
    autoUpdateService.startAutoUpdate();
    refreshStats();
  }, [refreshStats]);

  // Ferma l'aggiornamento automatico
  const stopAutoUpdate = useCallback(() => {
    autoUpdateService.stopAutoUpdate();
    refreshStats();
  }, [refreshStats]);

  // Forza un aggiornamento manuale
  const forceUpdate = useCallback(async () => {
    try {
      await autoUpdateService.forceUpdate();
      refreshStats();
    } catch (error) {
      console.error('Errore nell\'aggiornamento forzato:', error);
      throw error;
    }
  }, [refreshStats]);

  // Effetto per aggiornare le statistiche periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
      updateCountdown();
    }, 1000); // Aggiorna ogni secondo

    return () => clearInterval(interval);
  }, [refreshStats, updateCountdown]);

  // Avvia automaticamente il servizio al mount
  useEffect(() => {
    if (!stats.isRunning) {
      autoUpdateService.startAutoUpdate();
      refreshStats();
    }
  }, [refreshStats, stats.isRunning]);

  return {
    stats,
    isRunning: stats.isRunning,
    timeToNextUpdate,
    canRequestManualUpdate: autoUpdateService.canRequestManualUpdate(),
    limitMessage: autoUpdateService.getUpdateLimitMessage(),
    startAutoUpdate,
    stopAutoUpdate,
    forceUpdate,
    refreshStats
  };
}

export interface UseAutoUpdateDataReturn {
  data: any[];
  lastUpdate: Date | null;
  isLoading: boolean;
}

export function useAutoUpdateData(): UseAutoUpdateDataReturn {
  const [data, setData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sottoscrivi agli aggiornamenti del servizio
    const unsubscribe = autoUpdateService.subscribe((newData) => {
      setData(newData);
      setLastUpdate(new Date());
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    data,
    lastUpdate,
    isLoading
  };
} 