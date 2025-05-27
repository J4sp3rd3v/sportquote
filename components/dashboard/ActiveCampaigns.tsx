'use client';

import React from 'react';
import { Calendar, Trophy, Users, Clock } from 'lucide-react';
import { Match } from '@/types';

interface ActiveCampaignsProps {
  matches: Match[];
  activeCampaigns: Array<{
    key: string;
    name: string;
    sport: string;
    country: string;
    endDate: Date;
  }>;
}

export default function ActiveCampaigns({
  matches,
  activeCampaigns
}: ActiveCampaignsProps) {
  
  // Raggruppa partite per campionato
  const matchesByLeague = matches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Raggruppa per sport
  const matchesBySport = matches.reduce((acc, match) => {
    if (!acc[match.sport]) {
      acc[match.sport] = [];
    }
    acc[match.sport].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'calcio':
      case 'soccer':
        return '⚽';
      case 'basket':
      case 'basketball':
        return '🏀';
      case 'tennis':
        return '🎾';
      case 'hockey':
        return '🏒';
      case 'football-americano':
      case 'americanfootball':
        return '🏈';
      case 'mma':
        return '🥊';
      default:
        return '🏆';
    }
  };

  const getCountryFlag = (country: string) => {
    switch (country.toLowerCase()) {
      case 'italia':
        return '🇮🇹';
      case 'francia':
        return '🇫🇷';
      case 'spagna':
        return '🇪🇸';
      case 'germania':
        return '🇩🇪';
      case 'inghilterra':
        return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
      case 'europa':
        return '🇪🇺';
      case 'usa':
        return '🇺🇸';
      case 'usa/canada':
        return '🇺🇸🇨🇦';
      case 'mondiale':
        return '🌍';
      default:
        return '🏆';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Calendar className="h-6 w-6 text-green-400 mr-2" />
          Campionati Attivi
        </h2>
        <div className="text-sm text-dark-400">
          {activeCampaigns.length} campionati in corso
        </div>
      </div>

      {/* Panoramica Sport */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(matchesBySport).map(([sport, sportMatches]) => (
          <div key={sport} className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{getSportIcon(sport)}</div>
            <div className="text-lg font-bold text-white">{sportMatches.length}</div>
            <div className="text-xs text-dark-400 capitalize">{sport}</div>
          </div>
        ))}
      </div>

      {/* Lista Campionati Dettagliata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeCampaigns.map((campaign) => {
          const campaignMatches = matchesByLeague[campaign.name] || [];
          const daysUntilEnd = Math.ceil((campaign.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={campaign.key} className="bg-dark-800/50 border border-dark-700 rounded-xl p-6 hover:border-primary-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getSportIcon(campaign.sport)}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{campaign.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-dark-300">
                      <span>{getCountryFlag(campaign.country)}</span>
                      <span>{campaign.country}</span>
                      <span>•</span>
                      <span className="capitalize">{campaign.sport}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-400">
                    {campaignMatches.length}
                  </div>
                  <div className="text-xs text-dark-400">partite</div>
                </div>
              </div>

              {/* Statistiche campionato */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-400">
                    {campaignMatches.reduce((total, match) => total + match.odds.length, 0)}
                  </div>
                  <div className="text-xs text-dark-400">Quote</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-400">
                    {campaignMatches.length > 0 ? 
                      new Set(campaignMatches.flatMap(m => m.odds.map(o => o.bookmaker))).size : 0
                    }
                  </div>
                  <div className="text-xs text-dark-400">Bookmaker</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-yellow-400">
                    {daysUntilEnd > 0 ? daysUntilEnd : 0}
                  </div>
                  <div className="text-xs text-dark-400">Giorni rimasti</div>
                </div>
              </div>

              {/* Barra di progresso stagione */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-dark-400 mb-1">
                  <span>Stagione in corso</span>
                  <span>{campaign.endDate.toLocaleDateString('it-IT')}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(10, Math.min(90, 100 - (daysUntilEnd / 365) * 100))}%` 
                    }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">Attivo</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-dark-400">
                  <Clock className="h-3 w-3" />
                  <span>Aggiornato oggi</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Messaggio se nessun campionato */}
      {activeCampaigns.length === 0 && (
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8 text-center">
          <Trophy className="h-12 w-12 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Nessun Campionato Attivo</h3>
          <p className="text-dark-400">
            I campionati verranno mostrati quando saranno disponibili partite reali.
          </p>
        </div>
      )}
    </div>
  );
} 