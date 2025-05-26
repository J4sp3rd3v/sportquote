# 🎯 MonitorQuote - Comparatore Quote Sportive Avanzato

**MonitorQuote** è una piattaforma moderna e completa per il confronto delle quote sportive in tempo reale, con sistema di abbonamenti intelligente e aggiornamenti automatici.

## 🚀 Funzionalità Principali

### 📊 Sistema di Abbonamenti a 3 Livelli
- **🆓 Gratuito**: Aggiornamenti ogni ora, 100 richieste/mese
- **👑 Pro**: Aggiornamenti ogni minuto, 1.000 richieste/mese (PIÙ POPOLARE)
- **⭐ Premium**: Aggiornamenti ogni 30 secondi, 5.000 richieste/mese

### 🔄 Aggiornamenti Automatici Intelligenti
- Frequenza basata sul piano di abbonamento
- Gestione automatica dei limiti e scadenze
- Persistenza dati con localStorage
- Pattern singleton per gestione globale

### 🏆 Copertura Sportiva Completa
- **⚽ Calcio**: Serie A, Premier League, La Liga, Bundesliga, Ligue 1, Champions League
- **🎾 Tennis**: ATP/WTA Grand Slam e tornei principali
- **🏀 Basket**: NBA, EuroLeague, Serie A Basket
- **🏈 Altri Sport**: NFL, NHL, MLB e molto altro

### 📱 Interfaccia Utente Moderna
- Design responsive e mobile-first
- Dark theme ottimizzato
- Componenti UI interattivi
- Statistiche utilizzo in tempo reale
- Dashboard intelligente con guide

## 🛠️ Tecnologie Utilizzate

- **Framework**: Next.js 14 con App Router
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **API**: The Odds API per dati reali
- **Deployment**: Vercel
- **Gestione Stato**: React Hooks + Context

## 🔧 Architettura del Sistema

### 📁 Struttura Progetto
```
SITOSPORT/
├── app/                    # App Router Next.js
│   ├── categoria/[sport]/  # Pagine dinamiche sport
│   ├── bookmakers/         # Lista bookmaker
│   ├── premium/            # Gestione abbonamenti
│   └── sports/             # Categorie sportive
├── components/             # Componenti React
│   ├── SubscriptionManager.tsx
│   ├── BettingStrategies.tsx
│   └── BettingGuide.tsx
├── lib/                    # Logica business
│   ├── subscriptionManager.ts
│   ├── oddsApi.ts
│   └── oddsApiService.ts
├── hooks/                  # Custom hooks
├── types/                  # Definizioni TypeScript
└── public/                 # Asset statici
```

### 🎯 Componenti Chiave

#### `lib/subscriptionManager.ts`
- **Classe SubscriptionManager**: Gestione completa abbonamenti
- **Interfacce TypeScript**: `SubscriptionPlan`, `UserSubscription`
- **Funzionalità**:
  - Cicli di aggiornamento automatici
  - Controllo limiti e scadenze
  - Reset mensile contatori
  - Cambio piano dinamico
  - Statistiche utilizzo

#### `lib/oddsApi.ts`
- **Mappatura Bookmaker**: 150+ variazioni nomi gestite
- **Normalizzazione Robusta**: Algoritmo a 7 step
- **Gestione API**: The Odds API integration
- **Sport Mapping**: Conversione dati API → formato app

#### `components/SubscriptionManager.tsx`
- **UI Moderna**: Cards piani con animazioni
- **Statistiche Live**: Barra progresso utilizzo
- **Gestione Upgrade**: Cambio piano istantaneo
- **Modal Conferma**: UX ottimizzata

## 🚀 Installazione e Setup

### Prerequisiti
- Node.js 18+ 
- npm o yarn
- Account The Odds API

### 1. Clone del Repository
```bash
git clone https://github.com/J4sp3rd3v/sportquote.git
cd sportquote
```

### 2. Installazione Dipendenze
```bash
npm install
```

### 3. Configurazione Environment
Crea file `.env.local`:
```env
NEXT_PUBLIC_ODDS_API_KEY=your_odds_api_key_here
```

### 4. Avvio Sviluppo
```bash
npm run dev
```

### 5. Build Produzione
```bash
npm run build
npm start
```

## 📊 API Integration

### The Odds API
- **Endpoint**: `https://api.the-odds-api.com/v4`
- **Copertura**: 54+ bookmaker verificati
- **Mercati**: H2H, Spread, Totals
- **Regioni**: Europa, Italia, Globale
- **Rate Limiting**: Gestito automaticamente

### Bookmaker Supportati
- **Italia**: Bet365, Sisal, Snai, Eurobet, Lottomatica, Betflag
- **Internazionali**: William Hill, Betfair, Unibet, Bwin, Betway
- **Emergenti**: LeoVegas, NetBet, Betclic, Pinnacle, Marathonbet

## 🎨 Design System

### Colori Principali
- **Primary**: Blu (#3B82F6)
- **Accent**: Viola (#8B5CF6) 
- **Success**: Verde (#10B981)
- **Warning**: Giallo (#F59E0B)
- **Danger**: Rosso (#EF4444)
- **Dark**: Grigio scuro (#1F2937)

### Componenti UI
- **Cards**: Bordi arrotondati, ombre sottili
- **Buttons**: Gradienti, hover effects
- **Progress Bars**: Colori dinamici basati su utilizzo
- **Modals**: Backdrop blur, animazioni smooth

## 📈 Funzionalità Avanzate

### 🧮 Calcolatori Betting
- **Kelly Criterion**: Calcolo stake ottimale
- **Value Betting**: Identificazione quote sottovalutate
- **Arbitrage**: Rilevamento opportunità arbitraggio
- **Bankroll Management**: Gestione capitale

### 📚 Guide Complete
- **Principianti**: Introduzione al betting
- **Strategie Avanzate**: Tecniche professionali
- **Gestione Rischio**: Controllo perdite
- **Analisi Quote**: Interpretazione dati

### 🔔 Sistema Notifiche
- **Alerts Personalizzati**: Quote favorite
- **Push Notifications**: Aggiornamenti importanti
- **Email Reports**: Riassunti periodici

## 🚀 Deployment

### Vercel (Raccomandato)
```bash
# Deploy automatico da GitHub
vercel --prod
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoraggio e Analytics

### Metriche Chiave
- **Utilizzo API**: Richieste/mese per piano
- **Conversioni**: Free → Pro → Premium
- **Engagement**: Tempo sessione, pagine visitate
- **Performance**: Velocità caricamento, errori

### Dashboard Admin
- **Statistiche Utenti**: Piani attivi, churn rate
- **Performance API**: Latenza, successo rate
- **Revenue Tracking**: MRR, LTV, CAC

## 🔒 Sicurezza e Privacy

### Protezione Dati
- **GDPR Compliant**: Gestione consensi
- **Data Encryption**: Dati sensibili crittografati
- **API Security**: Rate limiting, autenticazione
- **Privacy First**: Dati minimi necessari

### Best Practices
- **Environment Variables**: Chiavi API sicure
- **HTTPS Only**: Comunicazioni crittografate
- **Input Validation**: Sanitizzazione dati
- **Error Handling**: Logging sicuro

## 🤝 Contribuire

### Processo Contribuzione
1. **Fork** del repository
2. **Branch** feature: `git checkout -b feature/amazing-feature`
3. **Commit** modifiche: `git commit -m 'Add amazing feature'`
4. **Push** branch: `git push origin feature/amazing-feature`
5. **Pull Request** con descrizione dettagliata

### Coding Standards
- **TypeScript**: Tipizzazione forte
- **ESLint**: Linting automatico
- **Prettier**: Formattazione codice
- **Conventional Commits**: Messaggi standardizzati

## 📞 Supporto

### Contatti
- **Email**: support@monitorquote.com
- **GitHub Issues**: [Segnala Bug](https://github.com/J4sp3rd3v/sportquote/issues)
- **Discord**: [Community](https://discord.gg/monitorquote)

### FAQ
**Q: Come ottengo una API key per The Odds API?**
A: Registrati su [the-odds-api.com](https://the-odds-api.com) e ottieni la tua chiave gratuita.

**Q: Posso usare MonitorQuote commercialmente?**
A: Sì, con licenza MIT puoi usarlo per progetti commerciali.

**Q: Quanto costa mantenere il servizio?**
A: Dipende dall'utilizzo API. Piano gratuito The Odds API include 500 richieste/mese.

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**. Vedi il file [LICENSE](LICENSE) per dettagli.

---

## 🎯 Roadmap Futura

### Q1 2025
- [ ] **Mobile App**: React Native
- [ ] **API Propria**: Backend personalizzato
- [ ] **Machine Learning**: Predizioni AI
- [ ] **Social Features**: Community betting

### Q2 2025
- [ ] **Live Betting**: Quote in tempo reale
- [ ] **Streaming**: Video partite integrate
- [ ] **Crypto Payments**: Bitcoin, Ethereum
- [ ] **Multi-language**: Supporto internazionale

---

**Sviluppato con ❤️ da [J4sp3rd3v](https://github.com/J4sp3rd3v)**

*MonitorQuote - La tua fonte definitiva per le migliori quote sportive* 🏆 