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
  ListOrdered
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
            
            {/* TOGGLE VERTICAL LIST DRAWER BUTTON (Optimized for Mobile & Desktop) */}
            <button
              onClick={onOpenVerticalMenu}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
              title="Mở Danh Mục Tính Năng Dạng Danh Sách Dọc (Tối ưu Mobile & PC)"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Danh Sách Tính Năng (Dọc)</span>
              <span className="sm:hidden font-mono">Menu (11)</span>
              <span className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.2 bg-cyan-400/20 rounded text-cyan-200">
                Dọc
              </span>
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0 bg-gradient-to-br from-cyan-900 via-indigo-900 to-purple-900 flex items-center justify-center relative group">
              <img
                src="/app_logo.jpg"
                alt="AI CODE Logo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none group-hover:bg-transparent transition-colors"></div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
                <h1 className="text-sm sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 tracking-tight drop-shadow-xs">AI CODE</h1>
                
                <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 hidden md:inline-block">
                  google-genai v2.17
                </span>

                <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20 hidden lg:inline-block">
                  Hermes Autonomous Core
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/40 font-mono hidden lg:block">
                Môi Trường Lập Trình &amp; Tự Hành Đa Tác Nhân Tối Cao
              </p>
            </div>
          </div>

          {/* Quick Horizontal Tabs (Can also be used or users can use the vertical list) */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 custom-scrollbar">
            {/* PROMINENT AI HERMES AGENT TAB */}
            <button
              onClick={() => setActiveTab('hermes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === 'hermes'
                  ? 'bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-cyan-300/90 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-500/20'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI Hermes &amp; Cài Đặt</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'playground'
                  ? 'bg-white/10 text-white shadow-xs border border-white/15 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sân Chơi (Playground)</span>
            </button>

            <button
              onClick={() => setActiveTab('pip_stream')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'pip_stream'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-cyan-200 shadow-xs border border-cyan-500/40 font-bold'
                  : 'text-cyan-300/80 hover:text-cyan-200 hover:bg-cyan-500/10'
              }`}
            >
              <PictureInPicture className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trợ Lý PiP &amp; VPS</span>
            </button>

            <button
              onClick={() => setActiveTab('screen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'screen'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-xs border border-cyan-500/30 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Màn Hình Windows</span>
            </button>

            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chatbot'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 shadow-xs border border-cyan-500/30 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chatbot AI</span>
            </button>

            <button
              onClick={() => setActiveTab('codestudio')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'codestudio'
                  ? 'bg-white/10 text-white shadow-xs border border-white/15 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Code Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('powershell')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'powershell'
                  ? 'bg-white/10 text-white shadow-xs border border-white/15 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>PowerShell &amp; CMD</span>
            </button>

            <button
              onClick={() => setActiveTab('orchestrator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orchestrator'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-xs border border-cyan-500/30 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Điều Khiển Tác Nhân</span>
            </button>

            <button
              onClick={() => setActiveTab('aifeatures')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'aifeatures'
                  ? 'bg-white/10 text-white shadow-xs border border-white/15 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tính Năng AI (Dọc)</span>
            </button>

            <button
              onClick={() => setActiveTab('quickstart')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'quickstart'
                  ? 'bg-white/10 text-white shadow-xs border border-white/15 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Hướng Dẫn Nhanh</span>
            </button>

            <button
              onClick={() => setActiveTab('migration')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'migration'
                  ? 'bg-white/10 text-white shadow-xs border border-white/15 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Chuyển Đổi SDK</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};


