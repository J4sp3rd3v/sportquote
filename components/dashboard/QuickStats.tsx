'use client';

import React from 'react';
import { Trophy, Target, Zap, BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface QuickStatsProps {
  totalMatches: number;
  activeCampaigns: number;
  arbitrageOpportunities: number;
  valueOpportunities: number;
}

export default function QuickStats({
  totalMatches,
  activeCampaigns,
  arbitrageOpportunities,
  valueOpportunities
}: QuickStatsProps) {
  
  const stats = [
    {
      label: 'Partite Oggi',
      value: totalMatches,
      icon: Trophy,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Campionati Attivi',
      value: activeCampaigns,
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Arbitraggi',
      value: arbitrageOpportunities,
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      label: 'Value Bets',
      value: valueOpportunities,
      icon: Target,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    }
  ];

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-5 w-5 text-primary-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Statistiche Rapide</h3>
      </div>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-dark-800/50`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-sm text-dark-300">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
                
                {/* Indicatore di trend */}
                <div className="text-right">
                  {stat.value > 0 ? (
                    <div className="flex items-center text-green-400 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Attivo
                    </div>
                  ) : (
                    <div className="text-dark-500 text-xs">
                      In attesa
                    </div>
                  )}
                </div>
              </div>
              
              {/* Barra di progresso per le opportunità */}
              {(stat.label === 'Arbitraggi' || stat.label === 'Value Bets') && (
                <div className="mt-3">
                  <div className="w-full bg-dark-700 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${
                        stat.value > 0 ? stat.color.replace('text-', 'bg-') : 'bg-dark-600'
                      }`}
                      style={{ 
                        width: `${Math.min((stat.value / 10) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-dark-400 mt-1">
                    {stat.value > 0 ? 'Opportunità disponibili' : 'Nessuna opportunità'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Riassunto generale */}
      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="text-center">
          <div className="text-sm text-dark-400 mb-1">Efficienza Sistema</div>
          <div className="text-lg font-bold text-primary-400">
            {totalMatches > 0 ? (
              `${Math.round(((arbitrageOpportunities + valueOpportunities) / totalMatches) * 100)}%`
            ) : (
              '0%'
            )}
          </div>
          <div className="text-xs text-dark-500">
            Opportunità su partite totali
          </div>
        </div>
      </div>
    </div>
  );
} 