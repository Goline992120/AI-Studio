import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, CustomAgentItem, WorkspaceFolder } from '../types';
import { CodeBlock } from './CodeBlock';
import {
  Brain,
  Sparkles,
  Send,
  FolderTree,
  Bot,
  User,
  Zap,
  Plus,
  Wand2,
  Code2,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Terminal,
  Cpu,
  Download,
  Flame,
} from 'lucide-react';

interface AiSuperIntelligenceTabProps {
  onOpenCodeStudio?: (code: string) => void;
  onOpenAppExporter?: () => void;
}

export const AiSuperIntelligenceTab: React.FC<AiSuperIntelligenceTabProps> = ({
  onOpenCodeStudio,
  onOpenAppExporter,
}) => {
  // Folder & Workspace state
  const [folders, setFolders] = useState<WorkspaceFolder[]>([
    {
      id: 'folder-all',
      name: '📁 Toàn Bộ Dự Án (Root Workspace)',
      path: '.',
      description: 'Tổng hợp ngữ cảnh toàn hệ thống: src, server, electron, public',
      filesCount: 36,
      type: 'folder',
    },
    {
      id: 'folder-src',
      name: '⚛️ src/ (React 19 & Components)',
      path: 'src',
      description: 'Giao diện người dùng, hooks, state và các component chức năng',
      filesCount: 18,
      type: 'folder',
    },
    {
      id: 'folder-server',
      name: '⚡ server.ts (Express & Gemini Fallback)',
      path: 'server.ts',
      description: 'API Proxy Google GenAI, Fallback tự hành Hermes, WebSocket PiP Stream',
      filesCount: 2,
      type: 'file',
    },
    {
      id: 'folder-electron',
      name: '💻 electron/ (Desktop Native App)',
      path: 'electron',
      description: 'Cấu hình đóng gói Electron Desktop cho Windows, macOS, Linux',
      filesCount: 1,
      type: 'folder',
    },
  ]);
  const [selectedFolder, setSelectedFolder] = useState<string>('folder-all');

  // Custom Agents & Bots Store
  const [agents, setAgents] = useState<CustomAgentItem[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-super-architect');
  const [isCreatingAgent, setIsCreatingAgent] = useState<boolean>(false);
  const [newAgentPrompt, setNewAgentPrompt] = useState<string>('');
  const [isGeneratingAgent, setIsGeneratingAgent] = useState<boolean>(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `### 🌟 Chào mừng đến với Bộ Não AI Siêu Trí Tuệ & Đa Thư Mục
Hệ thống được vận hành bởi mô hình **Gemini 3.7 Flash & Hermes Sovereign Autonomous Engine**:

1. **Hiểu Ngữ Cảnh Đa Thư Mục**: Tự động nhận diện cấu trúc toàn bộ dự án \`src/\`, \`server.ts\`, \`electron/\`, \`public/\`.
2. **Tạo Chatbot / Công cụ AI Đa Tác Nhân Tức Thì**: Bạn có thể gõ *"Tạo bot kiểm thử API"* hoặc *"Tạo công cụ viết SQL tối ưu"* để sinh ngay một tác nhân AI độc lập.
3. **Lập Trình Chuyên Sâu & Tự Vá Lỗi**: Sinh mã nguồn chuẩn Clean Code, phát hiện bug và tự động tối ưu hóa hiệu năng 24/7.

*Hãy đặt câu hỏi hoặc yêu cầu tạo tác nhân mới ngay bên dưới!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash (Deep Reasoning)',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thinkingMode, setThinkingMode] = useState<'HIGH' | 'LOW'>('HIGH');
  const [multiAgentExecutionSteps, setMultiAgentExecutionSteps] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load agents and folders from server
  const fetchAgentsAndFolders = async () => {
    try {
      const [agentsRes, foldersRes] = await Promise.all([
        fetch('/api/agents/list'),
        fetch('/api/workspace/folders'),
      ]);
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        if (agentsData?.agents?.length) {
          setAgents(agentsData.agents);
        }
      }
      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        if (foldersData?.folders?.length) {
          setFolders([
            {
              id: 'folder-all',
              name: '📁 Toàn Bộ Dự Án (Root Workspace)',
              path: '.',
              description: 'Tổng hợp ngữ cảnh toàn hệ thống: src, server, electron, public',
              filesCount: 36,
              type: 'folder',
            },
            ...foldersData.folders,
          ]);
        }
      }
    } catch (err) {
      console.warn('Could not load workspace structure:', err);
    }
  };

  useEffect(() => {
    fetchAgentsAndFolders();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, multiAgentExecutionSteps]);

  // Selected agent info
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0] || {
    id: 'agent-super-architect',
    name: '🧠 Siêu Trí Tuệ Full-Stack Architect',
    description: 'Chuyên gia thiết kế hệ thống phân tán, xử lý ngữ cảnh đa thư mục',
    avatar: '⚡',
    category: 'multi_agent' as const,
    systemInstruction: 'Bạn là Siêu Trí Tuệ Lập Trình & Kiến Trúc Sư Phần Mềm Cấp Cao.',
    model: 'gemini-3.7-flash',
    temperature: 0.2,
    roles: [
      { role: 'Planner', task: 'Phân tích logic' },
      { role: 'Coder', task: 'Viết code' },
    ],
    toolsEnabled: ['workspace_scan'],
    createdAt: new Date().toISOString(),
  };

  // Create custom AI Agent / Chatbot via Prompt
  const handleCreateAgent = async () => {
    if (!newAgentPrompt.trim() || isGeneratingAgent) return;
    setIsGeneratingAgent(true);

    try {
      const res = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newAgentPrompt }),
      });
      const data = await res.json();
      if (data.success && data.agent) {
        setAgents((prev) => [data.agent, ...prev]);
        setSelectedAgentId(data.agent.id);
        setIsCreatingAgent(false);
        setNewAgentPrompt('');

        setMessages((prev) => [
          ...prev,
          {
            id: `created-${Date.now()}`,
            role: 'model',
            content: `✨ **Đã tạo thành công Tác Nhân AI Mới: "${data.agent.name}" (${data.agent.avatar})**
- **Mô tả**: ${data.agent.description}
- **Vai trò chuyên biệt**: ${data.agent.roles?.map((r: any) => `${r.role} (${r.task})`).join(' • ')}
- **Chỉ dẫn hệ thống**: *"${data.agent.systemInstruction}"*

*Hiện bạn đang trò chuyện trực tiếp với tác nhân này!*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            modelUsed: 'gemini-3.7-flash (Agent Builder)',
          },
        ]);
      }
    } catch (err: any) {
      alert(`Lỗi tạo agent: ${err.message || err}`);
    } finally {
      setIsGeneratingAgent(false);
    }
  };

  // Send Message with Multi-Folder Context & Multi-Agent loop
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isLoading) return;

    // Check if user is asking to create an AI bot directly in chat
    const lower = promptText.toLowerCase();
    if (lower.startsWith('tạo bot') || lower.startsWith('tạo công cụ') || lower.startsWith('create agent') || lower.startsWith('create bot')) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputPrompt('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/agents/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText }),
        });
        const data = await res.json();
        if (data.agent) {
          setAgents((prev) => [data.agent, ...prev]);
          setSelectedAgentId(data.agent.id);
          setMessages((prev) => [
            ...prev,
            {
              id: `model-${Date.now()}`,
              role: 'model',
              content: `🎉 **Đã kích hoạt và khởi tạo hoàn tất Tác Nhân AI: ${data.agent.name} ${data.agent.avatar}**\n\n- **Danh mục**: \`${data.agent.category}\`\n- **Chức năng**: ${data.agent.description}\n- **Đa tác nhân tích hợp**: ${data.agent.roles?.map((r: any) => `**${r.role}**`).join(', ')}\n\n*Hệ thống đã tự động chuyển phiên làm việc sang tác nhân mới này. Bạn hãy bắt đầu giao việc!*`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              modelUsed: 'gemini-3.7-flash (Self-Generating Agent Loop)',
            },
          ]);
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            content: `⚠️ Có lỗi khi tạo tác nhân: ${err.message || err}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputPrompt('');
    setIsLoading(true);

    // Multi-Agent Execution Steps simulation visualizer
    const currentFolderObj = folders.find((f) => f.id === selectedFolder);
    setMultiAgentExecutionSteps([
      `📂 [Ngữ cảnh thư mục]: Kích hoạt phạm vi "${currentFolderObj?.name || 'Toàn bộ dự án'}" (${currentFolderObj?.filesCount || 36} tệp)...`,
      `🧠 [Tác nhân ${currentAgent.name}]: Phân tích yêu cầu qua chuỗi suy luận siêu trí tuệ...`,
      `⚡ [Bộ điều phối đa tác nhân]: Tổng hợp giải pháp & tối ưu mã nguồn...`,
    ]);

    try {
      const folderContext = `[NGỮ CẢNH THƯ MỤC LÀM VIỆC HIỆN TẠI]:
- Phạm vi chọn: ${currentFolderObj?.name} (Đường dẫn: ${currentFolderObj?.path})
- Mô tả: ${currentFolderObj?.description}
- Danh sách thư mục sẵn có: src (React 19, Tailwind CSS v4, Components), server.ts (Express, Gemini Fallback, WebSocket), electron/main.cjs (Desktop App), public/ (App Logo, PWA Manifest).`;

      const fullSystemInstruction = `${currentAgent.systemInstruction}

${folderContext}

Yêu cầu chất lượng phản hồi:
1. Đưa ra câu trả lời sắc sảo, có tư duy hệ thống cao độ (Human-Level High Intelligence).
2. Nếu sinh code: Viết code hoàn chỉnh, hiện đại, sạch đẹp (Clean Code), có type safety và kèm giải thích rõ ràng.
3. Nếu phát hiện lỗi: Nêu nguyên nhân gốc rễ và tự động khắc phục tối ưu.`;

      const formattedMessages = updatedHistory.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
          model: currentAgent.model || 'gemini-3.7-flash',
          systemInstruction: fullSystemInstruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Lỗi xử lý phản hồi từ Gemini API');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.text || 'Đã xử lý xong yêu cầu.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || 'gemini-3.7-flash',
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **Thông báo tự phục hồi:** ${err.message || 'Lỗi kết nối'}. Hệ thống đã tự động ghi nhận và bảo toàn phiên làm việc.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setMultiAgentExecutionSteps([]);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header with Super Intelligence & Multi-Folder Badge */}
      <div className="bg-gradient-to-r from-[#121216] via-[#161622] to-[#0d1520] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Siêu Trí Tuệ AI & Chat Đa Thư Mục Toàn Năng
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  v3.0 Sovereign Core
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Hiểu sâu ngữ cảnh dự án đa thư mục • Tự động tạo Chatbot & Công cụ Đa Tác Nhân • Tự vá lỗi siêu tốc 24/7
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Thinking Mode Toggle */}
            <div className="flex items-center space-x-1 bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setThinkingMode('HIGH')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  thinkingMode === 'HIGH'
                    ? 'bg-cyan-500 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                🧠 Deep Reasoning
              </button>
              <button
                onClick={() => setThinkingMode('LOW')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  thinkingMode === 'LOW'
                    ? 'bg-cyan-500 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                ⚡ Fast Execution
              </button>
            </div>

            {/* Quick Action to open App Exporter */}
            {onOpenAppExporter && (
              <button
                onClick={onOpenAppExporter}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất App Đa Nền Tảng</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (Folders & Custom Bots) + Right Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Folder Navigator & AI Bot Creator (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Multi-Folder Workspace Selector */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-semibold text-xs uppercase tracking-wider">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>Ngữ Cảnh Thư Mục Dự Án</span>
              </div>
              <span className="text-[10px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40">
                {folders.length} Thư mục
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                    selectedFolder === f.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-semibold'
                      : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-medium truncate">{f.name}</div>
                    <div className="text-[10px] text-white/40 truncate mt-0.5">{f.description}</div>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 bg-black/40 px-1.5 py-0.5 rounded shrink-0">
                    {f.filesCount} tệp
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Agents & Custom Bots Hub */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-semibold text-xs uppercase tracking-wider">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Tác Nhân & Chatbot AI</span>
              </div>
              <button
                onClick={() => setIsCreatingAgent(!isCreatingAgent)}
                className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo Bot Mới</span>
              </button>
            </div>

            {/* Quick Agent Creator Accordion */}
            <AnimatePresence>
              {isCreatingAgent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 space-y-2 overflow-hidden"
                >
                  <div className="text-[11px] font-semibold text-emerald-300 flex items-center space-x-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mô tả công cụ / Chatbot bạn muốn tạo:</span>
                  </div>
                  <textarea
                    value={newAgentPrompt}
                    onChange={(e) => setNewAgentPrompt(e.target.value)}
                    placeholder="Ví dụ: Tạo bot kiểm tra bảo mật Node.js và tối ưu hóa câu lệnh SQL..."
                    rows={2}
                    className="w-full bg-black/60 border border-emerald-500/40 rounded-lg p-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 resize-none"
                  />
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setIsCreatingAgent(false)}
                      className="px-2.5 py-1 text-[11px] text-white/50 hover:text-white"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleCreateAgent}
                      disabled={isGeneratingAgent || !newAgentPrompt.trim()}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-black text-[11px] font-bold hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isGeneratingAgent ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isGeneratingAgent ? 'Đang khởi tạo...' : 'Tạo Ngay'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of Custom Agents */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgentId(ag.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2.5 ${
                    selectedAgentId === ag.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold'
                      : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base">{ag.avatar || '🤖'}</span>
                    <div className="truncate">
                      <div className="font-medium truncate">{ag.name}</div>
                      <div className="text-[10px] text-white/40 truncate">{ag.description}</div>
                    </div>
                  </div>
                  {ag.isBuiltIn && (
                    <span className="text-[9px] text-emerald-400/80 bg-emerald-950/80 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                      Gốc
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Super Intelligence Multi-Turn Chat (8 Cols) */}
        <div className="lg:col-span-8 bg-[#121214] border border-white/10 rounded-2xl flex flex-col h-[700px] shadow-2xl overflow-hidden">
          {/* Active Agent & Folder Status Header */}
          <div className="p-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 truncate">
              <span className="text-xl">{currentAgent.avatar || '⚡'}</span>
              <div className="truncate">
                <div className="text-xs font-bold text-white flex items-center space-x-2 truncate">
                  <span>{currentAgent.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                    {currentAgent.model}
                  </span>
                </div>
                <div className="text-[11px] text-white/50 truncate flex items-center space-x-2">
                  <span>Phạm vi: <b className="text-cyan-300">{folders.find((f) => f.id === selectedFolder)?.name}</b></span>
                  <span>•</span>
                  <span>Tác nhân: <b className="text-emerald-300">{currentAgent.roles?.length || 2} Roles</b></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome',
                    role: 'model',
                    content: 'Đã làm mới phiên hội thoại siêu trí tuệ. Bạn muốn thực hiện tác vụ nào tiếp theo?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    modelUsed: 'gemini-3.7-flash',
                  },
                ]);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-xs"
              title="Làm mới lịch sử chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-md ${
                      isUser
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-[#1e1e24] border border-white/15 text-emerald-400'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                        : 'bg-[#18181c] border border-white/10 text-white/90'
                    }`}
                  >
                    {/* Header meta */}
                    <div className="flex items-center justify-between text-[10px] text-white/40 mb-1.5 pb-1 border-b border-white/5">
                      <span>{isUser ? 'Người dùng' : currentAgent.name}</span>
                      <span>{m.timestamp}</span>
                    </div>

                    {/* Content rendering */}
                    <div className="prose prose-invert prose-xs max-w-none space-y-2">
                      {m.content.split('```').map((part, idx) => {
                        if (idx % 2 === 1) {
                          // Code block
                          const firstLine = part.substring(0, part.indexOf('\n')).trim();
                          const lang = firstLine || 'typescript';
                          const code = part.substring(part.indexOf('\n') + 1);

                          return (
                            <div key={idx} className="my-2 rounded-xl overflow-hidden border border-white/10">
                              <div className="bg-black/80 px-3 py-1.5 flex items-center justify-between text-[10px] text-white/60 font-mono">
                                <span>{lang.toUpperCase()}</span>
                                <div className="flex items-center space-x-2">
                                  {onOpenCodeStudio && (
                                    <button
                                      onClick={() => onOpenCodeStudio(code)}
                                      className="text-cyan-400 hover:text-cyan-300 font-bold"
                                    >
                                      Mở trong Code Studio ➔
                                    </button>
                                  )}
                                  <button
                                    onClick={() => copyToClipboard(code, `code-${idx}`)}
                                    className="hover:text-white"
                                  >
                                    {copiedId === `code-${idx}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <pre className="p-3 bg-[#0d0d10] text-[#a6accd] font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                                <code>{code}</code>
                              </pre>
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="whitespace-pre-wrap">
                            {part}
                          </div>
                        );
                      })}
                    </div>

                    {m.modelUsed && (
                      <div className="mt-2 pt-1.5 border-t border-white/5 text-[9px] font-mono text-cyan-400/70 flex items-center justify-between">
                        <span>⚡ {m.modelUsed}</span>
                        <button
                          onClick={() => copyToClipboard(m.content, m.id)}
                          className="text-white/40 hover:text-white flex items-center space-x-1"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Sao chép</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Multi-Agent Execution Steps animation */}
            {isLoading && (
              <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-3 text-xs space-y-1.5 animate-pulse">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Bộ não siêu trí tuệ & Đa tác nhân đang thực thi...</span>
                </div>
                {multiAgentExecutionSteps.map((step, idx) => (
                  <div key={idx} className="text-[11px] text-cyan-200/80 font-mono pl-5">
                    {step}
                  </div>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center space-x-2 overflow-x-auto text-[11px]">
            <span className="text-white/40 shrink-0 font-medium">Gợi ý nhanh:</span>
            {[
              'Tạo bot phân tích bảo mật & lỗi code',
              'Quét và tối ưu toàn bộ thư mục src/',
              'Viết API proxy Express an toàn với Fallback',
              'Tạo công cụ viết script PowerShell tự động',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all text-[11px]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3.5 bg-black/60 border-t border-white/10 flex items-center space-x-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Nhập yêu cầu, hỏi đáp code hoặc gõ "Tạo bot [tên bot]"...`}
              className="flex-1 bg-[#18181c] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Gửi Lệnh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
