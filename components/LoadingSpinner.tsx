'use client';

import React from 'react';
import { RefreshCw, TrendingUp, Database } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  isApiLoading?: boolean;
  showProgress?: boolean;
}

export default function LoadingSpinner({ 
  message = 'Caricamento...', 
  isApiLoading = false,
  showProgress = false 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Spinner principale */}
      <div className="relative">
        {isApiLoading ? (
          <div className="relative">
            <Database className="h-12 w-12 text-blue-500 animate-pulse" />
            <div className="absolute -top-1 -right-1">
              <RefreshCw className="h-6 w-6 text-green-500 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        )}
      </div>

      {/* Messaggio */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isApiLoading ? '🔄 Caricamento Quote Live' : message}
        </h3>
        
        {isApiLoading && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Recuperando le quote più aggiornate dai bookmaker...
            </p>
            
            {showProgress && (
              <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Serie A</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Premier League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Champions League</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggerimento */}
      {isApiLoading && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
                              <p className="font-medium">Quote aggiornate</p>
              <p>Le quote vengono aggiornate direttamente dai bookmaker per garantire la massima precisione.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 