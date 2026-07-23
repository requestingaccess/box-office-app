'use client';

import React, { useState } from 'react';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { HelpCircle, Calculator, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

export const RulesSection: React.FC = () => {
  const [actualTarget, setActualTarget] = useState<number>(100000000);
  const [userGuess, setUserGuess] = useState<number>(110000000);
  const [daysInAdvance, setDaysInAdvance] = useState<number>(14);

  const releaseDate = new Date('2026-08-01').toISOString();
  const submissionDate = new Date(new Date('2026-08-01').getTime() - daysInAdvance * 24 * 60 * 60 * 1000).toISOString();
  const mathResult = calculateScore(userGuess, actualTarget, submissionDate, releaseDate);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="paper-panel p-6 sm:p-8 rounded-3xl border-2 border-stone-400 bg-[#fcf9f2]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>OFFICIAL KIOSK RATE CARD & SCORING MATH</span>
        </div>
        <h2 className="text-3xl font-black text-stone-900 font-serif">
          How Scoring <span className="text-amber-800 underline decoration-amber-500/50">Works</span>
        </h2>
        <p className="text-sm text-stone-700 mt-2 max-w-3xl leading-relaxed">
          Player standings are based on <strong className="text-stone-950">Percentage Accuracy</strong> rather than raw dollar variance. 
          Scoring follows a <strong className="text-emerald-800">Bounded Exponential Decay Curve</strong> to reward high precision, zero out misses over 30%, and enforce a hard penalty floor for massive misses.
        </p>
      </div>

      {/* Interactive Math Calculator Simulator */}
      <div className="paper-panel p-6 sm:p-8 rounded-3xl border-2 border-stone-400 bg-[#fcf9f2] space-y-6">
        <div className="flex items-center space-x-3 border-b-2 border-stone-300 pb-4">
          <Calculator className="w-6 h-6 text-amber-800" />
          <div>
            <h3 className="text-lg font-black text-stone-900 font-serif">Interactive Box Office Rate Calculator</h3>
            <p className="text-xs text-stone-600 font-mono">Test how guess accuracy and early lead time yield points</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Controls */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="flex justify-between text-xs font-black text-stone-800 mb-1 uppercase tracking-wider">
                <span>Actual Box Office Opening Gross:</span>
                <span className="text-emerald-800 font-mono">{formatCurrency(actualTarget)}</span>
              </div>
              <input
                type="range"
                min={20000000}
                max={300000000}
                step={5000000}
                value={actualTarget}
                onChange={(e) => setActualTarget(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-stone-800 mb-1 uppercase tracking-wider">
                <span>Your Ticket Prediction Guess:</span>
                <span className="text-amber-800 font-mono">{formatCurrency(userGuess)}</span>
              </div>
              <input
                type="range"
                min={10000000}
                max={350000000}
                step={5000000}
                value={userGuess}
                onChange={(e) => setUserGuess(Number(e.target.value))}
                className="w-full accent-amber-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-stone-800 mb-1 uppercase tracking-wider">
                <span>Punched Days in Advance:</span>
                <span className="text-stone-900 font-mono">{daysInAdvance} Days Early</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={daysInAdvance}
                onChange={(e) => setDaysInAdvance(Number(e.target.value))}
                className="w-full accent-stone-700"
              />
            </div>
          </div>

          {/* Result Output Card */}
          <div className="p-5 rounded-2xl border-2 border-stone-400 bg-[#f4efdf] flex flex-col justify-between space-y-3 shadow-inner">
            <div className="text-[10px] font-black uppercase tracking-widest text-stone-500 border-b border-stone-300 pb-1">
              Calculated Yield Receipt
            </div>

            <div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">Percentage Variance</div>
              <div className="text-xl font-mono font-black text-stone-900">{mathResult.errorPercentage}% Error</div>
            </div>

            <div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">Early Bird Multiplier Stamp</div>
              <div className="text-sm font-mono font-black text-amber-900">{mathResult.earlyBirdMultiplier}x Multiplier</div>
            </div>

            <div className="pt-2 border-t border-stone-300">
              <div className="text-[10px] text-stone-500 uppercase font-bold">Final Points Yield</div>
              <div className={`text-3xl font-black font-mono ${mathResult.finalScore > 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                {mathResult.finalScore > 0 ? `+${mathResult.finalScore}` : mathResult.finalScore} pts
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="paper-panel p-6 rounded-2xl border-2 border-stone-400 space-y-3 bg-[#fcf9f2]">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-stone-900 font-serif">Bounded Exponential Decay</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            Formula: <code className="text-amber-900 font-bold font-mono">125 * e^(-0.03 * error%) - 25</code>. Perfect guesses earn +100. Error at 30% reaches exact breakeven (0 points).
          </p>
        </div>

        <div className="paper-panel p-6 rounded-2xl border-2 border-stone-400 space-y-3 bg-[#fcf9f2]">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-800">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-stone-900 font-serif">Early Bird Multiplier</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            Guesses submitted <strong className="text-stone-900">&ge; 14 days</strong> before release earn a <strong className="text-amber-900 font-bold">1.25x multiplier</strong> stamp on positive scores. Guesses <strong className="text-stone-900">&ge; 4 days</strong> earn <strong className="text-amber-900 font-bold">1.10x</strong>.
          </p>
        </div>

        <div className="paper-panel p-6 rounded-2xl border-2 border-stone-400 space-y-3 bg-[#fcf9f2]">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-400 flex items-center justify-center text-red-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-stone-900 font-serif">Hard Penalty Floor</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            To prevent runaway negative point totals from extreme misses, score penalties are strictly capped at a hard floor of <strong className="text-red-700 font-bold">-50 points</strong>.
          </p>
        </div>

      </div>

    </div>
  );
};
