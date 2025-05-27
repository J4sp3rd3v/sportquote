'use client';

import React from 'react';
import { Clock, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { Match, BestOdds } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { getBookmakerInfo, BookmakerInfo } from '@/lib/bookmakerLinks';
import SmartBookmakerHandler from './SmartBookmakerHandler';

interface MatchCardProps {
  match: Match;
  bestOdds: BestOdds;
  onViewDetails: (matchId: string) => void;
  onOpenBookmaker?: (url: string, bookmakerName: string, matchInfo: any) => void;
}

export default function MatchCard({ match, bestOdds, onViewDetails, onOpenBookmaker }: MatchCardProps) {
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 flex-wrap">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
            {getStatusText(match.status)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 truncate">{match.league}</span>
        </div>
        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="truncate">{formatDate(match.date)}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">{match.homeTeam.charAt(0)}</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{match.homeTeam}</span>
          </div>
          <span className="text-gray-400 font-medium text-center text-sm sm:text-base px-2">VS</span>
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 sm:justify-end">
            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate order-2 sm:order-1">{match.awayTeam}</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 order-1 sm:order-2">
              <span className="text-xs font-bold">{match.awayTeam.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Odds */}
      <div className="mb-4">
        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary-600" />
          Migliori Quote 1X2
        </h4>
        <div className={`grid gap-2 sm:gap-3 ${bestOdds.draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {/* Home Win */}
          <SmartBookmakerHandler
            bookmakerName={bestOdds.home.bookmaker}
            matchInfo={{
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              sport: match.sport
            }}
            className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center cursor-pointer hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all duration-200 group"
          >
            <div className="text-xs text-gray-500 mb-1 group-hover:text-primary-600">1</div>
            <div className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary-700">{bestOdds.home.odds}</div>
            <div className="text-xs text-primary-600 font-medium truncate flex items-center justify-center">
              {bestOdds.home.bookmaker}
              <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </SmartBookmakerHandler>

          {/* Draw (if available) */}
          {bestOdds.draw && (
            <SmartBookmakerHandler
              bookmakerName={bestOdds.draw!.bookmaker}
              matchInfo={{
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                sport: match.sport
              }}
              className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center cursor-pointer hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all duration-200 group"
            >
              <div className="text-xs text-gray-500 mb-1 group-hover:text-primary-600">X</div>
              <div className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary-700">{bestOdds.draw.odds}</div>
              <div className="text-xs text-primary-600 font-medium truncate flex items-center justify-center">
                {bestOdds.draw.bookmaker}
                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </SmartBookmakerHandler>
          )}

          {/* Away Win */}
          <SmartBookmakerHandler
            bookmakerName={bestOdds.away.bookmaker}
            matchInfo={{
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              sport: match.sport
            }}
            className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center cursor-pointer hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all duration-200 group"
          >
            <div className="text-xs text-gray-500 mb-1 group-hover:text-primary-600">2</div>
            <div className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary-700">{bestOdds.away.odds}</div>
            <div className="text-xs text-primary-600 font-medium truncate flex items-center justify-center">
              {bestOdds.away.bookmaker}
              <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </SmartBookmakerHandler>
        </div>
      </div>

      {/* Handicap Odds */}
      {bestOdds.bestHandicap && (
        <div className="mb-4">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-accent-600" />
            Quote Handicap ({bestOdds.bestHandicap.handicap > 0 ? '+' : ''}{bestOdds.bestHandicap.handicap})
          </h4>
          <div className="grid gap-2 sm:gap-3 grid-cols-2">
            {/* Home Handicap */}
            <SmartBookmakerHandler
              bookmakerName={bestOdds.bestHandicap.home.bookmaker}
              matchInfo={{
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                sport: match.sport
              }}
              className="bg-accent-50 rounded-lg p-2 sm:p-3 text-center cursor-pointer hover:bg-accent-100 hover:border-accent-200 border border-transparent transition-all duration-200 group"
            >
              <div className="text-xs text-gray-500 mb-1 group-hover:text-accent-600">
                {match.homeTeam.substring(0, 8)}... {bestOdds.bestHandicap.handicap > 0 ? '+' : ''}{bestOdds.bestHandicap.handicap}
              </div>
              <div className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-accent-700">{bestOdds.bestHandicap.home.odds}</div>
              <div className="text-xs text-accent-600 font-medium truncate flex items-center justify-center">
                {bestOdds.bestHandicap.home.bookmaker}
                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </SmartBookmakerHandler>

            {/* Away Handicap */}
            <SmartBookmakerHandler
              bookmakerName={bestOdds.bestHandicap.away.bookmaker}
              matchInfo={{
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                sport: match.sport
              }}
              className="bg-accent-50 rounded-lg p-2 sm:p-3 text-center cursor-pointer hover:bg-accent-100 hover:border-accent-200 border border-transparent transition-all duration-200 group"
            >
              <div className="text-xs text-gray-500 mb-1 group-hover:text-accent-600">
                {match.awayTeam.substring(0, 8)}... {-bestOdds.bestHandicap.handicap > 0 ? '+' : ''}{-bestOdds.bestHandicap.handicap}
              </div>
              <div className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-accent-700">{bestOdds.bestHandicap.away.odds}</div>
              <div className="text-xs text-accent-600 font-medium truncate flex items-center justify-center">
                {bestOdds.bestHandicap.away.bookmaker}
                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </SmartBookmakerHandler>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between items-center mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
        <span>{match.odds.length} bookmakers</span>
        <span className="flex items-center">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
          <span className="hidden sm:inline">Quote aggiornate</span>
          <span className="sm:hidden">Aggiornate</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 sm:space-x-3">
        <button
          onClick={() => onViewDetails(match.id)}
          className="flex-1 btn-primary flex items-center justify-center text-sm"
        >
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Confronta Tutte</span>
          <span className="sm:hidden">Confronta</span>
        </button>
        <button className="btn-secondary p-2 sm:p-3">
          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
} 