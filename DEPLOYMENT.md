# 🚀 Guida al Deployment di SitoSport

## Opzioni di Hosting Gratuito

### 1. 🌟 Vercel (Raccomandato)

**Vantaggi:**
- ✅ Ottimizzato per Next.js
- ✅ Deploy automatico da GitHub
- ✅ SSL gratuito
- ✅ CDN globale
- ✅ 100GB bandwidth/mese
- ✅ Dominio personalizzato gratuito

**Passi per il deployment:**

1. **Crea account su GitHub** (se non ce l'hai):
   - Vai su https://github.com
   - Registrati gratuitamente

2. **Carica il progetto su GitHub:**
   ```bash
   # Nel terminale del progetto
   git remote add origin https://github.com/TUO_USERNAME/sitosport.git
   git branch -M main
   git push -u origin main
   ```

3. **Crea account Vercel:**
   - Vai su https://vercel.com
   - Registrati con GitHub

4. **Deploy il progetto:**
   - Clicca "New Project"
   - Seleziona il repository "sitosport"
   - Clicca "Deploy"
   - Attendi 2-3 minuti

5. **Il tuo sito sarà live su:**
   `https://sitosport-TUO_USERNAME.vercel.app`

---

### 2. 🔥 Netlify

**Vantaggi:**
- ✅ Deploy da GitHub
- ✅ SSL gratuito
- ✅ 100GB bandwidth/mese
- ✅ Funzioni serverless

**Passi per il deployment:**

1. **Carica su GitHub** (come sopra)

2. **Crea account Netlify:**
   - Vai su https://netlify.com
   - Registrati con GitHub

3. **Deploy:**
   - Clicca "New site from Git"
   - Seleziona GitHub
   - Scegli il repository "sitosport"
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Clicca "Deploy site"

---

### 3. 🌐 GitHub Pages (Solo per siti statici)

**Limitazioni:** Non supporta API server-side

**Passi:**
1. Carica su GitHub
2. Vai su Settings > Pages
3. Seleziona source: GitHub Actions
4. Il sito sarà su: `https://TUO_USERNAME.github.io/sitosport`

---

## 🔧 Configurazioni Aggiuntive

### Variabili d'Ambiente

Se usi quote reali, aggiungi in Vercel/Netlify:
```
ODDS_API_KEY=9640f946c5bb763f61fd8105717aad6b
NODE_ENV=production
```

### Dominio Personalizzato

1. **Vercel:**
   - Dashboard > Settings > Domains
   - Aggiungi il tuo dominio
   - Configura DNS

2. **Netlify:**
   - Site settings > Domain management
   - Add custom domain

---

## 📱 Test del Deployment

Dopo il deployment, verifica:
- ✅ Homepage carica correttamente
- ✅ Filtri funzionano
- ✅ Quote si visualizzano
- ✅ Responsive design
- ✅ API quote reali (se attivate)

---

## 🆘 Risoluzione Problemi

### Build Errors
```bash
# Testa localmente
npm run build
npm start
```

### Errori API
- Verifica chiave API nelle variabili d'ambiente
- Controlla limiti di utilizzo

### Performance
- Vercel: Automaticamente ottimizzato
- Netlify: Abilita "Asset optimization"

---

## 📊 Monitoraggio

### Analytics Gratuiti
- **Vercel Analytics:** Incluso nel piano gratuito
- **Google Analytics:** Aggiungi il tracking code
- **Netlify Analytics:** $9/mese (opzionale)

### Uptime Monitoring
- **UptimeRobot:** Gratuito per 50 monitor
- **Pingdom:** Piano gratuito limitato

---

## 🔄 Aggiornamenti Automatici

Una volta configurato:
1. Modifica il codice localmente
2. `git add .`
3. `git commit -m "Aggiornamento"`
4. `git push`
5. Il sito si aggiorna automaticamente in 2-3 minuti

---

## 💡 Suggerimenti

- **Usa Vercel** per la migliore esperienza con Next.js
- **Configura un dominio personalizzato** per professionalità
- **Abilita analytics** per monitorare il traffico
- **Testa sempre** prima di fare push in produzione 