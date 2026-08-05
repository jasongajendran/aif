import React, { useState } from 'react';
import { codeSnippets, CodeSnippet } from './reckonerData';
import { Code, Copy, Check, Terminal, AlertTriangle, Info, Search, Filter } from 'lucide-react';

interface CodeSnippetsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(codeSnippets[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredSnippets = codeSnippets.filter((snippet) => {
    const matchesCategory = categoryFilter === 'all' || snippet.category === categoryFilter;
    const matchesSearch = searchQuery.trim() === '' ||
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeSnippet = filteredSnippets.find(s => s.id === selectedSnippetId) || filteredSnippets[0] || codeSnippets[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Code' },
    { id: 'bedrock', label: 'Bedrock API' },
    { id: 'rag', label: 'RAG & Knowledge Bases' },
    { id: 'guardrails', label: 'Guardrails' },
    { id: 'prebuilt-ai', label: 'Textract & Comprehend' },
    { id: 'sagemaker', label: 'SageMaker Clarify' },
  ];

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
            placeholder="Search Boto3 code snippets, API methods, and parameters..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filteredSnippets.map((snippet) => {
          const isActive = snippet.id === activeSnippet.id;
          return (
            <button
              key={snippet.id}
              onClick={() => setSelectedSnippetId(snippet.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/60 text-amber-300 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>{snippet.title.split(':')[1]?.trim() || snippet.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {snippet.service}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Snippet Viewer */}
      {activeSnippet ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase">
                  {activeSnippet.service}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Python 3 / Boto3 SDK
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeSnippet.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {activeSnippet.description}
              </p>
            </div>

            <button
              onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2 shrink-0 self-start sm:self-center shadow-sm"
              title="Copy code snippet to clipboard"
            >
              {copiedId === activeSnippet.id ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Window */}
          <div className="relative bg-slate-950 p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed border-b border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-slate-400">aws_sdk_snippet.py</span>
              </div>
              <div className="flex items-center space-x-1">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>boto3</span>
              </div>
            </div>
            
            <pre className="text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-mono">
              <code>{activeSnippet.code}</code>
            </pre>
          </div>

          {/* Key Parameters & Traps Section */}
          <div className="p-5 sm:p-6 bg-slate-900/90 space-y-5">
            
            {/* Parameters Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center space-x-1.5">
                <Info className="w-4 h-4" />
                <span>Key API Parameters & Specifications</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeSnippet.keyParameters.map((param, pIdx) => (
                  <div key={pIdx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {param.param}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {param.meaning}
                    </p>
                    {param.examNote && (
                      <span className="inline-block text-[11px] text-emerald-400 font-semibold mt-1">
                        ★ Exam Note: {param.examNote}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Trap Warning */}
            <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-4 flex items-start space-x-3 text-xs text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 font-bold block mb-0.5">
                  Exam Trap Alert:
                </strong>
                <p className="leading-relaxed text-slate-200">
                  {activeSnippet.commonTrap}
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
          No code snippets matched your search. Try resetting filters.
        </div>
      )}

    </div>
  );
};
