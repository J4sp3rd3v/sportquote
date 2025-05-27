@echo off
REM Script per configurare Task Scheduler di Windows
REM Esegue l'aggiornamento giornaliero alle 12:00

echo 🔧 CONFIGURAZIONE TASK SCHEDULER WINDOWS
echo =======================================

REM Ottieni il percorso corrente
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..
set DAILY_SCRIPT=%PROJECT_DIR%\scripts\daily-update.js

echo 📁 Directory progetto: %PROJECT_DIR%
echo 📄 Script aggiornamento: %DAILY_SCRIPT%

REM Verifica che Node.js sia installato
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRORE: Node.js non trovato. Installare Node.js prima di continuare.
    pause
    exit /b 1
)

echo ✅ Node.js trovato: 
node --version

REM Verifica che lo script esista
if not exist "%DAILY_SCRIPT%" (
    echo ❌ ERRORE: Script daily-update.js non trovato in %DAILY_SCRIPT%
    pause
    exit /b 1
)

echo ✅ Script aggiornamento trovato

REM Crea il task schedulato
echo 🔄 Creazione task schedulato...

schtasks /create ^
    /tn "MonitorQuote Daily Update" ^
    /tr "node \"%DAILY_SCRIPT%\"" ^
    /sc daily ^
    /st 12:00 ^
    /sd %date% ^
    /f ^
    /rl highest

if errorlevel 1 (
    echo ❌ ERRORE: Impossibile creare il task schedulato
    echo 💡 Suggerimento: Eseguire come Amministratore
    pause
    exit /b 1
)

echo ✅ Task schedulato creato con successo!
echo 📅 Il sistema si aggiornerà automaticamente ogni giorno alle 12:00

REM Mostra informazioni sul task
echo.
echo 📋 INFORMAZIONI TASK:
schtasks /query /tn "MonitorQuote Daily Update" /fo list

echo.
echo 🎉 CONFIGURAZIONE COMPLETATA!
echo.
echo 💡 COMANDI UTILI:
echo • Visualizza task: schtasks /query /tn "MonitorQuote Daily Update"
echo • Esegui ora: schtasks /run /tn "MonitorQuote Daily Update"
echo • Elimina task: schtasks /delete /tn "MonitorQuote Daily Update" /f
echo • Test manuale: node "%DAILY_SCRIPT%"
echo.

pause 