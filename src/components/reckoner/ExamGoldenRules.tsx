import React, { useState } from 'react';
import { examGoldenRules, ExamRule } from './reckonerData';
import { 
  Lightbulb, AlertTriangle, ShieldCheck, Zap, Search, 
  Bookmark, CheckCircle2, Eye, EyeOff, Sparkles, BookOpen
} from 'lucide-react';

interface ExamGoldenRulesProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ExamGoldenRules: React.FC<ExamGoldenRulesProps> = ({ onSelectQuestion }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [testMode, setTestMode] = useState<boolean>(false);

  const filteredRules = examGoldenRules.filter((rule) => {
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.formulaOrRule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.relatedTopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryBadge = (category: ExamRule['category']) => {
    switch (category) {
      case 'trap-alert':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          label: 'Exam Trap Alert',
          classes: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        };
      case 'mnemonic':
        return {
          icon: <Zap className="w-4 h-4 text-amber-400" />,
          label: 'Mnemonic / Memory Hook',
          classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        };
      case 'golden-rule':
        return {
          icon: <Lightbulb className="w-4 h-4 text-emerald-400" />,
          label: 'AWS Golden Rule',
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        };
      case 'metric-rule':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
          label: 'Metric & Formula Rule',
          classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mnemonics, traps, formulas, and golden rules..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Test Mode Switch & Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setTestMode(!testMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              testMode
                ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-400/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {testMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{testMode ? 'Self-Test Mode Active' : 'Self-Test Mode'}</span>
          </button>

          {[
            { id: 'all', label: 'All Rules' },
            { id: 'trap-alert', label: 'Trap Alerts' },
            { id: 'mnemonic', label: 'Mnemonics' },
            { id: 'golden-rule', label: 'Golden Rules' },
            { id: 'metric-rule', label: 'Metric Rules' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const badge = getCategoryBadge(rule.category);
          const isRevealed = !testMode || revealedIds[rule.id];

          return (
            <div
              key={rule.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                
                {/* Badge & Topic */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center space-x-1.5 ${badge.classes}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {rule.relatedTopic}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {rule.title}
                </h3>

                {/* Formula / Rule Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-amber-300 font-bold leading-snug shadow-inner">
                  {rule.formulaOrRule}
                </div>

                {/* Explanation (Collapsible in Self-Test Mode) */}
                {isRevealed ? (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {rule.explanation}
                  </p>
                ) : (
                  <button
                    onClick={() => toggleReveal(rule.id)}
                    className="w-full py-3 rounded-xl bg-slate-950 border border-dashed border-slate-700 text-xs font-bold text-amber-400 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Click to Reveal Explanation & Impact</span>
                  </button>
                )}

              </div>

              {/* Why It Matters & Exam Impact */}
              {isRevealed && (
                <div className="pt-3 border-t border-slate-800/80 flex items-start space-x-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400">AIF-C01 Impact: </strong>
                    {rule.whyItMatters}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
