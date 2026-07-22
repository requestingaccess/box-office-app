'use client';

import React, { useState } from 'react';
import { Film, Trophy, User as UserIcon, HelpCircle, Cpu, Calendar, ChevronDown, CheckCircle } from 'lucide-react';
import { User } from '@/lib/types';

interface NavbarProps {
  activeTab: 'feed' | 'leaderboard' | 'profile' | 'rules';
  setActiveTab: (tab: 'feed' | 'leaderboard' | 'profile' | 'rules') => void;
  users: User[];
  activeUser: User;
  onSelectUser: (userId: string) => void;
  onRunPipelineJob: (job: string) => void;
  isPipelineRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  users,
  activeUser,
  onSelectUser,
  onRunPipelineJob,
  isPipelineRunning,
}) => {
  const [showPipelineMenu, setShowPipelineMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Film className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                BOX OFFICE <span className="gold-gradient-text">PRO</span>
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Summer Blockbuster 2026</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'feed'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movie Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'rules'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Rules & Math</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Automation Pipeline Control Button */}
            <div className="relative">
              <button
                onClick={() => setShowPipelineMenu(!showPipelineMenu)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 transition-all shadow-sm"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="hidden sm:inline">Cron Pipeline</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showPipelineMenu && (
                <div className="absolute right-0 mt-2 w-72 glass-panel rounded-xl shadow-2xl p-3 border border-slate-700 z-50">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Simulate Scheduled Jobs
                  </div>
                  <div className="space-y-1.5">
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('tmdb-sync');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-amber-400 transition-all border border-slate-800 flex items-center justify-between"
                    >
                      <span>1. TMDB Sync (Daily 2 AM)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('lock-predictions');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-amber-400 transition-all border border-slate-800 flex items-center justify-between"
                    >
                      <span>2. Lock Predictions (Thu 3 PM EST)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('scrape-estimates');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-amber-400 transition-all border border-slate-800 flex items-center justify-between"
                    >
                      <span>3. Scrape Estimates (Sun 12 PM)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('score-actuals');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-amber-400 transition-all border border-slate-800 flex items-center justify-between"
                    >
                      <span>4. Scrape Actuals & Score (Mon 4 PM)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active User Avatar & Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <img
                  src={activeUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt={activeUser.username}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/40"
                />
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{activeUser.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl p-2 border border-slate-700 z-50">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 py-1">
                    Switch Player Profile
                  </div>
                  <div className="space-y-1">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all ${
                          user.id === activeUser.id
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <img src={user.avatarUrl} alt={user.username} className="w-5 h-5 rounded-full object-cover" />
                        <span>{user.username}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 justify-around">
          <button
            onClick={() => setActiveTab('feed')}
            className={`text-xs font-medium flex flex-col items-center space-y-1 ${
              activeTab === 'feed' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`text-xs font-medium flex flex-col items-center space-y-1 ${
              activeTab === 'leaderboard' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ranks</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-xs font-medium flex flex-col items-center space-y-1 ${
              activeTab === 'profile' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`text-xs font-medium flex flex-col items-center space-y-1 ${
              activeTab === 'rules' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Rules</span>
          </button>
        </div>

      </div>
    </header>
  );
};
