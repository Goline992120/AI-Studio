import React from 'react';
import { TabType } from '../types';
import { 
  Terminal, 
  Play, 
  BookOpen, 
  Code2, 
  Cpu, 
  MessageSquare, 
  Monitor, 
  Bot, 
  PictureInPicture, 
  Flame, 
  Zap, 
  ShieldCheck,
  LayoutGrid,
  Menu,
  Sparkles,
  ChevronRight,
  ListOrdered,
  Clapperboard,
  Crown,
  Mic,
  Activity
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  apiStatus?: { ok: boolean; checking: boolean; hasKey: boolean };
  onRefreshHealth?: () => void;
  onOpenVerticalMenu: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apiStatus = { ok: false, checking: false, hasKey: false },
  onRefreshHealth,
  onOpenVerticalMenu,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <header className="border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-md sticky top-0 z-40 pt-[env(safe-area-inset-top,0px)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Brand Logo & Vertical Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* TOGGLE VERTICAL LIST DRAWER BUTTON */}
            <button
              onClick={onOpenVerticalMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer hover:scale-105 active:scale-95"
              title="Mở Toàn Bộ Danh Mục Tính Năng (Dạng Danh Sách & Tìm Kiếm)"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Menu Tính Năng</span>
              <span className="sm:hidden font-mono">Menu</span>
            </button>

            <img
              src="/au-logo.png"
              alt="AU"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'white',
                boxShadow: '0 0 15px cyan',
                objectFit: 'cover',
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.src = '/app_logo.jpg';
              }}
            />
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 tracking-tight drop-shadow-xs">
                  SOVEREIGN CODE v6.0
                </h1>
                
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-400/80 font-bold shadow-[0_0_12px_#00ffff]">
                  HUD v3.1.2
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 font-mono border border-yellow-400/80 font-black shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                  TIER $500K
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono border border-purple-400/60 hidden sm:inline-block font-bold">
                  40 NĂNG LỰC
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-mono hidden lg:block">
                Aureon Prime OS • Môi Trường Siêu Trí Tuệ AI 0s Response &amp; Bản Phối Lại
              </p>
            </div>
          </div>

          {/* Quick Horizontal Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 custom-scrollbar">
            {/* MULTI-MODEL AI GATEWAY TAB */}
            <button
              onClick={() => setActiveTab('ai_gateway')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'ai_gateway'
                  ? 'bg-gradient-to-r from-cyan-500/40 via-amber-400/40 to-purple-600/40 text-amber-200 border border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse'
                  : 'text-amber-300/90 hover:text-white hover:bg-amber-500/10 border border-amber-500/40'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>🌐 AI Gateway 02/09/2026</span>
            </button>

            {/* GOOGLE AI STUDIO TAB */}
            <button
              onClick={() => setActiveTab('google_studio')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'google_studio'
                  ? 'bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-indigo-600/40 text-cyan-100 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-cyan-300/90 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>✨ Google AI Studio</span>
            </button>

            {/* AI SUPER INTELLIGENCE TAB */}
            <button
              onClick={() => setActiveTab('super_intelligence')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'super_intelligence'
                  ? 'bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-indigo-500/40 text-cyan-200 border border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>🧠 Siêu Trí Tuệ &amp; Đa Thư Mục</span>
            </button>

            {/* AI MASTER ORCHESTRATOR TAB */}
            <button
              onClick={() => setActiveTab('orchestrator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'orchestrator'
                  ? 'bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-cyan-300/90 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/20'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-cyan-400" />
              <span>👑 AI Master Orchestrator</span>
            </button>

            {/* RUNWAY AI VIDEO AGENT TAB */}
            <button
              onClick={() => setActiveTab('runway')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'runway'
                  ? 'bg-gradient-to-r from-purple-500/40 via-fuchsia-500/40 to-indigo-500/40 text-purple-200 border border-purple-400/60 shadow-[0_0_18px_rgba(168,85,247,0.35)]'
                  : 'text-purple-300/90 hover:text-white hover:bg-purple-500/10 border border-purple-500/30'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
              <span>🎬 Runway Gen-3 Video</span>
            </button>

            {/* VOICE INTERACTION TAB */}
            <button
              onClick={() => setActiveTab('voice_interaction')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'voice_interaction'
                  ? 'bg-gradient-to-r from-cyan-500/40 via-sky-500/40 to-emerald-500/40 text-cyan-200 border border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
                  : 'text-cyan-300/80 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>🎙️ Voice Interaction</span>
            </button>

            {/* AI CAPABILITIES & RANKING TAB */}
            <button
              onClick={() => setActiveTab('aifeatures')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'aifeatures'
                  ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>🏆 Top Dòng AI Thế Giới</span>
            </button>

            {/* HUD QUANTUM TAB */}
            <button
              onClick={() => setActiveTab('hud_dashboard')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-lg ${
                activeTab === 'hud_dashboard'
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-black border-2 border-white shadow-[0_0_28px_#00ffff] font-black scale-105'
                  : 'bg-cyan-500/20 text-cyan-300 hover:text-black hover:bg-cyan-400 border border-cyan-400/70 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-300 group-hover:text-black animate-pulse" />
              <span className="font-black tracking-wide">⚡ HUD QUANTUM v3.1.2</span>
            </button>

            {/* ULTIMATE MODE TAB */}
            <button
              onClick={() => setActiveTab('ultimate_mode')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-lg ${
                activeTab === 'ultimate_mode'
                  ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400 text-black border-2 border-white shadow-[0_0_28px_rgba(250,204,21,0.9)] font-black scale-105'
                  : 'bg-yellow-400/20 text-yellow-300 hover:text-black hover:bg-yellow-400 border border-yellow-400/70 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
              }`}
            >
              <Flame className="w-4 h-4 text-yellow-300 group-hover:text-black animate-bounce" />
              <span className="font-black tracking-wide">⚡ ULTIMATE MODE</span>
            </button>

            {/* CODE STUDIO TAB */}
            <button
              onClick={() => setActiveTab('codestudio')}
              className={`flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'codestudio'
                  ? 'bg-gradient-to-r from-cyan-500/40 via-blue-600/40 to-indigo-600/40 text-cyan-100 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,255,255,0.6)] font-bold'
                  : 'text-cyan-300/90 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <img 
                src="/au-logo.png" 
                alt="AU" 
                style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', marginRight: '6px' }}
                onError={(e) => {
                  e.currentTarget.src = '/app_logo.jpg';
                }}
              />
              <span>SOVEREIGN CODE</span>
            </button>

            {/* META AI FULL TAB */}
            <button
              onClick={() => setActiveTab('meta_ai')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-md ${
                activeTab === 'meta_ai'
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-black border-2 border-white shadow-[0_0_22px_rgba(0,255,255,0.8)] font-black'
                  : 'bg-blue-950/40 text-cyan-300 hover:text-white hover:bg-blue-900/40 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>🔥 META AI FULL</span>
            </button>

            {/* AI HERMES AGENT TAB */}
            <button
              onClick={() => setActiveTab('hermes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'hermes'
                  ? 'bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Hermes</span>
            </button>

            {/* PIP & VPS TAB */}
            <button
              onClick={() => setActiveTab('pip_stream')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'pip_stream'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-cyan-200 shadow-xs border border-cyan-500/40 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <PictureInPicture className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trợ Lý PiP &amp; VPS</span>
            </button>

            {/* APP EXPORTER TAB */}
            <button
              onClick={() => setActiveTab('app_exporter')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'app_exporter'
                  ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-200 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>📦 Xuất App</span>
            </button>

            {/* POWERSHELL & CMD */}
            <button
              onClick={() => setActiveTab('powershell')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'powershell'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>PowerShell &amp; CMD</span>
            </button>

            {/* PLAYGROUND */}
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'playground'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sân Chơi (Playground)</span>
            </button>

            {/* WINDOWS SCREEN LIVE */}
            <button
              onClick={() => setActiveTab('screen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'screen'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-xs border border-cyan-500/30 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Màn Hình Windows</span>
            </button>

            {/* CHATBOT */}
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chatbot'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 shadow-xs border border-cyan-500/30 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chatbot AI</span>
            </button>

            {/* QUICKSTART & SDK MIGRATION */}
            <button
              onClick={() => setActiveTab('quickstart')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'quickstart'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Hướng Dẫn SDK</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};


