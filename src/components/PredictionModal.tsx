'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { X, Ticket, Zap, Check, Stamp } from 'lucide-react';
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
      setAmountInput('150000000');
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

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d97706', '#dc2626', '#15803d'],
      });
    } catch {
      // Fallback
    }

    onSubmitPrediction(movie.id, numericAmount);
    onClose();
  };

  const sampleTarget = numericAmount > 0 ? numericAmount : 100000000;
  const sampleScoring = calculateScore(numericAmount, sampleTarget, new Date().toISOString(), movie.releaseDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg paper-panel rounded-3xl p-6 sm:p-8 border-4 border-stone-800 shadow-2xl overflow-hidden bg-[#fcf9f2]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-300 transition-all border border-stone-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-4 mb-6 border-b-2 border-stone-300 pb-4">
          <img src={movie.posterPath} alt={movie.title} className="w-16 h-24 rounded-xl object-cover ring-2 ring-stone-800 shadow-md" />
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-red-100 border border-red-300 text-red-800 text-[10px] font-black uppercase tracking-wider mb-1">
              <Ticket className="w-3 h-3" />
              <span>TICKET PUNCHER MACHINE</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 font-serif">{movie.title}</h2>
            <div className="text-xs text-stone-600 font-mono font-bold">Release: {movie.releaseDate} &bull; 3-Day Domestic</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
              Punch Your Opening Weekend Revenue Guess ($ USD)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800 font-black text-2xl">$</div>
              <input
                type="text"
                value={numericAmount > 0 ? new Intl.NumberFormat('en-US').format(numericAmount) : ''}
                onChange={handleInputChange}
                placeholder="150,000,000"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#f4efdf] border-2 border-amber-800 text-stone-900 font-mono font-black text-2xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-700/20 transition-all shadow-inner"
              />
            </div>
            <div className="mt-2 text-xs text-right font-black text-amber-900 font-mono">
              Formatted: {formatCurrency(numericAmount)}
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdd(10)}
              className="py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black transition-all border border-stone-400"
            >
              +$10M
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(25)}
              className="py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black transition-all border border-stone-400"
            >
              +$25M
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(50)}
              className="py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black transition-all border border-stone-400"
            >
              +$50M
            </button>
            <button
              type="button"
              onClick={() => setNumericAmount(0)}
              className="py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 text-xs font-black transition-all border border-red-300"
            >
              Clear
            </button>
          </div>

          {/* Early Bird Multiplier Stamp Box */}
          <div className="p-3.5 rounded-2xl bg-[#f4efdf] border-2 border-amber-700 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-5 h-5 text-amber-700" />
              <div>
                <div className="text-xs font-black text-amber-950 uppercase">Early Bird Multiplier Stamp</div>
                <div className="text-[11px] text-stone-600 font-medium">Early submission boosts positive scores</div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-amber-200 border border-amber-500 text-amber-950 font-black text-xs font-mono">
              {sampleScoring.earlyBirdMultiplier > 1.0 ? `${sampleScoring.earlyBirdMultiplier}x Multiplier` : '1.0x (Standard)'}
            </div>
          </div>

          {/* Rate Math Summary */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 space-y-1.5 text-xs text-stone-700">
            <div className="flex justify-between font-semibold">
              <span>0% Error Target:</span>
              <span className="font-bold text-emerald-700 font-mono">+100.0 pts</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>30% Variance Breakeven:</span>
              <span className="font-bold text-amber-800 font-mono">0.0 pts</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Hard Floor Cap:</span>
              <span className="font-bold text-red-700 font-mono">-50.0 pts penalty</span>
            </div>
          </div>

          {/* Submit Punch Button */}
          <button
            type="submit"
            disabled={numericAmount <= 0}
            className="w-full py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 border-2 border-amber-950 text-amber-50 font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>PUNCH TICKET ({formatCurrency(numericAmount)})</span>
          </button>
        </form>

      </div>
    </div>
  );
};
