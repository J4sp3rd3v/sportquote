'use client';

import React from 'react';
import { X, Star, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Match, Bookmaker } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { openMatchUrl, getBookmakerInfo, BookmakerInfo } from '@/lib/bookmakerLinks';

interface MatchDetailsProps {
  match: Match;
  bookmakers: Bookmaker[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchDetails({ match, bookmakers, isOpen, onClose }: MatchDetailsProps) {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return format(date, 'EEEE dd MMMM yyyy - HH:mm', { locale: it });
  };

  const getBookmakerInfo = (bookmakerId: string) => {
    return bookmakers.find(b => b.id === bookmakerId);
  };

  const handleBookmakerClick = (bookmaker: Bookmaker | undefined, betType: 'home' | 'away' | 'draw' = 'home') => {
    console.log('Bookmaker clicked:', bookmaker, 'betType:', betType);
    
    if (!bookmaker) {
      console.log('Nessun bookmaker trovato');
      alert('Bookmaker non trovato');
      return;
    }
    
    try {
      const bookmakerInfo = getBookmakerInfo(bookmaker.name);
      
      if (bookmakerInfo.hasDirectLink) {
        // Usa il sistema di link diretti alla partita
        openMatchUrl(match, bookmaker.name, betType);
      } else {
        // Fallback al sito principale del bookmaker
        const fallbackUrl = bookmaker.website || bookmakerInfo.baseUrl;
        const url = fallbackUrl?.startsWith('http') 
          ? fallbackUrl 
          : `https://${fallbackUrl}`;
          
        console.log('Aprendo URL fallback:', url);
        
        if (url && url !== 'https://undefined') {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          alert(`Sito web non disponibile per ${bookmaker.name}`);
        }
      }
    } catch (error) {
      console.error('Errore apertura finestra:', error);
      alert(`Errore nell'aprire il sito: ${error}`);
    }
  };

  const sortedOdds = match.odds.sort((a, b) => {
    const bookmakerA = getBookmakerInfo(a.bookmaker);
    const bookmakerB = getBookmakerInfo(b.bookmaker);
    return (bookmakerB?.rating || 0) - (bookmakerA?.rating || 0);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-x-0 bottom-0 top-8 sm:top-16 bg-white rounded-t-xl shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-2">
                  {match.homeTeam} vs {match.awayTeam}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200 flex-shrink-0"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="truncate">{formatDate(match.date)}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                    {match.league}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {match.sport}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
                Confronto Quote ({sortedOdds.length} bookmakers)
              </h3>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Bookmaker</th>
                      <th className="text-center py-2 sm:py-3 px-1 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">1</th>
                      {match.odds[0]?.draw && (
                        <th className="text-center py-2 sm:py-3 px-1 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">X</th>
                      )}
                      <th className="text-center py-2 sm:py-3 px-1 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">2</th>
                      <th className="text-center py-2 sm:py-3 px-1 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Bonus</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Azione</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOdds.map((odds, index) => {
                      const bookmaker = getBookmakerInfo(odds.bookmaker);
                      const isHighestHome = sortedOdds.every(o => o.home <= odds.home);
                      const isHighestAway = sortedOdds.every(o => o.away <= odds.away);
                      const isHighestDraw = odds.draw && sortedOdds.every(o => !o.draw || o.draw <= odds.draw!);

                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <span className="text-xs font-bold">
                                  {bookmaker?.name.charAt(0) || odds.bookmaker.charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                  {bookmaker?.name || `Bookmaker ${odds.bookmaker}`}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                  {bookmaker?.rating || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-1 sm:px-4 text-center">
                            <span className={`inline-block px-1 sm:px-2 py-1 rounded font-medium text-xs sm:text-sm ${
                              isHighestHome 
                                ? 'bg-success-100 text-success-800 ring-2 ring-success-200' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {odds.home}
                            </span>
                          </td>
                          {match.odds[0]?.draw && (
                            <td className="py-3 sm:py-4 px-1 sm:px-4 text-center">
                              {odds.draw ? (
                                <span className={`inline-block px-1 sm:px-2 py-1 rounded font-medium text-xs sm:text-sm ${
                                  isHighestDraw 
                                    ? 'bg-success-100 text-success-800 ring-2 ring-success-200' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {odds.draw}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          )}
                          <td className="py-3 sm:py-4 px-1 sm:px-4 text-center">
                            <span className={`inline-block px-1 sm:px-2 py-1 rounded font-medium text-xs sm:text-sm ${
                              isHighestAway 
                                ? 'bg-success-100 text-success-800 ring-2 ring-success-200' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {odds.away}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-1 sm:px-4 text-center hidden sm:table-cell">
                            <span className="text-xs text-primary-600 font-medium">
                              {bookmaker?.bonus || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <button 
                                onClick={() => handleBookmakerClick(bookmaker, 'home')}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors duration-200"
                                title={`Scommetti su vittoria ${match.homeTeam}`}
                              >
                                <span className="hidden sm:inline">1</span>
                                <span className="sm:hidden">1</span>
                              </button>
                              {match.odds[0]?.draw && (
                                <button 
                                  onClick={() => handleBookmakerClick(bookmaker, 'draw')}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors duration-200"
                                  title="Scommetti su pareggio"
                                >
                                  <span>X</span>
                                </button>
                              )}
                              <button 
                                onClick={() => handleBookmakerClick(bookmaker, 'away')}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors duration-200"
                                title={`Scommetti su vittoria ${match.awayTeam}`}
                              >
                                <span className="hidden sm:inline">2</span>
                                <span className="sm:hidden">2</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Odds Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                📊 Riassunto Migliori Quote
              </h4>
              <div className={`grid gap-3 sm:gap-4 ${match.odds[0]?.draw ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1 truncate">Vittoria {match.homeTeam}</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {Math.max(...sortedOdds.map(o => o.home))}
                  </div>
                  <div className="text-xs text-primary-600 font-medium truncate">
                    {getBookmakerInfo(
                      sortedOdds.find(o => o.home === Math.max(...sortedOdds.map(o => o.home)))?.bookmaker || ''
                    )?.name}
                  </div>
                </div>
                
                {match.odds[0]?.draw && (
                  <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Pareggio</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {Math.max(...sortedOdds.filter(o => o.draw).map(o => o.draw!))}
                    </div>
                    <div className="text-xs text-primary-600 font-medium truncate">
                      {getBookmakerInfo(
                        sortedOdds.find(o => o.draw === Math.max(...sortedOdds.filter(o => o.draw).map(o => o.draw!)))?.bookmaker || ''
                      )?.name}
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1 truncate">Vittoria {match.awayTeam}</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {Math.max(...sortedOdds.map(o => o.away))}
                  </div>
                  <div className="text-xs text-primary-600 font-medium truncate">
                    {getBookmakerInfo(
                      sortedOdds.find(o => o.away === Math.max(...sortedOdds.map(o => o.away)))?.bookmaker || ''
                    )?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 