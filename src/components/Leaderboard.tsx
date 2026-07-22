'use client';

import React from 'react';
import { LeaderboardStanding } from '@/lib/types';
import { Trophy, ShieldAlert, Award } from 'lucide-react';

interface LeaderboardProps {
  standings: LeaderboardStanding[];
  currentUserId: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ standings, currentUserId }) => {
  return (
    <div className="space-y-6 font-ledger">
      
      {/* Box Office Ledger Header */}
      <div className="bg-slate-900 p-6 rounded-xl border-2 border-amber-500/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/40">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Box Office Ledger & Standing</span>
          </div>
          <h2 className="text-3xl font-black text-amber-400 uppercase tracking-wider">
            SEASONAL <span className="text-white">STANDINGS</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Rankings are determined strictly by <strong className="text-amber-400">Average Points per Prediction</strong>. Players require a minimum of <strong className="text-emerald-400">5 predictions</strong> to qualify for final seasonal awards.
          </p>
        </div>

        <div className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>QUALIFICATION THRESHOLD: <strong>5+ STUBS</strong></span>
        </div>
      </div>

      {/* High-Density Ledger Table */}
      <div className="bg-slate-950 rounded-xl border-2 border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-ledger text-xs">
            <thead>
              <tr className="bg-slate-900 border-b-2 border-slate-800 uppercase tracking-wider text-amber-400 font-black">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player Handle</th>
                <th className="py-3 px-4 text-center">Qualification</th>
                <th className="py-3 px-4 text-right">Total Stubs</th>
                <th className="py-3 px-4 text-right">Sum Points</th>
                <th className="py-3 px-4 text-right">Avg Score / Stub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {standings.map((player, index) => {
                const isCurrentUser = player.userId === currentUserId;
                const rankNum = index + 1;

                return (
                  <tr
                    key={player.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-amber-500'
                        : player.isQualified
                        ? 'hover:bg-slate-900/60'
                        : 'opacity-60 bg-slate-950/60'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono font-black text-sm text-slate-200">
                      {rankNum === 1 && <span className="text-amber-400">#1 🥇</span>}
                      {rankNum === 2 && <span className="text-slate-300">#2 🥈</span>}
                      {rankNum === 3 && <span className="text-amber-600">#3 🥉</span>}
                      {rankNum > 3 && <span className="text-slate-400">#{rankNum}</span>}
                    </td>

                    {/* Handle */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                          alt={player.username}
                          className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                        />
                        <span className={`font-bold ${isCurrentUser ? 'text-amber-300 font-extrabold' : 'text-white'}`}>
                          {player.username} {isCurrentUser && '(YOU)'}
                        </span>
                      </div>
                    </td>

                    {/* Rubber Stamp Qualification */}
                    <td className="py-3.5 px-4 text-center">
                      {player.isQualified ? (
                        <span className="rubber-stamp stamp-green text-[10px]">
                          QUALIFIED
                        </span>
                      ) : (
                        <span className="rubber-stamp stamp-amber text-[10px]">
                          {player.predictionsCount}/5 NEEDED
                        </span>
                      )}
                    </td>

                    {/* Predictions Count */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-300">
                      {player.predictionsCount}
                    </td>

                    {/* Total Points */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-300">
                      {player.totalPoints > 0 ? `+${player.totalPoints}` : player.totalPoints}
                    </td>

                    {/* Average Score (Primary Metric) */}
                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-amber-400">
                      {player.averageScore > 0 ? `+${player.averageScore}` : player.averageScore}
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
