import React, { useState, useMemo } from 'react';
import { Question } from '../../types';
import { 
  BarChart3, PieChart, Layers, Search, Sparkles, 
  CheckCircle2, ArrowRight, BookOpen, Filter, Hash
} from 'lucide-react';

interface ExamAnalyticsVisualizerProps {
  questions: Question[];
  onSelectQuestion?: (questionId: number) => void;
}

export const ExamAnalyticsVisualizer: React.FC<ExamAnalyticsVisualizerProps> = ({ 
  questions, 
  onSelectQuestion 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  // Compute Domain Statistics
  const domainStats = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      counts[q.domain] = (counts[q.domain] || 0) + 1;
    });
    return Object.entries(counts).map(([domain, count]) => ({
      domain,
      count,
      percentage: ((count / questions.length) * 100).toFixed(1),
    })).sort((a, b) => b.count - a.count);
  }, [questions]);

  // Compute Part Statistics
  const partStats = useMemo(() => {
    const counts: Record<number, number> = {};
    questions.forEach((q) => {
      counts[q.part] = (counts[q.part] || 0) + 1;
    });
    return Object.entries(counts).map(([part, count]) => ({
      part: Number(part),
      count,
    })).sort((a, b) => a.part - b.part);
  }, [questions]);

  // Filtered Questions for Explorer
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesDomain = selectedDomainFilter === 'all' || q.domain === selectedDomainFilter;
      const qLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        q.questionText.toLowerCase().includes(qLower) ||
        q.topic.toLowerCase().includes(qLower) ||
        q.id.toString().includes(qLower) ||
        q.keywordClues.some(kw => kw.toLowerCase().includes(qLower));
      return matchesDomain && matchesSearch;
    });
  }, [questions, selectedDomainFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
            Question Bank Analytics
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
            446 Total Questions Analyzed
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          AIF-C01 Question Bank Visual Breakdown
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Visual analysis of the entire 446 practice question library across official exam domains, parts, and key topic clusters.
        </p>
      </div>

      {/* Domain Distribution Visual Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-400" />
            Distribution by Exam Domain ({questions.length} Questions)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {domainStats.map((ds, idx) => {
            const colors = [
              'border-amber-500/40 bg-amber-950/20 text-amber-300',
              'border-blue-500/40 bg-blue-950/20 text-blue-300',
              'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
              'border-purple-500/40 bg-purple-950/20 text-purple-300',
              'border-rose-500/40 bg-rose-950/20 text-rose-300',
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <div
                key={ds.domain}
                className={`p-4 rounded-xl border ${colorClass} flex flex-col justify-between space-y-3`}
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                    <span>Domain {idx + 1}</span>
                    <span>{ds.percentage}% of Bank</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {ds.domain}
                  </h4>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300 font-mono font-bold">
                    <span>Questions:</span>
                    <span>{ds.count}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-amber-400 h-full rounded-full" 
                      style={{ width: `${ds.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 1-16 Distribution Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Questions Per Exam Part (16 Total Parts)
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-2">
          {partStats.map((ps) => (
            <div 
              key={ps.part} 
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-center flex flex-col justify-between min-h-[60px]"
            >
              <span className="text-[10px] font-mono text-slate-400">Part {ps.part}</span>
              <span className="text-sm font-black font-mono text-amber-400">{ps.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Question Explorer with Direct Jump */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            Interactive Question Finder ({filteredQuestions.length} Matches)
          </h3>

          {/* Domain Filter Pills */}
          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Domains ({questions.length})</option>
            {domainStats.map((ds) => (
              <option key={ds.domain} value={ds.domain}>
                {ds.domain} ({ds.count})
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by topic, keywords (e.g. 'RAG', 'Clarify', 'Guardrails', 'Textract', 'SHAP')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/60">
          {filteredQuestions.slice(0, 50).map((q) => (
            <div 
              key={q.id}
              className="pt-2 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-950/60 p-2 rounded-lg transition-colors"
            >
              <div className="space-y-0.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-500/20 text-amber-300 font-mono text-xs font-bold px-2 py-0.5 rounded">
                    Q{q.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Part {q.part}</span>
                  <span className="text-xs text-slate-300 font-bold truncate">{q.topic}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">
                  {q.questionText}
                </p>
              </div>

              <button
                onClick={() => onSelectQuestion?.(q.id)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition-all shrink-0 shadow-sm"
              >
                <span>Practice Q{q.id}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No questions found matching "{searchQuery}".
            </div>
          )}

          {filteredQuestions.length > 50 && (
            <div className="text-center py-2 text-xs text-slate-500 font-mono">
              Showing first 50 of {filteredQuestions.length} matches. Refine search query for specific topics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
