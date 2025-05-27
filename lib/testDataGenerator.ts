// Generatore di Dati di Test per il Sistema Giornaliero
// Simula quote realistiche per testare il sistema

import { Match, Odds, HandicapOdds } from '@/types';

interface TestMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  date: Date;
  odds: Odds[];
}

export class TestDataGenerator {
  private static instance: TestDataGenerator;
  
  // Bookmaker realistici con nomi corretti
  private readonly BOOKMAKERS = [
    'Bet365', 'Sisal', 'Snai', 'Eurobet', 'Lottomatica',
    'Betflag', 'Goldbet', 'Planetwin365', 'Admiral', 'Better',
    'William Hill', 'Betfair', 'Unibet', 'Bwin', 'Betway'
  ];

  // Squadre per sport
  private readonly TEAMS = {
    'soccer_italy_serie_a': {
      league: 'Serie A',
      teams: [
        'Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Lazio',
        'Atalanta', 'Fiorentina', 'Bologna', 'Torino', 'Udinese',
        'Sassuolo', 'Verona', 'Genoa', 'Cagliari', 'Lecce'
      ]
    },
    'soccer_epl': {
      league: 'Premier League',
      teams: [
        'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Newcastle',
        'Manchester United', 'Tottenham', 'Brighton', 'Aston Villa',
        'West Ham', 'Crystal Palace', 'Bournemouth', 'Fulham', 'Wolves'
      ]
    },
    'soccer_uefa_champs_league': {
      league: 'Champions League',
      teams: [
        'Real Madrid', 'Barcelona', 'Bayern Munich', 'PSG', 'Manchester City',
        'Liverpool', 'Chelsea', 'Juventus', 'Inter', 'Milan', 'Napoli',
        'Atletico Madrid', 'Borussia Dortmund', 'Ajax', 'Porto'
      ]
    },
    'basketball_nba': {
      league: 'NBA',
      teams: [
        'Lakers', 'Warriors', 'Celtics', 'Heat', 'Nuggets', 'Suns',
        'Bucks', 'Sixers', 'Nets', 'Knicks', 'Bulls', 'Mavericks',
        'Clippers', 'Kings', 'Grizzlies', 'Pelicans'
      ]
    },
    'tennis_atp_french_open': {
      league: 'ATP French Open',
      teams: [
        'Novak Djokovic', 'Rafael Nadal', 'Carlos Alcaraz', 'Daniil Medvedev',
        'Stefanos Tsitsipas', 'Alexander Zverev', 'Andrey Rublev', 'Casper Ruud',
        'Taylor Fritz', 'Jannik Sinner', 'Matteo Berrettini', 'Felix Auger-Aliassime'
      ]
    },
    'americanfootball_nfl': {
      league: 'NFL',
      teams: [
        'Chiefs', 'Bills', 'Bengals', 'Cowboys', 'Eagles', '49ers',
        'Dolphins', 'Ravens', 'Chargers', 'Jets', 'Titans', 'Colts',
        'Broncos', 'Raiders', 'Steelers', 'Browns'
      ]
    }
  };

  private constructor() {}

  static getInstance(): TestDataGenerator {
    if (!TestDataGenerator.instance) {
      TestDataGenerator.instance = new TestDataGenerator();
    }
    return TestDataGenerator.instance;
  }

  // Genera quote realistiche con handicap
  private generateRealisticOdds(homeAdvantage: number = 0): Odds[] {
    const numBookmakers = Math.floor(Math.random() * 8) + 5; // 5-12 bookmaker
    const selectedBookmakers = this.shuffleArray([...this.BOOKMAKERS]).slice(0, numBookmakers);
    
    // Quote base realistiche
    const baseHomeOdds = 1.5 + Math.random() * 3; // 1.5 - 4.5
    const baseAwayOdds = 1.5 + Math.random() * 3; // 1.5 - 4.5
    const baseDrawOdds = 2.8 + Math.random() * 1.5; // 2.8 - 4.3
    
    // Applica vantaggio casa
    const homeOdds = Math.max(1.1, baseHomeOdds - homeAdvantage);
    const awayOdds = baseAwayOdds + homeAdvantage * 0.5;
    
    return selectedBookmakers.map(bookmaker => {
      const odds: Odds = {
        home: this.addVariation(homeOdds, 0.15),
        away: this.addVariation(awayOdds, 0.15),
        draw: this.addVariation(baseDrawOdds, 0.2),
        bookmaker,
        lastUpdated: new Date()
      };

      // Aggiungi handicap realistici (70% probabilità)
      if (Math.random() > 0.3) {
        odds.handicap = this.generateHandicapOdds(homeAdvantage, bookmaker);
      }

      return odds;
    });
  }

  // Genera quote handicap realistiche
  private generateHandicapOdds(homeAdvantage: number, bookmaker: string): HandicapOdds[] {
    const handicaps: HandicapOdds[] = [];
    
    // Handicap comuni per sport
    const commonHandicaps = [-2.5, -1.5, -1, -0.5, 0, +0.5, +1, +1.5, +2.5];
    const numHandicaps = Math.floor(Math.random() * 3) + 1; // 1-3 handicap
    
    const selectedHandicaps = this.shuffleArray(commonHandicaps).slice(0, numHandicaps);
    
    selectedHandicaps.forEach(handicap => {
      // Quote handicap basate sul vantaggio
      let homeHandicapOdds = 1.8 + Math.random() * 0.4; // 1.8 - 2.2
      let awayHandicapOdds = 1.8 + Math.random() * 0.4; // 1.8 - 2.2
      
      // Aggiusta quote in base all'handicap
      if (handicap < 0) {
        // Casa sfavorita
        homeHandicapOdds += Math.abs(handicap) * 0.1;
        awayHandicapOdds -= Math.abs(handicap) * 0.1;
      } else if (handicap > 0) {
        // Casa favorita
        homeHandicapOdds -= handicap * 0.1;
        awayHandicapOdds += handicap * 0.1;
      }
      
      handicaps.push({
        home: Math.max(1.1, this.addVariation(homeHandicapOdds, 0.1)),
        away: Math.max(1.1, this.addVariation(awayHandicapOdds, 0.1)),
        handicap,
        bookmaker,
        lastUpdated: new Date()
      });
    });
    
    return handicaps;
  }

  // Aggiunge variazione realistica alle quote
  private addVariation(baseOdds: number, variation: number): number {
    const change = (Math.random() - 0.5) * 2 * variation;
    return Math.max(1.01, Number((baseOdds + change).toFixed(2)));
  }

  // Mescola array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Genera partite per uno sport
  generateMatchesForSport(sportKey: string, count: number = 8): TestMatch[] {
    const sportData = this.TEAMS[sportKey as keyof typeof this.TEAMS];
    if (!sportData) return [];

    const matches: TestMatch[] = [];
    const usedPairs = new Set<string>();

    for (let i = 0; i < count; i++) {
      let homeTeam: string, awayTeam: string;
      let pairKey: string;
      
      // Evita duplicati
      do {
        const shuffledTeams = this.shuffleArray(sportData.teams);
        homeTeam = shuffledTeams[0];
        awayTeam = shuffledTeams[1];
        pairKey = `${homeTeam}-${awayTeam}`;
      } while (usedPairs.has(pairKey) && usedPairs.size < sportData.teams.length * (sportData.teams.length - 1) / 2);
      
      usedPairs.add(pairKey);

      // Data partita (oggi + 1-7 giorni)
      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * 7) + 1);
      matchDate.setHours(15 + Math.floor(Math.random() * 6), 0, 0, 0); // 15:00 - 20:00

      // Vantaggio casa leggero
      const homeAdvantage = Math.random() * 0.3;

      matches.push({
        id: `${sportKey}_${i + 1}_${Date.now()}`,
        homeTeam,
        awayTeam,
        league: sportData.league,
        sport: this.formatSportName(sportKey),
        date: matchDate,
        odds: this.generateRealisticOdds(homeAdvantage)
      });
    }

    return matches;
  }

  // Genera tutte le partite per tutti gli sport
  generateAllMatches(): TestMatch[] {
    const allMatches: TestMatch[] = [];
    
    Object.keys(this.TEAMS).forEach(sportKey => {
      const matchCount = Math.floor(Math.random() * 6) + 5; // 5-10 partite per sport
      const sportMatches = this.generateMatchesForSport(sportKey, matchCount);
      allMatches.push(...sportMatches);
    });

    return allMatches;
  }

  // Formatta nome sport
  private formatSportName(sportKey: string): string {
    const mapping: { [key: string]: string } = {
      'soccer_italy_serie_a': 'Calcio',
      'soccer_epl': 'Calcio',
      'soccer_uefa_champs_league': 'Calcio',
      'basketball_nba': 'Basket',
      'tennis_atp_french_open': 'Tennis',
      'americanfootball_nfl': 'Football Americano'
    };
    return mapping[sportKey] || 'Sport';
  }

  // Converte in formato Match
  convertToMatches(testMatches: TestMatch[]): Match[] {
    return testMatches.map(testMatch => ({
      id: testMatch.id,
      homeTeam: testMatch.homeTeam,
      awayTeam: testMatch.awayTeam,
      league: testMatch.league,
      sport: testMatch.sport,
      date: testMatch.date,
      status: 'upcoming' as const,
      odds: testMatch.odds
    }));
  }

  // Genera dati per test completo
  generateTestData(): Match[] {
    console.log('🎲 Generando dati di test realistici...');
    
    const testMatches = this.generateAllMatches();
    const matches = this.convertToMatches(testMatches);
    
    console.log(`✅ Generati ${matches.length} partite con quote realistiche`);
    console.log(`📊 Sport: ${Object.keys(this.TEAMS).length}`);
    console.log(`🏢 Bookmaker: ${this.BOOKMAKERS.length}`);
    
    return matches;
  }

  // Simula aggiornamento quote (per test)
  updateMatchOdds(match: Match): Match {
    const updatedOdds = match.odds.map(odd => ({
      ...odd,
      home: this.addVariation(odd.home, 0.05),
      away: this.addVariation(odd.away, 0.05),
      draw: odd.draw ? this.addVariation(odd.draw, 0.05) : undefined,
      lastUpdated: new Date()
    }));

    return {
      ...match,
      odds: updatedOdds
    };
  }
}

// Istanza singleton
export const testDataGenerator = TestDataGenerator.getInstance(); 