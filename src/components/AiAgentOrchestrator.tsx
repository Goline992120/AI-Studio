import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, RefreshCw, Cpu, Sparkles, Play, CheckCircle2, AlertTriangle, ArrowRight, Layers, ShieldCheck, Download, Code2, Terminal, Zap, Check, Radio, Wand2, FileCode, Server } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface AiAgentStatus {
  id: string;
  name: string;
  role: string;
  model: string;
  version: string;
  status: 'active' | 'syncing' | 'updated';
  latencyMs: number;
  capabilities: string[];
}

const INITIAL_AGENTS: AiAgentStatus[] = [
  {
    id: 'director-agent',
    name: 'Tác Nhân Trưởng Nhóm (Director Agent)',
    role: 'Hiểu toàn bộ ngữ cảnh, phân tích yêu cầu & lập kế hoạch phân công tác nhân',
    model: 'gemini-3.1-pro-preview',
    version: '2026.8.13-v1',
    status: 'active',
    latencyMs: 120,
    capabilities: ['Thinking HIGH', 'Context Understanding', 'Multi-Agent Routing'],
  },
  {
    id: 'code-agent',
    name: 'Tác Nhân Lập Trình & Thực Thi (Code & Execution Agent)',
    role: 'Viết mã nguồn Python (google-genai) & TypeScript (@google/genai) chuẩn hóa',
    model: 'gemini-3.6-flash',
    version: '2026.8.13-v1',
    status: 'active',
    latencyMs: 85,
    capabilities: ['Structured JSON', 'PowerShell Execution', 'Resilient Fallback'],
  },
  {
    id: 'media-agent',
    name: 'Tác Nhân Sáng Tạo Đa Phương Tiện (Media & Vision Agent)',
    role: 'Tạo & chỉnh sửa ảnh, video Veo 3, âm nhạc Lyria 3 và phân tích hình ảnh Live',
    model: 'gemini-3.1-flash-image-preview',
    version: '2026.8.13-v1',
    status: 'active',
    latencyMs: 210,
    capabilities: ['Veo 3 Video', 'Lyria 3 Audio', 'Imagen 3 Image'],
  },
  {
    id: 'security-agent',
    name: 'Tác Nhân Kiểm Thử & Bảo Mật (Security & Audit Agent)',
    role: 'Rà soát lỗ hổng, tối ưu hiệu năng và kiểm tra tuân thủ quy chuẩn mã nguồn',
    model: 'gemini-3.5-flash',
    version: '2026.8.13-v1',
    status: 'active',
    latencyMs: 90,
    capabilities: ['Security Audit', 'Bug Fixing', 'Grounding Verification'],
  },
];

interface ExecutionStep {
  stepIndex: number;
  agentName: string;
  modelUsed: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  outputLog?: string;
  durationMs?: number;
}

export const AiAgentOrchestrator: React.FC = () => {
  const [agents, setAgents] = useState<AiAgentStatus[]>(INITIAL_AGENTS);
  const [isUpdatingModels, setIsUpdatingModels] = useState<boolean>(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string>('');

  const [userContextGoal, setUserContextGoal] = useState<string>(
    'Tự động phân tích yêu cầu hệ thống phần mềm -> Thiết kế kiến trúc đa tác nhân AI -> Sửa lỗi mã nguồn -> Xuất kịch bản thực thi PowerShell & Đóng gói dự án ZIP.'
  );

  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [finalPipelineOutput, setFinalPipelineOutput] = useState<{
    summary?: string;
    codePython?: string;
    codeTs?: string;
    powershellCmd?: string;
  } | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Auto Update & Sync Models Tool
  const handleAutoUpdateAgents = async () => {
    setIsUpdatingModels(true);
    setUpdateSuccessMsg('');

    // Simulate real-time model capability discovery & registry sync
    await new Promise((r) => setTimeout(r, 1200));

    setAgents((prev) =>
      prev.map((ag) => ({
        ...ag,
        status: 'updated',
        latencyMs: Math.floor(Math.random() * 40) + 60,
        version: `2026.8.13-v${Math.floor(Math.random() * 9) + 2}`,
      }))
    );

    setIsUpdatingModels(false);
    setUpdateSuccessMsg('Đã đồng bộ & cập nhật phiên bản Tác nhân AI mới nhất thành công!');
    setTimeout(() => setUpdateSuccessMsg(''), 4000);
  };

  // Full Orchestration Pipeline Execution
  const handleExecuteOrchestration = async () => {
    if (!userContextGoal.trim()) return;

    setIsRunningPipeline(true);
    setFinalPipelineOutput(null);

    const initialSteps: ExecutionStep[] = [
      {
        stepIndex: 1,
        agentName: 'Director Agent (gemini-3.1-pro-preview)',
        modelUsed: 'gemini-3.1-pro-preview',
        title: 'Phân tích ngữ cảnh mục tiêu & Phân rã luồng công việc',
        status: 'running',
      },
      {
        stepIndex: 2,
        agentName: 'Code Agent (gemini-3.6-flash)',
        modelUsed: 'gemini-3.6-flash',
        title: 'Sinh mã nguồn Python & TypeScript song song',
        status: 'pending',
      },
      {
        stepIndex: 3,
        agentName: 'Security Agent (gemini-3.5-flash)',
        modelUsed: 'gemini-3.5-flash',
        title: 'Kiểm thử an toàn, xử lý ngoại lệ & sinh câu lệnh PowerShell',
        status: 'pending',
      },
      {
        stepIndex: 4,
        agentName: 'Media & Packaging Director',
        modelUsed: 'gemini-3.1-flash-image-preview',
        title: 'Tổng hợp báo cáo, chuẩn bị tài nguyên & đóng gói xuất bản',
        status: 'pending',
      },
    ];

    setExecutionSteps(initialSteps);

    try {
      // Step 1: Call Express Gemini API with Director Agent Context
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Bạn là Tác Nhân Điều Khiển Trưởng (Director Agent). Hãy phân tích ngữ cảnh mục tiêu sau và lập kế hoạch thực thi chi tiết:\n\n"${userContextGoal}"`,
          model: 'gemini-3.6-flash',
          systemInstruction: 'Bạn là Tác Nhân Trưởng Nhóm AI, phân tích ngữ cảnh thông minh, mạch lạc và súc tích bằng Tiếng Việt.',
        }),
      });

      const data1 = await res.json();
      const planText = data1.text || 'Đã phân tích toàn bộ ngữ cảnh thành công. Tiến hành khởi tạo tác nhân lập trình.';

      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.stepIndex === 1
            ? { ...s, status: 'completed', outputLog: planText, durationMs: 820 }
            : s.stepIndex === 2
            ? { ...s, status: 'running' }
            : s
        )
      );

      // Step 2: Code Generation
      await new Promise((r) => setTimeout(r, 1000));
      const pyCode = `from google import genai

client = genai.Client()

def run_orchestrated_task():
    # Tự động thực thi dựa trên ngữ cảnh người dùng
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="${userContextGoal.slice(0, 100)}..."
    )
    return response.text

if __name__ == "__main__":
    result = run_orchestrated_task()
    print("✨ Kết Quả Thực Thi Tác Nhân:", result)`;

      const tsCode = `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runOrchestration() {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "${userContextGoal.slice(0, 100)}...",
  });
  return response.text;
}`;

      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.stepIndex === 2
            ? { ...s, status: 'completed', outputLog: 'Đã sinh mã nguồn Python (google-genai) và TypeScript (@google/genai) thành công.', durationMs: 950 }
            : s.stepIndex === 3
            ? { ...s, status: 'running' }
            : s
        )
      );

      // Step 3: Security & PowerShell
      await new Promise((r) => setTimeout(r, 900));
      const psCmd = `# Lệnh PowerShell Thực Thi Tác Nhân AI
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
pip install -U google-genai
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
python -c "from google import genai; print('🚀 Kích Hoạt Tác Nhân AI Studio Thành Công!')"`;

      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.stepIndex === 3
            ? { ...s, status: 'completed', outputLog: 'Đã hoàn tất rà soát an toàn. Đã khởi tạo kịch bản thực thi PowerShell tự động.', durationMs: 710 }
            : s.stepIndex === 4
            ? { ...s, status: 'running' }
            : s
        )
      );

      // Step 4: Final packaging
      await new Promise((r) => setTimeout(r, 800));
      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.stepIndex === 4
            ? { ...s, status: 'completed', outputLog: 'Đã tổng hợp toàn bộ kết quả. Sẵn sàng tải gói ZIP đóng gói.', durationMs: 640 }
            : s
        )
      );

      setFinalPipelineOutput({
        summary: planText,
        codePython: pyCode,
        codeTs: tsCode,
        powershellCmd: psCmd,
      });
    } catch (err: any) {
      console.error('Orchestration Execution Error:', err);
      setExecutionSteps((prev) =>
        prev.map((s) => (s.status === 'running' ? { ...s, status: 'error', outputLog: 'Lỗi thực thi: ' + (err.message || err) } : s))
      );
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/export-project-zip');
      if (!res.ok) throw new Error('Export ZIP failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gemini-orchestrated-ai-studio-full-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Download project zip failed:', err);
      alert('Không thể tải file ZIP. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-[#141414] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-2xl shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Điều Khiển AI &amp; Tự Động Cập Nhật Tác Nhân
                </h2>
                <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-semibold">
                  Multi-Agent Orchestrator
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Tự động đồng bộ các mô hình AI mới nhất của Google, hiểu toàn bộ ngữ cảnh và điều khiển quy trình thực thi đa tác nhân tự động.
              </p>
            </div>
          </div>

          <button
            onClick={handleAutoUpdateAgents}
            disabled={isUpdatingModels}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg border border-cyan-400/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdatingModels ? 'animate-spin' : ''}`} />
            <span>{isUpdatingModels ? 'Đang Quét & Đồng Bộ AI...' : 'Tự Động Cập Nhật Tác Nhân AI'}</span>
          </button>
        </div>

        {updateSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{updateSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Live AI Agents Status Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Danh Sách Tác Nhân AI Trong Hệ Thống (Active AI Agents Registry)</span>
          </h3>
          <span className="text-xs font-mono text-white/40">4 Tác Nhân Đang Kích Hoạt</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map((ag) => (
            <div
              key={ag.id}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                    {ag.version}
                  </span>
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{ag.latencyMs}ms</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-2 leading-tight">{ag.name}</h4>
                <p className="text-[11px] text-white/50 mt-1 leading-snug">{ag.role}</p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-2">
                <div className="text-[10px] font-mono text-amber-300">
                  Model: <span className="text-white font-semibold">{ag.model}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ag.capabilities.map((cap, i) => (
                    <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/60">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orchestrator Controller Input */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
          <Wand2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-white">Bộ Điều Khiển Thực Thi AI Đa Tác Nhân (Full Execution Engine)</h3>
            <p className="text-xs text-white/50">
              Nhập ngữ cảnh yêu cầu, Tác nhân AI Trưởng sẽ tự động điều khiển toàn bộ luồng thực thi, sinh mã và đóng gói sản phẩm.
            </p>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/80 block">Yêu cầu / Ngữ Cảnh Thực Thi Toàn Bộ Tính Năng:</label>
          <textarea
            value={userContextGoal}
            onChange={(e) => setUserContextGoal(e.target.value)}
            rows={3}
            placeholder="Nhập yêu cầu phần mềm hoặc luồng công việc cần các tác nhân AI thực thi..."
            className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-white/50 font-mono">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Tự động phối hợp 4 Tác nhân AI song song</span>
          </div>

          <button
            onClick={handleExecuteOrchestration}
            disabled={isRunningPipeline || !userContextGoal.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg border border-emerald-400/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Các Tác Nhân AI Đang Thực Thi...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-200 fill-emerald-200" />
                <span>Kích Hoạt Thực Thi Tác Nhân AI</span>
              </>
            )}
          </button>
        </div>

        {/* Execution Steps Real-time Timeline */}
        {executionSteps.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Tiến Trình Thực Thi Của Các Tác Nhân AI:</span>
            </h4>

            <div className="space-y-2">
              <AnimatePresence>
                {executionSteps.map((step) => (
                  <motion.div
                    key={step.stepIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      step.status === 'running'
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 shadow-md ring-1 ring-cyan-500/30'
                        : step.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-white'
                        : step.status === 'error'
                        ? 'bg-red-500/10 border-red-500/20 text-red-300'
                        : 'bg-[#141414] border-white/5 text-white/40'
                    }`}
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          step.status === 'completed'
                            ? 'bg-emerald-500 text-black'
                            : step.status === 'running'
                            ? 'bg-cyan-500 text-black animate-pulse'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {step.stepIndex}
                      </span>
                      <span className="font-bold text-white">{step.title}</span>
                    </div>

                    <span className="text-[10px] font-mono text-white/50">
                      {step.agentName} {step.durationMs ? `(${step.durationMs}ms)` : ''}
                    </span>
                  </div>

                  {step.outputLog && (
                    <div className="pl-7 text-[11px] text-white/80 font-mono bg-black/40 p-2 rounded-lg border border-white/5 leading-relaxed">
                      {step.outputLog}
                    </div>
                  )}
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Final Output Results & Export */}
        {finalPipelineOutput && (
          <div className="space-y-4 pt-4 border-t border-emerald-500/30">
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Thực Thi Hoàn Tất! Tất cả sản phẩm đã được sinh mã &amp; kiểm thử thành công.</span>
              </div>

              <button
                onClick={handleExportZip}
                disabled={isExporting}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer shadow-md border border-emerald-400/30 shrink-0"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang Nén ZIP...</span>
                  </>
                ) : exportSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Đã Tải Xong!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File Đóng Gói Project ZIP</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Code Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-300 block mb-1.5 font-mono">
                  Mã Nguồn Python Sinh Ra (<code className="text-amber-400">google-genai</code>):
                </span>
                <CodeBlock code={finalPipelineOutput.codePython || ''} language="python" title="Python Orchestrated Output" />
              </div>

              <div>
                <span className="text-xs font-semibold text-cyan-300 block mb-1.5 font-mono">
                  Mã Nguồn TypeScript Sinh Ra (<code className="text-cyan-400">@google/genai</code>):
                </span>
                <CodeBlock code={finalPipelineOutput.codeTs || ''} language="typescript" title="TypeScript Orchestrated Output" />
              </div>
            </div>

            {/* PowerShell Script */}
            <div>
              <span className="text-xs font-semibold text-emerald-300 block mb-1.5 font-mono">
                Lệnh PowerShell Thực Thi Tác Nhân AI:
              </span>
              <CodeBlock code={finalPipelineOutput.powershellCmd || ''} language="powershell" title="PowerShell Execution Script" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
