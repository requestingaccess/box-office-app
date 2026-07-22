'use client';

import React from 'react';
import { LeaderboardStanding } from '@/lib/types';
import { Trophy, Medal, AlertCircle, CheckCircle, ShieldAlert, Award } from 'lucide-react';

interface LeaderboardProps {
  standings: LeaderboardStanding[];
  currentUserId: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ standings, currentUserId }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Global Standings</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            Seasonal <span className="gold-gradient-text">Leaderboard</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Ranked by <span className="text-amber-400 font-bold">Average Points per Prediction</span>. Players require a minimum of <span className="text-emerald-400 font-bold">5 predictions</span> to qualify for final seasonal awards.
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Qualified threshold: <strong>5+ predictions</strong></span>
        </div>
      </div>

      {/* Standings Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Predictions</th>
                <th className="py-4 px-6 text-right">Total Points</th>
                <th className="py-4 px-6 text-right">Avg Score / Movie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {standings.map((player, index) => {
                const isCurrentUser = player.userId === currentUserId;
                const rankNum = index + 1;

                return (
                  <tr
                    key={player.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-500/10 hover:bg-amber-500/15 border-l-4 border-amber-500'
                        : player.isQualified
                        ? 'hover:bg-slate-900/50'
                        : 'opacity-60 bg-slate-950/40 hover:opacity-80'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 font-mono font-black text-sm">
                      {rankNum === 1 && <span className="text-2xl">🥇</span>}
                      {rankNum === 2 && <span className="text-2xl">🥈</span>}
                      {rankNum === 3 && <span className="text-2xl">🥉</span>}
                      {rankNum > 3 && <span className="text-slate-400">#{rankNum}</span>}
                    </td>

                    {/* User Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                          alt={player.username}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                        />
                        <div>
                          <div className={`font-bold text-sm ${isCurrentUser ? 'text-amber-300 font-extrabold' : 'text-white'}`}>
                            {player.username} {isCurrentUser && '(You)'}
                          </div>
                          <div className="text-[11px] text-slate-500">Season 2026</div>
                        </div>
                      </div>
                    </td>

                    {/* Qualification Status */}
                    <td className="py-4 px-6 text-center">
                      {player.isQualified ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          <span>QUALIFIED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
                          <AlertCircle className="w-3 h-3 text-slate-500" />
                          <span>{player.predictionsCount}/5 Needed</span>
                        </span>
                      )}
                    </td>

                    {/* Predictions Count */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-sm text-slate-300">
                      {player.predictionsCount}
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-sm text-slate-300">
                      {player.totalPoints > 0 ? `+${player.totalPoints}` : player.totalPoints}
                    </td>

                    {/* Average Score (Primary Ranking Metric) */}
                    <td className="py-4 px-6 text-right">
                      <div className="font-mono font-black text-base text-amber-400">
                        {player.averageScore > 0 ? `+${player.averageScore}` : player.averageScore}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Points / Movie</div>
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
