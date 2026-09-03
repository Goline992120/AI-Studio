import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Terminal,
  Activity,
  Cpu,
  CheckCircle2,
  Radio,
  Play,
  RotateCcw,
  Zap,
  Code2,
  Layers,
  ArrowRight,
  Shield,
  Bot,
  Copy,
  Check,
  Languages,
  Sliders,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import '../utils/aiCore';

interface VoiceCommandLog {
  id: string;
  transcript: string;
  timestamp: string;
  status: 'listening' | 'processing' | 'executed' | 'error';
  reply?: string;
  toolResult?: any;
  latencyMs?: number;
}

interface VoiceInteractionTabProps {
  onNavigateTab?: (tabId: string) => void;
}

export const VoiceInteractionTab: React.FC<VoiceInteractionTabProps> = ({ onNavigateTab }) => {
  // Speech Recognition & TTS States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeakReply, setAutoSpeakReply] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<'vi-VN' | 'en-US'>('vi-VN');
  const [continuousMode, setContinuousMode] = useState<boolean>(false);
  const [hotwordEnabled, setHotwordEnabled] = useState<boolean>(false);
  const [lastWakeWord, setLastWakeWord] = useState<string>('');

  // AI Assistant Bridge State
  const [isBridgeReady, setIsBridgeReady] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<VoiceCommandLog[]>([]);
  const [activeLog, setActiveLog] = useState<VoiceCommandLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  // Audio wave visualizer levels
  const [audioLevels, setAudioLevels] = useState<number[]>([20, 45, 75, 90, 60, 85, 40, 70, 95, 55, 30, 80]);

  // Refs for Speech Recognition
  const recognitionRef = useRef<any>(null);
  const hotwordRecRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const waveIntervalRef = useRef<any>(null);

  // Initialize Window AI_Assistant bridge check
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AI_Assistant) {
      setIsBridgeReady(true);
    }
  }, []);

  // Animate audio wave visualizer during listening state
  useEffect(() => {
    if (isListening) {
      waveIntervalRef.current = setInterval(() => {
        setAudioLevels(
          Array.from({ length: 16 }, () => Math.floor(Math.random() * 75) + 25)
        );
      }, 90);
    } else {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setAudioLevels([15, 20, 25, 30, 25, 20, 15, 25, 35, 25, 15, 20, 25, 20, 15, 10]);
    }
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isListening]);

  // Speak AI Response using Web Speech API Synthesis
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Safe Speech Recognition Starter
  const startRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Trình duyệt của bạn không hỗ trợ Web Speech Recognition API. Hãy thử dùng Google Chrome hoặc Microsoft Edge!'
      );
      return;
    }

    // Stop existing instance safely
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = continuousMode;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setFinalTranscript(final);
          setInterimTranscript('');
          handleExecuteVoiceCommand(final);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('Speech Recognition Notice:', event.error);
        }
        if (!continuousMode) {
          isListeningRef.current = false;
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (!continuousMode) {
          isListeningRef.current = false;
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
    } catch (e: any) {
      isListeningRef.current = false;
      setIsListening(false);
      if (e?.name !== 'InvalidStateError' && !e?.message?.includes('already started')) {
        console.warn('Speech recognition start error:', e);
      }
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    }
    isListeningRef.current = false;
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening || isListeningRef.current) {
      stopRecognition();
    } else {
      setInterimTranscript('');
      startRecognition();
    }
  };

  // Hotword Wake-word background listener
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition || !hotwordEnabled) {
      if (hotwordRecRef.current) {
        try {
          hotwordRecRef.current.abort();
        } catch (_) {}
      }
      return;
    }

    try {
      const hotwordRec = new SpeechRecognition();
      hotwordRec.continuous = true;
      hotwordRec.interimResults = false;
      hotwordRec.lang = selectedLang;

      hotwordRec.onresult = (event: any) => {
        const lastIdx = event.results.length - 1;
        const text = event.results[lastIdx][0].transcript.toLowerCase();

        if (
          text.includes('trợ lý') ||
          text.includes('tro ly') ||
          text.includes('hey ai') ||
          text.includes('sovereign') ||
          text.includes('hermes')
        ) {
          setLastWakeWord(text);
          const reply = 'Chào bạn, Trợ Lý AI đã sẵn sàng thực thi lệnh!';
          speakText(reply);
          setTimeout(() => {
            if (!isListeningRef.current) {
              startRecognition();
            }
          }, 800);
        }
      };

      hotwordRec.onend = () => {
        if (hotwordEnabled) {
          setTimeout(() => {
            try {
              if (hotwordEnabled && hotwordRecRef.current) hotwordRec.start();
            } catch (_) {}
          }, 500);
        }
      };

      hotwordRec.start();
      hotwordRecRef.current = hotwordRec;
    } catch (e) {
      console.warn('Hotword listener error:', e);
    }

    return () => {
      if (hotwordRecRef.current) {
        try {
          hotwordRecRef.current.abort();
        } catch (_) {}
      }
    };
  }, [hotwordEnabled, selectedLang]);

  // Execute Command via window.AI_Assistant.execute Bridge
  const handleExecuteVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    const startTime = performance.now();
    const logId = 'cmd_' + Date.now();

    const newLog: VoiceCommandLog = {
      id: logId,
      transcript: command,
      timestamp: new Date().toLocaleTimeString(),
      status: 'processing',
    };

    setCommandHistory((prev) => [newLog, ...prev]);
    setActiveLog(newLog);

    // Intent dispatch for navigation
    const lowerCmd = command.toLowerCase();
    if (lowerCmd.includes('mở code') || lowerCmd.includes('code studio') || lowerCmd.includes('ide')) {
      if (onNavigateTab) onNavigateTab('codestudio');
    } else if (lowerCmd.includes('mở runway') || lowerCmd.includes('tạo video') || lowerCmd.includes('runway')) {
      if (onNavigateTab) onNavigateTab('runway');
    } else if (lowerCmd.includes('mở hermes') || lowerCmd.includes('agent hermes')) {
      if (onNavigateTab) onNavigateTab('hermes');
    } else if (lowerCmd.includes('mở siêu trí tuệ') || lowerCmd.includes('super intelligence')) {
      if (onNavigateTab) onNavigateTab('super_intelligence');
    }

    try {
      let bridgeResult: any = null;

      // 1. Call window.AI_Assistant.execute Bridge
      if (typeof window !== 'undefined' && window.AI_Assistant && typeof window.AI_Assistant.execute === 'function') {
        bridgeResult = await window.AI_Assistant.execute(command, {
          source: 'voice_interaction',
          language: selectedLang,
          timestamp: new Date().toISOString(),
        });
      }

      // 2. Fetch intelligent AI reasoning from backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: command,
          systemInstruction:
            'Bạn là Trợ Lý Giọng Nói AI (Voice Interaction Agent) trong Google AI Studio. Hãy trả lời ngắn gọn, chuẩn xác, tự nhiên dưới 3 câu và nêu rõ hành động đã thực thi qua window.AI_Assistant.',
        }),
      });

      let aiReply = '';
      if (response.ok) {
        const data = await response.json();
        aiReply = data?.reply || data?.text || 'Đã thực thi thành công lệnh giọng nói.';
      } else {
        aiReply = `Đã gửi lệnh "${command}" qua window.AI_Assistant Bridge và hoàn tất xử lý.`;
      }

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      const completedLog: VoiceCommandLog = {
        ...newLog,
        status: 'executed',
        reply: aiReply,
        toolResult: bridgeResult,
        latencyMs,
      };

      setCommandHistory((prev) => prev.map((item) => (item.id === logId ? completedLog : item)));
      setActiveLog(completedLog);

      if (autoSpeakReply) {
        speakText(aiReply);
      }
    } catch (err: any) {
      const errorLog: VoiceCommandLog = {
        ...newLog,
        status: 'error',
        reply: `Lỗi thực thi lệnh: ${err.message || err}`,
        latencyMs: Math.round(performance.now() - startTime),
      };
      setCommandHistory((prev) => prev.map((item) => (item.id === logId ? errorLog : item)));
      setActiveLog(errorLog);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sampleCommands = [
    { label: '🚀 Tạo Agent Python', cmd: 'Tạo một AI Agent tự động bằng Python với SDK google-genai mới' },
    { label: '🔍 Phân tích mã nguồn', cmd: 'Phân tích cấu trúc thư mục và kiểm tra tối ưu hóa toàn dự án' },
    { label: '🎬 Mở Runway Studio', cmd: 'Mở Runway AI Video Studio và chuẩn bị kịch bản quay phim' },
    { label: '💻 Mở Code Studio', cmd: 'Chuyển sang tab Sovereign Code Studio để so sánh cú pháp' },
    { label: '🩺 Chẩn đoán hệ thống', cmd: 'Kiểm tra kết nối API Key và trạng thái hoạt động của Hermes Core' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="relative shrink-0">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-black shadow-[0_0_25px_rgba(0,255,255,0.8)] animate-pulse'
                    : 'bg-black/60 border border-cyan-400/50 text-cyan-400'
                }`}
              >
                <img
                  src="/au-logo.png"
                  alt="AU"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/app_logo.jpg';
                  }}
                />
              </div>
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Voice Interaction Hub</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                    Web Speech API &amp; Agent Bridge
                  </span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-cyan-200/80 max-w-2xl leading-relaxed">
                Tương tác giọng nói thời gian thực qua Web Speech API. Tự động nhận diện lệnh, chuyển văn bản thành
                hành động thực thi trực tiếp qua{' '}
                <code className="text-cyan-300 font-mono font-bold">window.AI_Assistant.execute</code>.
              </p>
            </div>
          </div>

          {/* Quick Bridge Status Badge */}
          <div className="flex items-center space-x-3 bg-black/40 border border-white/10 rounded-xl p-3 shrink-0">
            <div className="space-y-1 text-right sm:text-left">
              <div className="flex items-center space-x-1.5 justify-end sm:justify-start">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBridgeReady ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                  }`}
                ></span>
                <span className="text-xs font-bold text-white font-mono">
                  {isBridgeReady ? 'AI_Assistant: Sẵn sàng' : 'Khởi tạo Bridge...'}
                </span>
              </div>
              <p className="text-[11px] text-white/50">Mô hình: gemini-3.7-flash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Voice Command Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive Microphone & Waveform Pulsing Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            {/* Background Ambient Glow */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                isListening ? 'opacity-30 bg-radial from-cyan-500/20 via-transparent to-transparent' : 'opacity-0'
              }`}
            />

            {/* Language & Sound Options Pill */}
            <div className="w-full flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center space-x-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as any)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="vi-VN" className="bg-slate-900 text-white">
                    🇻🇳 Tiếng Việt (vi-VN)
                  </option>
                  <option value="en-US" className="bg-slate-900 text-white">
                    🇺🇸 English (en-US)
                  </option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoSpeakReply(!autoSpeakReply)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    autoSpeakReply
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-white/5 text-white/50 border-white/10'
                  }`}
                  title="Tự động đọc câu trả lời bằng giọng nói"
                >
                  {autoSpeakReply ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{autoSpeakReply ? 'Tự Động Đọc: BẬT' : 'Tự Động Đọc: TẮT'}</span>
                </button>

                <button
                  onClick={() => setHotwordEnabled(!hotwordEnabled)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    hotwordEnabled
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                      : 'bg-white/5 text-white/50 border-white/10'
                  }`}
                  title="Lắng nghe từ khóa thức tỉnh: 'TRỢ LÝ' hoặc 'HEY AI'"
                >
                  <Radio className={`w-3.5 h-3.5 ${hotwordEnabled ? 'animate-pulse text-cyan-400' : ''}`} />
                  <span>Wake-Word: {hotwordEnabled ? 'BẬT' : 'TẮT'}</span>
                </button>
              </div>
            </div>

            {/* Pulsing Concentric Circles Around Microphone */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Outer Pulse Wave 1 */}
              {isListening && (
                <motion.div
                  className="absolute rounded-full border-2 border-cyan-400/40"
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

              {/* Outer Pulse Wave 2 */}
              {isListening && (
                <motion.div
                  className="absolute rounded-full border-2 border-emerald-400/30"
                  animate={{
                    width: [120, 180, 210],
                    height: [120, 180, 210],
                    opacity: [0.9, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.6,
                    ease: 'easeOut',
                  }}
                />
              )}

              {/* Central Pulsing Trigger Button */}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                  isListening
                    ? 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-emerald-400 text-black shadow-[0_0_40px_rgba(0,255,255,0.9),0_0_80px_rgba(16,185,129,0.5)] border-4 border-white'
                    : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-cyan-400 border-2 border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-10 h-10 animate-bounce" />
                    <span className="text-[10px] font-black tracking-wider uppercase mt-1">Đang Nghe...</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-9 h-9" />
                    <span className="text-[10px] font-bold tracking-wider uppercase mt-1 text-white/80">
                      Bấm Để Nói
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="w-full max-w-md h-12 flex items-center justify-center gap-1.5 my-3">
              {audioLevels.map((lvl, index) => (
                <motion.div
                  key={index}
                  className={`w-1.5 sm:w-2 rounded-full transition-all duration-75 ${
                    isListening
                      ? 'bg-gradient-to-t from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_6px_rgba(0,255,255,0.6)]'
                      : 'bg-white/10'
                  }`}
                  style={{ height: `${isListening ? lvl : 12}%` }}
                />
              ))}
            </div>

            {/* Realtime Live Transcript Box */}
            <div className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-left min-h-[90px] mt-2 flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-Time Speech-to-Text:</span>
                </span>
                {isListening && <span className="text-cyan-400 font-mono animate-pulse">● Live Stream Active</span>}
              </div>

              {interimTranscript || finalTranscript ? (
                <p className="text-sm sm:text-base text-cyan-100 font-medium">
                  {finalTranscript}{' '}
                  <span className="text-cyan-400/70 italic underline decoration-cyan-400/40">
                    {interimTranscript}
                  </span>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-white/40 italic">
                  {isListening
                    ? 'Hãy nói lệnh của bạn (Ví dụ: "Tạo một agent phân tích dữ liệu", "Mở Code Studio")...'
                    : 'Nhấn nút Micro phía trên hoặc chọn câu lệnh mẫu bên dưới để bắt đầu tương tác.'}
                </p>
              )}
            </div>

            {/* Manual Typing Command Input */}
            <div className="w-full flex items-center gap-2 mt-4">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && manualInput.trim()) {
                    handleExecuteVoiceCommand(manualInput.trim());
                    setManualInput('');
                  }
                }}
                placeholder="Hoặc gõ câu lệnh gửi trực tiếp tới window.AI_Assistant.execute..."
                className="flex-1 bg-black/60 border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-white/30"
              />
              <button
                onClick={() => {
                  if (manualInput.trim()) {
                    handleExecuteVoiceCommand(manualInput.trim());
                    setManualInput('');
                  }
                }}
                disabled={!manualInput.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>Thực Thi</span>
              </button>
            </div>

            {/* Quick Action Voice Chips */}
            <div className="w-full mt-5 text-left">
              <p className="text-xs text-white/50 font-semibold mb-2">⚡ Câu Lệnh Giọng Nói Phổ Biến:</p>
              <div className="flex flex-wrap gap-2">
                {sampleCommands.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteVoiceCommand(sample.cmd)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 rounded-lg text-xs text-cyan-200 transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bridge Specification & Code Sample Card */}
          <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Kiến Trúc Tích Hợp: window.AI_Assistant</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Active Protocol
              </span>
            </div>

            <div className="bg-black/70 rounded-xl p-3 border border-white/5 font-mono text-xs text-cyan-300/90 overflow-x-auto">
              <pre>{`// Gọi thực thi trực tiếp từ Voice Command:
window.AI_Assistant.execute(command, {
  source: 'voice_interaction',
  language: '${selectedLang}',
  timestamp: new Date().toISOString()
});`}</pre>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Execution History & Agent Output Console */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Command Output Inspector */}
          <div className="bg-[#0e111a] border border-cyan-500/20 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Kết Quả Phản Hồi AI</h3>
              </div>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <VolumeX className="w-3 h-3" />
                  <span>Dừng Đọc</span>
                </button>
              )}
            </div>

            {activeLog ? (
              <div className="space-y-3">
                <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="font-mono">Lệnh đã nhận:</span>
                    <span>{activeLog.timestamp}</span>
                  </div>
                  <p className="text-sm font-bold text-white">"{activeLog.transcript}"</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-bold flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Trợ Lý Voice AI Phản Hồi:</span>
                    </span>
                    {activeLog.latencyMs && (
                      <span className="text-white/40 font-mono text-[11px] flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{activeLog.latencyMs}ms</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
                    {activeLog.reply || 'Đang xử lý phân tích lệnh qua Agent Orchestrator...'}
                  </p>
                </div>

                {activeLog.toolResult && (
                  <div className="bg-black/60 border border-white/10 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span>Tool Invocation Payload:</span>
                      <button
                        onClick={() =>
                          handleCopy(JSON.stringify(activeLog.toolResult, null, 2), activeLog.id + '_tool')
                        }
                        className="hover:text-cyan-300 cursor-pointer flex items-center space-x-1"
                      >
                        {copiedId === activeLog.id + '_tool' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy JSON</span>
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-36">
                      {JSON.stringify(activeLog.toolResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/40 space-y-2">
                <Activity className="w-8 h-8 mx-auto text-cyan-400/40" />
                <p className="text-xs">Chưa có tương tác nào trong phiên này.</p>
                <p className="text-[11px] text-white/30">Nói hoặc bấm vào các câu lệnh mẫu để kích hoạt.</p>
              </div>
            )}
          </div>

          {/* Voice Command Execution History Log */}
          <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Nhật Ký Tác Vụ Giọng Nói ({commandHistory.length})</span>
              </h3>
              {commandHistory.length > 0 && (
                <button
                  onClick={() => setCommandHistory([])}
                  className="text-[11px] text-white/40 hover:text-red-400 cursor-pointer"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {commandHistory.length > 0 ? (
                commandHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveLog(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      activeLog?.id === item.id
                        ? 'bg-cyan-950/40 border-cyan-400/50 shadow-md'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-cyan-300 font-bold">{item.timestamp}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          item.status === 'executed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.status === 'processing'
                            ? 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-white line-clamp-1 font-medium">{item.transcript}</p>
                    {item.reply && <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{item.reply}</p>}
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/30 text-center py-4">Nhật ký trống</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
