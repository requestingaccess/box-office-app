'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { X, Sparkles, AlertCircle, Clock, Zap, DollarSign, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PredictionModalProps {
  movie: Movie | null;
  existingPrediction?: Prediction;
  onClose: () => void;
  onSubmitPrediction: (movieId: string, predictedRevenue: number) => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  movie,
  existingPrediction,
  onClose,
  onSubmitPrediction,
}) => {
  const [amountInput, setAmountInput] = useState<string>('');
  const [numericAmount, setNumericAmount] = useState<number>(0);

  useEffect(() => {
    if (existingPrediction) {
      setNumericAmount(existingPrediction.predictedRevenue);
      setAmountInput(existingPrediction.predictedRevenue.toString());
    } else {
      setAmountInput('150000000'); // Default starting suggestion ($150M)
      setNumericAmount(150000000);
    }
  }, [existingPrediction, movie]);

  if (!movie) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // Fallback
    }

    onSubmitPrediction(movie.id, numericAmount);
    onClose();
  };

  // Preview score simulation assuming an actual revenue target
  const sampleTarget = numericAmount > 0 ? numericAmount : 100000000;
  const sampleScoring = calculateScore(numericAmount, sampleTarget, new Date().toISOString(), movie.releaseDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden bg-slate-900/95">
        
        {/* Background glow */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <img src={movie.posterPath} alt={movie.title} className="w-14 h-20 rounded-xl object-cover ring-2 ring-amber-500/40" />
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Domestic Opening Weekend (3-Day)</span>
            </div>
            <h2 className="text-xl font-black text-white">{movie.title}</h2>
            <div className="text-xs text-slate-400">Releases Friday: {movie.releaseDate}</div>
          </div>
        </div>

        {/* Prediction Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Currency Input Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Enter Your Revenue Guess ($ USD)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-black text-xl">$</div>
              <input
                type="text"
                value={numericAmount > 0 ? new Intl.NumberFormat('en-US').format(numericAmount) : ''}
                onChange={handleInputChange}
                placeholder="150,000,000"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 text-white font-mono font-black text-2xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="mt-2 text-xs text-right font-semibold text-amber-300">
              Formatted: {formatCurrency(numericAmount)}
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdd(10)}
              className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              +$10M
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(25)}
              className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              +$25M
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(50)}
              className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              +$50M
            </button>
            <button
              type="button"
              onClick={() => setNumericAmount(0)}
              className="py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition-all border border-rose-800/40"
            >
              Clear
            </button>
          </div>

          {/* Early Bird Multiplier Badge */}
          <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <div className="text-xs font-extrabold text-indigo-200">Early Bird Lead Time</div>
                <div className="text-[11px] text-indigo-300">Submitting in advance boosts positive scores</div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-extrabold text-xs">
              {sampleScoring.earlyBirdMultiplier > 1.0 ? `${sampleScoring.earlyBirdMultiplier}x Multiplier` : '1.0x (Standard)'}
            </div>
          </div>

          {/* Scoring Math Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Perfect Accuracy (0% error):</span>
              <span className="font-bold text-emerald-400">+100.0 pts</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>30% Variance Breakeven:</span>
              <span className="font-bold text-amber-400">0.0 pts</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Hard Penalty Floor:</span>
              <span className="font-bold text-rose-400">-50.0 pts max penalty</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={numericAmount <= 0}
            className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Lock In Prediction ({formatCurrency(numericAmount)})</span>
          </button>
        </form>

      </div>
    </div>
  );
};
