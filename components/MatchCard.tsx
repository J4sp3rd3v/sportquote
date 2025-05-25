'use client';

import React from 'react';
import { Clock, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { Match, BestOdds } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface MatchCardProps {
  match: Match;
  bestOdds: BestOdds;
  onViewDetails: (matchId: string) => void;
}

export default function MatchCard({ match, bestOdds, onViewDetails }: MatchCardProps) {
  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy - HH:mm', { locale: it });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'Prossima';
      case 'finished':
        return 'Finita';
      default:
        return status;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
            {getStatusText(match.status)}
          </span>
          <span className="text-sm text-gray-500">{match.league}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {formatDate(match.date)}
        </div>
      </div>

      {/* Teams */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{match.homeTeam.charAt(0)}</span>
            </div>
            <span className="font-semibold text-gray-900">{match.homeTeam}</span>
          </div>
          <span className="text-gray-400 font-medium">VS</span>
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900">{match.awayTeam}</span>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{match.awayTeam.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Odds */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-1 text-primary-600" />
          Migliori Quote
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {/* Home Win */}
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">1</div>
            <div className="font-bold text-lg text-gray-900">{bestOdds.home.odds}</div>
            <div className="text-xs text-primary-600 font-medium">{bestOdds.home.bookmaker}</div>
          </div>

          {/* Draw (if available) */}
          {bestOdds.draw && (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">X</div>
              <div className="font-bold text-lg text-gray-900">{bestOdds.draw.odds}</div>
              <div className="text-xs text-primary-600 font-medium">{bestOdds.draw.bookmaker}</div>
            </div>
          )}

          {/* Away Win */}
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">2</div>
            <div className="font-bold text-lg text-gray-900">{bestOdds.away.odds}</div>
            <div className="text-xs text-primary-600 font-medium">{bestOdds.away.bookmaker}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span>{match.odds.length} bookmakers</span>
        <span className="flex items-center">
          <Star className="h-4 w-4 mr-1 text-yellow-500" />
          Quote aggiornate
        </span>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => onViewDetails(match.id)}
          className="flex-1 btn-primary flex items-center justify-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Confronta Tutte
        </button>
        <button className="btn-secondary">
          <Star className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 