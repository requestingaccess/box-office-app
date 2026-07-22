'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { formatCurrency } from '@/lib/scoring';
import { Clock, Lock, CheckCircle2, TrendingUp, Search, Ticket, Sparkles } from 'lucide-react';

interface MovieFeedProps {
  movies: Movie[];
  userPredictions: Prediction[];
  onOpenPredictionModal: (movie: Movie) => void;
}

export const MovieFeed: React.FC<MovieFeedProps> = ({ movies, userPredictions, onOpenPredictionModal }) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'locked' | 'scored'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Thursday 3 PM EST Countdown
  useEffect(() => {
    const updateCountdown = () => {
      const targetThursday = new Date();
      targetThursday.setDate(targetThursday.getDate() + ((4 + 7 - targetThursday.getDay()) % 7));
      targetThursday.setHours(15, 0, 0, 0);

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
      
      {/* Box Office Ticket Window Marquee Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-6 sm:p-8 border-2 border-amber-500/50 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold font-ledger mb-3 uppercase tracking-widest">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Official Box Office Ticket Window</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-amber-400 uppercase tracking-wider font-ledger">
              BOX OFFICE <span className="text-white">PREDICTIONS</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-amber-100/80 max-w-2xl font-ledger">
              Select an upcoming wide-release movie below to issue your domestic opening weekend revenue ticket stub before <span className="text-amber-300 font-bold underline">Thursday 3:00 PM EST</span>.
            </p>
          </div>

          {/* Thursday Lock Timer Display */}
          <div className="w-full md:w-auto bg-slate-950 p-4 rounded-xl border-2 border-amber-500/60 text-center min-w-[220px] shadow-inner">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-ledger mb-1 flex items-center justify-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>THURSDAY LOCK TIMER</span>
            </div>
            <div className="text-2xl font-black text-white font-ledger tracking-widest">
              {timeRemaining || '3d 14h 22m'}
            </div>
            <div className="text-[10px] text-slate-400 font-ledger mt-1">LOCKS EXACTLY @ 3:00 PM EST</div>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-ledger font-bold uppercase transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-md'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            All Films ({movies.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1.5 rounded-md text-xs font-ledger font-bold uppercase transition-all ${
              filter === 'open'
                ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-md'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Open Ticket Window ({movies.filter((m) => m.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-md text-xs font-ledger font-bold uppercase transition-all ${
              filter === 'locked'
                ? 'bg-amber-600 text-white border border-amber-500 shadow-md'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            In Weekend / Locked ({movies.filter((m) => m.status === 'locked' || m.status === 'estimated').length})
          </button>
          <button
            onClick={() => setFilter('scored')}
            className={`px-3 py-1.5 rounded-md text-xs font-ledger font-bold uppercase transition-all ${
              filter === 'scored'
                ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Scored Tickets ({movies.filter((m) => m.status === 'scored').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movie title..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-ledger rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Perforated Ticket Stub Cards Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMovies.map((movie) => {
          const userPred = userPredictions.find((p) => p.movieId === movie.id);

          return (
            <div
              key={movie.id}
              className="ticket-stub rounded-xl overflow-hidden flex flex-col sm:flex-row border-2 border-amber-500/40 shadow-2xl relative transition-transform hover:-translate-y-1 duration-200"
            >
              {/* Left Stub Section (Movie Info & Artwork) */}
              <div className="flex-1 p-4 flex flex-col justify-between space-y-3 bg-[#fef08a] text-slate-950">
                <div className="flex items-start space-x-3">
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-16 h-24 rounded-md object-cover shadow-md border border-amber-600/30 shrink-0"
                  />
                  <div>
                    <div className="text-[10px] font-ledger font-extrabold uppercase text-amber-900 tracking-wider">
                      ADM-ONE &bull; {movie.genre.slice(0, 2).join(' / ')}
                    </div>
                    <h3 className="text-lg font-black font-ledger text-slate-950 leading-tight">
                      {movie.title}
                    </h3>
                    <div className="text-xs font-ledger text-slate-800 mt-1 font-semibold">
                      Release: {movie.releaseDate}
                    </div>
                  </div>
                </div>

                {/* Box Office Numbers Bar */}
                <div className="bg-amber-200/80 p-2.5 rounded-lg border border-amber-400/80 grid grid-cols-2 gap-2 text-xs font-ledger">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-900 block">Actual / Estimate</span>
                    <span className="font-extrabold text-slate-950 text-sm">
                      {movie.actualRevenue ? formatCurrency(movie.actualRevenue) : movie.estimateRevenue ? formatCurrency(movie.estimateRevenue) + ' (Est)' : 'Awaiting Weekend'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-900 block">Your Prediction</span>
                    <span className="font-extrabold text-amber-950 text-sm">
                      {userPred ? formatCurrency(userPred.predictedRevenue) : 'No Ticket'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="ticket-perforation hidden sm:block" />

              {/* Right Stub Section (Status Rubber Stamp & Action) */}
              <div className="w-full sm:w-44 p-4 bg-[#fde047] flex flex-col justify-between items-center text-center space-y-3 border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-amber-900/30">
                <div className="text-[9px] font-ledger font-black uppercase tracking-widest text-amber-950">
                  TICKET STUB #{movie.tmdbId.toString().slice(-4)}
                </div>

                {/* Rubber Stamp Status */}
                <div>
                  {movie.status === 'open' && (
                    <span className="rubber-stamp stamp-green text-xs">
                      OPEN TICKET
                    </span>
                  )}
                  {movie.status === 'locked' && (
                    <span className="rubber-stamp stamp-amber text-xs">
                      LOCKED
                    </span>
                  )}
                  {movie.status === 'estimated' && (
                    <span className="rubber-stamp stamp-blue text-xs">
                      ESTIMATED
                    </span>
                  )}
                  {movie.status === 'scored' && (
                    <span className="rubber-stamp stamp-green text-xs">
                      SCORED
                    </span>
                  )}
                </div>

                {/* Score Yield if Scored */}
                {userPred && userPred.scoreAwarded !== null && (
                  <div className="text-center font-ledger">
                    <div className="text-[9px] font-bold uppercase text-amber-900">Score Yield</div>
                    <div className={`text-base font-black ${userPred.scoreAwarded > 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {userPred.scoreAwarded > 0 ? `+${userPred.scoreAwarded}` : userPred.scoreAwarded} pts
                    </div>
                  </div>
                )}

                {/* Fake Barcode graphic */}
                <div className="w-full bg-slate-950 text-amber-400 py-1 font-mono text-[8px] tracking-widest uppercase rounded">
                  ||| | |||| | ||| ||
                </div>

                {/* Action Button */}
                {movie.status === 'open' && (
                  <button
                    onClick={() => onOpenPredictionModal(movie)}
                    className="w-full py-2 px-3 rounded bg-amber-950 text-amber-300 font-ledger font-black text-xs uppercase hover:bg-slate-950 transition-all border border-amber-700 shadow"
                  >
                    {userPred ? 'Edit Stub' : 'Issue Stub'}
                  </button>
                )}

                {movie.status !== 'open' && (
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded bg-slate-400/40 text-slate-800 font-ledger font-bold text-xs uppercase cursor-not-allowed border border-slate-400"
                  >
                    Stub Locked
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
