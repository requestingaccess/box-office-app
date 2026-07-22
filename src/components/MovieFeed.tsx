'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { Clock, Lock, CheckCircle2, Ticket, Search, Award, Zap, Check, Scissors, X } from 'lucide-react';
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
  
  // Single Card Center-Screen Flight Stage Selection
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      
      {/* Box Office Hero Header */}
      <div className="relative overflow-hidden rounded-2xl paper-panel p-5 sm:p-6 border-0 shadow-md bg-[#fcf9f2]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>DIRECT TICKET FLIGHT & STUBLESS CARD TRANSFORMATION</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 font-serif">
              Box Office <span className="text-amber-800 underline decoration-amber-500/50">Ticket Stub Predictions</span>
            </h1>
            <p className="mt-1.5 text-xs text-stone-700 max-w-2xl leading-relaxed">
              Click a ticket to <strong className="text-stone-950">fly it directly to the center of the screen</strong>. Punch your guess to physically tear off and toss the stub, leaving your prediction <span className="text-amber-900 font-extrabold">etched into the paper table</span> behind a stubless ticket!
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
          const serialNum = `STUB-2026-${(5000 + idx * 67).toString()}`;
          const skewClass = skewClasses[idx % skewClasses.length];
          const isSelected = selectedMovieId === movie.id;

          return (
            <DirectFlightTicketCard
              key={movie.id}
              movie={movie}
              userPrediction={userPred}
              serialNum={serialNum}
              skewClass={skewClass}
              isSelected={isSelected}
              onSelectTicket={() => setSelectedMovieId(movie.id)}
              onDeselectTicket={() => setSelectedMovieId(null)}
              onSubmitPrediction={onSubmitPrediction}
            />
          );
        })}
      </div>
    </div>
  );
};

// Component for Individual Ticket Card with Direct Flight & Physical Stub Tear-Off
interface DirectFlightTicketCardProps {
  movie: Movie;
  userPrediction?: Prediction;
  serialNum: string;
  skewClass: string;
  isSelected: boolean;
  onSelectTicket: () => void;
  onDeselectTicket: () => void;
  onSubmitPrediction: (movieId: string, amount: number) => void;
}

const DirectFlightTicketCard: React.FC<DirectFlightTicketCardProps> = ({
  movie,
  userPrediction,
  serialNum,
  skewClass,
  isSelected,
  onSelectTicket,
  onDeselectTicket,
  onSubmitPrediction,
}) => {
  const [numericAmount, setNumericAmount] = useState<number>(150000000);
  const [isTearing, setIsTearing] = useState<boolean>(false);

  useEffect(() => {
    if (userPrediction) {
      setNumericAmount(userPrediction.predictedRevenue);
    } else {
      setNumericAmount(150000000);
    }
  }, [userPrediction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setNumericAmount(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const handleQuickAdd = (millions: number) => {
    setNumericAmount((prev) => prev + millions * 1_000_000);
  };

  const handleTearAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    // Start tear animation sequence
    setIsTearing(true);

    try {
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#d97706', '#dc2626', '#15803d'],
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      onSubmitPrediction(movie.id, numericAmount);
      setIsTearing(false);
      onDeselectTicket();
    }, 700);
  };

  const hasSubmittedPrediction = Boolean(userPrediction);
  const sampleScoring = calculateScore(numericAmount, numericAmount > 0 ? numericAmount : 100000000, new Date().toISOString(), movie.releaseDate);

  return (
    <div className="relative">
      
      {/* ETCHED BACKGROUND RECORD LAYER (Punched into paper table surface behind stub slot) */}
      <div className="absolute inset-0 p-4 rounded-2xl etched-paper-box flex items-center justify-between pointer-events-none z-0">
        <div className="pl-4">
          <div className="text-[9px] uppercase font-black etched-paper-text tracking-widest">
            TABLE ETCHED PREDICTION RECORD
          </div>
          <div className="text-xl font-black font-mono etched-paper-text">
            {hasSubmittedPrediction ? formatCurrency(userPrediction!.predictedRevenue) : 'STUB PENDING PUNCH'}
          </div>
        </div>

        <div className="pr-4 text-right">
          {hasSubmittedPrediction && (
            <div className="text-[11px] font-black etched-paper-text">
              EARLY BIRD: {userPrediction!.earlyBirdMultiplier}X
            </div>
          )}
          <div className="text-[9px] font-mono etched-paper-text">
            {hasSubmittedPrediction ? `PUNCHED: ${new Date(userPrediction!.submittedAt).toLocaleDateString()}` : 'UNPUNCHED'}
          </div>
        </div>
      </div>

      {/* THE DIRECT FLIGHT TICKET ELEMENT ITSELF */}
      <div
        onClick={() => !isSelected && movie.status === 'open' && onSelectTicket()}
        className={`borderless-ticket-stub rounded-2xl overflow-visible cursor-pointer relative ${
          isSelected ? 'ticket-stage-centered' : skewClass
        }`}
      >
        {/* 4 Corner Cutouts */}
        <div className="ticket-corner-tl" />
        <div className="ticket-corner-tr" />
        <div className="ticket-corner-bl" />
        <div className="ticket-corner-br" />

        {/* Deselect Close Button (Visible when Centered) */}
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeselectTicket();
            }}
            className="absolute -top-3 -right-3 p-1.5 rounded-full bg-stone-200 text-stone-800 hover:text-stone-950 hover:bg-stone-300 transition-all border border-stone-400 z-30 shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="relative flex flex-col sm:flex-row items-stretch">
          
          {/* LEFT MAIN TICKET BODY */}
          <div className={`flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3 ${hasSubmittedPrediction && !isSelected ? 'torn-edge-right' : ''}`}>
            
            {/* Header Serial */}
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

            {/* Poster + Details */}
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

            {/* Actuals & Estimate Numbers Footer */}
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
                  {hasSubmittedPrediction ? formatCurrency(userPrediction!.predictedRevenue) : 'Click to Punch'}
                </span>
              </div>
            </div>

          </div>

          {/* VERTICAL PERFORATION DIVIDER (Only shown if stub is present) */}
          {!hasSubmittedPrediction && (
            <div className="ticket-vertical-perforation relative hidden sm:block">
              <div className="ticket-notch-top -left-[12px]" />
              <div className="ticket-notch-bottom -left-[12px]" />
            </div>
          )}

          {/* RIGHT TEAR-OFF STUB (OR STUBLESS TORN EFFECT WHEN SUBMITTED) */}
          {!hasSubmittedPrediction ? (
            <div
              className={`sm:w-60 p-4 bg-[#f4efdf] flex flex-col justify-between space-y-3 border-t sm:border-t-0 border-stone-300 rounded-b-2xl sm:rounded-b-none sm:rounded-r-2xl ${
                isTearing ? 'animate-stub-toss' : ''
              }`}
            >
              <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-900">PREDICTION STUB</span>
                <Scissors className="w-3 h-3 text-stone-500" />
              </div>

              {!isSelected ? (
                // Collapsed Idle Stub View
                <>
                  <div>
                    <div className="text-[8px] uppercase font-black text-stone-500 tracking-wider">Punched Guess</div>
                    <div className="text-xl font-black text-amber-900 font-mono tracking-tight">
                      $0
                    </div>
                  </div>

                  {movie.status === 'open' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicket();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-amber-50 font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-1 shadow-sm"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>INSPECT & PUNCH</span>
                    </button>
                  )}
                </>
              ) : (
                // CENTERED STAGE INLINE PUNCH FORM
                <form onSubmit={handleTearAndSubmit} className="space-y-2.5 animate-fadeIn">
                  <div>
                    <label className="block text-[8px] font-black text-stone-800 uppercase tracking-wider mb-1">
                      Revenue Guess ($ USD)
                    </label>
                    <div className="relative">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-900 font-black text-base">$</div>
                      <input
                        type="text"
                        value={numericAmount > 0 ? new Intl.NumberFormat('en-US').format(numericAmount) : ''}
                        onChange={handleInputChange}
                        placeholder="150,000,000"
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-white border-2 border-amber-800 text-stone-900 font-mono font-black text-base focus:outline-none focus:border-amber-600 shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Quick Chips */}
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(10)}
                      className="py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-900 text-[9px] font-black border border-stone-400"
                    >
                      +$10M
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(25)}
                      className="py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-900 text-[9px] font-black border border-stone-400"
                    >
                      +$25M
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(50)}
                      className="py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-900 text-[9px] font-black border border-stone-400"
                    >
                      +$50M
                    </button>
                    <button
                      type="button"
                      onClick={() => setNumericAmount(0)}
                      className="py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-900 text-[9px] font-black border border-red-300"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Early Bird Multiplier */}
                  <div className="p-1 rounded bg-amber-100 border border-amber-300 text-[9px] flex items-center justify-between">
                    <span className="font-extrabold text-amber-950">Early Bird Boost:</span>
                    <span className="font-mono font-black text-amber-900">{sampleScoring.earlyBirdMultiplier}x</span>
                  </div>

                  {/* TEAR STUB & SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={numericAmount <= 0 || isTearing}
                    className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-emerald-50 font-black text-[11px] uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>TEAR STUB & SUBMIT</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            // STUBLESS TICKET EDGE DISPLAY (STUB HAS BEEN TEARD AWAY PERMANENTLY)
            <div className="hidden lg:flex items-center justify-center w-12 bg-transparent">
              {/* Stub is physically absent, exposing the etched record on the paper background behind it */}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
