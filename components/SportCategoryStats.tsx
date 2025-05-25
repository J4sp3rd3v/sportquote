'use client';

import React from 'react';
import { Trophy, Users, Target, TrendingUp } from 'lucide-react';

interface SportCategoryStatsProps {
  stats: {
    calcio: { count: number; leagues: string[] };
    tennis: { count: number; leagues: string[] };
    basket: { count: number; leagues: string[] };
    altro: { count: number; leagues: string[] };
  };
  isRealData: boolean;
}

const SPORT_ICONS = {
  calcio: '⚽',
  tennis: '🎾',
  basket: '🏀',
  altro: '🏆'
};

const SPORT_COLORS = {
  calcio: 'bg-green-100 text-green-800 border-green-200',
  tennis: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  basket: 'bg-orange-100 text-orange-800 border-orange-200',
  altro: 'bg-purple-100 text-purple-800 border-purple-200'
};

export default function SportCategoryStats({ stats, isRealData }: SportCategoryStatsProps) {
  const totalMatches = Object.values(stats).reduce((sum, category) => sum + category.count, 0);
  const totalLeagues = new Set(Object.values(stats).flatMap(category => category.leagues)).size;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary-600" />
          Statistiche per Categoria
          {isRealData && (
            <span className="ml-2 text-sm font-normal text-primary-600">(Dati Reali)</span>
          )}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            <span>{totalMatches} partite</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{totalLeagues} campionati</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([sport, data]) => (
          <div
            key={sport}
            className={`rounded-lg border p-4 ${SPORT_COLORS[sport as keyof typeof SPORT_COLORS]}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{SPORT_ICONS[sport as keyof typeof SPORT_ICONS]}</span>
                <h4 className="font-semibold capitalize">{sport}</h4>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{data.count}</div>
                <div className="text-xs opacity-75">partite</div>
              </div>
            </div>

            {data.leagues.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2 opacity-75">
                  {data.leagues.length} campionati:
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.leagues.slice(0, 3).map((league, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full"
                    >
                      {league.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                  {data.leagues.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
                      +{data.leagues.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {data.count === 0 && (
              <div className="text-xs opacity-75 italic">
                Nessuna partita disponibile
              </div>
            )}
          </div>
        ))}
      </div>

      {isRealData && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Dati in tempo reale:</strong> Le statistiche mostrano eventi live recuperati da The Odds API. 
              I dati vengono aggiornati automaticamente ogni 5 minuti per garantire informazioni sempre attuali.
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 