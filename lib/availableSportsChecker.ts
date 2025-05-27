// Servizio per verificare sport disponibili in The Odds API
// Controlla quali sport hanno effettivamente partite disponibili

export class AvailableSportsChecker {
  private static instance: AvailableSportsChecker;
  
  private readonly API_KEY = '4815fd45ad14363aea162bef71a91b06';
  private readonly BASE_URL = 'https://api.the-odds-api.com/v4';
  
  // Cache per evitare troppe richieste
  private cache: { sports: any[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ore
  
  constructor() {}

  static getInstance(): AvailableSportsChecker {
    if (!AvailableSportsChecker.instance) {
      AvailableSportsChecker.instance = new AvailableSportsChecker();
    }
    return AvailableSportsChecker.instance;
  }

  // Ottieni tutti gli sport disponibili dall'API
  async getAvailableSports(): Promise<any[]> {
    // Controlla cache
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      console.log('📦 Cache hit per sport disponibili');
      return this.cache.sports;
    }

    try {
      console.log('🔄 Recupero sport disponibili da API...');
      
      const response = await fetch(`${this.BASE_URL}/sports?apiKey=${this.API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const sports = await response.json();
      
      // Salva in cache
      this.cache = {
        sports,
        timestamp: Date.now()
      };
      
      console.log(`✅ ${sports.length} sport disponibili nell'API`);
      
      return sports;
      
    } catch (error) {
      console.error('❌ Errore recupero sport disponibili:', error);
      return [];
    }
  }

  // Filtra sport per categoria
  async getSportsByCategory(): Promise<{ [category: string]: any[] }> {
    const sports = await this.getAvailableSports();
    
    const categories: { [category: string]: any[] } = {
      soccer: [],
      basketball: [],
      tennis: [],
      americanfootball: [],
      icehockey: [],
      mma: [],
      baseball: [],
      cricket: [],
      golf: [],
      motorsport: [],
      rugby: [],
      other: []
    };

    sports.forEach(sport => {
      const key = sport.key.toLowerCase();
      
      if (key.includes('soccer')) {
        categories.soccer.push(sport);
      } else if (key.includes('basketball')) {
        categories.basketball.push(sport);
      } else if (key.includes('tennis')) {
        categories.tennis.push(sport);
      } else if (key.includes('americanfootball')) {
        categories.americanfootball.push(sport);
      } else if (key.includes('icehockey')) {
        categories.icehockey.push(sport);
      } else if (key.includes('mma') || key.includes('mixed_martial_arts')) {
        categories.mma.push(sport);
      } else if (key.includes('baseball')) {
        categories.baseball.push(sport);
      } else if (key.includes('cricket')) {
        categories.cricket.push(sport);
      } else if (key.includes('golf')) {
        categories.golf.push(sport);
      } else if (key.includes('motorsport') || key.includes('f1')) {
        categories.motorsport.push(sport);
      } else if (key.includes('rugby')) {
        categories.rugby.push(sport);
      } else {
        categories.other.push(sport);
      }
    });

    return categories;
  }

  // Verifica se uno sport specifico è disponibile
  async isSportAvailable(sportKey: string): Promise<boolean> {
    const sports = await this.getAvailableSports();
    return sports.some(sport => sport.key === sportKey);
  }

  // Ottieni sport con partite attive
  async getSportsWithActiveMatches(): Promise<string[]> {
    const sports = await this.getAvailableSports();
    const sportsWithMatches: string[] = [];

    // Verifica ogni sport (limitato per non esaurire API)
    const prioritySports = [
      'soccer_epl',
      'soccer_italy_serie_a', 
      'soccer_spain_la_liga',
      'soccer_germany_bundesliga',
      'soccer_france_ligue_one',
      'soccer_uefa_champs_league',
      'basketball_nba',
      'americanfootball_nfl',
      'icehockey_nhl',
      'mma_mixed_martial_arts'
    ];

    for (const sportKey of prioritySports) {
      const isAvailable = sports.some(sport => sport.key === sportKey);
      if (isAvailable) {
        try {
          const response = await fetch(
            `${this.BASE_URL}/sports/${sportKey}/odds?apiKey=${this.API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              // Filtra solo partite future
              const futureMatches = data.filter(match => {
                const matchDate = new Date(match.commence_time);
                return matchDate > new Date();
              });
              
              if (futureMatches.length > 0) {
                sportsWithMatches.push(sportKey);
                console.log(`✅ ${sportKey}: ${futureMatches.length} partite future`);
              } else {
                console.log(`⚠️ ${sportKey}: Nessuna partita futura`);
              }
            } else {
              console.log(`⚠️ ${sportKey}: Nessuna partita disponibile`);
            }
          }
          
          // Pausa per evitare rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Errore verifica ${sportKey}:`, error);
        }
      } else {
        console.log(`❌ ${sportKey}: Non disponibile nell'API`);
      }
    }

    console.log(`🎯 Sport con partite attive: ${sportsWithMatches.join(', ')}`);
    return sportsWithMatches;
  }

  // Stampa report completo
  async printAvailabilityReport(): Promise<void> {
    console.log('\n🔍 === REPORT SPORT DISPONIBILI ===');
    
    const categories = await this.getSportsByCategory();
    
    Object.entries(categories).forEach(([category, sports]) => {
      if (sports.length > 0) {
        console.log(`\n📂 ${category.toUpperCase()} (${sports.length} sport):`);
        sports.forEach(sport => {
          console.log(`  • ${sport.key} - ${sport.title}`);
        });
      }
    });

    console.log('\n🎯 === VERIFICA PARTITE ATTIVE ===');
    const activeSports = await this.getSportsWithActiveMatches();
    
    if (activeSports.length > 0) {
      console.log(`✅ Sport con partite: ${activeSports.length}`);
      activeSports.forEach(sport => console.log(`  ✓ ${sport}`));
    } else {
      console.log('❌ Nessuno sport con partite attive trovato');
    }
  }
}

// Istanza singleton
export const availableSportsChecker = AvailableSportsChecker.getInstance(); 