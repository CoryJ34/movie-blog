export interface Matchup {
  a: string;
  b: string;
  winner: string;
  blurb: string;
}

export interface Round {
  round: string;
  matchups: Matchup[];
}
