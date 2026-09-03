import React, { useState } from 'react';
import {
  Users,
  Shield,
  Zap,
  Activity,
  Power,
  AlertOctagon,
  Search,
  CheckCircle2,
  Lock,
  Flame,
  Key,
  Save,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { AiSoldier } from '../data/aiArmyData';

interface SovereignAiArmyProps {
  army: AiSoldier[];
  onToggleSoldier: (id: string) => void;
  onEmergencyHalt: () => void;
  onRestoreAll: () => void;
  isEmergencyHalted: boolean;
}

export const SovereignAiArmy: React.FC<SovereignAiArmyProps> = ({
  army,
  onToggleSoldier,
  onEmergencyHalt,
  onRestoreAll,
  isEmergencyHalted,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('SOVEREIGN_GEMINI_KEY') || '');
  const [openAiKey, setOpenAiKey] = useState(localStorage.getItem('SOVEREIGN_OPENAI_KEY') || '');
  const [anthropicKey, setAnthropicKey] = useState(localStorage.getItem('SOVEREIGN_ANTHROPIC_KEY') || '');
  const [savedKeyMsg, setSavedKeyMsg] = useState(false);

  const categories = ['ALL', 'LLM', 'Code', 'Design', 'Video', 'Voice', 'Search'];

  const filteredArmy = army.filter((soldier) => {
    const matchCategory = filterCategory === 'ALL' || soldier.category === filterCategory;
    const matchQuery =
      soldier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soldier.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soldier.currentTask.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const activeCount = army.filter((s) => s.enabled && !isEmergencyHalted).length;

  const handleSaveKeys = () => {
    localStorage.setItem('SOVEREIGN_GEMINI_KEY', geminiKey);
    localStorage.setItem('SOVEREIGN_OPENAI_KEY', openAiKey);
    localStorage.setItem('SOVEREIGN_ANTHROPIC_KEY', anthropicKey);
    setSavedKeyMsg(true);
    setTimeout(() => {
      setSavedKeyMsg(false);
      setShowApiKeyModal(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 border border-purple-500/30 rounded-2xl overflow-hidden text-white font-mono text-xs shadow-[0_0_25px_rgba(168,85,247,0.15)]">
      {/* Top Header & Emergency Controls */}
      <div className="p-3 bg-black/70 border-b border-purple-500/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="font-black text-purple-300 tracking-wider">AI ARMY (50 ĐẶC VỤ LÍNH)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="px-2 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-400/40 text-purple-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Key className="w-3 h-3 text-amber-400" />
              <span>KEY VAULT</span>
            </button>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-bold">
              {isEmergencyHalted ? 'HALTED' : `${activeCount}/50 ACTIVE`}
            </span>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <div className="flex items-center space-x-2">
          {isEmergencyHalted ? (
            <button
              onClick={onRestoreAll}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-[11px] flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>KHÔI PHỤC HOẠT ĐỘNG TOÀN BỘ AI</span>
            </button>
          ) : (
            <button
              onClick={onEmergencyHalt}
              className="flex-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] transition animate-pulse"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>DỪNG KHẨN CẤP TOÀN BỘ (EMERGENCY HALT)</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm lính AI (GPT-4o, Midjourney, Claude...)"
              className="w-full bg-black/80 border border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-white focus:outline-hidden focus:border-purple-400"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  filterCategory === cat
                    ? 'bg-purple-500 text-black shadow'
                    : 'bg-black/50 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Army Soldier List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredArmy.map((soldier) => {
          const isWorking = soldier.status === 'WORKING' && !isEmergencyHalted;
          const isHalted = isEmergencyHalted || !soldier.enabled;

          return (
            <div
              key={soldier.id}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                isHalted
                  ? 'bg-black/40 border-white/5 opacity-40'
                  : isWorking
                  ? 'bg-purple-950/30 border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  : 'bg-black/60 border-white/10 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: isHalted ? '#333' : `${soldier.color}20`,
                    color: isHalted ? '#777' : soldier.color,
                    border: `1px solid ${isHalted ? '#444' : soldier.color}`,
                  }}
                >
                  {soldier.category[0]}
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white text-[11px] truncate">{soldier.name}</span>
                    <span className="text-[9px] px-1 rounded bg-white/10 text-slate-400 font-mono">
                      {soldier.provider}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {isHalted ? 'ĐÃ TẮT' : soldier.currentTask}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {/* Status Indicator */}
                {!isHalted && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isWorking
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isWorking ? 'ĐANG LÀM' : 'RẢNH'}
                  </span>
                )}

                {/* Power Switch */}
                <button
                  onClick={() => onToggleSoldier(soldier.id)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition ${
                    soldier.enabled && !isEmergencyHalted
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30'
                  }`}
                  title={soldier.enabled ? 'Tắt AI này' : 'Bật AI này'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-black/80 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="text-purple-300">ROOT AUTHORITY: ENFORCED</span>
        <span className="text-amber-400 font-bold">SOVEREIGN V10.0</span>
      </div>

      {/* API Key Vault Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-purple-300 font-bold">
                <Key className="w-4 h-4 text-amber-400" />
                <span>COMMANDER API KEY VAULT (LOCAL ONLY)</span>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Tất cả API Key được lưu độc quyền trong LocalStorage của máy Commander. App Mẹ là thực thể duy nhất được phép gọi API, các app con tuyệt đối không thể can thiệp.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-cyan-300 font-bold block mb-1">GOOGLE GEMINI API KEY:</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-emerald-300 font-bold block mb-1">OPENAI API KEY (GPT-4o/Sora):</label>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-amber-300 font-bold block mb-1">ANTHROPIC API KEY (Claude 3.5):</label>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {savedKeyMsg && (
              <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-center font-bold text-[11px]">
                ✓ Đã lưu bảo mật vào LocalStorage thành công!
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveKeys}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center space-x-1 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Tất Cả Key</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
