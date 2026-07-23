'use client';

import React from 'react';
import { User, Prediction, Movie } from '@/lib/types';
import { formatCurrency } from '@/lib/scoring';
import { Award, Ticket, TrendingUp, Film } from 'lucide-react';
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

  const bestError = scoredPredictions.length > 0
    ? Math.min(...scoredPredictions.map((p) => p.errorPercentage || 100))
    : null;

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
      <div className="paper-panel p-6 sm:p-8 rounded-3xl border-2 border-stone-400 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#fcf9f2]">
        <div className="flex items-center space-x-5">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-600 shadow-md"
          />
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-400 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>OFFICIAL BOX OFFICE ANALYST</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">{user.username}</h2>
            <div className="text-xs text-stone-600 font-mono">Member Since April 2026</div>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-[#f4efdf] border border-stone-300 text-center">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-black block">Avg Score</span>
            <span className="text-lg font-black text-amber-800 font-mono">
              {avgScore > 0 ? `+${avgScore.toFixed(1)}` : avgScore.toFixed(1)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#f4efdf] border border-stone-300 text-center">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-black block">Stubs Punched</span>
            <span className="text-lg font-black text-emerald-800 font-mono">{predictions.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#f4efdf] border border-stone-300 text-center">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-black block">Best Accuracy</span>
            <span className="text-lg font-black text-stone-900 font-mono">
              {bestError !== null ? `${bestError}% err` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Score Performance Chart */}
      {chartData.length > 0 && (
        <div className="paper-panel p-6 rounded-2xl border-2 border-stone-400 shadow-md bg-[#fcf9f2] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-black text-stone-900">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <span>Score Yield Progression</span>
            </div>
            <span className="text-xs text-stone-600 font-mono">Points per ticket</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="paperScoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2d8c3" />
                <XAxis dataKey="movieTitle" stroke="#78716c" tick={{ fontSize: 11 }} />
                <YAxis stroke="#78716c" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fcf9f2', borderColor: '#c8bba2', borderRadius: '12px', color: '#1c1917' }}
                  labelStyle={{ color: '#1c1917', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#paperScoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Predictions History Table */}
      <div className="paper-panel rounded-2xl border-2 border-stone-400 overflow-hidden shadow-md bg-[#fcf9f2]">
        <div className="p-4 bg-[#e8dec7] border-b-2 border-stone-400 flex items-center justify-between">
          <h3 className="text-sm font-black text-stone-900 flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-amber-800" />
            <span>Punched Ticket Stubs History ({predictions.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f4efdf] border-b border-stone-300 uppercase tracking-wider text-stone-700 font-black">
                <th className="py-3 px-5">Movie Title</th>
                <th className="py-3 px-5 text-right">Your Guess</th>
                <th className="py-3 px-5 text-right">Actual Opening</th>
                <th className="py-3 px-5 text-center">Variance %</th>
                <th className="py-3 px-5 text-center">Early Bird</th>
                <th className="py-3 px-5 text-right">Score Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {predictions.map((p) => {
                const movie = movies.find((m) => m.id === p.movieId);
                return (
                  <tr key={p.id} className="hover:bg-[#f4efdf] transition-colors">
                    <td className="py-3 px-5 font-bold text-stone-900 font-serif">
                      {movie ? movie.title : 'Movie'}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-amber-800 font-bold">
                      {formatCurrency(p.predictedRevenue)}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-emerald-800 font-bold">
                      {movie?.actualRevenue ? formatCurrency(movie.actualRevenue) : 'Pending'}
                    </td>
                    <td className="py-3 px-5 text-center font-mono text-stone-700">
                      {p.errorPercentage !== null ? `${p.errorPercentage}%` : '-'}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {p.earlyBirdMultiplier > 1.0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-400 text-[10px] font-black">
                          {p.earlyBirdMultiplier}x
                        </span>
                      ) : (
                        <span className="text-stone-500">1.0x</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right font-mono font-black text-sm">
                      {p.scoreAwarded !== null ? (
                        <span className={p.scoreAwarded > 0 ? 'text-emerald-800' : 'text-red-700'}>
                          {p.scoreAwarded > 0 ? `+${p.scoreAwarded}` : p.scoreAwarded} pts
                        </span>
                      ) : (
                        <span className="text-stone-500">Pending</span>
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
