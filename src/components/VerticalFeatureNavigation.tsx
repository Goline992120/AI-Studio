import React, { useState } from 'react';
import { TabType } from '../types';
import { 
  Flame, 
  Play, 
  PictureInPicture, 
  Monitor, 
  MessageSquare, 
  Code2, 
  Terminal, 
  Bot, 
  Cpu, 
  Rocket, 
  RefreshCw,
  Search,
  ChevronRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Smartphone,
  Laptop,
  Clapperboard,
  Mic,
  Activity
} from 'lucide-react';

export interface FeatureItem {
  id: TabType;
  title: string;
  shortName: string;
  category: 'Autonomous & AI' | 'Core Studio' | 'System & Terminal' | 'Docs & Guides';
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  description: string;
  highlight: string;
  isNew?: boolean;
}

export const ALL_FEATURES: FeatureItem[] = [
  {
    id: 'ai_gateway',
    title: '🌐 MULTI-MODEL AI GATEWAY (02/09/2026 EDITION)',
    shortName: 'AI GATEWAY 02/09/2026',
    category: 'Autonomous & AI',
    badge: 'FRONTIER 4-MODEL ROUTER',
    badgeColor: 'bg-amber-400/30 text-amber-300 border-amber-400/80 shadow-[0_0_15px_#f59e0b]',
    icon: Cpu,
    iconColor: 'text-amber-400',
    description: 'Dynamic Router định tuyến tự động giữa Gemini 3.8 Flash (Skimaki), DeepSeek V4 305B Multimodal Free, Claude Fable 5.1, Claude Mythos 5.1 & OpenAI Astra.',
    highlight: 'Gemini 3.8 Flash • DeepSeek 305B • Claude Fable/Mythos 5.1 • OpenAI Astra',
    isNew: true,
  },
  {
    id: 'hud_dashboard',
    title: '⚡ SOVEREIGN OS ULTIMATE v3.1.2 / v5.0 (QUANTUM HUD & OMNI AI)',
    shortName: 'HUD QUANTUM v3.1.2',
    category: 'Autonomous & AI',
    badge: 'CYBERPUNK QUANTUM HUD',
    badgeColor: 'bg-cyan-400/30 text-cyan-300 border-cyan-400/80 shadow-[0_0_15px_#00ffff]',
    icon: Activity,
    iconColor: 'text-cyan-400',
    description: 'HUD lượng tử 3D, Lõi AU trung tâm quay 3 lớp 10s-15s, Voice STT/TTS, Omni Chat, Flux Image Generator, 4 Trụ Data Stream, 6 Module Online & Tự Sửa Lỗi Siêu Tốc.',
    highlight: 'Quantum Grid • Omni AI • Flux Image • Voice Command • Auto Fix',
    isNew: true,
  },
  {
    id: 'ultimate_mode',
    title: '⚡ SOVEREIGN OS ULTIMATE v4.0 (15 NĂNG LỰC META AI CLONE)',
    shortName: 'ULTIMATE MODE',
    category: 'Autonomous & AI',
    badge: '15-IN-1 META ULTIMATE',
    badgeColor: 'bg-yellow-400/30 text-yellow-300 border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
    icon: Flame,
    iconColor: 'text-yellow-400',
    description: 'Chat Llama 4 10M Token, Emu Imagine, Movie Gen, 3s Voice Clone, Vision OCR, Memory vĩnh viễn, Auto Post FB/IG, Ray-Ban Vision, Code Interpreter & Chợ Plugin $99.',
    highlight: 'Llama 4 • Emu Flux • Movie Gen • 3s Voice Clone • Ray-Ban Vision',
    isNew: true,
  },
  {
    id: 'google_studio',
    title: '✨ Google AI Studio Workspace (Gemini 2.5 / 3.7 / Imagen 3)',
    shortName: 'Google AI Studio',
    category: 'Core Studio',
    badge: 'GOOGLE AI STUDIO OFFICIAL',
    badgeColor: 'bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-indigo-500/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    icon: Sparkles,
    iconColor: 'text-cyan-300',
    description: 'Môi trường phát triển và thử nghiệm Prompt chuẩn Google AI Studio. Tinh chỉnh Hyperparameters, Google Search Grounding, JSON Structured Output, Imagen 3 và xuất SDK Python/TypeScript.',
    highlight: 'Gemini 2.5 Pro/Flash • Google Search Grounding • SDK Exporter',
    isNew: true,
  },
  {
    id: 'meta_ai',
    title: '🔥 Meta AI Full Clone (Llama-4-Maverick & Multimodal Suite)',
    shortName: 'META AI FULL',
    category: 'Autonomous & AI',
    badge: 'LLAMA-4 & 6-IN-1 SUITE',
    badgeColor: 'bg-blue-500/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.4)]',
    icon: Sparkles,
    iconColor: 'text-cyan-300',
    description: 'Trò chuyện Llama-4, Tạo ảnh Pollinations 1024x1024, Phân tích tệp PDF/Excel/Ảnh (Vision), Tìm kiếm Web Grounding, Giọng nói 2 chiều & Bộ nhớ ngữ cảnh.',
    highlight: 'Llama-4-Maverick • Pollinations Image • Vision OCR • Web Grounding',
    isNew: true,
  },
  {
    id: 'super_intelligence',
    title: '🧠 Siêu Trí Tuệ AI & Chat Đa Thư Mục Toàn Năng',
    shortName: 'Siêu Trí Tuệ & Đa Thư Mục',
    category: 'Autonomous & AI',
    badge: 'SIÊU TRÍ TUỆ & BOT BUILDER',
    badgeColor: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    icon: Sparkles,
    iconColor: 'text-cyan-300',
    description: 'Hiểu ngữ cảnh sâu sắc toàn bộ dự án đa thư mục, tự động tạo Chatbot & Công cụ Đa Tác Nhân từ ô chat, lập trình chuyên sâu.',
    highlight: 'Chain-of-Thought Deep Reasoning & Dynamic Bot Creator',
    isNew: true,
  },
  {
    id: 'voice_interaction',
    title: '🎙️ Voice Interaction Hub & Web Speech API Agent Bridge',
    shortName: 'Voice Interaction AI',
    category: 'Autonomous & AI',
    badge: 'VOICE-TO-TEXT & BRIDGE',
    badgeColor: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    icon: Mic,
    iconColor: 'text-cyan-400',
    description: 'Nhận diện giọng nói thời gian thực với hiệu ứng sóng âm Pulsing. Cầu nối trực tiếp với window.AI_Assistant.execute thực thi tác vụ AI thông minh bằng tiếng Việt.',
    highlight: 'Web Speech API • Concentric Wave Visualizer • Agent Action Bridge',
    isNew: true,
  },
  {
    id: 'runway',
    title: '🎬 Runway AI Video Agent & Director Studio (Gen-3 Alpha / Turbo)',
    shortName: 'Runway Gen-3 AI Video',
    category: 'Autonomous & AI',
    badge: 'RUNWAY GEN-3 & ACT-ONE',
    badgeColor: 'bg-purple-500/30 text-purple-200 border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    icon: Clapperboard,
    iconColor: 'text-purple-400',
    description: 'Tác tử điện ảnh cao cấp tích hợp Runway Gen-3 Alpha Turbo, điều khiển vector camera 3D (Pan/Tilt/Zoom/Roll/Orbit), Multi-Motion Brush, lập kịch bản Storyboard và Act-One biểu cảm.',
    highlight: 'Gen-3 Alpha Turbo • 3D Camera Vectors & Multi-Motion Brush',
    isNew: true,
  },
  {
    id: 'app_exporter',
    title: '📦 Trung Tâm Xuất & Đóng Gói App Đa Thiết Bị',
    shortName: 'Xuất App Đa Thiết Bị',
    category: 'Core Studio',
    badge: 'UNIVERSAL PACKAGING',
    badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    description: 'Xuất ứng dụng trọn gói có hình ảnh logo, hỗ trợ iOS PWA, Android, Windows .exe Desktop (Electron), macOS, Linux & Docker.',
    highlight: 'Tải trọn gói ZIP 1 chạm & Mô phỏng thiết bị',
    isNew: true,
  },
  {
    id: 'hermes',
    title: 'AI Hermes Agent Tự Hành & Cài Đặt Nous Research',
    shortName: 'AI Hermes Agent',
    category: 'Autonomous & AI',
    badge: 'TỰ HÀNH & CÀI ĐẶT',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: Flame,
    iconColor: 'text-cyan-400',
    description: 'Hệ thống tự vá lỗi Cascade, chỉ huy 6 tác nhân con và cài đặt trực tiếp $ curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash',
    highlight: 'Zero-Latency Self-Healing & Official Installer',
    isNew: true,
  },
  {
    id: 'playground',
    title: 'Sân Chơi API (Playground Studio)',
    shortName: 'Playground',
    category: 'Core Studio',
    badge: 'GEMINI 3.6 FLASH',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Play,
    iconColor: 'text-emerald-400',
    description: 'Trải nghiệm trực tiếp sinh văn bản, High Thinking, JSON Schema, Streaming và Vector SVG fallback.',
    highlight: 'Hỗ trợ Python & TypeScript',
  },
  {
    id: 'pip_stream',
    title: 'Trợ Lý PiP & VPS Stream Đa Phương Thức',
    shortName: 'Trợ Lý PiP & VPS',
    category: 'Autonomous & AI',
    badge: 'MULTIMODAL PIP',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: PictureInPicture,
    iconColor: 'text-purple-400',
    description: 'Cửa sổ nổi Picture-in-Picture trên màn hình, luồng Camera, Giọng nói và kết nối máy chủ VPS riêng.',
    highlight: 'Chạy nền không che khuất IDE',
    isNew: true,
  },
  {
    id: 'screen',
    title: 'Màn Hình Windows Live AI Vision',
    shortName: 'Windows Screen Live',
    category: 'Autonomous & AI',
    badge: 'LIVE OCR & VISION',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Monitor,
    iconColor: 'text-blue-400',
    description: 'Quan sát màn hình thời gian thực, đọc lỗi lập trình trong VS Code và tự động gợi ý cách khắc phục.',
    highlight: 'Sub-second Analysis',
  },
  {
    id: 'chatbot',
    title: 'Chatbot & Trí Tuệ Nhân Tạo Hội Thoại',
    shortName: 'Chatbot AI',
    category: 'Core Studio',
    badge: 'MULTI-TURN CHAT',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: MessageSquare,
    iconColor: 'text-teal-400',
    description: 'Hội thoại thông minh nhiều lượt với bộ nhớ ngữ cảnh sâu và các kịch bản lập trình mẫu chuẩn xác.',
    highlight: 'Context Memory Matrix',
  },
  {
    id: 'codestudio',
    title: 'Sovereign Code (IDE Python & TypeScript)',
    shortName: 'Sovereign Code',
    category: 'Core Studio',
    badge: 'IDE SONG SONG',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: Code2,
    iconColor: 'text-cyan-400',
    description: 'Trình soạn thảo mã nguồn so sánh trực quan giữa cú pháp google-genai (Python) và @google/genai (TypeScript).',
    highlight: 'Syntax Highlighting & Run',
  },
  {
    id: 'powershell',
    title: 'PowerShell & CMD & Bash Terminal Commander',
    shortName: 'PowerShell & CMD',
    category: 'System & Terminal',
    badge: 'DEV TERMINAL',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Terminal,
    iconColor: 'text-amber-400',
    description: 'Kho lệnh thực thi hệ thống, thiết lập API Key vĩnh viễn và bộ lệnh cài đặt Hermes Agent Nous Research.',
    highlight: 'Phân tích & Hướng dẫn lệnh chi tiết',
  },
  {
    id: 'orchestrator',
    title: '👑 AI Master Orchestrator (AMO Meta-Agent 5-Stage)',
    shortName: 'AI Master Orchestrator',
    category: 'Autonomous & AI',
    badge: '5-STAGE META-PIPELINE',
    badgeColor: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    icon: Sparkles,
    iconColor: 'text-cyan-400',
    description: 'Bộ não điều phối đa tác nhân (Code Architect, Data Logic, RAG Search, Creative Director), tự động định tuyến intent và suy luận Chain-of-Thought.',
    highlight: 'Multi-Agent Intent Routing • Zero-Fluff Synthesis',
    isNew: true,
  },
  {
    id: 'aifeatures',
    title: 'Danh Mục Toàn Bộ Tính Năng AI 2026',
    shortName: 'Tính Năng AI 2026',
    category: 'Docs & Guides',
    badge: 'DOCS & EXAMPLES',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    icon: Cpu,
    iconColor: 'text-fuchsia-400',
    description: 'Tổng hợp danh sách dọc toàn bộ khả năng: Structured JSON, High Thinking, Tool Calling, Audio, Fallbacks.',
    highlight: 'Mã nguồn mẫu 2 ngôn ngữ',
  },
  {
    id: 'quickstart',
    title: 'Hướng Dẫn Nhanh & Cài Đặt SDK Mới',
    shortName: 'Hướng Dẫn Nhanh',
    category: 'Docs & Guides',
    badge: 'QUICKSTART',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: Rocket,
    iconColor: 'text-green-400',
    description: '3 bước chuẩn hóa khởi chạy Google GenAI SDK và cài đặt Hermes Agent Nous Research chính thức.',
    highlight: 'Dành cho người mới bắt đầu',
  },
  {
    id: 'migration',
    title: 'Hướng Dẫn Nâng Cấp SDK Từ Bản Cũ',
    shortName: 'Nâng Cấp SDK',
    category: 'Docs & Guides',
    badge: 'MIGRATION GUIDE',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: RefreshCw,
    iconColor: 'text-orange-400',
    description: 'Bảng đối chiếu thay đổi hàm, lớp và cấu trúc từ thư viện cũ sang bộ SDK chính thức mới nhất.',
    highlight: 'Zero-downtime Upgrade',
  },
];

interface VerticalFeatureNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
  mode?: 'drawer' | 'sidebar';
}

export const VerticalFeatureNavigation: React.FC<VerticalFeatureNavigationProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  mode = 'drawer',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFeatures = ALL_FEATURES.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.highlight.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Autonomous & AI', 'Core Studio', 'System & Terminal', 'Docs & Guides'];

  const handleSelect = (tabId: TabType) => {
    setActiveTab(tabId);
    if (mode === 'drawer') {
      onClose();
    }
  };

  // If used as an embedded desktop sidebar
  if (mode === 'sidebar') {
    return (
      <aside className="w-80 bg-[#0d0d0d] border-r border-white/5 flex flex-col h-full shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Danh Mục Tính Năng (Dọc)
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
              {ALL_FEATURES.length} Tính Năng
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tính năng, lệnh..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-cyan-500/50 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Vertical Feature List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredFeatures.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-[#121212] border-white/5 text-white/70 hover:bg-[#181818] hover:text-white hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-white/50 group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold truncate text-white">
                      {item.shortName}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hermes Quick Install Command Banner at bottom of sidebar */}
        <div className="p-3 border-t border-white/5 bg-[#0a0a0a]">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-950/50 to-indigo-950/50 border border-cyan-500/30 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1 font-mono">
                <Flame className="w-3 h-3 text-cyan-400" />
                <span>Cài Đặt Hermes Agent</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
                Official
              </span>
            </div>
            <code className="text-[10px] font-mono text-white/80 bg-black/60 p-1.5 rounded-md block truncate border border-white/10 mb-2 select-all">
              curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
            </code>
            <button
              onClick={() => handleSelect('hermes')}
              className="w-full py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Mở Trung Tâm Cài Đặt</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Drawer mode (Mobile & Overlay Modal)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative ml-auto w-full max-w-md sm:max-w-lg bg-[#0c0c0c] border-l border-white/10 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#121212] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Danh Mục Toàn Bộ Tính Năng</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {ALL_FEATURES.length} Phân Hệ
                  </span>
                </h2>
                <p className="text-[11px] text-white/50">
                  Danh sách đầy đủ mọi tính năng AI, SDK và công cụ lập trình
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tính năng: hermes, curl, screen, python, pip..."
              className="w-full bg-[#181818] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-cyan-500/50 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat === 'all' ? `Tất Cả (${ALL_FEATURES.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Hermes Agent Install Box */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-[#0c0c0c] border-b border-cyan-500/20">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-bold text-cyan-200">Lệnh Cài Đặt Hermes Agent Chính Thức:</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Nous Research
            </span>
          </div>
          <div className="bg-black/80 rounded-xl p-2.5 border border-cyan-500/30 flex items-center justify-between gap-2">
            <code className="text-[11px] font-mono text-cyan-300 truncate select-all">
              curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash');
                handleSelect('hermes');
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-200 text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
            >
              Chạy Ngay
            </button>
          </div>
        </div>

        {/* Vertical Feature List Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-12 text-white/40 space-y-2">
              <Search className="w-8 h-8 mx-auto text-white/20" />
              <p className="text-xs">Không tìm thấy tính năng nào phù hợp với "{searchTerm}"</p>
            </div>
          ) : (
            filteredFeatures.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-[#141414] border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : 'bg-[#121212] border-white/5 text-white/80 hover:bg-[#181818] hover:text-white hover:border-white/10'
                  }`}
                >
                  <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 text-cyan-200 border border-cyan-500/40' 
                      : 'bg-white/5 text-white/60 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                        <span>{item.title}</span>
                      </h3>
                      <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-white/60 line-clamp-2 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                      <span className="flex items-center space-x-1 text-cyan-400/80">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{item.highlight}</span>
                      </span>
                      <span className="flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform text-white/60">
                        <span>Truy cập</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#121212] flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
            <span className="font-mono text-[11px]">Tương thích Mobile & Desktop</span>
          </div>
          <span className="font-mono text-[11px] text-cyan-400">v2.17 Google GenAI</span>
        </div>
      </div>
    </div>
  );
};
