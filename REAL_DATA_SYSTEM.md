# 🎯 MonitorQuote Pro - Sistema Professionale Quote Sportive

## 📋 Panoramica

**MonitorQuote Pro** è una piattaforma professionale completamente riorganizzata per l'analisi avanzata delle quote sportive, arbitraggio automatico e strategie di betting professionali. Il sistema utilizza **esclusivamente dati reali** da campionati attivi con **aggiornamento giornaliero automatico alle 12:00**.

## ✅ Caratteristiche Principali

### 🎯 **Piattaforma Professionale Completa**
- 📊 **Dashboard Avanzata** - Panoramica completa con statistiche in tempo reale
- 🔍 **Analisi Professionale** - Strumenti avanzati per identificare opportunità
- ⚡ **Arbitraggio Automatico** - Rilevamento automatico profitti garantiti
- 📚 **Strategie Avanzate** - Guide complete per value betting e gestione bankroll
- 🏆 **Solo Dati Reali** - Campionati attivi verificati con aggiornamento giornaliero
- ⏰ **Aggiornamento Automatico** - Una sola richiesta API al giorno alle 12:00

### 🏆 **Campionati Supportati (Solo con Partite Reali)**
Il sistema carica automaticamente partite SOLO da sport verificati:
- **Calcio**: Ligue 1, Champions League
- **Basket**: NBA  
- **Football Americano**: NFL
- **Hockey**: NHL
- **MMA**: UFC/Mixed Martial Arts

⚠️ **NOTA**: Altri campionati (Premier League, La Liga, Bundesliga, Serie A, Tennis) non sono attualmente disponibili nell'API o non hanno partite future.

### 📊 **Sistema Aggiornamento Giornaliero Ottimizzato**
- **Orario Fisso**: Aggiornamento automatico alle 12:00 ogni giorno
- **Cache 24 ore**: Dati validi per tutta la giornata
- **Una Richiesta**: Massimo 1 richiesta API al giorno (vs 6 precedenti)
- **Limite Mensile**: 500 richieste/mese (piano gratuito)
- **Utilizzo Ottimale**: ~30 richieste/mese invece di 180
- **Condivisione Globale**: Stessi dati per tutti gli utenti

## 🛠️ Componenti Principali

### 1. `RealOddsService` (`lib/realOddsService.ts`) - AGGIORNATO
Servizio principale per gestire le API reali con aggiornamento giornaliero:
```typescript
// Carica partite con controllo giornaliero automatico
const matches = await realOddsService.getAllRealMatches();

// Aggiornamento forzato (solo se necessario)
const matches = await realOddsService.forceUpdate();

// Statistiche utilizzo API con info giornaliere
const stats = realOddsService.getServiceStats();
```

**Nuove Funzionalità:**
- ✅ Controllo automatico se aggiornamento necessario
- ✅ Cache intelligente 24 ore
- ✅ Aggiornamento solo dopo le 12:00
- ✅ Prevenzione aggiornamenti multipli
- ✅ Statistiche dettagliate utilizzo API

### 2. `useDailyOdds` (`hooks/useDailyOdds.ts`) - AGGIORNATO
Hook React per utilizzare il sistema giornaliero:
```typescript
const {
  matches,           // Solo partite reali
  hasRealData,       // True se ci sono dati reali
  isLoading,         // Stato caricamento
  error,             // Errori API
  stats: {
    requestsUsed,    // Richieste API utilizzate
    requestsRemaining, // Richieste rimanenti
    updatedToday     // Se aggiornato oggi
  },
  forceUpdate        // Aggiornamento manuale
} = useDailyOdds();
```

### 3. `DailyUpdateStatus` (`components/DailyUpdateStatus.tsx`) - AGGIORNATO
Componente UI per monitorare il sistema giornaliero:
- 📊 Utilizzo API mensile con barra progresso
- 🔄 Stato aggiornamento giornaliero
- ⏰ Countdown prossimo aggiornamento
- ⚠️ Avvisi limite API
- ✅ Conferma aggiornamento odierno

## 🚨 Gestione Errori e Limiti

### Messaggi di Errore Specifici:
- **🚫 Limite mensile raggiunto**: 500 richieste esaurite
- **🔑 API Key invalida**: Problema configurazione
- **⏰ Rate limit superato**: Troppe richieste rapide
- **📅 Nessuna partita disponibile**: Campionati in pausa
- **🏆 Nessun campionato attivo**: Sport fuori stagione

### Comportamento Aggiornamento Giornaliero:
- ✅ **Prima delle 12:00**: Usa cache del giorno precedente
- ✅ **Dopo le 12:00**: Aggiornamento automatico se non già fatto
- ✅ **Già aggiornato**: Usa cache fino al giorno successivo
- ❌ **Limite raggiunto**: Blocca aggiornamenti manuali

## 📈 Monitoraggio Sistema

### Dashboard Tempo Reale:
- **Richieste Usate**: X/500 mensili con barra progresso
- **Aggiornato Oggi**: ✓/✗ indicatore visivo
- **Cache Attiva**: Ore rimanenti validità
- **Prossimo Aggiornamento**: Countdown preciso
- **Stato API**: Operativa/Limite raggiunto

### Indicatori Visivi:
- 🟢 **Verde**: Aggiornato oggi con dati
- 🟡 **Giallo**: In attesa aggiornamento o limite vicino
- 🔴 **Rosso**: Errore o limite raggiunto
- 🔵 **Blu**: Aggiornamento in corso

## 🔧 Configurazione

### API Key Integrata:
```typescript
// API Key già configurata nel servizio
private readonly API_KEY = '795ce1cc44a461d5918138561b1134bc';
```

**Non è necessario configurare variabili d'ambiente** - La chiave è già integrata nel sistema.

## 📊 Statistiche Utilizzo Ottimizzate

### Piano Gratuito Ottimizzato:
- **500 richieste/mese** (invariato)
- **1 aggiornamento/giorno** (vs 6 precedenti)
- **~30 richieste/mese** (vs 180 precedenti)
- **Efficienza 6x superiore**

### Vantaggi Nuovo Sistema:
- **🔋 Risparmio API**: 83% richieste in meno
- **⚡ Performance**: Cache 24h per velocità
- **🎯 Affidabilità**: Aggiornamento garantito giornaliero
- **👥 Condivisione**: Dati globali per tutti gli utenti

## 🎯 Vantaggi Sistema Aggiornato

### ✅ **Efficienza Massima**
- Una sola richiesta API al giorno
- Cache intelligente 24 ore
- Utilizzo ottimale del limite mensile
- Prevenzione sprechi di richieste

### ✅ **Affidabilità Garantita**
- Aggiornamento automatico alle 12:00
- Dati sempre freschi quando disponibili
- Gestione automatica errori e limiti
- Backup cache in caso di problemi

### ✅ **Trasparenza Totale**
- Monitoraggio utilizzo API in tempo reale
- Stato aggiornamento sempre visibile
- Avvisi proattivi limite API
- Statistiche dettagliate

## 🚀 Utilizzo

### Avvio Sistema:
```bash
npm run dev
```

### Comportamento Automatico:
- **Primo accesso**: Carica dati dalla cache se disponibili
- **Dopo le 12:00**: Aggiornamento automatico se necessario
- **Aggiornamento manuale**: Solo se limite API non raggiunto
- **Monitoraggio**: Dashboard sempre aggiornata

### Ottimizzazioni Implementate:
1. **Cache Intelligente**: 24 ore di validità
2. **Controllo Orario**: Aggiornamento solo dopo le 12:00
3. **Prevenzione Duplicati**: Un solo aggiornamento al giorno
4. **Gestione Limiti**: Blocco automatico se limite raggiunto
5. **Condivisione Globale**: Stessi dati per tutti

---

## 📞 Supporto

Per problemi o domande sul sistema di aggiornamento giornaliero:
1. Controlla il dashboard "Sistema Aggiornamento Giornaliero"
2. Verifica utilizzo API mensile
3. Consulta countdown prossimo aggiornamento
4. Evita aggiornamenti manuali non necessari

**🎉 Il sistema ora garantisce massima efficienza con aggiornamento giornaliero automatico!** 