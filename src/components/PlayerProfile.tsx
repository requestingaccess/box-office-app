'use client';

import React from 'react';
import { User, Prediction, Movie } from '@/lib/types';
import { formatCurrency } from '@/lib/scoring';
import { Award, Target, TrendingUp, Calendar, Zap, CheckCircle2, Film } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PlayerProfileProps {
  user: User;
  predictions: Prediction[];
  movies: Movie[];
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ user, predictions, movies }) => {
  const scoredPredictions = predictions.filter((p) => p.scoreAwarded !== null);
  const totalPoints = scoredPredictions.reduce((sum, p) => sum + (p.scoreAwarded || 0), 0);
  const avgScore = scoredPredictions.length > 0 ? totalPoints / scoredPredictions.length : 0;

  // Best guess accuracy percentage
  const bestError = scoredPredictions.length > 0
    ? Math.min(...scoredPredictions.map((p) => p.errorPercentage || 100))
    : null;

  // Prepare chart data chronologically
  const chartData = scoredPredictions.map((p) => {
    const movie = movies.find((m) => m.id === p.movieId);
    return {
      movieTitle: movie ? movie.title : 'Movie',
      score: p.scoreAwarded || 0,
      errorPct: p.errorPercentage || 0,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* User Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/90">
        <div className="flex items-center space-x-5">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-500/50 shadow-2xl"
          />
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Box Office Analyst</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{user.username}</h2>
            <div className="text-xs text-slate-400">Member since April 2026</div>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Avg Score</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              {avgScore > 0 ? `+${avgScore.toFixed(1)}` : avgScore.toFixed(1)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Predictions</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{predictions.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Best Accuracy</span>
            <span className="text-lg font-black text-indigo-400 font-mono">
              {bestError !== null ? `${bestError}% err` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Score Performance Chart */}
      {chartData.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Points Performance Over Time</span>
            </div>
            <span className="text-xs text-slate-400">Score per movie</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="movieTitle" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Predictions History Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Film className="w-4 h-4 text-amber-400" />
            <span>Prediction History ({predictions.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 uppercase tracking-wider text-slate-400 font-extrabold">
                <th className="py-3 px-5">Movie</th>
                <th className="py-3 px-5 text-right">Your Guess</th>
                <th className="py-3 px-5 text-right">Actual Opening</th>
                <th className="py-3 px-5 text-center">Variance %</th>
                <th className="py-3 px-5 text-center">Early Bird</th>
                <th className="py-3 px-5 text-right">Score Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {predictions.map((p) => {
                const movie = movies.find((m) => m.id === p.movieId);
                return (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-5 font-bold text-white">
                      {movie ? movie.title : 'Movie'}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-amber-400 font-bold">
                      {formatCurrency(p.predictedRevenue)}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-emerald-400 font-bold">
                      {movie?.actualRevenue ? formatCurrency(movie.actualRevenue) : 'Pending'}
                    </td>
                    <td className="py-3 px-5 text-center font-mono text-slate-300">
                      {p.errorPercentage !== null ? `${p.errorPercentage}%` : '-'}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {p.earlyBirdMultiplier > 1.0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                          {p.earlyBirdMultiplier}x
                        </span>
                      ) : (
                        <span className="text-slate-500">1.0x</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right font-mono font-black text-sm">
                      {p.scoreAwarded !== null ? (
                        <span className={p.scoreAwarded > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {p.scoreAwarded > 0 ? `+${p.scoreAwarded}` : p.scoreAwarded} pts
                        </span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
