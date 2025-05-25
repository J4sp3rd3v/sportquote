# Guida Sistema API Ottimizzato - SitoSport

## 🚀 Panoramica

Il sistema API ottimizzato gestisce intelligentemente le **500 richieste mensili** per garantire un servizio sempre aggiornato senza sprecare le chiamate API.

### 📊 Stato Attuale
- **Chiave Attiva**: 10/500 usate (490 rimanenti) ✅
- **Utilizzo**: 2% - Situazione ottimale 🟢

## 🔧 Funzionalità Principali

### 1. Gestione Chiave API Ottimizzata
```javascript
const API_KEYS = [
  'f9fddbc4c5be58bd8e9e13ad9c91a3cc'  // Chiave attiva (490 richieste rimanenti)
];
```

### 2. Sistema di Cache Intelligente
- **Quote**: Cache 30 minuti
- **Sport**: Cache 24 ore  
- **Status**: Cache 5 minuti
- **Pulizia automatica** cache scaduta

### 3. Aggiornamenti Programmati per Priorità

#### 🔴 Alta Priorità (ogni 30 min)
- Serie A italiana
- Premier League inglese
- Champions League

#### 🟡 Media Priorità (ogni 60 min)
- La Liga spagnola
- Bundesliga tedesca
- Ligue 1 francese
- NBA basket
- ATP tennis

#### 🟢 Bassa Priorità (ogni 120 min)
- EuroLeague basket
- WTA tennis
- NFL football americano
- NHL hockey

### 4. Modalità Emergenza
Attivata automaticamente quando rimanenti < 50 richieste:
- Solo sport ad alta priorità (Serie A)
- Aggiornamenti ogni 180 minuti
- Cache estesa per massimizzare efficienza

## 📈 Strategia di Ottimizzazione

### Distribuzione Richieste Mensili
```
Serie A (priorità massima):     ~150 richieste/mese
Altri sport principali:         ~200 richieste/mese  
Sport secondari:                ~100 richieste/mese
Buffer emergenza:               ~50 richieste/mese
TOTALE:                         500 richieste/mese per chiave
```

### Calcolo Efficienza
- **30 giorni/mese** × **24 ore/giorno** = 720 ore
- **Serie A**: 720h ÷ 0.5h = 1440 aggiornamenti teorici
- **Ottimizzato**: ~150 aggiornamenti mirati = **90% risparmio**

## 🛠️ Utilizzo del Sistema

### Hook Ottimizzato
```javascript
import { useOptimizedOdds } from '@/hooks/useOptimizedOdds';

const {
  matches,           // Partite caricate
  loading,           // Stato caricamento
  error,             // Errori eventuali
  useRealData,       // Modalità API reale/mock
  apiStats,          // Statistiche utilizzo
  toggleDataSource,  // Cambia sorgente dati
  forceRefresh,      // Aggiornamento forzato
  refreshSport       // Aggiorna sport specifico
} = useOptimizedOdds();
```

### Servizio API
```javascript
import { optimizedOddsApi } from '@/lib/optimizedOddsApi';

// Aggiornamento automatico programmato
const events = await optimizedOddsApi.getMultipleSportsOptimized();

// Aggiornamento sport specifico
const serieA = await optimizedOddsApi.forceUpdateSport('soccer_italy_serie_a');

// Statistiche dettagliate
const stats = optimizedOddsApi.getDetailedStats();

// Pulizia cache
optimizedOddsApi.cleanExpiredCache();
```

## 📊 Monitoraggio e Statistiche

### Componente Statistiche
```jsx
import OptimizedApiStats from '@/components/OptimizedApiStats';

<OptimizedApiStats className="mb-4" />
```

### Informazioni Visualizzate
- **Utilizzo totale** con barra di progresso colorata
- **Dettaglio per chiave** con stato individuale
- **Cache attiva** con numero elementi
- **Stato API** in tempo reale
- **Ultimi aggiornamenti** per sport
- **Modalità emergenza** se attivata

## 🧪 Test e Diagnostica

### Script di Test Completo
```bash
node scripts/test-optimized-api.js
```

**Output esempio:**
```
🔑 Chiavi funzionanti: 1/1
📊 Richieste totali: 25/500 usate  
⚡ Richieste rimanenti: 475
📈 Utilizzo: 5%
🟢 Situazione ottimale
```

### Test Singola Chiave
```bash
node scripts/simple-api-test.js
```

## ⚙️ Configurazione Avanzata

### Modifica Intervalli Aggiornamento
```javascript
// In lib/optimizedOddsApi.ts
const OPTIMIZATION_CONFIG = {
  UPDATE_INTERVALS: {
    HIGH_PRIORITY: 30,    // Serie A (minuti)
    MEDIUM_PRIORITY: 60,  // Altri principali
    LOW_PRIORITY: 120,    // Sport secondari  
    EMERGENCY: 180        // Modalità risparmio
  }
};
```

### Modifica Priorità Sport
```javascript
const SPORT_PRIORITIES = {
  HIGH: [
    'soccer_italy_serie_a',      // Aggiungi/rimuovi sport
    'soccer_epl',
    'soccer_uefa_champs_league'
  ]
  // ...
};
```

### Soglie Modalità Emergenza
```javascript
const OPTIMIZATION_CONFIG = {
  WARNING_THRESHOLD: 400,   // 80% utilizzo
  CRITICAL_THRESHOLD: 450,  // 90% utilizzo
  // Emergenza: < 100 richieste rimanenti totali
};
```

## 🔄 Gestione Automatica

### Fallback Intelligente
1. **API disponibile** → Usa quote reali ottimizzate
2. **Limite raggiunto** → Passa automaticamente ai dati mock
3. **Errore rete** → Fallback ai dati simulati
4. **Reset mensile** → Riprende automaticamente API reale

### Persistenza Dati
- **localStorage**: Statistiche utilizzo per mese corrente
- **sessionStorage**: Dati navigazione bookmaker
- **Cache memoria**: Quote e sport per sessione corrente

## 📅 Pianificazione Mensile

### Reset Automatico
- **1° del mese**: Contatori azzerati automaticamente
- **Verifica mese**: Controllo automatico validità statistiche
- **Backup dati**: Salvataggio automatico stato precedente

### Strategia Utilizzo
- **Settimana 1-2**: Aggiornamenti frequenti (30-60 min)
- **Settimana 3**: Aggiornamenti moderati (60-120 min)  
- **Settimana 4**: Modalità risparmio se necessario (180 min)

## 🚨 Gestione Emergenze

### Quando si Attiva
- Rimanenti < 50 richieste
- Utilizzo > 90% del limite mensile (450+ richieste usate)
- Meno di 5 giorni alla fine del mese

### Comportamento Emergenza
- ⏸️ **Stop aggiornamenti automatici** sport secondari
- 🎯 **Solo Serie A** e sport critici
- ⏰ **Intervalli estesi** (180 minuti)
- 💾 **Cache estesa** per ridurre richieste

### Azioni Manuali
```javascript
// Forza aggiornamento critico
await optimizedOddsApi.forceUpdateSport('soccer_italy_serie_a');

// Pulisci cache per liberare memoria
optimizedOddsApi.cleanExpiredCache();

// Controlla stato dettagliato
const stats = optimizedOddsApi.getDetailedStats();
```

## 📈 Metriche di Successo

### Obiettivi Raggiunti
- ✅ **500 richieste/mese** ottimizzate
- ✅ **Gestione intelligente** chiave API
- ✅ **Cache intelligente** (90% hit rate stimato)
- ✅ **Aggiornamenti mirati** per priorità
- ✅ **Fallback automatico** senza interruzioni
- ✅ **Monitoraggio real-time** utilizzo

### Benefici Ottenuti
- 🚀 **Utilizzo ottimizzato** delle richieste disponibili
- ⚡ **Prestazioni migliori** con cache
- 🎯 **Aggiornamenti intelligenti** per sport prioritari
- 🛡️ **Resilienza** con fallback automatici
- 📊 **Visibilità completa** stato sistema

---

## 🔧 Manutenzione

### Controlli Periodici
- **Settimanale**: Verifica statistiche utilizzo
- **Mensile**: Controllo reset contatori
- **Trimestrale**: Revisione priorità sport

### Aggiornamenti Futuri
- Aggiunta nuove chiavi API se disponibili
- Ottimizzazione algoritmi cache
- Espansione sport supportati
- Miglioramento predizioni utilizzo

**Data Creazione**: Dicembre 2024  
**Versione**: 1.0  
**Status**: ✅ Attivo e Ottimizzato 