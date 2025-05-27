'use client';

import React from 'react';
import { Clock, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { Match, BestOdds } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { optimizedBookmakerManager } from '@/lib/optimizedBookmakerManager';
import SmartBookmakerHandler from './SmartBookmakerHandler';

interface MatchCardProps {
  match: Match;
  bestOdds: BestOdds;
  onViewDetails: (matchId: string) => void;
  onOpenBookmaker?: (url: string, bookmakerName: string, matchInfo: any) => void;
}

export default function MatchCard({ match, bestOdds, onViewDetails, onOpenBookmaker }: MatchCardProps) {
  // Calcola se c'è un'opportunità di arbitraggio
  const calculateArbitrage = () => {
    if (bestOdds.draw) {
      const totalImplied = (1 / bestOdds.home.odds) + (1 / bestOdds.away.odds) + (1 / bestOdds.draw.odds);
      if (totalImplied < 1) {
        const profit = ((1 / totalImplied) - 1) * 100;
        return profit > 0.5 ? profit : null;
      }
    } else {
      const totalImplied = (1 / bestOdds.home.odds) + (1 / bestOdds.away.odds);
      if (totalImplied < 1) {
        const profit = ((1 / totalImplied) - 1) * 100;
        return profit > 0.5 ? profit : null;
      }
    }
    return null;
  };

  const arbitrageProfit = calculateArbitrage();

  const handleBookmakerClick = (bookmakerName: string) => {
    const matchInfo = {
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      sport: match.sport,
      league: match.league
    };

    optimizedBookmakerManager.openBookmaker(bookmakerName, matchInfo);
  };

  const getCategoryColor = (bookmakerName: string) => {
    const info = optimizedBookmakerManager.getBookmakerInfo(bookmakerName);
    if (!info.isSupported) return 'bg-gray-100 text-gray-800';
    
    switch (info.config?.category) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'international': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isBookmakerVerified = (bookmakerName: string) => {
    const info = optimizedBookmakerManager.getBookmakerInfo(bookmakerName);
    return info.isSupported && info.config?.verified;
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border ${
      arbitrageProfit ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'
    }`}>
      {/* Header con arbitraggio */}
      {arbitrageProfit && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Arbitraggio</span>
            </div>
            <span className="text-sm font-bold">+{arbitrageProfit.toFixed(2)}%</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Match Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(match.sport)}`}>
                {match.sport}
              </span>
              <span className="text-xs text-gray-500">{match.league}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {format(match.date, 'HH:mm', { locale: it })}
        </div>
      </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
          
          <p className="text-sm text-gray-600">
            {format(match.date, 'EEEE dd MMMM', { locale: it })}
          </p>
        </div>

        {/* Best Odds */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Casa</div>
              <div className="text-lg font-bold text-blue-600">{bestOdds.home.odds.toFixed(2)}</div>
              <div className="text-xs text-gray-600 truncate flex items-center justify-center">
                {isBookmakerVerified(bestOdds.home.bookmaker) && (
                  <span className="text-green-500 mr-1" title="Verificato">✓</span>
                )}
                {bestOdds.home.bookmaker}
              </div>
            </div>
            
            {bestOdds.draw && (
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">X</div>
                <div className="text-lg font-bold text-gray-600">{bestOdds.draw.odds.toFixed(2)}</div>
                <div className="text-xs text-gray-600 truncate flex items-center justify-center">
                  {isBookmakerVerified(bestOdds.draw.bookmaker) && (
                    <span className="text-green-500 mr-1" title="Verificato">✓</span>
                  )}
                  {bestOdds.draw.bookmaker}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Ospite</div>
              <div className="text-lg font-bold text-red-600">{bestOdds.away.odds.toFixed(2)}</div>
              <div className="text-xs text-gray-600 truncate flex items-center justify-center">
                {isBookmakerVerified(bestOdds.away.bookmaker) && (
                  <span className="text-green-500 mr-1" title="Verificato">✓</span>
                )}
                {bestOdds.away.bookmaker}
          </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleBookmakerClick(bestOdds.home.bookmaker)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Scommetti Casa
          </button>
          <button
            onClick={() => handleBookmakerClick(bestOdds.away.bookmaker)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Scommetti Ospite
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{match.odds.length} bookmaker</span>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Quote aggiornate</span>
        </div>
      </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(match.id)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Vedi Dettagli
          </button>
          <SmartBookmakerHandler
            bookmakerName={bestOdds.home.bookmaker}
            matchInfo={{
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              sport: match.sport,
              league: match.league
            }}
            onBookmakerOpen={onOpenBookmaker}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Migliore
          </SmartBookmakerHandler>
        </div>
      </div>
    </div>
  );
} 