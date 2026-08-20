import React from 'react';
import { Question } from '../types';
import { 
  Headphones, Play, X, Sparkles, BookOpen, Layers, CheckCircle2, Clock, 
  Volume2, ShieldCheck, Cpu, Database, Flame
} from 'lucide-react';

interface SetAudioBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  activeSetTab: number | 'all';
  onStartSetAudioBook: (setNum: number | 'all') => void;
}

const CHUNK_SIZE = 50;

export const SetAudioBookModal: React.FC<SetAudioBookModalProps> = ({
  isOpen,
  onClose,
  questions,
  activeSetTab,
  onStartSetAudioBook,
}) => {
  if (!isOpen) return null;

  const maxQId = Math.max(...questions.map((q) => q.id), 0);
  const totalSets = Math.ceil(maxQId / CHUNK_SIZE) || 1;

  // Set summaries with domain highlights
  const setDetails = Array.from({ length: totalSets }).map((_, idx) => {
    const setNum = idx + 1;
    const startQ = (setNum - 1) * CHUNK_SIZE + 1;
    const endQ = setNum * CHUNK_SIZE;
    const setQuestions = questions.filter((q) => q.id >= startQ && q.id <= endQ);

    // Dominant domains in this set
    const domainCounts: Record<string, number> = {};
    setQuestions.forEach((q) => {
      domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1;
    });

    const topDomain = Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'AWS AI/ML';
    // Est. time at ~30s per question
    const estMins = Math.round((setQuestions.length * 32) / 60);

    return {
      setNum,
      startQ,
      endQ,
      count: setQuestions.length,
      topDomain,
      estMins,
    };
  });

  return (
    <div 
      id="set-audiobook-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="set-audiobook-modal-card"
        className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
                <span>AIF-C01 Set Audiobooks</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  446 Questions
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Narrates questions, <strong className="text-amber-400 font-bold">all answer options (A–D)</strong> or <strong className="text-emerald-400 font-bold">correct answer alone</strong>, followed by detailed explanations and exam tips.
              </p>
            </div>
          </div>

          <button
            id="audiobook-modal-close"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Set Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Quick Launch All Questions Audiobook */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center space-x-2">
                  <span>Complete Exam Marathon (All 446 Questions)</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    All Sets
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>446 Questions</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~3.5 hrs full playback</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              id="audiobook-launch-all-btn"
              onClick={() => {
                onStartSetAudioBook('all');
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Listen All 446 Qs</span>
            </button>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
            Select 50-Question Set Audiobook:
          </div>

          {/* Grid of Sets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {setDetails.map((set) => {
              const isCurrentActive = activeSetTab === set.setNum;
              return (
                <div
                  key={set.setNum}
                  className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between space-y-3 ${
                    isCurrentActive
                      ? 'bg-slate-800/90 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-white flex items-center space-x-1.5">
                        <Headphones className="w-4 h-4 text-amber-400" />
                        <span>Set {set.setNum} Audiobook</span>
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        Q{set.startQ}–Q{set.endQ}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center space-x-2">
                      <span>{set.count} Questions</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>~{set.estMins} mins</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-900/90 px-2 py-1 rounded border border-slate-800/80 truncate">
                      Focus: <strong className="text-slate-200">{set.topDomain}</strong>
                    </div>
                  </div>

                  <button
                    id={`audiobook-launch-set-${set.setNum}-btn`}
                    onClick={() => {
                      onStartSetAudioBook(set.setNum);
                      onClose();
                    }}
                    className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isCurrentActive
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Listen Set {set.setNum}</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer Tip */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Tip: The audiobook automatically advances across questions in the set while highlighting the active question in real-time.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
