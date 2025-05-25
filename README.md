# 🏆 SitoSport - Confronta Quote Scommesse

Una piattaforma moderna e reattiva per confrontare le quote dei migliori siti di scommesse sportive. Monitora oltre 100 bookmakers e trova sempre le migliori opportunità.

![SitoSport Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=SitoSport+Preview)

## ✨ Caratteristiche Principali

- 🔄 **Quote in Tempo Reale**: Integrazione con The Odds API per quote reali aggiornate ogni 5 minuti
- 🏢 **100+ Bookmakers**: Confronta quote da tutti i principali operatori (reali + simulati)
- 🎯 **Migliori Opportunità**: Identifica automaticamente le quote più vantaggiose
- 📱 **Design Responsivo**: Interfaccia ottimizzata per desktop, tablet e mobile
- 🔍 **Ricerca Avanzata**: Filtra per sport, campionati, date e range di quote
- ⚡ **Performance Ottimizzate**: Caricamento veloce e navigazione fluida
- 🎨 **UI Moderna**: Design pulito e intuitivo con Tailwind CSS
- 🔀 **Modalità Duale**: Alterna tra quote reali e dati simulati
- 📊 **Monitoraggio API**: Visualizza stato connessione e utilizzo API

## 🚀 Tecnologie Utilizzate

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Development**: ESLint, PostCSS, Autoprefixer

## 📦 Installazione

### Prerequisiti

- Node.js 18+ 
- npm o yarn

### Passi per l'installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuousername/sitosport.git
   cd sitosport
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   # oppure
   yarn install
   ```

3. **Configura la chiave API (opzionale)**
   Per utilizzare quote reali, la chiave API è già configurata nel codice.
   Per usare la tua chiave, modifica `lib/oddsApi.ts`:
   ```typescript
   const ODDS_API_KEY = 'la-tua-chiave-api';
   ```

4. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   # oppure
   yarn dev
   ```

5. **Apri il browser**
   Vai su [http://localhost:3000](http://localhost:3000) per vedere l'applicazione.

## 🏗️ Struttura del Progetto

```
sitosport/
├── app/                    # App Router di Next.js
│   ├── globals.css        # Stili globali
│   ├── layout.tsx         # Layout principale
│   └── page.tsx           # Homepage
├── components/            # Componenti React riutilizzabili
│   ├── Header.tsx         # Header con navigazione e ricerca
│   ├── MatchCard.tsx      # Card per visualizzare le partite
│   └── FilterPanel.tsx    # Panel per i filtri di ricerca
├── data/                  # Dati simulati
│   └── mockData.ts        # Database simulato con 100 bookmakers
├── types/                 # Definizioni TypeScript
│   └── index.ts           # Interfacce e tipi
├── public/                # Asset statici
└── ...                    # File di configurazione
```

## 🎮 Utilizzo

### Ricerca e Filtri

1. **Ricerca Testuale**: Usa la barra di ricerca per trovare squadre, campionati o bookmakers
2. **Filtri Avanzati**: Clicca su "Filtri" per accedere a opzioni avanzate:
   - Sport (Calcio, Tennis, Basket, ecc.)
   - Campionati (Serie A, Premier League, ecc.)
   - Date (Oggi, Domani, Questa settimana)
   - Range di quote (Min/Max)

### Confronto Quote

1. **Visualizzazione**: Ogni partita mostra le migliori quote disponibili
2. **Dettagli**: Clicca su "Confronta Tutte" per vedere tutte le quote disponibili
3. **Bookmakers**: Vedi quale bookmaker offre la quota migliore per ogni esito

### Quote Reali vs Simulate

**Modalità Quote Reali:**
- Dati live da The Odds API
- Aggiornamento automatico ogni 5 minuti
- Include Serie A, Premier League, La Liga, Bundesliga, Champions League, NBA, Tennis
- Monitoraggio utilizzo API e richieste rimanenti
- Gestione errori e fallback automatico

**Modalità Simulata:**
- Dati dimostrativi per test e sviluppo
- 100+ bookmakers simulati
- Quote generate algoritmicamente
- Nessun limite di utilizzo

### Funzionalità Mobile

- Design completamente responsivo
- Menu di navigazione ottimizzato per mobile
- Touch-friendly per una navigazione fluida

## 🔧 Configurazione

### Personalizzazione Colori

Modifica i colori in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // I tuoi colori personalizzati
      }
    }
  }
}
```

### Aggiunta di Nuovi Sport

Aggiungi nuovi sport in `data/mockData.ts`:

```typescript
export const sports: Sport[] = [
  { id: 'nuovo-sport', name: 'Nuovo Sport', icon: '🏆', isPopular: true },
  // ...altri sport
];
```

## 📊 Database Simulato

Il progetto include un database simulato con:

- **100 Bookmakers**: Include i principali operatori italiani e internazionali
- **Multiple Partite**: Partite di calcio, tennis, basket con quote realistiche
- **Quote Dinamiche**: Quote generate automaticamente con variazioni realistiche
- **Aggiornamenti**: Timestamp di ultimo aggiornamento per ogni quota

### Bookmakers Inclusi

- **Italiani**: Sisal, Snai, Eurobet, Lottomatica, Better, Goldbet
- **Internazionali**: Bet365, William Hill, Betfair, Unibet, Bwin
- **E molti altri**: Oltre 90 bookmakers aggiuntivi

## 🚀 Deployment

### Vercel (Raccomandato)

1. Fai push del codice su GitHub
2. Connetti il repository a Vercel
3. Deploy automatico ad ogni push

### Altri Provider

```bash
# Build per produzione
npm run build

# Avvia in modalità produzione
npm start
```

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Roadmap

- [ ] **API Reali**: Integrazione con API di bookmakers reali
- [ ] **Notifiche**: Alert per quote vantaggiose
- [ ] **Storico Quote**: Grafici di andamento delle quote
- [ ] **Confronto Avanzato**: Calcolo automatico di arbitraggi
- [ ] **Account Utente**: Salvataggio preferiti e impostazioni
- [ ] **App Mobile**: Versione nativa per iOS e Android

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Ringraziamenti

- [Next.js](https://nextjs.org/) per il framework
- [Tailwind CSS](https://tailwindcss.com/) per lo styling
- [Lucide](https://lucide.dev/) per le icone
- [Vercel](https://vercel.com/) per l'hosting

## 📞 Supporto

Per supporto, email a support@sitosport.com o apri un issue su GitHub.

---

**⚠️ Disclaimer**: Questo è un progetto dimostrativo. Le quote mostrate sono simulate e non rappresentano quote reali di bookmakers. Per scommesse reali, consulta sempre i siti ufficiali dei bookmakers autorizzati. 