import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  Play,
  Code2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Layers,
  Terminal,
  FileCode,
  Zap,
  Folder,
  ArrowRight,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { vfs, VirtualFile } from '../services/virtualFileSystem';
import { AiSoldier } from '../data/aiArmyData';

interface SovereignChatbotBuilderProps {
  onNotifyArmyAction?: (soldierId: string, task: string) => void;
  onRefreshVFS?: () => void;
  selectedFile?: VirtualFile | null;
  onSelectFile?: (file: VirtualFile) => void;
}

export const SovereignChatbotBuilder: React.FC<SovereignChatbotBuilderProps> = ({
  onNotifyArmyAction,
  onRefreshVFS,
  selectedFile,
  onSelectFile,
}) => {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: 'user' | 'model';
      content: string;
      codeGenerated?: { html: string; css: string; js: string; appFolder: string };
      isStreaming?: boolean;
      timestamp: string;
    }>
  >([
    {
      id: 'init-msg',
      role: 'model',
      content: `🔥 **SOVEREIGN FULL STACK BUILDER v10.0 ĐÃ KÍCH HOẠT**
Tôi là AI Mẹ chỉ huy tối cao. Hãy ra lệnh cho tôi:
- *"Tạo cho tao 1 app bán hàng"* ➔ Tự động tạo folder \`/apps/banhang\`, viết \`index.html\`, \`style.css\`, \`script.js\`.
- *"Tạo app máy tính cyberpunk"*, *"Tạo landing page game $1M"*, *"Tạo app nghe nhạc Suno"*...
- *"Sửa app bán hàng cho đẹp hơn"* ➔ Tự động đọc lại code VFS và refactor tức thì.
- Giao việc tự động cho **50 AI Lính** (Midjourney, Claude 3.5, GPT-4o, Suno...).`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'chat' | 'editor' | 'preview'>('chat');
  const [editorContent, setEditorContent] = useState('');
  const [currentEditingFile, setCurrentEditingFile] = useState<VirtualFile | null>(null);
  const [activeAppFolder, setActiveAppFolder] = useState<string>('/apps/banhang');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [previewHtmlDoc, setPreviewHtmlDoc] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Synchronize when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      setCurrentEditingFile(selectedFile);
      setEditorContent(selectedFile.content);
    }
  }, [selectedFile]);

  // Load preview documents from VFS
  const refreshPreviewFromVFS = async (folderPath: string = activeAppFolder) => {
    const htmlFile = await vfs.getFile(`${folderPath}/index.html`);
    const cssFile = await vfs.getFile(`${folderPath}/style.css`);
    const jsFile = await vfs.getFile(`${folderPath}/script.js`);

    if (htmlFile) {
      let combined = htmlFile.content;
      if (cssFile && !combined.includes('<style>')) {
        combined = combined.replace('</head>', `<style>${cssFile.content}</style></head>`);
      }
      if (jsFile && !combined.includes('<script>')) {
        combined = combined.replace('</body>', `<script>${jsFile.content}</script></body>`);
      }
      setPreviewHtmlDoc(combined);
    }
  };

  useEffect(() => {
    refreshPreviewFromVFS();
  }, [activeAppFolder]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBuilding]);

  // Handle Save Code in Editor
  const handleSaveEditorContent = async () => {
    if (!currentEditingFile) return;
    const updated: VirtualFile = {
      ...currentEditingFile,
      content: editorContent,
      updatedAt: new Date().toISOString(),
      sizeBytes: new Blob([editorContent]).size,
    };
    await vfs.saveFile(updated);
    setCurrentEditingFile(updated);
    onRefreshVFS?.();
    refreshPreviewFromVFS(updated.folder);
    alert(`✓ Đã lưu thành công file ${updated.path} vào IndexedDB!`);
  };

  // Main Builder Execution Flow
  const handleSendMessage = async () => {
    if (!inputVal.trim() || isBuilding) return;
    const userText = inputVal.trim();
    setInputVal('');

    const newMsgId = 'msg-' + Date.now();
    const userMsg = {
      id: 'user-' + Date.now(),
      role: 'user' as const,
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsBuilding(true);

    const lower = userText.toLowerCase();

    // 1. Phân loại lệnh tạo app
    let appSlug = 'banhang';
    let appTitle = 'CyberStore Sovereign v10.0';

    if (lower.includes('máy tính') || lower.includes('calculator') || lower.includes('calc')) {
      appSlug = 'maytinh';
      appTitle = 'Quantum Cyberpunk Calculator';
    } else if (lower.includes('game') || lower.includes('trò chơi')) {
      appSlug = 'cybergame';
      appTitle = 'Cyberpunk Neon Runner Game';
    } else if (lower.includes('nhạc') || lower.includes('music') || lower.includes('suno')) {
      appSlug = 'musicplayer';
      appTitle = 'Aureon Sovereign Hi-Fi Music Stream';
    } else if (lower.includes('todo') || lower.includes('ghi chú') || lower.includes('task')) {
      appSlug = 'cybernotes';
      appTitle = 'Sovereign Neural Notes & Tasks';
    }

    const folderPath = `/apps/${appSlug}`;
    setActiveAppFolder(folderPath);

    // Kích hoạt AI Lính phù hợp
    if (lower.includes('ảnh') || lower.includes('hình') || lower.includes('giao diện')) {
      onNotifyArmyAction?.('midjourney-v6', 'Khởi tạo ảnh & Asset đồ họa');
    }
    if (lower.includes('code') || lower.includes('tạo') || lower.includes('app')) {
      onNotifyArmyAction?.('claude-3-5-sonnet', 'Viết cấu trúc HTML/JS/CSS');
      onNotifyArmyAction?.('v0-dev', 'Thiết kế Tailwind components');
    }

    // Tạo mã nguồn thực tế
    let generatedHtml = '';
    let generatedCss = '';
    let generatedJs = '';

    if (appSlug === 'maytinh') {
      generatedHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-white flex items-center justify-center min-h-screen p-4 font-mono">
  <div class="w-full max-w-sm bg-slate-900 border-2 border-cyan-400 rounded-3xl p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)]">
    <div class="text-right mb-4">
      <div class="text-xs text-cyan-400 font-bold tracking-widest uppercase">QUANTUM CORE CALC</div>
      <input type="text" id="display" readonly value="0" class="w-full bg-black/80 text-amber-400 font-mono text-3xl font-black text-right p-3 rounded-xl border border-cyan-500/40 mt-1 outline-hidden shadow-inner">
    </div>
    <div class="grid grid-cols-4 gap-2.5">
      <button onclick="clearDisplay()" class="col-span-2 p-3 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded-xl font-bold transition">CLEAR</button>
      <button onclick="deleteLast()" class="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl font-bold transition">DEL</button>
      <button onclick="appendOp('/')" class="p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition">÷</button>
      <button onclick="appendNum('7')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">7</button>
      <button onclick="appendNum('8')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">8</button>
      <button onclick="appendNum('9')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">9</button>
      <button onclick="appendOp('*')" class="p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition">×</button>
      <button onclick="appendNum('4')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">4</button>
      <button onclick="appendNum('5')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">5</button>
      <button onclick="appendNum('6')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">6</button>
      <button onclick="appendOp('-')" class="p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition">-</button>
      <button onclick="appendNum('1')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">1</button>
      <button onclick="appendNum('2')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">2</button>
      <button onclick="appendNum('3')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">3</button>
      <button onclick="appendOp('+')" class="p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition">+</button>
      <button onclick="appendNum('0')" class="col-span-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">0</button>
      <button onclick="appendNum('.')" class="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">.</button>
      <button onclick="calculate()" class="p-3 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl font-black transition">=</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
      generatedCss = `/* Calculator Styles */
body { background: radial-gradient(circle at center, #0f172a, #020617); }
button { cursor: pointer; user-select: none; }
button:active { transform: scale(0.95); }`;
      generatedJs = `let currentInput = "0";

function updateDisplay() {
  document.getElementById('display').value = currentInput;
}

function appendNum(n) {
  if (currentInput === "0" && n !== ".") currentInput = n;
  else currentInput += n;
  updateDisplay();
}

function appendOp(op) {
  currentInput += " " + op + " ";
  updateDisplay();
}

function clearDisplay() {
  currentInput = "0";
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  if (currentInput === "") currentInput = "0";
  updateDisplay();
}

function calculate() {
  try {
    currentInput = String(eval(currentInput));
  } catch(e) {
    currentInput = "ERR";
  }
  updateDisplay();
}`;
    } else {
      // Default: Bán hàng hoặc App Doanh Nghiệp nâng cao
      generatedHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-white min-h-screen font-sans p-6">
  <div class="max-w-5xl mx-auto space-y-6">
    <header class="flex items-center justify-between border-b border-amber-400/30 pb-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_#f59e0b]">⚡</div>
        <div>
          <h1 class="text-2xl font-black text-amber-400 font-mono tracking-wider">${appTitle}</h1>
          <p class="text-xs text-cyan-300 font-mono">Tạo bởi Sovereign AI Commander • Live Preview</p>
        </div>
      </div>
      <button onclick="openCart()" class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition shadow-[0_0_15px_rgba(245,158,11,0.5)]">
        🛒 GIỎ HÀNG (<span id="cart-count">0</span>)
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/90 border border-amber-400/40 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" class="rounded-xl h-44 object-cover mb-3">
        <h3 class="font-black text-white text-base">Aureon Cyber Sneaker 8K</h3>
        <p class="text-xs text-slate-400 my-1">Đế nano lượng tử siêu đàn hồi viền RGB.</p>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <span class="text-xl font-black text-amber-400">$199.00</span>
          <button onclick="addToCart('Aureon Sneaker 8K', 199)" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition">MUA NGAY</button>
        </div>
      </div>

      <div class="bg-slate-900/90 border border-cyan-400/40 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" class="rounded-xl h-44 object-cover mb-3">
        <h3 class="font-black text-white text-base">Quantum ANC Pro Headset</h3>
        <p class="text-xs text-slate-400 my-1">Chống ồn thời gian thực 99.8% lossless.</p>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <span class="text-xl font-black text-cyan-400">$299.00</span>
          <button onclick="addToCart('Quantum ANC Pro', 299)" class="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black transition">MUA NGAY</button>
        </div>
      </div>

      <div class="bg-slate-900/90 border border-purple-400/40 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" class="rounded-xl h-44 object-cover mb-3">
        <h3 class="font-black text-white text-base">Titanium Sovereign Chrono</h3>
        <p class="text-xs text-slate-400 my-1">Đồng hồ vệ tinh lượng tử mạ vàng.</p>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <span class="text-xl font-black text-purple-400">$349.00</span>
          <button onclick="addToCart('Titanium Chrono', 349)" class="px-4 py-2 rounded-xl bg-purple-400 hover:bg-purple-300 text-black text-xs font-black transition">MUA NGAY</button>
        </div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
      generatedCss = `/* Custom Store CSS */
body { background-color: #030712; color: #f8fafc; }`;
      generatedJs = `let cart = [];
function addToCart(name, price) {
  cart.push({ name, price });
  document.getElementById('cart-count').innerText = cart.length;
  alert('✓ Đã thêm "' + name + '" vào giỏ hàng!');
}
function openCart() {
  if (cart.length === 0) { alert('Giỏ hàng trống!'); return; }
  const sum = cart.reduce((a, b) => a + b.price, 0);
  alert('GIỎ HÀNG CỦA BẠN (' + cart.length + ' món):\\n' + cart.map(i => '- ' + i.name + ' ($' + i.price + ')').join('\\n') + '\\n\\nTổng thanh toán: $' + sum);
}`;
    }

    // BƯỚC 1: Lưu 3 file vào Virtual File System (IndexedDB)
    await vfs.saveFile({
      path: `${folderPath}/index.html`,
      name: 'index.html',
      folder: folderPath,
      content: generatedHtml,
      type: 'file',
      language: 'html',
      updatedAt: new Date().toISOString(),
      sizeBytes: new Blob([generatedHtml]).size,
    });

    await vfs.saveFile({
      path: `${folderPath}/style.css`,
      name: 'style.css',
      folder: folderPath,
      content: generatedCss,
      type: 'file',
      language: 'css',
      updatedAt: new Date().toISOString(),
      sizeBytes: new Blob([generatedCss]).size,
    });

    await vfs.saveFile({
      path: `${folderPath}/script.js`,
      name: 'script.js',
      folder: folderPath,
      content: generatedJs,
      type: 'file',
      language: 'javascript',
      updatedAt: new Date().toISOString(),
      sizeBytes: new Blob([generatedJs]).size,
    });

    onRefreshVFS?.();
    await refreshPreviewFromVFS(folderPath);

    // Phản hồi Streaming của Chatbot Mẹ
    const botResponse = `✅ **ĐÃ XÂY DỰNG XONG ỨNG DỤNG CON CON VÀO THƯ MỤC: \`${folderPath}\`**

**Quy trình đã hoàn tất tự động:**
1. 📁 **B1**: Tạo thư mục ảo IndexedDB \`${folderPath}\`
2. 📝 **B2**: Biên soạn 3 tệp mã nguồn độc lập:
   - \`${folderPath}/index.html\` (Giao diện chuẩn Tailwind CSS)
   - \`${folderPath}/style.css\` (Hiệu ứng Neon Cyberpunk)
   - \`${folderPath}/script.js\` (Logic tương tác)
3. ⚡ **B3**: Nạp runtime và kích hoạt máy chủ Iframe Sandbox nội bộ.

Commander có thể bấm vào nút **[CHẠY APP CON]** bên dưới để trải nghiệm ngay lập tức!`;

    setMessages((prev) => [
      ...prev,
      {
        id: newMsgId,
        role: 'model',
        content: botResponse,
        codeGenerated: {
          html: generatedHtml,
          css: generatedCss,
          js: generatedJs,
          appFolder: folderPath,
        },
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setIsBuilding(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/95 border border-amber-500/40 rounded-2xl overflow-hidden text-white font-mono text-xs shadow-[0_0_30px_rgba(245,158,11,0.2)]">
      {/* Top Header Tabs */}
      <div className="p-3 bg-black/80 border-b border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-amber-400" />
          <span className="font-black text-amber-300 tracking-wider">
            CHATBOT FULL STACK BUILDER (HỆ THỐNG MẸ)
          </span>
        </div>

        {/* View Switcher: Chat / Code Editor / Live Preview */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-white/10 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTabMode('chat')}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition ${
              activeTabMode === 'chat'
                ? 'bg-amber-400 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>HỘI THOẠI</span>
          </button>
          <button
            onClick={() => setActiveTabMode('editor')}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition ${
              activeTabMode === 'editor'
                ? 'bg-cyan-400 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>SỬA CODE (MONACO)</span>
          </button>
          <button
            onClick={() => {
              setActiveTabMode('preview');
              refreshPreviewFromVFS();
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition ${
              activeTabMode === 'preview'
                ? 'bg-emerald-400 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>CHẠY APP CON (PREVIEW)</span>
          </button>
        </div>
      </div>

      {/* Main Body depending on Active Tab Mode */}
      {activeTabMode === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                    <span className="font-bold text-amber-400">{isUser ? 'COMMANDER ROOT' : 'AI MASTER BUILDER'}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                      isUser
                        ? 'bg-amber-400/20 text-amber-100 border border-amber-400/40'
                        : 'bg-black/70 text-cyan-100 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Quick App Runner Button Card */}
                    {msg.codeGenerated && (
                      <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveAppFolder(msg.codeGenerated!.appFolder);
                            setActiveTabMode('preview');
                            refreshPreviewFromVFS(msg.codeGenerated!.appFolder);
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs flex items-center space-x-1.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer transition animate-bounce"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>CHẠY APP CON NGAY ({msg.codeGenerated.appFolder})</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTabMode('editor');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1 cursor-pointer border border-white/10"
                        >
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Mở Trong Editor</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isBuilding && (
              <div className="flex items-center space-x-2 text-amber-300 animate-pulse p-3 bg-black/60 rounded-xl border border-amber-400/30">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Đang điều động AI Lính biên soạn mã nguồn và khởi tạo IndexedDB...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-black/80 border-t border-white/10 flex items-center space-x-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập mệnh lệnh: 'Tạo cho tao 1 app bán hàng', 'Sửa app bán hàng cho đẹp hơn'..."
              className="flex-1 bg-slate-900 border border-amber-400/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={isBuilding}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>GỬI LỆNH</span>
            </button>
          </div>
        </div>
      )}

      {/* Code Editor View */}
      {activeTabMode === 'editor' && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          <div className="p-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-cyan-300">
                {currentEditingFile ? currentEditingFile.path : `${activeAppFolder}/index.html`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveEditorContent}
                className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center space-x-1 cursor-pointer shadow"
              >
                <span>Lưu Thay Đổi (IndexedDB)</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-2">
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="w-full h-full bg-[#0d1117] text-cyan-300 font-mono text-xs p-4 rounded-xl border border-white/10 focus:outline-hidden focus:border-cyan-400 resize-none"
              placeholder="Chọn một file từ cây thư mục VFS bên trái hoặc gõ lệnh để tạo code..."
            />
          </div>
        </div>
      )}

      {/* Live Preview View (Iframe Sandbox) */}
      {activeTabMode === 'preview' && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          <div className="p-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SANDBOX RUNTIME: {activeAppFolder}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-cyan-500 text-black' : 'text-slate-400'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-cyan-500 text-black' : 'text-slate-400'
                }`}
                title="Mobile View (iPhone)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => refreshPreviewFromVFS()}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="Tải lại Sandbox"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-3 bg-slate-900 overflow-hidden">
            <div
              className={`h-full transition-all rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-black ${
                previewDevice === 'mobile' ? 'w-[375px]' : 'w-full'
              }`}
            >
              <iframe
                srcDoc={previewHtmlDoc}
                title="Sovereign Sub-App Sandbox"
                className="w-full h-full border-none bg-black"
                sandbox="allow-scripts allow-modals"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
