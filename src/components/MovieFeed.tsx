'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { formatCurrency } from '@/lib/scoring';
import { Clock, Lock, CheckCircle2, TrendingUp, Ticket, Search, Award } from 'lucide-react';

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
      
      {/* Box Office Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl paper-panel p-6 sm:p-8 border-2 border-stone-400 shadow-md bg-[#fcf9f2]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>DOMESTIC OPENING WEEKEND ADMISSION KIOSK</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 font-serif">
              Box Office <span className="text-amber-700 underline decoration-amber-500/50">Ticket Stub Predictions</span>
            </h1>
            <p className="mt-2 text-sm text-stone-700 max-w-2xl leading-relaxed">
              Punch your revenue guesses into the official kiosk stubs before <strong className="text-stone-950">Thursday 3:00 PM EST</strong>. Submissions &ge;14 days early earn a <span className="text-emerald-700 font-extrabold">1.25x point multiplier stamp</span>!
            </p>
          </div>

          {/* Thursday Lock Timer Box Office Sign */}
          <div className="w-full md:w-auto p-4 rounded-xl border-2 border-stone-800 bg-[#1c1917] text-stone-100 flex flex-col items-center justify-center min-w-[220px] shadow-lg">
            <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>THURSDAY LOCK TIMER</span>
            </div>
            <div className="text-2xl font-black text-amber-400 tracking-wider font-mono">
              {timeRemaining || 'Loading...'}
            </div>
            <div className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">Locks Thu @ 3:00 PM EST</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Ticket Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 ${
              filter === 'all'
                ? 'bg-amber-700 text-amber-50 border-amber-900 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 border-stone-300 hover:bg-[#e8dec7]'
            }`}
          >
            All Releases ({movies.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 ${
              filter === 'open'
                ? 'bg-emerald-700 text-emerald-50 border-emerald-900 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 border-stone-300 hover:bg-[#e8dec7]'
            }`}
          >
            Open Predictions ({movies.filter((m) => m.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 ${
              filter === 'locked'
                ? 'bg-stone-800 text-stone-50 border-stone-950 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 border-stone-300 hover:bg-[#e8dec7]'
            }`}
          >
            Locked Weekend ({movies.filter((m) => m.status === 'locked' || m.status === 'estimated').length})
          </button>
          <button
            onClick={() => setFilter('scored')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 ${
              filter === 'scored'
                ? 'bg-red-700 text-red-50 border-red-900 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 border-stone-300 hover:bg-[#e8dec7]'
            }`}
          >
            Scored Movies ({movies.filter((m) => m.status === 'scored').length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title or genre..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#fcf9f2] border-2 border-stone-300 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-700 transition-all font-semibold"
          />
        </div>
      </div>

      {/* Perforated Ticket Stub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie, idx) => {
          const userPred = userPredictions.find((p) => p.movieId === movie.id);
          const serialNum = `STUB-2026-${(1000 + idx * 47).toString()}`;

          return (
            <div key={movie.id} className="ticket-stub rounded-2xl p-5 flex flex-col justify-between group overflow-hidden">
              
              {/* Left & Right Perforated Side Cutout Notches */}
              <div className="ticket-notch-left" />
              <div className="ticket-notch-right" />

              {/* Ticket Top Serial Header */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-3 text-[10px] font-mono font-bold text-stone-500">
                <span className="flex items-center space-x-1">
                  <Ticket className="w-3 h-3 text-amber-700" />
                  <span>{serialNum}</span>
                </span>
                <span>ADMIT ONE &bull; 3-DAY DOMESTIC</span>
              </div>

              {/* Movie Backdrop & Title */}
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-stone-300 bg-stone-900">
                  <img
                    src={movie.backdropPath || movie.posterPath}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                  {/* Ink Stamp Badge overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    {movie.status === 'open' && (
                      <span className="ink-stamp ink-stamp-green text-[10px]">
                        [ OPEN FOR GUESSES ]
                      </span>
                    )}
                    {movie.status === 'locked' && (
                      <span className="ink-stamp ink-stamp-gold text-[10px]">
                        [ LOCKED WEEKEND ]
                      </span>
                    )}
                    {movie.status === 'estimated' && (
                      <span className="ink-stamp ink-stamp-gold text-[10px]">
                        [ PROVISIONAL EST ]
                      </span>
                    )}
                    {movie.status === 'scored' && (
                      <span className="ink-stamp ink-stamp-red text-[10px]">
                        [ SCORED & FINAL ]
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-3 text-[10px] font-mono font-bold text-stone-200 bg-stone-900/80 px-2 py-0.5 rounded">
                    Release: {movie.releaseDate}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-stone-900 font-serif group-hover:text-amber-800 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
                    {movie.overview}
                  </p>
                </div>
              </div>

              {/* Ticket Stub Perforation Divider */}
              <div className="ticket-perforation" />

              {/* Revenue & Guess Box Office Ticket Section */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 bg-[#f4efdf] p-3 rounded-xl border border-stone-300">
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-500 block tracking-wider">Actual / Est.</span>
                    <span className="text-sm font-black text-emerald-800 font-mono">
                      {movie.actualRevenue ? formatCurrency(movie.actualRevenue) : movie.estimateRevenue ? formatCurrency(movie.estimateRevenue) + ' (Est)' : 'Awaiting'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-500 block tracking-wider">Your Prediction</span>
                    <span className="text-sm font-black text-amber-800 font-mono">
                      {userPred ? formatCurrency(userPred.predictedRevenue) : 'No Prediction'}
                    </span>
                  </div>
                </div>

                {/* Score Yield Badge if Scored */}
                {userPred && userPred.scoreAwarded !== null && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-100 border border-amber-400">
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-[11px] font-bold text-amber-950">Points Yield:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-stone-600">({userPred.errorPercentage}% err)</span>
                      <span className={`text-xs font-black font-mono ${userPred.scoreAwarded > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {userPred.scoreAwarded > 0 ? `+${userPred.scoreAwarded}` : userPred.scoreAwarded} pts
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {movie.status === 'open' && (
                  <button
                    onClick={() => onOpenPredictionModal(movie)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 border-2 border-amber-900 text-amber-50 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{userPred ? 'RE-PUNCH TICKET' : 'PUNCH TICKET GUESS'}</span>
                  </button>
                )}

                {movie.status !== 'open' && (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-300 text-stone-500 font-black text-xs uppercase cursor-not-allowed border border-stone-400 flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>TICKET LOCKED</span>
                  </button>
                )}

                {/* Barcode Graphic Footer */}
                <div className="flex items-center justify-center space-x-1 pt-1 opacity-40">
                  <div className="h-4 w-1 bg-stone-900" />
                  <div className="h-4 w-2 bg-stone-900" />
                  <div className="h-4 w-0.5 bg-stone-900" />
                  <div className="h-4 w-1.5 bg-stone-900" />
                  <div className="h-4 w-3 bg-stone-900" />
                  <div className="h-4 w-1 bg-stone-900" />
                  <div className="h-4 w-2 bg-stone-900" />
                  <div className="h-4 w-0.5 bg-stone-900" />
                  <div className="h-4 w-1.5 bg-stone-900" />
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
