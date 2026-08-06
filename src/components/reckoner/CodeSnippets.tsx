import React, { useState, useRef } from 'react';
import { codeSnippets, CodeSnippet } from './reckonerData';
import { 
  Code, Copy, Check, Terminal, AlertTriangle, Info, 
  Search, Filter, Play, Sparkles, BookOpen, CheckCircle2, 
  ArrowRight, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';

interface CodeSnippetsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = ({ onSelectQuestion }) => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(codeSnippets[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationOutput, setSimulationOutput] = useState<string | null>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const filteredSnippets = codeSnippets.filter((snippet) => {
    const matchesCategory = categoryFilter === 'all' || snippet.category === categoryFilter;
    const matchesSearch = searchQuery.trim() === '' ||
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeIndex = filteredSnippets.findIndex(s => s.id === selectedSnippetId);
  const activeSnippet = (activeIndex >= 0 ? filteredSnippets[activeIndex] : filteredSnippets[0]) || codeSnippets[0];
  const actualIndex = filteredSnippets.findIndex(s => s.id === activeSnippet.id);
  const prevSnippet = actualIndex > 0 ? filteredSnippets[actualIndex - 1] : null;
  const nextSnippet = actualIndex < filteredSnippets.length - 1 ? filteredSnippets[actualIndex + 1] : null;

  const handleSelectSnippet = (id: string) => {
    setSelectedSnippetId(id);
    setSimulationOutput(null);
    if (snippetContainerRef.current) {
      snippetContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationOutput(null);
    setTimeout(() => {
      setIsSimulating(false);
      if (activeSnippet.id === 'bedrock-invoke') {
        setSimulationOutput(JSON.stringify({
          statusCode: 200,
          responseBody: {
            completion: "Customer refund of $85.00 has been verified against receipt #4921.",
            stop_reason: "end_turn",
            usage: { input_tokens: 42, output_tokens: 18 }
          }
        }, null, 2));
      } else if (activeSnippet.id === 'bedrock-kb-retrieve') {
        setSimulationOutput(JSON.stringify({
          output: {
            text: "Under the 2026 Remote Work Travel Policy, daily meals are capped at $85/day with itemized receipts."
          },
          citations: [
            { sourceLocation: { type: "S3", uri: "s3://enterprise-kb/policies/2026_Travel.pdf" } }
          ]
        }, null, 2));
      } else {
        setSimulationOutput(JSON.stringify({
          status: "SUCCESS",
          executionTimeMs: 142,
          message: "Payload validated successfully against AWS AIF-C01 Boto3 API specifications."
        }, null, 2));
      }
    }, 600);
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: 'All Snippets' },
    { id: 'bedrock', label: 'Amazon Bedrock' },
    { id: 'rag', label: 'RAG Knowledge Bases' },
    { id: 'guardrails', label: 'Guardrails' },
    { id: 'prebuilt-ai', label: 'Pre-built AI' },
  ];

  return (
    <div className="space-y-5" ref={snippetContainerRef}>
      
      {/* Search & Category Filter */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search API methods, parameters, JSON payload keys..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets Navigation Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-lg">
        
        <button
          onClick={() => scrollTabs('left')}
          className="w-7 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden sm:flex"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={tabsScrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 px-1 w-full"
        >
          {filteredSnippets.map((snippet, idx) => {
            const isActive = snippet.id === activeSnippet?.id;
            return (
              <button
                key={snippet.id}
                onClick={() => handleSelectSnippet(snippet.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>{snippet.title}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollTabs('right')}
          className="w-7 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden sm:flex"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Prev / Next Snippet arrows */}
        <div className="flex items-center space-x-1 shrink-0 pl-1 border-l border-slate-800">
          <button
            onClick={() => prevSnippet && handleSelectSnippet(prevSnippet.id)}
            disabled={!prevSnippet}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              prevSnippet
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
            }`}
            title={prevSnippet ? `Previous: ${prevSnippet.title}` : 'No previous snippet'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 font-bold px-1 hidden md:inline">
            {actualIndex + 1}/{filteredSnippets.length}
          </span>

          <button
            onClick={() => nextSnippet && handleSelectSnippet(nextSnippet.id)}
            disabled={!nextSnippet}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              nextSnippet
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
            }`}
            title={nextSnippet ? `Next: ${nextSnippet.title}` : 'No next snippet'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Snippet Details */}
      {activeSnippet ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
          
          {/* Header */}
          <div className="p-5 sm:p-7 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-black uppercase">
                  {activeSnippet.service}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Snippet {actualIndex + 1} of {filteredSnippets.length}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {activeSnippet.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                {activeSnippet.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Simulating...' : 'Test Payload'}</span>
              </button>
              <button
                onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
              >
                {copiedId === activeSnippet.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-5 sm:p-7 space-y-5">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>python / boto3</span>
                </div>
                <span>AWS SDK for Python</span>
              </div>
              <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {activeSnippet.code}
              </pre>
            </div>

            {/* Simulation output if triggered */}
            {simulationOutput && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-2 animate-in fade-in">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mock AWS API Response Payload:</span>
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded-xl overflow-x-auto">
                  {simulationOutput}
                </pre>
              </div>
            )}

            {/* Key Parameters Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Key Parameters Tested on the Exam:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeSnippet.keyParameters.map((param, pIdx) => (
                  <div key={pIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-amber-300 font-bold block">
                      {param.param}
                    </span>
                    <p className="text-xs text-slate-400">{param.meaning}</p>
                    {param.examNote && (
                      <p className="text-[11px] text-amber-200/80 font-medium">★ {param.examNote}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Common Trap Alert */}
            {activeSnippet.commonTrap && (
              <div className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-4 flex items-start space-x-3 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-300 block mb-0.5">Common Exam Distractor Trap:</strong>
                  <p className="leading-relaxed">{activeSnippet.commonTrap}</p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Snippet Step Navigator */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
            <div>
              {prevSnippet ? (
                <button
                  onClick={() => handleSelectSnippet(prevSnippet.id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">Prev: {prevSnippet.title}</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-slate-600">First code snippet</span>
              )}
            </div>

            <div className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
              Snippet {actualIndex + 1} of {filteredSnippets.length}
            </div>

            <div>
              {nextSnippet ? (
                <button
                  onClick={() => handleSelectSnippet(nextSnippet.id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
                >
                  <span className="line-clamp-1">Next: {nextSnippet.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-mono text-slate-600">Last code snippet</span>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No code snippets matched your search query.
        </div>
      )}

    </div>
  );
};
