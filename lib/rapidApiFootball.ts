// Servizio per integrare RapidAPI Football
const RAPIDAPI_KEY = 'fbe299f007mshb9e2b81ab5083d1p148cadjsn44e4b2b2c13b';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v2';

export interface RapidApiBookmaker {
  id: number;
  name: string;
}

export interface RapidApiOdd {
  id: number;
  bookmaker: RapidApiBookmaker;
  label: string;
  value: string;
  odd: string;
}

export interface RapidApiFixture {
  fixture_id: number;
  league_id: number;
  league: {
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
  event_date: string;
  event_timestamp: number;
  firstHalfStart: number;
  secondHalfStart: number;
  round: string;
  status: string;
  statusShort: string;
  elapsed: number;
  venue: string;
  referee: string;
  homeTeam: {
    team_id: number;
    team_name: string;
    logo: string;
  };
  awayTeam: {
    team_id: number;
    team_name: string;
    logo: string;
  };
  goalsHomeTeam: number;
  goalsAwayTeam: number;
  score: {
    halftime: string;
    fulltime: string;
    extratime: string;
    penalty: string;
  };
}

export interface RapidApiOddsResponse {
  api: {
    results: number;
    fixtures: RapidApiFixture[];
    odds: {
      [fixtureId: string]: {
        [bookmakerId: string]: RapidApiOdd[];
      };
    };
  };
}

// Mappatura campionati RapidAPI -> nostri campionati
const LEAGUE_MAPPING: { [key: number]: { sport: string; league: string; name: string } } = {
  // Serie A Italia
  135: { sport: 'calcio', league: 'serie-a', name: 'Serie A' },
  
  // Premier League
  39: { sport: 'calcio', league: 'premier-league', name: 'Premier League' },
  
  // La Liga
  140: { sport: 'calcio', league: 'la-liga', name: 'La Liga' },
  
  // Bundesliga
  78: { sport: 'calcio', league: 'bundesliga', name: 'Bundesliga' },
  
  // Ligue 1
  61: { sport: 'calcio', league: 'ligue-1', name: 'Ligue 1' },
  
  // Champions League
  2: { sport: 'calcio', league: 'champions-league', name: 'Champions League' },
  
  // Europa League
  3: { sport: 'calcio', league: 'europa-league', name: 'Europa League' },
  
  // Serie B Italia
  136: { sport: 'calcio', league: 'serie-b', name: 'Serie B' },
  
  // Championship Inghilterra
  40: { sport: 'calcio', league: 'championship', name: 'Championship' },
  
  // Liga 2 Spagna
  141: { sport: 'calcio', league: 'segunda-division', name: 'Segunda División' },
  
  // Campionato specifico dall'esempio
  865927: { sport: 'calcio', league: 'custom-league', name: 'Campionato Personalizzato' }
};

// Mappatura bookmaker RapidAPI -> nomi standardizzati
const RAPIDAPI_BOOKMAKER_MAPPING: { [key: number]: string } = {
  1: 'Bet365',
  2: 'Betfair',
  3: 'William Hill',
  4: 'Ladbrokes',
  5: 'Coral',
  6: 'Paddy Power',
  7: 'Betway',
  8: 'Unibet',
  9: 'Bwin',
  10: 'Pinnacle',
  11: '888sport',
  12: 'Betfred',
  13: 'Betvictor',
  14: 'Marathonbet',
  15: 'Betclic',
  16: 'NetBet',
  17: 'LeoVegas',
  18: 'Sisal',
  19: 'Snai',
  20: 'Eurobet',
  21: 'Lottomatica',
  22: 'Better',
  23: 'Goldbet',
  24: 'Planetwin365',
  25: 'Admiral'
};

export class RapidApiFootballService {
  private apiKey: string;
  private host: string;
  private baseUrl: string;
  private requestCount: number = 0;
  private maxRequests: number = 500; // Limite giornaliero RapidAPI

  constructor() {
    this.apiKey = RAPIDAPI_KEY;
    this.host = RAPIDAPI_HOST;
    this.baseUrl = BASE_URL;
  }

  // Getter per il contatore delle richieste
  getRequestCount(): number {
    return this.requestCount;
  }

  // Getter per il limite massimo
  getMaxRequests(): number {
    return this.maxRequests;
  }

  // Getter per le richieste rimanenti
  getRemainingRequests(): number {
    return this.maxRequests - this.requestCount;
  }

  // Getter per la percentuale di utilizzo
  getUsagePercentage(): number {
    return Math.round((this.requestCount / this.maxRequests) * 100);
  }

  // Incrementa il contatore delle richieste
  private incrementRequestCount(): void {
    this.requestCount++;
    console.log(`RapidAPI Requests: ${this.requestCount}/${this.maxRequests} (${this.getUsagePercentage()}%)`);
  }

  // Headers standard per le richieste
  private getHeaders(): HeadersInit {
    return {
      'x-rapidapi-host': this.host,
      'x-rapidapi-key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  // Ottieni le quote per un campionato specifico
  async getOddsForLeague(leagueId: number, bookmakerId?: number, page: number = 1): Promise<RapidApiOddsResponse | null> {
    try {
      this.incrementRequestCount();
      
      let url = `${this.baseUrl}/odds/league/${leagueId}`;
      
      if (bookmakerId) {
        url += `/bookmaker/${bookmakerId}`;
      }
      
      url += `?page=${page}`;
      
      console.log(`🔄 Recuperando quote per campionato ${leagueId}...`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Quote recuperate per campionato ${leagueId}: ${data.api?.results || 0} risultati`);
      
      return data;
    } catch (error) {
      console.error(`❌ Errore nel recupero quote per campionato ${leagueId}:`, error);
      return null;
    }
  }

  // Ottieni le partite per un campionato
  async getFixturesForLeague(leagueId: number, from?: string, to?: string): Promise<RapidApiFixture[]> {
    try {
      this.incrementRequestCount();
      
      let url = `${this.baseUrl}/fixtures/league/${leagueId}`;
      
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log(`🔄 Recuperando partite per campionato ${leagueId}...`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Partite recuperate per campionato ${leagueId}: ${data.api?.results || 0} partite`);
      
      return data.api?.fixtures || [];
    } catch (error) {
      console.error(`❌ Errore nel recupero partite per campionato ${leagueId}:`, error);
      return [];
    }
  }

  // Ottieni quote per tutti i campionati principali
  async getAllMainLeaguesOdds(): Promise<any[]> {
    const mainLeagues = [
      135, // Serie A
      39,  // Premier League
      140, // La Liga
      78,  // Bundesliga
      61,  // Ligue 1
      2,   // Champions League
      136  // Serie B
    ];

    const allMatches: any[] = [];

    for (const leagueId of mainLeagues) {
      try {
        const leagueInfo = LEAGUE_MAPPING[leagueId];
        if (!leagueInfo) continue;

        console.log(`🔄 Recuperando dati per ${leagueInfo.name}...`);

        // Ottieni le partite del campionato
        const fixtures = await this.getFixturesForLeague(leagueId);
        
        if (fixtures.length === 0) {
          console.log(`⚠️ Nessuna partita trovata per ${leagueInfo.name}`);
          continue;
        }

        // Ottieni le quote per il campionato
        const oddsData = await this.getOddsForLeague(leagueId);
        
        if (!oddsData?.api?.odds) {
          console.log(`⚠️ Nessuna quota trovata per ${leagueInfo.name}`);
          continue;
        }

        // Combina partite e quote
        const matchesWithOdds = this.combineFixturesWithOdds(fixtures, oddsData.api.odds, leagueInfo);
        allMatches.push(...matchesWithOdds);

        console.log(`✅ ${matchesWithOdds.length} partite con quote aggiunte per ${leagueInfo.name}`);

        // Pausa per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`❌ Errore per campionato ${leagueId}:`, error);
      }
    }

    console.log(`📊 Totale partite recuperate: ${allMatches.length}`);
    return allMatches;
  }

  // Combina partite e quote
  private combineFixturesWithOdds(
    fixtures: RapidApiFixture[], 
    odds: { [fixtureId: string]: { [bookmakerId: string]: RapidApiOdd[] } },
    leagueInfo: { sport: string; league: string; name: string }
  ): any[] {
    return fixtures.map(fixture => {
      const fixtureOdds = odds[fixture.fixture_id.toString()] || {};
      
      // Converti le quote in formato app
      const convertedOdds = this.convertOddsToAppFormat(fixtureOdds);
      
      // Calcola le migliori quote
      const bestOdds = this.calculateBestOdds(convertedOdds);

      return {
        id: `rapid-${fixture.fixture_id}`,
        homeTeam: fixture.homeTeam.team_name,
        awayTeam: fixture.awayTeam.team_name,
        league: leagueInfo.league,
        sport: leagueInfo.sport,
        date: new Date(fixture.event_date),
        status: fixture.statusShort === 'NS' ? 'upcoming' : 'live',
        odds: convertedOdds,
        bestOdds,
        // Dati aggiuntivi
        venue: fixture.venue,
        round: fixture.round,
        homeTeamLogo: fixture.homeTeam.logo,
        awayTeamLogo: fixture.awayTeam.logo,
        leagueName: leagueInfo.name,
        leagueLogo: fixture.league.logo
      };
    }).filter(match => match.odds.length > 0); // Solo partite con quote
  }

  // Converti quote RapidAPI in formato app
  private convertOddsToAppFormat(fixtureOdds: { [bookmakerId: string]: RapidApiOdd[] }): any[] {
    const convertedOdds: any[] = [];

    Object.entries(fixtureOdds).forEach(([bookmakerId, odds]) => {
      const bookmakerName = RAPIDAPI_BOOKMAKER_MAPPING[parseInt(bookmakerId)] || `Bookmaker ${bookmakerId}`;
      
      // Trova le quote 1X2
      const homeOdd = odds.find(o => o.label === 'Home');
      const drawOdd = odds.find(o => o.label === 'Draw');
      const awayOdd = odds.find(o => o.label === 'Away');

      if (homeOdd && awayOdd) {
        convertedOdds.push({
          home: parseFloat(homeOdd.odd),
          away: parseFloat(awayOdd.odd),
          draw: drawOdd ? parseFloat(drawOdd.odd) : undefined,
          bookmaker: bookmakerName,
          lastUpdated: new Date()
        });
      }
    });

    return convertedOdds;
  }

  // Calcola le migliori quote
  private calculateBestOdds(odds: any[]): any {
    if (odds.length === 0) {
      return {
        home: { odds: 0, bookmaker: 'N/A' },
        away: { odds: 0, bookmaker: 'N/A' },
        draw: undefined
      };
    }

    const homeOdds = odds.map(o => ({ odds: o.home, bookmaker: o.bookmaker }));
    const awayOdds = odds.map(o => ({ odds: o.away, bookmaker: o.bookmaker }));
    const drawOdds = odds.filter(o => o.draw).map(o => ({ odds: o.draw, bookmaker: o.bookmaker }));

    return {
      home: homeOdds.reduce((best, current) => current.odds > best.odds ? current : best),
      away: awayOdds.reduce((best, current) => current.odds > best.odds ? current : best),
      draw: drawOdds.length > 0 
        ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best)
        : undefined
    };
  }

  // Verifica lo stato dell'API
  async checkApiStatus(): Promise<any> {
    try {
      this.incrementRequestCount();
      
      // Usa l'endpoint delle quote per testare l'API (come nell'esempio fornito)
      const response = await fetch(`${this.baseUrl}/odds/league/865927/bookmaker/5?page=2`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      return {
        status: response.ok ? 'active' : 'error',
        statusCode: response.status,
        remainingRequests: response.headers.get('x-ratelimit-requests-remaining'),
        usedRequests: response.headers.get('x-ratelimit-requests-used')
      };
    } catch (error) {
      console.error('Errore nel controllo stato API:', error);
      return {
        status: 'error',
        statusCode: 0,
        remainingRequests: null,
        usedRequests: null
      };
    }
  }

  // Ottieni tutti i campionati disponibili
  async getAvailableLeagues(): Promise<any[]> {
    try {
      this.incrementRequestCount();
      
      const response = await fetch(`${this.baseUrl}/leagues`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.api?.leagues || [];
    } catch (error) {
      console.error('Errore nel recupero campionati:', error);
      return [];
    }
  }
}

export const rapidApiFootball = new RapidApiFootballService(); 