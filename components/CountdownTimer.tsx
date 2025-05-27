'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  className?: string;
}

export default function CountdownTimer({ className = '' }: CountdownTimerProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="h-4 w-4 text-primary-600" />
      <span className="text-sm text-gray-600">
        Sistema aggiornamento attivo
      </span>
    </div>
  );
} 