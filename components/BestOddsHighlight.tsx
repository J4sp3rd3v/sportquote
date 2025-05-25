'use client';

import React from 'react';
import { TrendingUp, Award, Star, ExternalLink } from 'lucide-react';
import { Match, BestOdds } from '@/types';
import { getBookmakerInfo } from '@/lib/bookmakerLinks';

interface BestOddsHighlightProps {
  matches: Match[];
  onBookmakerClick?: (bookmakerName: string, matchInfo: any) => void;
  onMatchClick?: (match: Match) => void;
}

interface TopOddsItem {
  match: Match;
  oddType: 'home' | 'away' | 'draw';
  oddValue: number;
  bookmaker: string;
  profit: number; // Potenziale profitto su 100€
}

export default function BestOddsHighlight({ matches, onBookmakerClick, onMatchClick }: BestOddsHighlightProps) {
  // Calcola le migliori quote di tutti i match
  const calculateTopOdds = (): TopOddsItem[] => {
    const allOdds: TopOddsItem[] = [];

    matches.forEach(match => {
      match.odds.forEach(odd => {
        // Home odds
        if (odd.home > 1) {
          allOdds.push({
            match,
            oddType: 'home',
            oddValue: odd.home,
            bookmaker: odd.bookmaker,
            profit: (odd.home - 1) * 100
          });
        }

        // Away odds
        if (odd.away > 1) {
          allOdds.push({
            match,
            oddType: 'away',
            oddValue: odd.away,
            bookmaker: odd.bookmaker,
            profit: (odd.away - 1) * 100
          });
        }

        // Draw odds
        if (odd.draw && odd.draw > 1) {
          allOdds.push({
            match,
            oddType: 'draw',
            oddValue: odd.draw,
            bookmaker: odd.bookmaker,
            profit: (odd.draw - 1) * 100
          });
        }
      });
    });

    // Ordina per valore quota decrescente e prendi i top 6
    return allOdds
      .sort((a, b) => b.oddValue - a.oddValue)
      .slice(0, 6);
  };

  const topOdds = calculateTopOdds();

  if (topOdds.length === 0) {
    return null;
  }

  const getOddTypeLabel = (type: string, match: Match) => {
    switch (type) {
      case 'home':
        return `Vittoria ${match.homeTeam}`;
      case 'away':
        return `Vittoria ${match.awayTeam}`;
      case 'draw':
        return 'Pareggio';
      default:
        return type;
    }
  };

  const getOddTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return '🏠';
      case 'away':
        return '✈️';
      case 'draw':
        return '🤝';
      default:
        return '⚽';
    }
  };

  const handleBookmakerClick = (item: TopOddsItem, event: React.MouseEvent) => {
    event.stopPropagation(); // Previene l'apertura del modal
    if (onBookmakerClick) {
      onBookmakerClick(item.bookmaker, {
        homeTeam: item.match.homeTeam,
        awayTeam: item.match.awayTeam,
        sport: item.match.sport,
        league: item.match.league
      });
    }
  };

  const handleMatchClick = (match: Match) => {
    if (onMatchClick) {
      onMatchClick(match);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">🔥 Migliori Quote del Momento</h2>
            <p className="text-sm text-gray-600">Le quote più vantaggiose disponibili ora • Clicca per vedere tutte le quote</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden sm:inline">LIVE</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>Aggiornate in tempo reale</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topOdds.map((item, index) => (
          <div
            key={`${item.match.id}-${item.oddType}-${item.bookmaker}`}
            className="bg-white rounded-lg border border-yellow-300 p-4 hover:shadow-lg transition-all duration-200 hover:border-yellow-400 relative overflow-hidden cursor-pointer"
            onClick={() => handleMatchClick(item.match)}
          >
            {/* Badge posizione */}
            <div className="absolute top-2 right-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-orange-600' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
            </div>

            {/* Contenuto principale */}
            <div className="space-y-3">
              {/* Match info */}
              <div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.match.homeTeam} vs {item.match.awayTeam}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {item.match.league} • {item.match.sport}
                </div>
              </div>

              {/* Tipo scommessa */}
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getOddTypeIcon(item.oddType)}</span>
                <span className="text-sm font-medium text-gray-700">
                  {getOddTypeLabel(item.oddType, item.match)}
                </span>
              </div>

              {/* Quota e profitto */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      {item.oddValue.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600">
                      +€{item.profit.toFixed(0)} su €100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {item.bookmaker}
                    </div>
                    <button
                      onClick={(e) => handleBookmakerClick(item, e)}
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Scommetti
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Effetto brillante per le prime 3 */}
            {index < 3 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Footer con statistiche */}
      <div className="mt-6 pt-4 border-t border-yellow-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{matches.length}</div>
            <div className="text-xs text-gray-600">Partite Analizzate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {Math.max(...topOdds.map(o => o.oddValue)).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">Quota Massima</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              €{Math.max(...topOdds.map(o => o.profit)).toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Max Profitto</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {new Set(topOdds.map(o => o.bookmaker)).size}
            </div>
            <div className="text-xs text-gray-600">Bookmaker Top</div>
          </div>
        </div>
      </div>
    </div>
  );
} 