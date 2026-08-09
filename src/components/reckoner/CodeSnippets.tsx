import React, { useState, useRef } from 'react';
import { codeSnippets } from './reckonerData';
import { 
  Code, Copy, Check, Terminal, AlertTriangle, 
  Search, Play, CheckCircle2
} from 'lucide-react';

interface CodeSnippetsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(codeSnippets[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationOutput, setSimulationOutput] = useState<string | null>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);

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
      if (activeSnippet.id === 'bedrock-invoke-claude') {
        setSimulationOutput(JSON.stringify({
          statusCode: 200,
          responseBody: {
            id: "msg_01XyZ987Claude35",
            type: "message",
            role: "assistant",
            model: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            content: [
              {
                type: "text",
                text: "To optimize AWS costs for serverless AI, combine Bedrock Intelligent Prompt Routing with S3 Intelligent-Tiering and Lambda provisioned concurrency."
              }
            ],
            stop_reason: "end_turn",
            usage: { input_tokens: 38, output_tokens: 31 }
          }
        }, null, 2));
      } else if (activeSnippet.id === 'bedrock-invoke-guardrails') {
        setSimulationOutput(JSON.stringify({
          statusCode: 200,
          amazonBedrockInvocationMetrics: {
            guardrailInterventions: 1,
            action: "INTERVENED"
          },
          responseBody: {
            completion: "I cannot fulfill this request. Sensitive PII (Credit Card Number: [REDACTED-PCI-16]) was detected and masked by enterprise security guardrails.",
            amazonBedrockGuardrailAction: "GUARDRAIL_INTERVENED"
          }
        }, null, 2));
      } else if (activeSnippet.id === 'bedrock-retrieve-and-generate') {
        setSimulationOutput(JSON.stringify({
          statusCode: 200,
          output: {
            text: "According to the AWS Compliance Guide Section 4.2, Customer Managed Keys (KMS CMK) rotate automatically every 365 days when annual rotation is enabled."
          },
          citations: [
            {
              generatedResponsePart: { textRange: { start: 0, end: 145 } },
              retrievedReferences: [
                {
                  content: { text: "KMS CMK automatic key rotation occurs every 365 days..." },
                  location: { type: "S3", s3Location: { uri: "s3://enterprise-kb/compliance/kms_policy_2026.pdf" } }
                }
              ]
            }
          ]
        }, null, 2));
      } else if (activeSnippet.id === 'bedrock-agents-action-group') {
        setSimulationOutput(JSON.stringify({
          messageVersion: "1.0",
          response: {
            actionGroup: "FlightBookingActionGroup",
            apiPath: "/check-flight-status",
            httpMethod: "GET",
            httpStatusCode: 200,
            responseBody: {
              "application/json": {
                body: "{\"flightId\": \"UA-429\", \"status\": \"ON_TIME\", \"gate\": \"B14\", \"estimatedDeparture\": \"14:30 UTC\"}"
              }
            }
          }
        }, null, 2));
      } else if (activeSnippet.id === 'textract-analyze-document') {
        setSimulationOutput(JSON.stringify({
          DocumentMetadata: { Pages: 1 },
          Blocks: [
            { BlockType: "PAGE", Id: "b1", Confidence: 99.8 },
            { BlockType: "KEY_VALUE_SET", EntityTypes: ["KEY"], Text: "Invoice Total:" },
            { BlockType: "KEY_VALUE_SET", EntityTypes: ["VALUE"], Text: "$14,850.00" },
            { BlockType: "TABLE", Confidence: 99.4, RowCount: 4, ColumnCount: 3 }
          ],
          QueriesResult: [
            { Alias: "TOTAL_DUE", Text: "$14,850.00", Confidence: 99.2 }
          ]
        }, null, 2));
      } else if (activeSnippet.id === 'comprehend-detect-pii') {
        setSimulationOutput(JSON.stringify({
          Entities: [
            { Type: "NAME", Score: 0.998, BeginOffset: 9, EndOffset: 17, Text: "John Doe" },
            { Type: "SSN", Score: 0.999, BeginOffset: 24, EndOffset: 35, Text: "000-12-3456" },
            { Type: "EMAIL", Score: 0.997, BeginOffset: 67, EndOffset: 87, Text: "john.doe@example.com" }
          ]
        }, null, 2));
      } else if (activeSnippet.id === 'sagemaker-clarify-bias-config') {
        setSimulationOutput(JSON.stringify({
          pre_training_bias_metrics: {
            ClassImbalance: { value: 0.082, threshold: 0.1, status: "BALANCED" },
            DifferenceInPositiveProportionsInLabels: { value: 0.041, threshold: 0.1, status: "FAIR" }
          },
          explainability: {
            top_features_by_shap: [
              { feature: "credit_score", mean_abs_shap: 0.42 },
              { feature: "annual_income", mean_abs_shap: 0.31 },
              { feature: "debt_to_income", mean_abs_shap: 0.18 }
            ]
          }
        }, null, 2));
      } else if (activeSnippet.id === 'sagemaker-async-inference') {
        setSimulationOutput(JSON.stringify({
          OutputLocation: "s3://model-payload-bucket/outputs/job-49102-async-result.json",
          Status: "QUEUED",
          FailureLocation: "s3://model-payload-bucket/errors/job-49102-error.json",
          QueueArn: "arn:aws:sqs:us-east-1:123456789012:sagemaker-async-queue"
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

  const categories = [
    { id: 'all', label: 'All Snippets' },
    { id: 'bedrock', label: 'Amazon Bedrock' },
    { id: 'rag', label: 'RAG Knowledge Bases' },
    { id: 'guardrails', label: 'Guardrails' },
    { id: 'prebuilt-ai', label: 'Pre-built AI' },
    { id: 'sagemaker', label: 'SageMaker' },
  ];

  return (
    <div className="space-y-4" ref={snippetContainerRef}>
      
      {/* Search & Category Filter */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search API methods, parameters, JSON keys..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Snippets Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filteredSnippets.map((snippet) => {
          const isActive = snippet.id === activeSnippet?.id;
          return (
            <button
              key={snippet.id}
              onClick={() => handleSelectSnippet(snippet.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-500/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{snippet.title}</span>
            </button>
          );
        })}
      </div>

      {/* Snippet Details */}
      {activeSnippet ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase">
                  {activeSnippet.service}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {activeSnippet.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                {activeSnippet.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Simulating...' : 'Test Payload'}</span>
              </button>
              <button
                onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
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
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
              <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>python / boto3</span>
                </div>
                <span>AWS SDK for Python</span>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {activeSnippet.code}
              </pre>
            </div>

            {/* Simulation output if triggered */}
            {simulationOutput && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mock AWS API Response Payload:</span>
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg overflow-x-auto">
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
                  <div key={pIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
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
              <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-300 block mb-0.5 font-bold">Common Exam Distractor Trap:</strong>
                  <p className="leading-relaxed">{activeSnippet.commonTrap}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No code snippets matched your search query.
        </div>
      )}

    </div>
  );
};
