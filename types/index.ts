export interface Bookmaker {
  id: string;
  name: string;
  logo?: string;
  rating?: number;
  bonus?: string;
  website?: string;
  url: string;
  isPopular?: boolean;
  country: string;
  region: string;
  verified: boolean;
  category: string;
}

export interface Odds {
  home: number;
  draw?: number;
  away: number;
  bookmaker: string;
  lastUpdated: Date;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  date: Date;
  status: 'upcoming' | 'live' | 'finished';
  odds: Odds[];
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  sport: string;
  logo: string;
  isPopular?: boolean;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  isPopular?: boolean;
}

export interface BestOdds {
  home: {
    odds: number;
    bookmaker: string;
  };
  draw?: {
    odds: number;
    bookmaker: string;
  };
  away: {
    odds: number;
    bookmaker: string;
  };
}

export interface FilterOptions {
  sport?: string;
  league?: string;
  date?: string;
  bookmaker?: string;
  minOdds?: number;
  maxOdds?: number;
}

export interface ComparisonResult {
  match: Match;
  bestOdds: BestOdds;
  profitMargin: number;
  arbitrageOpportunity?: boolean;
} 