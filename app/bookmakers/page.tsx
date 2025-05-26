'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Star, 
  Shield, 
  Zap, 
  Globe, 
  Filter,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin,
  Award
} from 'lucide-react';
import { getSupportedBookmakers, VERIFIED_BOOKMAKERS } from '@/lib/oddsApiService';
import { Bookmaker } from '@/types';

export default function BookmakersPage() {
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'country'>('category');

  useEffect(() => {
    const loadBookmakers = async () => {
      try {
        const data = await getSupportedBookmakers();
        setBookmakers(data);
      } catch (error) {
        console.error('Errore nel caricamento bookmaker:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmakers();
  }, []);

  const filteredBookmakers = useMemo(() => {
    let filtered = bookmakers.filter(bookmaker => {
      const matchesSearch = bookmaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookmaker.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || bookmaker.category === selectedCategory;
      const matchesRegion = selectedRegion === 'all' || bookmaker.region === selectedRegion;
      
      return matchesSearch && matchesCategory && matchesRegion;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'country':
          return a.country.localeCompare(b.country);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookmakers, searchTerm, selectedCategory, selectedRegion, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'italian': return <Shield className="h-4 w-4" />;
      case 'international': return <Globe className="h-4 w-4" />;
      case 'specialized': return <Zap className="h-4 w-4" />;
      case 'uk': return <Award className="h-4 w-4" />;
      case 'us': return <Star className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'italian': return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'international': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'specialized': return 'bg-accent-500/20 text-accent-400 border-accent-500/30';
      case 'uk': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'us': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-dark-600/20 text-dark-300 border-dark-600/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'italian': return 'Italiani';
      case 'international': return 'Internazionali';
      case 'specialized': return 'Specializzati';
      case 'uk': return 'Regno Unito';
      case 'us': return 'Stati Uniti';
      default: return category;
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

  const handleBookmakerClick = (bookmaker: Bookmaker) => {
    console.log(`Aprendo ${bookmaker.name}:`, bookmaker.url);
    window.open(bookmaker.url, '_blank', 'noopener,noreferrer');
  };

  const categories = ['all', ...Array.from(new Set(bookmakers.map(b => b.category)))];
  const regions = ['all', ...Array.from(new Set(bookmakers.map(b => b.region)))];

  const stats = {
    total: bookmakers.length,
    verified: bookmakers.filter(b => b.verified).length,
    byCategory: bookmakers.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
    byRegion: bookmakers.reduce((acc, b) => {
      acc[b.region] = (acc[b.region] || 0) + 1;
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
            Bookmaker Supportati
          </h1>
          <p className="text-xl text-dark-300 mb-6">
            {stats.total} bookmaker verificati con URL homepage diretti
          </p>
          
          {/* Statistiche */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-primary-400">{stats.total}</div>
              <div className="text-sm text-dark-400">Totali</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-success-400">{stats.verified}</div>
              <div className="text-sm text-dark-400">Verificati</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-accent-400">{Object.keys(stats.byCategory).length}</div>
              <div className="text-sm text-dark-400">Categorie</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-2xl font-bold text-warning-400">{Object.keys(stats.byRegion).length}</div>
              <div className="text-sm text-dark-400">Regioni</div>
            </div>
          </div>
        </div>

        {/* Filtri e Ricerca */}
        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ricerca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Cerca bookmaker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Categoria */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tutte le Categorie</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)} ({stats.byCategory[category] || 0})
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
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'country')}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="category">Ordina per Categoria</option>
              <option value="name">Ordina per Nome</option>
              <option value="country">Ordina per Paese</option>
            </select>
          </div>
        </div>

        {/* Risultati */}
        <div className="mb-6">
          <p className="text-dark-300">
            Mostrando {filteredBookmakers.length} di {bookmakers.length} bookmaker
          </p>
        </div>

        {/* Grid Bookmaker */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmakers.map((bookmaker) => (
            <div
              key={bookmaker.id}
              className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 group cursor-pointer"
              onClick={() => handleBookmakerClick(bookmaker)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors">
                    {bookmaker.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-dark-400">{getRegionFlag(bookmaker.region)} {bookmaker.country}</span>
                    {bookmaker.verified && (
                      <CheckCircle className="h-4 w-4 text-success-400" />
                    )}
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-dark-400 group-hover:text-primary-400 transition-colors" />
              </div>

              {/* Categoria */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(bookmaker.category)}`}>
                  {getCategoryIcon(bookmaker.category)}
                  {getCategoryLabel(bookmaker.category)}
                </span>
              </div>

              {/* URL */}
              <div className="text-sm text-dark-400 mb-4 font-mono bg-dark-700 rounded px-3 py-2 truncate">
                {bookmaker.url}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <span className="text-xs text-dark-500">
                  Regione: {bookmaker.region.toUpperCase()}
                </span>
                <span className="text-xs text-success-400 font-medium">
                  ✓ Verificato
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Nessun risultato */}
        {filteredBookmakers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-dark-300 mb-2">
              Nessun bookmaker trovato
            </h3>
            <p className="text-dark-400">
              Prova a modificare i filtri di ricerca
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-dark-200 mb-2">
              📋 Informazioni sui Bookmaker
            </h3>
            <p className="text-dark-400 mb-4">
              Tutti i bookmaker elencati sono verificati e utilizzano URL homepage diretti senza parametri di tracking.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-success-400 font-semibold mb-1">✓ URL Verificati</div>
                <div className="text-dark-400">Tutti i link sono testati e funzionanti</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-primary-400 font-semibold mb-1">🏠 Homepage Diretti</div>
                <div className="text-dark-400">Accesso diretto alla homepage del bookmaker</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-accent-400 font-semibold mb-1">🔒 Sicurezza</div>
                <div className="text-dark-400">Apertura in nuova scheda sicura</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 