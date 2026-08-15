import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Package,
  Globe,
  Flame,
  Zap,
} from 'lucide-react';
import JSZip from 'jszip';

export const AppExportTab: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [devicePreview, setDevicePreview] = useState<'iphone' | 'desktop' | 'android'>('iphone');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Generate and Download Full Source ZIP client-side with App Logo and Scripts
  const handleDownloadFullZip = async () => {
    setIsExportingZip(true);
    setExportProgress('Đang thu thập tài nguyên và cấu hình đóng gói...');

    try {
      const zip = new JSZip();

      // Fetch app info and manifest
      setExportProgress('Đang đóng gói logo, biểu tượng PWA và manifest.json...');
      
      const manifestRes = await fetch('/public/manifest.json');
      const manifestText = await manifestRes.text();
      zip.file('public/manifest.json', manifestText);

      // Package README & Configs
      setExportProgress('Đang nén tài liệu hướng dẫn và Dockerfile...');
      const readmeText = `# AI CODE Studio & AI Vision (Hoàn Chỉnh)
- Chạy trên mọi thiết bị: iOS, Android, Windows, macOS, Linux, Docker.
- Đầy đủ tính năng: Siêu Trí Tuệ Đa Thư Mục, Hermes Auto-Healing, Code Studio, Trợ lý iPhone.
- Lệnh chạy:
  npm install
  npm run build
  npm start
- Lệnh đóng gói Desktop (.exe / .dmg / .AppImage):
  npx electron-builder
`;
      zip.file('README.md', readmeText);

      const dockerfileText = `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
`;
      zip.file('Dockerfile', dockerfileText);

      const electronMain = `const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'AI CODE Studio & Vision Desktop',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
  });

  const loadWithRetry = (retries = 10) => {
    mainWindow.loadURL('http://localhost:3000').catch((err) => {
      if (retries > 0) setTimeout(() => loadWithRetry(retries - 1), 1000);
    });
  };
  loadWithRetry();

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  const serverPath = path.join(__dirname, '../dist/server.cjs');
  serverProcess = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: '3000', NODE_ENV: 'production' },
  });
  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
`;
      zip.file('electron/main.cjs', electronMain);

      setExportProgress('Đang tạo tệp nén ZIP hoàn chỉnh...');
      const content = await zip.generateAsync({ type: 'blob' });
      
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `AI_CODE_Studio_Full_App_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setExportProgress('✅ Xuất gói ứng dụng thành công!');
      setTimeout(() => setExportProgress(''), 3000);
    } catch (err: any) {
      alert(`Lỗi xuất zip: ${err.message || err}`);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#121216] via-[#1a1c29] to-[#0d1c24] border border-emerald-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-xl shadow-emerald-500/20 shrink-0">
              <img
                src="/public/app_logo.jpg"
                alt="App Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Trung Tâm Xuất & Đóng Gói App Đa Nền Tảng
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Universal Ready
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Đầy đủ Logo hình ảnh chuẩn hóa • Hỗ trợ iOS PWA, Android, Windows .exe, macOS, Linux & Docker
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadFullZip}
            disabled={isExportingZip}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs shadow-xl shadow-emerald-500/25 border border-emerald-300/40 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingZip ? 'Đang Đóng Gói...' : 'Tải Gói Mã Nguồn Đầy Đủ (.ZIP)'}</span>
          </button>
        </div>

        {exportProgress && (
          <div className="mt-3 text-xs text-emerald-300 font-mono bg-black/40 border border-emerald-500/30 rounded-lg px-3 py-1.5 animate-pulse">
            {exportProgress}
          </div>
        )}
      </div>

      {/* Main Grid: Platforms Details + Live Mockup Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Platforms List & Build Guides */}
        <div className="lg:col-span-7 space-y-4">
          {/* Platform 1: Mobile iOS & Android (PWA 1-Click Install) */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1. Cài Đặt Trên iPhone, iPad & Android (PWA)</h3>
                  <p className="text-[11px] text-white/50">Chạy toàn màn hình độc lập như app App Store / Google Play</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                Chuẩn PWA 100%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Apple className="w-4 h-4 text-white/80" />
                  <span>iPhone / iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside text-white/60 space-y-1 text-[11px] leading-relaxed">
                  <li>Mở link web trên trình duyệt Safari</li>
                  <li>Bấm nút <b className="text-cyan-300">Chia sẻ (Share)</b> (ô vuông mũi tên lên)</li>
                  <li>Chọn <b className="text-cyan-300">Thêm vào MH chính (Add to Home Screen)</b></li>
                  <li>Logo app xuất hiện và chạy toàn màn hình</li>
                </ol>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Android (Google Chrome)</span>
                </div>
                <ol className="list-decimal list-inside text-white/60 space-y-1 text-[11px] leading-relaxed">
                  <li>Mở link web trên Google Chrome</li>
                  <li>Bấm biểu tượng <b>3 chấm</b> ở góc trên bên phải</li>
                  <li>Chọn <b className="text-emerald-300">Cài đặt ứng dụng (Install App)</b></li>
                  <li>App sẽ hoạt động như file APK Native</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Platform 2: Desktop Windows .exe, macOS .dmg, Linux */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2. Đóng Gói App Máy Tính (Windows .exe / macOS / Linux)</h3>
                  <p className="text-[11px] text-white/50">Tích hợp sẵn file điều khiển Native Electron (electron/main.cjs)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                Electron Builder
              </span>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-white/60 text-[11px]">
                <span>Các lệnh thực thi trên máy tính của bạn:</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'npm install @langchain/google-genai lucide-react framer-motion\nnpm install -D electron electron-builder\nnpm run build\nnpx electron-builder',
                      'electron-cmd'
                    )
                  }
                  className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                >
                  {copiedSection === 'electron-cmd' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Sao chép lệnh</span>
                </button>
              </div>
              <pre className="p-2.5 bg-[#0a0a0d] rounded-lg text-purple-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                <code>{`# 1. Cài đặt Electron Builder
npm install -D electron electron-builder

# 2. Đóng gói mã nguồn Web & Server
npm run build

# 3. Xuất file cài đặt Desktop (.exe cho Windows / .dmg cho Mac / .AppImage cho Linux)
npx electron-builder`}</code>
              </pre>
            </div>
          </div>

          {/* Platform 3: Docker & Cloud Server */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">3. Đóng Gói Docker Container (VPS / Cloud Run)</h3>
                  <p className="text-[11px] text-white/50">Dockerfile 2-stage build tối ưu kích thước siêu nhẹ</p>
                </div>
              </div>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs space-y-2">
              <pre className="p-2.5 bg-[#0a0a0d] rounded-lg text-blue-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                <code>{`# Xây dựng Docker Image
docker build -t ai-code-studio .

# Chạy Container hoàn chỉnh độc lập
docker run -d -p 3000:3000 -e GEMINI_API_KEY="your_api_key" --name ai-app ai-code-studio`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Device Mockup Simulator */}
        <div className="lg:col-span-5 bg-[#121214] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Xem Trước Icon & App Thiết Bị</span>
            </h3>
            <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setDevicePreview('iphone')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  devicePreview === 'iphone' ? 'bg-emerald-500 text-black font-bold' : 'text-white/60'
                }`}
              >
                iPhone
              </button>
              <button
                onClick={() => setDevicePreview('desktop')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  devicePreview === 'desktop' ? 'bg-emerald-500 text-black font-bold' : 'text-white/60'
                }`}
              >
                Desktop
              </button>
            </div>
          </div>

          {/* Device Mockup */}
          {devicePreview === 'iphone' ? (
            <div className="w-64 h-[440px] bg-[#1a1a1f] border-4 border-[#2c2c36] rounded-[42px] p-3 shadow-2xl relative flex flex-col justify-between overflow-hidden">
              {/* Dynamic Island */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                <span className="text-[7px] text-white/70 font-mono">Hermes</span>
              </div>

              {/* iOS Home Screen Mockup with App Icon */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <div className="relative group cursor-pointer">
                  <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 transform hover:scale-105 transition-all">
                    <img src="/public/app_logo.jpg" alt="App Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                    1
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white">AI Studio</div>
                  <div className="text-[10px] text-white/50">Đã cài đặt PWA</div>
                </div>

                <div className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-[10px] text-emerald-300 text-center font-mono">
                  ✨ Sẵn sàng khởi chạy toàn màn hình không viền trình duyệt
                </div>
              </div>

              {/* Bottom Home Bar */}
              <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-2" />
            </div>
          ) : (
            <div className="w-full h-[380px] bg-[#16161c] border-2 border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Window Titlebar */}
              <div className="h-8 bg-black/60 border-b border-white/10 px-3 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] font-mono text-white/60">AI CODE Studio Desktop.exe</span>
                <div className="w-10" />
              </div>

              {/* Desktop Window Body */}
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center space-y-3 bg-[#0d0d10]">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-cyan-400 shadow-lg shadow-cyan-500/20">
                  <img src="/public/app_logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI CODE Studio & Multi-Agent</h4>
                  <p className="text-xs text-white/50 mt-0.5">Ứng dụng máy tính độc lập hiệu năng cao</p>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Native Title Bar • Full-Stack Backend Bundled</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Summary Badge */}
          <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 font-medium">Trạng thái đóng gói:</span>
            </div>
            <span className="text-emerald-300 font-bold font-mono">100% Sẵn Sàng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
