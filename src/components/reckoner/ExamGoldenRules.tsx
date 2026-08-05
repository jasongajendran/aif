import React, { useState } from 'react';
import { examGoldenRules, ExamRule } from './reckonerData';
import { Lightbulb, AlertTriangle, ShieldCheck, Zap, Search, Bookmark, CheckCircle2 } from 'lucide-react';

interface ExamGoldenRulesProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ExamGoldenRules: React.FC<ExamGoldenRulesProps> = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRules = examGoldenRules.filter((rule) => {
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.formulaOrRule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.relatedTopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: ExamRule['category']) => {
    switch (category) {
      case 'trap-alert':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Exam Trap Alert',
          classes: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        };
      case 'mnemonic':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Mnemonic / Memory Hook',
          classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        };
      case 'golden-rule':
        return {
          icon: <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'AWS Golden Rule',
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        };
      case 'metric-rule':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'Metric & Formula Rule',
          classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-md">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mnemonics, traps, formulas, and golden rules..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
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
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
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
          return (
            <div
              key={rule.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Badge & Topic */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center space-x-1.5 ${badge.classes}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {rule.relatedTopic}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {rule.title}
                </h3>

                {/* Formula / Rule Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-amber-300 font-semibold leading-snug">
                  {rule.formulaOrRule}
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {rule.explanation}
                </p>

              </div>

              {/* Why It Matters */}
              <div className="pt-3 border-t border-slate-800/80 flex items-start space-x-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">Exam Impact: </strong>
                  {rule.whyItMatters}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
