'use client';

import React from 'react';
import { X, Calendar, Trophy, Globe } from 'lucide-react';
import { FilterOptions } from '@/types';
import { sports, leagues } from '@/data/mockData';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange }: FilterPanelProps) {
  if (!isOpen) return null;

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filtri di Ricerca</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Sport Filter */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Trophy className="h-4 w-4 mr-2" />
                Sport
              </label>
              <select
                value={filters.sport || ''}
                onChange={(e) => handleFilterChange('sport', e.target.value || undefined)}
                className="input-field"
              >
                <option value="">Tutti gli sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.icon} {sport.name}
                  </option>
                ))}
              </select>
            </div>

            {/* League Filter */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Globe className="h-4 w-4 mr-2" />
                Campionato
              </label>
              <select
                value={filters.league || ''}
                onChange={(e) => handleFilterChange('league', e.target.value || undefined)}
                className="input-field"
              >
                <option value="">Tutti i campionati</option>
                {leagues
                  .filter(league => !filters.sport || league.sport === filters.sport)
                  .map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name} ({league.country})
                    </option>
                  ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                Data
              </label>
              <select
                value={filters.date || ''}
                onChange={(e) => handleFilterChange('date', e.target.value || undefined)}
                className="input-field"
              >
                <option value="">Tutte le date</option>
                <option value="today">Oggi</option>
                <option value="tomorrow">Domani</option>
                <option value="week">Questa settimana</option>
                <option value="month">Questo mese</option>
              </select>
            </div>

            {/* Odds Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Range Quote
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={filters.minOdds || ''}
                    onChange={(e) => handleFilterChange('minOdds', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="input-field"
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={filters.maxOdds || ''}
                    onChange={(e) => handleFilterChange('maxOdds', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="input-field"
                    placeholder="10.0"
                  />
                </div>
              </div>
            </div>

            {/* Popular Filters */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Filtri Rapidi
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange('sport', 'calcio')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  ⚽ Solo Calcio
                </button>
                <button
                  onClick={() => handleFilterChange('date', 'today')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  📅 Partite di Oggi
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('sport', 'calcio');
                    handleFilterChange('league', 'serie-a');
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  🇮🇹 Serie A
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={clearFilters}
              className="w-full btn-secondary"
            >
              Cancella Filtri
            </button>
            <button
              onClick={onClose}
              className="w-full btn-primary"
            >
              Applica Filtri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 