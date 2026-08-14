import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor,
  Video,
  VideoOff,
  Camera,
  Play,
  Square,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Code2,
  AlertCircle,
  FileText,
  Upload,
  Zap,
  Terminal,
  Cpu,
  Eye,
  History,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface ScreenAnalysisLog {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  imageBase64: string;
  durationMs?: number;
  tokens?: number;
}

export const WindowsScreenTab: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(false);
  const [intervalSec, setIntervalSec] = useState<number>(5);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    text?: string;
    tokens?: number;
    durationMs?: number;
    error?: string;
  }>({});
  const [customPrompt, setCustomPrompt] = useState<string>(
    'Hãy phân tích màn hình Windows này: Đang mở ứng dụng gì, có lỗi hoặc thông báo nào cần chú ý không?'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisLogs, setAnalysisLogs] = useState<ScreenAnalysisLog[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Paste Event Handler (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              setCurrentImage(base64);
              setErrorMessage(null);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Generate realistic sample Windows screens for quick testing inside iframe preview
  const generateSampleWindowsScreen = (type: 'terminal' | 'ide' | 'browser' = 'terminal'): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background - Windows Desktop Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1280, 720);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1e1b4b');
    bgGradient.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1280, 720);

    // Windows 11 Taskbar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, 672, 1280, 48);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 672);
    ctx.lineTo(1280, 672);
    ctx.stroke();

    // Taskbar Windows Icon
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(600, 684, 11, 11);
    ctx.fillRect(613, 684, 11, 11);
    ctx.fillRect(600, 697, 11, 11);
    ctx.fillRect(613, 697, 11, 11);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '12px Segoe UI, sans-serif';
    ctx.fillText('12:00 PM  |  Windows 11 AI Studio', 1050, 700);

    // Window Outer Frame
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(80, 50, 1120, 580, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    // Window Title Bar
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.roundRect(80, 50, 1120, 40, [12, 12, 0, 0]);
    ctx.fill();

    // Window Controls
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(1170, 70, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(1150, 70, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(1130, 70, 6, 0, Math.PI * 2);
    ctx.fill();

    if (type === 'terminal') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px Consolas, monospace';
      ctx.fillText('Administrator: Windows PowerShell 7.4 (x64)', 110, 75);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(80, 90, 1120, 540);

      ctx.font = '15px Consolas, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('PS C:\\Users\\Admin\\Projects\\AI-Studio-Windows>', 110, 130);

      ctx.fillStyle = '#f8fafc';
      ctx.fillText(' npm run start:screen-capture', 520, 130);

      ctx.fillStyle = '#ef4444';
      ctx.fillText('[ERROR] Failed to start screen capture: getDisplayMedia is disabled in iframe.', 110, 170);

      ctx.fillStyle = '#fca5a5';
      ctx.fillText('At C:\\Users\\Admin\\Projects\\AI-Studio-Windows\\server.ts:42 line:12', 110, 200);
      ctx.fillText('+   navigator.mediaDevices.getDisplayMedia({ video: true });', 110, 230);
      ctx.fillText('    + CategoryInfo          : SecurityError (getDisplayMedia) [], PermissionDeniedException', 110, 270);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('SUGGESTED ACTION BY GEMINI VISION AI:', 110, 330);
      ctx.fillStyle = '#4ade80';
      ctx.fillText('1. Open application in a New Tab (Full Browser) to enable live screen sharing.', 110, 360);
      ctx.fillText('2. Or press Win + Shift + S to capture screenshot and press Ctrl + V to paste.', 110, 390);
      ctx.fillText('3. Gemini 3.6 Flash Vision AI will analyze error details instantly!', 110, 420);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('PS C:\\Users\\Admin\\Projects\\AI-Studio-Windows> _', 110, 480);
    } else if (type === 'ide') {
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 14px Consolas, monospace';
      ctx.fillText('VS Code - App.tsx [TypeScript] - AI Studio Project', 110, 75);

      ctx.fillStyle = '#18181b';
      ctx.fillRect(80, 90, 1120, 540);

      ctx.font = '15px Consolas, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('1  import React, { useState } from "react";', 110, 130);
      ctx.fillText('2  import { GoogleGenAI } from "@google/genai";', 110, 160);
      ctx.fillText('3  ', 110, 190);
      ctx.fillText('4  export const ScreenCapture = () => {', 110, 220);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('5    const stream = await navigator.mediaDevices.getDisplayMedia(); // Error TS2339', 110, 250);
      ctx.fillStyle = '#64748b';
      ctx.fillText('6    return <div>Screen Vision AI Studio</div>;', 110, 280);
      ctx.fillText('7  };', 110, 310);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('// Solution: Check if getDisplayMedia is supported or open app in a new tab.', 110, 370);
    } else {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px Consolas, monospace';
      ctx.fillText('Google Chrome - AI Studio API Monitor - 429 Rate Limit', 110, 75);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(80, 90, 1120, 540);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Segoe UI, sans-serif';
      ctx.fillText('HTTP 429 Too Many Requests', 110, 160);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px Segoe UI, sans-serif';
      ctx.fillText('API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash', 110, 210);
      ctx.fillText('Error Message: Resource has been exhausted (rate limit reached).', 110, 250);
    }

    return canvas.toDataURL('image/png');
  };

  const handleUseSampleScreen = (type: 'terminal' | 'ide' | 'browser' = 'terminal') => {
    const sampleImg = generateSampleWindowsScreen(type);
    setCurrentImage(sampleImg);
    setErrorMessage(null);
    setTimeout(() => {
      captureAndAnalyzeFrame('Hãy phân tích hình ảnh lỗi trên màn hình Windows mẫu này và đề xuất giải pháp.');
    }, 300);
  };

  // Handle Start Screen Share (Live Stream)
  const handleStartScreenShare = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
        throw new Error('Trình duyệt hoặc khung nhúng iframe hiện tại không có quyền truy cập API getDisplayMedia.');
      }

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setIsStreaming(true);

      mediaStream.getVideoTracks()[0].onended = () => {
        handleStopScreenShare();
      };

      setTimeout(() => {
        captureAndAnalyzeFrame('Hãy phân tích toàn bộ màn hình Windows vừa chia sẻ.');
      }, 800);
    } catch (err: any) {
      console.warn('Screen capture note:', err?.message || err);
      const errName = err?.name || '';
      const errStr = String(err?.message || err).toLowerCase();

      if (errName === 'NotAllowedError' && (errStr.includes('permission denied') || errStr.includes('denied') || errStr.includes('user'))) {
        setErrorMessage(
          'Bạn đã hủy chọn màn hình chia sẻ. Bấm "Chia Sẻ Màn Hình Live" chọn lại, hoặc bấm "Mở Tab Mới" để chia sẻ toàn màn hình Windows.'
        );
      } else {
        setErrorMessage(
          'Do chính sách bảo mật iframe preview, trình duyệt chặn chia sẻ màn hình trực tiếp ở khung nhúng này. Bạn có 3 cách xử lý nhanh bên dưới:'
        );
      }
    }
  };

  // Handle Stop Screen Share
  const handleStopScreenShare = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setAutoAnalyze(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Capture Frame from Video or Canvas
  const captureFrameBase64 = (): string | null => {
    if (isStreaming && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) return null;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png', 0.85);
        setCurrentImage(dataUrl);
        return dataUrl;
      }
    } else if (currentImage) {
      return currentImage;
    }
    return null;
  };

  // Core Analysis Function using Gemini 3.6 Flash
  const captureAndAnalyzeFrame = async (promptToUse?: string) => {
    const promptText = promptToUse || customPrompt;
    const base64Image = captureFrameBase64();

    if (!base64Image) {
      setErrorMessage('Không tìm thấy hình ảnh màn hình. Vui lòng bật Chia Sẻ Live hoặc Dán ảnh (Ctrl + V).');
      return;
    }

    setIsLoading(true);
    setAnalysisResult({ error: undefined });
    const startTime = performance.now();

    try {
      const response = await fetch('/api/gemini/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          imageBase64: base64Image,
          model: 'gemini-2.5-flash',
          systemInstruction:
            'Bạn là Trợ lý AI quan sát màn hình Windows trực tiếp qua Gemini 2.5 Flash. Phân tích chi tiết giao diện, phát hiện ứng dụng, đọc chữ OCR, chẩn đoán lỗi compiler/terminal và gợi ý câu lệnh PowerShell/CMD chính xác.',
        }),
      });

      const data = await response.json();
      const durationMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi gọi Gemini Vision API');
      }

      const resText = data.text || 'Không có kết quả phân tích.';

      setAnalysisResult({
        text: resText,
        tokens: data.usageMetadata?.totalTokenCount,
        durationMs,
      });

      // Add to logs history
      const newLog: ScreenAnalysisLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        prompt: promptText,
        response: resText,
        imageBase64: base64Image,
        durationMs,
        tokens: data.usageMetadata?.totalTokenCount,
      };

      setAnalysisLogs((prev) => [newLog, ...prev.slice(0, 15)]); // keep last 15 logs
    } catch (err: any) {
      console.error('Screen vision error:', err);
      setAnalysisResult({
        error: err?.message || 'Không thể kết nối dịch vụ Gemini Vision',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Auto Analyze Interval Loop
  useEffect(() => {
    if (autoAnalyze && isStreaming) {
      timerRef.current = setInterval(() => {
        captureAndAnalyzeFrame('Phân tích cập nhật màn hình mới nhất: Kiểm tra sự thay đổi giao diện, lỗi mới xuất hiện.');
      }, intervalSec * 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoAnalyze, isStreaming, intervalSec]);

  // Image Upload File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentImage(event.target?.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_PROMPTS = [
    {
      label: '🖥️ Phân Tích Màn Hình Tổng Quan',
      prompt: 'Hãy phân tích tổng quan màn hình Windows này: Nhận diện các ứng dụng đang chạy, cửa sổ đang mở, trạng thái hệ thống và hoạt động chính.',
    },
    {
      label: '🔍 Đọc Chữ OCR & Mã Nguồn',
      prompt: 'Hãy đọc toàn bộ văn bản, dòng lệnh terminal hoặc mã nguồn đang hiển thị rõ trên màn hình và trình bày lại dạng văn bản cấu trúc.',
    },
    {
      label: '🚨 Chẩn Đoán Lỗi Terminal / IDE',
      prompt: 'Kiểm tra xem có thông báo lỗi, exception, stack trace hoặc lỗi biên dịch compiler nào trên màn hình không. Phân tích nguyên nhân và giải pháp.',
    },
    {
      label: '⚡ Gợi Ý Câu Lệnh PowerShell / CMD',
      prompt: 'Dựa trên màn hình hiện tại, hãy đề xuất các câu lệnh PowerShell hoặc CMD chuẩn xác để giải quyết vấn đề hoặc thực hiện bước tiếp theo.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-blue-950/50 to-indigo-950/60 border border-cyan-500/30 shadow-xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>Real-time Vision AI Studio</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gemini 3.6 Flash Multimodal
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Monitor className="w-7 h-7 text-cyan-400" />
            <span>Quan Sát & Phân Tích Màn Hình Windows Live</span>
          </h1>

          <p className="text-xs text-white/70 max-w-2xl mt-1 leading-relaxed">
            Truyền phát trực tiếp màn hình máy tính Windows của bạn hoặc dán ảnh chụp màn hình (<kbd className="px-1 bg-white/10 rounded font-mono">Win + Shift + S</kbd> rồi <kbd className="px-1 bg-white/10 rounded font-mono">Ctrl + V</kbd>) để Gemini 3.6 Flash chẩn đoán lỗi, đọc OCR và đề xuất hướng xử lý.
          </p>
        </div>

        {/* Action Controls Header */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {!isStreaming ? (
            <button
              onClick={handleStartScreenShare}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg hover:brightness-110"
            >
              <Video className="w-4 h-4 text-black" />
              <span>Chia Sẻ Màn Hình Live</span>
            </button>
          ) : (
            <button
              onClick={handleStopScreenShare}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer hover:bg-red-500/30"
            >
              <VideoOff className="w-4 h-4 text-red-400" />
              <span>Dừng Chia Sẻ Live</span>
            </button>
          )}

          <a
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            title="Mở tab mới nếu iframe bị chặn quyền Screen Capture"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mở Tab Mới</span>
          </a>
        </div>
      </div>

      {/* Error / Notice Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs shadow-lg space-y-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="font-bold text-amber-300">Thông báo về Quyền Chia Sẻ Màn Hình (iframe Security):</div>
              <p className="leading-relaxed text-amber-200/90">{errorMessage}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/20 pl-8">
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-black" />
              <span>1. Mở App ở Tab Mới (Full Share Screen)</span>
            </a>

            <button
              onClick={() => handleUseSampleScreen('terminal')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>2. Thử Mẫu Màn Hình Lỗi Terminal</span>
            </button>

            <button
              onClick={() => handleUseSampleScreen('ide')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>3. Thử Mẫu Code IDE TS</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Screen View / Stream & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Stream & Capture Display Box */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-white/20'
                  }`}
                />
                <span className="text-xs font-bold text-white">
                  {isStreaming ? 'Luồng Màn Hình Windows Trực Tiếp' : 'Ảnh Chụp Màn Hình Hiện Tại'}
                </span>
              </div>

              {/* Auto Analyze Controls */}
              {isStreaming && (
                <div className="flex items-center space-x-3 text-xs bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                  <label className="flex items-center space-x-1.5 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoAnalyze}
                      onChange={(e) => setAutoAnalyze(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span className="font-semibold text-[11px]">Tự động phân tích</span>
                  </label>

                  {autoAnalyze && (
                    <select
                      value={intervalSec}
                      onChange={(e) => setIntervalSec(Number(e.target.value))}
                      className="bg-black text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 focus:outline-none"
                    >
                      <option value={3}>Mỗi 3 giây</option>
                      <option value={5}>Mỗi 5 giây</option>
                      <option value={10}>Mỗi 10 giây</option>
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* Display Canvas / Video Container */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group">
              {/* Hidden HTML Video and Canvas elements for capture */}
              <video ref={videoRef} className={`w-full h-full object-contain ${!isStreaming ? 'hidden' : ''}`} muted />
              <canvas ref={canvasRef} className="hidden" />

              {!isStreaming && currentImage && (
                <img src={currentImage} alt="Screen capture" className="w-full h-full object-contain" />
              )}

              {!isStreaming && !currentImage && (
                <div className="p-6 text-center space-y-3">
                  <Monitor className="w-12 h-12 text-white/20 mx-auto" />
                  <div className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                    Nhấn nút <strong className="text-cyan-300">Chia Sẻ Màn Hình Live</strong> phía trên hoặc sử dụng phím tắt{' '}
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-cyan-200">Win + Shift + S</kbd> rồi dán (<kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-cyan-200">Ctrl + V</kbd>) ảnh vào đây.
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <label className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tải ảnh từ máy</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                      onClick={() => handleUseSampleScreen('terminal')}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mẫu Màn Hình Lỗi Terminal</span>
                    </button>

                    <button
                      onClick={() => handleUseSampleScreen('ide')}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Mẫu Code IDE</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Floating Trigger Manual Capture Button */}
              <button
                onClick={() => captureAndAnalyzeFrame()}
                disabled={isLoading}
                className="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-xl hover:brightness-110 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-black" />
                <span>Chụp & Phân Tích Ngay</span>
              </button>
            </div>

            {/* Quick Presets Prompt Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/60 block">
                Mẫu Yêu Cầu Phân Tích Nhanh (Preset Prompts):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomPrompt(preset.prompt);
                      captureAndAnalyzeFrame(preset.prompt);
                    }}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-black/40 hover:bg-white/5 border border-white/10 text-left text-xs transition-all cursor-pointer flex items-center space-x-2 group hover:border-cyan-500/40"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-white/80 font-medium truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Input Box */}
            <div className="pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-1">
                Yêu Cầu Tùy Chỉnh Cho Gemini 3.6 Flash:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Đọc cho tôi đoạn lỗi compiler màu đỏ ở góc dưới bên phải..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => captureAndAnalyzeFrame()}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-extrabold text-xs flex items-center space-x-1.5 cursor-pointer shadow-md hover:brightness-110 disabled:opacity-40 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Phân Tích</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Gemini Vision Analysis Feed & History (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Current Live Response Box */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 shadow-lg space-y-4 min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Kết Quả Phân Tích Gemini 3.6 Flash
                  </h3>
                </div>

                {analysisResult.durationMs && (
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {analysisResult.durationMs}ms • {analysisResult.tokens || 0} tokens
                  </span>
                )}
              </div>

              {/* Loading State with Laser Scan animation */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="p-8 text-center space-y-4 bg-gradient-to-b from-cyan-950/40 to-black/60 rounded-xl border border-cyan-500/30 my-4 relative overflow-hidden"
                  >
                    {/* Animated Scanning Beam */}
                    <motion.div
                      animate={{ y: [-40, 120, -40] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
                    />

                    <div className="relative z-10 flex flex-col items-center space-y-3">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full shadow-lg shadow-cyan-500/30"
                        />
                        <Sparkles className="w-5 h-5 text-cyan-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>

                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs text-cyan-300 font-mono font-bold tracking-wide"
                      >
                        ⚡ Gemini Vision AI đang quét và phân tích điểm ảnh màn hình...
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              {analysisResult.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-mono my-2">
                  ⚠️ {analysisResult.error}
                </div>
              )}

              {/* Analysis Result Display */}
              {analysisResult.text && !isLoading && (
                <div className="space-y-3">
                  {analysisResult.text.includes('```') ? (
                    <div className="space-y-3">
                      {analysisResult.text.split(/```/).map((part, index) => {
                        if (index % 2 === 1) {
                          const firstLineEnd = part.indexOf('\n');
                          const lang = firstLineEnd !== -1 ? part.substring(0, firstLineEnd).trim() : 'powershell';
                          const code = firstLineEnd !== -1 ? part.substring(firstLineEnd + 1) : part;
                          return <CodeBlock key={index} code={code} language={lang || 'powershell'} title="Câu lệnh gợi ý" />;
                        }
                        return (
                          <div key={index} className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap font-sans">
                            {part}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-stone-200 leading-relaxed whitespace-pre-wrap font-sans max-h-[380px] overflow-y-auto">
                      {analysisResult.text}
                    </div>
                  )}
                </div>
              )}

              {!analysisResult.text && !isLoading && !analysisResult.error && (
                <div className="p-10 text-center text-white/40 space-y-2">
                  <Eye className="w-8 h-8 mx-auto text-white/20" />
                  <p className="text-xs">Kết quả quan sát từ Gemini 3.6 Flash sẽ xuất hiện tại đây.</p>
                  <p className="text-[10px] text-white/30 font-mono">
                    Hỗ trợ đọc lỗi IDE, tự động gợi ý PowerShell & chẩn đoán giao diện.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Status Badge */}
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-[10px] text-white/50 font-mono">
              <span>SDK: google-genai (2026)</span>
              <span className="text-cyan-300">gemini-3.6-flash (Vision)</span>
            </div>
          </div>

          {/* Screen Analysis Logs History */}
          {analysisLogs.length > 0 && (
            <div className="bg-[#121212] rounded-2xl border border-white/10 p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Lịch Sử Khung Hình Đã Phân Tích ({analysisLogs.length})
                  </h4>
                </div>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {analysisLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                      <span>{log.timestamp}</span>
                      <span className="text-cyan-300">{log.durationMs}ms</span>
                    </div>
                    <div className="text-[11px] font-semibold text-cyan-200 truncate">{log.prompt}</div>
                    <div className="text-[11px] text-stone-300 line-clamp-2 leading-tight">{log.response}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
