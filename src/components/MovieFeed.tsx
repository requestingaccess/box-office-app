'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction, MovieStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/scoring';
import { Clock, Lock, CheckCircle2, TrendingUp, Sparkles, Filter, Search, Award } from 'lucide-react';

interface MovieFeedProps {
  movies: Movie[];
  userPredictions: Prediction[];
  onOpenPredictionModal: (movie: Movie) => void;
}

export const MovieFeed: React.FC<MovieFeedProps> = ({ movies, userPredictions, onOpenPredictionModal }) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'locked' | 'scored'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Countdown timer for Thursday 3 PM EST lock
  useEffect(() => {
    const updateCountdown = () => {
      const targetThursday = new Date();
      targetThursday.setDate(targetThursday.getDate() + ((4 + 7 - targetThursday.getDay()) % 7));
      targetThursday.setHours(15, 0, 0, 0); // 3:00 PM EST

      const diff = targetThursday.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeRemaining('LOCKED');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === 'open') return m.status === 'open';
    if (filter === 'locked') return m.status === 'locked' || m.status === 'estimated';
    if (filter === 'scored') return m.status === 'scored';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-amber-500/20 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Domestic Opening Weekend predictions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Predict The <span className="gold-gradient-text">Box Office</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Lock in your opening weekend domestic revenue guesses before <span className="text-amber-400 font-semibold">Thursday 3:00 PM EST</span>. Early predictions earn up to <span className="text-emerald-400 font-semibold">1.25x point multipliers</span>!
            </p>
          </div>

          {/* Thursday Lock Timer Widget */}
          <div className="w-full md:w-auto glass-panel p-4 rounded-xl border border-slate-700 bg-slate-900/90 flex flex-col items-center justify-center min-w-[200px]">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-semibold uppercase tracking-wider">Thursday Lock Timer</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-wider font-mono">
              {timeRemaining || 'Loading...'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Locks Thu @ 3:00 PM EST</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            All Wide Releases ({movies.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              filter === 'open'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Open Predictions ({movies.filter((m) => m.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              filter === 'locked'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            In Weekend / Locked ({movies.filter((m) => m.status === 'locked' || m.status === 'estimated').length})
          </button>
          <button
            onClick={() => setFilter('scored')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              filter === 'scored'
                ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Scored Movies ({movies.filter((m) => m.status === 'scored').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movie title or genre..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => {
          const userPred = userPredictions.find((p) => p.movieId === movie.id);

          return (
            <div
              key={movie.id}
              className="glass-panel-interactive rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Poster Backdrop Header */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={movie.backdropPath || movie.posterPath}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {movie.status === 'open' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>OPEN FOR GUESSES</span>
                    </span>
                  )}
                  {movie.status === 'locked' && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED (WEEKEND IN PROGRESS)</span>
                    </span>
                  )}
                  {movie.status === 'estimated' && (
                    <span className="px-3 py-1 rounded-full bg-indigo-500/90 text-white text-xs font-bold shadow-lg flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>PROVISIONAL ESTIMATES</span>
                    </span>
                  )}
                  {movie.status === 'scored' && (
                    <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-amber-400 text-xs font-bold shadow-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-amber-400" />
                      <span>OFFICIALLY SCORED</span>
                    </span>
                  )}
                </div>

                {/* Release Date */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-slate-300 border border-slate-700">
                  Release: {movie.releaseDate}
                </div>

                {/* Genres */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center space-x-1.5 overflow-x-auto">
                  {movie.genre.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-md bg-slate-900/70 text-[10px] font-medium text-slate-300 border border-slate-800">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Box Office Numbers Section */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Weekend Actual / Est.</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {movie.actualRevenue ? formatCurrency(movie.actualRevenue) : movie.estimateRevenue ? formatCurrency(movie.estimateRevenue) + ' (Est)' : 'Awaiting Weekend'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Your Guess</span>
                    <span className="text-sm font-extrabold text-amber-400 font-mono">
                      {userPred ? formatCurrency(userPred.predictedRevenue) : 'No Prediction'}
                    </span>
                  </div>
                </div>

                {/* User Score Badge if Scored */}
                {userPred && userPred.scoreAwarded !== null && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-300">Score Yield:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400">({userPred.errorPercentage}% err)</span>
                      <span className={`text-sm font-black ${userPred.scoreAwarded > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {userPred.scoreAwarded > 0 ? `+${userPred.scoreAwarded}` : userPred.scoreAwarded} pts
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {movie.status === 'open' && (
                  <button
                    onClick={() => onOpenPredictionModal(movie)}
                    className="w-full py-2.5 px-4 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{userPred ? 'Update Prediction' : 'Predict Domestic Opening'}</span>
                  </button>
                )}

                {movie.status !== 'open' && (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-slate-500 font-bold text-xs uppercase cursor-not-allowed border border-slate-800 flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Predictions Locked</span>
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
