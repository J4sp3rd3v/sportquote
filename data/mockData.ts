import { Bookmaker, Match, League, Sport } from '@/types';

export const bookmakers: Bookmaker[] = [
  // Top bookmaker italiani verificati e funzionanti
  { id: '1', name: 'Bet365', logo: '/logos/bet365.png', rating: 4.8, bonus: 'Fino a €100', website: 'bet365.it', isPopular: true, country: 'UK' },
  { id: '2', name: 'Sisal', logo: '/logos/sisal.png', rating: 4.7, bonus: 'Fino a €250', website: 'sisal.it', isPopular: true, country: 'Italia' },
  { id: '3', name: 'Snai', logo: '/logos/snai.png', rating: 4.6, bonus: 'Fino a €15', website: 'snai.it', isPopular: true, country: 'Italia' },
  { id: '4', name: 'Eurobet', logo: '/logos/eurobet.png', rating: 4.5, bonus: 'Fino a €50', website: 'eurobet.it', isPopular: true, country: 'Italia' },
  { id: '5', name: 'Lottomatica', logo: '/logos/lottomatica.png', rating: 4.4, bonus: 'Fino a €200', website: 'lottomatica.it', isPopular: true, country: 'Italia' },
  { id: '6', name: 'William Hill', logo: '/logos/williamhill.png', rating: 4.3, bonus: 'Fino a €50', website: 'williamhill.it', isPopular: true, country: 'UK' },
  { id: '7', name: 'Betfair', logo: '/logos/betfair.png', rating: 4.2, bonus: 'Fino a €200', website: 'betfair.it', isPopular: true, country: 'UK' },
  { id: '8', name: 'Unibet', logo: '/logos/unibet.png', rating: 4.1, bonus: 'Fino a €100', website: 'unibet.it', isPopular: true, country: 'Malta' },
  { id: '9', name: 'Bwin', logo: '/logos/bwin.png', rating: 4.0, bonus: 'Fino a €50', website: 'bwin.it', isPopular: true, country: 'Austria' },
  { id: '10', name: 'Betclic', logo: '/logos/betclic.png', rating: 3.9, bonus: 'Fino a €100', website: 'betclic.it', isPopular: true, country: 'Francia' },
  
  // Bookmaker internazionali affidabili
  { id: '11', name: 'Pinnacle', logo: '/logos/pinnacle.png', rating: 4.5, bonus: 'Quote migliori', website: 'pinnacle.com', isPopular: true, country: 'Malta' },
  { id: '12', name: 'Betway', logo: '/logos/betway.png', rating: 4.0, bonus: 'Fino a €30', website: 'betway.it', isPopular: true, country: 'Malta' },
  { id: '13', name: 'NetBet', logo: '/logos/netbet.png', rating: 3.8, bonus: 'Fino a €50', website: 'netbet.it', isPopular: true, country: 'Malta' },
  { id: '14', name: 'LeoVegas', logo: '/logos/leovegas.png', rating: 3.7, bonus: 'Fino a €1000', website: 'leovegas.it', isPopular: true, country: 'Malta' },
  { id: '15', name: 'Marathonbet', logo: '/logos/marathonbet.png', rating: 3.9, bonus: 'Fino a €100', website: 'marathonbet.it', isPopular: true, country: 'Malta' },
  
  // Bookmaker italiani aggiuntivi verificati
  { id: '16', name: 'Better', logo: '/logos/better.png', rating: 3.6, bonus: 'Fino a €100', website: 'better.it', isPopular: true, country: 'Italia' },
  { id: '17', name: 'Goldbet', logo: '/logos/goldbet.png', rating: 3.5, bonus: 'Fino a €500', website: 'goldbet.it', isPopular: true, country: 'Italia' },
  { id: '18', name: 'Planetwin365', logo: '/logos/planetwin365.png', rating: 3.4, bonus: 'Fino a €200', website: 'planetwin365.it', isPopular: true, country: 'Italia' },
  { id: '19', name: 'Betflag', logo: '/logos/betflag.png', rating: 3.3, bonus: 'Fino a €500', website: 'betflag.it', isPopular: true, country: 'Italia' },
  { id: '20', name: 'Stanleybet', logo: '/logos/stanleybet.png', rating: 3.2, bonus: 'Fino a €250', website: 'stanleybet.it', isPopular: true, country: 'Italia' },
  
  // Bookmaker emergenti e affidabili
  { id: '21', name: 'Betano', logo: '/logos/betano.png', rating: 4.1, bonus: 'Fino a €100', website: 'betano.it', isPopular: true, country: 'Malta' },
  { id: '22', name: '888sport', logo: '/logos/888sport.png', rating: 3.8, bonus: 'Fino a €100', website: '888sport.it', isPopular: true, country: 'Malta' },
  { id: '23', name: 'Pokerstars', logo: '/logos/pokerstars.png', rating: 3.7, bonus: 'Fino a €30', website: 'pokerstars.it', isPopular: true, country: 'Malta' },
  { id: '24', name: '1xBet', logo: '/logos/1xbet.png', rating: 3.6, bonus: 'Fino a €100', website: '1xbet.it', country: 'Curacao' },
  { id: '25', name: '22Bet', logo: '/logos/22bet.png', rating: 3.5, bonus: 'Fino a €122', website: '22bet.it', country: 'Curacao' },
  
  // Bookmaker UK affidabili
  { id: '26', name: 'Ladbrokes', logo: '/logos/ladbrokes.png', rating: 4.2, bonus: 'Fino a €100', website: 'ladbrokes.it', country: 'UK' },
  { id: '27', name: 'Paddy Power', logo: '/logos/paddypower.png', rating: 4.0, bonus: 'Fino a €100', website: 'paddypower.it', country: 'Irlanda' },
  { id: '28', name: 'Betvictor', logo: '/logos/betvictor.png', rating: 3.9, bonus: 'Fino a €100', website: 'betvictor.it', country: 'UK' },
  { id: '29', name: 'Coral', logo: '/logos/coral.png', rating: 3.8, bonus: 'Fino a €100', website: 'coral.it', country: 'UK' },
  { id: '30', name: 'Betfred', logo: '/logos/betfred.png', rating: 3.7, bonus: 'Fino a €100', website: 'betfred.it', country: 'UK' },
  
  // Bookmaker europei verificati
  { id: '31', name: 'Betsson', logo: '/logos/betsson.png', rating: 3.8, bonus: 'Fino a €50', website: 'betsson.it', country: 'Svezia' },
  { id: '32', name: 'Betsafe', logo: '/logos/betsafe.png', rating: 3.6, bonus: 'Fino a €100', website: 'betsafe.it', country: 'Malta' },
  { id: '33', name: 'Nordicbet', logo: '/logos/nordicbet.png', rating: 3.5, bonus: 'Fino a €200', website: 'nordicbet.it', country: 'Malta' },
  { id: '34', name: 'Tipico', logo: '/logos/tipico.png', rating: 3.4, bonus: 'Fino a €100', website: 'tipico.it', country: 'Germania' },
  { id: '35', name: 'Interwetten', logo: '/logos/interwetten.png', rating: 3.3, bonus: 'Fino a €100', website: 'interwetten.it', country: 'Austria' },
  
  // Exchange e bookmaker specializzati
  { id: '36', name: 'Betfair Exchange', logo: '/logos/betfair-exchange.png', rating: 4.3, bonus: 'Commissioni ridotte', website: 'betfair.it', country: 'UK' },
  { id: '37', name: 'Smarkets', logo: '/logos/smarkets.png', rating: 4.0, bonus: 'Commissioni ridotte', website: 'smarkets.it', country: 'UK' },
  { id: '38', name: 'Betdaq', logo: '/logos/betdaq.png', rating: 3.7, bonus: 'Commissioni ridotte', website: 'betdaq.it', country: 'Malta' },
  { id: '39', name: 'Matchbook', logo: '/logos/matchbook.png', rating: 3.6, bonus: 'Commissioni ridotte', website: 'matchbook.it', country: 'Malta' },
  { id: '40', name: '10Bet', logo: '/logos/10bet.png', rating: 3.4, bonus: 'Fino a €100', website: '10bet.it', country: 'Malta' },
  
  // Bookmaker con licenza italiana aggiuntivi
  { id: '41', name: 'Admiral', logo: '/logos/admiral.png', rating: 3.2, bonus: 'Fino a €100', website: 'admiralbet.it', country: 'Italia' },
  { id: '42', name: 'Vincitu', logo: '/logos/vincitu.png', rating: 3.1, bonus: 'Fino a €200', website: 'vincitu.it', country: 'Italia' },
  { id: '43', name: 'Cplay', logo: '/logos/cplay.png', rating: 3.0, bonus: 'Fino a €150', website: 'cplay.it', country: 'Italia' },
  { id: '44', name: 'Betaland', logo: '/logos/betaland.png', rating: 2.9, bonus: 'Fino a €50', website: 'betaland.it', country: 'Italia' },
  { id: '45', name: 'Winamax', logo: '/logos/winamax.png', rating: 3.8, bonus: 'Fino a €100', website: 'winamax.it', country: 'Francia' },
  
  // Bookmaker internazionali con buona reputazione
  { id: '46', name: 'Parimatch', logo: '/logos/parimatch.png', rating: 3.7, bonus: 'Fino a €100', website: 'parimatch.it', country: 'Malta' },
  { id: '47', name: 'Librabet', logo: '/logos/librabet.png', rating: 3.4, bonus: 'Fino a €100', website: 'librabet.it', country: 'Malta' },
  { id: '48', name: 'Rabona', logo: '/logos/rabona.png', rating: 3.3, bonus: 'Fino a €500', website: 'rabona.it', country: 'Malta' },
  { id: '49', name: 'Campobet', logo: '/logos/campobet.png', rating: 3.2, bonus: 'Fino a €100', website: 'campobet.it', country: 'Malta' },
  { id: '50', name: '32Red', logo: '/logos/32red.png', rating: 3.5, bonus: 'Fino a €100', website: '32red.it', country: 'Malta' }
];

export const sports: Sport[] = [
  { id: 'calcio', name: 'Calcio', icon: '⚽', isPopular: true },
  { id: 'tennis', name: 'Tennis', icon: '🎾', isPopular: true },
  { id: 'basket', name: 'Basket', icon: '🏀', isPopular: true },
  { id: 'volley', name: 'Volley', icon: '🏐', isPopular: true },
  { id: 'rugby', name: 'Rugby', icon: '🏉', isPopular: false },
  { id: 'hockey', name: 'Hockey', icon: '🏒', isPopular: false },
  { id: 'baseball', name: 'Baseball', icon: '⚾', isPopular: false },
  { id: 'golf', name: 'Golf', icon: '⛳', isPopular: false },
  { id: 'boxe', name: 'Boxe', icon: '🥊', isPopular: false },
  { id: 'mma', name: 'MMA', icon: '🥋', isPopular: false },
];

export const leagues: League[] = [
  // Calcio
  { id: 'serie-a', name: 'Serie A', country: 'Italia', sport: 'calcio', logo: '/leagues/serie-a.png', isPopular: true },
  { id: 'premier-league', name: 'Premier League', country: 'Inghilterra', sport: 'calcio', logo: '/leagues/premier-league.png', isPopular: true },
  { id: 'la-liga', name: 'La Liga', country: 'Spagna', sport: 'calcio', logo: '/leagues/la-liga.png', isPopular: true },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germania', sport: 'calcio', logo: '/leagues/bundesliga.png', isPopular: true },
  { id: 'ligue-1', name: 'Ligue 1', country: 'Francia', sport: 'calcio', logo: '/leagues/ligue-1.png', isPopular: true },
  { id: 'champions-league', name: 'Champions League', country: 'Europa', sport: 'calcio', logo: '/leagues/champions-league.png', isPopular: true },
  { id: 'europa-league', name: 'Europa League', country: 'Europa', sport: 'calcio', logo: '/leagues/europa-league.png', isPopular: true },
  
  // Tennis
  { id: 'atp', name: 'ATP Tour', country: 'Mondiale', sport: 'tennis', logo: '/leagues/atp.png', isPopular: true },
  { id: 'wta', name: 'WTA Tour', country: 'Mondiale', sport: 'tennis', logo: '/leagues/wta.png', isPopular: true },
  { id: 'grand-slam', name: 'Grand Slam', country: 'Mondiale', sport: 'tennis', logo: '/leagues/grand-slam.png', isPopular: true },
  
  // Basket
  { id: 'nba', name: 'NBA', country: 'USA', sport: 'basket', logo: '/leagues/nba.png', isPopular: true },
  { id: 'euroleague', name: 'EuroLeague', country: 'Europa', sport: 'basket', logo: '/leagues/euroleague.png', isPopular: true },
  { id: 'serie-a-basket', name: 'Serie A Basket', country: 'Italia', sport: 'basket', logo: '/leagues/serie-a-basket.png', isPopular: true },
];

// Database squadre reali per categoria
const REAL_TEAMS = {
  'serie-a': [
    'Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina',
    'Bologna', 'Torino', 'Udinese', 'Sassuolo', 'Verona', 'Genoa', 'Cagliari', 'Lecce',
    'Empoli', 'Monza', 'Frosinone', 'Salernitana'
  ],
  'premier-league': [
    'Manchester City', 'Arsenal', 'Liverpool', 'Aston Villa', 'Tottenham', 'Chelsea',
    'Newcastle', 'Manchester United', 'West Ham', 'Crystal Palace', 'Brighton', 'Bournemouth',
    'Fulham', 'Wolves', 'Everton', 'Brentford', 'Nottingham Forest', 'Luton Town',
    'Burnley', 'Sheffield United'
  ],
  'la-liga': [
    'Real Madrid', 'Barcelona', 'Girona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad',
    'Valencia', 'Betis', 'Las Palmas', 'Getafe', 'Alaves', 'Sevilla', 'Osasuna', 'Villarreal',
    'Rayo Vallecano', 'Celta Vigo', 'Mallorca', 'Cadiz', 'Granada', 'Almeria'
  ],
  'bundesliga': [
    'Bayer Leverkusen', 'Bayern Munich', 'VfB Stuttgart', 'RB Leipzig', 'Borussia Dortmund',
    'Eintracht Frankfurt', 'Freiburg', 'Hoffenheim', 'Heidenheim', 'Werder Bremen',
    'Augsburg', 'Monchengladbach', 'Wolfsburg', 'Mainz', 'Union Berlin', 'Bochum',
    'Koln', 'Darmstadt'
  ],
  'ligue-1': [
    'PSG', 'Monaco', 'Brest', 'Lille', 'Nice', 'Lens', 'Lyon', 'Marseille', 'Montpellier',
    'Rennes', 'Reims', 'Strasbourg', 'Le Havre', 'Toulouse', 'Nantes', 'Lorient',
    'Metz', 'Clermont'
  ],
  'champions-league': [
    'Real Madrid', 'Manchester City', 'Bayern Munich', 'PSG', 'Arsenal', 'Barcelona',
    'Atletico Madrid', 'Borussia Dortmund', 'Inter', 'Napoli', 'AC Milan', 'Porto',
    'Benfica', 'PSV', 'Lazio', 'Real Sociedad'
  ]
};

const TENNIS_PLAYERS = [
  'Novak Djokovic', 'Carlos Alcaraz', 'Daniil Medvedev', 'Jannik Sinner', 'Andrey Rublev',
  'Stefanos Tsitsipas', 'Holger Rune', 'Casper Ruud', 'Hubert Hurkacz', 'Taylor Fritz',
  'Alex de Minaur', 'Grigor Dimitrov', 'Tommy Paul', 'Ben Shelton', 'Frances Tiafoe',
  'Iga Swiatek', 'Aryna Sabalenka', 'Coco Gauff', 'Elena Rybakina', 'Jessica Pegula',
  'Ons Jabeur', 'Marketa Vondrousova', 'Qinwen Zheng', 'Maria Sakkari', 'Barbora Krejcikova'
];

const NBA_TEAMS = [
  'Los Angeles Lakers', 'Boston Celtics', 'Golden State Warriors', 'Miami Heat',
  'Milwaukee Bucks', 'Phoenix Suns', 'Philadelphia 76ers', 'Brooklyn Nets',
  'Denver Nuggets', 'Memphis Grizzlies', 'Dallas Mavericks', 'New York Knicks',
  'Cleveland Cavaliers', 'New Orleans Pelicans', 'Sacramento Kings', 'Atlanta Hawks',
  'Minnesota Timberwolves', 'Los Angeles Clippers', 'Chicago Bulls', 'Toronto Raptors',
  'Indiana Pacers', 'Orlando Magic', 'Utah Jazz', 'Washington Wizards',
  'Oklahoma City Thunder', 'Houston Rockets', 'San Antonio Spurs', 'Portland Trail Blazers',
  'Charlotte Hornets', 'Detroit Pistons'
];

const EUROLEAGUE_TEAMS = [
  'Real Madrid', 'Barcelona', 'Fenerbahce', 'Panathinaikos', 'Olympiacos',
  'Zalgiris Kaunas', 'Crvena Zvezda', 'Partizan', 'CSKA Moscow', 'Anadolu Efes',
  'Bayern Munich', 'Alba Berlin', 'Virtus Bologna', 'EA7 Emporio Armani Milano',
  'ASVEL', 'Monaco', 'Maccabi Tel Aviv', 'Baskonia'
];

// Funzione per generare quote realistiche basate sulla forza delle squadre
const generateRealisticOdds = (homeTeam: string, awayTeam: string, league: string, bookmaker: string) => {
  // Coefficienti di forza per le squadre (più alto = più forte)
  const getTeamStrength = (team: string, league: string): number => {
    const strengthMap: { [key: string]: { [team: string]: number } } = {
      'serie-a': {
        'Juventus': 85, 'Inter': 88, 'Milan': 82, 'Napoli': 84, 'Roma': 78, 'Lazio': 76,
        'Atalanta': 80, 'Fiorentina': 72, 'Bologna': 68, 'Torino': 65
      },
      'premier-league': {
        'Manchester City': 95, 'Arsenal': 88, 'Liverpool': 90, 'Chelsea': 82, 'Tottenham': 80,
        'Manchester United': 78, 'Newcastle': 76, 'West Ham': 70
      },
      'la-liga': {
        'Real Madrid': 92, 'Barcelona': 88, 'Atletico Madrid': 85, 'Athletic Bilbao': 75,
        'Real Sociedad': 73, 'Valencia': 70, 'Betis': 72, 'Sevilla': 74
      },
      'bundesliga': {
        'Bayern Munich': 90, 'Borussia Dortmund': 82, 'RB Leipzig': 80, 'Bayer Leverkusen': 85,
        'Eintracht Frankfurt': 72, 'Freiburg': 68, 'Hoffenheim': 65
      }
    };

    return strengthMap[league]?.[team] || 70; // Default strength
  };

  const homeStrength = getTeamStrength(homeTeam, league);
  const awayStrength = getTeamStrength(awayTeam, league);
  
  // Vantaggio casa
  const homeAdvantage = 5;
  const adjustedHomeStrength = homeStrength + homeAdvantage;
  
  // Calcola probabilità
  const totalStrength = adjustedHomeStrength + awayStrength;
  const homeProbability = adjustedHomeStrength / totalStrength;
  const awayProbability = awayStrength / totalStrength;
  const drawProbability = 0.25; // 25% probabilità pareggio per il calcio
  
  // Converti in quote (con margine bookmaker del 5-8%)
  const margin = 1.05 + Math.random() * 0.03; // 5-8% margine
  
  let homeOdds = (1 / homeProbability) * margin;
  let awayOdds = (1 / awayProbability) * margin;
  let drawOdds = (1 / drawProbability) * margin;
  
  // Aggiungi variazione casuale per simulare differenze tra bookmaker
  const variation = 0.95 + Math.random() * 0.1; // ±5% variazione
  homeOdds *= variation;
  awayOdds *= variation;
  drawOdds *= variation;
  
  return {
    home: Math.round(homeOdds * 100) / 100,
    draw: Math.round(drawOdds * 100) / 100,
    away: Math.round(awayOdds * 100) / 100,
    bookmaker,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000) // Ultimo aggiornamento entro 1 ora
  };
};

// Funzione per generare quote tennis (senza pareggio)
const generateTennisOdds = (player1: string, player2: string, bookmaker: string) => {
  const player1Odds = 1.3 + Math.random() * 2.5; // 1.3 - 3.8
  const player2Odds = 1.3 + Math.random() * 2.5; // 1.3 - 3.8
  
  return {
    home: Math.round(player1Odds * 100) / 100,
    away: Math.round(player2Odds * 100) / 100,
    bookmaker,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000)
  };
};

// Funzione per generare quote basket (senza pareggio)
const generateBasketOdds = (team1: string, team2: string, bookmaker: string) => {
  const team1Odds = 1.4 + Math.random() * 2.0; // 1.4 - 3.4
  const team2Odds = 1.4 + Math.random() * 2.0; // 1.4 - 3.4
  
  return {
    home: Math.round(team1Odds * 100) / 100,
    away: Math.round(team2Odds * 100) / 100,
    bookmaker,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000)
  };
};

// Funzione per ottenere squadre casuali da un campionato
const getRandomTeams = (league: string, count: number = 2): string[] => {
  const teams = REAL_TEAMS[league as keyof typeof REAL_TEAMS] || [];
  const shuffled = [...teams].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Genera partite con nomi reali
export const matches: Match[] = [
  // SERIE A - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('serie-a');
    return {
      id: `serie-a-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'serie-a',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000), // Prossimi giorni
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 15 + Math.floor(Math.random() * 10)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'serie-a', b.name)
      )
    };
  }),

  // PREMIER LEAGUE - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('premier-league');
    return {
      id: `premier-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'premier-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 10)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'premier-league', b.name)
      )
    };
  }),

  // LA LIGA - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('la-liga');
    return {
      id: `laliga-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'la-liga',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 18 + Math.floor(Math.random() * 10)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'la-liga', b.name)
      )
    };
  }),

  // BUNDESLIGA - 6 partite
  ...Array.from({ length: 6 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('bundesliga');
    return {
      id: `bundesliga-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'bundesliga',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 16 + Math.floor(Math.random() * 8)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'bundesliga', b.name)
      )
    };
  }),

  // CHAMPIONS LEAGUE - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('champions-league');
    return {
      id: `ucl-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'champions-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 2) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 25 + Math.floor(Math.random() * 15)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'champions-league', b.name)
      )
    };
  }),

  // TENNIS ATP - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const players = [...TENNIS_PLAYERS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `atp-${i + 1}`,
      homeTeam: players[0],
      awayTeam: players[1],
      league: 'atp',
      sport: 'tennis',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 10)).map(b => 
        generateTennisOdds(players[0], players[1], b.name)
      )
    };
  }),

  // NBA - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const teams = [...NBA_TEAMS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `nba-${i + 1}`,
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: 'nba',
      sport: 'basket',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 18 + Math.floor(Math.random() * 8)).map(b => 
        generateBasketOdds(teams[0], teams[1], b.name)
      )
    };
  }),

  // EUROLEAGUE - 6 partite
  ...Array.from({ length: 6 }, (_, i) => {
    const teams = [...EUROLEAGUE_TEAMS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `euroleague-${i + 1}`,
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: 'euroleague',
      sport: 'basket',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 15 + Math.floor(Math.random() * 8)).map(b => 
        generateBasketOdds(teams[0], teams[1], b.name)
      )
    };
  })
]; 