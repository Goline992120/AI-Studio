import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, PlaygroundConfig } from './types';
import { Header } from './components/Header';
import { PlaygroundTab } from './components/PlaygroundTab';
import { GeminiChatbotTab } from './components/GeminiChatbotTab';
import { WindowsScreenTab } from './components/WindowsScreenTab';
import { CodeStudioTab } from './components/CodeStudioTab';
import { QuickstartTab } from './components/QuickstartTab';
import { MigrationGuideTab } from './components/MigrationGuideTab';
import { PowerShellCmdTab } from './components/PowerShellCmdTab';
import { AiCapabilitiesTab } from './components/AiCapabilitiesTab';
import { AiAgentOrchestrator } from './components/AiAgentOrchestrator';
import { AiHermesAgentTab } from './components/AiHermesAgentTab';
import { AiSuperIntelligenceTab } from './components/AiSuperIntelligenceTab';
import { AppExportTab } from './components/AppExportTab';
import { MultimodalPipAssistantTab } from './components/MultimodalPipAssistantTab';
import { IphoneAssistantWidget } from './components/IphoneAssistantWidget';
import { VerticalFeatureNavigation } from './components/VerticalFeatureNavigation';
import { LayoutGrid, Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('super_intelligence');
  const [isVerticalNavOpen, setIsVerticalNavOpen] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState({ ok: false, checking: true, hasKey: false });

  const [playgroundConfig, setPlaygroundConfig] = useState<PlaygroundConfig>({
    task: 'text',
    model: 'gemini-3.7-flash',
    prompt: 'Viết một hàm Python ngắn gọn minh họa cách gọi SDK google-genai mới với mô hình Gemini 3.7 Flash.',
    systemInstruction: 'Bạn là chuyên gia lập trình kinh nghiệm, viết code Python ngắn gọn và tối ưu.',
    temperature: 0.7,
    topP: 0.95,
    responseMimeType: 'text/plain',
  });

  const checkHealth = async () => {
    setApiStatus((prev) => ({ ...prev, checking: true }));
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiStatus({
        ok: data?.status === 'ok',
        hasKey: Boolean(data?.hasApiKey ?? data?.apiKeyConfigured),
        checking: false,
      });
    } catch (err) {
      setApiStatus({ ok: false, hasKey: false, checking: false });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
        onRefreshHealth={checkHealth}
        onOpenVerticalMenu={() => setIsVerticalNavOpen(true)}
      />

      {/* Vertical Feature Navigation Drawer (Optimized for Mobile & Desktop) */}
      <VerticalFeatureNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isVerticalNavOpen}
        onClose={() => setIsVerticalNavOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'super_intelligence' && (
              <AiSuperIntelligenceTab
                onOpenCodeStudio={(code) => {
                  setPlaygroundConfig((prev) => ({ ...prev, prompt: code }));
                  setActiveTab('codestudio');
                }}
                onOpenAppExporter={() => setActiveTab('app_exporter')}
              />
            )}

            {activeTab === 'app_exporter' && (
              <AppExportTab />
            )}

            {activeTab === 'hermes' && (
              <AiHermesAgentTab />
            )}

            {activeTab === 'playground' && (
              <PlaygroundTab config={playgroundConfig} setConfig={setPlaygroundConfig} />
            )}

            {activeTab === 'pip_stream' && (
              <MultimodalPipAssistantTab />
            )}

            {activeTab === 'screen' && (
              <WindowsScreenTab />
            )}

            {activeTab === 'chatbot' && (
              <GeminiChatbotTab />
            )}

            {activeTab === 'codestudio' && (
              <CodeStudioTab config={playgroundConfig} />
            )}

            {activeTab === 'powershell' && (
              <PowerShellCmdTab />
            )}

            {activeTab === 'aifeatures' && (
              <AiCapabilitiesTab />
            )}

            {activeTab === 'orchestrator' && (
              <AiAgentOrchestrator />
            )}

            {activeTab === 'quickstart' && (
              <QuickstartTab />
            )}

            {activeTab === 'migration' && (
              <MigrationGuideTab />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Quick Action for Mobile/Desktop to open Vertical Feature List */}
      <button
        onClick={() => setIsVerticalNavOpen(true)}
        className="fixed bottom-6 left-6 z-30 flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-[#121214]/90 hover:bg-[#1a1a1f] backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-2xl shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer group"
        title="Mở Danh Mục Tính Năng Dọc"
      >
        <LayoutGrid className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Danh Sách Tính Năng Dọc</span>
        <span className="sm:hidden font-mono">11 Tính Năng</span>
      </button>

      {/* Floating iPhone Assistant Widget */}
      <IphoneAssistantWidget
        onSelectTab={setActiveTab}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        apiStatus={apiStatus}
        onRefreshHealth={checkHealth}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0f0f0f] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
            <span>
              Google AI Studio • Unified <code className="font-mono text-emerald-400">google-genai</code> (Python) & <code className="font-mono text-cyan-400">@google/genai</code> (TS) Developer Studio
            </span>
          </div>
          <span className="text-[11px] text-white/30 font-mono">
            Model default: gemini-3.7-flash • Hermes Sovereign Core
          </span>
        </div>
      </footer>
    </div>
  );
}
