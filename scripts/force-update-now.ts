#!/usr/bin/env node

// Script per forzare aggiornamento immediato del sistema
// Utilizzato per test e aggiornamenti manuali

import { realOddsService } from '../lib/realOddsService';

async function forceUpdateNow() {
  console.log('🚀 AVVIO AGGIORNAMENTO FORZATO IMMEDIATO');
  console.log('=====================================');
  
  try {
    // Mostra statistiche prima dell'aggiornamento
    const statsBefore = realOddsService.getServiceStats();
    console.log('\n📊 STATISTICHE PRIMA DELL\'AGGIORNAMENTO:');
    console.log(`• Richieste utilizzate: ${statsBefore.requestsUsed}/${statsBefore.monthlyLimit}`);
    console.log(`• Richieste rimanenti: ${statsBefore.requestsRemaining}`);
    console.log(`• Aggiornato oggi: ${statsBefore.updatedToday ? 'SÌ' : 'NO'}`);
    console.log(`• Ultimo aggiornamento: ${statsBefore.lastDailyUpdate}`);
    
    // Forza aggiornamento
    console.log('\n🔄 Avvio aggiornamento forzato...');
    const startTime = Date.now();
    
    const matches = await realOddsService.forceUpdate();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Mostra risultati
    console.log('\n✅ AGGIORNAMENTO COMPLETATO!');
    console.log(`• Durata: ${duration} secondi`);
    console.log(`• Partite caricate: ${matches.length}`);
    
    if (matches.length > 0) {
      console.log('\n🏆 PARTITE TROVATE:');
      matches.forEach((match, index) => {
        console.log(`${index + 1}. ${match.homeTeam} vs ${match.awayTeam}`);
        console.log(`   📅 ${match.date.toLocaleDateString('it-IT')} - ${match.league}`);
        console.log(`   📊 ${match.odds.length} bookmaker disponibili`);
      });
    }
    
    // Mostra statistiche dopo l'aggiornamento
    const statsAfter = realOddsService.getServiceStats();
    console.log('\n📊 STATISTICHE DOPO L\'AGGIORNAMENTO:');
    console.log(`• Richieste utilizzate: ${statsAfter.requestsUsed}/${statsAfter.monthlyLimit}`);
    console.log(`• Richieste rimanenti: ${statsAfter.requestsRemaining}`);
    console.log(`• Aggiornato oggi: ${statsAfter.updatedToday ? 'SÌ' : 'NO'}`);
    console.log(`• Prossimo aggiornamento: ${statsAfter.nextUpdateTime.toLocaleString('it-IT')}`);
    
    // Calcola richieste utilizzate in questo aggiornamento
    const requestsUsed = statsAfter.requestsUsed - statsBefore.requestsUsed;
    console.log(`• Richieste utilizzate in questo aggiornamento: ${requestsUsed}`);
    
    console.log('\n🎉 AGGIORNAMENTO FORZATO COMPLETATO CON SUCCESSO!');
    
  } catch (error) {
    console.error('\n❌ ERRORE DURANTE L\'AGGIORNAMENTO:');
    console.error(error instanceof Error ? error.message : String(error));
    
    // Mostra comunque le statistiche in caso di errore
    try {
      const stats = realOddsService.getServiceStats();
      console.log('\n📊 STATISTICHE ATTUALI:');
      console.log(`• Richieste utilizzate: ${stats.requestsUsed}/${stats.monthlyLimit}`);
      console.log(`• Richieste rimanenti: ${stats.requestsRemaining}`);
    } catch (e) {
      console.error('Impossibile recuperare statistiche:', e instanceof Error ? e.message : String(e));
    }
    
    process.exit(1);
  }
}

// Esegui l'aggiornamento
forceUpdateNow(); 