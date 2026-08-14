import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, Sparkles, HelpCircle, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface CommandPreset {
  title: string;
  category: 'env' | 'install' | 'api' | 'system';
  shell: 'powershell' | 'cmd';
  command: string;
  description: string;
}

const PRESET_COMMANDS: CommandPreset[] = [
  {
    title: 'Đặt GEMINI_API_KEY (PowerShell)',
    category: 'env',
    shell: 'powershell',
    command: '$env:GEMINI_API_KEY = "AIzaSyYourSecretApiKeyHere"',
    description: 'Thiết lập biến môi trường tạm thời trong phiên PowerShell hiện tại.',
  },
  {
    title: 'Đặt GEMINI_API_KEY Vĩnh viễn (PowerShell)',
    category: 'env',
    shell: 'powershell',
    command: '[System.Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "AIzaSyYourSecretApiKeyHere", "User")',
    description: 'Lưu biến môi trường Gemini API Key vĩnh viễn cho tài khoản Windows user.',
  },
  {
    title: 'Đặt GEMINI_API_KEY (CMD Windows)',
    category: 'env',
    shell: 'cmd',
    command: 'set GEMINI_API_KEY="AIzaSyYourSecretApiKeyHere"',
    description: 'Thiết lập biến môi trường trong cửa sổ Command Prompt (CMD).',
  },
  {
    title: 'Cài đặt Python SDK google-genai mới',
    category: 'install',
    shell: 'powershell',
    command: 'pip install google-genai --upgrade',
    description: 'Cài đặt hoặc cập nhật thư viện Google GenAI SDK chính thức mới nhất cho Python.',
  },
  {
    title: 'Cài đặt TypeScript SDK @google/genai',
    category: 'install',
    shell: 'powershell',
    command: 'npm install @google/genai',
    description: 'Cài đặt Node.js / TypeScript SDK chính thức mới nhất cho dự án web / server.',
  },
  {
    title: 'Gọi Gemini API trực tiếp qua REST (PowerShell Invoke-RestMethod)',
    category: 'api',
    shell: 'powershell',
    command: `$headers = @{ "Content-Type" = "application/json" }
$body = @{
    contents = @(
        @{ parts = @( @{ text = "Giải thích ngắn gọn tính năng AI nổi bật nhất của Gemini 3.6 Flash" } ) }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=$env:GEMINI_API_KEY" -Method Post -Headers $headers -Body $body`,
    description: 'Gửi yêu cầu REST API trực tiếp từ PowerShell không cần cài thêm SDK.',
  },
  {
    title: 'Kiểm tra phiên bản Python & Module google.genai',
    category: 'system',
    shell: 'powershell',
    command: 'python -c "import google.genai; print(google.genai.__version__)"',
    description: 'Kiểm tra phiên bản google-genai đã được cài đặt thành công trong môi trường Python chưa.',
  },
  {
    title: 'Gọi cURL trong CMD / PowerShell',
    category: 'api',
    shell: 'cmd',
    command: `curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=%GEMINI_API_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\\"contents\\": [{\\"parts\\": [{\\"text\\": \\"Hello Gemini\\ font-mono\\"}]}]}"`,
    description: 'Lệnh cURL chuẩn để test kết nối REST API Gemini trong CMD Windows.',
  },
];

export const PowerShellCmdTab: React.FC = () => {
  const [command, setCommand] = useState<string>(PRESET_COMMANDS[0].command);
  const [shellType, setShellType] = useState<'powershell' | 'cmd'>('powershell');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeCommand = async () => {
    if (!command.trim()) return;
    setLoading(true);
    setExplanation('');

    try {
      const promptText = `Bạn là một chuyên gia Hệ thống & AI. Hãy phân tích chi tiết lệnh Shell/PowerShell/CMD sau đây:

Môi trường Shell: ${shellType.toUpperCase()}
Lệnh cần phân tích:
\`\`\`shell
${command}
\`\`\`

Hãy giải thích bằng Tiếng Việt theo các mục rõ ràng sau:
1. 🎯 **Mục đích chính của lệnh**: Lệnh này làm gì trong Windows/PowerShell/CMD?
2. 🔍 **Giải thích cú pháp & các tham số (Flags / Variables)**: Phân tích từng tham số/biến.
3. 🔒 **Lưu ý Bảo mật & Best Practices**: (Ví dụ: cách ẩn API Key, quyền Administrator, biến môi trường tạm thời vs cố định).
4. 💡 **Cách ứng dụng trong lập trình AI (Python / Node.js)**: Làm sao để chuyển đổi thao tác này vào code thực tế?`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          model: 'gemini-3.6-flash',
          systemInstruction: 'Bạn là chuyên gia DevOps, PowerShell và Google GenAI SDK. Trả lời rõ ràng, định dạng Markdown đẹp mắt, chuẩn xác.',
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setExplanation(data.text);
      } else if (data.error) {
        setExplanation(`❌ Lỗi khi phân tích: ${data.error}`);
      }
    } catch (err: any) {
      setExplanation(`❌ Không thể kết nối Gemini API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Đọc & Giải Thích Lệnh PowerShell / CMD</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                AI Shell Analyzer
              </span>
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Phân tích cú pháp lệnh Terminal, cấu hình môi trường Gemini API Key và chạy lệnh REST trực tiếp.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#0a0a0a] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setShellType('powershell')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              shellType === 'powershell'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            PowerShell
          </button>
          <button
            onClick={() => setShellType('cmd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              shellType === 'cmd'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            CMD (Command Prompt)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Command Editor & Presets */}
        <div className="lg:col-span-6 space-y-6">
          {/* Presets */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
              Mẫu Lệnh Cài Đặt & Cấu Hình Phổ Biến
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COMMANDS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCommand(preset.command);
                    setShellType(preset.shell);
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#141414] hover:bg-white/10 text-white/80 hover:text-white font-mono text-left transition-colors"
                >
                  <span className="text-emerald-400 font-semibold mr-1">[{preset.shell.toUpperCase()}]</span>
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Input Box */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="bg-[#141414] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <span className="text-xs font-mono text-white/60 ml-2">
                  Windows {shellType === 'powershell' ? 'PowerShell 7.x' : 'Command Prompt (cmd.exe)'}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-white/60 hover:text-white flex items-center space-x-1 font-mono transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã copy' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-2 font-mono text-xs text-emerald-400">
                <span className="select-none text-white/40">PS C:\Users\Developer&gt;</span>
              </div>
              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                rows={7}
                placeholder="Nhập hoặc dán câu lệnh PowerShell / CMD vào đây..."
                className="w-full bg-transparent font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="p-3 bg-[#111111] border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-white/40 font-mono">
                Model trợ lý: gemini-3.6-flash
              </span>
              <button
                onClick={handleAnalyzeCommand}
                disabled={loading || !command.trim()}
                className="px-4 py-2 rounded-xl bg-[#27c93f] hover:bg-[#22b337] disabled:bg-white/10 disabled:text-white/30 text-black font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Đang đọc & phân tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Phân Tích Lệnh Bằng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Output Explanation */}
        <div className="lg:col-span-6 bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Kết Quả Phân Tích & Giải Thích Chi Tiết</h3>
            </div>

            {loading ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 text-white/40">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-white/60">Gemini AI đang phân tích cú pháp và biến môi trường...</p>
              </div>
            ) : explanation ? (
              <div className="font-sans text-xs text-white/90 leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] p-4 rounded-xl border border-white/10 max-h-[520px] overflow-y-auto space-y-2">
                {explanation}
              </div>
            ) : (
              <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 text-white/30">
                <HelpCircle className="w-10 h-10 text-white/20" />
                <p className="text-xs text-white/50 text-center max-w-sm">
                  Nhấn <strong className="text-emerald-400 font-normal">"Phân Tích Lệnh Bằng AI"</strong> để xem hướng dẫn từng bước, ý nghĩa cờ lệnh và lưu ý bảo mật khi chạy lệnh PowerShell.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 mt-4">
            <span>PowerShell 7+ / CMD</span>
            <span>Gemini 3.6 Flash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
