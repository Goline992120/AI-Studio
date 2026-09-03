import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Sparkles,
  Bot,
  Cpu,
  Shield,
  DollarSign,
  Clock,
  Send,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Code2,
  Key,
  Terminal,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { aiRouter, MODEL_PRICING, resolveTargetModel, estimateCost } from './gateway.js';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### 🌐 Multi-Model AI Gateway (02/09/2026 Edition)
Sẵn sàng điều phối thông minh giữa 4 thế hệ mô hình Frontier:
- ⚡ **Gemini 3.8 Flash (Skimaki)**: Mô hình nhanh nhất, tối ưu latency từ Google DeepMind.
- 🆓 **DeepSeek V4 305B**: Đa phương thức (Ảnh + Chữ) mã nguồn mở MIT 305B qua Together AI.
- 🎨 **Claude Fable 5.1**: Đỉnh cao sáng tác tiểu thuyết, nghệ thuật ngôn từ của Anthropic.
- 🧠 **Claude Mythos 5.1**: #1 Benchmark tư duy giải thuật, lập trình & logic sâu.
- 🛡️ **OpenAI Astra**: Siêu mô hình thế hệ kế tiếp với chốt chặn an toàn Guardrails.

*Hãy thử gõ câu hỏi hoặc bấm vào các nút gợi ý bên dưới!*`,
      model: 'gemini-3.8-flash',
      provider: 'Google DeepMind',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState('auto');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [copiedCode, setCopiedCode] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    together: '',
    anthropic: '',
    openai: '',
  });

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai_gateway_keys');
    if (saved) {
      try {
        setApiKeys(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveKeys = (newKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('ai_gateway_keys', JSON.stringify(newKeys));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const samplePrompts = [
    {
      label: '⚡ Siêu Tốc (Fast)',
      type: 'fast',
      text: 'Tóm tắt 3 quy tắc vàng trong kiến trúc Microservices trong 2 câu.',
    },
    {
      label: '🧠 Lập Trình & Math (Mythos)',
      type: 'reasoning',
      text: 'Viết giải thuật Red-Black Tree bằng TypeScript kèm phân tích độ phức tạp O(log n).',
    },
    {
      label: '🎨 Sáng Tác Truyện (Fable)',
      type: 'creative',
      text: 'Viết mở đầu một tiểu thuyết khoa học viễn tưởng về hành tinh Skimaki năm 2099.',
    },
    {
      label: '🛡️ Thử Nghiệm OpenAI Astra',
      type: 'astra',
      text: 'Đánh giá an toàn và kiểm tra cơ chế Guardrail của Astra thế hệ mới.',
    },
  ];

  const handleSendMessage = async (customPrompt, customType) => {
    const textToSend = customPrompt ?? prompt;
    const typeToSend = customType ?? taskType;

    if (!textToSend.trim() && !selectedImage) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      image: selectedImage,
      taskType: typeToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    const currentImg = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);
    setStreamingText('');

    try {
      let streamSuccess = false;
      // 1. Try Backend Proxy
      try {
        const res = await fetch('/api/gateway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSend,
            image: currentImg,
            taskType: typeToSend,
            keys: apiKeys,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: data.text || 'Hoàn tất.',
              model: data.model,
              provider: data.provider,
              taskType: data.taskType,
              latencyMs: data.latencyMs,
              cost: data.cost,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          streamSuccess = true;
        }
      } catch (e) {
        console.warn('Backend unavailable, running client gateway:', e);
      }

      // 2. Direct aiRouter fallback
      if (!streamSuccess) {
        let accumulated = '';
        const result = await aiRouter({
          prompt: textToSend,
          image: currentImg,
          taskType: typeToSend,
          stream: true,
          onChunk: (chunk) => {
            accumulated += chunk;
            setStreamingText(accumulated);
          },
          keys: apiKeys,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: result.text || accumulated,
            model: result.model,
            provider: result.provider,
            taskType: result.taskType,
            latencyMs: result.latencyMs,
            cost: result.cost,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Lỗi Gateway: ${err.message}`,
          model: 'error-handler',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  };

  const getModelBadge = (modelName) => {
    switch (modelName) {
      case 'gemini-3.8-flash':
        return { label: 'Gemini 3.8 Flash (Skimaki)', color: 'border-amber-400 bg-amber-950/60 text-amber-300' };
      case 'deepseek-305b':
        return { label: 'DeepSeek V4 305B (Free MIT)', color: 'border-cyan-400 bg-cyan-950/60 text-cyan-300' };
      case 'claude-fable-5-1':
        return { label: 'Claude Fable 5.1 (Creative)', color: 'border-emerald-400 bg-emerald-950/60 text-emerald-300' };
      case 'claude-mythos-5-1':
        return { label: 'Claude Mythos 5.1 (#1 Reasoning)', color: 'border-purple-400 bg-purple-950/60 text-purple-300' };
      case 'openai-astra':
        return { label: 'OpenAI Astra (Frontier)', color: 'border-rose-400 bg-rose-950/60 text-rose-300' };
      default:
        return { label: modelName || 'AI Router', color: 'border-slate-500 bg-slate-900 text-slate-300' };
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <header className="p-4 bg-slate-950 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400">
              MULTI-MODEL AI GATEWAY
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Google Gemini 3.8 Flash • DeepSeek 305B • Claude Fable/Mythos 5.1 • OpenAI Astra
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              activeTab === 'chat'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-white/10'
            }`}
          >
            Chat Router
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              activeTab === 'pricing'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-white/10'
            }`}
          >
            Bảng Giá 4 Models
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              activeTab === 'keys'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-white/10'
            }`}
          >
            API Keys (.env)
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col">
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Strategy Options */}
            <div className="p-3 bg-slate-900/60 border-b border-white/5 flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400 mr-1">Chiến lược:</span>
              {[
                { id: 'auto', label: '⚡ Auto (Tự Động)' },
                { id: 'fast', label: '🚀 Fast (Gemini 3.8 Flash)' },
                { id: 'multimodal_free', label: '🆓 Free (DeepSeek 305B)' },
                { id: 'creative', label: '🎨 Creative (Claude Fable)' },
                { id: 'reasoning', label: '🧠 Reasoning (Claude Mythos)' },
                { id: 'astra', label: '🛡️ Astra (OpenAI)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTaskType(s.id)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    taskType === s.id
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const badge = getModelBadge(msg.model);
                return (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 mb-1 px-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        {msg.role === 'user' ? '👤 User' : '🤖 AI Gateway'}
                      </span>
                      {msg.model && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                      {msg.latencyMs && (
                        <span className="text-[10px] font-mono text-cyan-400">{msg.latencyMs}ms</span>
                      )}
                      {msg.cost && (
                        <span className="text-[10px] font-mono text-emerald-400">
                          {msg.cost.isFree ? 'FREE' : `$${msg.cost.totalCostUSD}`}
                        </span>
                      )}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.image && (
                        <img src={msg.image} alt="Uploaded" className="mb-2 max-w-xs rounded-xl border border-white/20" />
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="text-[11px] font-mono text-amber-400 mb-1 flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Đang định tuyến & truyền tải dữ liệu ({taskType.toUpperCase()})...</span>
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none p-3.5 bg-slate-900 border border-amber-400/40 text-slate-200 text-sm">
                    {streamingText || 'Đang kết nối tới mô hình tối ưu...'}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset prompts */}
            <div className="p-2 bg-slate-900/40 border-t border-white/5 flex flex-wrap gap-1">
              {samplePrompts.map((sp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTaskType(sp.type);
                    handleSendMessage(sp.text, sp.type);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-white/10"
                >
                  {sp.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-white/10 flex items-center space-x-2">
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30"
                title="Đính kèm ảnh (DeepSeek V4 / Gemini Flash)"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập yêu cầu để Gateway tự động định tuyến đến mô hình tốt nhất..."
                rows={1}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!prompt.trim() && !selectedImage)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-sm hover:opacity-90 disabled:opacity-50"
              >
                Gửi
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="p-6 bg-slate-950 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
            <h2 className="text-base font-bold text-cyan-400">BẢNG GIÁ 4 MÔ HÌNH FRONTIER (USD / 1M TOKENS)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(MODEL_PRICING).map(([key, item]) => (
                <div key={key} className="bg-slate-900 p-4 rounded-xl border border-white/10">
                  <h3 className="text-sm font-bold text-white mb-1">{key}</h3>
                  <p className="text-slate-400 mb-2">{item.description}</p>
                  <div className="text-amber-300">Nhà phát triển: {item.provider}</div>
                  <div className="text-emerald-400">Input: ${item.inputPer1M} / 1M tokens</div>
                  <div className="text-emerald-400">Output: ${item.outputPer1M} / 1M tokens</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="p-6 bg-slate-950 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
            <h2 className="text-base font-bold text-amber-400">CẤU HÌNH API KEYS (.ENV / VERCEL)</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">GEMINI_API_KEY (Gemini 3.8 Flash)</label>
                <input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) => saveKeys({ ...apiKeys, gemini: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">TOGETHER_API_KEY (DeepSeek 305B)</label>
                <input
                  type="password"
                  value={apiKeys.together}
                  onChange={(e) => saveKeys({ ...apiKeys, together: e.target.value })}
                  placeholder="tog_..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">ANTHROPIC_API_KEY (Claude Fable/Mythos 5.1)</label>
                <input
                  type="password"
                  value={apiKeys.anthropic}
                  onChange={(e) => saveKeys({ ...apiKeys, anthropic: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">OPENAI_API_KEY (OpenAI Astra)</label>
                <input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => saveKeys({ ...apiKeys, openai: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
