# 🏆 MonitorQuote - Sistema Quote Sportive Giornaliero 2025

**La piattaforma più avanzata per il confronto delle quote sportive con sistema giornaliero globale.**

## 🚀 SISTEMA GIORNALIERO GLOBALE - NOVITÀ 2025

### ✅ Caratteristiche Principali
- **1 Aggiornamento al Giorno**: Alle 12:00 per tutto il sito
- **Quote Stabili 24h**: Invariate dalle 12:00 di oggi alle 12:00 di domani
- **Condivise da Tutti**: Tutti gli utenti vedono sempre le stesse quote
- **6 Sport Prioritari**: Serie A, Premier League, Champions League, NBA, ATP Tennis, NFL
- **Efficienza Massima**: Nessuno spreco di risorse
- **Sistema Automatico**: Aggiornamento programmato ogni giorno
- **Indipendente dagli Utenti**: Funziona anche senza utenti connessi

### 🎯 Logica di Funzionamento
```typescript
// Sistema Giornaliero Globale
const globalDailyUpdater = GlobalDailyUpdater.getInstance();

// Verifica se le quote sono aggiornate oggi
if (globalDailyUpdater.areQuotesFreshToday()) {
  // Quote fresche di oggi
}

// Statistiche sistema
const stats = globalDailyUpdater.getGlobalDailyStats();
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

## 🔧 ARCHITETTURA GIORNALIERA

### Sistema Giornaliero Globale
```
lib/
├── globalDailyUpdater.ts     # Sistema giornaliero principale
├── optimizedBookmakerManager.ts  # Bookmaker verificati
├── optimizedOddsService.ts   # Servizio quote ottimizzato
└── unifiedApiManager.ts      # Gestione dati centralizzata
```

### Componenti Principali
```
components/
├── GlobalDailyMonitor.tsx    # Dashboard sistema giornaliero
├── ArbitrageOpportunities.tsx # Calcolo arbitraggi
├── BestOddsHighlight.tsx     # Migliori quote del giorno
└── MatchCard.tsx             # Card partite ottimizzata
```

## 🎮 FUNZIONALITÀ AVANZATE

### 🌐 Sistema Giornaliero Globale
- **1 Aggiornamento al Giorno**: Alle 12:00 per tutto il sito
- **Quote Stabili 24h**: Invariate dalle 12:00 di oggi alle 12:00 di domani
- **Condivise da Tutti**: Tutti gli utenti vedono sempre le stesse quote
- **Indipendente dagli Utenti**: Funziona anche senza utenti connessi
- **Broadcast Globale**: Notifica tutti i client connessi simultaneamente
- **Persistenza Centralizzata**: Stato salvato e recuperato automaticamente

#### Programma Giornaliero
```
12:00 - AGGIORNAMENTO GLOBALE
├── Serie A
├── Premier League  
├── Champions League
├── NBA
├── ATP Tennis
└── NFL

12:00 → 12:00 (giorno dopo)
└── Quote stabili per tutti
```

### 💰 Sistema di Arbitraggio
- **Calcolo Automatico**: Identifica opportunità di scommessa sicura
- **Profitto Minimo 0.5%**: Solo arbitraggi realmente profittevoli
- **Distribuzione Stake**: Calcolo automatico delle puntate

### 📈 Analisi Quote
- **Migliori Quote del Giorno**: Evidenzia le opportunità top
- **Partite Equilibrate**: Identifica match con quote simili
- **Opportunità di Valore**: Quote mediamente alte (>2.50)

### 🌐 Sistema Giornaliero Globale
- **1 Aggiornamento al Giorno**: Alle 12:00 per tutto il sito
- **Quote Stabili 24h**: Invariate per 24 ore consecutive
- **Condivise da Tutti**: Tutti gli utenti vedono le stesse quote
- **Indipendente dagli Utenti**: Funziona anche senza utenti connessi
- **Controllo Automatico**: Verifica ogni minuto se è il momento dell'aggiornamento
- **Broadcast Globale**: Eventi inviati a tutti i client connessi
- **API REST**: Controllo remoto tramite `/api/global-daily`

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

### Configurazione Sistema
```env
# Configurazione ambiente
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG_MODE=false

# Sistema giornaliero globale (configurazione automatica)
DAILY_UPDATE_HOUR=12
```

### Avvio Sviluppo
```bash
npm run dev
# Apri http://localhost:3000
```

## 📊 MONITORAGGIO SISTEMA

### Dashboard Sistema Giornaliero
- **Sistema Giornaliero**: Attivo/Inattivo con controllo centralizzato
- **Quote Oggi**: Aggiornate/Non Aggiornate con timestamp
- **Status Sport**: Fresh/Stale/Updating per ogni sport
- **Controlli Globali**: Avvio/Stop, Aggiornamento Forzato, Reset Sistema
- **Statistiche**: Giorni attivi, successi, fallimenti, tasso successo

### Dashboard Quote
- **Aggiornamento Giornaliero**: 1 volta alle 12:00
- **Sport Monitorati**: 6/6 sport prioritari
- **Quote Stabili**: 24 ore consecutive
- **Condivisione**: Tutti gli utenti vedono le stesse quote

### Statistiche Bookmaker
- **16 Verificati**: Tutti con licenza italiana
- **5 Premium**: Top bookmaker italiani
- **100% Sicuri**: URL verificati e testati

## 🔍 TESTING E DEBUG

### Test Sistema Giornaliero
```bash
# Test sistema giornaliero globale
node scripts/test-global-daily-system.js

# Test bookmaker
node scripts/test-bookmaker-normalization.js
```

### Debug Mode
```typescript
// Abilita debug in development
if (process.env.NODE_ENV === 'development') {
  globalDailyUpdater.resetGlobalSystem(); // Reset per test
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
NEXT_PUBLIC_ENVIRONMENT=production
DAILY_UPDATE_HOUR=12
```

## 📈 PERFORMANCE

### Ottimizzazioni 2025
- **Sistema Giornaliero**: 1 aggiornamento alle 12:00 per tutto il sito
- **Quote Stabili**: 24 ore consecutive senza cambiamenti
- **Efficienza Massima**: Nessuno spreco di risorse
- **Condivisione Globale**: Tutti vedono le stesse quote
- **Lazy Loading**: Componenti caricati on-demand
- **Bundle Splitting**: Codice ottimizzato per performance

### Metriche
- **First Load**: <2s
- **Quote Response**: Istantaneo (cache locale)
- **Memory Usage**: <50MB
- **Bundle Size**: <1MB gzipped

## 🔐 SICUREZZA

### Protezioni Implementate
- **Sistema Controllato**: Aggiornamenti programmati e sicuri
- **Input Validation**: Sanitizzazione dati
- **HTTPS Only**: Comunicazioni sicure
- **NoOpener/NoReferrer**: Link bookmaker sicuri

### Gestione Errori
- **Fallback Automatico**: Dati di backup
- **Sistema Robusto**: Gestione errori centralizzata
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
- **Sistema Docs**: Documentazione sistema giornaliero
- **Issues**: [GitHub Issues](https://github.com/J4sp3rd3v/sportquote/issues)

### Contatti
- **Email**: support@monitorquote.com
- **Discord**: [Community Server](https://discord.gg/monitorquote)
- **Twitter**: [@MonitorQuote](https://twitter.com/monitorquote)

---

## 🎯 ROADMAP 2025

### Q1 2025 ✅
- [x] Sistema Giornaliero Globale
- [x] Gestione Bookmaker Ottimizzata
- [x] Quote Stabili 24h
- [x] Arbitraggio Automatico

### Q2 2025 🔄
- [ ] App Mobile (React Native)
- [ ] Notifiche Push
- [ ] Sistema Multi-Orario
- [ ] Dashboard Admin

### Q3 2025 📋
- [ ] Machine Learning Predictions
- [ ] Social Features
- [ ] Premium Subscriptions
- [ ] Multi-language Support

### Q4 2025 🚀
- [ ] AI-Powered Insights
- [ ] Sistema Distribuito
- [ ] Global Expansion
- [ ] Enterprise Solutions

---

**⭐ Se questo progetto ti è utile, lascia una stella su GitHub!**

**🔗 [Demo Live](https://monitorquote.netlify.app) | [GitHub](https://github.com/J4sp3rd3v/sportquote) | [Documentazione](https://github.com/J4sp3rd3v/sportquote/wiki)** 