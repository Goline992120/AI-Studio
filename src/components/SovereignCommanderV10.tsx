import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  Terminal,
  Activity,
  Zap,
  Users,
  Shield,
  Layers,
  Power,
  RotateCcw,
  Play,
  Settings,
  Flame,
} from 'lucide-react';
import { SovereignVirtualFileSystem } from './SovereignVirtualFileSystem';
import { SovereignChatbotBuilder } from './SovereignChatbotBuilder';
import { SovereignAiArmy } from './SovereignAiArmy';
import { AuGodCoreCanvas } from './AuGodCoreCanvas';
import { INITIAL_50_AI_ARMY, AiSoldier } from '../data/aiArmyData';
import { VirtualFile } from '../services/virtualFileSystem';

export const SovereignCommanderV10: React.FC = () => {
  const [commanderStatus, setCommanderStatus] = useState<'IDLE' | 'BUILDING APP' | 'CONTROLLING AIS'>('IDLE');
  const [aiArmy, setAiArmy] = useState<AiSoldier[]>(INITIAL_50_AI_ARMY);
  const [isEmergencyHalted, setIsEmergencyHalted] = useState(false);
  const [selectedVfsFile, setSelectedVfsFile] = useState<VirtualFile | null>(null);
  const [vfsRefreshKey, setVfsRefreshKey] = useState(0);

  // Sync Army with LocalStorage on boot
  useEffect(() => {
    const savedArmy = localStorage.getItem('sovereign_ai_army');
    if (savedArmy) {
      try {
        setAiArmy(JSON.parse(savedArmy));
      } catch (e) {}
    }
  }, []);

  const saveArmyState = (updatedArmy: AiSoldier[]) => {
    setAiArmy(updatedArmy);
    localStorage.setItem('sovereign_ai_army', JSON.stringify(updatedArmy));
  };

  const handleToggleSoldier = (id: string) => {
    const updated = aiArmy.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    saveArmyState(updated);
  };

  const handleEmergencyHalt = () => {
    setIsEmergencyHalted(true);
    setCommanderStatus('CONTROLLING AIS');
    const updated = aiArmy.map((s) => ({ ...s, status: 'HALTED' as const }));
    saveArmyState(updated);
  };

  const handleRestoreAll = () => {
    setIsEmergencyHalted(false);
    setCommanderStatus('IDLE');
    const updated = aiArmy.map((s) => ({ ...s, enabled: true, status: 'IDLE' as const }));
    saveArmyState(updated);
  };

  const handleArmyActionNotification = (soldierId: string, task: string) => {
    setCommanderStatus('BUILDING APP');
    const updated = aiArmy.map((s) =>
      s.id === soldierId
        ? { ...s, status: 'WORKING' as const, currentTask: task, tokensProcessed: s.tokensProcessed + 1200 }
        : s
    );
    saveArmyState(updated);

    setTimeout(() => {
      setCommanderStatus('IDLE');
      const reset = aiArmy.map((s) =>
        s.id === soldierId ? { ...s, status: 'IDLE' as const } : s
      );
      saveArmyState(reset);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER: ROOT COMMANDER BANNER */}
      {/* ------------------------------------------------------------- */}
      <header className="p-3 bg-black/90 border-b border-amber-500/40 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-[0_4px_30px_rgba(245,158,11,0.15)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_#f59e0b] border border-amber-200">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-400 font-mono tracking-wider">
                SOVEREIGN COMMANDER V10.0
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-black">
                HỆ THỐNG MẸ NẮM QUYỀN
              </span>
            </div>
            <p className="text-[11px] text-cyan-300/80 font-mono">
              ROOT: <strong className="text-amber-400 font-black">HÙNG SỮA</strong> • ĐIỀU KHIỂN 50 AI LÍNH • VIRTUAL FILE SYSTEM INDEXEDDB
            </p>
          </div>
        </div>

        {/* Global Live Status Badges */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">CORE STATUS:</span>
            <span
              className={`font-black ${
                commanderStatus === 'BUILDING APP'
                  ? 'text-cyan-400'
                  : commanderStatus === 'CONTROLLING AIS'
                  ? 'text-red-400'
                  : 'text-amber-400'
              }`}
            >
              [{commanderStatus}]
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-400/40 text-xs font-mono text-purple-300">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>50 AI LÍNH HOẠT ĐỘNG</span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 1. KHU TRUNG TÂM - AU GOD CORE COMMANDER (GIỮ NGUYÊN BẢN GỐC + 3 TRẠNG THÁI) */}
      {/* ------------------------------------------------------------- */}
      <section className="p-4 sm:p-6 bg-radial-gradient flex flex-col items-center justify-center relative overflow-hidden border-b border-amber-500/20">
        {/* Subtle Background Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        {/* Au God Core Holographic Ring Container */}
        <div className="relative w-[300px] sm:w-[360px] h-[300px] sm:h-[360px] flex items-center justify-center">
          {/* WebGL / Canvas 60FPS Rotation */}
          <AuGodCoreCanvas width={360} height={360} isProcessing={commanderStatus === 'BUILDING APP'} />

          {/* Central God Core Orb */}
          <div className="relative w-48 sm:w-56 h-48 sm:h-56 rounded-full bg-black/95 border-2 border-amber-400 flex flex-col items-center justify-center p-3 text-center shadow-[0_0_80px_rgba(245,158,11,0.8)] z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-1 flex items-center justify-center">
              <img
                src="/au-logo.png"
                alt="AU God Core"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/app_logo.jpg';
                }}
              />
            </div>

            <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-400 font-mono tracking-widest">
              AU GOD CORE
            </span>

            <div className="text-[10px] text-amber-300 font-mono font-bold tracking-wider mt-0.5">
              ROOT: HÙNG SỮA - COMMANDER MODE
            </div>

            {/* 3 Status Toggle / Display Indicator */}
            <div className="mt-2 flex items-center space-x-1">
              {(['IDLE', 'BUILDING APP', 'CONTROLLING AIS'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCommanderStatus(st)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                    commanderStatus === st
                      ? 'bg-amber-400 text-black shadow-[0_0_10px_#f59e0b] scale-105'
                      : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  [{st}]
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4-ZONE MAIN WORKSPACE LAYOUT (KHU TRÁI / KHU GIỮA / KHU PHẢI) */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1700px] w-full mx-auto">
        {/* ================= KHU 2: TRÁI - FILE SYSTEM RIÊNG BIỆT (INDEXEDDB) ================= */}
        <div className="lg:col-span-3 h-[680px]">
          <SovereignVirtualFileSystem
            key={vfsRefreshKey}
            onSelectFile={(file) => setSelectedVfsFile(file)}
            activeFilePath={selectedVfsFile?.path}
          />
        </div>

        {/* ================= KHU 3: GIỮA - CHATBOT FULL STACK BUILDER ================= */}
        <div className="lg:col-span-5 h-[680px]">
          <SovereignChatbotBuilder
            onNotifyArmyAction={handleArmyActionNotification}
            onRefreshVFS={() => setVfsRefreshKey((k) => k + 1)}
            selectedFile={selectedVfsFile}
            onSelectFile={setSelectedVfsFile}
          />
        </div>

        {/* ================= KHU 4: PHẢI - TRUNG TÂM ĐIỀU KHIỂN 50 AI LÍNH ================= */}
        <div className="lg:col-span-4 h-[680px]">
          <SovereignAiArmy
            army={aiArmy}
            onToggleSoldier={handleToggleSoldier}
            onEmergencyHalt={handleEmergencyHalt}
            onRestoreAll={handleRestoreAll}
            isEmergencyHalted={isEmergencyHalted}
          />
        </div>
      </main>
    </div>
  );
};
