'use client';

import React from 'react';
import { Database, FileText, ToggleLeft, ToggleRight } from 'lucide-react';

interface DataSourceToggleProps {
  useRealData: boolean;
  onToggle: () => void;
  loading?: boolean;
  className?: string;
}

export default function DataSourceToggle({ 
  useRealData, 
  onToggle, 
  loading = false,
  className = '' 
}: DataSourceToggleProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <FileText className={`h-4 w-4 ${!useRealData ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${!useRealData ? 'text-blue-600' : 'text-gray-500'}`}>
          Dati Mock
        </span>
      </div>
      
      <button
        onClick={onToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
          useRealData ? 'bg-green-600' : 'bg-gray-200'
        }`}
        title={useRealData ? 'Passa ai dati mock' : 'Passa ai dati reali API'}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            useRealData ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <div className="flex items-center space-x-2">
        <Database className={`h-4 w-4 ${useRealData ? 'text-green-600' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${useRealData ? 'text-green-600' : 'text-gray-500'}`}>
          API Reale
        </span>
      </div>
      
      {loading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Caricando...</span>
        </div>
      )}
    </div>
  );
} 