# 📋 Scripts di Aggiornamento MonitorQuote Pro

Questa directory contiene gli script per gestire gli aggiornamenti automatici del sistema MonitorQuote Pro.

## 🚀 Script Disponibili

### 1. `force-update-now.js`
**Aggiornamento immediato forzato**

```bash
# Esegui aggiornamento immediato
node scripts/force-update-now.js
```

**Caratteristiche:**
- ✅ Forza aggiornamento anche se già fatto oggi
- 📊 Mostra statistiche dettagliate prima/dopo
- 🏆 Lista tutte le partite trovate
- ⏱️ Misura durata dell'aggiornamento
- 🔢 Conta richieste API utilizzate

**Quando usarlo:**
- Test del sistema
- Aggiornamenti manuali urgenti
- Verifica funzionamento API
- Debug problemi

### 2. `daily-update.js`
**Aggiornamento giornaliero automatico**

```bash
# Esegui aggiornamento giornaliero (rispetta orari)
node scripts/daily-update.js
```

**Caratteristiche:**
- ⏰ Rispetta orario aggiornamento (12:00)
- 📅 Non aggiorna se già fatto oggi
- 📝 Log dettagliati in `logs/daily-updates.log`
- 🛡️ Controlli di sicurezza richieste API
- 🧹 Pulizia automatica log vecchi

**Quando usarlo:**
- Schedulazione automatica
- Aggiornamenti di produzione
- Monitoraggio continuo

### 3. `setup-daily-task.bat`
**Configurazione Task Scheduler Windows**

```cmd
# Esegui come Amministratore
scripts\setup-daily-task.bat
```

**Caratteristiche:**
- 🔧 Configura automaticamente Task Scheduler
- 📅 Programma esecuzione giornaliera alle 12:00
- ✅ Verifica prerequisiti (Node.js)
- 📋 Mostra informazioni task creato

## 📊 Sistema di Logging

### File di Log
- **Posizione:** `logs/daily-updates.log`
- **Formato:** `[timestamp] messaggio`
- **Rotazione:** Backup automatico dopo 30 giorni

### Esempio Log
```
[2024-01-15T12:00:01.234Z] 🕐 AVVIO AGGIORNAMENTO GIORNALIERO AUTOMATICO
[2024-01-15T12:00:01.235Z] 📊 Stato sistema:
[2024-01-15T12:00:01.236Z] • Ora corrente: 12:00:01
[2024-01-15T12:00:01.237Z] • Dovrebbe aggiornare: SÌ
[2024-01-15T12:00:01.238Z] • Richieste utilizzate: 45/500
[2024-01-15T12:00:05.123Z] ✅ Aggiornamento completato in 3.89 secondi
[2024-01-15T12:00:05.124Z] 📊 Partite caricate: 127
```

## 🔧 Configurazione Automatica

### Windows Task Scheduler

1. **Esegui setup automatico:**
   ```cmd
   # Come Amministratore
   scripts\setup-daily-task.bat
   ```

2. **Verifica task creato:**
   ```cmd
   schtasks /query /tn "MonitorQuote Daily Update"
   ```

3. **Test manuale:**
   ```cmd
   schtasks /run /tn "MonitorQuote Daily Update"
   ```

### Linux/macOS Cron

1. **Apri crontab:**
   ```bash
   crontab -e
   ```

2. **Aggiungi riga:**
   ```bash
   0 12 * * * cd /path/to/SITOSPORT && node scripts/daily-update.js
   ```

3. **Verifica cron:**
   ```bash
   crontab -l
   ```

## 📈 Monitoraggio

### Comandi Utili

```bash
# Stato attuale sistema
node -e "console.log(require('./lib/realOddsService').realOddsService.getServiceStats())"

# Visualizza ultimi log
tail -f logs/daily-updates.log

# Conta partite in cache
node -e "console.log(require('./lib/realOddsService').realOddsService.getAllRealMatches().then(m => console.log('Partite:', m.length)))"
```

### Controlli di Salute

```bash
# Test connessione API
node scripts/force-update-now.js

# Verifica task Windows
schtasks /query /tn "MonitorQuote Daily Update"

# Controlla log errori
findstr "ERRORE" logs/daily-updates.log
```

## 🚨 Risoluzione Problemi

### Errori Comuni

#### "Node.js non trovato"
```bash
# Verifica installazione
node --version
npm --version

# Se non installato, scarica da nodejs.org
```

#### "API_KEY_INVALIDA"
```javascript
// Verifica in lib/realOddsService.ts
private readonly API_KEY = 'la-tua-api-key';
```

#### "LIMITE_MENSILE_RAGGIUNTO"
```bash
# Controlla utilizzo
node -e "console.log(require('./lib/realOddsService').realOddsService.getServiceStats())"

# Reset per test (solo sviluppo)
node -e "require('./lib/realOddsService').realOddsService.resetForTesting()"
```

#### Task Scheduler non funziona
```cmd
# Verifica permessi (esegui come Admin)
schtasks /query /tn "MonitorQuote Daily Update"

# Ricrea task
schtasks /delete /tn "MonitorQuote Daily Update" /f
scripts\setup-daily-task.bat
```

## 📋 Checklist Manutenzione

### Giornaliera (Automatica)
- ✅ Aggiornamento partite alle 12:00
- ✅ Log aggiornamento
- ✅ Verifica richieste API rimanenti

### Settimanale (Manuale)
- 📊 Controllo log errori
- 📈 Verifica statistiche utilizzo API
- 🧹 Pulizia log se necessario

### Mensile (Manuale)
- 🔄 Reset contatore richieste API
- 📋 Backup log importanti
- 🔧 Aggiornamento dipendenze

## 🎯 Best Practices

1. **Sempre testare prima:**
   ```bash
   node scripts/force-update-now.js
   ```

2. **Monitorare log regolarmente:**
   ```bash
   tail -f logs/daily-updates.log
   ```

3. **Backup configurazioni:**
   - Esporta task scheduler
   - Salva file di configurazione

4. **Controllo richieste API:**
   - Monitora utilizzo mensile
   - Imposta alert a 80% utilizzo

5. **Test di disaster recovery:**
   - Simula errori API
   - Verifica fallback cache
   - Test ripristino sistema 