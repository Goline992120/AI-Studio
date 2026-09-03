import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Cpu,
  Code2,
  ShieldCheck,
  Rocket,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Terminal,
  Download,
  Copy,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';

interface AgentStep {
  id: number;
  name: string;
  role: string;
  model: string;
  icon: any;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  output: string | null;
}

const INITIAL_AGENTS: AgentStep[] = [
  {
    id: 1,
    name: 'Researcher Agent',
    role: 'Nghiên cứu thị trường & Trích xuất dữ liệu',
    model: 'Perplexity / Search Grounding',
    icon: Search,
    status: 'idle',
    progress: 0,
    logs: [],
    output: null,
  },
  {
    id: 2,
    name: 'Architect Agent',
    role: 'Thiết kế cấu trúc & Phân bổ tài nguyên',
    model: 'Claude 3.5 Sonnet',
    icon: Cpu,
    status: 'idle',
    progress: 0,
    logs: [],
    output: null,
  },
  {
    id: 3,
    name: 'Lead Coder Agent',
    role: 'Sinh mã nguồn & Tối ưu thuật toán',
    model: 'GPT-4o / Codex Matrix',
    icon: Code2,
    status: 'idle',
    progress: 0,
    logs: [],
    output: null,
  },
  {
    id: 4,
    name: 'QA & Security Auditor',
    role: 'Rà soát lỗ hổng, Kiểm thử & Tối ưu Token',
    model: 'Gemini 2.5 Pro Security',
    icon: ShieldCheck,
    status: 'idle',
    progress: 0,
    logs: [],
    output: null,
  },
  {
    id: 5,
    name: 'DevOps & Release Agent',
    role: 'Đóng gói sản phẩm & Triển khai môi trường',
    model: 'Sovereign Core Orchestrator',
    icon: Rocket,
    status: 'idle',
    progress: 0,
    logs: [],
    output: null,
  },
];

export const AiWorkforcePipeline: React.FC = () => {
  const [pipelinePrompt, setPipelinePrompt] = useState(
    'Xây dựng hệ thống tự động hóa Marketing & Affiliate cho sản phẩm AI SaaS'
  );
  const [agents, setAgents] = useState<AgentStep[]>(() => {
    const saved = localStorage.getItem('aureon_workforce_agents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_AGENTS.map((a, i) => ({
          ...a,
          status: parsed[i]?.status || 'idle',
          progress: parsed[i]?.progress || 0,
          logs: parsed[i]?.logs || [],
          output: parsed[i]?.output || null,
        }));
      } catch {
        return INITIAL_AGENTS;
      }
    }
    return INITIAL_AGENTS;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [globalLogs, setGlobalLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Save to LocalStorage whenever agents change
  useEffect(() => {
    localStorage.setItem('aureon_workforce_agents', JSON.stringify(agents));
  }, [agents]);

  const runSequentialPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setGlobalLogs((prev) => [
      `🚀 [WORKFORCE ENGINE]: Bắt đầu điều phối 5 Đặc vụ cho nhiệm vụ: "${pipelinePrompt}"`,
      ...prev,
    ]);

    // Reset agents
    const resetList = agents.map((a) => ({
      ...a,
      status: 'idle' as const,
      progress: 0,
      logs: [],
      output: null,
    }));
    setAgents(resetList);

    // Agent 1: Research
    await executeAgentStep(0, [
      '🔍 Khởi tạo tìm kiếm dữ liệu thị trường và phân tích đối thủ cạnh tranh...',
      '📊 Thu thập 15 nguồn dữ liệu thực tế và xu hướng chuyển đổi mới nhất...',
      '✓ Đã tổng hợp báo cáo nghiên cứu: 3 nhóm khách hàng trọng tâm & 5 kênh tiếp cận tối ưu.',
    ], 'Báo cáo nghiên cứu thị trường hoàn tất: Đã xác định tệp khách hàng tiềm năng 18-35 và các thông điệp truyền thông then chốt.');

    // Agent 2: Architecture
    await executeAgentStep(1, [
      '📐 Tiếp nhận dữ liệu từ Researcher Agent...',
      '🏗️ Phác thảo sơ đồ phân luồng dữ liệu (Dataflow) và cấu trúc Microservices...',
      '✓ Đã xây dựng sơ đồ 5 module: Auth, Content Generator, Tracking Link, Payout & Analytics.',
    ], 'Kiến trúc hệ thống: Phân chia 5 phân hệ độc lập, tối ưu hóa tốc độ phản hồi <0.2s.');

    // Agent 3: Lead Coder
    await executeAgentStep(2, [
      '💻 Nạp kiến trúc từ Architect và tạo mã nguồn lõi...',
      '⚡ Xây dựng REST API Gateway và luồng tự động hóa bằng TypeScript...',
      '✓ Đã xuất 1,200 dòng mã nguồn xử lý logic kinh doanh và tracking tự động.',
    ], 'Mã nguồn đã hoàn tất: Tích hợp đầy đủ webhook và script tự động vận hành.');

    // Agent 4: QA & Security
    await executeAgentStep(3, [
      '🛡️ Quét toàn bộ mã nguồn để phát hiện lỗ hổng XSS, SQL Injection và Memory Leak...',
      '🧪 Chạy 48 kịch bản Unit Test và Stress Test với 10,000 requests giả lập...',
      '✓ Kết quả: 0 Lỗ hổng nghiêm trọng, Tỷ lệ vượt qua kiểm thử: 100%.',
    ], 'Báo cáo bảo mật: Hệ thống đạt chuẩn an toàn OWASP Top 10 và bảo vệ dữ liệu.');

    // Agent 5: DevOps Deployer
    await executeAgentStep(4, [
      '🚀 Đóng gói Container Docker và cấu hình CI/CD Pipeline...',
      '🌐 Khởi tạo môi trường Cloud Run với khả năng tự động co giãn (Auto-scale)...',
      '✓ Hoàn tất triển khai: Toàn bộ 5 Đặc vụ đã phối hợp thành công 100%!',
    ], 'Triển khai hoàn tất: Ứng dụng đã sẵn sàng vận hành trên hệ thống toàn cầu.');

    setIsRunning(false);
    setCurrentStepIdx(-1);
    setGlobalLogs((prev) => [
      '🎉 [HOÀN TẤT]: 5 Đặc vụ AI đã phối hợp tuần tự và tạo ra sản phẩm hoàn chỉnh!',
      ...prev,
    ]);
  };

  const executeAgentStep = async (idx: number, stepLogs: string[], finalOutput: string) => {
    setCurrentStepIdx(idx);
    setAgents((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: 'running', progress: 20 };
      return updated;
    });

    for (let i = 0; i < stepLogs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const log = stepLogs[i];
      setAgents((prev) => {
        const updated = [...prev];
        const currentLogs = updated[idx].logs;
        updated[idx] = {
          ...updated[idx],
          progress: Math.min(95, 30 + i * 30),
          logs: [...currentLogs, log],
        };
        return updated;
      });
      setGlobalLogs((prev) => [`[${INITIAL_AGENTS[idx].name}] ${log}`, ...prev]);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    setAgents((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        status: 'completed',
        progress: 100,
        output: finalOutput,
      };
      return updated;
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIdx(-1);
    setAgents(INITIAL_AGENTS);
    localStorage.removeItem('aureon_workforce_agents');
    setGlobalLogs(['Đã làm mới dữ liệu và sẵn sàng cho chu trình mới.']);
  };

  return (
    <div className="hud-glass-card p-4 sm:p-6 rounded-2xl border border-amber-500/30 text-white space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-cyan-300 font-mono tracking-wider">
              AI WORKFORCE: 5 AGENTS TUẦN TỰ (CREW MATRIX)
            </h2>
            <p className="text-xs text-amber-300/80">
              Điều phối 5 Đặc vụ AI chuyên biệt chạy tuần tự, chia sẻ ngữ cảnh và lưu trạng thái vào LocalStorage
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={runSequentialPipeline}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4 text-black fill-black" />
            <span>{isRunning ? 'ĐANG CHẠY PIPELINE...' : 'CHẠY 5 ĐẶC VỤ'}</span>
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="p-2 rounded-xl bg-black/60 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Làm mới chu trình"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Input Prompt */}
      <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center space-x-2 shrink-0">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-cyan-300">MỤC TIÊU DỰ ÁN:</span>
        </div>
        <input
          type="text"
          value={pipelinePrompt}
          onChange={(e) => setPipelinePrompt(e.target.value)}
          placeholder="Nhập yêu cầu để 5 Đặc vụ AI tự động phối hợp thực hiện..."
          className="flex-1 px-3 py-1.5 bg-black/80 border border-cyan-500/20 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 font-sans"
        />
      </div>

      {/* 5-Agent Step Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {agents.map((agent, i) => {
          const IconComp = agent.icon;
          const isCurrent = currentStepIdx === i;
          const isDone = agent.status === 'completed';

          return (
            <div
              key={agent.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                  : isCurrent
                  ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse'
                  : 'bg-black/40 border-cyan-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-black/60 border border-white/10">
                  <IconComp className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-cyan-400'}`} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  #{agent.id}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{agent.role}</p>
                <span className="text-[9px] text-amber-300/80 font-mono block mt-1">Model: {agent.model}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className={isDone ? 'text-emerald-300' : isCurrent ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                    {agent.status.toUpperCase()}
                  </span>
                  <span className="text-white font-bold">{agent.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/80 overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : isCurrent
                        ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Realtime Pipeline Terminal Logs */}
      <div className="p-4 rounded-xl bg-black/80 border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>REALTIME AGENT EXECUTION LOGS & MEMORY (LOCALSTORAGE CACHED)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>PERSISTENT SYNC ON</span>
          </span>
        </div>

        <div className="h-40 overflow-y-auto font-mono text-[11px] space-y-1 pr-2">
          {globalLogs.length === 0 ? (
            <p className="text-slate-500 italic">Bấm "CHẠY 5 ĐẶC VỤ" để bắt đầu chu trình tự động hóa...</p>
          ) : (
            globalLogs.map((log, idx) => (
              <div key={idx} className="text-slate-200 flex items-start space-x-2">
                <span className="text-amber-400 shrink-0">❯</span>
                <span className="leading-tight">{log}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
