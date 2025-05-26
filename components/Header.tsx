'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, TrendingUp, Activity, Database, RefreshCw } from 'lucide-react';
import { OddsApiService } from '@/lib/oddsApi';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';
import BookmakerDebugPanel from './BookmakerDebugPanel';
import ApiTestPanel from './ApiTestPanel';
import AutoUpdatePanel from './AutoUpdatePanel';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onFilterToggle: () => void;
}

export default function Header({ onSearch, onSearchChange, searchQuery = '', onFilterToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [showAutoUpdatePanel, setShowAutoUpdatePanel] = useState(false);

  // Usa il hook per l'aggiornamento automatico
  const autoUpdate = useAutoUpdate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const getApiStatusColor = () => {
    const percentage = autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getApiStatusBg = () => {
    const percentage = autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100;
    if (percentage < 50) return 'bg-green-100';
    if (percentage < 80) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SitoSport</span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cerca squadre, campionati..."
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      if (onSearchChange) {
                        onSearchChange(e.target.value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* API Counter & Navigation */}
            <div className="flex items-center space-x-4">
              {/* API Counter & Auto Update */}
              <div className={`hidden lg:flex items-center space-x-2 px-3 py-1 rounded-lg ${getApiStatusBg()}`}>
                <Database className={`h-4 w-4 ${getApiStatusColor()}`} />
                <div className="text-sm">
                  <span className={`font-medium ${getApiStatusColor()}`}>
                    {autoUpdate.stats.apiRequestsUsed}/{autoUpdate.stats.maxApiRequests}
                  </span>
                  <span className="text-gray-600 ml-1">API</span>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      (autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100) < 50 ? 'bg-green-500' :
                      (autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100) < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100), 100)}%` }}
                  ></div>
                </div>
                {autoUpdate.isRunning && (
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>{autoUpdate.timeToNextUpdate}</span>
                  </div>
                )}
              </div>

              {/* Navigation Links - Desktop */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Quote Live
                </Link>
                <Link href="/categoria/calcio" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Calcio
                </Link>
                <Link href="/categoria/tennis" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Tennis
                </Link>
                <Link href="/categoria/basket" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Basket
                </Link>
                {/* Debug buttons - solo in development */}
                {(process.env.NODE_ENV === 'development' || 
                  (typeof window !== 'undefined' && window.location.search.includes('debug=true'))) && (
                  <>
                    <button
                      onClick={() => setShowDebugPanel(true)}
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm"
                      title="Debug Bookmaker"
                    >
                      Debug
                    </button>
                    <button
                      onClick={() => setShowApiPanel(true)}
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors text-sm"
                      title="Test API"
                    >
                      API Test
                    </button>
                    <button
                      onClick={() => setShowAutoUpdatePanel(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                      title="Sistema Aggiornamento"
                    >
                      Auto Update
                    </button>
                  </>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cerca squadre, campionati..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (onSearchChange) {
                      onSearchChange(e.target.value);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Mobile API Counter */}
          <div className="md:hidden lg:hidden pb-3">
            <div className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg ${getApiStatusBg()}`}>
              <Database className={`h-4 w-4 ${getApiStatusColor()}`} />
              <div className="text-sm">
                <span className={`font-medium ${getApiStatusColor()}`}>
                  API: {autoUpdate.stats.apiRequestsUsed}/{autoUpdate.stats.maxApiRequests} ({Math.round((autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests) * 100)}%)
                </span>
              </div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100) < 50 ? 'bg-green-500' :
                    (autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100) < 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((autoUpdate.stats.apiRequestsUsed / autoUpdate.stats.maxApiRequests * 100), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Quote Live
              </Link>
              <Link 
                href="/categoria/calcio" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Calcio
              </Link>
              <Link 
                href="/categoria/tennis" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tennis
              </Link>
              <Link 
                href="/categoria/basket" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Basket
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Debug Panel */}
      <BookmakerDebugPanel 
        isOpen={showDebugPanel} 
        onClose={() => setShowDebugPanel(false)} 
      />
      
      {/* API Test Panel */}
      <ApiTestPanel 
        isOpen={showApiPanel} 
        onClose={() => setShowApiPanel(false)} 
      />
      
      {/* RapidAPI Test Panel */}
      <AutoUpdatePanel 
        isOpen={showAutoUpdatePanel} 
        onClose={() => setShowAutoUpdatePanel(false)} 
      />
    </>
  );
} 