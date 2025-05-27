# 🧪 ISTRUZIONI TEST CACHE SISTEMA

## 🔍 **COME TESTARE IL SISTEMA CACHE**

### **1. 📦 Popolare la Cache**
```bash
# Esegui aggiornamento per popolare cache
npm run update-odds
```

### **2. 🌐 Aprire il Browser**
1. Avvia il server: `npm run dev`
2. Apri il browser su `http://localhost:3000`
3. **Apri Developer Tools (F12)**
4. **Vai alla tab Console**

### **3. 🔍 Verificare i Log**
Dovresti vedere questi log nella console:

```
🚀 Inizializzazione hook useDailyOdds...
🔍 getCachedMatchesOnly: cache.size=X, window=true
🔄 Tentativo caricamento cache dal localStorage...
📦 localStorage check: cache=true, lastUpdate=true
✅ Cache caricata dal localStorage: X elementi
📅 Ultimo aggiornamento: [data/ora]
📦 Caricamento dalla cache: 58 partite disponibili
✅ 58 partite caricate dalla cache all'avvio
```

### **4. ✅ Test Positivo**
Se vedi **58 partite caricate dalla cache all'avvio**, il sistema funziona!

### **5. ❌ Test Negativo**
Se vedi **0 partite disponibili**, significa che:
- La cache non è stata salvata correttamente
- Il localStorage è vuoto
- C'è un errore nel caricamento

### **6. 🔧 Debug localStorage**
Nella console del browser, esegui:
```javascript
// Verifica se la cache è nel localStorage
console.log('Cache:', localStorage.getItem('realOddsCache'));
console.log('LastUpdate:', localStorage.getItem('realOddsLastUpdate'));
```

### **7. 🧹 Pulire Cache (se necessario)**
```javascript
// Pulisci localStorage per test
localStorage.removeItem('realOddsCache');
localStorage.removeItem('realOddsLastUpdate');
```

## 🎯 **COMPORTAMENTO ATTESO**

### **✅ Scenario Corretto:**
1. **Primo caricamento:** Quote visibili immediatamente dalla cache
2. **Refresh pagina:** Quote ancora visibili immediatamente
3. **Riavvio server:** Quote ancora disponibili dalla cache localStorage

### **❌ Scenario Problematico:**
1. **Primo caricamento:** Nessuna quota visibile
2. **Necessario click "Aggiorna Ora":** Per vedere le quote
3. **Refresh pagina:** Quote spariscono di nuovo

## 🔧 **RISOLUZIONE PROBLEMI**

### **Se la cache non funziona:**
1. **Verifica localStorage:** Usa Developer Tools → Application → Local Storage
2. **Controlla console:** Cerca errori JavaScript
3. **Forza aggiornamento:** `npm run update-odds`
4. **Riavvia browser:** Chiudi e riapri completamente

### **Se localStorage è vuoto:**
1. **Esegui aggiornamento:** `npm run update-odds`
2. **Verifica log:** Cerca "💾 Cache salvata nel localStorage"
3. **Controlla permessi:** Alcuni browser bloccano localStorage

## 📋 **CHECKLIST TEST**

- [ ] Eseguito `npm run update-odds`
- [ ] Avviato `npm run dev`
- [ ] Aperto browser su localhost:3000
- [ ] Aperto Developer Tools (F12)
- [ ] Verificato log console
- [ ] Visto "58 partite caricate dalla cache all'avvio"
- [ ] Quote visibili immediatamente senza click
- [ ] Refresh pagina → Quote ancora visibili
- [ ] Riavvio server → Quote ancora disponibili

**Se tutti i punti sono ✅, il sistema funziona perfettamente!** 