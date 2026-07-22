export type MovieStatus = 'hidden' | 'open' | 'locked' | 'estimated' | 'scored';

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Movie {
  id: string;
  seasonId: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string; // YYYY-MM-DD (Friday release date)
  lockTime: string;    // ISO timestamp (Thursday 3:00 PM EST)
  status: MovieStatus;
  estimateRevenue: number | null; // Box Office Mojo estimated weekend gross ($)
  actualRevenue: number | null;   // Box Office Mojo final actual weekend gross ($)
  genre: string[];
}

export interface Prediction {
  id: string;
  userId: string;
  movieId: string;
  predictedRevenue: number; // User guess in $
  scoreAwarded: number | null;
  submittedAt: string; // ISO timestamp
  earlyBirdMultiplier: number;
  errorPercentage: number | null;
}

export interface LeaderboardStanding {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  seasonId: string;
  totalPoints: number;
  predictionsCount: number;
  averageScore: number;
  isQualified: boolean; // Minimum 5 predictions required
}

export interface ScoringResult {
  errorPercentage: number;
  rawScore: number;
  finalScore: number;
  earlyBirdMultiplier: number;
  daysInAdvance: number;
}
