import React, { useState, useMemo, useRef } from 'react';
import { comparisonTables } from './reckonerData';
import { 
  Search, Sparkles, LayoutGrid, LayoutList
} from 'lucide-react';

interface ComparisonTablesProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ComparisonTables: React.FC<ComparisonTablesProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTableId, setActiveTableId] = useState<string>(comparisonTables[0].id);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const filteredTables = useMemo(() => {
    return comparisonTables.filter((table) => {
      const matchesCategory = selectedCategory === 'all' || table.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        table.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.rows.some(r => 
          r.feature.toLowerCase().includes(searchQuery.toLowerCase()) || 
          r.values.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
          r.examTip.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentIndex = filteredTables.findIndex(t => t.id === activeTableId);
  const activeTable = (currentIndex >= 0 ? filteredTables[currentIndex] : filteredTables[0]) || comparisonTables[0];

  const handleSelectTable = (tableId: string) => {
    setActiveTableId(tableId);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const categories = [
    { id: 'all', label: 'All Tables', count: comparisonTables.length },
    { id: 'core-services', label: 'AWS Services', count: comparisonTables.filter(t => t.category === 'core-services').length },
    { id: 'genai-techniques', label: 'GenAI & Customization', count: comparisonTables.filter(t => t.category === 'genai-techniques').length },
    { id: 'governance', label: 'Governance & Clarify', count: comparisonTables.filter(t => t.category === 'governance').length },
    { id: 'security', label: 'Security & Compliance', count: comparisonTables.filter(t => t.category === 'security').length },
    { id: 'metrics', label: 'Evaluation Metrics', count: comparisonTables.filter(t => t.category === 'metrics').length },
  ];

  return (
    <div className="space-y-4" ref={tableContainerRef}>
      
      {/* Search & Category Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comparison tables, differences, metrics..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* View Toggle & Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1 rounded ${
                selectedCategory === cat.id ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-900 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filteredTables.map((table, idx) => {
          const isActive = table.id === activeTable?.id;
          return (
            <button
              key={table.id}
              onClick={() => handleSelectTable(table.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-500/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span>{table.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Active Table Display */}
      {activeTable ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Header Banner */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-850">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                {activeTable.badge}
              </span>
            </div>
            
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {activeTable.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              {activeTable.description}
            </p>
          </div>

          {/* Render Mode: Table */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800">
                    {activeTable.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className={`p-3.5 sm:p-4 text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono ${
                          idx === 0 ? 'min-w-[170px] text-amber-400' : 'min-w-[200px] border-l border-slate-800/80'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                    <th className="p-3.5 sm:p-4 text-[11px] font-bold uppercase tracking-wider text-amber-400 min-w-[240px] font-mono border-l border-slate-800/80">
                      ★ Exam Clue & Trap Alert
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {activeTable.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="p-3.5 sm:p-4 font-bold text-white align-top">
                        <div className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                          <span>{row.feature}</span>
                        </div>
                      </td>
                      {row.values.map((val, vIdx) => (
                        <td key={vIdx} className="p-3.5 sm:p-4 text-slate-300 align-top leading-relaxed border-l border-slate-800/80">
                          {val}
                        </td>
                      ))}
                      <td className="p-3.5 sm:p-4 align-top border-l border-slate-800/80 bg-amber-500/[0.02]">
                        {row.examTip && (
                          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-2.5 text-xs text-amber-200 leading-relaxed font-medium space-y-1">
                            <div className="flex items-center space-x-1 text-amber-400 font-bold text-[11px]">
                              <Sparkles className="w-3 h-3 shrink-0" />
                              <span>Exam Takeaway:</span>
                            </div>
                            <p>{row.examTip}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Render Mode: Side-by-Side Cards */
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTable.rows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                      <h4 className="text-sm font-bold text-white">{row.feature}</h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      {row.values.map((val, vIdx) => (
                        <div key={vIdx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                            {activeTable.columns[vIdx + 1] || `Option ${vIdx + 1}`}
                          </span>
                          <p className="text-slate-200 leading-relaxed">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {row.examTip && (
                    <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-2.5 text-xs text-amber-200 space-y-1 mt-2">
                      <strong className="text-amber-300 font-bold flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Exam Clue:
                      </strong>
                      <p className="leading-relaxed">{row.examTip}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Master Key Takeaway Footer */}
          {activeTable.keyTakeaway && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Master Architectural Takeaway
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeTable.keyTakeaway}
                </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No comparison tables matched your search query.
        </div>
      )}

    </div>
  );
};
