import React, { useState } from 'react';
import { PlaygroundConfig } from '../types';
import { generatePythonCode, generateTypeScriptCode } from '../utils/codeGenerator';
import { CodeBlock } from './CodeBlock';
import { Code2, Columns, Copy, Check, Download, RefreshCw } from 'lucide-react';

interface CodeStudioTabProps {
  config: PlaygroundConfig;
}

export const CodeStudioTab: React.FC<CodeStudioTabProps> = ({ config }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'python' | 'typescript'>('side-by-side');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const pythonCode = generatePythonCode(config);
  const tsCode = generateTypeScriptCode(config);

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/export-project-zip');
      if (!res.ok) throw new Error('Export ZIP failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gemini-sdk-studio-full-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download project zip failed:', err);
      alert('Không thể tải file đóng gói ZIP. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Bar Controls */}
      <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Mã Nguồn SDK Được Tự Động Sinh</span>
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Sao chép mã nguồn sản xuất sẵn sàng chạy khớp cấu hình thử nghiệm cho Python (<code className="text-emerald-400 font-mono">google-genai</code>) và TypeScript (<code className="text-cyan-400 font-mono">@google/genai</code>).
          </p>
        </div>

        {/* View Toggle & Zip Download */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer shadow-md border border-emerald-400/30 shrink-0"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang nén ZIP...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã Tải ZIP!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Xuất File Đóng Gói (.ZIP)</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-1 p-1 bg-[#141414] rounded-xl text-xs border border-white/5 shrink-0">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'side-by-side' ? 'bg-white/10 text-emerald-400 font-semibold border border-white/10 shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              Song Song Both
            </button>
            <button
              onClick={() => setViewMode('python')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'python' ? 'bg-white/10 text-emerald-400 font-semibold border border-white/10 shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              Chỉ Python
            </button>
            <button
              onClick={() => setViewMode('typescript')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'typescript' ? 'bg-white/10 text-emerald-400 font-semibold border border-white/10 shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              Chỉ TypeScript
            </button>
          </div>
        </div>
      </div>

      {/* Code Display Grid */}
      <div className={`grid gap-6 ${viewMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Python Block */}
        {(viewMode === 'side-by-side' || viewMode === 'python') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white/80 px-1">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
                <span>Python SDK (<code className="font-mono text-amber-300">google-genai</code>)</span>
              </span>
              <span className="text-white/40 font-mono text-[11px]">pip install google-genai</span>
            </div>
            <CodeBlock code={pythonCode} language="python" title="Python (google-genai)" />
          </div>
        )}

        {/* TypeScript Block */}
        {(viewMode === 'side-by-side' || viewMode === 'typescript') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white/80 px-1">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>TypeScript SDK (<code className="font-mono text-cyan-300">@google/genai</code>)</span>
              </span>
              <span className="text-white/40 font-mono text-[11px]">npm install @google/genai</span>
            </div>
            <CodeBlock code={tsCode} language="typescript" title="TypeScript (@google/genai)" />
          </div>
        )}

      </div>

    </div>
  );
};
