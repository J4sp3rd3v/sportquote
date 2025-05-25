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

## 🚀 **DEPLOYMENT RAPIDO**

### **🌟 Opzione 1: Vercel (Raccomandato)**

1. **Crea account GitHub** su https://github.com
2. **Crea nuovo repository** chiamato "sitosport"
3. **Carica il progetto:**
   ```bash
   git remote add origin https://github.com/TUOUSERNAME/sitosport.git
   git branch -M main
   git push -u origin main
   ```
4. **Vai su Vercel** https://vercel.com
5. **"Continue with GitHub"** → **"New Project"** → Seleziona "sitosport" → **"Deploy"**
6. **Il tuo sito sarà live in 2-3 minuti!** 🎉

**Link finale:** `https://sitosport-tuousername.vercel.app`

### **🔥 Opzione 2: Netlify**

1. **Carica su GitHub** (come sopra)
2. **Vai su Netlify** https://netlify.com
3. **"New site from Git"** → GitHub → Seleziona repository → **"Deploy"**

### **📱 Opzione 3: Script Automatico**

**Windows:**
```bash
./deploy.bat
```

**Linux/Mac:**
```bash
./deploy.sh
```

## 🔧 Tecnologie Utilizzate

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Development**: ESLint, PostCSS, Autoprefixer

## 📦 Installazione Locale

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
   ```

3. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

4. **Apri il browser**
   Vai su [http://localhost:3000](http://localhost:3000)

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
│   ├── FilterPanel.tsx    # Panel per i filtri di ricerca
│   ├── DataSourceToggle.tsx # Toggle quote reali/simulate
│   └── SportCategoryStats.tsx # Statistiche per categoria
├── data/                  # Dati simulati
│   └── mockData.ts        # Database simulato con 100 bookmakers
├── lib/                   # Servizi e utilità
│   └── oddsApi.ts         # Integrazione The Odds API
├── hooks/                 # Custom React hooks
│   └── useRealOdds.ts     # Hook per gestire quote reali
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

### Squadre e Campionati Reali

- **Serie A**: Juventus, Inter, Milan, Napoli, Roma, Lazio, Atalanta, ecc.
- **Premier League**: Manchester City, Arsenal, Liverpool, Chelsea, ecc.
- **La Liga**: Real Madrid, Barcelona, Atletico Madrid, ecc.
- **Bundesliga**: Bayern Munich, Borussia Dortmund, RB Leipzig, ecc.
- **Tennis**: Djokovic, Alcaraz, Sinner, Swiatek, Sabalenka, ecc.
- **NBA**: Lakers, Celtics, Warriors, Heat, Bucks, ecc.

## 🔧 Configurazione

### Quote Reali (Opzionale)

Per utilizzare quote reali, aggiungi la variabile d'ambiente:

**Vercel/Netlify:**
```
ODDS_API_KEY=9640f946c5bb763f61fd8105717aad6b
```

**Locale (.env.local):**
```
ODDS_API_KEY=9640f946c5bb763f61fd8105717aad6b
```

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

## 🔄 Aggiornamenti Automatici

Una volta configurato il deployment:
1. Modifica il codice localmente
2. `git add .`
3. `git commit -m "Aggiornamento"`
4. `git push`
5. Il sito si aggiorna automaticamente in 2-3 minuti

## 📱 Guide Dettagliate

- **[GUIDA_RAPIDA_DEPLOYMENT.md](GUIDA_RAPIDA_DEPLOYMENT.md)** - Deployment in 5 minuti
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guida completa con tutte le opzioni
- **Script automatici**: `deploy.bat` (Windows) e `deploy.sh` (Linux/Mac)

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Roadmap

- [ ] **API Reali**: Integrazione con API di bookmakers reali ✅
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
- [The Odds API](https://the-odds-api.com/) per le quote reali
- [Vercel](https://vercel.com/) per l'hosting

## 📞 Supporto

Per supporto, email a support@sitosport.com o apri un issue su GitHub.

---

## 🎯 **LINK UTILI**

- **🚀 Deploy Vercel**: https://vercel.com
- **🔥 Deploy Netlify**: https://netlify.com  
- **📚 Documentazione Next.js**: https://nextjs.org/docs
- **🎨 Tailwind CSS**: https://tailwindcss.com/docs
- **📊 The Odds API**: https://the-odds-api.com

---

**⚠️ Disclaimer**: Questo è un progetto dimostrativo. Le quote mostrate in modalità simulata non rappresentano quote reali di bookmakers. Per scommesse reali, consulta sempre i siti ufficiali dei bookmakers autorizzati. 