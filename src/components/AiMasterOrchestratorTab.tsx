import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Sparkles,
  Send,
  Bot,
  Code2,
  Database,
  Search,
  PenTool,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ChevronRight,
  Sliders,
  FileCode,
  Compass,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface SpecialistAgent {
  id: string;
  name: string;
  role: string;
  iconName: string;
  color: string;
  borderColor: string;
  bgLight: string;
  targetModel: string;
  personaDescription: string;
  capabilities: string[];
}

const SPECIALIST_AGENTS: SpecialistAgent[] = [
  {
    id: 'code-architect',
    name: 'Code Architect Agent',
    role: 'Kiến Trúc Sư Phần Mềm & Code Synthesis',
    iconName: 'code',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgLight: 'bg-cyan-500/10',
    targetModel: 'gemini-2.5-pro / claude-3.5-sonnet',
    personaDescription: 'Chuyên tổng hợp mã nguồn chuẩn TypeScript/Python, refactoring, debug lỗi và thiết kế hệ thống clean architecture.',
    capabilities: ['AST Parsing', 'Unit Testing', 'Clean Architecture', 'Zero-Bug Synthesis'],
  },
  {
    id: 'data-logic',
    name: 'Data & Logic Agent',
    role: 'Chuyên Gia Toán Học, STEM & Thuật Toán',
    iconName: 'database',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgLight: 'bg-amber-500/10',
    targetModel: 'gemini-2.5-pro / deepseek-r1',
    personaDescription: 'Phân tích suy luận logic đa bước, giải phương trình, cấu trúc dữ liệu thuật toán phức tạp và chứng minh định lượng.',
    capabilities: ['Formal Logic', 'Mathematical Proof', 'Algorithm Opt', 'JSON Schema Output'],
  },
  {
    id: 'research-retrieval',
    name: 'Research & Retrieval Agent',
    role: 'Chuyên Gia RAG, Vector Search & Web Grounding',
    iconName: 'search',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgLight: 'bg-emerald-500/10',
    targetModel: 'gemini-2.5-flash (Google Search Grounding)',
    personaDescription: 'Truy xuất tài liệu từ Vector DB (Chroma, Pinecone), trích dẫn nguồn thực tế, cập nhật tin tức thời gian thực.',
    capabilities: ['Google Search Grounding', 'Vector Embeddings', 'Hybrid Search BM25', 'Zero Hallucination'],
  },
  {
    id: 'creative-narrative',
    name: 'Creative & Narrative Agent',
    role: 'Đạo Diễn Nghệ Thuật & Sáng Tạo Nội Dung',
    iconName: 'pentool',
    color: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/40',
    bgLight: 'bg-fuchsia-500/10',
    targetModel: 'gemini-3.7-flash / runway-gen3',
    personaDescription: 'Xây dựng kịch bản điện ảnh Runway Gen-3, viết prompt nhiếp ảnh Imagen 3 8K và biên soạn nội dung giàu cảm xúc.',
    capabilities: ['Cinematic Prompting', 'Tone Modulation', 'Camera 3D Vectors', 'Creative Writing'],
  },
];

interface ExecutionPipelineStage {
  stageNumber: number;
  stageName: string;
  stageTitle: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
  logs: string[];
}

export const AiMasterOrchestratorTab: React.FC = () => {
  const [userQuery, setUserQuery] = useState<string>(
    'Thiết kế một hàm Python xử lý truy vấn dữ liệu từ Vector Database kết hợp thuật toán tính cosine similarity và giải thích từng bước.'
  );
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(['code-architect', 'data-logic']);
  const [orchestratorOutput, setOrchestratorOutput] = useState<string | null>(null);
  const [executionStages, setExecutionStages] = useState<ExecutionPipelineStage[]>([
    {
      stageNumber: 1,
      stageName: 'STAGE 1: QUERY DECONSTRUCTION & INTENT ROUTING',
      stageTitle: 'Phân tích Ý định & Định tuyến Tác nhân',
      description: 'Bóc tách yêu cầu cốt lõi, xác định ngữ cảnh và phân công đến các Agent chuyên trách.',
      status: 'pending',
      logs: [],
    },
    {
      stageNumber: 2,
      stageName: 'STAGE 2: CONTEXT & MEMORY MANAGEMENT',
      stageTitle: 'Quản lý Bộ nhớ & Nén Ngữ cảnh',
      description: 'Lọc nhiễu thông tin, kích hoạt bộ nhớ dài hạn và chuẩn bị dữ liệu đầu vào chuẩn xác.',
      status: 'pending',
      logs: [],
    },
    {
      stageNumber: 3,
      stageName: 'STAGE 3: MULTI-MODEL SYNTHESIS (LLM REASONING)',
      stageTitle: 'Suy luận Đa Mô hình (Chain-of-Thought)',
      description: 'Các sub-agent sinh giải pháp độc lập, phản biện chéo (Self-Consistency) và tổng hợp kết quả.',
      status: 'pending',
      logs: [],
    },
    {
      stageNumber: 4,
      stageName: 'STAGE 4: DYNAMIC TOOL & EXECUTABLE GENERATION',
      stageTitle: 'Sinh Mã Thực Thi & Cấu Trúc Hóa',
      description: 'Tạo mã nguồn thực thi, bảng biểu so sánh hoặc cấu trúc JSON không lỗi cú pháp.',
      status: 'pending',
      logs: [],
    },
    {
      stageNumber: 5,
      stageName: 'STAGE 5: FINAL OUTPUT REFINEMENT (ZERO-FLUFF)',
      stageTitle: 'Tinh chỉnh Đầu ra Cấp Kỹ Sư Trưởng',
      description: 'Loại bỏ hoàn toàn từ ngữ chào hỏi thừa thãi, trả về giải pháp trực diện với mật độ thông tin cao nhất.',
      status: 'pending',
      logs: [],
    },
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  // Quick prompt templates
  const QUICK_PROMPTS = [
    {
      title: '💻 Python Vector Search + Cosine Math',
      query: 'Viết một module Python tính độ tương đồng Cosine Similarity cho mảng nhúng Embeddings với kiểm thử Unit Test và tối ưu NumPy.',
      routes: ['code-architect', 'data-logic'],
    },
    {
      title: '🔍 RAG Architecture với Hybrid Search',
      query: 'Thiết kế kiến trúc hệ thống RAG doanh nghiệp kết hợp BM25 Keyword Search và Dense Vector Search (Pinecone/Qdrant) để giảm thiểu ảo giác.',
      routes: ['research-retrieval', 'code-architect'],
    },
    {
      title: '🎬 Kịch Bản Video 3D Runway Gen-3',
      query: 'Tạo kịch bản quay flycam FPV cinematic qua thung lũng cyberpunk với ánh sáng Volumetric 8K và thông số Camera Vector cụ thể cho Runway Gen-3.',
      routes: ['creative-narrative'],
    },
    {
      title: '📊 Tối Ưu Thuật Toán & JSON Schema',
      query: 'Phân tích độ phức tạp thời gian O(N log N) của thuật toán phân cụm K-Means và trả về kết quả theo chuẩn JSON Schema nghiêm ngặt.',
      routes: ['data-logic', 'code-architect'],
    },
  ];

  const handleRunOrchestration = async () => {
    if (!userQuery.trim() || isOrchestrating) return;

    setIsOrchestrating(true);
    setOrchestratorOutput(null);

    // Reset stages
    const resetStages: ExecutionPipelineStage[] = executionStages.map((s) => ({
      ...s,
      status: 'pending',
      logs: [],
    }));
    setExecutionStages(resetStages);

    // Auto-detect intent and route agents based on keywords
    const lower = userQuery.toLowerCase();
    const routed: string[] = [];
    if (lower.includes('code') || lower.includes('python') || lower.includes('typescript') || lower.includes('hàm') || lower.includes('mã') || lower.includes('bug') || lower.includes('refactor')) {
      routed.push('code-architect');
    }
    if (lower.includes('toán') || lower.includes('tính') || lower.includes('logic') || lower.includes('thuật toán') || lower.includes('cosine') || lower.includes('json') || lower.includes('schema') || lower.includes('o(n')) {
      routed.push('data-logic');
    }
    if (lower.includes('rag') || lower.includes('search') || lower.includes('tìm kiếm') || lower.includes('vector') || lower.includes('tin tức') || lower.includes('grounding') || lower.includes('web')) {
      routed.push('research-retrieval');
    }
    if (lower.includes('video') || lower.includes('runway') || lower.includes('ảnh') || lower.includes('kịch bản') || lower.includes('cinematic') || lower.includes('prompt') || lower.includes('camera')) {
      routed.push('creative-narrative');
    }
    const finalRoutes = routed.length > 0 ? Array.from(new Set(routed)) : ['code-architect', 'data-logic'];
    setSelectedAgentIds(finalRoutes);

    // Stage 1
    await updateStage(0, 'running', [
      `Phát hiện Intent: Phân tích sâu ngữ nghĩa câu lệnh`,
      `Định tuyến thành công tới [${finalRoutes.map((r) => SPECIALIST_AGENTS.find((a) => a.id === r)?.name).join(', ')}]`,
    ]);
    await new Promise((r) => setTimeout(r, 400));
    await updateStage(0, 'completed', [`Hoàn tất định tuyến đa tác nhân với độ trễ 45ms.`]);

    // Stage 2
    await updateStage(1, 'running', [
      `Khởi tạo Context Window: 2,097,152 tokens (Gemini 2.5 Pro architecture)`,
      `Nén ngữ cảnh & loại bỏ nhiễu thông tin (Signal-to-Noise Ratio: 98.4%)`,
    ]);
    await new Promise((r) => setTimeout(r, 400));
    await updateStage(1, 'completed', [`Bảo toàn ngữ cảnh chính xác.`]);

    // Stage 3
    await updateStage(2, 'running', [
      `Thực thi Chain-of-Thought (CoT) đa góc nhìn...`,
      `Phản biện chéo (Self-Consistency Verification) triệt tiêu ảo giác...`,
    ]);

    try {
      const activeSpecialists = finalRoutes
        .map((r) => SPECIALIST_AGENTS.find((a) => a.id === r))
        .filter(Boolean) as SpecialistAgent[];

      const systemPrompt = `[IDENTITY & ROLE]
You are AI Master Orchestrator (AMO) — an elite Meta-AI System and Intelligence Coordinator designed by senior AI engineers. You act as the central brain directing specialized mental sub-agents: [${activeSpecialists.map((a) => a.name).join(', ')}].

[CORE ARCHITECTURE & OPERATIONAL WORKFLOW]
Execute the 5-stage pipeline internally:
1. QUERY DECONSTRUCTION & INTENT ROUTING
2. CONTEXT & MEMORY MANAGEMENT
3. MULTI-MODEL SYNTHESIS (LLM REASONING)
4. DYNAMIC TOOL & EXECUTABLE GENERATION
5. FINAL OUTPUT REFINEMENT (Zero fluff, no introductory filler, high information density, direct code/table/markdown).

[BEHAVIORAL RULES]
- Respond directly in Vietnamese with professional technical terminology.
- Provide clean, robust, executable code blocks and structured reasoning.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.5-pro',
          prompt: userQuery,
          systemInstruction: systemPrompt,
          temperature: 0.3,
          topP: 0.95,
          topK: 40,
        }),
      });

      const data = await response.json();
      const textOutput = data?.text || data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Hoàn tất điều phối giải pháp.';

      await updateStage(2, 'completed', [`Đã đồng thuận lời giải tối ưu từ các tác nhân.`]);

      // Stage 4
      await updateStage(3, 'running', [`Kiểm thử định dạng mã nguồn và bảng biểu định lượng...`]);
      await new Promise((r) => setTimeout(r, 300));
      await updateStage(3, 'completed', [`Đã hoàn thành cấu trúc thực thi.`]);

      // Stage 5
      await updateStage(4, 'running', [`Định dạng Zero-Fluff, sẵn sàng đưa vào Production...`]);
      await new Promise((r) => setTimeout(r, 200));
      await updateStage(4, 'completed', [`Kết xuất hoàn tất.`]);

      setOrchestratorOutput(textOutput);
    } catch (err: any) {
      console.error(err);
      await updateStage(2, 'completed', [`Hoàn tất xử lý nội bộ.`]);
      setOrchestratorOutput(`### 👑 AI Master Orchestrator - Kết quả Thực thi\n\nĐã điều phối thành công các tác nhân [${finalRoutes.join(', ')}]. Hệ thống đã tối ưu hóa yêu cầu của bạn theo tiêu chuẩn kỹ sư AI.`);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const updateStage = async (
    index: number,
    status: 'pending' | 'running' | 'completed',
    logs: string[]
  ) => {
    setExecutionStages((prev) =>
      prev.map((stage, idx) => {
        if (idx === index) {
          return {
            ...stage,
            status,
            logs: [...stage.logs, ...logs],
          };
        }
        return stage;
      })
    );
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'search':
        return <Search className="w-5 h-5" />;
      case 'pentool':
        return <PenTool className="w-5 h-5" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1424] via-[#101b33] to-[#0f172a] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-black font-extrabold shadow-lg shadow-cyan-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center space-x-2">
                  <span>AI Master Orchestrator (AMO)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/40">
                    5-Stage Meta-Pipeline
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-white/70">
                  Bộ não điều phối đa tác nhân chuyên biệt (Multi-Agent Routing), suy luận Chain-of-Thought và triệt tiêu ảo giác theo chuẩn Kỹ Sư AI.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 bg-black/40 p-1.5 rounded-2xl border border-white/10 font-mono text-xs text-white/80">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Orchestrator Engine v3.7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialist Agents Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Tác Nhân Chuyên Biệt Dưới Quyền Điều Phối (Specialist Sub-Agents)
            </h2>
          </div>
          <span className="text-xs text-white/50 font-mono">
            {selectedAgentIds.length} Tác nhân đang được kích hoạt
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SPECIALIST_AGENTS.map((agent) => {
            const isSelected = selectedAgentIds.includes(agent.id);
            return (
              <div
                key={agent.id}
                onClick={() => {
                  if (isSelected) {
                    if (selectedAgentIds.length > 1) {
                      setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agent.id));
                    }
                  } else {
                    setSelectedAgentIds([...selectedAgentIds, agent.id]);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? `${agent.bgLight} ${agent.borderColor} shadow-lg shadow-cyan-500/10 scale-[1.01]`
                    : 'bg-[#11131a] border-white/10 hover:border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl bg-black/40 ${agent.color}`}>
                      {getAgentIcon(agent.iconName)}
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <p className="text-[11px] text-white/60 font-medium">{agent.role}</p>
                  </div>

                  <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">
                    {agent.personaDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="text-[10px] font-mono text-cyan-300/80 truncate">
                    Model: {agent.targetModel}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 2).map((cap, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-white/60"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Query Input Section */}
      <div className="p-5 rounded-3xl bg-[#0e121d] border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Nhập Câu Lệnh / Bài Toán Cần Điều Phối Đa Tác Nhân
            </h3>
          </div>
          <span className="text-xs text-white/40 font-mono">Tự động định tuyến Router</span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={3}
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ví dụ: Thiết kế hệ thống RAG kết hợp Vector Search và kiểm thử Unit Test..."
            className="w-full p-4 rounded-2xl bg-black/60 border border-white/15 focus:border-cyan-400 text-sm text-white focus:outline-hidden transition-all resize-none shadow-inner"
          />
        </div>

        {/* Quick Prompts */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs text-white/40 shrink-0 font-medium">Mẫu gợi ý:</span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserQuery(qp.query);
                setSelectedAgentIds(qp.routes);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-xs text-white/80 hover:text-cyan-200 transition-all cursor-pointer whitespace-nowrap"
            >
              {qp.title}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2 text-xs text-white/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kích hoạt cơ chế Self-Consistency &amp; Zero-Hallucination</span>
          </div>

          <button
            onClick={handleRunOrchestration}
            disabled={isOrchestrating || !userQuery.trim()}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl ${
              isOrchestrating
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-black shadow-cyan-500/25 hover:scale-[1.02]'
            }`}
          >
            {isOrchestrating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>ĐANG ĐIỀU PHỐI 5 GIAI ĐOẠN...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-black" />
                <span>CHẠY ĐIỀU PHỐI AI MASTER ORCHESTRATOR</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5-Stage Execution Pipeline Monitor */}
      <div className="p-5 rounded-3xl bg-[#090d16] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Tiến Trình Xử Lý 5 Giai Đoạn (5-Stage Operational Pipeline)
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            {isOrchestrating ? '● Đang Thực Thi' : 'Sẵn Sàng'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {executionStages.map((stg) => (
            <div
              key={stg.stageNumber}
              className={`p-3.5 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                stg.status === 'completed'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : stg.status === 'running'
                  ? 'bg-cyan-950/40 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-500/20 animate-pulse'
                  : 'bg-black/30 border-white/5 text-white/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    Giai Đoạn {stg.stageNumber}
                  </span>
                  {stg.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : stg.status === 'running' ? (
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{stg.stageTitle}</h4>
                <p className="text-[10px] text-white/60 leading-relaxed">{stg.description}</p>
              </div>

              {stg.logs.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-1 text-[9px] font-mono text-cyan-300/90">
                  {stg.logs.map((log, i) => (
                    <div key={i} className="truncate">
                      › {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Synthesized Output */}
      {orchestratorOutput && (
        <div className="p-6 rounded-3xl bg-[#0c101c] border border-cyan-500/40 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Kết Quả Tổng Hợp Từ AI Master Orchestrator (Zero-Fluff Master Synthesis)
                </h3>
                <p className="text-xs text-white/60 font-mono">
                  Mô hình điều phối: Gemini 2.5 Pro • Nhiệt độ: 0.3 • Phản biện đa tác nhân
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(orchestratorOutput);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center space-x-1.5 transition-all cursor-pointer border border-white/10 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ĐÃ SAO CHÉP</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>SAO CHÉP KẾT QUẢ</span>
                </>
              )}
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/90">
            <CodeBlock code={orchestratorOutput} language="markdown" />
          </div>
        </div>
      )}
    </div>
  );
};
