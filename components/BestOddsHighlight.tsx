'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Star, Target, Calculator, Zap, Trophy, BarChart3, ExternalLink, Info } from 'lucide-react';
import { Match, BestOdds } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import SmartBookmakerHandler from './SmartBookmakerHandler';

interface BestOddsHighlightProps {
  matches: Match[];
  onMatchClick?: (match: Match) => void;
}

interface OpportunityAnalysis {
  match: Match;
  bestOdds: BestOdds;
  type: 'highest_odds' | 'value_bet' | 'balanced' | 'safe_bet';
  score: number;
  analysis: string;
  recommendation: string;
}

export default function BestOddsHighlight({ matches, onMatchClick }: BestOddsHighlightProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSimulator, setShowSimulator] = useState<string | null>(null);

  // Calcola le migliori quote per ogni partita
  const calculateBestOdds = (match: Match): BestOdds => {
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
  };

  // Analizza le opportunità
  const opportunities = useMemo(() => {
    const analyzed: OpportunityAnalysis[] = [];

    matches.forEach(match => {
      const bestOdds = calculateBestOdds(match);
      const maxOdd = Math.max(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || 0);
      const minOdd = Math.min(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || Infinity);
      const avgOdd = (bestOdds.home.odds + bestOdds.away.odds + (bestOdds.draw?.odds || 0)) / (bestOdds.draw ? 3 : 2);
      const oddsDiff = Math.abs(bestOdds.home.odds - bestOdds.away.odds);

      // Quote Alte
      if (maxOdd >= 4.0) {
        analyzed.push({
          match,
          bestOdds,
          type: 'highest_odds',
          score: maxOdd,
          analysis: `Quota massima di ${maxOdd.toFixed(2)} - Opportunità ad alto rendimento`,
          recommendation: 'Ideale per scommesse a basso rischio con alta ricompensa'
        });
      }

      // Value Betting (quote medie buone)
      if (avgOdd >= 2.2 && avgOdd <= 3.5) {
        analyzed.push({
          match,
          bestOdds,
          type: 'value_bet',
          score: avgOdd,
          analysis: `Quote equilibrate con media ${avgOdd.toFixed(2)} - Buon valore atteso`,
          recommendation: 'Perfetto per strategie di value betting'
        });
      }

      // Partite Equilibrate
      if (oddsDiff < 0.4 && bestOdds.home.odds >= 1.8 && bestOdds.home.odds <= 2.5) {
        analyzed.push({
          match,
          bestOdds,
          type: 'balanced',
          score: 3 - oddsDiff, // Più equilibrata = score più alto
          analysis: `Partita molto equilibrata (diff: ${oddsDiff.toFixed(2)})`,
          recommendation: 'Ottima per scommesse su pareggio o doppia chance'
        });
      }

      // Scommesse Sicure
      if (minOdd >= 1.2 && minOdd <= 1.6) {
        analyzed.push({
          match,
          bestOdds,
          type: 'safe_bet',
          score: 2 - minOdd, // Quote più basse = più sicure
          analysis: `Quota sicura disponibile: ${minOdd.toFixed(2)}`,
          recommendation: 'Ideale per bankroll management conservativo'
        });
      }
    });

    // Ordina per score e prendi i migliori
    return analyzed
      .sort((a, b) => b.score - a.score)
      .slice(0, 12); // Massimo 12 opportunità
  }, [matches]);

  // Filtra per categoria
  const filteredOpportunities = useMemo(() => {
    if (selectedCategory === 'all') return opportunities;
    return opportunities.filter(opp => opp.type === selectedCategory);
  }, [opportunities, selectedCategory]);

  const categories = [
    { id: 'all', name: 'Tutte', icon: <Star className="h-4 w-4" />, color: 'primary' },
    { id: 'highest_odds', name: 'Quote Alte', icon: <Zap className="h-4 w-4" />, color: 'red' },
    { id: 'value_bet', name: 'Value Bet', icon: <Target className="h-4 w-4" />, color: 'blue' },
    { id: 'balanced', name: 'Equilibrate', icon: <BarChart3 className="h-4 w-4" />, color: 'purple' },
    { id: 'safe_bet', name: 'Sicure', icon: <Trophy className="h-4 w-4" />, color: 'green' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'highest_odds': return 'border-red-500 bg-red-500/10';
      case 'value_bet': return 'border-blue-500 bg-blue-500/10';
      case 'balanced': return 'border-purple-500 bg-purple-500/10';
      case 'safe_bet': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'highest_odds': return <Zap className="h-4 w-4 text-red-400" />;
      case 'value_bet': return <Target className="h-4 w-4 text-blue-400" />;
      case 'balanced': return <BarChart3 className="h-4 w-4 text-purple-400" />;
      case 'safe_bet': return <Trophy className="h-4 w-4 text-green-400" />;
      default: return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'highest_odds': return 'Quote Alte';
      case 'value_bet': return 'Value Bet';
      case 'balanced': return 'Equilibrata';
      case 'safe_bet': return 'Sicura';
      default: return 'Opportunità';
    }
  };

  if (opportunities.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6 text-center">
        <Star className="h-12 w-12 text-dark-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-dark-300 mb-2">Nessuna opportunità disponibile</h3>
        <p className="text-dark-400">Le migliori opportunità appariranno qui quando saranno disponibili nuove partite</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedCategory === category.id
                ? 'border-primary-500 bg-primary-500/20 text-white'
                : 'border-dark-600 bg-dark-700/50 text-dark-300 hover:border-dark-500'
            }`}
          >
            {category.icon}
            <span className="text-sm font-medium">{category.name}</span>
            <span className="text-xs bg-dark-600 px-2 py-1 rounded-full">
              {category.id === 'all' ? opportunities.length : opportunities.filter(o => o.type === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity, index) => (
          <div
            key={`${opportunity.match.id}-${opportunity.type}`}
            className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${getTypeColor(opportunity.type)}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(opportunity.type)}
                <span className="font-medium text-white text-sm">{getTypeName(opportunity.type)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-dark-400">
                  {format(opportunity.match.date, 'dd/MM HH:mm', { locale: it })}
                </span>
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Match Info */}
            <div className="mb-4">
              <h3 className="font-bold text-white text-lg mb-1">
                {opportunity.match.homeTeam} vs {opportunity.match.awayTeam}
              </h3>
              <p className="text-dark-400 text-sm">{opportunity.match.league}</p>
            </div>

            {/* Best Odds Display */}
            <div className={`grid gap-2 mb-4 ${opportunity.bestOdds.draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {/* Home */}
              <SmartBookmakerHandler
                bookmakerName={opportunity.bestOdds.home.bookmaker}
                matchInfo={{
                  homeTeam: opportunity.match.homeTeam,
                  awayTeam: opportunity.match.awayTeam,
                  sport: opportunity.match.sport
                }}
                className="bg-dark-600/50 rounded-lg p-3 text-center cursor-pointer hover:bg-dark-500/50 transition-colors group"
              >
                <div className="text-xs text-dark-400 mb-1">1</div>
                <div className="font-bold text-white text-lg">{opportunity.bestOdds.home.odds.toFixed(2)}</div>
                <div className="text-xs text-primary-400 truncate flex items-center justify-center">
                  {opportunity.bestOdds.home.bookmaker}
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </SmartBookmakerHandler>

              {/* Draw */}
              {opportunity.bestOdds.draw && (
                <SmartBookmakerHandler
                  bookmakerName={opportunity.bestOdds.draw.bookmaker}
                  matchInfo={{
                    homeTeam: opportunity.match.homeTeam,
                    awayTeam: opportunity.match.awayTeam,
                    sport: opportunity.match.sport
                  }}
                  className="bg-dark-600/50 rounded-lg p-3 text-center cursor-pointer hover:bg-dark-500/50 transition-colors group"
                >
                  <div className="text-xs text-dark-400 mb-1">X</div>
                  <div className="font-bold text-white text-lg">{opportunity.bestOdds.draw.odds.toFixed(2)}</div>
                  <div className="text-xs text-primary-400 truncate flex items-center justify-center">
                    {opportunity.bestOdds.draw.bookmaker}
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </SmartBookmakerHandler>
              )}

              {/* Away */}
              <SmartBookmakerHandler
                bookmakerName={opportunity.bestOdds.away.bookmaker}
                matchInfo={{
                  homeTeam: opportunity.match.homeTeam,
                  awayTeam: opportunity.match.awayTeam,
                  sport: opportunity.match.sport
                }}
                className="bg-dark-600/50 rounded-lg p-3 text-center cursor-pointer hover:bg-dark-500/50 transition-colors group"
              >
                <div className="text-xs text-dark-400 mb-1">2</div>
                <div className="font-bold text-white text-lg">{opportunity.bestOdds.away.odds.toFixed(2)}</div>
                <div className="text-xs text-primary-400 truncate flex items-center justify-center">
                  {opportunity.bestOdds.away.bookmaker}
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </SmartBookmakerHandler>
            </div>

            {/* Analysis */}
            <div className="bg-dark-700/50 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium mb-1">{opportunity.analysis}</p>
                  <p className="text-dark-300 text-xs">{opportunity.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-dark-400 text-sm">Score Opportunità:</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.min(5, Math.ceil(opportunity.score))
                          ? 'text-yellow-400 fill-current'
                          : 'text-dark-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-white font-bold">{opportunity.score.toFixed(1)}</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onMatchClick?.(opportunity.match)}
                className="flex-1 btn-primary flex items-center justify-center text-sm"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analizza
              </button>
              <button
                onClick={() => setShowSimulator(showSimulator === opportunity.match.id ? null : opportunity.match.id)}
                className="btn-secondary p-2"
              >
                <Calculator className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Simulator */}
            {showSimulator === opportunity.match.id && (
              <div className="mt-4 p-4 bg-dark-800/50 border border-dark-600 rounded-lg">
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Simulazione Rapida
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-dark-400 mb-1">Puntata (€)</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                      min="1"
                      max="1000"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-dark-400">Casa (€10)</div>
                      <div className="text-success-400 font-bold">
                        €{(10 * opportunity.bestOdds.home.odds).toFixed(2)}
                      </div>
                    </div>
                    {opportunity.bestOdds.draw && (
                      <div className="text-center">
                        <div className="text-dark-400">Pareggio (€10)</div>
                        <div className="text-success-400 font-bold">
                          €{(10 * opportunity.bestOdds.draw.odds).toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-dark-400">Trasferta (€10)</div>
                      <div className="text-success-400 font-bold">
                        €{(10 * opportunity.bestOdds.away.odds).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 text-primary-400 mr-2" />
          Riepilogo Opportunità del Giorno
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map((category) => {
            const count = opportunities.filter(o => o.type === category.id).length;
            const avgScore = count > 0 
              ? opportunities.filter(o => o.type === category.id).reduce((sum, o) => sum + o.score, 0) / count 
              : 0;
            
            return (
              <div key={category.id} className="text-center p-4 bg-dark-700/50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {category.icon}
                </div>
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="text-xs text-dark-400 mb-1">{category.name}</div>
                {avgScore > 0 && (
                  <div className="text-xs text-primary-400">
                    Score medio: {avgScore.toFixed(1)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 