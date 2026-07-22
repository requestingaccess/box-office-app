'use client';

import React, { useState } from 'react';
import { calculateScore, formatCurrency } from '@/lib/scoring';
import { HelpCircle, Calculator, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

export const RulesSection: React.FC = () => {
  const [actualTarget, setActualTarget] = useState<number>(100000000); // $100M default
  const [userGuess, setUserGuess] = useState<number>(110000000); // $110M default (10% error)
  const [daysInAdvance, setDaysInAdvance] = useState<number>(14); // 14 days default

  // Calculate live score
  const releaseDate = new Date('2026-08-01').toISOString();
  const submissionDate = new Date(new Date('2026-08-01').getTime() - daysInAdvance * 24 * 60 * 60 * 1000).toISOString();
  const mathResult = calculateScore(userGuess, actualTarget, submissionDate, releaseDate);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-slate-900/90">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Game Rules & Scoring Math</span>
        </div>
        <h2 className="text-3xl font-black text-white">
          How Scoring <span className="gold-gradient-text">Works</span>
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Rankings are based on <strong className="text-amber-400">Percentage Accuracy</strong>, not raw dollar variance. 
          The scoring system uses a <strong className="text-emerald-400">Bounded Exponential Decay Curve</strong> to reward high precision, zero out misses over 30%, and cap extreme misses with a hard penalty floor.
        </p>
      </div>

      {/* Interactive Math Calculator Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/95 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <Calculator className="w-6 h-6 text-indigo-400" />
          <div>
            <h3 className="text-lg font-black text-white">Interactive Scoring Calculator</h3>
            <p className="text-xs text-slate-400">Test how different guess amounts and lead times yield points</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Controls */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Actual Box Office Gross:</span>
                <span className="text-emerald-400 font-mono">{formatCurrency(actualTarget)}</span>
              </div>
              <input
                type="range"
                min={20000000}
                max={300000000}
                step={5000000}
                value={actualTarget}
                onChange={(e) => setActualTarget(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Your Prediction Guess:</span>
                <span className="text-amber-400 font-mono">{formatCurrency(userGuess)}</span>
              </div>
              <input
                type="range"
                min={10000000}
                max={350000000}
                step={5000000}
                value={userGuess}
                onChange={(e) => setUserGuess(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Submitted Days in Advance:</span>
                <span className="text-indigo-400 font-mono">{daysInAdvance} Days Early</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={daysInAdvance}
                onChange={(e) => setDaysInAdvance(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Result Output Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700 bg-slate-950 flex flex-col justify-between space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculated Yield</div>

            <div>
              <div className="text-[11px] text-slate-400">Percentage Error</div>
              <div className="text-xl font-mono font-bold text-slate-200">{mathResult.errorPercentage}% Error</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Early Bird Multiplier</div>
              <div className="text-sm font-mono font-bold text-indigo-400">{mathResult.earlyBirdMultiplier}x</div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Final Points Awarded</div>
              <div className={`text-3xl font-black font-mono ${mathResult.finalScore > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {mathResult.finalScore > 0 ? `+${mathResult.finalScore}` : mathResult.finalScore} pts
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-white">Bounded Exponential Decay</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Formula: <code className="text-amber-300">raw_score = 125 * e^(-0.03 * error%) - 25</code>. Perfect guesses earn +100. Error at 30% reaches exact breakeven (0 points).
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-white">Early Bird Boost</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Guesses placed <strong className="text-white">&ge; 14 days</strong> before release earn a <strong className="text-indigo-400">1.25x multiplier</strong> on positive scores. Guesses <strong className="text-white">&ge; 4 days</strong> earn <strong className="text-indigo-400">1.10x</strong>.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-white">Hard Penalty Floor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To prevent runaway negative scores from massive misses, penalties are strictly capped at a hard floor of <strong className="text-rose-400">-50 points</strong>.
          </p>
        </div>

      </div>

    </div>
  );
};
