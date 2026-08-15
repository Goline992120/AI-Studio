import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { GEMINI_MODELS } from '../data/constants';
import { CodeBlock } from './CodeBlock';
import {
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Cpu,
  Zap,
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Code2,
  FileText,
  AlertTriangle,
  Brain,
  Wand2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const GeminiChatbotTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'intelligence'>('chat');

  // --- CHAT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Xin chào! Tôi là Gemini AI Assistant được vận hành trên nền tảng Gemini 3.7 Flash & Hybrid Reasoning. Tôi có thể giúp bạn giải đáp thắc mắc, phân tích mã nguồn, thiết kế kiến trúc phần mềm hoặc thực hiện các tác vụ phức tạp với tốc độ phản hồi cực nhanh.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [selectedChatModel, setSelectedChatModel] = useState<string>('gemini-3.7-flash');
  const [systemRole, setSystemRole] = useState<string>('architect');
  const [customSystemInstruction, setCustomSystemInstruction] = useState<string>(
    'Bạn là Kiến trúc sư Phần mềm Senior và Chuyên gia AI. Hãy giải thích rõ ràng, súc tích kèm ví dụ mã nguồn nếu có.'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- INTELLIGENCE STATE ---
  const [contentInput, setContentInput] = useState<string>(
    `function calculateDiscount(price, userType) {\n  if (userType == "vip") {\n    return price * 0.2;\n  } else if (userType == "regular") {\n    return price * 0.05;\n  }\n  return 0;\n}`
  );
  const [intelligenceAction, setIntelligenceAction] = useState<'analyze' | 'edit' | 'summary' | 'fix'>('edit');
  const [intelligenceModel, setIntelligenceModel] = useState<string>('gemini-3.7-flash');
  const [intelligenceResult, setIntelligenceResult] = useState<{
    text?: string;
    loading?: boolean;
    error?: string;
    modelUsed?: string;
    tokens?: number;
    durationMs?: number;
  }>({});

  // Preset Roles for System Instruction
  const SYSTEM_ROLES = [
    {
      id: 'architect',
      name: '💻 Software Architect',
      description: 'Chuyên gia thiết kế kiến trúc hệ thống, tư vấn pattern & clean code',
      instruction:
        'Bạn là Kiến trúc sư Phần mềm Senior. Hãy phân tích chuyên sâu, đề xuất giải pháp tối ưu, sạch đẹp và tuân thủ các nguyên tắc thiết kế tốt nhất (SOLID, DRY).',
    },
    {
      id: 'auditor',
      name: '🔍 Code & Security Auditor',
      description: 'Tìm lỗ hổng bảo mật, memory leak & tối ưu hiệu năng',
      instruction:
        'Bạn là Chuyên gia Đánh giá Mã nguồn & An ninh mạng. Tìm kiếm lỗ hổng bảo mật, nguy cơ lỗi runtime, và đề xuất cách tối ưu hiệu suất.',
    },
    {
      id: 'educator',
      name: '🎓 AI & Tech Educator',
      description: 'Giải thích khái niệm phức tạp dễ hiểu kèm ví dụ minh họa',
      instruction:
        'Bạn là Giảng viên Khoa học Máy tính. Hãy giải thích trực quan, dễ hiểu cho lập trình viên ở mọi cấp độ, kèm sơ đồ hoặc ví dụ thực tế.',
    },
    {
      id: 'debugger',
      name: '🛠️ System Debugger',
      description: 'Chẩn đoán lỗi log file, stack trace & sửa lỗi',
      instruction:
        'Bạn là Chuyên gia Debug hệ thống. Hãy chỉ ra nguyên nhân gốc rễ (Root Cause) của lỗi và đưa ra giải pháp khắc phục chính xác từng bước.',
    },
    {
      id: 'custom',
      name: '⚙️ Tùy Chỉnh Vai Trò',
      description: 'Tự định nghĩa câu lệnh System Instruction tùy ý',
      instruction: customSystemInstruction,
    },
  ];

  const QUICK_PROMPTS = [
    'Tóm tắt ưu điểm của SDK google-genai hợp nhất mới năm 2026',
    'Viết hàm TypeScript debounce tối ưu kèm generic type',
    'Giải thích sự khác biệt giữa gemini-3.1-pro-preview và gemini-3.6-flash',
    'Tối ưu đoạn SQL query sau để tăng tốc truy vấn dữ liệu lớn',
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingChat]);

  // Handle System Role Switch
  const handleRoleChange = (roleId: string) => {
    setSystemRole(roleId);
    const found = SYSTEM_ROLES.find((r) => r.id === roleId);
    if (found && roleId !== 'custom') {
      setCustomSystemInstruction(found.instruction);
    }
  };

  // Send Multi-turn Chat Message
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputPrompt('');
    setIsLoadingChat(true);

    try {
      // Map history format for API
      const formattedMessages = updatedHistory.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const activeInstruction =
        systemRole === 'custom'
          ? customSystemInstruction
          : SYSTEM_ROLES.find((r) => r.id === systemRole)?.instruction || customSystemInstruction;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
          model: selectedChatModel,
          systemInstruction: activeInstruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tạo phản hồi từ Gemini Chatbot');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text || 'Không có phản hồi trả về.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedChatModel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `⚠️ Lỗi: ${err?.message || 'Đã xảy ra sự cố trong quá trình trò chuyện.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedChatModel,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Copy Message Text
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run Intelligence Analysis / Edit Task
  const handleRunIntelligence = async () => {
    if (!contentInput.trim() || intelligenceResult.loading) return;

    setIntelligenceResult({ loading: true });
    const startTime = performance.now();

    let promptText = '';
    let systemInstruction = '';

    if (intelligenceAction === 'analyze') {
      promptText = `Hãy phân tích nội dung/đoạn code dưới đây một cách chi tiết:\n\n\`\`\`\n${contentInput}\n\`\`\``;
      systemInstruction =
        'Bạn là Trợ lý Phân tích Chuyên sâu (Content & Code Intelligence). Đưa ra nhận xét cấu trúc, điểm mạnh, điểm yếu và rủi ro.';
    } else if (intelligenceAction === 'edit') {
      promptText = `Hãy refactor, cải tiến và tái cấu trúc nội dung/đoạn code sau đây đạt chuẩn hiện đại:\n\n\`\`\`\n${contentInput}\n\`\`\``;
      systemInstruction =
        'Bạn là Chuyên gia Chỉnh sửa & Refactor Code/Văn bản. Trả về phiên bản đã được sửa đổi sạch sẽ kèm giải thích lý do thay đổi.';
    } else if (intelligenceAction === 'summary') {
      promptText = `Hãy tóm tắt ngắn gọn các điểm chính của nội dung dưới đây:\n\n${contentInput}`;
      systemInstruction = 'Bạn là Trợ lý Tóm tắt Siêu Tốc. Rút gọn nội dung thành các đầu dòng súc tích.';
    } else if (intelligenceAction === 'fix') {
      promptText = `Hãy kiểm tra lỗi, tìm bug và sửa lại đoạn code/văn bản sau:\n\n\`\`\`\n${contentInput}\n\`\`\``;
      systemInstruction = 'Bạn là Chuyên gia Sửa Lỗi. Tìm tất cả lỗi logic/syntax và trả về bản sửa chuẩn xác.';
    }

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          model: intelligenceModel,
          systemInstruction,
          temperature: intelligenceAction === 'summary' ? 0.2 : 0.4,
        }),
      });

      const data = await response.json();
      const durationMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi xử lý tác vụ Intelligence');
      }

      setIntelligenceResult({
        text: data.text,
        modelUsed: intelligenceModel,
        tokens: data.usageMetadata?.totalTokenCount,
        durationMs,
        loading: false,
      });
    } catch (err: any) {
      setIntelligenceResult({
        error: err?.message || 'Không thể hoàn thành phân tích Gemini Intelligence',
        loading: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-blue-950/40 border border-emerald-500/20 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Multi-turn Chat & Intelligence</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Gemini Pro • Flash • Flash Lite
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-emerald-400" />
            <span>Gemini Chatbot & AI Intelligence Studio</span>
          </h1>

          <p className="text-xs text-white/70 max-w-2xl mt-1 leading-relaxed">
            Môi trường trò chuyện đa lượt (Multi-turn Chat) lưu giữ ngữ cảnh hội thoại linh hoạt, kết hợp bộ công cụ phân tích & chỉnh sửa thông minh (Gemini Intelligence) đa mô hình theo mức độ phức tạp tác vụ.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-md font-extrabold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Gemini Chatbot</span>
          </button>

          <button
            onClick={() => setActiveSubTab('intelligence')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'intelligence'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-md font-extrabold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Content Intelligence</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: GEMINI CHATBOT STUDIO */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Controls, Role Preset & Model Selector */}
          <div className="lg:col-span-1 space-y-5 bg-[#121212] p-5 rounded-2xl border border-white/10 h-fit shadow-lg">
            {/* Model Selector by Complexity */}
            <div>
              <label className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mô Hình Gemini</span>
              </label>

              <div className="space-y-2">
                {GEMINI_MODELS.filter((m) => m.category === 'text').map((m) => {
                  const isSelected = selectedChatModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedChatModel(m.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-semibold shadow-xs'
                          : 'bg-black/30 border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{m.name}</span>
                        {m.tier === 'complex' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                            Complex
                          </span>
                        )}
                        {m.tier === 'general' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                            General
                          </span>
                        )}
                        {m.tier === 'fast' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            Fast
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/50 leading-tight">{m.recommendedFor}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Instruction Role Presets */}
            <div>
              <label className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vai Trò Chatbot (System Role)</span>
              </label>

              <div className="space-y-1.5">
                {SYSTEM_ROLES.map((role) => {
                  const isSelected = systemRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleChange(role.id)}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold'
                          : 'bg-black/20 border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="font-medium text-[11px]">{role.name}</div>
                      <div className="text-[10px] text-white/40 leading-tight">{role.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Instruction Box if Custom selected */}
            {systemRole === 'custom' && (
              <div>
                <label className="text-[11px] font-semibold text-white/70 mb-1 block">
                  Cấu hình System Instruction tùy chỉnh:
                </label>
                <textarea
                  value={customSystemInstruction}
                  onChange={(e) => setCustomSystemInstruction(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-none"
                  placeholder="Nhập vai trò chi tiết cho AI..."
                />
              </div>
            )}

            {/* Clear History Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'model',
                      content: 'Đã xóa lịch sử trò chuyện. Bạn có thể bắt đầu chủ đề mới ngay bây giờ!',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      modelUsed: selectedChatModel,
                    },
                  ])
                }
                className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Lịch Sử Hội Thoại</span>
              </button>
            </div>
          </div>

          {/* Right Main Chat Thread */}
          <div className="lg:col-span-3 flex flex-col bg-[#121212] rounded-2xl border border-white/10 overflow-hidden min-h-[580px] shadow-lg">
            {/* Thread Header Bar */}
            <div className="p-3.5 bg-[#181818] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-extrabold shadow-sm">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Gemini Conversation Thread</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      {messages.length} tin nhắn
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/50 font-mono">
                    Model: <span className="text-cyan-300 font-semibold">{selectedChatModel}</span>
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-white/40 font-mono hidden sm:block">
                Hỗ trợ lưu giữ ngữ cảnh hội thoại đa lượt
              </div>
            </div>

            {/* Scrollable Chat Thread */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[480px] bg-[#0d0d0d]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                        isUser
                          ? 'bg-cyan-500 text-black'
                          : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    {/* Content Box */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm relative group ${
                        isUser
                          ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                          : 'bg-[#181818] border border-white/10 text-stone-200 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[11px] text-white/90">
                            {isUser ? 'Bạn' : 'Gemini AI'}
                          </span>
                          {!isUser && msg.modelUsed && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-emerald-400 font-mono">
                              {msg.modelUsed}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-white/40 font-mono">{msg.timestamp}</span>
                      </div>

                      {/* Render text or Code block */}
                      {msg.content.includes('```') ? (
                        <div className="space-y-2">
                          {msg.content.split(/```/).map((part, index) => {
                            if (index % 2 === 1) {
                              // Code snippet
                              const firstLineEnd = part.indexOf('\n');
                              const lang = firstLineEnd !== -1 ? part.substring(0, firstLineEnd).trim() : 'python';
                              const code = firstLineEnd !== -1 ? part.substring(firstLineEnd + 1) : part;
                              return <CodeBlock key={index} code={code} language={lang || 'python'} />;
                            }
                            return (
                              <div key={index} className="whitespace-pre-wrap leading-relaxed">
                                {part}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      )}

                      {/* Copy Action button */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer"
                        title="Sao chép tin nhắn"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator with Animated Motion Dots */}
              <AnimatePresence>
                {isLoadingChat && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="bg-[#181818] border border-emerald-500/30 rounded-2xl rounded-tl-none p-3.5 text-xs text-emerald-300 flex items-center space-x-3 shadow-lg">
                      <div className="flex space-x-1">
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15, repeatDelay: 0.1 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3, repeatDelay: 0.1 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                      </div>
                      <span className="font-mono text-[11px] text-emerald-300 font-semibold">
                        Gemini đang suy luận và truyền câu trả lời...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-2.5 bg-[#141414] border-t border-white/5 overflow-x-auto whitespace-nowrap flex items-center space-x-2">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider shrink-0 px-2">
                Gợi ý nhanh:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[11px] transition-all shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box Bar */}
            <div className="p-3.5 bg-[#181818] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Nhập câu hỏi hoặc yêu cầu lập trình cho Gemini (Nhấn Enter để gửi)..."
                  disabled={isLoadingChat}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                />

                <button
                  type="submit"
                  disabled={isLoadingChat || !inputPrompt.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:brightness-110 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GEMINI AI CONTENT INTELLIGENCE */}
      {activeSubTab === 'intelligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Wand2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Gemini Content & Code Transformer</h3>
                </div>

                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Analyze & Smart Edit
                </span>
              </div>

              {/* Action Selector */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-2">Chọn Tác Vụ Intelligence:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIntelligenceAction('edit');
                      setIntelligenceModel('gemini-3.1-pro-preview');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center space-x-2 ${
                      intelligenceAction === 'edit'
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                        : 'bg-black/30 border-white/5 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <Wand2 className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div>✏️ Refactor & Sửa Đổi</div>
                      <div className="text-[9px] text-white/40 font-normal">Sửa code / văn bản chuẩn đẹp</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIntelligenceAction('analyze');
                      setIntelligenceModel('gemini-3.1-pro-preview');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center space-x-2 ${
                      intelligenceAction === 'analyze'
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                        : 'bg-black/30 border-white/5 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <Brain className="w-4 h-4 text-purple-400" />
                    <div>
                      <div>🕵️ Phân Tích Chuyên Sâu</div>
                      <div className="text-[9px] text-white/40 font-normal">Đánh giá kiến trúc & logic</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIntelligenceAction('fix');
                      setIntelligenceModel('gemini-3.6-flash');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center space-x-2 ${
                      intelligenceAction === 'fix'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                        : 'bg-black/30 border-white/5 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>🛠️ Sửa Lỗi & Bug Fix</div>
                      <div className="text-[9px] text-white/40 font-normal">Tìm lỗi & sửa tự động</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIntelligenceAction('summary');
                      setIntelligenceModel('gemini-3.1-flash-lite');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center space-x-2 ${
                      intelligenceAction === 'summary'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                        : 'bg-black/30 border-white/5 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <div>⚡ Tóm Tắt Siêu Tốc</div>
                      <div className="text-[9px] text-white/40 font-normal">Rút gọn ý chính với Flash Lite</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Model Picker for Intelligence */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Mô Hình Khuyên Dùng Cho Tác Vụ:</label>
                <select
                  value={intelligenceModel}
                  onChange={(e) => setIntelligenceModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks / Deep Thinking)</option>
                  <option value="gemini-3.6-flash">gemini-3.6-flash (General Tasks / Flagship Standard)</option>
                  <option value="gemini-3.5-flash">gemini-3.5-flash (General Conversational & Refactoring)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Tasks / Instant Output)</option>
                </select>
              </div>

              {/* Text / Code Input Area */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Nội Dung Hoặc Đoạn Mã Nguồn Cần Xử Lý:</label>
                <textarea
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  rows={10}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-300 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
                  placeholder="Dán mã nguồn, tài liệu, đoạn văn hoặc log file vào đây..."
                />
              </div>
            </div>

            <button
              onClick={handleRunIntelligence}
              disabled={intelligenceResult.loading || !contentInput.trim()}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 text-black font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40"
            >
              {intelligenceResult.loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Gemini đang phân tích và xử lý...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-black" />
                  <span>Thực Hiện Tác Vụ Gemini Intelligence</span>
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Kết Quả Xử Lý Chi Tiết</h3>
                </div>

                {intelligenceResult.durationMs && (
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {intelligenceResult.durationMs}ms • {intelligenceResult.tokens || 0} tokens
                  </span>
                )}
              </div>

              {intelligenceResult.loading && (
                <div className="p-8 text-center space-y-3 bg-black/30 rounded-xl border border-white/5">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <div className="text-xs text-white/70 font-mono">
                    Đang gửi dữ liệu tới <span className="text-cyan-300">{intelligenceModel}</span>...
                  </div>
                </div>
              )}

              {intelligenceResult.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-mono">
                  ⚠️ Lỗi: {intelligenceResult.error}
                </div>
              )}

              {intelligenceResult.text && !intelligenceResult.loading && (
                <div className="space-y-3">
                  <div className="p-2 bg-black/40 rounded-lg border border-white/5 text-[10px] text-white/50 font-mono flex items-center justify-between">
                    <span>Mô hình sử dụng: <strong className="text-emerald-300">{intelligenceResult.modelUsed}</strong></span>
                    <span>Tác vụ: <strong className="text-cyan-300 uppercase">{intelligenceAction}</strong></span>
                  </div>

                  {intelligenceResult.text.includes('```') ? (
                    <div className="space-y-3">
                      {intelligenceResult.text.split(/```/).map((part, index) => {
                        if (index % 2 === 1) {
                          const firstLineEnd = part.indexOf('\n');
                          const lang = firstLineEnd !== -1 ? part.substring(0, firstLineEnd).trim() : 'typescript';
                          const code = firstLineEnd !== -1 ? part.substring(firstLineEnd + 1) : part;
                          return <CodeBlock key={index} code={code} language={lang || 'typescript'} title="Kết quả đã tinh chỉnh" />;
                        }
                        return (
                          <div key={index} className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap">
                            {part}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-stone-200 leading-relaxed whitespace-pre-wrap font-sans">
                      {intelligenceResult.text}
                    </div>
                  )}
                </div>
              )}

              {!intelligenceResult.text && !intelligenceResult.loading && !intelligenceResult.error && (
                <div className="p-12 text-center text-white/40 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-white/20" />
                  <p className="text-xs">Kết quả từ Gemini Intelligence sẽ hiển thị tại đây.</p>
                  <p className="text-[11px] text-white/30 font-mono">
                    Hỗ trợ phân tích mã nguồn, refactor code, tóm tắt bài viết & tự động tìm sửa lỗi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
