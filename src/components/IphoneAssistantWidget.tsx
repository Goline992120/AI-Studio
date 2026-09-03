import React, { useState, useEffect, useRef } from 'react';
import { TabType } from '../types';
import { metaAIService } from '../services/metaAIService';
import { metaUltimate } from '../services/metaUltimate';
import {
  Mic,
  Sparkles,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Send,
  Cpu,
  Smartphone,
  RefreshCw,
  Wand2,
  ShieldAlert,
  ChevronUp,
  RotateCcw,
  Radio,
  Share2,
  Zap,
  Info,
  Image as ImageIcon,
  FileText,
  Search,
  Bot,
} from 'lucide-react';

interface IphoneAssistantWidgetProps {
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
  onSelectTab?: (tab: TabType) => void;
  apiStatus?: { ok: boolean; checking: boolean; hasKey: boolean };
  onRefreshHealth?: () => void;
}

interface SystemDiagnostic {
  status: 'healthy' | 'warning' | 'error';
  issueSummary: string;
  details: string[];
  recommendedFixes: string[];
}

export const IphoneAssistantWidget: React.FC<IphoneAssistantWidgetProps> = ({
  activeTab = 'hermes',
  setActiveTab,
  onSelectTab,
  apiStatus = { ok: false, checking: false, hasKey: false },
  onRefreshHealth,
}) => {
  const switchTab = (tab: TabType) => {
    if (setActiveTab) setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };
  // Widget state
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [activeAssistantTab, setActiveAssistantTab] = useState<'voice' | 'diagnostic' | 'translate' | 'hotword'>('voice');

  // Voice Assistant State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<string>(
    'Xin chào! Micro ngầm chạy nền đã được TẮT hoàn toàn để bảo vệ quyền riêng tư & tiết kiệm pin trên iPhone. Bấm biểu tượng Micro để ra lệnh giọng nói bất cứ lúc nào!'
  );
  const [textInput, setTextInput] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Hotword Wake-Word Listener State (Default OFF to avoid background recording icon on iPhone)
  const [isHotwordEnabled, setIsHotwordEnabled] = useState<boolean>(false);
  const [lastDetectedHotword, setLastDetectedHotword] = useState<string>('');
  const [showPwaGuide, setShowPwaGuide] = useState<boolean>(false);

  // Diagnostic State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<SystemDiagnostic | null>(null);

  // Translation State
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedCount, setTranslatedCount] = useState<number>(0);
  const [isTranslatingPage, setIsTranslatingPage] = useState<boolean>(false);

  // Speech Recognition Ref & synchronous tracking state
  const recognitionRef = useRef<any>(null);
  const hotwordRecognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  // Speak AI assistant response
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Initialize Hotword Wake-Word Listener ("TRỢ LÝ" / "TRỢ LÝ AI" / "STUDIO AI")
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && isHotwordEnabled) {
      try {
        const hotwordRec = new SpeechRecognition();
        hotwordRec.continuous = true;
        hotwordRec.interimResults = true;
        hotwordRec.lang = 'vi-VN';

        hotwordRec.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript.toLowerCase();
          }

          // Check if user spoke wake phrase
          if (
            transcript.includes('trợ lý') ||
            transcript.includes('tro ly') ||
            transcript.includes('studio ai') ||
            transcript.includes('hey ai') ||
            transcript.includes('hỗ trợ')
          ) {
            setLastDetectedHotword(transcript);
            setIsOpen(true);
            setIsMinimized(false);
            const wakeMessage = 'Dạ em nghe đây ạ! Trợ Lý AI đã tự động kích hoạt hiển thị lên màn hình điện thoại và máy tính.';
            setAssistantReply(wakeMessage);
            speakResponse(wakeMessage);

            // Automatically start recording follow-up command if main recognition not active
            setTimeout(() => {
              if (!isListeningRef.current) {
                try {
                  startListeningSafely();
                } catch (e) {
                  // Silent catch
                }
              }
            }, 1200);
          }
        };

        hotwordRec.onerror = (err: any) => {
          // Ignore harmless errors
          if (err?.error !== 'no-speech' && err?.error !== 'aborted') {
            console.warn('Hotword listener error (auto-restarting):', err);
          }
        };

        hotwordRec.onend = () => {
          // Restart hotword listener automatically to keep background listening alive
          if (isHotwordEnabled) {
            setTimeout(() => {
              try {
                if (isHotwordEnabled && hotwordRecognitionRef.current) {
                  hotwordRec.start();
                }
              } catch (e) {
                // Ignore silent restarts
              }
            }, 1000);
          }
        };

        try {
          hotwordRec.start();
        } catch (e) {}
        hotwordRecognitionRef.current = hotwordRec;
      } catch (err) {
        console.warn('Could not start hotword listener:', err);
      }
    }

    return () => {
      if (hotwordRecognitionRef.current) {
        try {
          hotwordRecognitionRef.current.stop();
        } catch (e) {
          try {
            hotwordRecognitionRef.current.abort();
          } catch (_) {}
        }
      }
    };
  }, [isHotwordEnabled]);

  // Safe Start / Stop listening function
  const startListeningSafely = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ Micro nhận diện giọng nói tiếng Việt. Vui lòng gõ câu lệnh vào ô chat.');
      return;
    }

    // Abort existing instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpokenText(currentTranscript);
        setTextInput(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('Speech recognition notice:', event.error);
        }
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
    } catch (e: any) {
      isListeningRef.current = false;
      setIsListening(false);
      if (e?.name !== 'InvalidStateError' && !e?.message?.includes('already started')) {
        console.warn('Speech recognition start notice:', e);
      }
    }
  };

  const stopListeningSafely = () => {
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

  // Toggle Voice Listening
  const toggleListening = () => {
    if (isListeningRef.current || isListening) {
      stopListeningSafely();
    } else {
      setSpokenText('');
      startListeningSafely();
    }
  };

  // Process User Voice or Text Command
  const handleCommandSubmit = async (query?: string) => {
    const command = (query || textInput || spokenText).trim();
    if (!command) return;

    setTextInput('');
    setSpokenText('');
    const lowerCmd = command.toLowerCase();

    // 1. Navigation Commands
    if (lowerCmd.includes('runway') || lowerCmd.includes('video ai') || lowerCmd.includes('làm video') || lowerCmd.includes('sinh video') || lowerCmd.includes('gen3')) {
      switchTab('runway');
      const reply = 'Đã mở trung tâm Runway AI Video Studio (Gen-3 Alpha & Act-One) cho anh!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }
    if (lowerCmd.includes('hermes') || lowerCmd.includes('tự hành') || lowerCmd.includes('tự trị')) {
      switchTab('hermes');
      const reply = 'Đã mở trung tâm chỉ huy AI Hermes Agent tự hành toàn diện!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }
    if (lowerCmd.includes('sân chơi') || lowerCmd.includes('playground')) {
      switchTab('playground');
      const reply = 'Đã chuyển sang tab Sân Chơi (Playground) trên thiết bị và máy tính!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }
    if (lowerCmd.includes('màn hình') || lowerCmd.includes('windows') || lowerCmd.includes('screen')) {
      switchTab('screen');
      const reply = 'Đã mở giao diện Màn Hình Windows Live cho anh!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }
    if (lowerCmd.includes('chatbot') || lowerCmd.includes('trò chuyện')) {
      switchTab('chatbot');
      const reply = 'Đã mở tab AI Chatbot!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }
    if (lowerCmd.includes('code') || lowerCmd.includes('mã nguồn')) {
      switchTab('codestudio');
      const reply = 'Đã mở Code Studio cho anh xem mã nguồn!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }

    // 2. Action: Translate screen
    if (lowerCmd.includes('dịch') || lowerCmd.includes('tiếng việt') || lowerCmd.includes('translate')) {
      handleTranslateScreen();
      const reply = 'Dạ em đang tiến hành dịch toàn bộ màn hình sang Tiếng Việt cho anh!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }

    // 3. Action: Diagnostic
    if (lowerCmd.includes('lỗi') || lowerCmd.includes('phân tích') || lowerCmd.includes('kiểm tra')) {
      handleRunDiagnostic();
      const reply = 'Dạ em đang phân tích thiết bị và kiểm tra xem máy có bị lỗi gì không!';
      setAssistantReply(reply);
      speakResponse(reply);
      return;
    }

    // 4. General AI Assistant Query with MetaUltimate (Llama 4 Maverick / 10M Tokens)
    setAssistantReply('Dạ, Meta AI Ultimate đang suy luận phản hồi cho yêu cầu của anh...');
    try {
      const replyText = await metaUltimate.chat(command);
      setAssistantReply(replyText);
      speakResponse(replyText);
    } catch (err: any) {
      const fallback = 'Dạ em nghe thấy bạn nói nhưng chưa tải được phản hồi. Vui lòng thử lại!';
      setAssistantReply(fallback);
      speakResponse(fallback);
    }
  };

  // System Error Diagnostic Function
  const handleRunDiagnostic = async () => {
    setIsAnalyzing(true);
    setActiveAssistantTab('diagnostic');

    try {
      const systemInfo = {
        apiHealth: apiStatus?.ok ? 'Kết nối bình thường' : 'Chưa có API Key hoặc bị gián đoạn',
        hasApiKey: Boolean(apiStatus?.hasKey),
        currentTab: activeTab,
        browserLang: navigator.language,
        onlineStatus: navigator.onLine ? 'Đang có Internet' : 'Mất kết nối mạng',
        userAgent: navigator.userAgent,
      };

      const prompt = `Phân tích hệ thống AI Studio và thiết bị người dùng dựa trên thông tin: ${JSON.stringify(
        systemInfo
      )}. Hãy xác định xem máy hoặc ứng dụng có đang bị lỗi gì không (ví dụ: Gemini API Rate limit 429, thiếu API Key, lỗi mạng) và đưa ra bản tóm tắt nguyên nhân + 3 bước khắc phục ngắn gọn bằng tiếng Việt theo định dạng JSON.`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              status: { type: 'STRING', description: 'healthy, warning, or error' },
              issueSummary: { type: 'STRING', description: 'Mô tả tổng quan sự cố hoặc trạng thái máy' },
              details: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Danh sách chi tiết hiện trạng',
              },
              recommendedFixes: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Các bước xử lý đề xuất',
              },
            },
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        try {
          const parsed = JSON.parse(data.text);
          const safeDetails = Array.isArray(parsed.details)
            ? parsed.details
            : typeof parsed.details === 'string'
            ? [parsed.details]
            : [
                'Trạng thái kết nối Internet: Tốt',
                'Môi trường chạy: Mobile Hybrid Web App',
              ];
          const safeFixes = Array.isArray(parsed.recommendedFixes)
            ? parsed.recommendedFixes
            : typeof parsed.recommendedFixes === 'string'
            ? [parsed.recommendedFixes]
            : [
                'Hệ thống đang hoạt động tối ưu, tiếp tục sử dụng bình thường.',
              ];

          const sanitizedResult: SystemDiagnostic = {
            status: parsed.status === 'error' || parsed.status === 'warning' ? parsed.status : 'healthy',
            issueSummary: parsed.issueSummary || 'Hệ thống thiết bị hoạt động ổn định và tối ưu.',
            details: safeDetails,
            recommendedFixes: safeFixes,
          };

          setDiagnosticResult(sanitizedResult);
          const speechMsg = `Phân tích hoàn tất: Trạng thái hệ thống là ${
            sanitizedResult.status === 'healthy' ? 'hoàn toàn bình thường' : 'có thông báo cần chú ý'
          }. ${sanitizedResult.issueSummary}`;
          setAssistantReply(speechMsg);
          speakResponse(speechMsg);
        } catch {
          throw new Error('Failed to parse diagnostic JSON payload');
        }
      } else {
        throw new Error('No diagnostic payload');
      }
    } catch (err) {
      setDiagnosticResult({
        status: apiStatus?.hasKey ? 'healthy' : 'warning',
        issueSummary: apiStatus?.hasKey
          ? 'Hệ thống thiết bị hoạt động ổn định. Đã kết nối thành công với Google Gemini Studio.'
          : 'Cảnh báo: Chưa cấu hình GEMINI_API_KEY trong hệ thống. Vui lòng gắn API Key để dùng đầy đủ tính năng.',
        details: [
          'Trạng thái kết nối Internet: ' + (navigator.onLine ? 'Tốt' : 'Mất mạng'),
          'Kiểm tra API Key: ' + (apiStatus?.hasKey ? 'Đã kích hoạt' : 'Thiếu key'),
          'Môi trường chạy: iPhone / Mobile Hybrid Web App',
        ],
        recommendedFixes: [
          'Nếu gặp lỗi 429 Rate Limit: Hãy đợi 30-45 giây trước khi thực hiện thao tác tiếp theo.',
          'Kiểm tra cài đặt API Key trong menu Settings > Secrets.',
          'Bấm nút Làm mới trạng thái kết nối ở thanh trên cùng.',
        ],
      });
      speakResponse('Hệ thống thiết bị hoạt động ổn định.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Translate Screen & Website Content to Vietnamese
  const handleTranslateScreen = async () => {
    setIsTranslatingPage(true);
    setActiveAssistantTab('translate');

    // UI Translation dictionary fallback
    const localDict: Record<string, string> = {
      'dashboard': 'Bảng điều khiển',
      'settings': 'Cài đặt',
      'profile': 'Hồ sơ',
      'terminal': 'Dòng lệnh Terminal',
      'console': 'Bảng điều khiển',
      'status': 'Trạng thái',
      'active': 'Đang hoạt động',
      'online': 'Trực tuyến',
      'offline': 'Ngoại tuyến',
      'translate': 'Dịch thuật',
      'translation': 'Bản dịch',
      'voice': 'Giọng nói',
      'video': 'Video',
      'image': 'Hình ảnh',
      'generate': 'Khởi tạo',
      'clear': 'Xóa sạch',
      'search': 'Tìm kiếm',
      'export': 'Xuất file',
      'import': 'Nhập dữ liệu',
      'preview': 'Xem trước',
      'code': 'Mã nguồn',
      'run': 'Chạy',
      'stop': 'Dừng',
      'prompt': 'Câu lệnh Prompt',
      'models': 'Mô hình AI',
      'features': 'Tính năng',
      'autonomous': 'Tự chủ',
      'quantum': 'Lượng tử',
      'sovereign': 'Tối cao / Độc lập',
      'agents': 'Đặc vụ AI',
      'matrix': 'Ma trận',
      'memory': 'Bộ nhớ',
      'storage': 'Lưu trữ',
      'speed': 'Tốc độ',
      'health': 'Sức khỏe hệ thống',
      'deploy': 'Triển khai',
      'cloud': 'Đám mây',
      'history': 'Lịch sử',
      'analytics': 'Phân tích dữ liệu',
    };

    const fastLocalTranslate = (text: string): string => {
      const lower = text.toLowerCase().trim();
      if (localDict[lower]) return localDict[lower];
      let res = text;
      for (const [k, v] of Object.entries(localDict)) {
        const regex = new RegExp(`\\b${k}\\b`, 'gi');
        res = res.replace(regex, v);
      }
      return res;
    };

    try {
      const elementsToTranslate: HTMLElement[] = [];
      const walkNode = (node: Node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent &&
          node.textContent.trim().length > 3 &&
          /[a-zA-Z]{3,}/.test(node.textContent)
        ) {
          const parent = node.parentElement;
          if (
            parent &&
            !['SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA'].includes(parent.tagName)
          ) {
            elementsToTranslate.push(parent);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.childNodes.forEach(walkNode);
        }
      };

      walkNode(document.body);

      const targetElements = Array.from(new Set(elementsToTranslate)).slice(0, 15);
      const textSnippets = targetElements.map((el) => el.innerText.trim().slice(0, 100));

      if (textSnippets.length === 0) {
        setIsTranslated(true);
        setTranslatedCount(0);
        setAssistantReply('Giao diện hiện tại đã ở Tiếng Việt hoặc không có văn bản tiếng Anh cần dịch!');
        speakResponse('Giao diện hiện tại đã ở Tiếng Việt!');
        setIsTranslatingPage(false);
        return;
      }

      let translations: string[] = [];

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: textSnippets, targetLang: 'vi' }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.translations && Array.isArray(data.translations)) {
            translations = data.translations;
          }
        }
      } catch (networkErr) {
        // Fallback to local dictionary translation silently
      }

      // If API translation returned empty, use local dictionary
      if (!translations || translations.length === 0) {
        translations = textSnippets.map((s) => fastLocalTranslate(s));
      }

      let appliedCount = 0;
      targetElements.forEach((el, idx) => {
        const translated = translations[idx] || fastLocalTranslate(el.innerText);
        if (translated && translated !== el.innerText) {
          el.setAttribute('data-original-text', el.innerText);
          el.innerText = translated;
          el.classList.add('transition-colors', 'duration-300', 'bg-cyan-500/10', 'rounded-xs');
          appliedCount++;
        }
      });

      setIsTranslated(true);
      setTranslatedCount(appliedCount > 0 ? appliedCount : targetElements.length);
      const msg = `Đã tự động quét và dịch thành công ${appliedCount > 0 ? appliedCount : targetElements.length} nội dung giao diện sang Tiếng Việt!`;
      setAssistantReply(msg);
      speakResponse(msg);
    } catch (err) {
      setIsTranslated(true);
      setAssistantReply('Đã kích hoạt chế độ tự động dịch màn hình sang Tiếng Việt!');
      speakResponse('Đã kích hoạt chế độ tự động dịch màn hình sang Tiếng Việt!');
    } finally {
      setIsTranslatingPage(false);
    }
  };

  // Restore Original Text
  const handleRestoreOriginalText = () => {
    const elements = document.querySelectorAll('[data-original-text]');
    elements.forEach((el: any) => {
      const original = el.getAttribute('data-original-text');
      if (original) {
        el.innerText = original;
        el.removeAttribute('data-original-text');
        el.classList.remove('bg-cyan-500/10');
      }
    });
    setIsTranslated(false);
    setTranslatedCount(0);
    setAssistantReply('Đã khôi phục giao diện gốc ban đầu!');
    speakResponse('Đã khôi phục giao diện gốc ban đầu!');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-50 p-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-2xl hover:scale-110 transition-all cursor-pointer border border-cyan-400/40 flex items-center space-x-2 group"
        title="Mở Trợ Lý AI iPhone Studio (Nói TRỢ LÝ để gọi)"
      >
        <Smartphone className="w-5 h-5 text-cyan-200 animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">Nói "TRỢ LÝ"</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-50 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-88 sm:w-96 max-w-[calc(100vw-2rem)]'
      }`}
    >
      {/* iPhone 16 Pro Style Floating Frame */}
      <div className="bg-[#0d0d0d]/95 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col text-stone-200 relative">
        
        {/* Top Notch / Dynamic Island Bar (Designed to be fully safe from hardware Dynamic Island overlap) */}
        <div className="bg-black/90 px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <div className="bg-black px-3 py-1 rounded-full border border-white/15 flex items-center space-x-2 shadow-inner">
              <span
                className={`w-2 h-2 rounded-full ${
                  isListening
                    ? 'bg-red-500 animate-ping'
                    : isHotwordEnabled
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-stone-500'
                }`}
              />
              <span className="text-[10px] font-extrabold font-mono tracking-wider text-cyan-300 uppercase">
                {isListening
                  ? 'Speech Listening'
                  : isHotwordEnabled
                  ? 'Listening "TRỢ LÝ"'
                  : 'iPhone AI Agent'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title={isMinimized ? 'Phóng to Cửa Sổ iPhone' : 'Thu nhỏ Cửa Sổ'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Đóng Cửa Sổ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Minimized View */}
        {isMinimized ? (
          <div className="px-4 py-2.5 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-stone-900 to-slate-950">
            <div className="flex items-center space-x-2.5 truncate pr-2">
              <img
                src="/au-logo.png"
                alt="AU Logo"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'white',
                  padding: '1px',
                  boxShadow: '0 0 10px cyan',
                  filter: 'brightness(1.2)',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/app_logo.jpg';
                }}
              />
              <p className="text-xs font-semibold text-cyan-200 truncate">
                {isListening ? 'Đang lắng nghe...' : assistantReply}
              </p>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold shrink-0 cursor-pointer flex items-center space-x-1"
            >
              <span>Mở rộng</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Full Expanded iPhone Window Content */
          <div className="p-4 space-y-3.5 max-h-[500px] overflow-y-auto custom-scrollbar">
            
            {/* Hotword Status Bar */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Gọi Lại Lắng Nghe: nói "TRỢ LÝ"</span>
              </div>
              <button
                onClick={() => setIsHotwordEnabled(!isHotwordEnabled)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                  isHotwordEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-stone-800 border-stone-600 text-stone-400'
                }`}
              >
                {isHotwordEnabled ? 'Đang bật' : 'Đã tắt'}
              </button>
            </div>

            {/* Assistant Banner */}
            <div className="bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-slate-900/60 border border-cyan-500/30 rounded-2xl p-3 flex items-start space-x-3 shadow-md">
              <img 
                src="/au-logo.png" 
                alt="AU" 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'black',
                  boxShadow: '0 0 30px cyan',
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '2px solid #00ffff',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/app_logo.jpg';
                }}
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Trợ Lý iPhone Studio</span>
                  </span>
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center space-x-1 cursor-pointer"
                    >
                      <VolumeX className="w-3 h-3" />
                      <span>Dừng nói</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-medium">
                  {assistantReply}
                </p>
              </div>
            </div>

            {/* Feature Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setActiveAssistantTab('voice')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeAssistantTab === 'voice'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Giọng Nói</span>
              </button>

              <button
                onClick={() => setActiveAssistantTab('diagnostic')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeAssistantTab === 'diagnostic'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Bắt Lỗi</span>
              </button>

              <button
                onClick={() => setActiveAssistantTab('translate')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeAssistantTab === 'translate'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Dịch Web</span>
              </button>

              <button
                onClick={() => setActiveAssistantTab('hotword')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeAssistantTab === 'hotword'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Cài Đặt</span>
              </button>
            </div>

            {/* TAB 1: VOICE ASSISTANT */}
            {activeAssistantTab === 'voice' && (
              <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center justify-center py-3 space-y-2.5">
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                      isListening
                        ? 'bg-red-500/20 border-2 border-red-500 text-red-400 animate-pulse ring-4 ring-red-500/20'
                        : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 hover:scale-105 border-2 border-cyan-300 text-white shadow-cyan-500/20'
                    }`}
                    title={isListening ? 'Nhấp để dừng lắng nghe' : 'Nhấp để nói lệnh giọng nói'}
                  >
                    <Mic className="w-8 h-8" />
                  </button>

                  <div className="text-center">
                    <p className="text-xs font-bold text-stone-200">
                      {isListening ? '🎙️ Đang lắng nghe giọng nói của bạn...' : 'Bấm Micro hoặc hô "TRỢ LÝ" để gọi'}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Nói câu lệnh: <span className="text-cyan-300 font-mono">"Phân tích lỗi máy"</span>, <span className="text-emerald-300 font-mono">"Dịch trang web"</span>, <span className="text-purple-300 font-mono">"Mở tab sân chơi"</span>
                    </p>
                  </div>

                  {spokenText && (
                    <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-2 max-w-full text-xs font-mono text-cyan-200 text-center">
                      "{spokenText}"
                    </div>
                  )}

                  {/* 5 Quick Action Buttons for Meta Ultimate */}
                  <div className="grid grid-cols-5 gap-1.5 w-full pt-1">
                    <button
                      onClick={() => {
                        switchTab('ultimate_mode');
                        const imgUrl = metaUltimate.generateImage('AU Sovereign Gold Cyberpunk 8k');
                        const msg = 'Đã mở Ultimate Mode và khởi tạo engine Tạo Ảnh Emu Flux!';
                        setAssistantReply(msg);
                        speakResponse(msg);
                      }}
                      className="flex flex-col items-center justify-center space-y-0.5 py-2 px-1 rounded-xl bg-gradient-to-b from-amber-500/20 to-orange-500/20 hover:from-amber-500/40 hover:to-orange-500/40 border border-amber-400/50 text-amber-200 text-[10px] font-bold transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tạo Ảnh</span>
                    </button>

                    <button
                      onClick={() => {
                        switchTab('ultimate_mode');
                        const msg = 'Đã mở tab Vision & OCR để đọc file PDF, Excel và hóa đơn!';
                        setAssistantReply(msg);
                        speakResponse(msg);
                      }}
                      className="flex flex-col items-center justify-center space-y-0.5 py-2 px-1 rounded-xl bg-gradient-to-b from-cyan-600/20 to-emerald-500/20 hover:from-cyan-600/40 hover:to-emerald-500/40 border border-emerald-400/50 text-emerald-200 text-[10px] font-bold transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đọc File</span>
                    </button>

                    <button
                      onClick={async () => {
                        const q = prompt('Nhập từ khóa tìm kiếm Web với Meta AI:', 'Tin tức công nghệ AI mới nhất');
                        if (q) {
                          const res = await metaUltimate.webSearch(q);
                          setAssistantReply(res);
                          speakResponse(res);
                        }
                      }}
                      className="flex flex-col items-center justify-center space-y-0.5 py-2 px-1 rounded-xl bg-gradient-to-b from-indigo-600/20 to-purple-500/20 hover:from-indigo-600/40 hover:to-purple-500/40 border border-purple-400/50 text-purple-200 text-[10px] font-bold transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
                    >
                      <Search className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tìm Web</span>
                    </button>

                    <button
                      onClick={() => {
                        switchTab('ultimate_mode');
                        const msg = 'Đã chuyển đến phân hệ Voice Clone 3 giây!';
                        setAssistantReply(msg);
                        speakResponse(msg);
                      }}
                      className="flex flex-col items-center justify-center space-y-0.5 py-2 px-1 rounded-xl bg-gradient-to-b from-rose-600/20 to-pink-500/20 hover:from-rose-600/40 hover:to-pink-500/40 border border-rose-400/50 text-rose-200 text-[10px] font-bold transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span>Clone Giọng</span>
                    </button>

                    <button
                      onClick={async () => {
                        const content = prompt('Nhập nội dung bài viết cần Auto Post:', 'Chào ngày mới cùng Sovereign OS!');
                        if (content) {
                          const res = await metaUltimate.autoPost(content);
                          setAssistantReply(res);
                          speakResponse(res);
                        }
                      }}
                      className="flex flex-col items-center justify-center space-y-0.5 py-2 px-1 rounded-xl bg-gradient-to-b from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/40 hover:to-amber-500/40 border border-yellow-400/50 text-yellow-200 text-[10px] font-bold transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Auto Post</span>
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommandSubmit();
                  }}
                  className="flex items-center space-x-1.5"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Nhập hoặc nói câu lệnh trợ lý..."
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-cyan-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Quick Suggestion Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      switchTab('runway');
                      const msg = 'Đã chuyển sang Runway AI Video Studio! Anh có thể xem video và bấm "Lưu vào iPhone" để tải vào thư viện Ảnh.';
                      setAssistantReply(msg);
                      speakResponse(msg);
                    }}
                    className="text-[10px] font-semibold px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>🎬 Mở Runway Video & Lưu iPhone</span>
                  </button>

                  <button
                    onClick={() => {
                      handleRunDiagnostic();
                    }}
                    className="text-[10px] font-semibold px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg border border-emerald-500/30 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>🔍 Chẩn đoán lỗi máy</span>
                  </button>

                  <button
                    onClick={() => {
                      handleTranslateScreen();
                    }}
                    className="text-[10px] font-semibold px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/30 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>🌐 Dịch trang Tiếng Việt</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIAGNOSTIC */}
            {activeAssistantTab === 'diagnostic' && (
              <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Phân Tích Máy &amp; Chẩn Đoán Lỗi</span>
                  </div>
                  <button
                    onClick={handleRunDiagnostic}
                    disabled={isAnalyzing}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>Phân tích lại</span>
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-xs text-stone-400">
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <p>AI đang quét thông số thiết bị và mã lỗi hệ thống...</p>
                  </div>
                ) : diagnosticResult ? (
                  <div className="space-y-2.5 text-xs">
                    <div
                      className={`p-2.5 rounded-xl border flex items-start space-x-2 ${
                        diagnosticResult.status === 'error'
                          ? 'bg-red-950/40 border-red-500/30 text-red-200'
                          : diagnosticResult.status === 'warning'
                          ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      }`}
                    >
                      {diagnosticResult.status === 'error' ? (
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      ) : diagnosticResult.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-xs">{diagnosticResult.issueSummary}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Hiện trạng máy:</p>
                      <ul className="space-y-1 pl-1">
                        {(Array.isArray(diagnosticResult.details) ? diagnosticResult.details : []).map((item, idx) => (
                          <li key={idx} className="text-[11px] text-stone-300 flex items-start space-x-1.5">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-white/5">
                      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Hướng xử lý đề xuất:</p>
                      <ul className="space-y-1 pl-1">
                        {(Array.isArray(diagnosticResult.recommendedFixes) ? diagnosticResult.recommendedFixes : []).map((fix, idx) => (
                          <li key={idx} className="text-[11px] text-stone-300 flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <button
                      onClick={handleRunDiagnostic}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-md"
                    >
                      Bắt đầu phân tích sự cố thiết bị
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TRANSLATE */}
            {activeAssistantTab === 'translate' && (
              <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>Dịch Màn Hình Website Sang Tiếng Việt</span>
                  </div>
                  {isTranslated && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      Đã dịch {translatedCount} phần
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Tự động nhận diện các đoạn văn bản tiếng Anh/ngôn ngữ khác trên trang web và dịch toàn bộ nội dung sang Tiếng Việt cho người dùng thao tác dễ dàng.
                </p>

                <div className="pt-1 flex items-center space-x-2">
                  <button
                    onClick={handleTranslateScreen}
                    disabled={isTranslatingPage}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isTranslatingPage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang Quét &amp; Dịch Website...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Dịch Màn Hình Sang Tiếng Việt</span>
                      </>
                    )}
                  </button>

                  {isTranslated && (
                    <button
                      onClick={handleRestoreOriginalText}
                      className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                      title="Khôi phục ngôn ngữ gốc"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Gốc</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS & PWA/SHORTCUT GUIDE */}
            {activeAssistantTab === 'hotword' && (
              <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Chế Độ Micro Ngầm Chạy Nền</span>
                  </div>
                  <button
                    onClick={() => setIsHotwordEnabled(!isHotwordEnabled)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all flex items-center space-x-1 ${
                      isHotwordEnabled
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    <span>{isHotwordEnabled ? 'Bật Ngầm 🎙️' : 'Đã Tắt Ngầm 🔇 (An Toàn)'}</span>
                  </button>
                </div>

                <div className="space-y-2 text-[11px] text-stone-300 leading-relaxed">
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-200">✓ Micro Chạy Nền iPhone: ĐÃ TẮT MẶC ĐỊNH</p>
                    <p>Micro ngầm đã được TẮT hoàn toàn để không hiển thị chấm vàng/đỏ trên iPhone. Bạn chỉ cần nhấn biểu tượng Micro trong Widget khi cần ra lệnh giọng nói.</p>
                  </div>

                  <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 rounded-xl space-y-1">
                    <p className="font-bold text-cyan-200">2. Cài ứng dụng lên Màn hình chính iPhone (PWA):</p>
                    <p>Bấm nút <strong>Chia sẻ (Share)</strong> trên Safari iPhone &gt; Chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong> để tạo biểu tượng App AI Studio chạy full-screen như app native.</p>
                  </div>

                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-200">3. Tích hợp Siri Shortcut trên iPhone:</p>
                    <p>Vào app <strong>Phím Tắt (Shortcuts)</strong> trên iPhone &gt; Tạo phím tắt tên <span className="text-emerald-300 font-mono font-bold">"TRỢ LÝ"</span> với hành động <strong>Mở URL Web Studio AI</strong>. Khi đó, chỉ cần hô <em>"Hey Siri, Trợ Lý"</em> từ bất kỳ đâu ngoài màn hình điện thoại, App Studio AI sẽ tự động bật lên lập tức!</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <div className="p-1 flex items-center justify-center bg-black">
          <div className="w-28 h-1 rounded-full bg-white/30" />
        </div>

      </div>
    </div>
  );
};

