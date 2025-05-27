'use client';

import { useState, useEffect, useCallback } from 'react';
import { autoUpdateService, AutoUpdateStats } from '@/lib/autoUpdateService';

export interface UseAutoUpdateReturn {
  stats: AutoUpdateStats;
  isRunning: boolean;
  timeToNextUpdate: string;
  formattedLastUpdate: string;
  canRequestManualUpdate: boolean;
  limitMessage: string;
  startAutoUpdate: () => void;
  stopAutoUpdate: () => void;
  forceUpdate: () => Promise<void>;
  refreshStats: () => void;
}

export function useAutoUpdate(): UseAutoUpdateReturn {
  const [stats, setStats] = useState<AutoUpdateStats>({
    isRunning: false,
    lastUpdate: null,
    nextUpdate: null,
    apiRequestsUsed: 0,
    maxApiRequests: 500,
    timeToNextUpdate: 'Non programmato',
    currentSport: null,
    sportsUpdatedToday: 0,
    totalSports: 6
  });

  // Aggiorna le statistiche
  const refreshStats = useCallback(() => {
    const currentStats = autoUpdateService.getStats();
    setStats(currentStats);
  }, []);

  // Avvia aggiornamento automatico
  const startAutoUpdate = useCallback(() => {
    autoUpdateService.start();
    refreshStats();
  }, [refreshStats]);

  // Ferma aggiornamento automatico
  const stopAutoUpdate = useCallback(() => {
    autoUpdateService.stop();
    refreshStats();
  }, [refreshStats]);

  // Forza aggiornamento
  const forceUpdate = useCallback(async () => {
    await autoUpdateService.forceUpdate();
    refreshStats();
  }, [refreshStats]);

  // Calcola se possiamo fare aggiornamenti manuali
  const canRequestManualUpdate = stats.apiRequestsUsed < (stats.maxApiRequests * 0.9);

  // Messaggio sui limiti
  const limitMessage = canRequestManualUpdate
    ? `Puoi richiedere aggiornamenti manuali. Utilizzo API: ${Math.round((stats.apiRequestsUsed / stats.maxApiRequests) * 100)}%`
    : 'Limite API quasi raggiunto. Aggiornamenti manuali disabilitati per preservare il servizio automatico.';

  // Formatta ultimo aggiornamento
  const formattedLastUpdate = stats.lastUpdate
    ? stats.lastUpdate.toLocaleString('it-IT')
    : 'Mai';

  useEffect(() => {
    // Carica statistiche iniziali
    refreshStats();

    // Aggiorna statistiche ogni 30 secondi
    const interval = setInterval(refreshStats, 30000);

    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    isRunning: stats.isRunning,
    timeToNextUpdate: stats.timeToNextUpdate,
    formattedLastUpdate,
    canRequestManualUpdate,
    limitMessage,
    startAutoUpdate,
    stopAutoUpdate,
    forceUpdate,
    refreshStats
  };
}

 