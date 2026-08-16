import React, { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  Sparkles,
  FileCode,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCheck,
  RefreshCw,
  Eye,
  Terminal,
  Upload,
  Cpu,
  Code2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { RagIndexedFile, RagQueryResult, RagVisionInspectResult, AutonomousAgentTask } from '../types';

export const RagCodeIntelligencePanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rag_query' | 'vision_inspect' | 'autonomous_loop'>('rag_query');

  // RAG Query State
  const [ragQuery, setRagQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<RagQueryResult | null>(null);
  const [indexedFiles, setIndexedFiles] = useState<RagIndexedFile[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [isReindexing, setIsReindexing] = useState(false);

  // Vision Inspect State
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [visionContext, setVisionContext] = useState('');
  const [inspectFocus, setInspectFocus] = useState('general');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectResult, setInspectResult] = useState<RagVisionInspectResult | null>(null);

  // Autonomous Agent Loop State
  const [selectedTargetFile, setSelectedTargetFile] = useState('src/utils/codeGenerator.ts');
  const [agentActionType, setAgentActionType] = useState<'create_test' | 'fix_code'>('create_test');
  const [agentPrompt, setAgentPrompt] = useState('Bao quát các trường hợp biên, lỗi tham số và logic chính.');
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentTasks, setAgentTasks] = useState<AutonomousAgentTask[]>([]);

  // Fetch index metadata
  const fetchRagMetadata = async () => {
    try {
      const res = await fetch('/api/rag/files');
      const data = await res.json();
      if (data.files) {
        setIndexedFiles(data.files);
        setTotalChunks(data.totalChunks || 0);
      }
    } catch (e) {
      console.warn('Failed to fetch RAG files:', e);
    }
  };

  const handleReindex = async () => {
    try {
      setIsReindexing(true);
      const res = await fetch('/api/rag/index', { method: 'POST' });
      const data = await res.json();
      if (data.files) {
        setIndexedFiles(data.files);
        setTotalChunks(data.totalChunks || 0);
      }
    } catch (e) {
      console.error('Reindexing failed:', e);
    } finally {
      setIsReindexing(false);
    }
  };

  useEffect(() => {
    fetchRagMetadata();
  }, []);

  // Execute RAG Query
  const handleExecuteRagQuery = async (queryText?: string) => {
    const textToQuery = queryText || ragQuery;
    if (!textToQuery.trim()) return;

    try {
      setIsQuerying(true);
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToQuery,
          maxChunks: 8,
          model: 'gemini-3.7-flash',
          includeCoT: true,
        }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (e) {
      console.error('RAG query failed:', e);
    } finally {
      setIsQuerying(false);
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Execute Multimodal Screen Vision Inspect
  const handleExecuteVisionInspect = async () => {
    if (!screenshotBase64) return;
    try {
      setIsInspecting(true);
      const res = await fetch('/api/rag/vision-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshot: screenshotBase64,
          uiContext: visionContext || 'Kiểm tra giao diện ứng dụng và phát hiện các lỗi bố cục hoặc styling.',
          inspectFocus,
        }),
      });
      const data = await res.json();
      setInspectResult(data);
    } catch (e) {
      console.error('Vision inspect failed:', e);
    } finally {
      setIsInspecting(false);
    }
  };

  // Execute Autonomous Loop Action
  const handleExecuteAutonomousTask = async () => {
    try {
      setIsRunningAgent(true);
      const res = await fetch('/api/agent/autonomous-loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: agentActionType,
          targetFile: selectedTargetFile,
          prompt: agentPrompt,
        }),
      });
      const data = await res.json();
      const newTask: AutonomousAgentTask = {
        id: `task-${Date.now()}`,
        type: agentActionType,
        targetFile: selectedTargetFile,
        prompt: agentPrompt,
        status: data.success ? 'completed' : 'failed',
        resultMessage: data.resultMessage || data.error,
        generatedFilePath: data.generatedFilePath,
        codeDiff: data.generatedCodeSnippet,
        createdAt: new Date().toLocaleTimeString(),
      };
      setAgentTasks((prev) => [newTask, ...prev]);
    } catch (e: any) {
      console.error('Agent task failed:', e);
    } finally {
      setIsRunningAgent(false);
    }
  };

  const sampleQueries = [
    'Giải thích cách hệ thống Fallback Cascade của Gemini hoạt động trong server.ts',
    'Các API endpoint nào đang xử lý xác thực Admin và duyệt thanh toán VietQR?',
    'Module codeGenerator.ts hỗ trợ những ngôn ngữ lập trình nào?',
    'Tìm kiếm tất cả các component React đang sử dụng icon lucide-react',
  ];

  return (
    <div className="space-y-6">
      {/* Header Info & Stats */}
      <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Brain className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                RAG Codebase Intelligence & Autonomous Agent Hub
              </h2>
            </div>
            <p className="text-xs text-white/60 mt-1 max-w-2xl">
              AI đọc trực tiếp toàn bộ cây thư mục <code className="text-cyan-400 font-mono">/src</code> và <code className="text-cyan-400 font-mono">server.ts</code> để phân tích, giải đáp code chính xác với số dòng dẫn chứng, nhận diện lỗi UI/UX từ ảnh chụp màn hình và tự động tạo test/vá lỗi.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center space-x-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shrink-0 text-xs">
            <div className="flex items-center space-x-1.5 text-cyan-300">
              <FileCode className="w-4 h-4" />
              <span className="font-bold">{indexedFiles.length}</span>
              <span className="text-white/40">Files</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <Layers className="w-4 h-4" />
              <span className="font-bold">{totalChunks}</span>
              <span className="text-white/40">Chunks RAG</span>
            </div>
            <button
              onClick={handleReindex}
              disabled={isReindexing}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              title="Quét & Lập chỉ mục lại"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveSubTab('rag_query')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'rag_query'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>1. RAG Code QA & Tra Cứu Dòng Mã</span>
          </button>
          <button
            onClick={() => setActiveSubTab('vision_inspect')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'vision_inspect'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Multimodal UI/UX Diagnostic (Chụp Màn Hình)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('autonomous_loop')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'autonomous_loop'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>3. Autonomous Agent Loop (Tự Sinh Test & Fix)</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: RAG Query & QA */}
      {activeSubTab === 'rag_query' && (
        <div className="space-y-4">
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-white/10 space-y-4">
            <label className="block text-xs font-semibold text-white/80">
              Đặt câu hỏi kỹ thuật về bất kỳ file nào trong dự án:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteRagQuery()}
                placeholder="Ví dụ: Làm sao server.ts xử lý fallback khi gặp lỗi 429 Quota Exceeded?"
                className="flex-1 px-4 py-2.5 bg-black/50 rounded-xl border border-white/10 text-sm text-white placeholder-white/40 focus:outline-hidden focus:border-cyan-500"
              />
              <button
                onClick={() => handleExecuteRagQuery()}
                disabled={isQuerying || !ragQuery.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-black transition-all cursor-pointer disabled:opacity-50"
              >
                {isQuerying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Truy Xuất RAG...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Hỏi Codebase</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] text-white/40 block">Câu hỏi mẫu gợi ý:</span>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setRagQuery(q);
                      handleExecuteRagQuery(q);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RAG Query Result Display */}
          {queryResult && (
            <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-cyan-500/30 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Kết Quả Phân Tích RAG Codebase</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-white/50">
                  <span>Mô hình: <strong className="text-cyan-300 font-mono">{queryResult.modelUsed}</strong></span>
                  <span>•</span>
                  <span>Thời gian: <strong className="text-emerald-400 font-mono">{queryResult.durationMs}ms</strong></span>
                </div>
              </div>

              {/* CoT Reasoning Steps */}
              {queryResult.thoughtProcess && queryResult.thoughtProcess.length > 0 && (
                <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Chuỗi Lập Luận CoT (Chain-of-Thought)</span>
                  </span>
                  <ul className="space-y-1 text-xs text-white/70">
                    {queryResult.thoughtProcess.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-500 font-mono text-[10px] mt-0.5">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Answer */}
              <div className="prose prose-invert max-w-none text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-sans bg-[#141414] p-4 rounded-xl border border-white/5">
                {queryResult.answer}
              </div>

              {/* Cited Code Snippets */}
              {queryResult.citedFiles && queryResult.citedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white/80 flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Các Đoạn Mã Nguồn Thực Tế Được Trích Dẫn ({queryResult.citedFiles.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {queryResult.citedFiles.map((cite, idx) => (
                      <div key={idx} className="bg-black/60 rounded-xl p-3 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-emerald-400 truncate max-w-[200px]">
                            {cite.file}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-md text-white/60 font-mono">
                            Dòng {cite.startLine} - {cite.endLine}
                          </span>
                        </div>
                        <pre className="text-[11px] font-mono text-white/80 bg-[#0d0d0d] p-2.5 rounded-lg overflow-x-auto max-h-36 border border-white/5">
                          {cite.snippet}
                        </pre>
                        <p className="text-[11px] text-white/50">{cite.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: Multimodal UI/UX Diagnostic */}
      {activeSubTab === 'vision_inspect' && (
        <div className="space-y-5">
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Nhận Diện Lỗi Màn Hình UI/UX & Đối Chiếu Dòng Code</span>
            </h3>
            <p className="text-xs text-white/60">
              Tải ảnh chụp màn hình (từ Electron hoặc trình duyệt), Gemini Vision sẽ tự động phân tích các lỗi layout, clipping, màu sắc và chỉ điểm chính xác file & dòng code cần khắc phục.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Upload or Preview Box */}
              <div className="border-2 border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-black/30 relative min-h-[160px]">
                {screenshotBase64 ? (
                  <div className="relative w-full">
                    <img
                      src={screenshotBase64}
                      alt="Preview"
                      className="max-h-48 rounded-lg mx-auto object-contain border border-white/10"
                    />
                    <button
                      onClick={() => setScreenshotBase64(null)}
                      className="absolute top-1 right-1 bg-black/80 px-2 py-1 rounded text-[10px] text-red-400 hover:text-red-300"
                    >
                      Xóa
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-purple-400 animate-bounce" />
                    <span className="text-xs font-semibold text-white">Chọn hoặc Kéo Thả Ảnh Chụp Màn Hình</span>
                    <span className="text-[10px] text-white/40">Hỗ trợ PNG, JPG, WebP</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Prompt & Options */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Ghi chú ngữ cảnh cần tập trung:
                  </label>
                  <input
                    type="text"
                    value={visionContext}
                    onChange={(e) => setVisionContext(e.target.value)}
                    placeholder="Ví dụ: Kiểm tra nút bấm Header bị tràn dòng trên di động"
                    className="w-full px-3 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Trọng tâm kiểm tra:
                  </label>
                  <select
                    value={inspectFocus}
                    onChange={(e) => setInspectFocus(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="general">Toàn Diện (Bố cục, màu sắc, phông chữ)</option>
                    <option value="responsiveness">Đáp Ứng Màn Hình (Mobile & Tablet)</option>
                    <option value="contrast">Độ Tương Phản Màu & Trợ Năng (WCAG AA)</option>
                    <option value="component_clipping">Tràn Bố Cục (Overflow & Clipping)</option>
                  </select>
                </div>

                <button
                  onClick={handleExecuteVisionInspect}
                  disabled={isInspecting || !screenshotBase64}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isInspecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Phân Tích & Đối Chiếu Codebase...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Chẩn Đoán Lỗi UI/UX</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Vision Diagnostic Result */}
          {inspectResult && (
            <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-white">Kết Quả Chẩn Đoán Lỗi Giao Diện & Vị Trí Code</span>
                <span className="text-[11px] text-purple-400 font-mono">Gemini 3.7 Vision Engine</span>
              </div>

              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 text-xs text-white/80">
                <strong className="text-white block mb-1">Đánh Giá Tổng Thể:</strong>
                <p>{inspectResult.overallAssessment}</p>
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                {inspectResult.detectedIssues.map((issue, idx) => (
                  <div key={idx} className="bg-black/60 rounded-xl p-4 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <AlertTriangle className={`w-4 h-4 ${issue.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                        <span className="text-xs font-bold text-white">{issue.description}</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">
                        {issue.type} • {issue.severity}
                      </span>
                    </div>

                    <div className="text-xs text-cyan-300 font-mono bg-[#141414] px-3 py-1.5 rounded-lg flex items-center justify-between">
                      <span>Vị Trí Code: <strong>{issue.suspectedFile}</strong></span>
                      <span className="text-white/60">{issue.suspectedLines}</span>
                    </div>

                    <p className="text-xs text-white/70">
                      <strong>Khắc phục:</strong> {issue.suggestedFix}
                    </p>

                    {issue.codeFixSnippet && (
                      <pre className="text-[11px] font-mono text-emerald-400 bg-black/80 p-2.5 rounded-lg overflow-x-auto border border-emerald-500/20">
                        {issue.codeFixSnippet}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: Autonomous Agent Loop */}
      {activeSubTab === 'autonomous_loop' && (
        <div className="space-y-5">
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Vòng Lặp Tác Tử Tự Hành (Autonomous Agent Loop)</span>
            </h3>
            <p className="text-xs text-white/60">
              Ủy quyền cho AI tự động đọc file mã nguồn trong dự án, viết unit test hoàn chỉnh vào thư mục <code className="text-emerald-400 font-mono">tests/</code> hoặc sinh bản vá mã nguồn tối ưu.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Chọn File Mã Nguồn Mục Tiêu:
                </label>
                <select
                  value={selectedTargetFile}
                  onChange={(e) => setSelectedTargetFile(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                >
                  {indexedFiles.map((f) => (
                    <option key={f.path} value={f.path}>
                      {f.path} ({f.lines} dòng)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Hành Động Tự Hành:
                </label>
                <select
                  value={agentActionType}
                  onChange={(e) => setAgentActionType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="create_test">Tự động sinh Unit Test Suite</option>
                  <option value="fix_code">Tự động sửa lỗi & tối ưu mã</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Chỉ Dẫn Bổ Sung:
                </label>
                <input
                  type="text"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  placeholder="Yêu cầu cụ thể..."
                  className="w-full px-3 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteAutonomousTask}
              disabled={isRunningAgent}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isRunningAgent ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Tác Tử Đang Đọc File & Tạo Kết Quả...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Kích Hoạt Tác Tử Tự Hành</span>
                </>
              )}
            </button>
          </div>

          {/* Task History & Results */}
          {agentTasks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white/80 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Nhật Ký Tác Vụ Tự Hành Đã Thực Thi ({agentTasks.length})</span>
              </h4>

              {agentTasks.map((task) => (
                <div key={task.id} className="bg-[#0f0f0f] rounded-2xl p-4 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-2 font-bold text-white">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      <span>{task.resultMessage}</span>
                    </span>
                    <span className="text-[11px] text-white/40 font-mono">{task.createdAt}</span>
                  </div>

                  <div className="text-[11px] text-white/60 flex items-center space-x-4">
                    <span>Target: <strong className="text-cyan-300 font-mono">{task.targetFile}</strong></span>
                    {task.generatedFilePath && (
                      <span>Output File: <strong className="text-emerald-400 font-mono">{task.generatedFilePath}</strong></span>
                    )}
                  </div>

                  {task.codeDiff && (
                    <pre className="text-[11px] font-mono text-emerald-300 bg-black/80 p-3 rounded-xl overflow-x-auto max-h-48 border border-white/5">
                      {task.codeDiff}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
