#!/bin/bash

echo "🚀 MonitorQuote - Script di Deployment Automatico"
echo "================================================"

echo ""
echo "✅ Passo 1: Test del build locale..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Errore nel build! Controlla gli errori sopra."
    exit 1
fi

echo ""
echo "✅ Passo 2: Aggiunta file al repository Git..."
git add .

echo ""
echo "✅ Passo 3: Creazione commit..."
read -p "Inserisci messaggio commit (o premi Enter per default): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Aggiornamento automatico"
fi

git commit -m "$commit_message"

echo ""
echo "✅ Passo 4: Push su GitHub..."
git push origin main

echo ""
echo "🎉 Deployment completato!"
echo "Il tuo sito si aggiornerà automaticamente in 2-3 minuti."
echo ""
echo "📱 Controlla lo stato su:"
echo "- Vercel: https://vercel.com/dashboard"
echo "- Netlify: https://app.netlify.com/sites"
echo "" 