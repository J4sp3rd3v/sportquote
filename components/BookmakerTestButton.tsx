'use client';

import React from 'react';
import SmartBookmakerHandler from './SmartBookmakerHandler';
import { ExternalLink } from 'lucide-react';

interface BookmakerTestButtonProps {
  bookmakerName: string;
}

export default function BookmakerTestButton({ bookmakerName }: BookmakerTestButtonProps) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Test: {bookmakerName}</h3>
      
      <SmartBookmakerHandler
        bookmakerName={bookmakerName}
        matchInfo={{
          homeTeam: "Juventus",
          awayTeam: "Inter",
          sport: "calcio"
        }}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Apri {bookmakerName}
      </SmartBookmakerHandler>
      
      <div className="mt-2 text-xs text-gray-500">
        Click per testare l'apertura del bookmaker
      </div>
    </div>
  );
} 