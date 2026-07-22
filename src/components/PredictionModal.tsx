'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Prediction } from '@/lib/types';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { X, Ticket, Check, Zap, DollarSign } from 'lucide-react';
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
  const [numericAmount, setNumericAmount] = useState<number>(0);

  useEffect(() => {
    if (existingPrediction) {
      setNumericAmount(existingPrediction.predictedRevenue);
    } else {
      setNumericAmount(150000000); // Default $150M suggestion
    }
  }, [existingPrediction, movie]);

  if (!movie) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setNumericAmount(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const handleQuickAdd = (millions: number) => {
    setNumericAmount((prev) => prev + millions * 1_000_000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#dc2626', '#10b981'],
      });
    } catch {}

    onSubmitPrediction(movie.id, numericAmount);
    onClose();
  };

  const sampleTarget = numericAmount > 0 ? numericAmount : 100000000;
  const sampleScoring = calculateScore(numericAmount, sampleTarget, new Date().toISOString(), movie.releaseDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border-4 border-amber-600 shadow-2xl overflow-hidden font-ledger">
        
        {/* Box Office Ticket Window Banner Header */}
        <div className="bg-amber-600 text-slate-950 px-6 py-4 flex items-center justify-between border-b-2 border-amber-700">
          <div className="flex items-center space-x-2 font-black uppercase text-sm tracking-wider">
            <Ticket className="w-5 h-5 fill-slate-950" />
            <span>Ticket Dispenser Window #1</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-amber-700 text-slate-950 hover:bg-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-950">
          
          {/* Movie Details Header */}
          <div className="flex items-center space-x-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <img src={movie.posterPath} alt={movie.title} className="w-12 h-16 rounded object-cover border border-amber-500/40" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400">ADM-ONE TICKET ISSUE</div>
              <h3 className="text-base font-black text-white">{movie.title}</h3>
              <div className="text-xs text-slate-400">Release Date: {movie.releaseDate}</div>
            </div>
          </div>

          {/* Dynamic Printed Ticket Stub Dispenser Graphic */}
          <div className="ticket-stub p-4 rounded-xl border-2 border-amber-600 space-y-2 text-slate-950 shadow-inner relative">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
              <span className="text-[10px] font-black uppercase text-amber-900">BOX OFFICE GUEST PREDICTION STUB</span>
              <span className="rubber-stamp stamp-green text-[10px]">
                {sampleScoring.earlyBirdMultiplier > 1.0 ? `${sampleScoring.earlyBirdMultiplier}x EARLY BIRD` : 'STANDARD STUB'}
              </span>
            </div>

            <div className="py-2 text-center">
              <div className="text-[10px] font-bold uppercase text-amber-900">ISSUED GUESS AMOUNT</div>
              <div className="text-3xl font-black text-slate-950 tracking-wider">
                {formatCurrency(numericAmount)}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 border-t border-amber-900/20 pt-2">
              <span>0% ERR: +100 PTS</span>
              <span>30% ERR: 0 PTS</span>
              <span>FLOOR: -50 PTS</span>
            </div>
          </div>

          {/* Revenue Dollar Input Field */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              Type Opening Revenue ($ USD)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-black text-xl">$</div>
              <input
                type="text"
                value={numericAmount > 0 ? new Intl.NumberFormat('en-US').format(numericAmount) : ''}
                onChange={handleInputChange}
                placeholder="150,000,000"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900 border-2 border-amber-500/50 text-white font-mono font-black text-xl focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdd(10)}
              className="py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
            >
              +$10M
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(25)}
              className="py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
            >
              +$25M
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(50)}
              className="py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
            >
              +$50M
            </button>
            <button
              type="button"
              onClick={() => setNumericAmount(0)}
              className="py-1.5 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800"
            >
              Clear
            </button>
          </div>

          {/* Lock Ticket Submit Button */}
          <button
            type="submit"
            disabled={numericAmount <= 0}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all border border-amber-400 cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>PRINT & LOCK TICKET STUB</span>
          </button>
        </form>

      </div>
    </div>
  );
};
