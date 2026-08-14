import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-json';

interface CodeBlockProps {
  code: string;
  language?: 'python' | 'typescript' | 'bash' | 'powershell' | 'json' | string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGrammarAndLang = (langStr: string) => {
    const l = langStr.toLowerCase();
    if (l === 'python' || l === 'py') return { grammar: Prism.languages.python, name: 'python' };
    if (l === 'typescript' || l === 'ts') return { grammar: Prism.languages.typescript, name: 'typescript' };
    if (l === 'powershell' || l === 'ps' || l === 'ps1') return { grammar: Prism.languages.powershell || Prism.languages.bash, name: 'powershell' };
    if (l === 'bash' || l === 'sh' || l === 'shell') return { grammar: Prism.languages.bash, name: 'bash' };
    if (l === 'json') return { grammar: Prism.languages.json, name: 'json' };
    return { grammar: Prism.languages[l] || Prism.languages.python, name: l };
  };

  const { grammar, name } = getGrammarAndLang(language);
  const trimmedCode = code.trim();
  
  let highlightedHtml = '';
  try {
    highlightedHtml = Prism.highlight(trimmedCode, grammar, name);
  } catch {
    highlightedHtml = trimmedCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const linesHtml = highlightedHtml.split('\n');

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] text-stone-100 overflow-hidden shadow-lg font-mono text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white/80 font-semibold tracking-wide uppercase text-[10px]">
            {title || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#27c93f]" />
              <span className="text-[#27c93f] text-[11px] font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div className="p-4 overflow-x-auto max-h-[500px] leading-relaxed bg-[#0a0a0a]">
        <table className="w-full border-collapse">
          <tbody>
            {linesHtml.map((lineHtml, index) => (
              <tr key={index} className="hover:bg-white/[0.03]">
                <td className="w-8 select-none text-right pr-4 text-white/30 text-[11px] align-top font-mono">
                  {index + 1}
                </td>
                <td
                  className="whitespace-pre align-top font-mono text-emerald-300"
                  dangerouslySetInnerHTML={{ __html: lineHtml || ' ' }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

