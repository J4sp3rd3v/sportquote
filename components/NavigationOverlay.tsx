'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Home, ExternalLink, X, ChevronUp, ChevronDown } from 'lucide-react';

interface NavigationOverlayProps {
  bookmakerName: string;
  originalUrl: string;
  onClose: () => void;
}

export default function NavigationOverlay({ bookmakerName, originalUrl, onClose }: NavigationOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAutoHidden, setIsAutoHidden] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  // Auto-hide dopo 10 secondi, ma solo se non è minimizzato
  useEffect(() => {
    if (!isMinimized) {
      const autoHideTimer = setTimeout(() => {
        setIsAutoHidden(true);
      }, 10000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [isMinimized]);

  // Rileva se siamo su mobile per posizionamento migliore
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setPosition('bottom');
    }
  }, []);

  const handleBackToSite = () => {
    // Prova prima con history.back() se possibile
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = originalUrl;
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open(originalUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      onClose();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsAutoHidden(false); // Reset auto-hide quando l'utente interagisce
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const togglePosition = () => {
    setPosition(position === 'top' ? 'bottom' : 'top');
  };

  const showBar = () => {
    setIsAutoHidden(false);
    setIsMinimized(false);
  };

  if (!isVisible) return null;

  // Se è auto-nascosto, mostra solo un piccolo indicatore
  if (isAutoHidden) {
    return (
      <div 
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-1/2 transform -translate-x-1/2 z-50`}
      >
        <div 
          className={`bg-primary-600 text-white px-4 py-2 rounded-${position === 'top' ? 'b' : 't'}-lg cursor-pointer hover:bg-primary-700 transition-all duration-200 shadow-lg flex items-center space-x-2`}
          onClick={showBar}
        >
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">Torna a SitoSport</span>
          {position === 'top' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 transition-all duration-300 ${
      isMinimized ? `transform ${position === 'top' ? '-translate-y-12' : 'translate-y-12'}` : ''
    }`}>
      {/* Main Navigation Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{bookmakerName.charAt(0)}</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Stai navigando su {bookmakerName}</div>
                <div className="text-xs text-blue-100">tramite SitoSport</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBackToSite}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors duration-200"
              title="Torna a SitoSport"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Torna a SitoSport</span>
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-2 rounded transition-colors duration-200"
              title="Apri SitoSport in nuova scheda"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Nuova scheda</span>
            </button>

            <button
              onClick={togglePosition}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors duration-200"
              title={`Sposta ${position === 'top' ? 'in basso' : 'in alto'}`}
            >
              {position === 'top' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>

            <button
              onClick={handleMinimize}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors duration-200"
              title={isMinimized ? "Espandi" : "Minimizza"}
            >
              <div className={`w-4 h-0.5 bg-white transition-transform duration-200`}></div>
            </button>

            <button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors duration-200"
              title="Chiudi barra"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Minimized Tab */}
      {isMinimized && (
        <div 
          className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} left-4 bg-primary-600 text-white px-4 py-2 rounded-${position === 'top' ? 'b' : 't'}-lg cursor-pointer hover:bg-primary-700 transition-colors duration-200 shadow-lg`}
          onClick={handleMinimize}
        >
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">SitoSport</span>
          </div>
        </div>
      )}

      {/* Bottom/Top Info Bar */}
      {!isMinimized && (
        <div className="bg-black/80 text-white text-xs px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>Scommetti responsabilmente • +18</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 hidden sm:inline">Barra si nasconderà automaticamente</span>
            <button
              onClick={handleBackToSite}
              className="text-blue-300 hover:text-blue-200 underline"
            >
              Torna alle quote
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 