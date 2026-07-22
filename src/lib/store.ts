import { Movie, Prediction, User, LeaderboardStanding } from './types';
import { INITIAL_MOVIES, INITIAL_PREDICTIONS, INITIAL_USERS, CURRENT_SEASON } from './seed';
import { calculateScore } from './scoring';

// In-memory data store with state management
class DataStore {
  private movies: Movie[] = [...INITIAL_MOVIES];
  private predictions: Prediction[] = [...INITIAL_PREDICTIONS];
  private users: User[] = [...INITIAL_USERS];
  private activeUserId: string = 'user-you';

  public getMovies(): Movie[] {
    return this.movies;
  }

  public getMovieById(id: string): Movie | undefined {
    return this.movies.find((m) => m.id === id);
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getActiveUser(): User {
    return this.users.find((u) => u.id === this.activeUserId) || this.users[0];
  }

  public setActiveUser(userId: string): void {
    this.activeUserId = userId;
  }

  public getPredictions(): Prediction[] {
    return this.predictions;
  }

  public getUserPredictions(userId: string): Prediction[] {
    return this.predictions.filter((p) => p.userId === userId);
  }

  public getPredictionForMovie(userId: string, movieId: string): Prediction | undefined {
    return this.predictions.find((p) => p.userId === userId && p.movieId === movieId);
  }

  public submitPrediction(userId: string, movieId: string, predictedRevenue: number): { success: boolean; message: string; prediction?: Prediction } {
    const movie = this.getMovieById(movieId);
    if (!movie) {
      return { success: false, message: 'Movie not found.' };
    }

    if (movie.status !== 'open') {
      return { success: false, message: `Predictions are locked for this movie (Status: ${movie.status}).` };
    }

    const nowIso = new Date().toISOString();
    const existingIndex = this.predictions.findIndex((p) => p.userId === userId && p.movieId === movieId);

    const submission: Prediction = {
      id: existingIndex >= 0 ? this.predictions[existingIndex].id : `pred-${Date.now()}`,
      userId,
      movieId,
      predictedRevenue,
      scoreAwarded: null,
      submittedAt: nowIso,
      earlyBirdMultiplier: 1.0,
      errorPercentage: null,
    };

    if (existingIndex >= 0) {
      this.predictions[existingIndex] = submission;
    } else {
      this.predictions.push(submission);
    }

    return { success: true, message: 'Prediction submitted successfully!', prediction: submission };
  }

  public getLeaderboard(): LeaderboardStanding[] {
    // Group predictions by user for the active season
    const standings: LeaderboardStanding[] = this.users.map((user) => {
      const userPreds = this.predictions.filter((p) => p.userId === user.id && p.scoreAwarded !== null);
      const predictionsCount = userPreds.length;
      const totalPoints = userPreds.reduce((sum, p) => sum + (p.scoreAwarded || 0), 0);
      const averageScore = predictionsCount > 0 ? totalPoints / predictionsCount : 0;
      const isQualified = predictionsCount >= 5;

      return {
        id: `standing-${user.id}`,
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        seasonId: CURRENT_SEASON.id,
        totalPoints: Math.round(totalPoints * 10) / 10,
        predictionsCount,
        averageScore: Math.round(averageScore * 10) / 10,
        isQualified,
      };
    });

    // Sort strictly by averageScore descending (Qualified players first, then unqualified)
    return standings.sort((a, b) => {
      if (a.isQualified !== b.isQualified) {
        return a.isQualified ? -1 : 1;
      }
      return b.averageScore - a.averageScore;
    });
  }

  // --- Automation Pipeline Simulation Methods ---

  public runJob1TmdbSync(): { syncedMoviesCount: number; openedCount: number } {
    // Sync new movies and open any movies <= 30 days from release
    let openedCount = 0;
    const now = new Date();

    this.movies.forEach((m) => {
      const releaseDate = new Date(m.releaseDate);
      const diffDays = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (m.status === 'hidden' || (diffDays <= 30 && m.status === 'hidden')) {
        m.status = 'open';
        openedCount++;
      }
    });

    return { syncedMoviesCount: this.movies.length, openedCount };
  }

  public runJob2LockPredictions(): { lockedMovies: string[] } {
    // Locks predictions for movies releasing this weekend (status -> locked)
    const lockedMovies: string[] = [];
    this.movies.forEach((m) => {
      if (m.status === 'open' && m.title.includes('Deadpool')) {
        m.status = 'locked';
        lockedMovies.push(m.title);
      }
    });

    return { lockedMovies };
  }

  public runJob3EstimateScraper(): { updatedMovies: { title: string; estimate: number }[] } {
    // Scrapes Box Office Mojo weekend estimates
    const updatedMovies: { title: string; estimate: number }[] = [];
    this.movies.forEach((m) => {
      if (m.status === 'locked' || m.id === 'movie-1') {
        m.status = 'estimated';
        m.estimateRevenue = 205000000; // $205M estimated opening
        updatedMovies.push({ title: m.title, estimate: 205000000 });
      }
    });

    return { updatedMovies };
  }

  public runJob4ActualsAndScoring(): { scoredMoviesCount: number; predictionsScoredCount: number } {
    // Scrapes official actuals, scores predictions, updates leaderboards
    let predictionsScoredCount = 0;
    let scoredMoviesCount = 0;

    this.movies.forEach((m) => {
      if (m.status === 'estimated' || m.id === 'movie-1') {
        m.status = 'scored';
        m.actualRevenue = 211430000; // $211.43M actual
        scoredMoviesCount++;

        // Score all predictions for this movie
        this.predictions.forEach((p) => {
          if (p.movieId === m.id) {
            const scoring = calculateScore(p.predictedRevenue, m.actualRevenue!, p.submittedAt, m.releaseDate);
            p.scoreAwarded = scoring.finalScore;
            p.errorPercentage = scoring.errorPercentage;
            p.earlyBirdMultiplier = scoring.earlyBirdMultiplier;
            predictionsScoredCount++;
          }
        });
      }
    });

    return { scoredMoviesCount, predictionsScoredCount };
  }
}

export const store = new DataStore();
