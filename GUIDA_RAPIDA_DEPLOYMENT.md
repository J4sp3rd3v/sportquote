# 🚀 GUIDA RAPIDA: Metti Online SitoSport in 5 Minuti

## ✅ **METODO PIÙ SEMPLICE: Vercel**

### **PASSO 1: Crea Account GitHub**
1. Vai su **https://github.com**
2. Clicca **"Sign up"**
3. Inserisci email, password, username
4. Verifica email

### **PASSO 2: Carica il Progetto**
1. Su GitHub clicca **"New repository"**
2. Nome repository: **"sitosport"**
3. Clicca **"Create repository"**
4. **COPIA** il link che appare (es: `https://github.com/tuousername/sitosport.git`)

### **PASSO 3: Collega il Progetto**
Nel terminale del tuo progetto (dove hai SitoSport):
```bash
git remote add origin https://github.com/TUOUSERNAME/sitosport.git
git branch -M main
git push -u origin main
```
*(Sostituisci TUOUSERNAME con il tuo username GitHub)*

### **PASSO 4: Deploy con Vercel**
1. Vai su **https://vercel.com**
2. Clicca **"Continue with GitHub"**
3. Autorizza Vercel
4. Clicca **"New Project"**
5. Seleziona **"sitosport"** dalla lista
6. Clicca **"Deploy"**
7. **ASPETTA 2-3 MINUTI** ⏳

### **PASSO 5: Il Tuo Sito è Online! 🎉**
- Vercel ti darà un link tipo: `https://sitosport-abc123.vercel.app`
- **COPIA** questo link e condividilo!

---

## 🔧 **CONFIGURAZIONE OPZIONALE**

### **Per Quote Reali (Opzionale):**
1. In Vercel vai su **Settings > Environment Variables**
2. Aggiungi:
   - **Name:** `ODDS_API_KEY`
   - **Value:** `9640f946c5bb763f61fd8105717aad6b`
3. Clicca **"Save"**
4. Vai su **Deployments** e clicca **"Redeploy"**

### **Dominio Personalizzato (Opzionale):**
1. In Vercel vai su **Settings > Domains**
2. Aggiungi il tuo dominio (es: `miosito.com`)
3. Segui le istruzioni DNS

---

## 🆘 **PROBLEMI COMUNI**

### **"Repository not found"**
- Verifica che il repository sia pubblico su GitHub
- Controlla di aver fatto il push: `git push origin main`

### **"Build failed"**
- Testa localmente: `npm run build`
- Se funziona localmente, riprova il deploy

### **"API not working"**
- Aggiungi la variabile d'ambiente `ODDS_API_KEY` in Vercel
- Redeploy il progetto

---

## 🔄 **AGGIORNARE IL SITO**

Quando modifichi il codice:
```bash
git add .
git commit -m "Aggiornamento"
git push
```
Il sito si aggiorna automaticamente in 2-3 minuti!

---

## 📱 **ALTERNATIVE VELOCI**

### **Netlify (Alternativa):**
1. Vai su **https://netlify.com**
2. **"New site from Git"**
3. Seleziona GitHub e il tuo repository
4. Deploy automatico

### **Railway (Per progetti più complessi):**
1. Vai su **https://railway.app**
2. **"Deploy from GitHub repo"**
3. Seleziona il repository
4. Deploy automatico

---

## ✨ **RISULTATO FINALE**

Il tuo sito sarà:
- ✅ **Online 24/7**
- ✅ **SSL gratuito** (https://)
- ✅ **Veloce** (CDN globale)
- ✅ **Aggiornamenti automatici**
- ✅ **100% gratuito**

**Link esempio:** `https://sitosport-tuousername.vercel.app`

---

## 🎯 **PROSSIMI PASSI**

1. **Condividi** il link con amici
2. **Monitora** le visite con Vercel Analytics
3. **Personalizza** con il tuo dominio
4. **Aggiungi** Google Analytics per statistiche dettagliate

**🎉 Congratulazioni! Il tuo sito è online!** 