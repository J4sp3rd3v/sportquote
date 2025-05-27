'use client';

import React, { useState, useMemo } from 'react';
import { Match, BestOdds, HandicapOdds } from '@/types';
import { TrendingUp, Target, Calculator, BarChart3, Zap, Trophy } from 'lucide-react';

interface AdvancedOddsAnalyzerProps {
  matches: Match[];
}

interface HandicapAnalysis {
  handicap: number;
  homeOdds: number;
  awayOdds: number;
  homeBookmaker: string;
  awayBookmaker: string;
  value: number; // Valore complessivo dell'handicap
  balance: number; // Equilibrio tra le quote
}

interface MatchAnalysis {
  match: Match;
  bestOdds: BestOdds;
  handicapAnalysis: HandicapAnalysis[];
  valueRating: number; // 1-10
  arbitrageOpportunity: boolean;
  recommendedBets: string[];
}

export default function AdvancedOddsAnalyzer({ matches }: AdvancedOddsAnalyzerProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [analysisType, setAnalysisType] = useState<'value' | 'handicap' | 'arbitrage'>('value');
  const [minValueRating, setMinValueRating] = useState(6);

  // Analizza tutte le partite
  const matchAnalyses = useMemo(() => {
    return matches.map(match => analyzeMatch(match)).filter(analysis => analysis.valueRating >= minValueRating);
  }, [matches, minValueRating]);

  // Analizza una singola partita
  function analyzeMatch(match: Match): MatchAnalysis {
    const bestOdds = calculateBestOdds(match);
    const handicapAnalysis = analyzeHandicaps(match);
    const valueRating = calculateValueRating(match, bestOdds);
    const arbitrageOpportunity = checkArbitrageOpportunity(bestOdds);
    const recommendedBets = generateRecommendations(match, bestOdds, handicapAnalysis);

    return {
      match,
      bestOdds,
      handicapAnalysis,
      valueRating,
      arbitrageOpportunity,
      recommendedBets
    };
  }

  // Calcola le migliori quote
  function calculateBestOdds(match: Match): BestOdds {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: odd.bookmaker }));

    const bestHome = homeOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestAway = awayOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestDraw = drawOdds.length > 0 ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best) : undefined;

    return {
      home: bestHome,
      away: bestAway,
      draw: bestDraw
    };
  }

  // Analizza tutti gli handicap disponibili
  function analyzeHandicaps(match: Match): HandicapAnalysis[] {
    const handicapMap = new Map<number, { home: { odds: number; bookmaker: string }[], away: { odds: number; bookmaker: string }[] }>();

    // Raggruppa handicap per valore
    match.odds.forEach(odd => {
      if (odd.handicap && odd.handicap.length > 0) {
        odd.handicap.forEach(h => {
          if (!handicapMap.has(h.handicap)) {
            handicapMap.set(h.handicap, { home: [], away: [] });
          }
          handicapMap.get(h.handicap)!.home.push({ odds: h.home, bookmaker: h.bookmaker });
          handicapMap.get(h.handicap)!.away.push({ odds: h.away, bookmaker: h.bookmaker });
        });
      }
    });

    // Analizza ogni handicap
    const analyses: HandicapAnalysis[] = [];
    handicapMap.forEach((data, handicap) => {
      if (data.home.length > 0 && data.away.length > 0) {
        const bestHome = data.home.reduce((best, current) => current.odds > best.odds ? current : best);
        const bestAway = data.away.reduce((best, current) => current.odds > best.odds ? current : best);
        
        const value = (bestHome.odds + bestAway.odds) / 2; // Valore medio
        const balance = Math.abs(bestHome.odds - bestAway.odds); // Differenza tra quote
        
        analyses.push({
          handicap,
          homeOdds: bestHome.odds,
          awayOdds: bestAway.odds,
          homeBookmaker: bestHome.bookmaker,
          awayBookmaker: bestAway.bookmaker,
          value,
          balance
        });
      }
    });

    return analyses.sort((a, b) => b.value - a.value); // Ordina per valore decrescente
  }

  // Calcola rating di valore (1-10)
  function calculateValueRating(match: Match, bestOdds: BestOdds): number {
    const avgOdds = (bestOdds.home.odds + bestOdds.away.odds + (bestOdds.draw?.odds || 0)) / (bestOdds.draw ? 3 : 2);
    const numBookmakers = match.odds.length;
    const hasHandicaps = match.odds.some(odd => odd.handicap && odd.handicap.length > 0);
    
    let rating = 5; // Base rating
    
    // Bonus per quote interessanti
    if (avgOdds >= 2.0 && avgOdds <= 3.0) rating += 2;
    else if (avgOdds >= 1.8 && avgOdds <= 4.0) rating += 1;
    
    // Bonus per numero di bookmaker
    if (numBookmakers >= 10) rating += 1;
    else if (numBookmakers >= 6) rating += 0.5;
    
    // Bonus per handicap disponibili
    if (hasHandicaps) rating += 1;
    
    // Bonus per equilibrio quote
    const diff = Math.abs(bestOdds.home.odds - bestOdds.away.odds);
    if (diff < 0.3) rating += 1;
    else if (diff < 0.6) rating += 0.5;
    
    return Math.min(10, Math.max(1, Math.round(rating * 10) / 10));
  }

  // Controlla opportunità di arbitraggio con calcolo corretto per il calcio
  function checkArbitrageOpportunity(bestOdds: BestOdds): boolean {
    // Per il calcio: (100÷quota1)+(100÷quotaX)+(100÷quota2)+(100÷quota1X)+(100÷quotaX2)+(100÷quota12)
    // Calcolo base per 1X2
    let totalPercentage = (100 / bestOdds.home.odds) + (100 / bestOdds.away.odds);
    if (bestOdds.draw) {
      totalPercentage += (100 / bestOdds.draw.odds);
    }
    
    // TODO: Aggiungere calcolo per doppia chance (1X, X2, 12) quando disponibili
    // Per ora usiamo il calcolo base 1X2
    
    return totalPercentage < 98; // Margine per arbitraggio (sotto 100% = profitto garantito)
  }

  // Calcola percentuali per il calcio
  function calculateFootballPercentages(bestOdds: BestOdds): { total: number; home: number; draw?: number; away: number } {
    const homePercentage = 100 / bestOdds.home.odds;
    const awayPercentage = 100 / bestOdds.away.odds;
    const drawPercentage = bestOdds.draw ? 100 / bestOdds.draw.odds : undefined;
    
    let total = homePercentage + awayPercentage;
    if (drawPercentage) {
      total += drawPercentage;
    }
    
    return {
      total: Math.round(total * 100) / 100,
      home: Math.round(homePercentage * 100) / 100,
      draw: drawPercentage ? Math.round(drawPercentage * 100) / 100 : undefined,
      away: Math.round(awayPercentage * 100) / 100
    };
  }

  // Genera raccomandazioni
  function generateRecommendations(match: Match, bestOdds: BestOdds, handicapAnalysis: HandicapAnalysis[]): string[] {
    const recommendations: string[] = [];
    const percentages = calculateFootballPercentages(bestOdds);
    
    // Raccomandazione quote principali
    if (bestOdds.home.odds > 2.5) {
      recommendations.push(`🏠 Casa vincente a quota ${bestOdds.home.odds.toFixed(2)} (${bestOdds.home.bookmaker}) - ${percentages.home}%`);
    }
    if (bestOdds.away.odds > 2.5) {
      recommendations.push(`✈️ Trasferta vincente a quota ${bestOdds.away.odds.toFixed(2)} (${bestOdds.away.bookmaker}) - ${percentages.away}%`);
    }
    
    // Raccomandazione handicap
    if (handicapAnalysis.length > 0) {
      const bestHandicap = handicapAnalysis[0];
      if (bestHandicap.value > 2.0) {
        recommendations.push(`🎯 Handicap ${bestHandicap.handicap > 0 ? '+' : ''}${bestHandicap.handicap} - Valore ${bestHandicap.value.toFixed(2)}`);
      }
    }
    
    // Raccomandazione arbitraggio con percentuali
    if (checkArbitrageOpportunity(bestOdds)) {
      recommendations.push(`💰 Arbitraggio rilevato! Totale: ${percentages.total}% (Profitto: ${(100 - percentages.total).toFixed(2)}%)`);
    }
    
    return recommendations;
  }

  // Filtra analisi per tipo
  const filteredAnalyses = useMemo(() => {
    switch (analysisType) {
      case 'value':
        return matchAnalyses.filter(a => a.valueRating >= 7);
      case 'handicap':
        return matchAnalyses.filter(a => a.handicapAnalysis.length > 0);
      case 'arbitrage':
        return matchAnalyses.filter(a => a.arbitrageOpportunity);
      default:
        return matchAnalyses;
    }
  }, [matchAnalyses, analysisType]);

  const getValueColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400 bg-green-900/20';
    if (rating >= 6) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-red-400 bg-red-900/20';
  };

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-6 w-6 text-primary-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">📊 Analisi Avanzata Quote</h2>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Tipo Analisi</label>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as 'value' | 'handicap' | 'arbitrage')}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
          >
            <option value="value">🎯 Value Betting</option>
            <option value="handicap">⚖️ Analisi Handicap</option>
            <option value="arbitrage">💰 Arbitraggio</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Rating Minimo</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={minValueRating}
            onChange={(e) => setMinValueRating(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-dark-400 mt-1">{minValueRating}/10</div>
        </div>
        
        <div className="flex items-end">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{filteredAnalyses.length}</div>
            <div className="text-sm text-dark-400">Opportunità trovate</div>
          </div>
        </div>
      </div>

      {/* Lista Analisi */}
      <div className="space-y-4">
        {filteredAnalyses.map((analysis) => (
          <div
            key={analysis.match.id}
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
              selectedMatch?.id === analysis.match.id
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-600 bg-dark-700/50 hover:border-primary-500/50'
            }`}
            onClick={() => setSelectedMatch(analysis.match)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {analysis.match.homeTeam} vs {analysis.match.awayTeam}
                </h3>
                <p className="text-dark-400 text-sm">{analysis.match.league} • {analysis.match.sport}</p>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getValueColor(analysis.valueRating)}`}>
                  Rating: {analysis.valueRating}/10
                </div>
                {analysis.arbitrageOpportunity && (
                  <div className="text-xs text-green-400 mt-1 flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Arbitraggio
                  </div>
                )}
              </div>
            </div>

            {/* Quote Principali con Percentuali */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-dark-600/50 rounded">
                <div className="text-xs text-dark-400">Casa</div>
                <div className="font-bold text-white">{analysis.bestOdds.home.odds.toFixed(2)}</div>
                <div className="text-xs text-green-400">{(100 / analysis.bestOdds.home.odds).toFixed(1)}%</div>
                <div className="text-xs text-primary-400 truncate">{analysis.bestOdds.home.bookmaker}</div>
              </div>
              {analysis.bestOdds.draw && (
                <div className="text-center p-2 bg-dark-600/50 rounded">
                  <div className="text-xs text-dark-400">Pareggio</div>
                  <div className="font-bold text-white">{analysis.bestOdds.draw.odds.toFixed(2)}</div>
                  <div className="text-xs text-yellow-400">{(100 / analysis.bestOdds.draw.odds).toFixed(1)}%</div>
                  <div className="text-xs text-primary-400 truncate">{analysis.bestOdds.draw.bookmaker}</div>
                </div>
              )}
              <div className="text-center p-2 bg-dark-600/50 rounded">
                <div className="text-xs text-dark-400">Trasferta</div>
                <div className="font-bold text-white">{analysis.bestOdds.away.odds.toFixed(2)}</div>
                <div className="text-xs text-blue-400">{(100 / analysis.bestOdds.away.odds).toFixed(1)}%</div>
                <div className="text-xs text-primary-400 truncate">{analysis.bestOdds.away.bookmaker}</div>
              </div>
            </div>

            {/* Totale Percentuali per Arbitraggio */}
            {(() => {
              const totalPercentage = (100 / analysis.bestOdds.home.odds) + 
                                    (100 / analysis.bestOdds.away.odds) + 
                                    (analysis.bestOdds.draw ? (100 / analysis.bestOdds.draw.odds) : 0);
              const profit = 100 - totalPercentage;
              
              return (
                <div className={`text-center p-2 rounded mb-3 ${
                  totalPercentage < 98 ? 'bg-green-900/30 border border-green-500/50' : 'bg-dark-600/30'
                }`}>
                  <div className="text-xs text-dark-400">Totale Percentuali</div>
                  <div className={`font-bold ${totalPercentage < 98 ? 'text-green-400' : 'text-white'}`}>
                    {totalPercentage.toFixed(2)}%
                  </div>
                  {totalPercentage < 98 && (
                    <div className="text-xs text-green-300">
                      💰 Profitto garantito: {profit.toFixed(2)}%
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Migliori Handicap */}
            {analysis.handicapAnalysis.length > 0 && (
              <div className="border-t border-dark-600 pt-3 mb-3">
                <div className="text-xs text-accent-400 mb-2 font-medium">
                  🎯 Top 3 Handicap per Valore
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {analysis.handicapAnalysis.slice(0, 3).map((handicap, index) => (
                    <div key={index} className="p-2 bg-accent-900/20 border border-accent-500/30 rounded">
                      <div className="text-xs text-accent-300 mb-1">
                        Handicap {handicap.handicap > 0 ? '+' : ''}{handicap.handicap}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-accent-400">{handicap.homeOdds.toFixed(2)}</span>
                        <span className="text-accent-400">{handicap.awayOdds.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-accent-300 mt-1">
                        Valore: {handicap.value.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raccomandazioni */}
            {analysis.recommendedBets.length > 0 && (
              <div className="bg-dark-800/50 rounded-lg p-3">
                <div className="text-xs text-dark-300 mb-2 font-medium">💡 Raccomandazioni:</div>
                <div className="space-y-1">
                  {analysis.recommendedBets.map((bet, index) => (
                    <div key={index} className="text-xs text-dark-300">
                      {bet}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAnalyses.length === 0 && (
        <div className="text-center py-8 text-dark-400 bg-dark-700/30 rounded-lg">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Nessuna opportunità trovata</p>
          <p className="text-sm mt-1">Prova ad abbassare il rating minimo o cambiare tipo di analisi</p>
        </div>
      )}
    </div>
  );
} 