'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Monitor, ExternalLink, Smartphone, X } from 'lucide-react';

interface NavigationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationPreferences {
  preferredMethod: 'iframe' | 'redirect' | 'auto';
  autoHideDelay: number; // in secondi
  showOnMobile: boolean;
  position: 'top' | 'bottom';
  persistAcrossSessions: boolean;
}

const defaultPreferences: NavigationPreferences = {
  preferredMethod: 'auto',
  autoHideDelay: 10,
  showOnMobile: true,
  position: 'top',
  persistAcrossSessions: true
};

export default function NavigationSettings({ isOpen, onClose }: NavigationSettingsProps) {
  const [preferences, setPreferences] = useState<NavigationPreferences>(defaultPreferences);

  useEffect(() => {
    // Carica le preferenze salvate
    try {
      const saved = localStorage.getItem('sitosport_navigation_preferences');
      if (saved) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.warn('Errore nel caricamento delle preferenze:', error);
    }
  }, []);

  const savePreferences = (newPreferences: NavigationPreferences) => {
    setPreferences(newPreferences);
    try {
      localStorage.setItem('sitosport_navigation_preferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.warn('Errore nel salvataggio delle preferenze:', error);
    }
  };

  const handlePreferenceChange = (key: keyof NavigationPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  const resetToDefaults = () => {
    savePreferences(defaultPreferences);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Settings className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Impostazioni Navigazione
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Metodo Preferito */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metodo di apertura bookmaker
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredMethod"
                      value="auto"
                      checked={preferences.preferredMethod === 'auto'}
                      onChange={(e) => handlePreferenceChange('preferredMethod', e.target.value)}
                      className="mr-2"
                    />
                    <Monitor className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Automatico (consigliato)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredMethod"
                      value="iframe"
                      checked={preferences.preferredMethod === 'iframe'}
                      onChange={(e) => handlePreferenceChange('preferredMethod', e.target.value)}
                      className="mr-2"
                    />
                    <Monitor className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Sempre in iframe</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredMethod"
                      value="redirect"
                      checked={preferences.preferredMethod === 'redirect'}
                      onChange={(e) => handlePreferenceChange('preferredMethod', e.target.value)}
                      className="mr-2"
                    />
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Sempre con barra di navigazione</span>
                  </label>
                </div>
              </div>

              {/* Auto-hide Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nascondi automaticamente dopo (secondi)
                </label>
                <select
                  value={preferences.autoHideDelay}
                  onChange={(e) => handlePreferenceChange('autoHideDelay', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={5}>5 secondi</option>
                  <option value={10}>10 secondi</option>
                  <option value={15}>15 secondi</option>
                  <option value={30}>30 secondi</option>
                  <option value={0}>Mai</option>
                </select>
              </div>

              {/* Posizione */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posizione barra di navigazione
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="position"
                      value="top"
                      checked={preferences.position === 'top'}
                      onChange={(e) => handlePreferenceChange('position', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">In alto</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="position"
                      value="bottom"
                      checked={preferences.position === 'bottom'}
                      onChange={(e) => handlePreferenceChange('position', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">In basso</span>
                  </label>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Mostra su mobile</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.showOnMobile}
                  onChange={(e) => handlePreferenceChange('showOnMobile', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              {/* Persistenza */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Mantieni tra le sessioni</span>
                  <p className="text-xs text-gray-500">La barra rimarrà attiva anche dopo aver chiuso il browser</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.persistAcrossSessions}
                  onChange={(e) => handlePreferenceChange('persistAcrossSessions', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Salva
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={resetToDefaults}
            >
              Ripristina
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook per utilizzare le preferenze
export function useNavigationPreferences(): NavigationPreferences {
  const [preferences, setPreferences] = useState<NavigationPreferences>(defaultPreferences);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sitosport_navigation_preferences');
      if (saved) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.warn('Errore nel caricamento delle preferenze:', error);
    }
  }, []);

  return preferences;
} 