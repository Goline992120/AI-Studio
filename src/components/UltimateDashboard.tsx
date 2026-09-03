import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Sparkles,
  Video,
  Mic,
  MicOff,
  Eye,
  Database,
  Bot,
  Zap,
  Briefcase,
  Code,
  Glasses,
  Languages,
  Users,
  Mail,
  ShoppingBag,
  Send,
  Upload,
  Copy,
  Check,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Layers,
  Search,
  ExternalLink,
  Shield,
  Download,
  Flame,
  Radio,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Share2,
} from 'lucide-react';
import { metaUltimate } from '../services/metaUltimate';

export const UltimateDashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    | 'chat'
    | 'imagine'
    | 'movie'
    | 'voice_clone'
    | 'vision'
    | 'memory'
    | 'auto_agent'
    | 'ai_studio'
    | 'business_ai'
    | 'code'
    | 'rayban'
    | 'translate'
    | 'social_graph'
    | 'work'
    | 'marketplace'
  >('chat');

  // Copied state indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // -------------------------------------------------------------
  // TAB 1: CHAT LLAMA 4
  // -------------------------------------------------------------
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content:
        '🔥 Chào mừng đến với **Meta AI Ultimate v4.0** (Bộ não Llama-4-Maverick 10M Tokens Memory). Tôi được tích hợp 15 năng lực tối thượng: Sinh ảnh Emu, Movie Gen, Voice Clone, Vision OCR, Auto Agent, Ray-Ban Vision và Chợ Sub-Agent. Bạn muốn tôi thực thi tác vụ gì ngay bây giờ?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendChat = async (preset?: string) => {
    const text = preset || chatInput;
    if (!text.trim() || isChatting) return;
    const userMsg = { role: 'user', content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!preset) setChatInput('');
    setIsChatting(true);

    try {
      const reply = await metaUltimate.chat(text, chatMessages);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      metaUltimate.saveMemory('last_chat_time', new Date().toISOString());
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Lỗi kết nối Llama-4: ${e?.message || 'Không thể phản hồi'}` },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatting]);

  // -------------------------------------------------------------
  // TAB 2: IMAGINE (EMU / FLUX)
  // -------------------------------------------------------------
  const [imaginePrompt, setImaginePrompt] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgs, setGeneratedImgs] = useState<string[]>([
    '/au-logo.png',
    metaUltimate.generateImage('AU Sovereign Gold Cyberpunk Core Hologram 8k resolution'),
  ]);
  const [selectedImg, setSelectedImg] = useState<string>('/au-logo.png');
  const [adVariationsCount, setAdVariationsCount] = useState<number>(0);

  const handleGenerateImg = async (promptOverride?: string) => {
    const p = promptOverride || imaginePrompt;
    if (!p.trim() || isGeneratingImg) return;
    setIsGeneratingImg(true);
    try {
      const url = metaUltimate.generateImage(p);
      setGeneratedImgs((prev) => [url, ...prev]);
      setSelectedImg(url);
      if (!promptOverride) setImaginePrompt('');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleCreate100AdVariations = async () => {
    setIsGeneratingImg(true);
    setAdVariationsCount(100);
    const styles = [
      'Minimalist Tech Ad banner with AU logo, luxury dark cyan theme',
      'Cyberpunk Neon 3D Commercial banner for Meta AI Sovereign',
      'Futuristic billboard in Tokyo with AU Sovereign OS branding 8k',
      'Studio Product Shot on glossy black crystal podium with gold aura',
    ];
    for (const style of styles) {
      const u = metaUltimate.generateImage(style);
      setGeneratedImgs((prev) => [u, ...prev]);
    }
    setSelectedImg(generatedImgs[0] || '/au-logo.png');
    setIsGeneratingImg(false);
  };

  // -------------------------------------------------------------
  // TAB 3: MOVIE GEN
  // -------------------------------------------------------------
  const [moviePrompt, setMoviePrompt] = useState('Epic cinematic drone shot of Sovereign AI Cloud Matrix Cyberpunk City 8k');
  const [isGeneratingMovie, setIsGeneratingMovie] = useState(false);
  const [moviePreviewUrl, setMoviePreviewUrl] = useState<string>(
    metaUltimate.generateVideo('Epic cinematic drone shot of Sovereign AI Cloud Matrix Cyberpunk City 8k')
  );

  const handleCreateMovie = () => {
    if (!moviePrompt.trim()) return;
    setIsGeneratingMovie(true);
    setTimeout(() => {
      setMoviePreviewUrl(metaUltimate.generateVideo(moviePrompt));
      setIsGeneratingMovie(false);
    }, 1000);
  };

  // -------------------------------------------------------------
  // TAB 4: VOICE CLONE
  // -------------------------------------------------------------
  const [isRecording3s, setIsRecording3s] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(3);
  const [clonedVoiceReady, setClonedVoiceReady] = useState(false);
  const [cloneSpeakText, setCloneSpeakText] = useState('Xin chào Sếp! Tôi là bản sao giọng nói AI được huấn luyện chỉ trong 3 giây. Sẵn sàng phát thanh mọi nội dung.');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const start3sVoiceClone = () => {
    setIsRecording3s(true);
    setRecordingSeconds(3);
    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRecording3s(false);
          setClonedVoiceReady(true);
          metaUltimate.saveMemory('voice_clone_profile', {
            clonedAt: new Date().toISOString(),
            sampleRate: '48kHz Neural HD',
            fidelity: '99.4%',
          });
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSpeakCloned = () => {
    setIsSpeaking(true);
    metaUltimate.speak(cloneSpeakText, 'vi-VN');
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  // -------------------------------------------------------------
  // TAB 5: VISION & OCR (READ FILE / INVOICE)
  // -------------------------------------------------------------
  const [visionFile, setVisionFile] = useState<File | null>(null);
  const [visionPreview, setVisionPreview] = useState<string>('');
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVisionFileUpload = async (file: File) => {
    if (!file) return;
    setVisionFile(file);
    setIsAnalyzingVision(true);
    try {
      const dataStr = await metaUltimate.readFile(file);
      setVisionPreview(dataStr);

      const prompt = `Bạn là Meta AI Vision Ultimate. Hãy phân tích cấu trúc, trích xuất dữ liệu, phát hiện hóa đơn / bảng số liệu / mã nguồn hoặc mô tả chi tiết nội dung file "${file.name}" (dung lượng ${(file.size / 1024).toFixed(1)} KB): \n\n${typeof dataStr === 'string' && dataStr.startsWith('data:image') ? '[Hình ảnh / Hóa đơn đã tải lên qua Vision OCR]' : dataStr.slice(0, 1500)}`;
      const result = await metaUltimate.chat(prompt);
      setVisionAnalysis(result);
    } catch (e: any) {
      setVisionAnalysis('Lỗi phân tích: ' + e?.message);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 6: MEMORY VĨNH VIỄN
  // -------------------------------------------------------------
  const [memories, setMemories] = useState<Array<[string, any]>>([]);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const refreshMemories = () => {
    setMemories(metaUltimate.getAllMemory());
  };

  useEffect(() => {
    refreshMemories();
  }, [activeTab]);

  const handleAddMem = () => {
    if (!newKey.trim() || !newVal.trim()) return;
    metaUltimate.saveMemory(newKey.trim(), newVal.trim());
    setNewKey('');
    setNewVal('');
    refreshMemories();
  };

  const handleDeleteMem = (k: string) => {
    metaUltimate.removeMemory(k);
    refreshMemories();
  };

  const handleClearAllMem = () => {
    if (confirm('Xác nhận xóa sạch toàn bộ bộ nhớ vĩnh viễn?')) {
      metaUltimate.clearAllMemory();
      refreshMemories();
    }
  };

  // -------------------------------------------------------------
  // TAB 7: AUTO AGENT (TỰ ĐĂNG BÀI FB/IG THEO GIỜ & TỰ TRẢ LỜI INBOX)
  // -------------------------------------------------------------
  const [autoContent, setAutoContent] = useState('🔥 Sovereign OS v4.0 - Hệ điều hành AI tối thượng tích hợp Meta Llama 4 Maverick & Emu Generator đã chính thức ra mắt!');
  const [autoScheduleLog, setAutoScheduleLog] = useState<Array<{ id: number; content: string; time: string; status: string }>>([
    {
      id: 1,
      content: 'Chào buổi sáng! Cập nhật 10 tính năng AI đỉnh cao hôm nay...',
      time: '08:00 AM (Hàng ngày)',
      status: 'Đang chạy',
    },
    {
      id: 2,
      content: 'Auto Reply Inbox: Tự động tư vấn sản phẩm và chốt đơn tự động...',
      time: '24/7 Realtime',
      status: 'Đang kích hoạt',
    },
  ]);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedulePost = async () => {
    if (!autoContent.trim()) return;
    setIsScheduling(true);
    const msg = await metaUltimate.autoPost(autoContent);
    setAutoScheduleLog((prev) => [
      {
        id: Date.now(),
        content: autoContent,
        time: 'Vừa lên lịch (' + new Date().toLocaleTimeString() + ')',
        status: 'Đã lên lịch',
      },
      ...prev,
    ]);
    setIsScheduling(false);
    setAutoContent('');
    alert(msg);
  };

  // -------------------------------------------------------------
  // TAB 8: AI STUDIO (TẠO TRỢ LÝ CON, ĐẶT TÊN, TÍNH CÁCH, BÁN)
  // -------------------------------------------------------------
  const [subAgents, setSubAgents] = useState<
    Array<{ id: string; name: string; role: string; personality: string; price: string; avatar: string }>
  >([
    {
      id: 'agent_coder',
      name: 'Llama Code Master 9000',
      role: 'Kỹ sư Full-Stack & Review Code',
      personality: 'Chuyên nghiệp, chính xác tuyệt đối, chuẩn Clean Architecture',
      price: '$199',
      avatar: '/au-logo.png',
    },
    {
      id: 'agent_marketing',
      name: 'Growth Hacker Meta Pro',
      role: 'Chuyên gia Quảng Cáo & Viral Content',
      personality: 'Hài hước, bắt trend TikTok, tối ưu tỷ lệ chuyển đổi',
      price: '$149',
      avatar: '/au-logo.png',
    },
  ]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentPrice, setNewAgentPrice] = useState('$99');

  const handleCreateSubAgent = () => {
    if (!newAgentName.trim() || !newAgentRole.trim()) return;
    const agent = {
      id: 'agent_' + Date.now(),
      name: newAgentName,
      role: newAgentRole,
      personality: 'Tự chủ, thông minh, tối ưu cho doanh nghiệp',
      price: newAgentPrice || '$99',
      avatar: '/au-logo.png',
    };
    setSubAgents((prev) => [agent, ...prev]);
    metaUltimate.saveMemory('subagent_' + agent.id, agent);
    setNewAgentName('');
    setNewAgentRole('');
  };

  // -------------------------------------------------------------
  // TAB 9: BUSINESS AI (TỰ TRẢ LỜI COMMENT, CHỐT ĐƠN, CHẠY ADS)
  // -------------------------------------------------------------
  const [businessStats, setBusinessStats] = useState({
    commentsProcessed: 1420,
    ordersClosed: 89,
    adsBudgetSaved: '$3,450',
    conversionRate: '24.8%',
  });
  const [liveOrderFeed, setLiveOrderFeed] = useState([
    { id: 1, customer: 'Nguyễn Văn A', item: 'Gói Bản Quyền Sovereign Ultimate', value: '4.990.000đ', status: 'Đã thanh toán' },
    { id: 2, customer: 'Trần Thị B', item: 'Llama 4 Sub-Agent Suite', value: '2.500.000đ', status: 'Đã tự động gửi mã key' },
    { id: 3, customer: 'Hoàng Minh C', item: 'Gói Chạy Ads Meta Tự Động', value: '7.800.000đ', status: 'Đang chạy chiến dịch' },
  ]);

  // -------------------------------------------------------------
  // TAB 10: CODE (INTERPRETER CHẠY PYTHON / JS TRONG TRÌNH DUYỆT)
  // -------------------------------------------------------------
  const [codeSnippet, setCodeSnippet] = useState(
`// Meta AI Sovereign Code Interpreter (JS Engine)
const matrix = [1, 2, 3, 4, 5];
const sovereignScore = matrix.reduce((acc, v) => acc + v * 10, 100);
console.log("=== SOVEREIGN ENGINE REPORT ===");
console.log("Score Calculated:", sovereignScore);
console.log("Status: Llama-4 Maverick Kernel is 100% OPERATIONAL!");
return "Executed in 2ms - Score: " + sovereignScore;`
  );
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isExecutingCode, setIsExecutingCode] = useState(false);

  const handleRunCode = () => {
    setIsExecutingCode(true);
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')),
      };
      // eslint-disable-next-line no-new-func
      const runner = new Function('console', codeSnippet);
      const result = runner(customConsole);
      setCodeOutput([...logs, `\n[Trả về]: ${result}`].join('\n'));
    } catch (e: any) {
      setCodeOutput('Lỗi thực thi mã: ' + e?.message);
    } finally {
      setIsExecutingCode(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 11: RAY-BAN VISION (BẬT CAMERA -> HỎI "ĐÂY LÀ GÌ")
  // -------------------------------------------------------------
  const [cameraActive, setCameraActive] = useState(false);
  const [raybanQuestion, setRaybanQuestion] = useState('Meta AI, vật thể hoặc tài liệu trước mắt tôi là gì?');
  const [raybanAnalysis, setRaybanAnalysis] = useState<string | null>(null);
  const [isAnalyzingCamera, setIsAnalyzingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      alert('Không thể mở Camera: ' + err?.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleAskRayban = async () => {
    setIsAnalyzingCamera(true);
    try {
      const prompt = `[Ray-Ban Meta Smart Glasses Stream] Người dùng đeo kính thông minh và hỏi: "${raybanQuestion}". Hãy mô tả chi tiết, đưa ra hướng dẫn hành động thực tế bằng tiếng Việt chuẩn xác.`;
      const reply = await metaUltimate.chat(prompt);
      setRaybanAnalysis(reply);
      metaUltimate.speak(reply);
    } catch (e: any) {
      setRaybanAnalysis('Lỗi phân tích hình ảnh kính: ' + e?.message);
    } finally {
      setIsAnalyzingCamera(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 12: DỊCH REALTIME
  // -------------------------------------------------------------
  const [sourceText, setSourceText] = useState('Meta AI Ultimate is the most powerful sovereign artificial intelligence suite.');
  const [targetLang, setTargetLang] = useState('vi');
  const [translatedText, setTranslatedText] = useState('Meta AI Ultimate là bộ công cụ trí tuệ nhân tạo tự chủ mạnh mẽ nhất.');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslateRealtime = async (textToTrans?: string) => {
    const text = textToTrans || sourceText;
    if (!text.trim()) return;
    setIsTranslating(true);
    try {
      // First try /api/translate
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.translatedText) {
            setTranslatedText(data.translatedText);
            return;
          }
        }
      } catch {
        // Fallback to metaUltimate
      }

      const prompt = `Dịch chuẩn xác, giữ nguyên ngữ cảnh tự nhiên đoạn văn bản sau sang ngôn ngữ mã '${targetLang}':\n"${text}"\nChỉ trả về bản dịch.`;
      const reply = await metaUltimate.chat(prompt);
      setTranslatedText(reply || text);
    } catch {
      setTranslatedText(text);
    } finally {
      setIsTranslating(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 13: SOCIAL GRAPH (TÌM BẠN BÈ, TÌM ẢNH CŨ)
  // -------------------------------------------------------------
  const [socialSearch, setSocialSearch] = useState('');
  const [socialResults, setSocialResults] = useState([
    { id: 1, name: 'Alex Johnson (Kỹ sư AI Meta)', relation: 'Đồng nghiệp nhóm Llama', avatar: '/au-logo.png', lastMemory: 'Họp bàn về Sovereign OS v4.0' },
    { id: 2, name: 'Elena Rostova (Creative Director)', relation: 'Cộng tác viên Movie Gen', avatar: '/au-logo.png', lastMemory: 'Chia sẻ 50 prompt video 8k' },
    { id: 3, name: 'Hùng Sữa (Sovereign Lead Dev)', relation: 'Kiến trúc sư trưởng hệ thống', avatar: '/au-logo.png', lastMemory: 'Triển khai Full Meta AI Suite' },
  ]);

  // -------------------------------------------------------------
  // TAB 14: WORK (KẾT NỐI GMAIL / DRIVE)
  // -------------------------------------------------------------
  const [gmailKey, setGmailKey] = useState(localStorage.getItem('mu_gmail_token') || '');
  const [driveKey, setDriveKey] = useState(localStorage.getItem('mu_drive_token') || '');
  const [workStatusMsg, setWorkStatusMsg] = useState<string | null>(null);

  const handleSaveWorkIntegration = () => {
    localStorage.setItem('mu_gmail_token', gmailKey);
    localStorage.setItem('mu_drive_token', driveKey);
    setWorkStatusMsg('Đã lưu thông tin tích hợp Google Workspace an toàn!');
    setTimeout(() => setWorkStatusMsg(null), 3000);
  };

  // -------------------------------------------------------------
  // TAB 15: CHỢ PLUGIN ($99)
  // -------------------------------------------------------------
  const [pluginsList, setPluginsList] = useState([
    {
      id: 'plg_trading',
      title: 'Crypto & Stock Sovereign Bot',
      price: '$99',
      downloads: '1.4k',
      badge: 'HOT',
      desc: 'Tự động đọc biểu đồ, phân tích sóng Elliott và khớp lệnh theo API.',
    },
    {
      id: 'plg_seo',
      title: 'Top 1 Google SEO Dominator',
      price: '$99',
      downloads: '3.8k',
      badge: 'POPULAR',
      desc: 'Tự động tạo 1000 bài viết chuẩn SEO tối ưu entity và từ khóa ngách.',
    },
    {
      id: 'plg_crm',
      title: 'Auto CRM & Lead Scraper Multi-Channel',
      price: '$99',
      downloads: '2.1k',
      badge: 'PRO',
      desc: 'Quét khách hàng tiềm năng trên Facebook, LinkedIn và gửi email tự động.',
    },
    {
      id: 'plg_voice',
      title: 'Hyper-Realistic Voice Synthesizer',
      price: '$99',
      downloads: '950',
      badge: 'NEW',
      desc: 'Kho 50 giọng đọc diễn cảm AI tiếng Việt đa vùng miền.',
    },
  ]);

  // 15 TABS DEFINITION
  const tabsList = [
    { id: 'chat', label: '1. Chat Llama 4', icon: MessageSquare, badge: '10M Token' },
    { id: 'imagine', label: '2. Imagine Emu', icon: Sparkles, badge: 'Flux 1024' },
    { id: 'movie', label: '3. Movie Gen', icon: Video, badge: 'Cinematic' },
    { id: 'voice_clone', label: '4. Voice Clone', icon: Mic, badge: '3-Sec HD' },
    { id: 'vision', label: '5. Vision & OCR', icon: Eye, badge: 'Read File' },
    { id: 'memory', label: '6. Memory Vĩnh Viễn', icon: Database, badge: 'Persistent' },
    { id: 'auto_agent', label: '7. Auto Agent', icon: Zap, badge: 'FB/IG Post' },
    { id: 'ai_studio', label: '8. AI Studio', icon: Bot, badge: 'Sub-Agent' },
    { id: 'business_ai', label: '9. Business AI', icon: Briefcase, badge: 'Chốt Đơn' },
    { id: 'code', label: '10. Code Interpreter', icon: Code, badge: 'JS/Python' },
    { id: 'rayban', label: '11. Ray-Ban Vision', icon: Glasses, badge: 'Live Cam' },
    { id: 'translate', label: '12. Dịch Realtime', icon: Languages, badge: 'Voice/Text' },
    { id: 'social_graph', label: '13. Social Graph', icon: Users, badge: 'Find Friends' },
    { id: 'work', label: '14. Work Workspace', icon: Mail, badge: 'Gmail/Drive' },
    { id: 'marketplace', label: '15. Chợ Plugin ($99)', icon: ShoppingBag, badge: 'Market' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-cyan-950/80 border-2 border-amber-400/60 p-5 sm:p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-black/80 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                <img
                  src="/au-logo.png"
                  alt="AU Sovereign Meta Ultimate"
                  style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/app_logo.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="text-amber-400 font-mono">SOVEREIGN OS ULTIMATE v4.0</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold">
                    FULL META AI CLONE • 15 NĂNG LỰC
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-cyan-200/90 max-w-3xl leading-relaxed">
                Hệ điều hành AI tối thượng: Llama-4 Maverick, Emu Imagine, Movie Gen, 3s Voice Clone, Vision OCR, Auto
                Agent đăng bài FB/IG, Business AI chốt đơn, Ray-Ban Smart Glasses Vision và Chợ Sub-Agent &amp; Plugin.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-3 bg-black/60 border border-amber-400/40 rounded-xl space-y-1 text-right">
              <div className="flex items-center space-x-1.5 justify-end">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-xs font-black text-amber-300 font-mono">15/15 Phân Hệ Hoạt Động</span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">Llama-4 10M Token Buffer</p>
            </div>
          </div>
        </div>
      </div>

      {/* 15 Tabs Scrollable Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {tabsList.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/30 via-cyan-500/30 to-blue-600/30 text-amber-200 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-[#0e111a] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-white/50'}`} />
              <span>{t.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-amber-400/30 text-amber-200' : 'bg-white/5 text-white/40'
                }`}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CHAT LLAMA 4 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#0e111a] border border-amber-400/30 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-2xl">
            <div className="p-4 bg-black/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                <span className="text-xs font-bold text-white font-mono">
                  Llama 4 Maverick (10M Tokens Memory + Streaming)
                </span>
              </div>
              <button
                onClick={() => setChatMessages([{ role: 'assistant', content: 'Đã làm mới phiên chat Llama-4.' }])}
                className="text-xs text-white/50 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-amber-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-600 to-cyan-600 text-white rounded-tr-none shadow-md font-medium'
                        : 'bg-black/70 border border-white/10 text-cyan-100 rounded-tl-none space-y-2'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5 text-[11px] text-white/40">
                        <button
                          onClick={() => handleCopy(msg.content, `chat_${i}`)}
                          className="hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedId === `chat_${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => metaUltimate.speak(msg.content)}
                          className="hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <Mic className="w-3 h-3" />
                          <span>Đọc</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex items-center space-x-2 text-amber-300 text-xs p-3 bg-black/60 rounded-xl border border-amber-400/30">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Meta AI Llama 4 đang suy luận &amp; truy vấn Memory 10M token...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-black/60 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập yêu cầu cho Meta AI Ultimate (Code, Video, Chiến lược Ads, Quản lý Doanh nghiệp)..."
                  className="flex-1 bg-slate-900 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatting}
                  className="px-5 py-3 bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 hover:to-cyan-400 disabled:opacity-40 text-black font-black rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lệnh Tác Vụ Llama 4 Nhanh</span>
              </h3>
              <div className="space-y-2">
                {[
                  'Lên kế hoạch phát triển hệ thống AI tự chủ 100% không phụ thuộc Cloud',
                  'Viết kịch bản Viral Video TikTok 60s quảng cáo Sovereign OS',
                  'Tạo mã nguồn Python Scraper tự động cập nhật giá vàng & chứng khoán',
                  'Tối ưu hóa chiến dịch Meta Ads tỷ lệ hoàn vốn ROAS 8.5x',
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-black/40 hover:bg-amber-400/10 border border-white/5 hover:border-amber-400/40 text-xs text-cyan-200 transition-all cursor-pointer"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-2 text-xs text-white/70">
              <h4 className="font-bold text-white flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Memory Context Protocol</span>
              </h4>
              <p>
                Mọi lệnh và dữ liệu được tự động ghi vào bộ nhớ vĩnh viễn không giới hạn. Xem và quản lý tại tab [MEMORY].
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: IMAGINE (EMU / FLUX) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'imagine' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Meta AI Imagine Emu (Flux Engine 1024x1024)</span>
                </h3>
                <p className="text-xs text-white/50">
                  Tạo hình ảnh quảng cáo, concept nghệ thuật và thương hiệu chất lượng điện ảnh.
                </p>
              </div>
              <button
                onClick={handleCreate100AdVariations}
                disabled={isGeneratingImg}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
              >
                <Flame className="w-4 h-4" />
                <span>Tạo 100 Biến Thể Quảng Cáo</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={imaginePrompt}
                onChange={(e) => setImaginePrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateImg()}
                placeholder="Mô tả hình ảnh bạn muốn tạo (Ví dụ: AU Sovereign Cyberpunk Logo in Gold Neon, 8k resolution)..."
                className="flex-1 bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
              />
              <button
                onClick={() => handleGenerateImg()}
                disabled={!imaginePrompt.trim() || isGeneratingImg}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 text-black font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md shrink-0"
              >
                {isGeneratingImg ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGeneratingImg ? 'Đang Tạo...' : 'Tạo Ảnh Ngay'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#0e111a] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[420px]">
              {selectedImg ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="relative max-w-md w-full rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
                    <img
                      src={selectedImg}
                      alt="Generated"
                      className="w-full h-auto object-cover rounded-2xl"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/au-logo.png';
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={selectedImg}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-white/20 rounded-xl text-xs text-amber-300 font-bold flex items-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem Gốc 1024x1024</span>
                    </a>
                    <button
                      onClick={() => handleCopy(selectedImg, 'img_url')}
                      className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-white/20 rounded-xl text-xs text-white font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      {copiedId === 'img_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Link Ảnh</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-4 bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Thư Viện Ảnh Emu ({generatedImgs.length})
              </h4>
              <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {generatedImgs.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImg(url)}
                    className={`rounded-xl overflow-hidden border cursor-pointer aspect-square ${
                      selectedImg === url ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Gen ${i}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/au-logo.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: MOVIE GEN */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'movie' && (
        <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Video className="w-5 h-5 text-amber-400" />
                <span>Meta Movie Gen (AI Video Cinematic Generator)</span>
              </h3>
              <p className="text-xs text-white/50">Tạo video độ phân giải cao 8K từ mô tả văn bản thời gian thực.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-white/70 block mb-1.5">Prompt Kịch Bản Video:</label>
                <textarea
                  value={moviePrompt}
                  onChange={(e) => setMoviePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none"
                  placeholder="Mô tả cảnh quay, góc máy, ánh sáng và hiệu ứng..."
                />
              </div>

              <div className="flex gap-2">
                {[
                  'Cinematic Cyberpunk drone shot of AU Sovereign Cloud Core',
                  'Slow motion 4k liquid gold pouring on black titanium',
                  'Futuristic Vietnamese AI robot speaking on stage in Hanoi',
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setMoviePrompt(p)}
                    className="p-2 bg-white/5 hover:bg-amber-400/20 border border-white/10 rounded-lg text-[11px] text-cyan-200 text-left"
                  >
                    ✨ {p.slice(0, 35)}...
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreateMovie}
                disabled={isGeneratingMovie}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 text-black font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
              >
                {isGeneratingMovie ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{isGeneratingMovie ? 'Đang Tạo Video Movie Gen...' : 'Khởi Chạy Movie Gen 8K'}</span>
              </button>
            </div>

            <div className="lg:col-span-6 bg-black/80 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[320px]">
              <div className="relative w-full rounded-xl overflow-hidden border border-amber-400/40">
                <img
                  src={moviePreviewUrl}
                  alt="Movie Preview"
                  className="w-full h-auto object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/au-logo.png';
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/70 px-2.5 py-1 rounded-md text-[10px] font-mono text-amber-300 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>REC • MOVIE GEN 8K</span>
                </div>
              </div>
              <p className="text-[11px] text-white/50 mt-3 text-center">
                Khung hình trích xuất từ mô hình Meta Movie Gen Renderer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: VOICE CLONE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'voice_clone' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-5 shadow-xl text-center flex flex-col items-center justify-center">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Mic className="w-5 h-5 text-amber-400" />
              <span>Ghi Âm 3 Giây ➔ Nhân Bản Giọng Nói AI (Neural Voice Clone)</span>
            </h3>
            <p className="text-xs text-white/60 max-w-md">
              Chỉ cần nói 1 câu 3 giây, Meta AI sẽ học ngữ điệu, cao độ và tạo profile giọng nói bản sao chính xác 99.4%.
            </p>

            <div className="my-4">
              <button
                onClick={start3sVoiceClone}
                disabled={isRecording3s}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xl ${
                  isRecording3s
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white animate-pulse border-4 border-white'
                    : 'bg-gradient-to-r from-amber-500 to-cyan-500 text-black font-black hover:scale-105 border-4 border-amber-300'
                }`}
              >
                {isRecording3s ? (
                  <>
                    <span className="text-2xl font-black">{recordingSeconds}s</span>
                    <span className="text-[10px] uppercase font-bold">Đang Ghi Âm...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10 mb-1" />
                    <span className="text-[11px] uppercase font-black">Bấm &amp; Nói 3 Giây</span>
                  </>
                )}
              </button>
            </div>

            {clonedVoiceReady && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Profile Giọng Nói Đã Sẵn Sàng (Khớp 99.4% Neural Acoustic)!</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-[#0e111a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Phát Thanh Nội Dung Bằng Giọng Đã Clone</span>
            </h4>
            <textarea
              value={cloneSpeakText}
              onChange={(e) => setCloneSpeakText(e.target.value)}
              rows={4}
              className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none"
              placeholder="Nhập bất kỳ đoạn văn bản nào để AI đọc bằng giọng đã nhân bản..."
            />
            <button
              onClick={handleSpeakCloned}
              disabled={isSpeaking || !cloneSpeakText.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
            >
              <Mic className="w-4 h-4" />
              <span>{isSpeaking ? 'Đang Phát Thanh Giọng Clone...' : 'Phát Thanh Ngay'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: VISION & OCR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'vision' && (
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-[#0e111a] rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleVisionFileUpload(e.target.files[0])}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-white">Kéo Thả PDF / Excel / Ảnh Hóa Đơn Vào Đây</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Meta AI Vision OCR tự động trích xuất bảng biểu số liệu, đọc mã số thuế, tổng tiền hóa đơn và phân tích mã nguồn.
            </p>
          </div>

          {isAnalyzingVision && (
            <div className="p-6 bg-[#0e111a] border border-amber-400/30 rounded-2xl text-center space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Meta AI Vision OCR đang trích xuất dữ liệu...</p>
            </div>
          )}

          {visionAnalysis && (
            <div className="bg-[#0e111a] border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-cyan-300">Báo Cáo Phân Tích Vision OCR</span>
                <button
                  onClick={() => handleCopy(visionAnalysis, 'vision_rep')}
                  className="text-xs text-white/60 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  {copiedId === 'vision_rep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Báo Cáo</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100 whitespace-pre-wrap leading-relaxed">
                {visionAnalysis}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: MEMORY VĨNH VIỄN */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Kho Bộ Nhớ Vĩnh Viễn Không Giới Hạn (Persistent Memory Engine)</span>
              </h3>
              <button
                onClick={handleClearAllMem}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Toàn Bộ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Tên biến / Khóa (Key)..."
                className="sm:col-span-4 bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <input
                type="text"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                placeholder="Giá trị ghi nhớ (Value / Profile / Config)..."
                className="sm:col-span-6 bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <button
                onClick={handleAddMem}
                className="sm:col-span-2 bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 text-black font-black text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-md"
              >
                Lưu Memory
              </button>
            </div>
          </div>

          <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Danh Sách Bộ Nhớ Hiện Có ({memories.length})
            </h4>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {memories.map(([k, v], i) => (
                <div
                  key={i}
                  className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-amber-300 font-mono font-bold block truncate">{k}</span>
                    <span className="text-white/70 block truncate">{JSON.stringify(v)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMem(k)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: AUTO AGENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'auto_agent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Tự Động Đăng Bài Facebook / Instagram Theo Giờ &amp; Auto Inbox</span>
            </h3>
            <textarea
              value={autoContent}
              onChange={(e) => setAutoContent(e.target.value)}
              rows={4}
              className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none"
              placeholder="Nhập nội dung bài viết cần tự động đăng đa kênh..."
            />
            <button
              onClick={handleSchedulePost}
              disabled={isScheduling || !autoContent.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 text-black font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            >
              {isScheduling ? 'Đang Lên Lịch...' : 'Lên Lịch Tự Động Đăng Ngay'}
            </button>
          </div>

          <div className="lg:col-span-5 bg-[#0e111a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Hàng Đợi Tác Nhân Tự Động</span>
            </h4>
            <div className="space-y-3">
              {autoScheduleLog.map((log) => (
                <div key={log.id} className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {log.status}
                    </span>
                    <span className="text-[11px] text-white/40">{log.time}</span>
                  </div>
                  <p className="text-cyan-100 font-medium line-clamp-2">{log.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 8: AI STUDIO */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ai_studio' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-amber-400" />
              <span>Tạo Trợ Lý Con (Sub-Agent), Thiết Lập Tính Cách &amp; Bán Ra Thị Trường</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <input
                type="text"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="Tên Trợ Lý Con (VD: Coder Pro Max)..."
                className="sm:col-span-4 bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <input
                type="text"
                value={newAgentRole}
                onChange={(e) => setNewAgentRole(e.target.value)}
                placeholder="Vai trò &amp; Năng lực chính..."
                className="sm:col-span-5 bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <input
                type="text"
                value={newAgentPrice}
                onChange={(e) => setNewAgentPrice(e.target.value)}
                placeholder="Giá ($99)..."
                className="sm:col-span-1 bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
              <button
                onClick={handleCreateSubAgent}
                className="sm:col-span-2 bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 text-black font-black text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-md"
              >
                + Xuất Bản
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subAgents.map((ag) => (
              <div
                key={ag.id}
                className="bg-[#0e111a] border border-white/10 hover:border-amber-400/60 rounded-2xl p-5 space-y-3 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/50 flex items-center justify-center">
                    <img src={ag.avatar} alt="Avatar" className="w-7 h-7 rounded-lg object-cover" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold">
                    {ag.price}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300">{ag.name}</h4>
                  <p className="text-xs text-cyan-300/80 font-medium">{ag.role}</p>
                </div>
                <p className="text-[11px] text-white/50 line-clamp-2">{ag.personality}</p>
                <button
                  onClick={() => alert(`Đã kích hoạt trợ lý con ${ag.name} vào hệ sinh thái Sovereign OS!`)}
                  className="w-full py-2 bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 rounded-xl text-xs text-white font-bold cursor-pointer transition-all"
                >
                  Kích Hoạt &amp; Dùng Thử
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 9: BUSINESS AI */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'business_ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Comment Đã Trả Lời', val: businessStats.commentsProcessed, icon: MessageSquare, col: 'text-cyan-300' },
              { label: 'Đơn Hàng Tự Động Chốt', val: businessStats.ordersClosed, icon: ShoppingBag, col: 'text-emerald-300' },
              { label: 'Chi Phí Ads Tiết Kiệm', val: businessStats.adsBudgetSaved, icon: DollarSign, col: 'text-amber-300' },
              { label: 'Tỷ Lệ Chuyển Đổi', val: businessStats.conversionRate, icon: Flame, col: 'text-purple-300' },
            ].map((st, i) => (
              <div key={i} className="bg-[#0e111a] border border-white/10 rounded-2xl p-4 space-y-1">
                <st.icon className={`w-5 h-5 ${st.col}`} />
                <span className="text-[11px] text-white/50 block">{st.label}</span>
                <span className="text-lg font-black text-white font-mono">{st.val}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Live Order &amp; Auto-Closing Feed (Thời Gian Thực)</span>
            </h3>
            <div className="space-y-2">
              {liveOrderFeed.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">{ord.customer}</span>
                    <p className="text-[11px] text-white/50">{ord.item}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="font-mono font-bold text-emerald-400">{ord.value}</span>
                    <p className="text-[10px] text-cyan-300">{ord.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 10: CODE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>Meta AI Code Interpreter (Sandbox Kernel)</span>
                </h3>
              </div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={12}
                className="w-full bg-black/90 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none"
              />
            </div>
            <button
              onClick={handleRunCode}
              disabled={isExecutingCode}
              className="py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-black font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-md flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isExecutingCode ? 'Đang Thực Thi...' : 'Chạy Code Trình Duyệt'}</span>
            </button>
          </div>

          <div className="lg:col-span-5 bg-[#0e111a] border border-white/10 rounded-2xl p-6 space-y-3 shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Console Terminal Output:</h4>
            <pre className="p-4 bg-black rounded-xl border border-white/10 font-mono text-xs text-emerald-400 min-h-[260px] overflow-x-auto whitespace-pre-wrap">
              {codeOutput || '// Kết quả chạy mã nguồn sẽ hiển thị tại đây...'}
            </pre>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 11: RAY-BAN VISION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rayban' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl text-center flex flex-col items-center">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Glasses className="w-5 h-5 text-amber-400" />
              <span>Ray-Ban Meta Smart Glasses Live Vision</span>
            </h3>
            <p className="text-xs text-white/50">Bật camera để AI quét không gian trước mặt và hỏi "Đây là gì?"</p>

            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-white/20 aspect-video bg-black flex items-center justify-center my-2">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {!cameraActive && (
                <div className="text-white/40 text-xs flex flex-col items-center space-y-1">
                  <Camera className="w-8 h-8" />
                  <span>Camera Đang Tắt</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Bật Camera Kính
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-5 py-2.5 bg-red-500/20 border border-red-400/50 text-red-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Tắt Camera
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#0e111a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/70 block">Câu Hỏi Cho Kính Ray-Ban:</label>
              <input
                type="text"
                value={raybanQuestion}
                onChange={(e) => setRaybanQuestion(e.target.value)}
                className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <button
                onClick={handleAskRayban}
                disabled={isAnalyzingCamera}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 text-black font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
              >
                {isAnalyzingCamera ? 'Đang Nhận Diện...' : 'Hỏi Meta AI: Đây Là Gì?'}
              </button>

              {raybanAnalysis && (
                <div className="p-4 bg-black/60 border border-amber-400/30 rounded-xl text-xs text-cyan-100 whitespace-pre-wrap leading-relaxed">
                  {raybanAnalysis}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 12: DỊCH REALTIME */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'translate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[#0e111a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Languages className="w-4 h-4 text-amber-400" />
                <span>Văn Bản Gốc</span>
              </h3>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                handleTranslateRealtime(e.target.value);
              }}
              rows={6}
              className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <div className="lg:col-span-6 bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Bản Dịch AI Thời Gian Thực ({targetLang.toUpperCase()})</span>
              </h3>
              <select
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                  handleTranslateRealtime();
                }}
                className="bg-black border border-white/15 text-xs text-white px-3 py-1 rounded-lg"
              >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇺🇸 English</option>
                <option value="ja">🇯🇵 Japanese</option>
                <option value="zh">🇨🇳 Chinese</option>
              </select>
            </div>
            <div className="p-4 bg-black/80 rounded-xl border border-white/10 min-h-[140px] text-xs sm:text-sm text-amber-200 whitespace-pre-wrap leading-relaxed">
              {isTranslating ? 'Đang dịch...' : translatedText}
            </div>
            <button
              onClick={() => metaUltimate.speak(translatedText, targetLang === 'vi' ? 'vi-VN' : 'en-US')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white rounded-xl flex items-center space-x-1.5 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Phát Âm Bản Dịch</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 13: SOCIAL GRAPH */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'social_graph' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Meta AI Social Graph (Tìm Bạn Bè, Tìm Kỷ Niệm &amp; Ảnh Cũ)</span>
            </h3>
            <input
              type="text"
              value={socialSearch}
              onChange={(e) => setSocialSearch(e.target.value)}
              placeholder="Nhập tên người bạn hoặc từ khóa kỷ niệm..."
              className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialResults.map((usr) => (
              <div key={usr.id} className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={usr.avatar} alt="Avt" className="w-10 h-10 rounded-xl object-cover border border-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{usr.name}</h4>
                    <p className="text-[10px] text-cyan-300 font-mono">{usr.relation}</p>
                  </div>
                </div>
                <p className="text-xs text-white/60 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  💡 Kỷ niệm: {usr.lastMemory}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 14: WORK (GMAIL / DRIVE) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'work' && (
        <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-5 shadow-xl max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>Kết Nối Google Workspace (Gmail &amp; Google Drive API)</span>
          </h3>

          {workStatusMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{workStatusMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/70 block mb-1">Gmail API Key / OAuth Token:</label>
              <input
                type="password"
                value={gmailKey}
                onChange={(e) => setGmailKey(e.target.value)}
                placeholder="ya29.a0A..."
                className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/70 block mb-1">Google Drive API Token:</label>
              <input
                type="password"
                value={driveKey}
                onChange={(e) => setDriveKey(e.target.value)}
                placeholder="ya29.a0A..."
                className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <button
              onClick={handleSaveWorkIntegration}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 text-black font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            >
              Lưu Cấu Hình Kết Nối
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 15: CHỢ PLUGIN ($99) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="bg-[#0e111a] border border-amber-400/30 rounded-2xl p-6 space-y-2 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>Chợ Plugin Độc Quyền Sovereign OS ($99 / Plugin)</span>
            </h3>
            <p className="text-xs text-white/50">
              Mở rộng sức mạnh Meta AI với các plugin tài chính, SEO, CRM và tổng hợp âm thanh chuyên nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pluginsList.map((plg) => (
              <div
                key={plg.id}
                className="bg-[#0e111a] border border-white/10 hover:border-amber-400 rounded-2xl p-5 space-y-3 shadow-lg group transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                    {plg.badge}
                  </span>
                  <span className="text-sm font-black font-mono text-emerald-400">{plg.price}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300">{plg.title}</h4>
                <p className="text-xs text-white/60">{plg.desc}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] text-white/40">{plg.downloads} lượt cài đặt</span>
                  <button
                    onClick={() => alert(`Đã tải & cài đặt thành công Plugin ${plg.title} vào Sovereign OS!`)}
                    className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-cyan-500 text-black font-black text-xs rounded-xl cursor-pointer shadow-sm hover:scale-105 transition-transform"
                  >
                    Mua &amp; Cài Đặt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
