'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { Clock, Lock, CheckCircle2, Ticket, Search, Award, ChevronDown, ChevronUp, Zap, Check, Sparkles } from 'lucide-react';
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
      
      {/* Box Office Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl paper-panel p-6 sm:p-8 border-2 border-stone-400 shadow-md bg-[#fcf9f2]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>HORIZONTAL ADMISSION TICKET FEED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 font-serif">
              Box Office <span className="text-amber-800 underline decoration-amber-500/50">Ticket Stub Predictions</span>
            </h1>
            <p className="mt-2 text-sm text-stone-700 max-w-2xl leading-relaxed">
              Click any ticket stub to expand inline prediction controls. Lock in your guesses before <strong className="text-stone-950">Thursday 3:00 PM EST</strong> to earn up to <span className="text-emerald-800 font-extrabold">1.25x Early Bird point multipliers</span>!
            </p>
          </div>

          {/* Thursday Lock Timer */}
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

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Ticket Filter Chips */}
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
            placeholder="Search movie title or genre..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#fcf9f2] border-2 border-stone-300 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-700 transition-all font-semibold"
          />
        </div>
      </div>

      {/* Horizontal Ticket Stub List */}
      <div className="space-y-6">
        {filteredMovies.map((movie, idx) => {
          const userPred = userPredictions.find((p) => p.movieId === movie.id);
          const serialNum = `STUB-2026-${(2000 + idx * 73).toString()}`;

          return (
            <HorizontalTicketStubCard
              key={movie.id}
              movie={movie}
              userPrediction={userPred}
              serialNum={serialNum}
              onSubmitPrediction={onSubmitPrediction}
            />
          );
        })}
      </div>
    </div>
  );
};

// Component for Individual Horizontal Ticket Stub Card with Smooth Inline Expansion
interface HorizontalTicketStubCardProps {
  movie: Movie;
  userPrediction?: Prediction;
  serialNum: string;
  onSubmitPrediction: (movieId: string, amount: number) => void;
}

const HorizontalTicketStubCard: React.FC<HorizontalTicketStubCardProps> = ({
  movie,
  userPrediction,
  serialNum,
  onSubmitPrediction,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [amountInput, setAmountInput] = useState<string>('');
  const [numericAmount, setNumericAmount] = useState<number>(0);

  useEffect(() => {
    if (userPrediction) {
      setNumericAmount(userPrediction.predictedRevenue);
      setAmountInput(userPrediction.predictedRevenue.toString());
    } else {
      setNumericAmount(150000000);
      setAmountInput('150000000');
    }
  }, [userPrediction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setAmountInput(rawVal);
    setNumericAmount(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const handleQuickAdd = (millions: number) => {
    const newAmount = numericAmount + millions * 1_000_000;
    setNumericAmount(newAmount);
    setAmountInput(newAmount.toString());
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d97706', '#dc2626', '#15803d'],
      });
    } catch {
      // Fallback
    }

    onSubmitPrediction(movie.id, numericAmount);
    setIsExpanded(false);
  };

  const sampleTarget = numericAmount > 0 ? numericAmount : 100000000;
  const sampleScoring = calculateScore(numericAmount, sampleTarget, new Date().toISOString(), movie.releaseDate);

  return (
    <div
      className={`horizontal-ticket-stub rounded-2xl overflow-visible border-2 ${
        isExpanded ? 'border-amber-700 shadow-xl bg-white' : 'border-stone-400 bg-[#fcf9f2]'
      }`}
    >
      <div className="relative flex flex-col lg:flex-row items-stretch">
        
        {/* LEFT SECTION (65% width) - Movie Details & Serial Header */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          
          {/* Ticket Header Barcode & Serial */}
          <div className="flex items-center justify-between border-b border-stone-300 pb-2 text-[10px] font-mono font-bold text-stone-500">
            <div className="flex items-center space-x-2">
              <Ticket className="w-3.5 h-3.5 text-amber-700" />
              <span>{serialNum}</span>
              <span>&bull; ADMIT ONE</span>
            </div>
            <div className="flex items-center space-x-1 opacity-60">
              <div className="h-3 w-1 bg-stone-900" />
              <div className="h-3 w-2 bg-stone-900" />
              <div className="h-3 w-0.5 bg-stone-900" />
              <div className="h-3 w-1.5 bg-stone-900" />
              <div className="h-3 w-3 bg-stone-900" />
              <div className="h-3 w-1 bg-stone-900" />
            </div>
          </div>

          {/* Main Movie Content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            {/* Poster */}
            <div className="relative w-28 h-40 shrink-0 rounded-xl overflow-hidden border-2 border-stone-400 bg-stone-900 shadow-sm">
              <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Title, Synopsis & Badges */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                {movie.status === 'open' && <span className="ink-stamp ink-stamp-green text-[10px]">[ OPEN FOR GUESSES ]</span>}
                {movie.status === 'locked' && <span className="ink-stamp ink-stamp-gold text-[10px]">[ LOCKED WEEKEND ]</span>}
                {movie.status === 'estimated' && <span className="ink-stamp ink-stamp-gold text-[10px]">[ PROVISIONAL EST ]</span>}
                {movie.status === 'scored' && <span className="ink-stamp ink-stamp-red text-[10px]">[ SCORED & FINAL ]</span>}
                
                <span className="text-[11px] font-mono font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded">
                  Release: {movie.releaseDate}
                </span>
              </div>

              <h3 className="text-2xl font-black text-stone-900 font-serif">
                {movie.title}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
                {movie.overview}
              </p>

              {/* Genre tags */}
              <div className="flex items-center space-x-1.5 pt-1">
                {movie.genre.map((g) => (
                  <span key={g} className="px-2 py-0.5 rounded bg-[#f4efdf] text-[10px] font-bold text-stone-700 border border-stone-300">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actuals & Estimate Numbers Footer */}
          <div className="grid grid-cols-2 gap-3 bg-[#f4efdf] p-3 rounded-xl border border-stone-300 text-xs">
            <div>
              <span className="text-[9px] uppercase font-black text-stone-500 block tracking-wider">Weekend Actual / Est.</span>
              <span className="text-sm font-black text-emerald-800 font-mono">
                {movie.actualRevenue ? formatCurrency(movie.actualRevenue) : movie.estimateRevenue ? formatCurrency(movie.estimateRevenue) + ' (Est)' : 'Awaiting Weekend'}
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase font-black text-stone-500 block tracking-wider">Your Current Prediction</span>
              <span className="text-sm font-black text-amber-800 font-mono">
                {userPrediction ? formatCurrency(userPrediction.predictedRevenue) : 'No Prediction Yet'}
              </span>
            </div>
          </div>

        </div>

        {/* VERTICAL PERFORATION DIVIDER LINE with Top & Bottom Circular Cutout Notches */}
        <div className="ticket-vertical-perforation relative hidden lg:block">
          <div className="ticket-notch-top -left-[11px]" />
          <div className="ticket-notch-bottom -left-[11px]" />
        </div>

        {/* RIGHT STUB SECTION (35% width) - Dedicated Prediction Stub with Smooth Expansion */}
        <div
          className={`lg:w-80 p-5 sm:p-6 bg-[#f4efdf] flex flex-col justify-between space-y-4 border-t lg:border-t-0 border-stone-300 transition-all duration-300 ease-in-out ${
            isExpanded ? 'bg-amber-50/90' : ''
          }`}
        >
          {/* Stub Header */}
          <div className="flex items-center justify-between border-b border-stone-300 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">PREDICTION TEAR STUB</span>
            {userPrediction && userPrediction.scoreAwarded !== null && (
              <span className="text-xs font-black font-mono text-emerald-800">
                +{userPrediction.scoreAwarded} pts
              </span>
            )}
          </div>

          {/* Prediction Status / Display */}
          <div>
            <div className="text-[10px] uppercase font-black text-stone-500 tracking-wider">Punched Guess</div>
            <div className="text-2xl font-black text-amber-900 font-mono tracking-tight mt-0.5">
              {userPrediction ? formatCurrency(userPrediction.predictedRevenue) : '$0'}
            </div>
          </div>

          {/* Inline Action Toggle Button */}
          {movie.status === 'open' && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 border-2 border-amber-900 text-amber-50 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Ticket className="w-4 h-4" />
              <span>{isExpanded ? 'CLOSE STUB PUNCHER' : userPrediction ? 'EDIT TICKET PUNCH' : 'PUNCH TICKET GUESS'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

          {/* SMOOTH EXPANDED INLINE INPUT SECTION */}
          {isExpanded && movie.status === 'open' && (
            <form onSubmit={handleConfirmSubmit} className="space-y-4 pt-2 border-t-2 border-dashed border-amber-300 animate-fadeIn">
              <div>
                <label className="block text-[10px] font-black text-stone-800 uppercase tracking-wider mb-1">
                  Enter Revenue Amount ($ USD)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900 font-black text-lg">$</div>
                  <input
                    type="text"
                    value={numericAmount > 0 ? new Intl.NumberFormat('en-US').format(numericAmount) : ''}
                    onChange={handleInputChange}
                    placeholder="150,000,000"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border-2 border-amber-800 text-stone-900 font-mono font-black text-lg focus:outline-none focus:border-amber-600 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Quick Add Chips */}
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickAdd(10)}
                  className="py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 text-[10px] font-black transition-all border border-stone-400"
                >
                  +$10M
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(25)}
                  className="py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 text-[10px] font-black transition-all border border-stone-400"
                >
                  +$25M
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(50)}
                  className="py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 text-[10px] font-black transition-all border border-stone-400"
                >
                  +$50M
                </button>
                <button
                  type="button"
                  onClick={() => setNumericAmount(0)}
                  className="py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-[10px] font-black transition-all border border-red-300"
                >
                  Clear
                </button>
              </div>

              {/* Early Bird Multiplier Badge */}
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-amber-950 font-extrabold text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  <span>Early Bird Multiplier:</span>
                </div>
                <span className="font-mono font-black text-amber-900">{sampleScoring.earlyBirdMultiplier}x</span>
              </div>

              {/* Confirm Punch Button */}
              <button
                type="submit"
                disabled={numericAmount <= 0}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 border-2 border-emerald-950 text-emerald-50 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>CONFIRM TICKET PUNCH</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
