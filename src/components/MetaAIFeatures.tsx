import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Search,
  Mic,
  MicOff,
  Settings,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Upload,
  Download,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  ExternalLink,
  Cpu,
  Layers,
  Shield,
  Zap,
  Globe,
  Database,
  FileSpreadsheet,
  FileImage,
  FileCode,
  Key,
  Eye,
  AlertCircle,
  Clock,
  Radio,
  Sliders,
} from 'lucide-react';
import { metaAIService, ChatMessage, WebSearchResult } from '../services/metaAIService';

export const MetaAIFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'file' | 'search' | 'voice' | 'settings'>('chat');

  // TAB 1: CHAT STATES
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Xin chào! Tôi là **Meta AI** (trang bị mô hình Llama-4-Maverick & Llama 3.3). Tôi có thể giải đáp thắc mắc, viết code, phân tích dữ liệu, tạo ảnh và tương tác bằng giọng nói. Bạn cần tôi hỗ trợ gì hôm nay?',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // TAB 2: IMAGE GENERATION STATES
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<
    Array<{ url: string; prompt: string; timestamp: string }>
  >([
    {
      url: '/au-logo.png',
      prompt: 'AU Sovereign Intelligence Core Logo - Cyberpunk Cyan Glow Hologram (Mẫu mặc định)',
      timestamp: 'Sample Asset',
    },
  ]);
  const [selectedImage, setSelectedImage] = useState<string | null>('/au-logo.png');

  // TAB 3: FILE ANALYSIS STATES
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileAnalysisResult, setFileAnalysisResult] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
    contentPreview: string;
    analysis: string;
  } | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TAB 4: WEB SEARCH STATES
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    summary: string;
    results: WebSearchResult[];
  } | null>(null);

  // TAB 5: VOICE STATES
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceInterim, setVoiceInterim] = useState<string>('');
  const [voiceResponse, setVoiceResponse] = useState<string>('');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<'vi-VN' | 'en-US'>('vi-VN');
  const voiceRecRef = useRef<any>(null);

  // TAB 6: SETTINGS STATES
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [customEndpointInput, setCustomEndpointInput] = useState<string>('');
  const [systemPromptInput, setSystemPromptInput] = useState<string>(
    'Bạn là Meta AI (phiên bản Llama-4-Maverick kết hợp Sovereign OS). Hãy trả lời tiếng Việt chuẩn xác, thông minh, hỗ trợ lập trình, phân tích và hướng dẫn chi tiết.'
  );
  const [savedMemories, setSavedMemories] = useState<Record<string, any>>({});
  const [newMemKey, setNewMemKey] = useState<string>('');
  const [newMemVal, setNewMemVal] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // General helper states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize from service
  useEffect(() => {
    setApiKeyInput(metaAIService.getApiKey());
    setCustomEndpointInput(metaAIService.getCustomEndpoint());
    setSavedMemories(metaAIService.getAllMemories());
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Handle Copy
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- TAB 1: CHAT HANDLER ---
  const handleSendMessage = async (customText?: string) => {
    const text = customText || chatInput;
    if (!text.trim() || isChatLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setIsChatLoading(true);

    try {
      const reply = await metaAIService.chat(text, chatMessages, systemPromptInput);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Lỗi kết nối Meta AI: ${err?.message || 'Không thể tải phản hồi.'}`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- TAB 2: IMAGE GENERATION HANDLER ---
  const handleGenerateImage = async (presetPrompt?: string) => {
    const promptToUse = presetPrompt || imagePrompt;
    if (!promptToUse.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    try {
      const result = await metaAIService.generateImage(promptToUse);
      const newImg = {
        url: result.url,
        prompt: promptToUse,
        timestamp: new Date().toLocaleTimeString(),
      };
      setGeneratedImages((prev) => [newImg, ...prev]);
      setSelectedImage(result.url);
      if (!presetPrompt) setImagePrompt('');
    } catch (err: any) {
      alert('Không thể tạo ảnh: ' + (err?.message || err));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // --- TAB 3: FILE ANALYSIS HANDLER ---
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadedFile(file);
    setIsAnalyzingFile(true);
    try {
      const result = await metaAIService.analyzeFile(file);
      setFileAnalysisResult(result);
    } catch (err: any) {
      alert('Lỗi phân tích tệp: ' + (err?.message || err));
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // --- TAB 4: WEB SEARCH HANDLER ---
  const handleWebSearch = async (customQuery?: string) => {
    const query = customQuery || searchQuery;
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const results = await metaAIService.webSearch(query);
      setSearchResults(results);
    } catch (err: any) {
      alert('Lỗi tìm kiếm: ' + (err?.message || err));
    } finally {
      setIsSearching(false);
    }
  };

  // --- TAB 5: VOICE HANDLER ---
  const toggleVoiceListening = () => {
    if (isVoiceListening) {
      if (voiceRecRef.current) {
        voiceRecRef.current.stop();
      }
      setIsVoiceListening(false);
    } else {
      setVoiceTranscript('');
      setVoiceInterim('');
      const rec = metaAIService.speechToText(
        async (trans, isFinal) => {
          if (isFinal) {
            setVoiceTranscript(trans);
            setVoiceInterim('');
            setIsVoiceListening(false);
            // Auto ask Meta AI
            const reply = await metaAIService.chat(trans);
            setVoiceResponse(reply);
            metaAIService.textToSpeech(reply, voiceLang, () => setIsVoiceSpeaking(true), () => setIsVoiceSpeaking(false));
          } else {
            setVoiceInterim(trans);
          }
        },
        (err) => {
          setIsVoiceListening(false);
          console.warn('Voice error:', err);
        },
        () => setIsVoiceListening(false),
        voiceLang
      );

      if (rec) {
        voiceRecRef.current = rec;
        rec.start();
        setIsVoiceListening(true);
      }
    }
  };

  const handleSpeakText = (text: string) => {
    metaAIService.textToSpeech(
      text,
      voiceLang,
      () => setIsVoiceSpeaking(true),
      () => setIsVoiceSpeaking(false),
      () => setIsVoiceSpeaking(false)
    );
  };

  // --- TAB 6: SETTINGS HANDLERS ---
  const handleSaveSettings = () => {
    metaAIService.setApiKey(apiKeyInput.trim());
    metaAIService.setCustomEndpoint(customEndpointInput.trim());
    setSaveSuccessMsg('Đã lưu cấu hình Llama API Key và Endpoint thành công!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleAddMemory = () => {
    if (!newMemKey.trim() || !newMemVal.trim()) return;
    metaAIService.saveMemory(newMemKey.trim(), newMemVal.trim());
    setSavedMemories(metaAIService.getAllMemories());
    setNewMemKey('');
    setNewMemVal('');
  };

  const handleDeleteMemory = (key: string) => {
    metaAIService.clearMemory(key);
    setSavedMemories(metaAIService.getAllMemories());
  };

  const handleClearAllMemories = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bộ nhớ Meta AI?')) {
      metaAIService.clearAllMemories();
      setSavedMemories({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-cyan-950/70 border border-cyan-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-black/60 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                <img
                  src="/au-logo.png"
                  alt="Meta AI AU"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/app_logo.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>META AI FULL CLONE</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                    Llama-4-Maverick &amp; Multimodal Suite
                  </span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-cyan-200/80 max-w-2xl leading-relaxed">
                Bộ công cụ AI toàn diện: Trò chuyện thông minh, Tạo ảnh nghệ thuật, Phân tích tệp tài liệu, Tìm kiếm web
                Grounding, Tương tác giọng nói hai chiều và Quản lý bộ nhớ ngữ cảnh.
              </p>
            </div>
          </div>

          {/* Quick Engine Status */}
          <div className="flex items-center space-x-3 bg-black/40 border border-white/10 rounded-xl p-3 shrink-0">
            <div className="space-y-1 text-right sm:text-left">
              <div className="flex items-center space-x-1.5 justify-end sm:justify-start">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                <span className="text-xs font-bold text-white font-mono">
                  {apiKeyInput ? 'Llama API: Custom Key' : 'Engine: Pollinations Free'}
                </span>
              </div>
              <p className="text-[11px] text-cyan-300/70">6/6 Phân Hệ Hoạt Động</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Tabs Navigation Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {[
          { id: 'chat', label: '1. Chat Llama-4', icon: MessageSquare, badge: 'Streaming' },
          { id: 'image', label: '2. Tạo Ảnh AI', icon: ImageIcon, badge: 'Pollinations' },
          { id: 'file', label: '3. Phân Tích File', icon: FileText, badge: 'Vision/OCR' },
          { id: 'search', label: '4. Tìm Kiếm Web', icon: Search, badge: 'Grounding' },
          { id: 'voice', label: '5. Giọng Nói AI', icon: Mic, badge: 'Two-Way STT/TTS' },
          { id: 'settings', label: '6. Cài Đặt & Bộ Nhớ', icon: Settings, badge: 'Llama Key' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-[#0e111a] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-white/50'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono hidden sm:inline-block ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-white/40'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CHAT */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#0e111a] border border-cyan-500/20 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-xl">
            {/* Chat Messages Log */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md font-medium'
                        : 'bg-black/60 border border-white/10 text-cyan-100 rounded-tl-none space-y-2'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5 text-[11px] text-white/40">
                        <button
                          onClick={() => handleCopy(msg.content, `chat_${idx}`)}
                          className="hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedId === `chat_${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handleSpeakText(msg.content)}
                          className="hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Đọc</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-sm">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                  </div>
                  <div className="bg-black/60 border border-cyan-500/30 rounded-2xl rounded-tl-none p-4 text-xs text-cyan-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-bounce text-cyan-400" />
                    <span>Meta AI đang suy luận và soạn câu trả lời...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-black/60 border-t border-white/10 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Hỏi Meta AI bất cứ điều gì (Llama-4, coding, sáng tạo, giải toán)..."
                  className="flex-1 bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </form>
            </div>
          </div>

          {/* Chat Quick Prompts & Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gợi Ý Trò Chuyện Nhanh</span>
              </h3>
              <div className="space-y-2">
                {[
                  'Giải thích kiến trúc Sovereign Agent và Llama-4 Maverick',
                  'Viết mã nguồn Python thu thập dữ liệu bất đồng bộ',
                  'Lập kế hoạch phát triển ứng dụng Full-stack trong 3 ngày',
                  'So sánh ưu nhược điểm của Gemini 2.5 Flash và Llama 3.3',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-black/40 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-400/40 text-xs text-cyan-200/90 transition-all cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-2 text-xs text-white/60">
              <p className="font-bold text-white flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Meta AI Enterprise Protocol</span>
              </p>
              <p>
                Mọi hội thoại đều được tối ưu hóa ngữ cảnh và kết nối đa tầng với Llama-4-Maverick. Bộ nhớ ngữ cảnh được
                lưu trữ an toàn tại máy trạm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE GENERATION */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                  <span>Bộ Sinh Ảnh Nghệ Thuật Meta AI (Pollinations Engine)</span>
                </h3>
                <p className="text-xs text-white/50">
                  Nhập mô tả ý tưởng để tạo ảnh chất lượng cao 1024x1024 không giới hạn.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerateImage();
                }}
                placeholder="Mô tả bức ảnh bạn muốn tạo (Ví dụ: Cyberpunk Vietnamese AI Studio, neon hologram, 8k resolution)..."
                className="flex-1 bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
              />
              <button
                onClick={() => handleGenerateImage()}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md shrink-0"
              >
                {isGeneratingImage ? <Sparkles className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                <span>{isGeneratingImage ? 'Đang Tạo Ảnh...' : 'Tạo Ảnh Ngay'}</span>
              </button>
            </div>

            {/* Quick Sample Style Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'AU Sovereign Logo 3D Cyan Glow in Cyberpunk Matrix',
                'Futuristic Vietnamese AI Software Engineer with Holographic UI',
                'Hyper-realistic Quantum Data Center with Blue Neon Lights 8k',
                'Anime Style AI Assistant Robot in Futuristic Hanoi City',
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerateImage(preset)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 rounded-lg text-xs text-cyan-300 transition-all cursor-pointer"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Main Gallery & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Preview */}
            <div className="lg:col-span-8 bg-[#0e111a] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[420px]">
              {selectedImage ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_30px_rgba(0,255,255,0.25)]">
                    <img
                      src={selectedImage}
                      alt="Generated AI"
                      className="w-full h-auto object-cover rounded-2xl"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/au-logo.png';
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={selectedImage}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-white/20 rounded-xl text-xs text-cyan-300 font-bold flex items-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem Độ Phân Giải Gốc</span>
                    </a>
                    <button
                      onClick={() => handleCopy(selectedImage, 'img_url')}
                      className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-white/20 rounded-xl text-xs text-white font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      {copiedId === 'img_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Link Ảnh</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-xs">Chưa chọn ảnh nào để hiển thị.</p>
              )}
            </div>

            {/* Generated List */}
            <div className="lg:col-span-4 bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Thư Viện Ảnh Đã Tạo ({generatedImages.length})
              </h4>
              <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {generatedImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(img.url)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square ${
                      selectedImage === img.url
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/au-logo.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                      <p className="text-[10px] text-white line-clamp-2">{img.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FILE ANALYSIS */}
      {activeTab === 'file' && (
        <div className="space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/20 hover:border-cyan-500/50 bg-[#0e111a]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto">
                <Upload className="w-7 h-7 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-white">Kéo &amp; Thả Tệp Tin Vào Đây Hoặc Bấm Để Chọn</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Hỗ trợ PDF, Bảng tính Excel/CSV, Hình ảnh PNG/JPG (OCR Vision), Văn bản mã nguồn (.ts, .py, .json, .md).
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Chọn Tệp Từ Máy Tính
              </button>
            </div>
          </div>

          {isAnalyzingFile && (
            <div className="p-6 bg-[#0e111a] border border-cyan-500/30 rounded-2xl text-center space-y-3">
              <Cpu className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Meta AI Vision Đang Đọc &amp; Phân Tích Dữ Liệu Tệp...</p>
            </div>
          )}

          {fileAnalysisResult && !isAnalyzingFile && (
            <div className="bg-[#0e111a] border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* File Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{fileAnalysisResult.fileName}</h4>
                    <p className="text-[11px] text-white/50 font-mono">
                      Dung lượng: {fileAnalysisResult.fileSize} • Loại: {fileAnalysisResult.fileType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      fileAnalysisResult.analysis,
                      'analysis_copy'
                    )
                  }
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-cyan-300 font-bold flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
                >
                  {copiedId === 'analysis_copy' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy Kết Quả Phân Tích</span>
                </button>
              </div>

              {/* Analysis Result Display */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Content / Preview Box */}
                <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-xl p-4 space-y-2">
                  <span className="text-xs text-white/50 font-mono flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Xem trước dữ liệu tệp:</span>
                  </span>
                  {fileAnalysisResult.contentPreview.startsWith('data:image') ? (
                    <div className="rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={fileAnalysisResult.contentPreview}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ) : (
                    <pre className="text-xs font-mono text-cyan-300/80 bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-64 whitespace-pre-wrap">
                      {fileAnalysisResult.contentPreview}
                    </pre>
                  )}
                </div>

                {/* AI Detailed Report */}
                <div className="lg:col-span-7 bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-sm font-bold text-white">Báo Cáo Phân Tích Chuyên Sâu Meta AI</h5>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-100 whitespace-pre-wrap leading-relaxed">
                    {fileAnalysisResult.analysis}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WEB SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Tìm Kiếm Web Tri Thức Thời Gian Thực (Meta Grounding)</span>
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleWebSearch();
                }}
                placeholder="Nhập nội dung cần tra cứu (Ví dụ: Tin tức công nghệ AI mới nhất 2026, mô hình Llama-4)..."
                className="flex-1 bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
              />
              <button
                onClick={() => handleWebSearch()}
                disabled={!searchQuery.trim() || isSearching}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shrink-0"
              >
                {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isSearching ? 'Đang Tìm...' : 'Tìm Kiếm'}</span>
              </button>
            </div>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                'Mô hình Meta Llama 4 Maverick thông số và hiệu năng',
                'Kiến trúc Sovereign AI Agent & Web Speech API',
                'Hướng dẫn lập trình ứng dụng Full-stack với Vite React',
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleWebSearch(query)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 rounded-lg text-xs text-cyan-300 transition-all cursor-pointer"
                >
                  🔍 {query}
                </button>
              ))}
            </div>
          </div>

          {searchResults && (
            <div className="space-y-6">
              {/* AI Synthesized Summary */}
              <div className="bg-[#0e111a] border border-cyan-500/30 rounded-2xl p-6 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Tổng Hợp Tri Thức &amp; Nhận Định AI</h4>
                  </div>
                  <button
                    onClick={() => handleSpeakText(searchResults.summary)}
                    className="px-3 py-1 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-cyan-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Đọc Tóm Tắt</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed whitespace-pre-wrap">
                  {searchResults.summary}
                </p>
              </div>

              {/* Source List */}
              <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Các Nguồn Dữ Liệu Tham Khảo ({searchResults.results.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {searchResults.results.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-black/40 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/50 rounded-xl space-y-2 transition-all block group"
                    >
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                        {res.source || 'Web Index'}
                      </span>
                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 line-clamp-1">
                        {res.title}
                      </h5>
                      <p className="text-[11px] text-white/50 line-clamp-2">{res.snippet}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: VOICE */}
      {activeTab === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                <span>Web Speech Recognition &amp; Synthesis</span>
              </span>
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value as any)}
                className="bg-black/60 border border-white/15 text-xs text-white px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <option value="vi-VN">🇻🇳 Tiếng Việt (vi-VN)</option>
                <option value="en-US">🇺🇸 English (en-US)</option>
              </select>
            </div>

            {/* Pulsing Mic Button */}
            <div className="relative my-4 flex items-center justify-center">
              {isVoiceListening && (
                <motion.div
                  className="absolute rounded-full border-2 border-cyan-400/50"
                  animate={{
                    width: [120, 220, 260],
                    height: [120, 220, 260],
                    opacity: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}

              <button
                onClick={toggleVoiceListening}
                className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                  isVoiceListening
                    ? 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-emerald-400 text-black shadow-[0_0_40px_rgba(0,255,255,0.9)] border-4 border-white'
                    : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-cyan-400 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                }`}
              >
                {isVoiceListening ? (
                  <>
                    <Mic className="w-10 h-10 animate-bounce" />
                    <span className="text-[10px] font-black uppercase mt-1">Đang Lắng Nghe...</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-9 h-9" />
                    <span className="text-[10px] font-bold uppercase mt-1 text-white/80">Bấm Để Nói</span>
                  </>
                )}
              </button>
            </div>

            {/* Voice Live Transcript Box */}
            <div className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-left min-h-[90px] flex flex-col justify-center">
              <span className="text-[11px] text-white/40 mb-1">Văn bản nhận diện thời gian thực:</span>
              {voiceTranscript || voiceInterim ? (
                <p className="text-sm font-medium text-cyan-100">
                  {voiceTranscript}{' '}
                  <span className="text-cyan-400/70 italic underline">{voiceInterim}</span>
                </p>
              ) : (
                <p className="text-xs text-white/40 italic">
                  {isVoiceListening
                    ? 'Hãy nói câu hỏi hoặc yêu cầu của bạn...'
                    : 'Nhấn nút Micro và nói bằng tiếng Việt để trò chuyện trực tiếp với Meta AI.'}
                </p>
              )}
            </div>
          </div>

          {/* Voice Response Box */}
          <div className="lg:col-span-5 bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Phản Hồi Bằng Giọng Nói Của Meta AI</span>
                </h4>
                {isVoiceSpeaking && (
                  <span className="text-xs text-emerald-400 font-mono animate-pulse">● Đang Đọc...</span>
                )}
              </div>

              {voiceResponse ? (
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed whitespace-pre-wrap">
                    {voiceResponse}
                  </p>
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleSpeakText(voiceResponse)}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Đọc Lại</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/40 space-y-2">
                  <Volume2 className="w-8 h-8 mx-auto text-cyan-400/40" />
                  <p className="text-xs">Chưa có phản hồi giọng nói nào trong phiên này.</p>
                </div>
              )}
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] text-white/50">
              💡 Bạn có thể nói: "Tạo ảnh logo AU 3D", "Tìm kiếm tin tức AI", "Tóm tắt dự án".
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS & MEMORY */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* API Configuration */}
          <div className="lg:col-span-7 bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <span>Cấu Hình Llama API Key &amp; Endpoint</span>
            </h3>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/70 font-semibold block mb-1.5">
                  Llama / Groq / OpenRouter API Key (Tùy chọn):
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="gsk_... hoặc sk-or-... (để trống để dùng Pollinations miễn phí)"
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                />
                <p className="text-[11px] text-white/40 mt-1">
                  Khóa được lưu trực tiếp vào LocalStorage trình duyệt của bạn (key: `llama_key`).
                </p>
              </div>

              <div>
                <label className="text-xs text-white/70 font-semibold block mb-1.5">
                  Custom Chat Completions Endpoint URL (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={customEndpointInput}
                  onChange={(e) => setCustomEndpointInput(e.target.value)}
                  placeholder="https://api.groq.com/openai/v1/chat/completions"
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 font-semibold block mb-1.5">
                  System Instruction Prompt:
                </label>
                <textarea
                  rows={3}
                  value={systemPromptInput}
                  onChange={(e) => setSystemPromptInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md"
              >
                Lưu Cấu Hình
              </button>
            </div>
          </div>

          {/* Context Memory Manager */}
          <div className="lg:col-span-5 bg-[#0e111a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Bộ Nhớ Ngữ Cảnh Meta AI ({Object.keys(savedMemories).length})</span>
              </h3>
              {Object.keys(savedMemories).length > 0 && (
                <button
                  onClick={handleClearAllMemories}
                  className="text-[11px] text-red-400 hover:underline cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* Add Memory Row */}
            <div className="space-y-2">
              <input
                type="text"
                value={newMemKey}
                onChange={(e) => setNewMemKey(e.target.value)}
                placeholder="Khóa (Key): user_name, preferred_tech..."
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMemVal}
                  onChange={(e) => setNewMemVal(e.target.value)}
                  placeholder="Giá trị (Value): Nguyễn Văn A..."
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleAddMemory}
                  className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Memory List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {Object.keys(savedMemories).length > 0 ? (
                Object.entries(savedMemories).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono text-cyan-400 font-bold">{k}:</span>
                      <p className="text-white/80 line-clamp-1">{typeof v === 'string' ? v : JSON.stringify(v)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(k)}
                      className="text-white/40 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/30 text-center py-4">Chưa có mục ghi nhớ nào.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
