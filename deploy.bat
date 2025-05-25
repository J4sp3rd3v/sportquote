@echo off
echo 🚀 SitoSport - Script di Deployment Automatico
echo ================================================

echo.
echo ✅ Passo 1: Test del build locale...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Errore nel build! Controlla gli errori sopra.
    pause
    exit /b 1
)

echo.
echo ✅ Passo 2: Aggiunta file al repository Git...
git add .

echo.
echo ✅ Passo 3: Creazione commit...
set /p commit_message="Inserisci messaggio commit (o premi Enter per default): "
if "%commit_message%"=="" set commit_message=Aggiornamento automatico

git commit -m "%commit_message%"

echo.
echo ✅ Passo 4: Push su GitHub...
git push origin main

echo.
echo 🎉 Deployment completato!
echo Il tuo sito si aggiornerà automaticamente in 2-3 minuti.
echo.
echo 📱 Controlla lo stato su:
echo - Vercel: https://vercel.com/dashboard
echo - Netlify: https://app.netlify.com/sites
echo.
pause 