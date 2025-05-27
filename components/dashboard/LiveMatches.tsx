'use client';

import React from 'react';
import { Trophy, Filter, Clock, TrendingUp } from 'lucide-react';
import { Match } from '@/types';
import MatchCard from '@/components/MatchCard';

interface LiveMatchesProps {
  matches: Match[];
  onMatchClick: (matchId: string) => void;
  onFilterClick: () => void;
}

export default function LiveMatches({
  matches,
  onMatchClick,
  onFilterClick
}: LiveMatchesProps) {
  
  // Calcola migliori quote
  const calculateBestOdds = (match: Match) => {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: odd.bookmaker }));

    const bestHome = homeOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestAway = awayOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestDraw = drawOdds.length > 0 ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best) : undefined;

    return { home: bestHome, away: bestAway, draw: bestDraw };
  };

  if (matches.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8 text-center">
        <Trophy className="h-12 w-12 text-dark-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Nessuna Partita Disponibile</h3>
        <p className="text-dark-400 mb-4">
          Le partite vengono aggiornate giornalmente alle 12:00. 
          Controlla più tardi per nuove opportunità.
        </p>
        <button
          onClick={onFilterClick}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          Modifica Filtri
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="h-6 w-6 text-primary-400 mr-2" />
          Partite di Oggi
          <span className="ml-3 text-sm font-normal text-primary-600 bg-primary-500/20 px-2 py-1 rounded-full">
            Quote Aggiornate Giornalmente
          </span>
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onFilterClick}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white hover:bg-dark-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filtri</span>
          </button>
          <div className="text-sm text-dark-400">
            {matches.length} risultati
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{matches.length}</div>
          <div className="text-xs text-dark-400">Partite Totali</div>
        </div>
        <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {new Set(matches.map(m => m.league)).size}
          </div>
          <div className="text-xs text-dark-400">Campionati</div>
        </div>
        <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {new Set(matches.map(m => m.sport)).size}
          </div>
          <div className="text-xs text-dark-400">Sport</div>
        </div>
        <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {matches.reduce((total, match) => total + match.odds.length, 0)}
          </div>
          <div className="text-xs text-dark-400">Quote Totali</div>
        </div>
      </div>

      {/* Griglia partite */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            bestOdds={calculateBestOdds(match)}
            onViewDetails={() => onMatchClick(match.id)}
          />
        ))}
      </div>

      {/* Footer informativo */}
      <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema Attivo</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <Clock className="h-3 w-3" />
              <span>Aggiornamento alle 12:00</span>
            </div>
          </div>
          <div className="text-dark-400">
            Quote valide per 24 ore • Condivise globalmente
          </div>
        </div>
      </div>
    </div>
  );
} 