'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ExternalLink, AlertTriangle, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookmakerFrameProps {
  url: string;
  bookmakerName: string;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    sport: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function BookmakerFrame({ 
  url, 
  bookmakerName, 
  matchInfo, 
  isOpen, 
  onClose 
}: BookmakerFrameProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      setCurrentUrl(url);
      
      // Timeout per gestire siti che non si caricano
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setHasError(true);
        }
      }, 15000); // 15 secondi timeout
      
      return () => clearTimeout(timeout);
    }
  }, [url, isOpen, isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openInNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const goToHomepage = () => {
    router.push('/');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Torna a SitoSport</span>
              <span className="sm:hidden">Indietro</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{bookmakerName.charAt(0)}</span>
              </div>
              <div>
                <div className="font-semibold text-sm">{bookmakerName}</div>
                {matchInfo && (
                  <div className="text-xs text-blue-100">
                    {matchInfo.homeTeam} vs {matchInfo.awayTeam}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToHomepage}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors duration-200"
              title="Vai alla homepage"
            >
              <Home className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Home</span>
            </button>
            
            <button
              onClick={openInNewTab}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors duration-200"
              title="Apri in nuova scheda"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Nuova scheda</span>
            </button>
            
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors duration-200"
              title="Chiudi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative h-[calc(100vh-64px)]">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento {bookmakerName}...</p>
              {matchInfo && (
                <p className="text-sm text-gray-500 mt-2">
                  Ricerca: {matchInfo.homeTeam} vs {matchInfo.awayTeam}
                </p>
              )}
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className="text-center max-w-md mx-auto p-6">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Impossibile caricare {bookmakerName}
              </h3>
              <p className="text-gray-600 mb-6">
                Il sito potrebbe non consentire la visualizzazione in iframe per motivi di sicurezza.
              </p>
              <div className="space-y-3">
                <button
                  onClick={openInNewTab}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Apri in nuova scheda</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full btn-secondary"
                >
                  Torna a SitoSport
                </button>
              </div>
            </div>
          </div>
        )}

        <iframe
          src={currentUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${bookmakerName} - ${matchInfo ? `${matchInfo.homeTeam} vs ${matchInfo.awayTeam}` : 'Scommesse'}`}
        />
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>🔒</span>
          <span>Stai navigando su {bookmakerName} tramite SitoSport</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Scommetti responsabilmente</span>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-blue-200 underline"
          >
            Torna alle quote
          </button>
        </div>
      </div>
    </div>
  );
} 