'use client';

import React from 'react';
import { X, Star, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Match, Bookmaker } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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

  const sortedOdds = match.odds.sort((a, b) => {
    const bookmakerA = getBookmakerInfo(a.bookmaker);
    const bookmakerB = getBookmakerInfo(b.bookmaker);
    return (bookmakerB?.rating || 0) - (bookmakerA?.rating || 0);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-xl shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {match.homeTeam} vs {match.awayTeam}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(match.date)}
                </span>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                  {match.league}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {match.sport}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                Confronto Quote ({sortedOdds.length} bookmakers)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Bookmaker</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">1</th>
                      {match.odds[0]?.draw && (
                        <th className="text-center py-3 px-4 font-medium text-gray-700">X</th>
                      )}
                      <th className="text-center py-3 px-4 font-medium text-gray-700">2</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Bonus</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Azione</th>
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
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">
                                  {bookmaker?.name.charAt(0) || odds.bookmaker.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {bookmaker?.name || `Bookmaker ${odds.bookmaker}`}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                  {bookmaker?.rating || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block px-2 py-1 rounded font-medium ${
                              isHighestHome 
                                ? 'bg-success-100 text-success-800 ring-2 ring-success-200' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {odds.home}
                            </span>
                          </td>
                          {match.odds[0]?.draw && (
                            <td className="py-4 px-4 text-center">
                              {odds.draw ? (
                                <span className={`inline-block px-2 py-1 rounded font-medium ${
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
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block px-2 py-1 rounded font-medium ${
                              isHighestAway 
                                ? 'bg-success-100 text-success-800 ring-2 ring-success-200' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {odds.away}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-xs text-primary-600 font-medium">
                              {bookmaker?.bonus || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors duration-200">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Vai al sito
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Odds Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Riassunto Migliori Quote
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">Vittoria {match.homeTeam}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.max(...sortedOdds.map(o => o.home))}
                  </div>
                  <div className="text-xs text-primary-600 font-medium">
                    {getBookmakerInfo(
                      sortedOdds.find(o => o.home === Math.max(...sortedOdds.map(o => o.home)))?.bookmaker || ''
                    )?.name}
                  </div>
                </div>
                
                {match.odds[0]?.draw && (
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1">Pareggio</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.max(...sortedOdds.filter(o => o.draw).map(o => o.draw!))}
                    </div>
                    <div className="text-xs text-primary-600 font-medium">
                      {getBookmakerInfo(
                        sortedOdds.find(o => o.draw === Math.max(...sortedOdds.filter(o => o.draw).map(o => o.draw!)))?.bookmaker || ''
                      )?.name}
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">Vittoria {match.awayTeam}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.max(...sortedOdds.map(o => o.away))}
                  </div>
                  <div className="text-xs text-primary-600 font-medium">
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