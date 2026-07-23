'use client';

import React, { useState } from 'react';
import { Ticket, Trophy, User as UserIcon, HelpCircle, Cpu, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-[#f4efdf] border-b-2 border-[#c8bba2] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Vintage Box Office Counter */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-11 h-11 rounded-xl bg-amber-600 border-2 border-amber-800 text-amber-100 flex items-center justify-center shadow-md transform -rotate-2">
              <Ticket className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest text-red-700 uppercase">OFFICIAL CINEMA STUB</div>
              <span className="text-2xl font-black tracking-tight text-stone-900 font-serif">
                BOX OFFICE <span className="text-amber-700 underline decoration-amber-500/60 decoration-2">PRO</span>
              </span>
            </div>
          </div>

          {/* Navigation Links - Ticket Stub Tabs */}
          <nav className="hidden md:flex items-center space-x-2 bg-[#e8dec7] p-1.5 rounded-xl border border-[#c8bba2]">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'feed'
                  ? 'bg-[#fcf9f2] text-amber-900 border-2 border-amber-700 shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-[#dfd3b9]'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>TICKET FEED</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-[#fcf9f2] text-amber-900 border-2 border-amber-700 shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-[#dfd3b9]'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>LEADERBOARD</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#fcf9f2] text-amber-900 border-2 border-amber-700 shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-[#dfd3b9]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>MY STUBS</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'rules'
                  ? 'bg-[#fcf9f2] text-amber-900 border-2 border-amber-700 shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-[#dfd3b9]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>RATE CARD</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Pipeline Control Button */}
            <div className="relative">
              <button
                onClick={() => setShowPipelineMenu(!showPipelineMenu)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-amber-100 border-2 border-amber-700 text-amber-900 hover:bg-amber-200 transition-all shadow-sm"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline font-mono">KIOSK CRON</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showPipelineMenu && (
                <div className="absolute right-0 mt-2 w-72 paper-panel rounded-xl shadow-2xl p-3 border-2 border-stone-400 z-50">
                  <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 px-1 border-b border-stone-300 pb-1">
                    Simulate Scheduled Kiosk Jobs
                  </div>
                  <div className="space-y-1.5">
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('tmdb-sync');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#fcf9f2] hover:bg-amber-100 text-xs font-bold text-stone-800 transition-all border border-stone-300 flex items-center justify-between"
                    >
                      <span>1. TMDB Sync (Daily 2 AM)</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                    </button>
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('lock-predictions');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#fcf9f2] hover:bg-amber-100 text-xs font-bold text-stone-800 transition-all border border-stone-300 flex items-center justify-between"
                    >
                      <span>2. Lock Predictions (Thu 3 PM)</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    </button>
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('scrape-estimates');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#fcf9f2] hover:bg-amber-100 text-xs font-bold text-stone-800 transition-all border border-stone-300 flex items-center justify-between"
                    >
                      <span>3. Scrape Estimates (Sun 12 PM)</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                    </button>
                    <button
                      disabled={isPipelineRunning}
                      onClick={() => {
                        onRunPipelineJob('score-actuals');
                        setShowPipelineMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#fcf9f2] hover:bg-amber-100 text-xs font-bold text-stone-800 transition-all border border-stone-300 flex items-center justify-between"
                    >
                      <span>4. Scrape Actuals & Score (Mon 4 PM)</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active User Avatar & Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full bg-[#fcf9f2] border-2 border-stone-400 hover:border-amber-700 transition-all"
              >
                <img
                  src={activeUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt={activeUser.username}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-600"
                />
                <span className="text-xs font-extrabold text-stone-900 hidden sm:inline">{activeUser.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-600" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 paper-panel rounded-xl shadow-2xl p-2 border-2 border-stone-400 z-50">
                  <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 px-2 py-1 border-b border-stone-300">
                    Select Player Account
                  </div>
                  <div className="space-y-1">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
                          user.id === activeUser.id
                            ? 'bg-amber-100 text-amber-900 border border-amber-500'
                            : 'text-stone-700 hover:bg-[#e8dec7]'
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
      </div>
    </header>
  );
};
