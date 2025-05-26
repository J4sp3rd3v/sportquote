# Sistema di Aggiornamento Automatico

## Panoramica
Il sistema di aggiornamento automatico è stato implementato per gestire l'aggiornamento dei dati delle quote sportive ogni 30 minuti, utilizzando The Odds API con la nuova chiave fornita.

## Caratteristiche Principali

### 🔄 Aggiornamento Automatico
- **Intervallo**: Ogni 30 minuti
- **Avvio automatico**: Il sistema si avvia automaticamente al caricamento dell'app
- **Gestione intelligente**: Ferma automaticamente gli aggiornamenti se il limite API è quasi raggiunto (95%)

### 📊 Monitoraggio API
- **Conteggio richieste**: Tracciamento in tempo reale delle richieste API utilizzate
- **Limite giornaliero**: 500 richieste per The Odds API
- **Visualizzazione**: Barra di progresso colorata nell'header
- **Percentuale utilizzo**: Calcolo automatico della percentuale di utilizzo

### 🚫 Limitazioni Utente
- **Aggiornamenti manuali limitati**: Disponibili solo se l'utilizzo API è sotto il 90%
- **Messaggio informativo**: L'utente viene informato sui limiti e sulla necessità di upgrade per aggiornamenti in tempo reale
- **Protezione automatica**: Il sistema impedisce aggiornamenti manuali quando il limite è vicino

## Componenti Implementati

### 1. AutoUpdateService (`lib/autoUpdateService.ts`)
Servizio singleton che gestisce:
- Aggiornamenti automatici programmati
- Conteggio richieste API
- Sistema di notifiche per subscribers
- Controllo limiti e protezioni

### 2. Hook useAutoUpdate (`hooks/useAutoUpdate.ts`)
Hook React per:
- Gestione stato aggiornamenti
- Interfaccia per controlli utente
- Aggiornamento statistiche in tempo reale
- Countdown al prossimo aggiornamento

### 3. AutoUpdatePanel (`components/AutoUpdatePanel.tsx`)
Pannello di controllo per:
- Visualizzazione stato sistema
- Statistiche utilizzo API
- Controlli start/stop (limitati)
- Informazioni temporali

### 4. Header aggiornato (`components/Header.tsx`)
Mostra:
- Contatore API in tempo reale
- Barra di progresso colorata
- Countdown prossimo aggiornamento
- Accesso al pannello di controllo

## API Utilizzata

### The Odds API
- **Chiave**: `e8d4b5e534a34c76916de8016efa690d`
- **Endpoint base**: `https://api.the-odds-api.com/v4`
- **Autenticazione**: Query parameter `apiKey`
- **Limite**: 500 richieste/giorno

### Sport Monitorati
1. **Calcio** (priorità alta):
   - Serie A Italia
   - Premier League
   - La Liga
   - Bundesliga
   - Ligue 1
   - Champions League

2. **Tennis**:
   - ATP/WTA French Open
   - Altri tornei principali

3. **Basket**:
   - NBA
   - EuroLeague

## Flusso di Aggiornamento

1. **Avvio automatico** al caricamento dell'app
2. **Prima esecuzione** immediata
3. **Aggiornamenti programmati** ogni 30 minuti
4. **Recupero dati** da sport multipli
5. **Conversione formato** per l'app
6. **Notifica subscribers** con nuovi dati
7. **Aggiornamento statistiche** utilizzo API

## Protezioni Implementate

### Limite API
- Monitoraggio continuo utilizzo
- Stop automatico al 95% di utilizzo
- Blocco aggiornamenti manuali al 90%

### Rate Limiting
- Pausa 200ms tra richieste multiple
- Gestione errori API
- Retry logic per errori temporanei

### Gestione Errori
- Log dettagliati per debugging
- Fallback graceful in caso di errori
- Notifiche utente appropriate

## Messaggi Utente

### Utilizzo < 50%
"Sistema di aggiornamento attivo. Dati aggiornati automaticamente ogni 30 minuti."

### Utilizzo 50-80%
"Utilizzo API moderato. Aggiornamenti automatici ogni 30 minuti per ottimizzare le richieste."

### Utilizzo 80-95%
"Limite API in avvicinamento. Solo aggiornamenti automatici programmati."

### Utilizzo > 95%
"Limite API raggiunto. Per aggiornamenti in tempo reale, considera l'upgrade del piano."

## Controlli Disponibili

### Per Utenti Normali
- **Visualizzazione stato**: Sempre disponibile
- **Aggiornamenti manuali**: Solo se utilizzo API < 90%
- **Informazioni temporali**: Countdown prossimo aggiornamento

### Per Admin/Debug
- **Start/Stop sistema**: Controllo completo
- **Aggiornamento forzato**: Con protezioni
- **Modifica intervalli**: Minimo 15 minuti
- **Statistiche dettagliate**: Accesso completo

## Test e Verifica

### Script di Test
`scripts/test-auto-update.js` verifica:
- Connessione API
- Recupero dati multipli
- Monitoraggio utilizzo
- Gestione rate limiting

### Risultati Test
```
✅ API attiva! Trovati 65 sport disponibili
✅ Aggiornamento completato: 1 partite totali, 3 richieste API
✅ Richieste rimanenti: 499
✅ Utilizzo: 0.2%
```

## Vantaggi del Sistema

1. **Efficienza**: Aggiornamenti programmati ottimizzano l'uso delle richieste API
2. **Trasparenza**: L'utente vede sempre l'utilizzo API corrente
3. **Protezione**: Impossibile superare i limiti API
4. **Scalabilità**: Sistema pronto per upgrade a piani premium
5. **UX**: Informazioni chiare sui limiti e upgrade necessari

## Upgrade Premium

Per aggiornamenti più frequenti o in tempo reale, il sistema è predisposto per:
- Piani API con limiti superiori
- Aggiornamenti ogni 5-10 minuti
- Aggiornamenti manuali illimitati
- Notifiche push per eventi importanti

## Monitoraggio e Manutenzione

### Metriche da Monitorare
- Utilizzo API giornaliero
- Successo/fallimento aggiornamenti
- Tempo di risposta API
- Numero eventi recuperati

### Manutenzione Periodica
- Verifica chiavi API
- Aggiornamento mappature sport
- Ottimizzazione intervalli
- Pulizia log e cache

## Conclusioni

Il sistema di aggiornamento automatico fornisce:
- **Dati sempre aggiornati** senza intervento utente
- **Gestione intelligente** delle risorse API
- **Esperienza utente ottimale** con informazioni trasparenti
- **Scalabilità** per futuri upgrade
- **Protezione** da superamento limiti

Il sistema è completamente operativo e pronto per l'uso in produzione. 