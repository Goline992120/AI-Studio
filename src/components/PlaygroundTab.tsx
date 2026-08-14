import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlaygroundConfig, GenerationResult } from '../types';
import { GEMINI_MODELS } from '../data/constants';
import { Play, Sparkles, Image as ImageIcon, Sliders, Layers, Clock, Zap, FileJson, Download, FolderArchive, AlertTriangle, RefreshCw } from 'lucide-react';
import { downloadPlaygroundZip } from '../utils/exportZip';

interface PlaygroundTabProps {
  config: PlaygroundConfig;
  setConfig: React.Dispatch<React.SetStateAction<PlaygroundConfig>>;
}

export const PlaygroundTab: React.FC<PlaygroundTabProps> = ({ config, setConfig }) => {
  const [result, setResult] = useState<GenerationResult>({});
  const [streamingText, setStreamingText] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      await downloadPlaygroundZip(config);
    } catch (err) {
      console.error('Error exporting ZIP project:', err);
      alert('Không thể tạo file ZIP. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  const PRESET_PROMPTS = [
    {
      label: '⚡ Gemini 3.7 Flash Siêu Tốc',
      task: 'text' as const,
      model: 'gemini-3.7-flash',
      prompt: 'Giải thích máy tính lượng tử cho học sinh trung học trong 3 đoạn văn ngắn gọn, kèm các ý chính.',
      systemInstruction: 'Bạn là nhà truyền thông khoa học truyền cảm hứng. Giải thích trực quan, dễ hiểu.',
      temperature: 0.7,
      topP: 0.95,
      responseMimeType: 'text/plain' as const,
      thinkingBudget: 0,
    },
    {
      label: '🧠 Hybrid Thinking (Budget 4096)',
      task: 'text' as const,
      model: 'gemini-3.7-flash',
      prompt: 'Thiết kế thuật toán cân bằng tải phân tán chống nghẽn mạng chịu tải 10 triệu requests/giây. Phân tích độ phức tạp thời gian và không gian.',
      systemInstruction: 'Bạn là chuyên gia kiến trúc hệ thống phân tán cấp cao.',
      temperature: 0.4,
      topP: 0.95,
      responseMimeType: 'text/plain' as const,
      thinkingBudget: 4096,
    },
    {
      label: '📊 Xuất Dữ Liệu Cấu Trúc JSON',
      task: 'structured' as const,
      model: 'gemini-3.7-flash',
      prompt: 'Liệt kê top 3 Python web framework hàng đầu năm 2026 kèm năm ra mắt, tính năng chính và đánh giá sao GitHub.',
      systemInstruction: 'Trả về chuỗi JSON hợp lệ không kèm câu từ thừa.',
      temperature: 0.2,
      topP: 0.95,
      responseMimeType: 'application/json' as const,
      thinkingBudget: 0,
    },
    {
      label: '🎨 Tạo Ảnh Neon Cyberpunk',
      task: 'image' as const,
      model: 'gemini-3.1-flash-lite-image',
      prompt: 'Phòng thí nghiệm AI hiện đại phong cách cyberpunk huyền ảo, ánh đèn neon xanh lam sắc nét, chất lượng 8k photorealistic.',
      systemInstruction: '',
      temperature: 1.0,
      topP: 0.95,
      responseMimeType: 'text/plain' as const,
    },
  ];

  const handleRun = async () => {
    setResult({ loading: true });
    setStreamingText('');
    const startTime = performance.now();

    try {
      if (config.task === 'image') {
        const res = await fetch('/api/gemini/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: config.prompt,
            model: config.model,
            aspectRatio: config.aspectRatio || '1:1',
          }),
        });
        const data = await res.json();
        const durationMs = Math.round(performance.now() - startTime);

        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate image');
        }

        setResult({
          imageUrl: data.imageUrl,
          text: data.text,
          durationMs,
          loading: false,
        });
      } else if (config.task === 'stream') {
        const res = await fetch('/api/gemini/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: config.prompt,
            model: config.model,
            systemInstruction: config.systemInstruction,
            temperature: config.temperature,
            topP: config.topP,
            thinkingBudget: config.thinkingBudget,
            thinkingLevel: config.thinkingLevel,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error('Streaming failed');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setStreamingText(accumulated);
                }
              } catch (e) {
                // ignore invalid json chunks
              }
            }
          }
        }

        const durationMs = Math.round(performance.now() - startTime);
        setResult({
          text: accumulated,
          durationMs,
          loading: false,
        });
      } else {
        // Standard text or structured JSON
        const res = await fetch('/api/gemini/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: config.prompt,
            model: config.model,
            systemInstruction: config.systemInstruction,
            temperature: config.temperature,
            topP: config.topP,
            responseMimeType: config.responseMimeType,
            thinkingLevel: config.thinkingLevel,
            thinkingBudget: config.thinkingBudget,
          }),
        });
        const data = await res.json();
        const durationMs = Math.round(performance.now() - startTime);

        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate content');
        }

        setResult({
          text: data.text,
          usageMetadata: data.usageMetadata,
          durationMs,
          loading: false,
          isSelfHealed: data.isSelfHealed,
          modelUsed: data.modelUsed,
        });
      }
    } catch (err: any) {
      setResult({
        error: err?.message || 'An error occurred during request execution',
        loading: false,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Configuration Panel */}
      <div className="lg:col-span-5 bg-[#0f0f0f] rounded-2xl p-5 border border-white/10 shadow-lg space-y-5">
        
        {/* Presets */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
            Mẫu Prompt Nhanh
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setConfig((prev) => ({
                    ...prev,
                    task: preset.task,
                    model: preset.model,
                    prompt: preset.prompt,
                    systemInstruction: preset.systemInstruction,
                    temperature: preset.temperature,
                    topP: preset.topP,
                    responseMimeType: preset.responseMimeType,
                  }));
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-[#141414] hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Selection */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center justify-between">
            <span>Chế Độ Chức Năng</span>
            <span className="text-[11px] text-emerald-400 font-mono">
              {config.task.toUpperCase()}
            </span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#141414] rounded-xl text-xs border border-white/5">
            <button
              onClick={() => setConfig((p) => ({ ...p, task: 'text', model: 'gemini-3.6-flash' }))}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                config.task === 'text' ? 'bg-white/10 text-emerald-400 font-semibold shadow-xs border border-white/10' : 'text-white/60 hover:text-white'
              }`}
            >
              Tiêu Chuẩn
            </button>
            <button
              onClick={() => setConfig((p) => ({ ...p, task: 'stream', model: 'gemini-3.6-flash' }))}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                config.task === 'stream' ? 'bg-white/10 text-emerald-400 font-semibold shadow-xs border border-white/10' : 'text-white/60 hover:text-white'
              }`}
            >
              Streaming
            </button>
            <button
              onClick={() => setConfig((p) => ({ ...p, task: 'structured', responseMimeType: 'application/json' }))}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                config.task === 'structured' ? 'bg-white/10 text-emerald-400 font-semibold shadow-xs border border-white/10' : 'text-white/60 hover:text-white'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setConfig((p) => ({ ...p, task: 'image', model: 'gemini-3.1-flash-lite-image' }))}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                config.task === 'image' ? 'bg-white/10 text-emerald-400 font-semibold shadow-xs border border-white/10' : 'text-white/60 hover:text-white'
              }`}
            >
              Tạo Ảnh
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
            Mô Hình Gemini
          </label>
          <select
            value={config.model}
            onChange={(e) => setConfig((p) => ({ ...p, model: e.target.value }))}
            className="w-full text-xs font-mono font-medium px-3 py-2 rounded-xl border border-white/10 bg-[#141414] text-white focus:outline-none focus:border-emerald-500"
          >
            {GEMINI_MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#141414] text-white">
                {m.name} ({m.category.toUpperCase()})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-white/40 mt-1 font-mono">
            {GEMINI_MODELS.find((m) => m.id === config.model)?.recommendedFor}
          </p>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
            Nội Dung Prompt
          </label>
          <textarea
            rows={4}
            value={config.prompt}
            onChange={(e) => setConfig((p) => ({ ...p, prompt: e.target.value }))}
            placeholder="Nhập yêu cầu (prompt) thử nghiệm Gemini API..."
            className="w-full text-xs font-mono p-3 rounded-xl border border-white/10 bg-[#141414] text-[#27c93f] placeholder-white/20 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* System Instruction (Non-image) */}
        {config.task !== 'image' && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
              System Instruction (Chỉ dẫn hệ thống)
            </label>
            <input
              type="text"
              value={config.systemInstruction}
              onChange={(e) => setConfig((p) => ({ ...p, systemInstruction: e.target.value }))}
              placeholder="VD: Bạn là chuyên gia tư vấn lập trình Python kinh nghiệm"
              className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-white/10 bg-[#141414] text-white placeholder-white/20 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Temperature & Top-P Controls */}
        {config.task !== 'image' && (
          <div className="grid grid-cols-2 gap-4 bg-[#141414] p-3 rounded-xl border border-white/5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-white/70">Temperature (Sáng tạo)</span>
                <span className="font-mono text-emerald-400">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig((p) => ({ ...p, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-400 bg-white/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-white/70">Top P</span>
                <span className="font-mono text-emerald-400">{config.topP}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.topP}
                onChange={(e) => setConfig((p) => ({ ...p, topP: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-400 bg-white/10"
              />
            </div>
          </div>
        )}

        {/* Gemini 3.7 Flash Hybrid Reasoning & Thinking Budget */}
        {config.task !== 'image' && (
          <div className="bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/20 p-3.5 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>🧠</span>
                <span>Hybrid Reasoning (Thinking Budget)</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {config.thinkingBudget === 0 ? 'Tắt (0 tok)' : config.thinkingBudget ? `${config.thinkingBudget} tokens` : 'Tự Động (Auto)'}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, thinkingBudget: 0 }))}
                className={`py-1 rounded-lg font-mono border transition-all ${
                  config.thinkingBudget === 0
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                    : 'bg-[#121214] text-white/70 hover:text-white border-white/10'
                }`}
                title="Tắt reasoning để đạt độ trễ phản hồi nhanh nhất (<500ms)"
              >
                Tắt (0)
              </button>
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, thinkingBudget: undefined }))}
                className={`py-1 rounded-lg font-mono border transition-all ${
                  config.thinkingBudget === undefined
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                    : 'bg-[#121214] text-white/70 hover:text-white border-white/10'
                }`}
                title="Để mô hình tự động quyết định lượng tư duy theo độ phức tạp"
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, thinkingBudget: 2048 }))}
                className={`py-1 rounded-lg font-mono border transition-all ${
                  config.thinkingBudget === 2048
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                    : 'bg-[#121214] text-white/70 hover:text-white border-white/10'
                }`}
                title="2048 tokens ngân sách tư duy trung bình"
              >
                2048
              </button>
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, thinkingBudget: 4096 }))}
                className={`py-1 rounded-lg font-mono border transition-all ${
                  config.thinkingBudget === 4096
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                    : 'bg-[#121214] text-white/70 hover:text-white border-white/10'
                }`}
                title="4096 tokens ngân sách tư duy sâu cho bài toán khó"
              >
                4096
              </button>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Tính năng độc quyền trên <strong>Gemini 3.7 Flash</strong>: Tùy biến ngân sách suy luận từ 0 (siêu tốc) đến 4096+ tokens (lập trình, giải thuật khó).
            </p>
          </div>
        )}

        {/* Aspect Ratio for Image generation */}
        {config.task === 'image' && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
              Tỉ Lệ Khung Hình (Aspect Ratio)
            </label>
            <div className="flex gap-2">
              {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setConfig((p) => ({ ...p, aspectRatio: ratio }))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border ${
                    config.aspectRatio === ratio
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'border-white/10 bg-[#141414] text-white/70 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleRun}
            disabled={result.loading || !config.prompt.trim()}
            className="w-full py-3 px-4 rounded-xl bg-[#27c93f] hover:bg-[#22b337] disabled:bg-white/10 disabled:text-white/30 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            {result.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Đang Xử Lý Yêu Cầu API...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Gửi Yêu Cầu Gemini API</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExporting || !config.prompt.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-slate-900/80 hover:from-cyan-900/60 hover:to-slate-800/80 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 disabled:opacity-40 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            title="Xuất dự án mã nguồn TypeScript & Python đầy đủ chứa cấu hình hiện tại thành file .ZIP"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Đang Nén File Dự Án .ZIP...</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-4 h-4 text-cyan-400" />
                <span>Tải Mã Nguồn Dự Án (.ZIP)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-7 bg-[#0f0f0f] rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Kết Quả Phản Hồi Từ API</h2>
              {result.isSelfHealed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center space-x-1">
                  <span>⚡ Hermes Self-Healed</span>
                </span>
              )}
            </div>

            {result.durationMs && (
              <div className="flex items-center space-x-3 text-xs text-white/50 font-mono">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{result.durationMs}ms</span>
                </span>
                {result.usageMetadata?.totalTokenCount && (
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{result.usageMetadata.totalTokenCount} tokens</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Response Container */}
          <AnimatePresence mode="wait">
            {result.loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="min-h-[320px] flex flex-col items-center justify-center p-6 rounded-xl bg-black/40 border border-emerald-500/20 relative overflow-hidden space-y-4"
              >
                {/* Background Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.35, 0.15],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"
                ></motion.div>

                {/* Animated Spinner & Badges */}
                <div className="relative z-10 flex flex-col items-center space-y-3">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full shadow-lg shadow-emerald-500/20"
                    />
                    <Sparkles className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>

                  <motion.p
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs text-emerald-300 font-mono font-semibold"
                  >
                    Đang kết nối &amp; xử lý qua Gemini Express Server...
                  </motion.p>
                </div>

                {/* Skeleton UI Preview */}
                <div className="w-full max-w-md space-y-2 relative z-10 pt-2 opacity-60">
                  <div className="h-3 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-white/10 rounded-full w-full animate-pulse delay-75"></div>
                  <div className="h-3 bg-white/10 rounded-full w-5/6 animate-pulse delay-150"></div>
                </div>
              </motion.div>
            ) : result.error ? (
            <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
              result.error.includes('429') || result.error.includes('Quota Exceeded')
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {result.error.includes('429') || result.error.includes('Quota Exceeded')
                      ? 'Thông Báo Giới Hạn Quota (429 Rate Limit)'
                      : 'Lỗi Thực Thi Yêu Cầu'}
                  </span>
                </span>
                <button
                  onClick={handleRun}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/30 flex items-center space-x-1 text-[11px] cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Thử Lại Ngay</span>
                </button>
              </div>
              <p className="font-mono leading-relaxed">{result.error}</p>
            </div>
          ) : config.task === 'image' && result.imageUrl ? (
            <div className="flex flex-col items-center space-y-3">
              <img
                src={result.imageUrl}
                alt="Generated Gemini output"
                className="rounded-xl border border-white/10 shadow-xl max-h-[400px] object-contain"
              />
              <p className="text-xs text-white/50 font-mono">Đã tạo thành công với {config.model}</p>
            </div>
          ) : config.task === 'stream' && streamingText ? (
            <div className="font-mono text-emerald-300 text-xs leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] p-4 rounded-xl border border-white/10 min-h-[300px] max-h-[500px] overflow-y-auto">
              {streamingText}
            </div>
          ) : result.text ? (
            <div className="font-mono text-emerald-300 text-xs leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] p-4 rounded-xl border border-white/10 min-h-[300px] max-h-[500px] overflow-y-auto">
              {result.text}
            </div>
          ) : (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-white/30 space-y-2">
              <Sparkles className="w-8 h-8 text-white/20" />
              <p className="text-xs text-white/40 font-mono">Nhấn "Gửi Yêu Cầu Gemini API" để kiểm tra trực tiếp.</p>
            </div>
          )}
          </AnimatePresence>
        </div>

        {/* Bottom Metadata Summary */}
        {result.usageMetadata && (
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span>Prompt Tokens: {result.usageMetadata.promptTokenCount || 0}</span>
            <span>Output Tokens: {result.usageMetadata.candidatesTokenCount || 0}</span>
            <span>Tổng số Token: {result.usageMetadata.totalTokenCount || 0}</span>
          </div>
        )}

      </div>

    </div>
  );
};
