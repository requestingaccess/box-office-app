'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { Clock, Lock, CheckCircle2, Ticket, Search, Award, Zap, Check, X, Scissors } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MovieFeedProps {
  movies: Movie[];
  userPredictions: Prediction[];
  onSubmitPrediction: (movieId: string, amount: number) => void;
}

export const MovieFeed: React.FC<MovieFeedProps> = ({ movies, userPredictions, onSubmitPrediction }) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'locked' | 'scored'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  // State 3: Selected Ticket for Center-Screen Inspection Stage
  const [inspectingMovie, setInspectingMovie] = useState<Movie | null>(null);
  const [numericAmount, setNumericAmount] = useState<number>(150000000);
  const [isTearing, setIsTearing] = useState<boolean>(false);

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

  const skewClasses = ['ticket-skew-left-1', 'ticket-skew-right-1', 'ticket-skew-left-2', 'ticket-skew-right-2'];

  const handleOpenInspection = (movie: Movie) => {
    const existing = userPredictions.find((p) => p.movieId === movie.id);
    setNumericAmount(existing ? existing.predictedRevenue : 150000000);
    setIsTearing(false);
    setInspectingMovie(movie);
  };

  const handleExecuteTearAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingMovie || numericAmount <= 0) return;

    // Trigger ticket tear animation sequence
    setIsTearing(true);

    try {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#d97706', '#dc2626', '#15803d'],
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      onSubmitPrediction(inspectingMovie.id, numericAmount);
      setIsTearing(false);
      setInspectingMovie(null);
    }, 750);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl paper-panel p-5 sm:p-6 border-0 shadow-md bg-[#fcf9f2]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>3-STATE TICKET INSPECTION & ANIMATED STUB TEAR</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 font-serif">
              Box Office <span className="text-amber-800 underline decoration-amber-500/50">Ticket Stub Predictions</span>
            </h1>
            <p className="mt-1.5 text-xs text-stone-700 max-w-2xl leading-relaxed">
              Click any ticket to <strong className="text-stone-950">pick it up into center-screen inspection stage</strong>. Punch your guess, watch the stub tear off and toss away, leaving your prediction <span className="text-amber-900 font-extrabold">etched into the paper table</span>!
            </p>
          </div>

          {/* Thursday Lock Timer */}
          <div className="w-full md:w-auto p-3.5 rounded-xl bg-[#1c1917] text-stone-100 flex flex-col items-center justify-center min-w-[200px] shadow-lg">
            <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-0.5">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>THURSDAY LOCK TIMER</span>
            </div>
            <div className="text-xl font-black text-amber-400 tracking-wider font-mono">
              {timeRemaining || 'Loading...'}
            </div>
            <div className="text-[9px] text-stone-400 mt-0.5 uppercase font-semibold">Locks Thu @ 3:00 PM EST</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-amber-800 text-amber-50 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 hover:bg-[#e8dec7]'
            }`}
          >
            All Releases ({movies.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              filter === 'open'
                ? 'bg-emerald-800 text-emerald-50 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 hover:bg-[#e8dec7]'
            }`}
          >
            Open Predictions ({movies.filter((m) => m.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              filter === 'locked'
                ? 'bg-stone-800 text-stone-50 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 hover:bg-[#e8dec7]'
            }`}
          >
            Locked Weekend ({movies.filter((m) => m.status === 'locked' || m.status === 'estimated').length})
          </button>
          <button
            onClick={() => setFilter('scored')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              filter === 'scored'
                ? 'bg-red-800 text-red-50 shadow-sm'
                : 'bg-[#fcf9f2] text-stone-700 hover:bg-[#e8dec7]'
            }`}
          >
            Scored Movies ({movies.filter((m) => m.status === 'scored').length})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movie title or genre..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#fcf9f2] border-0 text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all font-semibold shadow-inner"
          />
        </div>
      </div>

      {/* 2-Column Desktop Ticket Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {filteredMovies.map((movie, idx) => {
          const userPred = userPredictions.find((p) => p.movieId === movie.id);
          const serialNum = `STUB-2026-${(4000 + idx * 91).toString()}`;
          const skewClass = skewClasses[idx % skewClasses.length];

          return (
            <div key={movie.id} className="relative">
              
              {/* BACKGROUND ETCHED PREDICTION RECORD LAYER (Layered on table behind ticket) */}
              <div className="absolute inset-0 p-4 rounded-2xl etched-paper-box flex items-center justify-between pointer-events-none z-0">
                <div className="pl-4">
                  <div className="text-[9px] uppercase font-black etched-paper-text tracking-widest">
                    TABLE ETCHED PREDICTION RECORD
                  </div>
                  <div className="text-lg font-black font-mono etched-paper-text">
                    {userPred ? formatCurrency(userPred.predictedRevenue) : 'STUB PENDING PUNCH'}
                  </div>
                </div>

                <div className="pr-4 text-right">
                  {userPred && (
                    <div className="text-[10px] font-black etched-paper-text">
                      EARLY BIRD: {userPred.earlyBirdMultiplier}X
                    </div>
                  )}
                  <div className="text-[8px] font-mono etched-paper-text">
                    {userPred ? `PUNCHED: ${new Date(userPred.submittedAt).toLocaleDateString()}` : 'UNPUNCHED'}
                  </div>
                </div>
              </div>

              {/* FOREGROUND PHYSICAL TICKET STUB (Hover Lifted & Organic Skewed) */}
              <div
                onClick={() => movie.status === 'open' && handleOpenInspection(movie)}
                className={`borderless-ticket-stub rounded-2xl overflow-visible cursor-pointer ${skewClass} relative z-10`}
              >
                {/* 4 Corner Cutouts */}
                <div className="ticket-corner-tl" />
                <div className="ticket-corner-tr" />
                <div className="ticket-corner-bl" />
                <div className="ticket-corner-br" />

                <div className="relative flex flex-col sm:flex-row items-stretch">
                  
                  {/* Left Section */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-300 pb-1.5 text-[9px] font-mono font-bold text-stone-500">
                      <div className="flex items-center space-x-1.5">
                        <Ticket className="w-3 h-3 text-amber-700" />
                        <span>{serialNum}</span>
                        <span>&bull; ADMIT ONE</span>
                      </div>
                      <div className="flex items-center space-x-0.5 opacity-60">
                        <div className="h-2.5 w-1 bg-stone-900" />
                        <div className="h-2.5 w-2 bg-stone-900" />
                        <div className="h-2.5 w-0.5 bg-stone-900" />
                        <div className="h-2.5 w-1.5 bg-stone-900" />
                        <div className="h-2.5 w-2.5 bg-stone-900" />
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-stone-300 bg-stone-900 shadow-sm">
                        <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {movie.status === 'open' && <span className="ink-stamp ink-stamp-green text-[9px]">[ OPEN ]</span>}
                          {movie.status === 'locked' && <span className="ink-stamp ink-stamp-gold text-[9px]">[ LOCKED ]</span>}
                          {movie.status === 'estimated' && <span className="ink-stamp ink-stamp-gold text-[9px]">[ EST ]</span>}
                          {movie.status === 'scored' && <span className="ink-stamp ink-stamp-red text-[9px]">[ SCORED ]</span>}
                        </div>

                        <h3 className="text-lg font-black text-stone-900 font-serif leading-tight truncate">
                          {movie.title}
                        </h3>
                        
                        <div className="text-[10px] text-stone-600 font-mono">
                          Release: {movie.releaseDate}
                        </div>

                        <div className="flex items-center space-x-1 pt-0.5 flex-wrap">
                          {movie.genre.slice(0, 2).map((g) => (
                            <span key={g} className="px-1.5 py-0.2 rounded bg-[#f4efdf] text-[9px] font-bold text-stone-700 border border-stone-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#f4efdf] p-2 rounded-lg text-[11px]">
                      <div>
                        <span className="text-[8px] uppercase font-black text-stone-500 block tracking-wider">Actual / Est</span>
                        <span className="text-xs font-black text-emerald-800 font-mono">
                          {movie.actualRevenue ? formatCurrency(movie.actualRevenue) : movie.estimateRevenue ? formatCurrency(movie.estimateRevenue) + ' (Est)' : 'Awaiting'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase font-black text-stone-500 block tracking-wider">Punched Guess</span>
                        <span className="text-xs font-black text-amber-800 font-mono">
                          {userPred ? formatCurrency(userPred.predictedRevenue) : 'Click to Punch'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Perforation Divider Line */}
                  <div className="ticket-vertical-perforation relative hidden sm:block">
                    <div className="ticket-notch-top -left-[12px]" />
                    <div className="ticket-notch-bottom -left-[12px]" />
                  </div>

                  {/* Right Stub Section */}
                  <div className="sm:w-52 p-4 bg-[#f4efdf] flex flex-col justify-between space-y-3 rounded-b-2xl sm:rounded-b-none sm:rounded-r-2xl">
                    <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-900">PREDICTION STUB</span>
                      {userPred && userPred.scoreAwarded !== null && (
                        <span className="text-xs font-black font-mono text-emerald-800">
                          +{userPred.scoreAwarded} pts
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-[8px] uppercase font-black text-stone-500 tracking-wider">Current Guess</div>
                      <div className="text-xl font-black text-amber-900 font-mono tracking-tight">
                        {userPred ? formatCurrency(userPred.predictedRevenue) : '$0'}
                      </div>
                    </div>

                    {movie.status === 'open' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInspection(movie);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-amber-50 font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>{userPred ? 'INSPECT & EDIT' : 'INSPECT & PUNCH'}</span>
                      </button>
                    )}

                    {movie.status !== 'open' && (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-lg bg-stone-300 text-stone-500 font-black text-[11px] uppercase cursor-not-allowed border border-stone-400 flex items-center justify-center space-x-1"
                      >
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* STATE 3: CENTER-SCREEN TICKET INSPECTION STAGE (INSPECTION OVERLAY) */}
      {inspectingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
          
          <div className="relative w-full max-w-2xl borderless-ticket-stub rounded-3xl p-6 sm:p-8 bg-[#fcf9f2] shadow-2xl !transform-none">
            
            {/* 4 Corner Cutouts */}
            <div className="ticket-corner-tl" />
            <div className="ticket-corner-tr" />
            <div className="ticket-corner-bl" />
            <div className="ticket-corner-br" />

            {/* Close Button */}
            <button
              onClick={() => setInspectingMovie(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-300 transition-all border border-stone-400 z-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stage Title */}
            <div className="flex items-center space-x-2 text-xs font-black text-amber-900 uppercase tracking-widest mb-4">
              <Scissors className="w-4 h-4 text-amber-700" />
              <span>TICKET INSPECTION STAGE &bull; STUB PUNCHING & TEARING</span>
            </div>

            <div className="relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl border-2 border-stone-300 bg-[#fcf9f2]">
              
              {/* Left Ticket Header & Details */}
              <div className="flex-1 p-5 space-y-4">
                <div className="flex items-center space-x-4 border-b border-stone-300 pb-3">
                  <img src={inspectingMovie.posterPath} alt={inspectingMovie.title} className="w-16 h-24 rounded-xl object-cover ring-2 ring-stone-800 shadow-md" />
                  <div>
                    <h2 className="text-2xl font-black text-stone-900 font-serif">{inspectingMovie.title}</h2>
                    <div className="text-xs text-stone-600 font-mono">Release: {inspectingMovie.releaseDate} &bull; 3-Day Domestic</div>
                    <div className="mt-1">
                      <span className="ink-stamp ink-stamp-green text-[10px]">[ OPEN FOR GUESSES ]</span>
                    </div>
                  </div>
                </div>

                {/* Form Input */}
                <form onSubmit={handleExecuteTearAndSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                      Enter Opening Weekend Revenue Guess ($ USD)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-900 font-black text-xl">$</div>
                      <input
                        type="text"
                        value={numericAmount > 0 ? new Intl.NumberFormat('en-US').format(numericAmount) : ''}
                        onChange={(e) => {
                          const rawVal = e.target.value.replace(/[^0-9]/g, '');
                          setNumericAmount(rawVal ? parseInt(rawVal, 10) : 0);
                        }}
                        placeholder="150,000,000"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border-2 border-amber-800 text-stone-900 font-mono font-black text-xl focus:outline-none focus:border-amber-600 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Quick add chips */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNumericAmount((prev) => prev + 10000000)}
                      className="py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black transition-all border border-stone-400"
                    >
                      +$10M
                    </button>
                    <button
                      type="button"
                      onClick={() => setNumericAmount((prev) => prev + 25000000)}
                      className="py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black transition-all border border-stone-400"
                    >
                      +$25M
                    </button>
                    <button
                      type="button"
                      onClick={() => setNumericAmount((prev) => prev + 50000000)}
                      className="py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black transition-all border border-stone-400"
                    >
                      +$50M
                    </button>
                    <button
                      type="button"
                      onClick={() => setNumericAmount(0)}
                      className="py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-xs font-black transition-all border border-red-300"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Early Bird Multiplier */}
                  <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-amber-950 font-extrabold">
                      <Zap className="w-4 h-4 text-amber-700" />
                      <span>Early Bird Lead Time Multiplier:</span>
                    </div>
                    <span className="font-mono font-black text-amber-900">{calculateScore(numericAmount, numericAmount, new Date().toISOString(), inspectingMovie.releaseDate).earlyBirdMultiplier}x</span>
                  </div>

                  {/* TEAR & SUBMIT STUB BUTTON */}
                  <button
                    type="submit"
                    disabled={numericAmount <= 0 || isTearing}
                    className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-emerald-50 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>TEAR STUB & LOCK IN GUESS ({formatCurrency(numericAmount)})</span>
                  </button>
                </form>
              </div>

              {/* RIGHT TEAR-OFF STUB (ANIMATED TOSS PORTION) */}
              <div
                className={`md:w-56 p-5 bg-[#f4efdf] flex flex-col justify-between space-y-4 border-t md:border-t-0 border-l border-stone-300 transition-all ${
                  isTearing ? 'animate-stub-toss' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">PERFORATED STUB</span>
                  <Scissors className="w-3.5 h-3.5 text-stone-500" />
                </div>

                <div className="text-center py-4">
                  <div className="text-[10px] uppercase font-black text-stone-500">PUNCHED GUESS</div>
                  <div className="text-2xl font-black text-amber-900 font-mono tracking-tight mt-1">
                    {formatCurrency(numericAmount)}
                  </div>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-black text-[10px] font-mono border border-amber-400">
                    ADMIT ONE
                  </div>
                </div>

                <div className="text-[9px] text-stone-500 text-center font-mono italic">
                  Submitting will physically tear and toss this stub off-screen!
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
