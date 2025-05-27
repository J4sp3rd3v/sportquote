#!/usr/bin/env node

// Script per aggiornamento giornaliero automatico
// Da eseguire tramite cron job o task scheduler alle 12:00

const { realOddsService } = require('../lib/realOddsService');
const fs = require('fs');
const path = require('path');

// File di log per tracciare gli aggiornamenti
const LOG_FILE = path.join(__dirname, '../logs/daily-updates.log');

function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Crea directory logs se non esiste
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Scrivi nel file di log
  fs.appendFileSync(LOG_FILE, logMessage);
  
  // Stampa anche in console
  console.log(`[${timestamp}] ${message}`);
}

async function dailyUpdate() {
  writeLog('🕐 AVVIO AGGIORNAMENTO GIORNALIERO AUTOMATICO');
  writeLog('============================================');
  
  try {
    // Controlla se è necessario aggiornare
    const stats = realOddsService.getServiceStats();
    
    writeLog(`📊 Stato sistema:`);
    writeLog(`• Ora corrente: ${new Date().toLocaleTimeString('it-IT')}`);
    writeLog(`• Dovrebbe aggiornare: ${stats.shouldUpdateNow ? 'SÌ' : 'NO'}`);
    writeLog(`• Aggiornato oggi: ${stats.updatedToday ? 'SÌ' : 'NO'}`);
    writeLog(`• Richieste utilizzate: ${stats.requestsUsed}/${stats.monthlyLimit}`);
    writeLog(`• Richieste rimanenti: ${stats.requestsRemaining}`);
    
    if (!stats.shouldUpdateNow) {
      writeLog('⏰ Non è necessario aggiornare ora. Aggiornamento saltato.');
      writeLog(`📅 Prossimo aggiornamento: ${stats.nextUpdateTime.toLocaleString('it-IT')}`);
      return;
    }
    
    if (stats.requestsRemaining < 10) {
      writeLog('⚠️ ATTENZIONE: Richieste API quasi esaurite. Aggiornamento saltato per sicurezza.');
      return;
    }
    
    // Esegui aggiornamento
    writeLog('🔄 Inizio aggiornamento giornaliero...');
    const startTime = Date.now();
    
    const matches = await realOddsService.getAllRealMatches(false);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Log risultati
    writeLog(`✅ Aggiornamento completato in ${duration} secondi`);
    writeLog(`📊 Partite caricate: ${matches.length}`);
    
    if (matches.length > 0) {
      writeLog('🏆 Riepilogo partite per sport:');
      const sportStats = {};
      matches.forEach(match => {
        sportStats[match.sport] = (sportStats[match.sport] || 0) + 1;
      });
      
      Object.entries(sportStats).forEach(([sport, count]) => {
        writeLog(`• ${sport}: ${count} partite`);
      });
      
      // Log alcune partite di esempio
      writeLog('📝 Esempi di partite caricate:');
      matches.slice(0, 5).forEach((match, index) => {
        writeLog(`${index + 1}. ${match.homeTeam} vs ${match.awayTeam} (${match.league})`);
      });
    }
    
    // Statistiche finali
    const finalStats = realOddsService.getServiceStats();
    const requestsUsed = finalStats.requestsUsed - stats.requestsUsed;
    
    writeLog('📊 Statistiche finali:');
    writeLog(`• Richieste utilizzate in questo aggiornamento: ${requestsUsed}`);
    writeLog(`• Totale richieste utilizzate: ${finalStats.requestsUsed}/${finalStats.monthlyLimit}`);
    writeLog(`• Richieste rimanenti: ${finalStats.requestsRemaining}`);
    writeLog(`• Prossimo aggiornamento: ${finalStats.nextUpdateTime.toLocaleString('it-IT')}`);
    
    writeLog('🎉 AGGIORNAMENTO GIORNALIERO COMPLETATO CON SUCCESSO!');
    
  } catch (error) {
    writeLog(`❌ ERRORE DURANTE L'AGGIORNAMENTO: ${error.message}`);
    
    // Log stack trace per debug
    if (error.stack) {
      writeLog(`Stack trace: ${error.stack}`);
    }
    
    // Invia notifica di errore (se configurata)
    // TODO: Implementare notifiche email/webhook per errori critici
    
    process.exit(1);
  }
}

// Funzione per pulire vecchi log (mantieni solo ultimi 30 giorni)
function cleanOldLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const stats = fs.statSync(LOG_FILE);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (stats.mtime < thirtyDaysAgo) {
        // Crea backup del log vecchio
        const backupFile = LOG_FILE.replace('.log', `-backup-${new Date().toISOString().split('T')[0]}.log`);
        fs.copyFileSync(LOG_FILE, backupFile);
        
        // Pulisci il log principale
        fs.writeFileSync(LOG_FILE, '');
        writeLog('🧹 Log file pulito e backup creato');
      }
    }
  } catch (error) {
    writeLog(`⚠️ Errore pulizia log: ${error.message}`);
  }
}

// Esegui solo se chiamato direttamente
if (require.main === module) {
  // Pulisci vecchi log prima di iniziare
  cleanOldLogs();
  
  // Esegui aggiornamento giornaliero
  dailyUpdate();
}

module.exports = { dailyUpdate }; 