import React, { useState, useMemo } from 'react';
import { comparisonTables, ComparisonTable } from './reckonerData';
import { Table, Search, Sparkles, AlertTriangle, CheckCircle2, Filter, Layers, ArrowRight } from 'lucide-react';

interface ComparisonTablesProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ComparisonTables: React.FC<ComparisonTablesProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTableId, setActiveTableId] = useState<string>(comparisonTables[0].id);

  const filteredTables = useMemo(() => {
    return comparisonTables.filter((table) => {
      const matchesCategory = selectedCategory === 'all' || table.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        table.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.rows.some(r => r.feature.toLowerCase().includes(searchQuery.toLowerCase()) || r.values.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeTable = filteredTables.find(t => t.id === activeTableId) || filteredTables[0] || comparisonTables[0];

  const categories = [
    { id: 'all', label: 'All Tables' },
    { id: 'core-services', label: 'AWS Services' },
    { id: 'genai-techniques', label: 'GenAI & Customization' },
    { id: 'governance', label: 'Governance & Clarify' },
    { id: 'metrics', label: 'Evaluation Metrics' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Search & Category Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-md">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all comparison tables, differences, metrics, and services..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filteredTables.map((table) => {
          const isActive = table.id === activeTable.id;
          return (
            <button
              key={table.id}
              onClick={() => setActiveTableId(table.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/60 text-amber-300 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-amber-400" />
              <span>{table.title.split('(')[0].trim()}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {table.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Table Display */}
      {activeTable ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Header Banner */}
          <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-850">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  {activeTable.badge}
                </span>
                <span className="text-xs text-slate-400">
                  AIF-C01 Cheat Sheet
                </span>
              </div>
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {activeTable.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {activeTable.description}
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  {activeTable.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`p-3.5 sm:p-4 text-xs font-bold uppercase tracking-wider text-slate-300 ${
                        idx === 0 ? 'min-w-[160px] sm:min-w-[200px] text-amber-400' : 'min-w-[220px]'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {activeTable.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`transition-colors ${
                      row.highlight
                        ? 'bg-amber-950/15 hover:bg-amber-950/25'
                        : rIdx % 2 === 0
                        ? 'bg-slate-900/40 hover:bg-slate-800/60'
                        : 'bg-slate-900/80 hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Feature Title / First Column */}
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-200 align-top">
                      <div className="flex items-start space-x-1.5">
                        {row.highlight && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <span>{row.feature}</span>
                      </div>
                      {row.examTip && (
                        <div className="mt-2 text-[11px] font-normal text-amber-300/90 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2 leading-tight flex items-start space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{row.examTip}</span>
                        </div>
                      )}
                    </td>

                    {/* Value Columns */}
                    {row.values.map((val, vIdx) => (
                      <td
                        key={vIdx}
                        className="p-3.5 sm:p-4 text-slate-300 align-top leading-relaxed"
                      >
                        <div className="whitespace-pre-line">
                          {val}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Takeaway Footer */}
          <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                Exam Key Takeaway & Golden Rule
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {activeTable.keyTakeaway}
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
          No comparison tables matched your search query. Try clearing filters.
        </div>
      )}

      {/* Quick Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase">
            <Layers className="w-4 h-4" />
            <span>Fast Recall Rule</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">OCR / Documents:</strong> Textract<br/>
            <strong className="text-white">Text NLP / PII:</strong> Comprehend<br/>
            <strong className="text-white">Vision / PPE:</strong> Rekognition<br/>
            <strong className="text-white">Audio to Text:</strong> Transcribe<br/>
            <strong className="text-white">Text to Audio:</strong> Polly
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Governance Rule</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">AWS Services:</strong> AI Service Cards<br/>
            <strong className="text-white">Custom Models:</strong> Model Cards<br/>
            <strong className="text-white">Pre/Post Bias & SHAP:</strong> Clarify<br/>
            <strong className="text-white">Production Drift:</strong> Model Monitor
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>GenAI Adaptation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Dynamic Private Docs:</strong> RAG<br/>
            <strong className="text-white">Proprietary Format/Tone:</strong> Fine-Tuning<br/>
            <strong className="text-white">Raw Domain Vocabulary:</strong> Continued Pre-training<br/>
            <strong className="text-white">Reasoning / Steps:</strong> Chain-of-Thought
          </p>
        </div>
      </div>

    </div>
  );
};
