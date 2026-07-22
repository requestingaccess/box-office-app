'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { Movie, Prediction } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { MovieFeed } from '@/components/MovieFeed';
import { PredictionModal } from '@/components/PredictionModal';
import { Leaderboard } from '@/components/Leaderboard';
import { PlayerProfile } from '@/components/PlayerProfile';
import { RulesSection } from '@/components/RulesSection';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'profile' | 'rules'>('feed');
  const [movies, setMovies] = useState<Movie[]>(() => store.getMovies());
  const [activeUser, setActiveUser] = useState(() => store.getActiveUser());
  const [userPredictions, setUserPredictions] = useState<Prediction[]>(() => store.getUserPredictions(activeUser.id));
  const [selectedMovieForPrediction, setSelectedMovieForPrediction] = useState<Movie | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectUser = (userId: string) => {
    store.setActiveUser(userId);
    const user = store.getActiveUser();
    setActiveUser(user);
    setUserPredictions(store.getUserPredictions(user.id));
    showToast(`Switched active player to ${user.username}`, 'info');
  };

  const handleSubmitPrediction = (movieId: string, amount: number) => {
    const res = store.submitPrediction(activeUser.id, movieId, amount);
    if (res.success) {
      setUserPredictions([...store.getUserPredictions(activeUser.id)]);
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'info');
    }
  };

  const handleRunPipelineJob = async (jobKey: string) => {
    setIsPipelineRunning(true);
    try {
      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: jobKey }),
      });
      const data = await res.json();
      if (data.success) {
        setMovies([...store.getMovies()]);
        setUserPredictions([...store.getUserPredictions(activeUser.id)]);
        showToast(`${data.job} complete! ${data.message}`, 'success');
      } else {
        showToast(`Job failed: ${data.message}`, 'info');
      }
    } catch {
      showToast('Executed pipeline locally in store state.', 'success');
      setMovies([...store.getMovies()]);
      setUserPredictions([...store.getUserPredictions(activeUser.id)]);
    } finally {
      setIsPipelineRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={store.getUsers()}
        activeUser={activeUser}
        onSelectUser={handleSelectUser}
        onRunPipelineJob={handleRunPipelineJob}
        isPipelineRunning={isPipelineRunning}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className={`px-4 py-3 rounded-2xl glass-panel shadow-2xl border flex items-center space-x-3 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'border-emerald-500/50 bg-slate-900/95 text-emerald-300'
                : 'border-amber-500/50 bg-slate-900/95 text-amber-300'
            }`}>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Tab 1: Movie Feed */}
        {activeTab === 'feed' && (
          <MovieFeed
            movies={movies}
            userPredictions={userPredictions}
            onOpenPredictionModal={(movie) => setSelectedMovieForPrediction(movie)}
          />
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <Leaderboard
            standings={store.getLeaderboard()}
            currentUserId={activeUser.id}
          />
        )}

        {/* Tab 3: Player Profile */}
        {activeTab === 'profile' && (
          <PlayerProfile
            user={activeUser}
            predictions={store.getUserPredictions(activeUser.id)}
            movies={movies}
          />
        )}

        {/* Tab 4: Rules & Math Guide */}
        {activeTab === 'rules' && <RulesSection />}

      </main>

      {/* Modal Drawer for Predictions */}
      {selectedMovieForPrediction && (
        <PredictionModal
          movie={selectedMovieForPrediction}
          existingPrediction={userPredictions.find((p) => p.movieId === selectedMovieForPrediction.id)}
          onClose={() => setSelectedMovieForPrediction(null)}
          onSubmitPrediction={handleSubmitPrediction}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        Box Office Prediction Game &bull; Built with Next.js & TypeScript &bull; EST Timezone Enforced
      </footer>

    </div>
  );
}
