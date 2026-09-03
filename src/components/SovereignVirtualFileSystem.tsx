import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderPlus,
  FilePlus,
  FileCode,
  FileText,
  Trash2,
  Edit3,
  Save,
  Upload,
  RefreshCw,
  Eye,
  Play,
  Check,
  Copy,
  ChevronRight,
  ChevronDown,
  Terminal,
  ExternalLink,
  Smartphone,
  Monitor,
  Code2,
  FileJson,
  Layers,
  Sparkles,
} from 'lucide-react';
import { vfs, VirtualFile } from '../services/virtualFileSystem';

interface SovereignVirtualFileSystemProps {
  onSelectFile?: (file: VirtualFile) => void;
  activeFilePath?: string;
}

export const SovereignVirtualFileSystem: React.FC<SovereignVirtualFileSystemProps> = ({
  onSelectFile,
  activeFilePath,
}) => {
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '/apps': true,
    '/apps/banhang': true,
    '/agents': true,
    '/memory': true,
    '/uploads': true,
  });
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [targetFolder, setTargetFolder] = useState('/apps');
  const [copied, setCopied] = useState(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    const list = await vfs.getAllFiles();
    setFiles(list);
    if (list.length > 0 && !selectedFile) {
      const match = list.find((f) => f.path === activeFilePath) || list[0];
      setSelectedFile(match);
      onSelectFile?.(match);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [activeFilePath]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleSelect = (file: VirtualFile) => {
    setSelectedFile(file);
    onSelectFile?.(file);
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    const cleanName = newFileName.trim();
    const folder = targetFolder.endsWith('/') ? targetFolder.slice(0, -1) : targetFolder;
    const path = `${folder}/${cleanName}`;

    let language = 'text';
    if (cleanName.endsWith('.html')) language = 'html';
    else if (cleanName.endsWith('.css')) language = 'css';
    else if (cleanName.endsWith('.js') || cleanName.endsWith('.ts')) language = 'javascript';
    else if (cleanName.endsWith('.json')) language = 'json';
    else if (cleanName.endsWith('.md')) language = 'markdown';

    const newFile: VirtualFile = {
      path,
      name: cleanName,
      folder,
      content: `// Khởi tạo file mới: ${cleanName}\n// Commander Root: HÙNG SỮA\n\n`,
      type: 'file',
      language,
      updatedAt: new Date().toISOString(),
      sizeBytes: 64,
    };

    await vfs.saveFile(newFile);
    await loadFiles();
    setSelectedFile(newFile);
    onSelectFile?.(newFile);
    setIsCreatingFile(false);
    setNewFileName('');
  };

  const handleDeleteFile = async (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (path.includes('root_command.txt')) {
      alert('⚠️ Không thể xóa file Mệnh lệnh tối cao root_command.txt!');
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa file ${path}?`)) {
      await vfs.deleteFile(path);
      await loadFiles();
    }
  };

  const handleUploadUserFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const textContent = (event.target?.result as string) || '';
        const path = `/uploads/${file.name}`;
        const newVirtualFile: VirtualFile = {
          path,
          name: file.name,
          folder: '/uploads',
          content: textContent,
          type: 'file',
          language: file.name.endsWith('.json') ? 'json' : file.name.endsWith('.md') ? 'markdown' : 'text',
          updatedAt: new Date().toISOString(),
          sizeBytes: file.size,
        };
        await vfs.saveFile(newVirtualFile);
        await loadFiles();
        setSelectedFile(newVirtualFile);
        onSelectFile?.(newVirtualFile);
      };
      reader.readAsText(file);
    }
  };

  // Group files by unique folder structure
  const folders: string[] = Array.from(new Set<string>(files.map((f) => f.folder))).sort();

  return (
    <div className="flex flex-col h-full bg-slate-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden text-white font-mono text-xs shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      {/* Top Bar / Actions */}
      <div className="p-3 bg-black/60 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Folder className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-cyan-300 tracking-wider">VIRTUAL FILE SYSTEM (INDEXEDDB)</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsCreatingFile(true)}
            className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 cursor-pointer"
            title="Tạo file mới"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileUploadInputRef}
            onChange={handleUploadUserFile}
            className="hidden"
            multiple
          />
          <button
            onClick={() => fileUploadInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 cursor-pointer"
            title="Upload file từ máy tính vào /uploads"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={loadFiles}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Làm mới VFS"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Create File Modal / Inline Input */}
      {isCreatingFile && (
        <div className="p-2.5 bg-amber-950/40 border-b border-amber-400/40 flex flex-col space-y-2">
          <span className="text-[10px] text-amber-300 font-bold">TẠO FILE MỚI TRONG THƯ MỤC:</span>
          <div className="flex items-center space-x-2">
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="bg-black border border-white/20 rounded p-1 text-[11px] text-white"
            >
              <option value="/apps/banhang">/apps/banhang</option>
              <option value="/apps">/apps</option>
              <option value="/agents">/agents</option>
              <option value="/memory">/memory</option>
              <option value="/uploads">/uploads</option>
            </select>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="ten_file.html, script.js..."
              className="flex-1 bg-black border border-amber-400/60 rounded px-2 py-1 text-[11px] text-white focus:outline-hidden"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsCreatingFile(false)}
              className="px-2 py-0.5 rounded bg-slate-800 text-[10px] hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              onClick={handleCreateFile}
              className="px-2.5 py-0.5 rounded bg-amber-400 text-black text-[10px] font-bold hover:bg-amber-300 shadow"
            >
              Tạo File
            </button>
          </div>
        </div>
      )}

      {/* Directory Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {folders.map((folder) => {
          const isExpanded = expandedFolders[folder] ?? true;
          const folderFiles = files.filter((f) => f.folder === folder);

          return (
            <div key={folder} className="space-y-0.5">
              {/* Folder Node */}
              <div
                onClick={() => toggleFolder(folder)}
                className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-slate-300 font-semibold select-none"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate text-cyan-200">{folder}</span>
                <span className="text-[10px] text-slate-500 font-normal">({folderFiles.length})</span>
              </div>

              {/* Child Files */}
              {isExpanded && (
                <div className="pl-4 space-y-0.5">
                  {folderFiles.map((file) => {
                    const isSelected = selectedFile?.path === file.path;
                    return (
                      <div
                        key={file.path}
                        onClick={() => handleSelect(file)}
                        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border-l-2 border-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          {file.language === 'html' ? (
                            <FileCode className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          ) : file.language === 'css' ? (
                            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          ) : file.language === 'javascript' ? (
                            <Code2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          ) : file.language === 'json' ? (
                            <FileJson className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          )}
                          <span className="truncate">{file.name}</span>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <span className="text-[9px] text-slate-500">{file.sizeBytes}B</span>
                          {!file.path.includes('root_command.txt') && (
                            <button
                              onClick={(e) => handleDeleteFile(file.path, e)}
                              className="p-1 text-slate-500 hover:text-red-400 transition"
                              title="Xóa file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Storage Footer Info */}
      <div className="p-2 bg-black/80 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>INDEXEDDB VFS ONLINE</span>
        </span>
        <span>{files.length} Files • 52,400 Embeddings</span>
      </div>
    </div>
  );
};
