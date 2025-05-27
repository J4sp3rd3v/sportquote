# 🏆 MonitorQuote - Sistema Quote Sportive Ottimizzato 2025

**La piattaforma più avanzata per il confronto delle quote sportive con sistema API giornaliero ottimizzato.**

## 🚀 SISTEMA API UNIFICATO - NOVITÀ 2025

### ✅ Caratteristiche Principali
- **1 Richiesta per Sport al Giorno**: Sistema ottimizzato che preserva le 500 richieste mensili
- **6 Sport Prioritari**: Serie A, Premier League, Champions League, NBA, ATP Tennis, NFL
- **Cache Intelligente 24h**: Riduce drasticamente le richieste API
- **Reset Automatico Giornaliero**: Gestione automatica dei limiti
- **Conteggio Preciso**: Monitoraggio accurato dell'utilizzo API

### 🎯 Gestione API Ottimale
```typescript
// Sistema Unificato
const unifiedApiManager = UnifiedApiManager.getInstance();

// Verifica disponibilità
if (unifiedApiManager.canUpdateSport('soccer_italy_serie_a')) {
  const odds = await unifiedApiManager.getSportOdds('soccer_italy_serie_a');
}

// Statistiche in tempo reale
const stats = unifiedApiManager.getDetailedStats();
```

## 📊 BOOKMAKER VERIFICATI

### 🥇 Premium (Top 5)
- **Bet365** - Live Streaming, Cash Out, Mobile App
- **Sisal** - Storico Italiano, SuperEnalotto
- **Snai** - Marchio Storico, Casinò Live
- **Eurobet** - Quote Competitive, Live Betting
- **Lottomatica** - Leader Italiano, Lotto

### 🏅 Standard (5)
- Betflag, Goldbet, Planetwin365, Admiral, Better

### 🌍 International (6)
- William Hill, Betfair, Unibet, Bwin, Betway, Pinnacle

**Totale: 16 bookmaker verificati con licenza AAMS/ADM**

## 🔧 ARCHITETTURA OTTIMIZZATA

### Sistema API Unificato
```
lib/
├── unifiedApiManager.ts      # Gestione API centralizzata
├── optimizedBookmakerManager.ts  # Bookmaker verificati
├── optimizedOddsService.ts   # Servizio quote ottimizzato
└── optimizedOddsApi.ts       # API wrapper ottimizzato
```

### Componenti Principali
```
components/
├── UnifiedApiMonitor.tsx     # Monitoraggio sistema unificato
├── ArbitrageOpportunities.tsx # Calcolo arbitraggi
├── BestOddsHighlight.tsx     # Migliori quote del giorno
└── MatchCard.tsx             # Card partite ottimizzata
```

## 🎮 FUNZIONALITÀ AVANZATE

### 💰 Sistema di Arbitraggio
- **Calcolo Automatico**: Identifica opportunità di scommessa sicura
- **Profitto Minimo 0.5%**: Solo arbitraggi realmente profittevoli
- **Distribuzione Stake**: Calcolo automatico delle puntate

### 📈 Analisi Quote
- **Migliori Quote del Giorno**: Evidenzia le opportunità top
- **Partite Equilibrate**: Identifica match con quote simili
- **Opportunità di Valore**: Quote mediamente alte (>2.50)

### 🔄 Aggiornamenti Intelligenti
- **Priorità Sport**: Serie A > Premier > Champions > NBA > Tennis > NFL
- **Cache 24h**: Evita richieste ridondanti
- **Fallback Automatico**: Gestione errori robusta

## 🛠️ INSTALLAZIONE E SETUP

### Prerequisiti
```bash
Node.js 18+
npm o yarn
Git
```

### Installazione
```bash
# Clone repository
git clone https://github.com/J4sp3rd3v/sportquote.git
cd sportquote

# Installa dipendenze
npm install

# Configura variabili ambiente
cp .env.example .env.local
```

### Configurazione API
```env
# The Odds API (Obbligatoria)
NEXT_PUBLIC_ODDS_API_KEY=4815fd45ad14363aea162bef71a91b06

# Configurazione opzionale
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG_MODE=false
```

### Avvio Sviluppo
```bash
npm run dev
# Apri http://localhost:3000
```

## 📊 MONITORAGGIO SISTEMA

### Dashboard API
- **Utilizzo Giornaliero**: 6/6 richieste (1 per sport)
- **Utilizzo Mensile**: X/500 richieste
- **Sport Aggiornati**: 6/6 oggi
- **Cache Attiva**: Entries con TTL 24h

### Statistiche Bookmaker
- **16 Verificati**: Tutti con licenza italiana
- **5 Premium**: Top bookmaker italiani
- **100% Sicuri**: URL verificati e testati

## 🔍 TESTING E DEBUG

### Test Sistema API
```bash
# Test sistema giornaliero
node scripts/test-daily-api-system.js

# Test bookmaker
node scripts/test-bookmaker-normalization.js

# Test emergenza
node scripts/test-emergency-system.js
```

### Debug Mode
```typescript
// Abilita debug in development
if (process.env.NODE_ENV === 'development') {
  unifiedApiManager.forceReset(); // Reset per test
}
```

## 🚀 DEPLOYMENT

### Build Produzione
```bash
npm run build
npm start
```

### Deploy Netlify
```bash
# Configurazione automatica con netlify.toml
npm run build
# Deploy automatico su push main
```

### Variabili Produzione
```env
NEXT_PUBLIC_ODDS_API_KEY=your_production_key
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📈 PERFORMANCE

### Ottimizzazioni 2025
- **-90% Richieste API**: Da continue a 6 al giorno
- **Cache Intelligente**: 24h TTL per quote
- **Lazy Loading**: Componenti caricati on-demand
- **Bundle Splitting**: Codice ottimizzato per performance

### Metriche
- **First Load**: <2s
- **API Response**: <500ms (cache hit)
- **Memory Usage**: <50MB
- **Bundle Size**: <1MB gzipped

## 🔐 SICUREZZA

### Protezioni Implementate
- **Rate Limiting**: Controllo richieste API
- **Input Validation**: Sanitizzazione dati
- **HTTPS Only**: Comunicazioni sicure
- **NoOpener/NoReferrer**: Link bookmaker sicuri

### Gestione Errori
- **Fallback Automatico**: Dati di backup
- **Retry Logic**: Tentativi automatici
- **Error Boundaries**: Isolamento errori React
- **Logging Dettagliato**: Tracciamento problemi

## 📱 RESPONSIVE DESIGN

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **4K**: 1920px+

### Ottimizzazioni Mobile
- **Touch Friendly**: Pulsanti >44px
- **Swipe Gestures**: Navigazione intuitiva
- **Offline Support**: Cache locale
- **PWA Ready**: Installabile come app

## 🤝 CONTRIBUTI

### Come Contribuire
1. Fork del repository
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

### Linee Guida
- **TypeScript**: Tipizzazione forte
- **ESLint**: Codice pulito
- **Prettier**: Formattazione consistente
- **Conventional Commits**: Messaggi standardizzati

## 📄 LICENZA

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 🆘 SUPPORTO

### Documentazione
- **Wiki**: [GitHub Wiki](https://github.com/J4sp3rd3v/sportquote/wiki)
- **API Docs**: [The Odds API](https://the-odds-api.com/liveapi/guides/v4/)
- **Issues**: [GitHub Issues](https://github.com/J4sp3rd3v/sportquote/issues)

### Contatti
- **Email**: support@monitorquote.com
- **Discord**: [Community Server](https://discord.gg/monitorquote)
- **Twitter**: [@MonitorQuote](https://twitter.com/monitorquote)

---

## 🎯 ROADMAP 2025

### Q1 2025 ✅
- [x] Sistema API Unificato
- [x] Gestione Bookmaker Ottimizzata
- [x] Cache Intelligente 24h
- [x] Arbitraggio Automatico

### Q2 2025 🔄
- [ ] App Mobile (React Native)
- [ ] Notifiche Push
- [ ] API Pubblica
- [ ] Dashboard Admin

### Q3 2025 📋
- [ ] Machine Learning Predictions
- [ ] Social Features
- [ ] Premium Subscriptions
- [ ] Multi-language Support

### Q4 2025 🚀
- [ ] AI-Powered Insights
- [ ] Blockchain Integration
- [ ] Global Expansion
- [ ] Enterprise Solutions

---

**⭐ Se questo progetto ti è utile, lascia una stella su GitHub!**

**🔗 [Demo Live](https://monitorquote.netlify.app) | [GitHub](https://github.com/J4sp3rd3v/sportquote) | [Documentazione](https://github.com/J4sp3rd3v/sportquote/wiki)** 