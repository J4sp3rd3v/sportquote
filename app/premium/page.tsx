'use client';

import React from 'react';
import SubscriptionManager from '@/components/SubscriptionManager';
import CountdownTimer from '@/components/CountdownTimer';
import { 
  Crown, 
  Zap, 
  Shield, 
  Check, 
  Star,
  TrendingUp,
  Clock,
  BarChart3,
  Smartphone,
  Globe,
  RefreshCw
} from 'lucide-react';

const features = [
  {
    icon: RefreshCw,
    title: 'Aggiornamenti in Tempo Reale',
    description: 'Quote aggiornate ogni 30 secondi per i piani premium',
    plans: ['pro', 'premium']
  },
  {
    icon: BarChart3,
    title: 'Statistiche Avanzate',
    description: 'Analisi dettagliate delle quote e trend di mercato',
    plans: ['premium']
  },
  {
    icon: Smartphone,
    title: 'App Mobile Dedicata',
    description: 'Accesso completo da dispositivi mobili',
    plans: ['pro', 'premium']
  },
  {
    icon: Globe,
    title: 'Tutti i Mercati Internazionali',
    description: 'Accesso a tutti gli sport e campionati mondiali',
    plans: ['premium']
  },
  {
    icon: Shield,
    title: 'Supporto Prioritario',
    description: 'Assistenza dedicata 24/7 via chat e email',
    plans: ['pro', 'premium']
  },
  {
    icon: TrendingUp,
    title: 'API Illimitata',
    description: 'Nessun limite alle richieste API mensili',
    plans: ['premium']
  }
];

const testimonials = [
  {
    name: 'Marco R.',
    role: 'Trader Sportivo',
    content: 'Con SitoSport Premium ho aumentato i miei profitti del 40%. Le quote in tempo reale sono fondamentali.',
    rating: 5
  },
  {
    name: 'Giulia S.',
    role: 'Analista Scommesse',
    content: 'La piattaforma più completa che abbia mai usato. Le statistiche avanzate sono incredibili.',
    rating: 5
  },
  {
    name: 'Alessandro T.',
    role: 'Scommettitore Professionista',
    content: 'Finalmente una piattaforma che capisce le esigenze dei professionisti. Consigliatissima!',
    rating: 5
  }
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-accent-500/20 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="h-4 w-4 mr-2" />
            Piani Premium
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
            Sblocca il Potenziale Completo
          </h1>
          
          <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
            Accedi a quote in tempo reale, statistiche avanzate e tutti i mercati internazionali. 
            Scegli il piano perfetto per le tue esigenze di trading sportivo.
          </p>

          {/* Live Demo */}
          <div className="max-w-2xl mx-auto mb-12">
            <CountdownTimer showDetails={true} />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Funzionalità Esclusive
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <div
                  key={index}
                  className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary-500/20 rounded-lg mr-4">
                      <Icon className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="flex space-x-1">
                      {feature.plans.map((plan) => (
                        <div
                          key={plan}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            plan === 'premium'
                              ? 'bg-accent-500/20 text-accent-400'
                              : 'bg-primary-500/20 text-primary-400'
                          }`}
                        >
                          {plan.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-dark-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Scegli il Tuo Piano
          </h2>
          
          <SubscriptionManager />
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Cosa Dicono i Nostri Utenti
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-xl p-6"
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-warning-400 fill-current" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-dark-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="border-t border-dark-700 pt-4">
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-dark-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Domande Frequenti
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Posso cambiare piano in qualsiasi momento?
              </h3>
              <p className="text-dark-300">
                Sì, puoi fare upgrade o downgrade del tuo piano in qualsiasi momento. 
                Le modifiche saranno applicate immediatamente e il costo sarà calcolato proporzionalmente.
              </p>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Quanto sono accurate le quote in tempo reale?
              </h3>
              <p className="text-dark-300">
                Le nostre quote sono sincronizzate direttamente con i bookmaker ogni 30 secondi per i piani premium. 
                Utilizziamo API professionali per garantire la massima accuratezza.
              </p>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                È disponibile un periodo di prova gratuito?
              </h3>
              <p className="text-dark-300">
                Sì, tutti i nuovi utenti hanno accesso a 500 richieste API gratuite al mese. 
                Inoltre, offriamo una garanzia di rimborso di 30 giorni per tutti i piani premium.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-dark-800 border border-dark-700 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto a Iniziare?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Unisciti a migliaia di trader che già utilizzano SitoSport per massimizzare i loro profitti.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-gradient text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
              Inizia Gratis
            </button>
            <button className="bg-accent-gradient text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-accent-500/25 transition-all duration-200">
              Scegli Premium
            </button>
          </div>
          
          <p className="text-sm text-dark-400 mt-4">
            Nessun impegno • Cancella quando vuoi • Supporto 24/7
          </p>
        </div>
      </div>
    </div>
  );
} 