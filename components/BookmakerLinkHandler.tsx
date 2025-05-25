'use client';

import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, ArrowRight } from 'lucide-react';

interface BookmakerLinkHandlerProps {
  bookmakerName: string;
  bookmakerUrl: string;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    sport: string;
  };
  children: React.ReactNode;
  className?: string;
}

export default function BookmakerLinkHandler({ 
  bookmakerName, 
  bookmakerUrl, 
  matchInfo, 
  children, 
  className = '' 
}: BookmakerLinkHandlerProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const saveNavigationData = () => {
    try {
      sessionStorage.setItem('sitosport_navigation', JSON.stringify({
        bookmakerName: bookmakerName,
        originalUrl: window.location.href, // URL completo della pagina corrente
        timestamp: Date.now(),
        matchInfo: matchInfo
      }));
    } catch (error) {
      console.warn('Impossibile salvare i dati di navigazione:', error);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`Tentativo di apertura ${bookmakerName}:`, bookmakerUrl);

    // Strategia 1: Prova ad aprire in nuova finestra
    try {
      const newWindow = window.open(bookmakerUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        console.log(`${bookmakerName} aperto in nuova finestra con successo`);
        return;
      }
    } catch (error) {
      console.warn('Apertura nuova finestra fallita:', error);
    }

    // Strategia 2: Se il popup è bloccato, mostra dialog di conferma
    setShowConfirmDialog(true);
  };

  const handleConfirmRedirect = () => {
    saveNavigationData();
    
    // Strategia 3: Redirect diretto con dati salvati per la barra di navigazione
    console.log(`Reindirizzamento a ${bookmakerName} con barra di navigazione`);
    window.location.href = bookmakerUrl;
  };

  const handleCancelRedirect = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className={`cursor-pointer ${className}`}
        title={`Apri ${bookmakerName}${matchInfo ? ` per ${matchInfo.homeTeam} vs ${matchInfo.awayTeam}` : ''}`}
      >
        {children}
      </div>

      {/* Dialog di conferma per redirect */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCancelRedirect}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExternalLink className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Apertura {bookmakerName}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Il popup è stato bloccato dal browser. Vuoi essere reindirizzato a {bookmakerName}?
                      </p>
                      {matchInfo && (
                        <p className="text-sm text-blue-600 mt-2 font-medium">
                          Partita: {matchInfo.homeTeam} vs {matchInfo.awayTeam}
                        </p>
                      )}
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <ArrowRight className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              <strong>Verrà mostrata una barra di navigazione</strong> per tornare facilmente a SitoSport
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmRedirect}
                >
                  Vai a {bookmakerName}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelRedirect}
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 