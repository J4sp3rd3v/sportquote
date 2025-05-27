'use client';

import React, { useMemo } from 'react';
import { activeSeasonsManager } from '@/lib/activeSeasonsManager';
import { Calendar, Trophy } from 'lucide-react';

export default function ActiveSeasonsStats() {
  // Statistiche dinamiche basate sui campionati attivi
  const activeSeasonsStats = useMemo(() => {
    return activeSeasonsManager.getSeasonsStats();
  }, []);

  // Calcola sport unici dai campionati attivi
  const activeSportsCount = useMemo(() => {
    const uniqueSports = new Set(activeSeasonsStats.activeLeagues.map(league => league.sport));
    return uniqueSports.size;
  }, [activeSeasonsStats]);

  return (
    <div className="hidden lg:flex items-center space-x-3 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center space-x-1">
        <Calendar className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">
          {activeSeasonsStats.active} campionati
        </span>
      </div>
      <div className="w-px h-4 bg-green-300"></div>
      <div className="flex items-center space-x-1">
        <Trophy className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">
          {activeSportsCount} sport
        </span>
      </div>
      <div className="text-xs text-green-600">attivi</div>
    </div>
  );
} 