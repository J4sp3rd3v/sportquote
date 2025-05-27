'use client';

import React, { useMemo } from 'react';
import { Calculator, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { Match } from '@/types';

interface ArbitrageDebugInfoProps {
  matches: Match[];
  className?: string;
}

interface DebugAnalysis {
  match: Match;
  homeOdds: { odds: number; bookmaker: string };
  awayOdds: { odds: number; bookmaker: string };
  drawOdds?: { odds: number; bookmaker: string };
  totalPercentage: number;
  profit: number;
  isArbitrage: boolean;
  isNearMiss: boolean;
}

export default function ArbitrageDebugInfo({ matches, className = '' }: ArbitrageDebugInfoProps) {
  const debugAnalyses = useMemo(() => {
    const analyses: DebugAnalysis[] = [];
    
    matches.forEach(match => {
      if (match.odds.length < 2) return;

      // Calcola le migliori quote
      const homeOdds = match.odds
        .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.home }))
        .reduce((best, current) => current.odds > best.odds ? current : best);
      
      const awayOdds = match.odds
        .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.away }))
        .reduce((best, current) => current.odds > best.odds ? current : best);
      
      const drawOdds = match.odds
        .filter(odd => odd.draw)
        .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.draw! }))
        .reduce((best, current) => current.odds > best.odds ? current : best, { bookmaker: '', odds: 0 });

      // Calcola percentuale
      let totalPercentage;
      if (match.sport === 'calcio' && drawOdds.odds > 0) {
        totalPercentage = (100 / homeOdds.odds) + (100 / awayOdds.odds) + (100 / drawOdds.odds);
      } else {
        totalPercentage = (100 / homeOdds.odds) + (100 / awayOdds.odds);
      }

      const profit = 100 - totalPercentage;
      const isArbitrage = totalPercentage < 99.5;
      const isNearMiss = totalPercentage >= 99.5 && totalPercentage <= 103;

      analyses.push({
        match,
        homeOdds,
        awayOdds,
        drawOdds: drawOdds.odds > 0 ? drawOdds : undefined,
        totalPercentage,
        profit,
        isArbitrage,
        isNearMiss
      });
    });

    return analyses.sort((a, b) => b.profit - a.profit);
  }, [matches]);

  const stats = useMemo(() => {
    const arbitrageCount = debugAnalyses.filter(a => a.isArbitrage).length;
    const nearMissCount = debugAnalyses.filter(a => a.isNearMiss).length;
    const bestProfit = debugAnalyses.length > 0 ? debugAnalyses[0].profit : 0;
    const avgMargin = debugAnalyses.length > 0 
      ? debugAnalyses.reduce((sum, a) => sum + a.totalPercentage, 0) / debugAnalyses.length 
      : 0;

    return {
      arbitrageCount,
      nearMissCount,
      bestProfit,
      avgMargin,
      totalAnalyzed: debugAnalyses.length
    };
  }, [debugAnalyses]);

  if (matches.length === 0) {
    return (
      <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">🔍 Debug Arbitraggio</h3>
        </div>
        <p className="text-dark-300">Nessuna partita da analizzare.</p>
      </div>
    );
  }

  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Info className="h-6 w-6 text-blue-400 mr-3" />
        <div>
          <h3 className="text-xl font-bold text-white">🔍 Debug Analisi Arbitraggio</h3>
          <p className="text-dark-300 text-sm">
            Analisi dettagliata di tutte le partite per identificare opportunità
          </p>
        </div>
      </div>

      {/* Statistiche Generali */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalAnalyzed}</div>
          <div className="text-xs text-dark-400">Partite</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.arbitrageCount}</div>
          <div className="text-xs text-dark-400">Arbitraggi</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.nearMissCount}</div>
          <div className="text-xs text-dark-400">Quasi-Arbitraggi</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold ${stats.bestProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.bestProfit.toFixed(2)}%
          </div>
          <div className="text-xs text-dark-400">Miglior Profitto</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary-400">{stats.avgMargin.toFixed(1)}%</div>
          <div className="text-xs text-dark-400">Margine Medio</div>
        </div>
      </div>

      {/* Lista Dettagliata */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {debugAnalyses.slice(0, 20).map((analysis, index) => (
          <div
            key={analysis.match.id}
            className={`p-4 rounded-lg border transition-all ${
              analysis.isArbitrage 
                ? 'border-green-500/50 bg-green-900/10' 
                : analysis.isNearMiss 
                  ? 'border-yellow-500/50 bg-yellow-900/10'
                  : 'border-dark-600 bg-dark-700/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="text-lg">
                  {analysis.match.sport === 'calcio' ? '⚽' : 
                   analysis.match.sport === 'basket' ? '🏀' : 
                   analysis.match.sport === 'tennis' ? '🎾' : '🏆'}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    {analysis.match.homeTeam} vs {analysis.match.awayTeam}
                  </h4>
                  <p className="text-xs text-dark-400">
                    {analysis.match.league} • {analysis.match.odds.length} bookmaker
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  analysis.isArbitrage ? 'text-green-400' :
                  analysis.isNearMiss ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.profit.toFixed(2)}%
                </div>
                <div className="text-xs text-dark-400">
                  {analysis.totalPercentage.toFixed(2)}%
                </div>
                <div className="text-xs">
                  {analysis.isArbitrage ? '✅' : analysis.isNearMiss ? '⚠️' : '❌'}
                </div>
              </div>
            </div>

            {/* Quote Dettagliate */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-dark-600/50 rounded p-2">
                <div className="text-dark-300">Casa</div>
                <div className="font-semibold text-white">{analysis.homeOdds.odds.toFixed(2)}</div>
                <div className="text-primary-400 truncate">{analysis.homeOdds.bookmaker}</div>
                <div className="text-green-400">{(100 / analysis.homeOdds.odds).toFixed(1)}%</div>
              </div>
              
              {analysis.drawOdds && (
                <div className="bg-dark-600/50 rounded p-2">
                  <div className="text-dark-300">Pareggio</div>
                  <div className="font-semibold text-white">{analysis.drawOdds.odds.toFixed(2)}</div>
                  <div className="text-primary-400 truncate">{analysis.drawOdds.bookmaker}</div>
                  <div className="text-yellow-400">{(100 / analysis.drawOdds.odds).toFixed(1)}%</div>
                </div>
              )}
              
              <div className="bg-dark-600/50 rounded p-2">
                <div className="text-dark-300">Trasferta</div>
                <div className="font-semibold text-white">{analysis.awayOdds.odds.toFixed(2)}</div>
                <div className="text-primary-400 truncate">{analysis.awayOdds.bookmaker}</div>
                <div className="text-blue-400">{(100 / analysis.awayOdds.odds).toFixed(1)}%</div>
              </div>
            </div>

            {/* Calcolo */}
            <div className="mt-2 p-2 bg-dark-800/50 rounded text-xs font-mono">
              <div className="text-dark-300">Calcolo:</div>
              <div className="text-accent-400">
                {analysis.drawOdds 
                  ? `(100/${analysis.homeOdds.odds.toFixed(2)}) + (100/${analysis.drawOdds.odds.toFixed(2)}) + (100/${analysis.awayOdds.odds.toFixed(2)}) = ${analysis.totalPercentage.toFixed(2)}%`
                  : `(100/${analysis.homeOdds.odds.toFixed(2)}) + (100/${analysis.awayOdds.odds.toFixed(2)}) = ${analysis.totalPercentage.toFixed(2)}%`
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {debugAnalyses.length > 20 && (
        <div className="text-center mt-4 text-dark-400 text-sm">
          Mostrate le prime 20 partite su {debugAnalyses.length} totali
        </div>
      )}

      {/* Spiegazione */}
      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">📚 Come Leggere i Risultati</h4>
        <div className="text-sm text-blue-200 space-y-1">
          <div>• <span className="text-green-400">✅ Arbitraggio</span>: Percentuale totale &lt; 99.5% = Profitto garantito</div>
          <div>• <span className="text-yellow-400">⚠️ Quasi-Arbitraggio</span>: 99.5% ≤ Percentuale ≤ 103% = Margine basso</div>
          <div>• <span className="text-red-400">❌ Nessun Arbitraggio</span>: Percentuale &gt; 103% = Margine bookmaker alto</div>
          <div>• <strong>Soglia Ottimale</strong>: Cerca percentuali sotto 99.5% per profitto garantito</div>
        </div>
      </div>
    </div>
  );
} 