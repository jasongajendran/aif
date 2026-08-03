import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { Header } from './components/Header';
import { McqPracticeView } from './components/McqPracticeView';

const STORAGE_KEY_ALWAYS_REVEAL = 'aif_c01_always_reveal_v1';

export default function App() {
  const [alwaysRevealAnswers, setAlwaysRevealAnswers] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALWAYS_REVEAL);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALWAYS_REVEAL, JSON.stringify(alwaysRevealAnswers));
    } catch (e) {
      console.error('Failed to save preference to localStorage', e);
    }
  }, [alwaysRevealAnswers]);

  const handleToggleAlwaysReveal = () => {
    setAlwaysRevealAnswers((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header */}
      <Header
        totalQuestions={questions.length}
        alwaysRevealAnswers={alwaysRevealAnswers}
        onToggleAlwaysReveal={handleToggleAlwaysReveal}
      />

      {/* Main Content Area - Strictly Practice MCQs */}
      <main className="flex-1 pb-16">
        <McqPracticeView
          questions={questions}
          alwaysRevealAnswers={alwaysRevealAnswers}
          onToggleAlwaysReveal={handleToggleAlwaysReveal}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs sm:text-sm py-6 px-4 text-center">
        <div className="w-full space-y-2">
          <p className="font-medium text-slate-400">
            AIF-C01 AWS Certified AI Practitioner Practice MCQs
          </p>
          <p className="text-xs max-w-3xl mx-auto text-slate-600">
            AWS and Amazon Web Services are trademarks of Amazon.com, Inc. or its affiliates. This application is an independent educational practice resource provided to assist certification candidates.
          </p>
        </div>
      </footer>

    </div>
  );
}


