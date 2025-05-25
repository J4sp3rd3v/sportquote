# Sistema di Navigazione Bookmaker - SitoSport

## Panoramica

Il sistema di navigazione di SitoSport offre una soluzione completa per permettere agli utenti di visitare i siti di scommesse mantenendo sempre un modo semplice per tornare al nostro sito. Il sistema è progettato per funzionare anche quando i popup vengono bloccati dai browser.

## Componenti Principali

### 1. NavigationOverlay
Barra di navigazione che appare sopra il sito del bookmaker quando l'utente viene reindirizzato.

**Caratteristiche:**
- Auto-hide dopo 10 secondi (configurabile)
- Posizionamento flessibile (alto/basso)
- Supporto mobile ottimizzato
- Minimizzazione e ripristino
- Pulsanti per tornare al sito o aprire in nuova scheda

### 2. BookmakerFrame
Iframe che carica il sito del bookmaker all'interno di SitoSport.

**Caratteristiche:**
- Gestione errori per siti che bloccano iframe
- Timeout intelligente
- Fallback automatico a redirect
- Barra di navigazione integrata

### 3. BookmakerLinkHandler
Gestore intelligente dei link che prova multiple strategie per aprire i bookmaker.

**Strategia:**
1. Prova ad aprire in nuova finestra
2. Se bloccato, mostra dialog di conferma
3. Salva dati di navigazione e reindirizza

### 4. SmartBookmakerHandler
Componente che combina iframe e redirect basandosi sul bookmaker specifico.

**Logica:**
- Bookmaker compatibili → iframe
- Bookmaker che bloccano iframe → redirect con barra
- Fallback automatico in caso di errori

### 5. NavigationSettings
Pannello di impostazioni per personalizzare il comportamento della navigazione.

## Come Funziona

### Flusso Standard

1. **Utente clicca su bookmaker**
   - SmartBookmakerHandler determina il metodo migliore
   - Se iframe compatibile → apre BookmakerFrame
   - Se non compatibile → usa BookmakerLinkHandler

2. **Apertura in nuova finestra**
   - Prova window.open()
   - Se successo → fine
   - Se bloccato → continua al passo 3

3. **Dialog di conferma**
   - Mostra dialog con informazioni
   - Spiega che verrà mostrata barra di navigazione
   - Utente conferma o annulla

4. **Redirect con barra**
   - Salva dati in sessionStorage
   - Reindirizza al bookmaker
   - useNavigationOverlay rileva i dati
   - Mostra NavigationOverlay

### Persistenza Dati

I dati di navigazione vengono salvati in `sessionStorage` con questa struttura:

```json
{
  "bookmakerName": "Nome Bookmaker",
  "originalUrl": "https://sitosport.com/current-page",
  "timestamp": 1234567890,
  "matchInfo": {
    "homeTeam": "Team Casa",
    "awayTeam": "Team Trasferta", 
    "sport": "Calcio"
  }
}
```

### Rilevamento Automatico

Il sistema rileva automaticamente quando mostrare la barra:
- Al caricamento della pagina
- Quando la finestra torna in focus
- Quando cambia la visibilità della pagina
- Controllo periodico ogni 10 secondi

## Configurazione

### Bookmaker Bloccati per Iframe

Lista in `SmartBookmakerHandler`:
```typescript
const iframeBlockedBookmakers = [
  'bet365',
  'betfair', 
  'william hill',
  'ladbrokes',
  'coral',
  'paddy power'
];
```

### Preferenze Utente

Salvate in `localStorage`:
- Metodo preferito (auto/iframe/redirect)
- Delay auto-hide (5-30 secondi o mai)
- Posizione barra (alto/basso)
- Mostra su mobile
- Persistenza tra sessioni

## Utilizzo nei Componenti

### Esempio Base
```tsx
import SmartBookmakerHandler from '@/components/SmartBookmakerHandler';

<SmartBookmakerHandler
  bookmakerName="Bet365"
  matchInfo={{
    homeTeam: "Juventus",
    awayTeam: "Milan", 
    sport: "Calcio"
  }}
>
  <button>Scommetti su Bet365</button>
</SmartBookmakerHandler>
```

### Con Metodo Specifico
```tsx
<SmartBookmakerHandler
  bookmakerName="Betfair"
  preferredMethod="redirect"
  className="hover:bg-blue-50"
>
  <div>Contenuto del pulsante</div>
</SmartBookmakerHandler>
```

### Solo Redirect
```tsx
import BookmakerLinkHandler from '@/components/BookmakerLinkHandler';

<BookmakerLinkHandler
  bookmakerName="William Hill"
  bookmakerUrl="https://williamhill.com"
  matchInfo={matchInfo}
>
  <button>Vai a William Hill</button>
</BookmakerLinkHandler>
```

## Vantaggi del Sistema

### Per gli Utenti
- **Sempre un modo per tornare** - anche con popup bloccati
- **Esperienza fluida** - iframe quando possibile
- **Personalizzabile** - impostazioni per ogni preferenza
- **Mobile-friendly** - ottimizzato per dispositivi mobili

### Per il Sito
- **Riduce bounce rate** - utenti tornano facilmente
- **Migliora UX** - navigazione intuitiva
- **Compatibilità universale** - funziona con tutti i browser
- **Analytics** - tracciamento delle interazioni

### Tecnici
- **Fallback robusti** - multiple strategie
- **Performance** - caricamento ottimizzato
- **Manutenibilità** - codice modulare
- **Estensibilità** - facile aggiungere nuovi bookmaker

## Risoluzione Problemi

### Barra Non Appare
1. Controllare console per errori JavaScript
2. Verificare che sessionStorage sia abilitato
3. Controllare timestamp dei dati (scadenza 30 minuti)

### Iframe Non Carica
1. Bookmaker potrebbe bloccare iframe
2. Controllare Content Security Policy
3. Verificare URL del bookmaker

### Popup Bloccati
1. Normale comportamento del browser
2. Sistema gestisce automaticamente con dialog
3. Utente può abilitare popup per il sito

## Estensioni Future

### Possibili Miglioramenti
- **Deep linking** - link diretti alle scommesse
- **Notifiche push** - avvisi per quote migliori
- **Sincronizzazione account** - login automatico
- **Comparatore integrato** - quote in tempo reale
- **Cashback tracking** - monitoraggio guadagni

### Integrazione API
- **Odds API** - quote in tempo reale
- **Affiliate tracking** - commissioni automatiche
- **User analytics** - comportamento utenti
- **A/B testing** - ottimizzazione conversioni 