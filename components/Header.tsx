'use client';

import React, { useState } from 'react';
import { Search, Menu, X, TrendingUp, Star, Filter, Bug, Database } from 'lucide-react';
import BookmakerDebugPanel from './BookmakerDebugPanel';
import ApiTestPanel from './ApiTestPanel';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
}

export default function Header({ onSearchChange, onFilterToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  // const [showTestPanel, setShowTestPanel] = useState(false); // Rimosso
  const [showApiPanel, setShowApiPanel] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  // Mostra il debug solo in development o se è presente un parametro URL specifico
  const showDebugButton = process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && window.location.search.includes('debug=true'));

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <TrendingUp className="h-8 w-8 text-primary-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-primary-600">Sito</span>Sport
                </h1>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Cerca squadre, campionati o bookmakers..."
                />
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Quote Live
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Confronti
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Bookmakers
              </a>
              <button
                onClick={onFilterToggle}
                className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtri
              </button>
              {showDebugButton && (
                <>
                  <button
                    onClick={() => setShowDebugPanel(true)}
                    className="flex items-center text-orange-600 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    title="Debug Bookmaker"
                  >
                    <Bug className="h-4 w-4 mr-1" />
                    Debug
                  </button>
                  {/* Test button rimosso - ora disponibile nella homepage */}
                  <button
                    onClick={() => setShowApiPanel(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    title="Test API Reale"
                  >
                    <Database className="h-4 w-4 mr-1" />
                    API
                  </button>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                placeholder="Cerca squadre, campionati..."
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
                Quote Live
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
                Confronti
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
                Bookmakers
              </a>
              <button
                onClick={onFilterToggle}
                className="flex items-center text-gray-700 hover:text-primary-600 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtri
              </button>
              {showDebugButton && (
                <>
                  <button
                    onClick={() => setShowDebugPanel(true)}
                    className="flex items-center text-orange-600 hover:text-orange-700 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Debug Bookmaker
                  </button>
                  {/* Test button mobile rimosso - ora disponibile nella homepage */}
                  <button
                    onClick={() => setShowApiPanel(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Test API Reale
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Debug Panel */}
      <BookmakerDebugPanel 
        isOpen={showDebugPanel} 
        onClose={() => setShowDebugPanel(false)} 
      />
      
      {/* Test Panel rimosso - ora disponibile nella homepage */}
      
      {/* API Test Panel */}
      <ApiTestPanel 
        isOpen={showApiPanel} 
        onClose={() => setShowApiPanel(false)} 
      />
    </>
  );
} 