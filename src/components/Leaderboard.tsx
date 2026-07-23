'use client';

import React from 'react';
import { LeaderboardStanding } from '@/lib/types';
import { Trophy, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LeaderboardProps {
  standings: LeaderboardStanding[];
  currentUserId: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ standings, currentUserId }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="paper-panel p-6 sm:p-8 rounded-2xl border-2 border-stone-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#fcf9f2]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>OFFICIAL SEASONAL STANDINGS BULLETIN</span>
          </div>
          <h2 className="text-3xl font-black text-stone-900 font-serif">
            Global Seasonal <span className="text-amber-800 underline decoration-amber-500/50">Leaderboard</span>
          </h2>
          <p className="text-sm text-stone-700 mt-1 max-w-2xl leading-relaxed">
            Ranked strictly by <strong className="text-stone-950">Average Points per Prediction</strong>. Players require a minimum threshold of <span className="text-emerald-800 font-extrabold">5 predictions</span> to qualify for seasonal trophy awards.
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-[#f4efdf] border-2 border-stone-400 text-xs text-stone-800 flex items-center space-x-3 shadow-sm font-semibold">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Qualified Threshold: <strong>5+ Predictions</strong></span>
        </div>
      </div>

      {/* Standings Table */}
      <div className="paper-panel rounded-2xl border-2 border-stone-400 overflow-hidden shadow-md bg-[#fcf9f2]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e8dec7] border-b-2 border-stone-400 text-[11px] font-black uppercase tracking-wider text-stone-800">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6 text-center">Qualification</th>
                <th className="py-4 px-6 text-right">Predictions</th>
                <th className="py-4 px-6 text-right">Total Points</th>
                <th className="py-4 px-6 text-right">Avg Score / Movie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {standings.map((player, index) => {
                const isCurrentUser = player.userId === currentUserId;
                const rankNum = index + 1;

                return (
                  <tr
                    key={player.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-100/90 hover:bg-amber-200/90 border-l-4 border-amber-700'
                        : player.isQualified
                        ? 'hover:bg-[#f4efdf]'
                        : 'opacity-60 bg-stone-100 hover:opacity-80'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 font-mono font-black text-sm text-stone-900">
                      {rankNum === 1 && <span className="text-2xl">🥇</span>}
                      {rankNum === 2 && <span className="text-2xl">🥈</span>}
                      {rankNum === 3 && <span className="text-2xl">🥉</span>}
                      {rankNum > 3 && <span className="text-stone-600">#{rankNum}</span>}
                    </td>

                    {/* User Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                          alt={player.username}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-400"
                        />
                        <div>
                          <div className={`font-bold text-sm ${isCurrentUser ? 'text-amber-950 font-black' : 'text-stone-900'}`}>
                            {player.username} {isCurrentUser && '(You)'}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono">Season 2026</div>
                        </div>
                      </div>
                    </td>

                    {/* Qualification Status */}
                    <td className="py-4 px-6 text-center">
                      {player.isQualified ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 text-xs font-black">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>QUALIFIED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-200 text-stone-700 border border-stone-400 text-xs font-black">
                          <AlertCircle className="w-3 h-3 text-stone-500" />
                          <span>{player.predictionsCount}/5 Needed</span>
                        </span>
                      )}
                    </td>

                    {/* Predictions Count */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-sm text-stone-800">
                      {player.predictionsCount}
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-sm text-stone-800">
                      {player.totalPoints > 0 ? `+${player.totalPoints}` : player.totalPoints}
                    </td>

                    {/* Average Score */}
                    <td className="py-4 px-6 text-right">
                      <div className="font-mono font-black text-base text-amber-800">
                        {player.averageScore > 0 ? `+${player.averageScore}` : player.averageScore}
                      </div>
                      <div className="text-[9px] text-stone-500 uppercase tracking-wider font-bold">Points / Movie</div>
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
