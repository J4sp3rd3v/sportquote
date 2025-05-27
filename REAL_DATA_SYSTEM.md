# 🎯 MonitorQuote Pro - Sistema Professionale Quote Sportive

## 📋 Panoramica

**MonitorQuote Pro** è una piattaforma professionale completamente riorganizzata per l'analisi avanzata delle quote sportive, arbitraggio automatico e strategie di betting professionali. Il sistema utilizza **esclusivamente dati reali** da campionati attivi con aggiornamento giornaliero alle 12:00.

## ✅ Caratteristiche Principali

### 🎯 **Piattaforma Professionale Completa**
- 📊 **Dashboard Avanzata** - Panoramica completa con statistiche in tempo reale
- 🔍 **Analisi Professionale** - Strumenti avanzati per identificare opportunità
- ⚡ **Arbitraggio Automatico** - Rilevamento automatico profitti garantiti
- 📚 **Strategie Avanzate** - Guide complete per value betting e gestione bankroll
- 🏆 **Solo Dati Reali** - Campionati attivi verificati con aggiornamento giornaliero

### 🏆 **Campionati Supportati (Solo con Partite Reali)**
Il sistema carica automaticamente partite SOLO da sport verificati:
- **Calcio**: Ligue 1, Champions League
- **Basket**: NBA  
- **Football Americano**: NFL
- **Hockey**: NHL
- **MMA**: UFC/Mixed Martial Arts

⚠️ **NOTA**: Altri campionati (Premier League, La Liga, Bundesliga, Serie A, Tennis) non sono attualmente disponibili nell'API o non hanno partite future.

### 📊 **Gestione API Ottimizzata**
- **Limite**: 500 richieste/mese (piano gratuito)
- **Utilizzo**: Massimo 6 richieste/giorno (1 per sport)
- **Cache**: 24 ore per massima efficienza
- **Condivisione**: Stessi dati per tutti gli utenti
- **Monitoraggio**: Dashboard tempo reale

## 🛠️ Componenti Principali

### 1. `RealOddsService` (`lib/realOddsService.ts`)
Servizio principale per gestire le API reali:
```typescript
// Carica SOLO partite reali
const matches = await realOddsService.getAllRealMatches();

// Statistiche utilizzo API
const stats = realOddsService.getServiceStats();
```

### 2. `useOnlyRealOdds` (`hooks/useOnlyRealOdds.ts`)
Hook React per utilizzare solo dati reali:
```typescript
const {
  matches,        // Solo partite reali
  hasRealData,    // True se ci sono dati reali
  isLoading,      // Stato caricamento
  error,          // Errori API
  stats,          // Statistiche utilizzo
  refreshOdds     // Ricarica manuale
} = useOnlyRealOdds();
```

### 3. `RealDataStatus` (`components/RealDataStatus.tsx`)
Componente UI per monitorare lo stato dei dati reali:
- 📊 Statistiche utilizzo API
- 🔄 Pulsante aggiornamento manuale
- ⚠️ Avvisi limite API
- ✅ Conferma dati reali attivi

## 🚨 Gestione Errori

### Messaggi di Errore Specifici:
- **🚫 Limite mensile raggiunto**: 500 richieste esaurite
- **🔑 API Key invalida**: Problema configurazione
- **⏰ Rate limit superato**: Troppe richieste rapide
- **📅 Nessuna partita disponibile**: Campionati in pausa
- **🏆 Nessun campionato attivo**: Sport fuori stagione

### Comportamento Senza Dati:
- ❌ **NON** vengono caricati dati falsi
- ✅ Viene mostrato messaggio informativo
- ✅ Possibilità di ricaricamento manuale
- ✅ Statistiche API sempre visibili

## 📈 Monitoraggio Sistema

### Dashboard Tempo Reale:
- **Richieste Usate**: X/500 mensili
- **Cache Attiva**: X voci salvate
- **Ultimo Aggiornamento**: Timestamp preciso
- **Stato API**: Operativa/Limite raggiunto

### Indicatori Visivi:
- 🟢 **Verde**: Dati reali attivi
- 🟡 **Giallo**: Avviso limite vicino
- 🔴 **Rosso**: Errore o limite raggiunto
- 🔵 **Blu**: Caricamento in corso

## 🔧 Configurazione

### Variabili d'Ambiente:
```env
NEXT_PUBLIC_ODDS_API_KEY=your_api_key_here
```

### API Key Gratuita:
1. Registrati su [The Odds API](https://the-odds-api.com/)
2. Ottieni la chiave gratuita (500 richieste/mese)
3. Aggiungi al file `.env.local`

## 📊 Statistiche Utilizzo

### Piano Gratuito:
- **500 richieste/mese**
- **Aggiornamenti ogni ora**
- **Tutti i principali campionati**
- **Quote da 15+ bookmaker**

### Ottimizzazioni:
- **Cache intelligente** (1 ora)
- **Richieste batch** per sport
- **Filtro campionati attivi**
- **Gestione automatica limiti**

## 🎯 Vantaggi Sistema

### ✅ **Affidabilità**
- Dati sempre aggiornati e verificati
- Nessuna informazione falsa o obsoleta
- Quote reali da bookmaker certificati

### ✅ **Trasparenza**
- Stato API sempre visibile
- Contatori utilizzo in tempo reale
- Messaggi di errore chiari

### ✅ **Efficienza**
- Cache intelligente per ridurre richieste
- Caricamento solo campionati attivi
- Gestione automatica dei limiti

## 🚀 Utilizzo

### Avvio Sistema:
```bash
npm run dev
```

### Monitoraggio:
- Controlla il componente "Status Dati Reali" in homepage
- Verifica contatori API nel dashboard
- Monitora messaggi di errore/successo

### Risoluzione Problemi:
1. **Nessun dato**: Controlla limite API mensile
2. **Errori API**: Verifica connessione internet
3. **Campionati vuoti**: Normale se fuori stagione
4. **Cache vecchia**: Usa pulsante "Aggiorna"

---

## 📞 Supporto

Per problemi o domande sul sistema di dati reali:
1. Controlla i log della console browser
2. Verifica statistiche API nel dashboard
3. Consulta questa documentazione
4. Contatta il supporto tecnico

**🎉 Il sistema ora garantisce al 100% l'utilizzo di SOLO dati reali e verificati!** 