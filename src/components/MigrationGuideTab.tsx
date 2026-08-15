import React from 'react';
import { MIGRATION_EXAMPLES } from '../data/constants';
import { CodeBlock } from './CodeBlock';
import { BookOpen, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MigrationGuideTab: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Intro Header */}
      <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Cẩm Nang Chuyển Đổi SDK: Cũ vs <code className="text-emerald-400 font-mono">google-genai</code></h2>
            <p className="text-xs text-white/50 mt-0.5">
              Các gói thư viện cũ <code className="font-mono text-white/80">google-generativeai</code> (Python) và <code className="font-mono text-white/80">@google/generative-ai</code> (Node.js) đã chính thức được thay thế hoàn toàn bởi các bộ SDK hợp nhất thế hệ mới.
            </p>
          </div>
        </div>
      </div>

      {/* Model Updates Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-1 text-amber-300">Lưu Ý Quan Trọng Về Mô Hình Cũ (Deprecated)</span>
          <p className="text-amber-200/80 leading-relaxed font-sans">
            Các mô hình cũ như <code className="font-mono font-semibold text-amber-300">gemini-1.5-flash</code>, <code className="font-mono font-semibold text-amber-300">gemini-1.5-pro</code>, và <code className="font-mono font-semibold text-amber-300">gemini-2.0-flash</code> đã được thay thế. Hãy chuyển sang <code className="font-mono font-semibold text-emerald-400">gemini-3.7-flash</code> cho xử lý văn bản và lập trình, <code className="font-mono font-semibold text-cyan-400">gemini-3.1-pro-preview</code> cho suy luận chuyên sâu & code lớn, và <code className="font-mono font-semibold text-purple-400">gemini-3.1-flash-lite-image</code> cho sinh hình ảnh.
          </p>
        </div>
      </div>

      {/* Migration Feature Cards */}
      <div className="space-y-8">
        {MIGRATION_EXAMPLES.map((example, idx) => (
          <div key={idx} className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 shadow-lg space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span>{example.feature}</span>
              </h3>
            </div>

            <p className="text-xs text-white/70 bg-[#141414] p-3 rounded-xl border border-white/5">
              💡 <strong>Điểm Cải Tiến Cốt Lõi:</strong> {example.notes}
            </p>

            {/* Python Comparison */}
            <div>
              <span className="text-xs font-semibold text-amber-300 block mb-2 flex items-center space-x-1 font-mono">
                <span>So Sánh Python:</span>
                <span className="line-through text-white/30 font-mono">google.generativeai</span>
                <ArrowRight className="w-3 h-3 text-white/40" />
                <span className="font-mono text-amber-400">google.genai</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-red-400 block mb-1">❌ Cũ (Legacy Python)</span>
                  <CodeBlock code={example.legacyPython} language="python" title="Cú Pháp Cũ Python" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 block mb-1">✅ Mới (google-genai)</span>
                  <CodeBlock code={example.newPython} language="python" title="Cú Pháp Mới google-genai Python" />
                </div>
              </div>
            </div>

            {/* TypeScript Comparison */}
            <div>
              <span className="text-xs font-semibold text-cyan-300 block mb-2 flex items-center space-x-1 font-mono">
                <span>So Sánh TypeScript:</span>
                <span className="line-through text-white/30 font-mono">@google/generative-ai</span>
                <ArrowRight className="w-3 h-3 text-white/40" />
                <span className="font-mono text-cyan-400">@google/genai</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-red-400 block mb-1">❌ Cũ (Legacy JS)</span>
                  <CodeBlock code={example.legacyTs} language="typescript" title="Cú Pháp Cũ TypeScript" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 block mb-1">✅ Mới (@google/genai)</span>
                  <CodeBlock code={example.newTs} language="typescript" title="Cú Pháp Mới @google/genai TS" />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
