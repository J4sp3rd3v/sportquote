'use client';

import React from 'react';
import { Search, Filter, BarChart3, Target, Zap, TrendingUp, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onFilterToggle: () => void;
  activeSection: 'overview' | 'analysis' | 'arbitrage' | 'strategies';
  onSectionChange: (section: 'overview' | 'analysis' | 'arbitrage' | 'strategies') => void;
}

export default function DashboardHeader({
  onSearchChange,
  searchQuery,
  onFilterToggle,
  activeSection,
  onSectionChange
}: DashboardHeaderProps) {
  
  const sections = [
    {
      id: 'overview' as const,
      name: 'Dashboard',
      icon: BarChart3,
      description: 'Panoramica generale'
    },
    {
      id: 'analysis' as const,
      name: 'Analisi',
      icon: Target,
      description: 'Strumenti avanzati'
    },
    {
      id: 'arbitrage' as const,
      name: 'Arbitraggio',
      icon: Zap,
      description: 'Opportunità sicure'
    },
    {
      id: 'strategies' as const,
      name: 'Strategie',
      icon: TrendingUp,
      description: 'Guide professionali'
    }
  ];

  return (
    <div className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header principale */}
        <div className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Titolo e badge */}
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium mr-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Sistema Attivo
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
                MonitorQuote Pro
              </h1>
              <p className="text-dark-300 mt-1">
                Piattaforma professionale per analisi quote sportive e arbitraggio automatico
              </p>
            </div>

            {/* Controlli di ricerca */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cerca partite, squadre, campionati..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none w-80"
                />
              </div>
              <button
                onClick={onFilterToggle}
                className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white hover:bg-dark-700 transition-colors flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtri</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="border-t border-dark-700">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-dark-300 hover:text-white hover:border-dark-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.name}</span>
                  <span className="hidden lg:inline text-xs text-dark-500">
                    {section.description}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 