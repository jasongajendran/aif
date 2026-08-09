import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { Header } from './components/Header';
import { McqPracticeView } from './components/McqPracticeView';
import { VisualizationsHub } from './components/visualizations/VisualizationsHub';
import { ReadyReckonerHub } from './components/reckoner/ReadyReckonerHub';
import { FloatingNav } from './components/FloatingNav';
import { ViewMode, NavigationOrigin, VisualizationTab, ReckonerTab } from './types';

const STORAGE_KEY_ALWAYS_REVEAL = 'aif_c01_always_reveal_v1';
const STORAGE_KEY_VIEW_MODE = 'aif_c01_view_mode_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
      return (saved === 'visualizations' || saved === 'practice' || saved === 'ready-reckoner') ? saved : 'practice';
    } catch {
      return 'practice';
    }
  });

  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [navigationOrigin, setNavigationOrigin] = useState<NavigationOrigin | null>(null);
  const [activeVizTab, setActiveVizTab] = useState<VisualizationTab>('rag-architecture');
  const [activeVizSubItem, setActiveVizSubItem] = useState<string | undefined>(undefined);
  const [activeReckonerTab, setActiveReckonerTab] = useState<ReckonerTab>('comparison-tables');
  const [activeReckonerSubItem, setActiveReckonerSubItem] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIEW_MODE, currentView);
    } catch (e) {
      console.error('Failed to save view mode to localStorage', e);
    }
  }, [currentView]);

  const handleToggleAlwaysReveal = () => {
    setAlwaysRevealAnswers((prev) => !prev);
  };

  const handleSelectQuestionFromVisualizer = (questionId: number, origin?: NavigationOrigin) => {
    setSelectedQuestionId(questionId);
    if (origin) {
      setNavigationOrigin(origin);
      if (origin.view === 'visualizations' && origin.tabId) {
        setActiveVizTab(origin.tabId as VisualizationTab);
        setActiveVizSubItem(origin.subItemId);
      } else if (origin.view === 'ready-reckoner' && origin.tabId) {
        setActiveReckonerTab(origin.tabId as ReckonerTab);
        setActiveReckonerSubItem(origin.subItemId);
      }
    }
    setCurrentView('practice');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleReturnToOrigin = () => {
    if (navigationOrigin) {
      const origin = navigationOrigin;
      setCurrentView(origin.view);
      if (origin.view === 'visualizations' && origin.tabId) {
        setActiveVizTab(origin.tabId as VisualizationTab);
        setActiveVizSubItem(origin.subItemId);
      } else if (origin.view === 'ready-reckoner' && origin.tabId) {
        setActiveReckonerTab(origin.tabId as ReckonerTab);
        setActiveReckonerSubItem(origin.subItemId);
      }
      setNavigationOrigin(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header with View Navigation */}
      <Header
        totalQuestions={questions.length}
        alwaysRevealAnswers={alwaysRevealAnswers}
        onToggleAlwaysReveal={handleToggleAlwaysReveal}
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'practice' ? (
          <McqPracticeView
            questions={questions}
            alwaysRevealAnswers={alwaysRevealAnswers}
            onToggleAlwaysReveal={handleToggleAlwaysReveal}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestionId={(id) => setSelectedQuestionId(id)}
            navigationOrigin={navigationOrigin}
            onReturnToOrigin={handleReturnToOrigin}
            onOpenVisualizations={() => {
              setCurrentView('visualizations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReadyReckoner={() => {
              setCurrentView('ready-reckoner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'visualizations' ? (
          <VisualizationsHub
            questions={questions}
            onSelectQuestion={handleSelectQuestionFromVisualizer}
            defaultTab={activeVizTab}
            initialSubItemId={activeVizSubItem}
            onOpenReadyReckoner={() => {
              setCurrentView('ready-reckoner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPractice={() => {
              setCurrentView('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <ReadyReckonerHub
            questions={questions}
            onSelectQuestion={handleSelectQuestionFromVisualizer}
            initialTab={activeReckonerTab}
            initialSubItemId={activeReckonerSubItem}
            onOpenVisualizations={() => {
              setCurrentView('visualizations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPractice={() => {
              setCurrentView('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs sm:text-sm py-6 px-4 text-center">
        <div className="w-full space-y-2">
          <p className="font-medium text-slate-400">
            AIF-C01 AWS Certified AI Practitioner Study Hub
          </p>
          <p className="text-xs max-w-3xl mx-auto text-slate-600">
            AWS and Amazon Web Services are trademarks of Amazon.com, Inc. or its affiliates. This application is an independent educational practice resource provided to assist certification candidates.
          </p>
        </div>
      </footer>

      {/* Floating Quick Navigator & Scroll to Top */}
      <FloatingNav
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalQuestions={questions.length}
      />

    </div>
  );
}


