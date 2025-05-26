# 🏆 MonitorQuote - Comparatore Quote Sportive Moderno

Un'applicazione web moderna e responsive per il confronto delle quote sportive in tempo reale, con sistema di abbonamenti e interfaccia ottimizzata per tema scuro.

## ✨ Caratteristiche Principali

### 🎯 Sistema di Abbonamenti Intelligente
- **Piano Gratuito**: 500 richieste/mese, aggiornamenti ogni ora
- **Piano Pro**: 10.000 richieste/mese, aggiornamenti ogni 5 minuti  
- **Piano Premium**: Richieste illimitate, aggiornamenti ogni 30 secondi

### ⏱️ Timer Countdown Live
- Countdown in tempo reale per prossimi aggiornamenti quote
- Progress bar animata con indicatori di stato
- Gestione automatica dei diversi piani abbonamento
- Visualizzazione tempo rimanente in formato MM:SS

### 🏪 Database Bookmaker Completo
- **54+ bookmaker supportati** con informazioni dettagliate
- Categorizzazione: Italiani, Internazionali, Specializzati
- Sistema di ricerca e filtri avanzati
- Rating, bonus benvenuto, caratteristiche uniche
- Link intelligenti con apertura sicura

### 🏈 Sport e Campionati
- **6 sport principali**: Calcio, Basket, Tennis, Football Americano, Hockey, Baseball
- **30+ campionati** con classificazione tier (Premium, Standard, Basic)
- Statistiche dettagliate: numero squadre, popolarità, stagione
- Filtri per sport, livello e ricerca testuale

### 🎨 Design Moderno
- **Tema scuro completo** con palette colori moderna
- **Responsive design** ottimizzato per desktop e mobile
- **Animazioni fluide** e transizioni eleganti
- **Componenti interattivi** con feedback visivo

## 🚀 Tecnologie Utilizzate

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Type safety e sviluppo robusto
- **Tailwind CSS** - Styling moderno e responsive
- **Zustand** - State management leggero e performante
- **Lucide React** - Icone moderne e scalabili
- **Framer Motion** - Animazioni fluide

## 📦 Installazione

1. **Clona il repository**
```bash
git clone https://github.com/tuousername/monitorquote.git
cd monitorquote
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura le variabili d'ambiente**
```bash
cp .env.example .env.local
```

4. **Avvia il server di sviluppo**
```bash
npm run dev
```

5. **Apri il browser**
```
http://localhost:3000
```

## 🔧 Configurazione

### Variabili d'Ambiente
```env
# API Configuration
NEXT_PUBLIC_ODDS_API_KEY=your_odds_api_key
NEXT_PUBLIC_RAPID_API_KEY=your_rapid_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### Configurazione API
Il sistema gestisce automaticamente i limiti delle API:
- **Odds API**: Gestione intelligente delle 500 richieste mensili gratuite
- **RapidAPI**: Backup per dati aggiuntivi
- **Rate limiting**: Prevenzione automatica del superamento limiti

## 📁 Struttura del Progetto

```
monitorquote/
├── app/                    # App Router (Next.js 14)
│   ├── bookmakers/        # Pagina bookmaker
│   ├── sports/            # Pagina sport e campionati
│   ├── premium/           # Pagina piani abbonamento
│   ├── layout.tsx         # Layout principale
│   └── page.tsx           # Homepage
├── components/            # Componenti React
│   ├── Navigation.tsx     # Navbar moderna
│   ├── CountdownTimer.tsx # Timer countdown live
│   ├── SubscriptionManager.tsx # Gestione abbonamenti
│   └── ...
├── lib/                   # Utilities e servizi
│   ├── apiManager.ts      # Gestione API e abbonamenti
│   ├── oddsApi.ts         # Integrazione Odds API
│   └── ...
├── hooks/                 # Custom React hooks
├── types/                 # Definizioni TypeScript
└── public/               # Asset statici
```

## 🎮 Funzionalità Dettagliate

### Sistema di Gestione API
- **Store Zustand** con persistenza locale
- **Calcolo automatico** usage e richieste rimanenti
- **Reset mensile** automatico dei contatori
- **Gestione errori** e fallback intelligenti

### Componenti Principali

#### CountdownTimer
- Timer live con aggiornamento ogni secondo
- Stati visivi: normale, prossimo aggiornamento, in corso
- Supporto per tutti i piani abbonamento
- Progress bar animata

#### SubscriptionManager
- Visualizzazione piano corrente e statistiche
- Grid piani con badge "PIÙ POPOLARE"
- Modal di conferma per upgrade/downgrade
- Gestione cancellazione abbonamento

#### Navigation
- Navbar sticky con backdrop blur
- Logo animato con gradiente
- Menu responsive desktop/mobile
- Indicatori di stato live

### Database Bookmaker
```typescript
interface Bookmaker {
  id: string;
  name: string;
  category: 'italian' | 'international' | 'specialized';
  rating: number;
  bonus: string;
  features: string[];
  description: string;
  website: string;
  logo: string;
}
```

### Database Sport
```typescript
interface Sport {
  id: string;
  name: string;
  icon: string;
  leagues: League[];
}

interface League {
  id: string;
  name: string;
  tier: 'premium' | 'standard' | 'basic';
  teams: number;
  popularity: number;
  season: string;
}
```

## 🔒 Sicurezza

- **Validazione input** su tutti i form
- **Sanitizzazione URL** per link bookmaker
- **Rate limiting** per prevenire abusi API
- **Gestione errori** robusta con fallback
- **HTTPS enforcement** in produzione

## 📱 Responsive Design

- **Mobile First** approach
- **Breakpoints Tailwind**: sm, md, lg, xl, 2xl
- **Touch-friendly** interfaccia per dispositivi mobili
- **Performance ottimizzate** per connessioni lente

## 🎨 Sistema Colori

```css
/* Colori Principali */
--primary: #3B82F6      /* Blu principale */
--accent: #F97316       /* Arancione accent */
--success: #10B981      /* Verde successo */
--warning: #F59E0B      /* Giallo warning */
--danger: #EF4444       /* Rosso errore */

/* Tema Scuro */
--dark-900: #0F172A     /* Sfondo principale */
--dark-800: #1E293B     /* Sfondo componenti */
--dark-700: #334155     /* Bordi */
--dark-400: #94A3B8     /* Testo secondario */
```

## 📊 Performance

- **Lazy loading** per componenti pesanti
- **Memoization** per calcoli complessi
- **Debouncing** per ricerche e filtri
- **Caching intelligente** per dati API
- **Bundle optimization** con Next.js

## 🚀 Deploy

### Netlify (Raccomandato)
```bash
npm run build
# Deploy automatico con git push
```

### Vercel
```bash
npm run build
vercel --prod
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

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Monitoraggio

- **Analytics** integrato per tracking utenti
- **Error tracking** con Sentry (opzionale)
- **Performance monitoring** con Web Vitals
- **API usage tracking** in tempo reale

## 🤝 Contribuire

1. **Fork** il repository
2. **Crea** un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✨ Implementazione completa interfaccia tema scuro
- 🎯 Sistema abbonamenti con 3 piani
- ⏱️ Timer countdown live funzionante
- 🏪 Database 54+ bookmaker
- 🏈 6 sport e 30+ campionati
- 📱 Design responsive ottimizzato
- 🔧 Sistema API manager intelligente

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 👥 Team

- **Sviluppatore Principal**: [Il tuo nome]
- **UI/UX Design**: [Designer nome]
- **API Integration**: [Developer nome]

## 🆘 Supporto

Per supporto e domande:
- 📧 Email: support@monitorquote.com
- 💬 Discord: [Link server Discord]
- 📱 Telegram: [Link canale Telegram]

## 🔗 Link Utili

- [Documentazione API](https://docs.monitorquote.com)
- [Guida Utente](https://guide.monitorquote.com)
- [Status Page](https://status.monitorquote.com)
- [Roadmap](https://roadmap.monitorquote.com)

---

**Fatto con ❤️ per gli appassionati di sport e scommesse** 