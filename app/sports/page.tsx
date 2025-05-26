'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp,
  Star,
  Globe,
  Crown,
  Zap,
  Clock,
  Target
} from 'lucide-react';
import { getSupportedSports, SUPPORTED_SPORTS } from '@/lib/oddsApiService';

interface SportData {
  key: string;
  name: string;
  group: string;
  priority: number;
  description: string;
  icon: string;
  region: string;
  active: boolean;
  has_outrights: boolean;
}

export default function SportsPage() {
  const [sports, setSports] = useState<SportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'group'>('priority');

  useEffect(() => {
    const loadSports = async () => {
      try {
        const data = await getSupportedSports();
        setSports(data);
      } catch (error) {
        console.error('Errore nel caricamento sport:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSports();
  }, []);

  const filteredSports = useMemo(() => {
    let filtered = sports.filter(sport => {
      const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sport.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sport.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGroup = selectedGroup === 'all' || sport.group === selectedGroup;
      const matchesPriority = selectedPriority === 'all' || sport.priority.toString() === selectedPriority;
      const matchesRegion = selectedRegion === 'all' || sport.region === selectedRegion;
      
      return matchesSearch && matchesGroup && matchesPriority && matchesRegion;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          return a.priority - b.priority;
        case 'group':
          return a.group.localeCompare(b.group);
        default:
          return 0;
      }
    });

    return filtered;
  }, [sports, searchTerm, selectedGroup, selectedPriority, selectedRegion, sortBy]);

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return <Crown className="h-4 w-4" />;
      case 2: return <Star className="h-4 w-4" />;
      case 3: return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-accent-500/20 text-accent-400 border-accent-500/30';
      case 2: return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 3: return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      default: return 'bg-dark-600/20 text-dark-300 border-dark-600/30';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Premium';
      case 2: return 'Standard';
      case 3: return 'Basic';
      default: return 'Unknown';
    }
  };

  const getRegionFlag = (region: string) => {
    switch (region) {
      case 'eu': return '🇪🇺';
      case 'uk': return '🇬🇧';
      case 'us': return '🇺🇸';
      case 'au': return '🇦🇺';
      default: return '🌍';
    }
  };

  const groups = ['all', ...Array.from(new Set(sports.map(s => s.group)))];
  const priorities = ['all', '1', '2', '3'];
  const regions = ['all', ...Array.from(new Set(sports.map(s => s.region)))];

  const stats = {
    total: sports.length,
    active: sports.filter(s => s.active).length,
    byGroup: sports.reduce((acc, s) => {
      acc[s.group] = (acc[s.group] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
    byPriority: sports.reduce((acc, s) => {
      acc[s.priority] = (acc[s.priority] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number }),
    byRegion: sports.reduce((acc, s) => {
      acc[s.region] = (acc[s.region] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-dark-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Sport e Campionati Supportati
          </h1>
          <p className="text-xl text-dark-300 mb-6">
            {stats.total} sport disponibili tramite The Odds API con aggiornamenti in tempo reale
          </p>
          
          {/* Statistiche */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-primary-400">{stats.total}</div>
              <div className="text-sm text-dark-400">Sport Totali</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-success-400">{stats.active}</div>
              <div className="text-sm text-dark-400">Attivi</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-accent-400">{stats.byPriority[1] || 0}</div>
              <div className="text-sm text-dark-400">Premium</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-warning-400">{Object.keys(stats.byGroup).length}</div>
              <div className="text-sm text-dark-400">Categorie</div>
            </div>
          </div>
        </div>

        {/* Filtri e Ricerca */}
        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Ricerca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Cerca sport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Gruppo */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tutti i Gruppi</option>
              {groups.filter(g => g !== 'all').map(group => (
                <option key={group} value={group}>
                  {group} ({stats.byGroup[group] || 0})
                </option>
              ))}
            </select>

            {/* Filtro Priorità */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tutte le Priorità</option>
              {priorities.filter(p => p !== 'all').map(priority => (
                <option key={priority} value={priority}>
                  {getPriorityLabel(parseInt(priority))} ({stats.byPriority[parseInt(priority)] || 0})
                </option>
              ))}
            </select>

            {/* Filtro Regione */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tutte le Regioni</option>
              {regions.filter(r => r !== 'all').map(region => (
                <option key={region} value={region}>
                  {getRegionFlag(region)} {region.toUpperCase()} ({stats.byRegion[region] || 0})
                </option>
              ))}
            </select>

            {/* Ordinamento */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'priority' | 'group')}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="priority">Ordina per Priorità</option>
              <option value="name">Ordina per Nome</option>
              <option value="group">Ordina per Gruppo</option>
            </select>
          </div>
        </div>

        {/* Risultati */}
        <div className="mb-6">
          <p className="text-dark-300">
            Mostrando {filteredSports.length} di {sports.length} sport
          </p>
        </div>

        {/* Grid Sport */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSports.map((sport) => (
            <div
              key={sport.key}
              className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{sport.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-50 group-hover:text-primary-400 transition-colors">
                      {sport.name}
                    </h3>
                    <p className="text-sm text-dark-400">{sport.group}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sport.active && (
                    <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                  )}
                  <span className="text-xs text-dark-500">
                    {getRegionFlag(sport.region)}
                  </span>
                </div>
              </div>

              {/* Descrizione */}
              <p className="text-dark-300 mb-4 text-sm">
                {sport.description}
              </p>

              {/* Badge e Info */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(sport.priority)}`}>
                  {getPriorityIcon(sport.priority)}
                  {getPriorityLabel(sport.priority)}
                </span>
                <span className="text-xs text-dark-500">
                  Regione: {sport.region.toUpperCase()}
                </span>
              </div>

              {/* API Key */}
              <div className="bg-dark-700 rounded px-3 py-2 mb-4">
                <div className="text-xs text-dark-500 mb-1">API Key:</div>
                <div className="text-sm font-mono text-dark-300 truncate">
                  {sport.key}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-dark-500" />
                  <span className="text-xs text-dark-500">
                    {sport.priority === 1 ? 'Aggiornamenti frequenti' : 
                     sport.priority === 2 ? 'Aggiornamenti regolari' : 
                     'Aggiornamenti limitati'}
                  </span>
                </div>
                {sport.has_outrights && (
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-accent-400" />
                    <span className="text-xs text-accent-400">Outrights</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nessun risultato */}
        {filteredSports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-dark-300 mb-2">
              Nessuno sport trovato
            </h3>
            <p className="text-dark-400">
              Prova a modificare i filtri di ricerca
            </p>
          </div>
        )}

        {/* Info Versione Free */}
        <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-dark-200 mb-2">
              📊 Informazioni Piano Free
            </h3>
            <p className="text-dark-400 mb-4">
              Con il piano gratuito hai accesso a 500 richieste mensili con aggiornamenti ogni ora.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-accent-400 font-semibold mb-1">⭐ Sport Premium</div>
                <div className="text-dark-400">Priorità massima per versione free</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-primary-400 font-semibold mb-1">🔄 Aggiornamenti</div>
                <div className="text-dark-400">Ogni ora per mantenere i limiti</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-success-400 font-semibold mb-1">🌍 Copertura Globale</div>
                <div className="text-dark-400">Sport da tutte le regioni del mondo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 