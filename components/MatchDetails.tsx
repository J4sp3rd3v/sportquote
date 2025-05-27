'use client';

import React from 'react';
import { X, Star, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Match } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { optimizedBookmakerManager } from '@/lib/optimizedBookmakerManager';
import SmartBookmakerHandler from './SmartBookmakerHandler';
import { useState, useEffect } from 'react';

interface MatchDetailsProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onOpenBookmaker?: (url: string, bookmakerName: string, matchInfo: any) => void;
}

export default function MatchDetails({ match, isOpen, onClose, onOpenBookmaker }: MatchDetailsProps) {
  const [bookmakerStats, setBookmakerStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const stats = optimizedBookmakerManager.getBookmakerStats();
      setBookmakerStats(stats);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calcola le migliori quote
  const bestOdds = {
    home: match.odds.reduce((best, current) => current.home > best.home ? current : best),
    away: match.odds.reduce((best, current) => current.away > best.away ? current : best),
    draw: match.odds.filter(odd => odd.draw).length > 0 
      ? match.odds.filter(odd => odd.draw).reduce((best, current) => 
          (current.draw || 0) > (best.draw || 0) ? current : best
        )
      : undefined
  };

  // Calcola arbitraggio
  const calculateArbitrage = () => {
    if (bestOdds.draw) {
      const totalImplied = (1 / bestOdds.home.home) + (1 / bestOdds.away.away) + (1 / (bestOdds.draw.draw || 1));
      if (totalImplied < 1) {
        const profit = ((1 / totalImplied) - 1) * 100;
        return profit > 0.5 ? profit : null;
      }
    } else {
      const totalImplied = (1 / bestOdds.home.home) + (1 / bestOdds.away.away);
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {match.league} • {format(match.date, 'PPP p', { locale: it })}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Arbitraggio Alert */}
            {arbitrageProfit && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium text-green-800">
                    Opportunità di Arbitraggio: {arbitrageProfit.toFixed(2)}% di profitto garantito!
                  </span>
                </div>
              </div>
            )}

            {/* Migliori Quote */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Migliori Quote</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-800 mb-1">Casa</div>
                  <div className="text-2xl font-bold text-blue-900">{bestOdds.home.home.toFixed(2)}</div>
                  <div className="text-sm text-blue-700">{bestOdds.home.bookmaker}</div>
                </div>
                {bestOdds.draw && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-800 mb-1">Pareggio</div>
                    <div className="text-2xl font-bold text-gray-900">{(bestOdds.draw.draw || 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-700">{bestOdds.draw.bookmaker}</div>
                  </div>
                )}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-red-800 mb-1">Ospite</div>
                  <div className="text-2xl font-bold text-red-900">{bestOdds.away.away.toFixed(2)}</div>
                  <div className="text-sm text-red-700">{bestOdds.away.bookmaker}</div>
                </div>
              </div>
            </div>

            {/* Tutte le Quote */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Tutte le Quote ({match.odds.length} bookmaker)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookmaker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Casa
                      </th>
                      {match.odds.some(odd => odd.draw) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pareggio
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ospite
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {match.odds
                      .sort((a, b) => {
                        // Ordina per categoria: premium > standard > international
                        const aInfo = optimizedBookmakerManager.getBookmakerInfo(a.bookmaker);
                        const bInfo = optimizedBookmakerManager.getBookmakerInfo(b.bookmaker);
                        
                        if (!aInfo.isSupported && !bInfo.isSupported) return 0;
                        if (!aInfo.isSupported) return 1;
                        if (!bInfo.isSupported) return -1;
                        
                        const aPriority = aInfo.config?.priority || 999;
                        const bPriority = bInfo.config?.priority || 999;
                        
                        return aPriority - bPriority;
                      })
                      .map((odd, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                  {odd.bookmaker}
                                  {isBookmakerVerified(odd.bookmaker) && (
                                    <span className="ml-2 text-green-500" title="Verificato">✓</span>
                                  )}
                                </div>
                                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${getCategoryColor(odd.bookmaker)}`}>
                                  {optimizedBookmakerManager.getBookmakerInfo(odd.bookmaker).config?.category || 'unknown'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              odd.home === bestOdds.home.home ? 'text-green-600 bg-green-100 px-2 py-1 rounded' : 'text-gray-900'
                            }`}>
                              {odd.home.toFixed(2)}
                            </span>
                          </td>
                          {match.odds.some(o => o.draw) && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${
                                odd.draw && bestOdds.draw && odd.draw === bestOdds.draw.draw 
                                  ? 'text-green-600 bg-green-100 px-2 py-1 rounded' 
                                  : 'text-gray-900'
                              }`}>
                                {odd.draw ? odd.draw.toFixed(2) : '-'}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              odd.away === bestOdds.away.away ? 'text-green-600 bg-green-100 px-2 py-1 rounded' : 'text-gray-900'
                            }`}>
                              {odd.away.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleBookmakerClick(odd.bookmaker)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Scommetti
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistiche Bookmaker */}
            {bookmakerStats && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Statistiche Bookmaker</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Totale:</span>
                    <div className="font-semibold">{bookmakerStats.total}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Verificati:</span>
                    <div className="font-semibold text-green-600">{bookmakerStats.verified}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Premium:</span>
                    <div className="font-semibold text-purple-600">{bookmakerStats.premium}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Italiani:</span>
                    <div className="font-semibold text-blue-600">{bookmakerStats.italian}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Internazionali:</span>
                    <div className="font-semibold text-green-600">{bookmakerStats.international}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Bookmaker Handler */}
            <SmartBookmakerHandler 
              bookmakerName={bestOdds.home.bookmaker}
              matchInfo={{
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                sport: match.sport,
                league: match.league
              }}
              onBookmakerOpen={onOpenBookmaker}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center"
            >
              Scommetti sul Migliore
            </SmartBookmakerHandler>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 