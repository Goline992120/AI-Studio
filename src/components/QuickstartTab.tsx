import React from 'react';
import { PYTHON_PIP_COMMAND, TS_NPM_COMMAND } from '../data/constants';
import { CodeBlock } from './CodeBlock';
import { Terminal, CheckCircle2, ShieldAlert, Cpu, Key, Rocket } from 'lucide-react';

export const QuickstartTab: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Welcome */}
      <div className="bg-[#141414] text-white rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Hướng Dẫn Khởi Động Nhanh: <code className="text-emerald-400 font-mono">google-genai</code></h2>
            <p className="text-xs text-white/60 mt-1">
              Bộ SDK chính thức thế hệ mới của Google dành cho Python (<code className="text-amber-300 font-mono">google-genai</code>) và Node.js/TypeScript (<code className="text-cyan-300 font-mono">@google/genai</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Step 0: Autonomous Hermes Agent Installation */}
      <div className="bg-gradient-to-br from-cyan-950/40 via-indigo-950/30 to-[#0f0f0f] rounded-2xl p-6 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-cyan-400 text-black text-xs font-bold flex items-center justify-center">
              ⚡
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Cài Đặt Tác Nhân Tự Hành Hermes Agent (Nous Research)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Official Release
              </span>
            </h3>
          </div>
          <span className="text-xs text-cyan-300/80 font-mono">Tự phục hồi &amp; Tự vá lỗi 100%</span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Cài đặt Hermes Agent chính thức từ Nous Research bằng 1 dòng lệnh duy nhất để kích hoạt quyền kiểm soát tự trị, xử lý lỗi API siêu tốc và tự động phục hồi:
        </p>

        <div>
          <CodeBlock 
            code={`# Cài đặt chính thức Hermes Agent (Linux / macOS / Container):\ncurl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash\n\n# Cài đặt qua Windows PowerShell:\nirm https://hermes-agent.nousresearch.com/install.ps1 | iex`} 
            language="bash" 
            title="Lệnh Cài Đặt Hermes Agent" 
          />
        </div>
      </div>

      {/* Step 1: Installation */}
      <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-[#27c93f] text-black text-xs font-bold flex items-center justify-center">
            1
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight">Cài Đặt Thư Viện SDK</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-white/80 block mb-2 font-mono">Cài Đặt Cho Python (pip)</span>
            <CodeBlock code={PYTHON_PIP_COMMAND} language="bash" title="Terminal (Python)" />
          </div>

          <div>
            <span className="text-xs font-semibold text-white/80 block mb-2 font-mono">Cài Đặt Cho Node.js / TypeScript (npm)</span>
            <CodeBlock code={TS_NPM_COMMAND} language="bash" title="Terminal (Node.js)" />
          </div>
        </div>
      </div>

      {/* Step 2: Environment Variables */}
      <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-[#27c93f] text-black text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight">Cấu Hình Biến Môi Trường</h3>
        </div>

        <p className="text-xs text-white/70 leading-relaxed font-sans">
          Đối tượng <code className="font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">genai.Client()</code> trong Python và <code className="font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">new GoogleGenAI()</code> trong TypeScript sẽ tự động nhận diện biến môi trường <code className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">GEMINI_API_KEY</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock
            code={`# Linux / macOS / Bash\nexport GEMINI_API_KEY="khoa-api-gemini-cua-ban"\n\n# Windows PowerShell\n$env:GEMINI_API_KEY="khoa-api-gemini-cua-ban"`}
            language="bash"
            title="Thiết Lập Biến Môi Trường Terminal"
          />

          <CodeBlock
            code={`# Tệp .env tại thư mục gốc\nGEMINI_API_KEY="khoa-api-gemini-cua-ban"`}
            language="bash"
            title="Ví Dụ Tệp .env"
          />
        </div>
      </div>

      {/* Step 3: Minimal Executable Scripts */}
      <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-[#27c93f] text-black text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight">Gọi API Lần Đầu Tiên (Hello World)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-semibold text-amber-300 block mb-2 font-mono">Mã Nguồn Python (<code className="font-mono">main.py</code>)</span>
            <CodeBlock
              code={`from google import genai\n\n# Client tự động đọc GEMINI_API_KEY\nclient = genai.Client()\n\nresponse = client.models.generate_content(\n    model="gemini-3.6-flash",\n    contents="Viết 1 câu chào mừng lập trình viên bằng tiếng Việt.",\n)\n\nprint(response.text)`}
              language="python"
              title="Python (google-genai)"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-cyan-300 block mb-2 font-mono">Mã Nguồn TypeScript Server (<code className="font-mono">index.ts</code>)</span>
            <CodeBlock
              code={`import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({\n  apiKey: process.env.GEMINI_API_KEY,\n});\n\nasync function main() {\n  const response = await ai.models.generateContent({\n    model: "gemini-3.6-flash",\n    contents: "Viết 1 câu chào mừng lập trình viên bằng tiếng Việt.",\n  });\n  console.log(response.text);\n}\n\nmain();`}
              language="typescript"
              title="TypeScript (@google/genai)"
            />
          </div>
        </div>
      </div>

      {/* Best Practices Checklist */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#27c93f]" />
          <span>Quy Chuẩn Lập Trình & Tính Năng Nổi Bật Của SDK</span>
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/70">
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>Client Hợp Nhất:</strong> Một điểm truy cập duy nhất (<code className="font-mono text-emerald-300">Client()</code> trong Python, <code className="font-mono text-cyan-300">GoogleGenAI</code> trong TS) cho văn bản, hình ảnh, âm thanh, video và Live API.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>Truy Cập Trực Tiếp:</strong> Đọc nội dung phản hồi trực tiếp qua <code className="font-mono text-emerald-300">response.text</code> (không phải lời gọi hàm).</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>An Toàn Kiểu Dữ Liệu:</strong> Hỗ trợ Pydantic model trong Python và TypeScript enum chính thức cho JSON cấu trúc.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>Bảo Mật Phía Server:</strong> Luôn thực thi các lời gọi API Gemini ở backend API routes để giữ kín API Key.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
