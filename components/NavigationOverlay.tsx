'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Home, ExternalLink, X } from 'lucide-react';

interface NavigationOverlayProps {
  bookmakerName: string;
  originalUrl: string;
  onClose: () => void;
}

export default function NavigationOverlay({ bookmakerName, originalUrl, onClose }: NavigationOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleBackToSite = () => {
    window.location.href = originalUrl;
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open(originalUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      onClose();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isMinimized ? 'transform -translate-y-12' : ''
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
              onClick={handleMinimize}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors duration-200"
              title={isMinimized ? "Espandi" : "Minimizza"}
            >
              <div className={`w-4 h-0.5 bg-white transition-transform duration-200 ${
                isMinimized ? 'rotate-0' : 'rotate-0'
              }`}></div>
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
          className="absolute top-full left-4 bg-primary-600 text-white px-4 py-2 rounded-b-lg cursor-pointer hover:bg-primary-700 transition-colors duration-200 shadow-lg"
          onClick={handleMinimize}
        >
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">SitoSport</span>
          </div>
        </div>
      )}

      {/* Bottom Info Bar */}
      {!isMinimized && (
        <div className="bg-black/80 text-white text-xs px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>Scommetti responsabilmente • +18</span>
          </div>
          <button
            onClick={handleBackToSite}
            className="text-blue-300 hover:text-blue-200 underline"
          >
            Torna alle quote
          </button>
        </div>
      )}
    </div>
  );
} 