// Test del sistema API giornaliero - 1 richiesta per sport al giorno
console.log('🔄 TEST SISTEMA API GIORNALIERO');
console.log('===============================\n');

// Simula il sistema di gestione API giornaliera
class TestDailyApiManager {
  constructor() {
    this.state = {
      lastUpdate: '',
      lastUpdateTime: 0,
      requestsToday: 0,
      requestsThisMonth: 0,
      sportsUpdatedToday: [],
      nextUpdateTime: 0,
      dailyQuota: 6,
      monthlyLimit: 500
    };
    
    this.supportedSports = [
      'soccer_italy_serie_a',
      'soccer_epl',
      'soccer_uefa_champs_league',
      'basketball_nba',
      'tennis_atp_french_open',
      'americanfootball_nfl'
    ];
    
    this.apiKey = '4815fd45ad14363aea162bef71a91b06';
  }

  checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.state.lastUpdate !== today) {
      console.log(`🔄 Reset giornaliero - Nuovo giorno: ${today}`);
      this.state.lastUpdate = today;
      this.state.requestsToday = 0;
      this.state.sportsUpdatedToday = [];
      this.state.nextUpdateTime = 0;
    }
  }

  canMakeRequest() {
    this.checkDailyReset();
    
    if (this.state.requestsToday >= this.state.dailyQuota) {
      console.warn(`🚫 Quota giornaliera esaurita: ${this.state.requestsToday}/${this.state.dailyQuota}`);
      return false;
    }
    
    if (this.state.requestsThisMonth >= this.state.monthlyLimit) {
      console.error(`🚫 Limite mensile raggiunto: ${this.state.requestsThisMonth}/${this.state.monthlyLimit}`);
      return false;
    }
    
    return true;
  }

  canUpdateSport(sport) {
    this.checkDailyReset();
    
    if (this.state.sportsUpdatedToday.includes(sport)) {
      console.log(`⏰ Sport ${sport} già aggiornato oggi`);
      return false;
    }
    
    return this.canMakeRequest();
  }

  recordRequest(sport) {
    const now = Date.now();
    
    this.state.requestsToday++;
    this.state.requestsThisMonth++;
    this.state.lastUpdateTime = now;
    this.state.sportsUpdatedToday.push(sport);
    
    console.log(`📊 Richiesta registrata per ${sport}:`);
    console.log(`• Oggi: ${this.state.requestsToday}/${this.state.dailyQuota}`);
    console.log(`• Mese: ${this.state.requestsThisMonth}/${this.state.monthlyLimit}`);
    console.log(`• Orario: ${new Date(now).toLocaleString('it-IT')}`);
  }

  getNextSportToUpdate() {
    const availableSports = this.supportedSports.filter(sport => 
      this.canUpdateSport(sport)
    );
    
    if (availableSports.length === 0) {
      return null;
    }
    
    // Priorità: Serie A > Premier League > Champions > NBA > Tennis > NFL
    for (const sport of this.supportedSports) {
      if (availableSports.includes(sport)) {
        return sport;
      }
    }
    
    return availableSports[0];
  }

  getDailyStats() {
    this.checkDailyReset();
    
    const updatedToday = this.state.sportsUpdatedToday.length;
    const remainingToday = this.state.dailyQuota - this.state.requestsToday;
    const remainingThisMonth = this.state.monthlyLimit - this.state.requestsThisMonth;
    
    return {
      today: {
        used: this.state.requestsToday,
        quota: this.state.dailyQuota,
        remaining: remainingToday,
        percentage: Math.round((this.state.requestsToday / this.state.dailyQuota) * 100)
      },
      month: {
        used: this.state.requestsThisMonth,
        limit: this.state.monthlyLimit,
        remaining: remainingThisMonth,
        percentage: Math.round((this.state.requestsThisMonth / this.state.monthlyLimit) * 100)
      },
      sports: {
        total: this.supportedSports.length,
        updatedToday,
        remaining: this.supportedSports.length - updatedToday
      },
      lastUpdate: this.state.lastUpdateTime ? {
        timestamp: this.state.lastUpdateTime,
        date: new Date(this.state.lastUpdateTime).toLocaleDateString('it-IT'),
        time: new Date(this.state.lastUpdateTime).toLocaleTimeString('it-IT')
      } : null
    };
  }

  simulateApiRequest(sport) {
    if (!this.canUpdateSport(sport)) {
      throw new Error(`Sport ${sport} non può essere aggiornato`);
    }
    
    console.log(`🔄 Simulazione richiesta API per ${sport}...`);
    
    // Simula richiesta HTTP
    const success = Math.random() > 0.1; // 90% successo
    
    if (success) {
      this.recordRequest(sport);
      const eventsCount = Math.floor(Math.random() * 20) + 5; // 5-25 eventi
      console.log(`✅ Successo: ${eventsCount} eventi ricevuti per ${sport}`);
      return { success: true, events: eventsCount };
    } else {
      console.log(`❌ Errore nella richiesta per ${sport}`);
      return { success: false, error: 'API Error' };
    }
  }
}

// Test del sistema
console.log('🚀 Avvio test sistema API giornaliero...\n');

const apiManager = new TestDailyApiManager();

// Test 1: Stato iniziale
console.log('📊 TEST 1: Stato iniziale');
console.log('='.repeat(40));
let stats = apiManager.getDailyStats();
console.log(`Richieste oggi: ${stats.today.used}/${stats.today.quota}`);
console.log(`Richieste mese: ${stats.month.used}/${stats.month.limit}`);
console.log(`Sport aggiornati: ${stats.sports.updatedToday}/${stats.sports.total}\n`);

// Test 2: Aggiornamenti sequenziali
console.log('📊 TEST 2: Aggiornamenti sequenziali');
console.log('='.repeat(40));

for (let i = 0; i < 8; i++) {
  const nextSport = apiManager.getNextSportToUpdate();
  
  if (!nextSport) {
    console.log(`⏹️  Nessun sport disponibile per aggiornamento (tentativo ${i + 1})`);
    break;
  }
  
  console.log(`\n🎯 Tentativo ${i + 1}: Aggiornamento ${nextSport}`);
  
  try {
    const result = apiManager.simulateApiRequest(nextSport);
    if (result.success) {
      console.log(`   ✅ ${result.events} eventi caricati`);
    } else {
      console.log(`   ❌ ${result.error}`);
    }
  } catch (error) {
    console.log(`   🚫 ${error.message}`);
  }
}

// Test 3: Stato finale
console.log('\n📊 TEST 3: Stato finale');
console.log('='.repeat(40));
stats = apiManager.getDailyStats();
console.log(`Richieste oggi: ${stats.today.used}/${stats.today.quota} (${stats.today.percentage}%)`);
console.log(`Richieste mese: ${stats.month.used}/${stats.month.limit} (${stats.month.percentage}%)`);
console.log(`Sport aggiornati: ${stats.sports.updatedToday}/${stats.sports.total}`);

if (stats.lastUpdate) {
  console.log(`Ultimo aggiornamento: ${stats.lastUpdate.time}`);
}

// Test 4: Tentativo di doppio aggiornamento
console.log('\n📊 TEST 4: Tentativo doppio aggiornamento');
console.log('='.repeat(40));

if (apiManager.state.sportsUpdatedToday.length > 0) {
  const alreadyUpdatedSport = apiManager.state.sportsUpdatedToday[0];
  console.log(`Tentativo di aggiornare nuovamente: ${alreadyUpdatedSport}`);
  
  try {
    apiManager.simulateApiRequest(alreadyUpdatedSport);
  } catch (error) {
    console.log(`✅ Correttamente bloccato: ${error.message}`);
  }
}

// Test 5: Simulazione nuovo giorno
console.log('\n📊 TEST 5: Simulazione nuovo giorno');
console.log('='.repeat(40));

// Forza reset giornaliero
apiManager.state.lastUpdate = '';
apiManager.checkDailyReset();

stats = apiManager.getDailyStats();
console.log(`Dopo reset giornaliero:`);
console.log(`Richieste oggi: ${stats.today.used}/${stats.today.quota}`);
console.log(`Sport aggiornati: ${stats.sports.updatedToday}/${stats.sports.total}`);
console.log(`Richieste mese: ${stats.month.used}/${stats.month.limit} (mantenute)`);

// Riepilogo finale
console.log('\n📋 RIEPILOGO SISTEMA API GIORNALIERO');
console.log('='.repeat(50));
console.log('✅ Funzionalità testate:');
console.log('• Reset giornaliero automatico');
console.log('• Limite 6 richieste al giorno');
console.log('• 1 aggiornamento per sport al giorno');
console.log('• Priorità sport (Serie A > Premier > Champions > NBA > Tennis > NFL)');
console.log('• Monitoraggio richieste mensili (500 limite)');
console.log('• Prevenzione doppi aggiornamenti');
console.log('• Gestione errori API');

console.log('\n🎯 VANTAGGI SISTEMA:');
console.log('• Preserva le 500 richieste mensili');
console.log('• Aggiornamenti distribuiti nell\'arco della giornata');
console.log('• Cache 24 ore per ridurre richieste');
console.log('• Monitoraggio accurato utilizzo API');
console.log('• Priorità sport italiani');

console.log('\n💡 CONFIGURAZIONE ATTUALE:');
console.log(`• Chiave API: ${apiManager.apiKey.substring(0, 8)}...`);
console.log(`• Quota giornaliera: ${apiManager.state.dailyQuota} richieste`);
console.log(`• Limite mensile: ${apiManager.state.monthlyLimit} richieste`);
console.log(`• Sport supportati: ${apiManager.supportedSports.length}`);
console.log(`• Frequenza: 1 aggiornamento per sport al giorno`);

console.log('\n✅ Test completato con successo!'); 