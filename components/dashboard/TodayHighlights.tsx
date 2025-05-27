'use client';

import React from 'react';
import { Trophy, Target, Zap, Star, TrendingUp } from 'lucide-react';
import { Match } from '@/types';

interface TodayHighlightsProps {
  matches: Match[];
  opportunities: {
    arbitrage: Match[];
    value: Match[];
    highest: Match;
    total: number;
  } | null;
  onMatchClick: (matchId: string) => void;
}

export default function TodayHighlights({
  matches,
  opportunities,
  onMatchClick
}: TodayHighlightsProps) {
  
  if (!opportunities || matches.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8 text-center">
        <Star className="h-12 w-12 text-dark-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Nessun Highlight Disponibile</h3>
        <p className="text-dark-400">
          Gli highlights del giorno verranno mostrati quando ci saranno partite disponibili.
        </p>
      </div>
    );
  }

  // Calcola migliori quote per una partita
  const calculateBestOdds = (match: Match) => {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: odd.bookmaker }));

    const bestHome = homeOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestAway = awayOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestDraw = drawOdds.length > 0 ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best) : undefined;

    return { home: bestHome, away: bestAway, draw: bestDraw };
  };

  const highestOddsBest = calculateBestOdds(opportunities.highest);
  const maxOdd = Math.max(
    highestOddsBest.home.odds, 
    highestOddsBest.away.odds, 
    highestOddsBest.draw?.odds || 0
  );

  // Trova partita più equilibrata
  const mostBalanced = matches.find(match => {
    const bestOdds = calculateBestOdds(match);
    const diff = Math.abs(bestOdds.home.odds - bestOdds.away.odds);
    return diff < 0.5;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Star className="h-6 w-6 text-yellow-400 mr-2" />
          Highlights del Giorno
        </h2>
        <div className="text-sm text-dark-400">
          {opportunities.total} partite analizzate
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quota Più Alta */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
             onClick={() => onMatchClick(opportunities.highest.id)}>
          <div className="flex items-center mb-4">
            <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="font-bold text-white">Quota Top del Giorno</h3>
          </div>
          <div className="text-sm text-dark-300 mb-2">
            {opportunities.highest.homeTeam} vs {opportunities.highest.awayTeam}
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {maxOdd.toFixed(2)}
          </div>
          <div className="text-xs text-yellow-300">
            {opportunities.highest.league}
          </div>
          <div className="mt-4 text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg inline-block">
            Clicca per analizzare
          </div>
        </div>

        {/* Arbitraggio Top */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-purple-400 mr-2" />
            <h3 className="font-bold text-white">Arbitraggio</h3>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {opportunities.arbitrage.length}
          </div>
          <div className="text-sm text-dark-300 mb-2">
            Opportunità sicure disponibili
          </div>
          {opportunities.arbitrage.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-purple-300 mb-1">
                Migliore: {opportunities.arbitrage[0].homeTeam} vs {opportunities.arbitrage[0].awayTeam}
              </div>
              <button
                onClick={() => onMatchClick(opportunities.arbitrage[0].id)}
                className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                Vedi Dettagli
              </button>
            </div>
          )}
        </div>

        {/* Value Betting */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Target className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="font-bold text-white">Value Betting</h3>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {opportunities.value.length}
          </div>
          <div className="text-sm text-dark-300 mb-2">
            Opportunità di valore
          </div>
          <div className="text-xs text-green-400">
            Quote medie &gt; 2.50
          </div>
          {opportunities.value.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => onMatchClick(opportunities.value[0].id)}
                className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                Esplora Opportunità
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Partita Equilibrata */}
      {mostBalanced && (
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
                <h3 className="font-bold text-white">Match Equilibrato del Giorno</h3>
              </div>
              <div className="text-lg text-white mb-2">
                {mostBalanced.homeTeam} vs {mostBalanced.awayTeam}
              </div>
              <div className="text-sm text-dark-300">
                {mostBalanced.league} • Quote molto equilibrate
              </div>
            </div>
            <div className="text-right">
              {(() => {
                const balanced = calculateBestOdds(mostBalanced);
                return (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-blue-400">{balanced.home.odds.toFixed(2)}</span>
                      <span className="text-dark-400">vs</span>
                      <span className="text-lg font-bold text-blue-400">{balanced.away.odds.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => onMatchClick(mostBalanced.id)}
                      className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Analizza Match
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 