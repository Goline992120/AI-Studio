// Virtual File System with IndexedDB + LocalStorage fallback
export interface VirtualFile {
  path: string; // e.g. "/apps/banhang/index.html"
  name: string;
  folder: string; // e.g. "/apps/banhang"
  content: string;
  type: 'file' | 'folder';
  language: string; // "html" | "css" | "javascript" | "json" | "markdown" | "text"
  updatedAt: string;
  sizeBytes: number;
}

const DB_NAME = 'SovereignCommanderVFS';
const DB_VERSION = 1;
const STORE_NAME = 'files';

class VirtualFileSystemService {
  private db: IDBDatabase | null = null;
  private isReadyPromise: Promise<boolean>;

  constructor() {
    this.isReadyPromise = this.initDB();
  }

  private async initDB(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return false;
    }

    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'path' });
            store.createIndex('folder', 'folder', { unique: false });
          }
        };
        req.onsuccess = (e: any) => {
          this.db = e.target.result;
          this.seedInitialFiles();
          resolve(true);
        };
        req.onerror = () => {
          console.warn('IndexedDB failed to initialize, falling back to LocalStorage');
          this.seedInitialFilesLocalStorage();
          resolve(false);
        };
      } catch (err) {
        resolve(false);
      }
    });
  }

  private getInitialFiles(): VirtualFile[] {
    const now = new Date().toISOString();
    return [
      {
        path: '/memory/root_command.txt',
        name: 'root_command.txt',
        folder: '/memory',
        content: `=====================================================
SOVEREIGN COMMANDER V10.0 - ROOT OPERATIONAL DIRECTIVES
COMMANDER ROOT: HÙNG SỮA
SYSTEM STATUS: SOVEREIGN REIGN ACTIVE
=====================================================

1. LUẬT TỐI CAO:
   - Toàn bộ 50 AI Lính (GPT-4o, Claude, Gemini, DeepSeek, Midjourney, Sora, Suno, ElevenLabs...) hoạt động dưới sự chỉ huy trực tiếp của App Mẹ.
   - Không được phép rò rỉ API Keys ra bên ngoài.
   - Mọi tiến trình tạo app con (/apps/*) đều phải được cách ly và render trong Sandbox Iframe an toàn.

2. MỆNH LỆNH THỰC THI:
   - Khi nhận lệnh "Tạo app", Chatbot Full Stack Builder tự động khởi tạo folder /apps/[app_name], sinh 3 file: index.html, style.css, script.js và kích hoạt Live Preview tức thì.
   - Mọi bản ghi sửa đổi code phải được lưu trữ bền vững vào IndexedDB.`,
        type: 'file',
        language: 'text',
        updatedAt: now,
        sizeBytes: 840,
      },
      {
        path: '/apps/banhang/index.html',
        name: 'index.html',
        folder: '/apps/banhang',
        content: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberStore Sovereign v10.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-white font-sans min-h-screen p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <header class="flex items-center justify-between border-b border-cyan-500/30 pb-4">
      <div>
        <h1 class="text-2xl font-black text-amber-400 font-mono tracking-wider">⚡ CYBERSTORE SOVEREIGN</h1>
        <p class="text-xs text-cyan-300">Gian hàng công nghệ cao cấp • Xây dựng bởi Sovereign Builder</p>
      </div>
      <button onclick="openCart()" class="px-4 py-2 rounded-xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 transition">
        🛒 GIỎ HÀNG (<span id="cart-count">0</span>)
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="product-grid">
      <!-- Sản phẩm 1 -->
      <div class="bg-slate-900 border border-amber-400/40 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(245,158,11,0.15)]">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Cyber Shoes" class="rounded-xl h-40 object-cover mb-3">
        <h3 class="font-bold text-white text-base">Aureon Cyber Sneaker 8K</h3>
        <p class="text-xs text-slate-400 my-1">Đế nano lượng tử đàn hồi cao và LED viền.</p>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span class="text-lg font-black text-amber-400">$199.00</span>
          <button onclick="addToCart('Aureon Cyber Sneaker 8K', 199)" class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition">Mua ngay</button>
        </div>
      </div>

      <!-- Sản phẩm 2 -->
      <div class="bg-slate-900 border border-cyan-400/40 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" alt="Headphone" class="rounded-xl h-40 object-cover mb-3">
        <h3 class="font-bold text-white text-base">Quantum ANC Pro Headset</h3>
        <p class="text-xs text-slate-400 my-1">Chống ồn chủ động 99.8% tần số cao.</p>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span class="text-lg font-black text-cyan-400">$299.00</span>
          <button onclick="addToCart('Quantum ANC Pro Headset', 299)" class="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition">Mua ngay</button>
        </div>
      </div>

      <!-- Sản phẩm 3 -->
      <div class="bg-slate-900 border border-purple-400/40 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" alt="Smart Watch" class="rounded-xl h-40 object-cover mb-3">
        <h3 class="font-bold text-white text-base">Titanium Sovereign Chrono</h3>
        <p class="text-xs text-slate-400 my-1">Theo dõi sinh trắc học và định vị vệ tinh.</p>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span class="text-lg font-black text-purple-400">$349.00</span>
          <button onclick="addToCart('Titanium Sovereign Chrono', 349)" class="px-3 py-1.5 rounded-lg bg-purple-400 hover:bg-purple-300 text-black text-xs font-bold transition">Mua ngay</button>
        </div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
        type: 'file',
        language: 'html',
        updatedAt: now,
        sizeBytes: 3200,
      },
      {
        path: '/apps/banhang/style.css',
        name: 'style.css',
        folder: '/apps/banhang',
        content: `/* Custom Sovereign Store Styling */
body {
  background-color: #030712;
  color: #f3f4f6;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.02); }
}

.product-card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.product-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.3);
}`,
        type: 'file',
        language: 'css',
        updatedAt: now,
        sizeBytes: 420,
      },
      {
        path: '/apps/banhang/script.js',
        name: 'script.js',
        folder: '/apps/banhang',
        content: `// Sovereign Store Controller
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price, time: new Date().toLocaleTimeString() });
  document.getElementById('cart-count').innerText = cart.length;
  alert('Đã thêm ' + name + ' vào giỏ hàng thành công!');
}

function openCart() {
  if (cart.length === 0) {
    alert('Giỏ hàng hiện đang trống!');
    return;
  }
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const itemsStr = cart.map(i => '- ' + i.name + ' ($' + i.price + ')').join('\\n');
  alert('GIỎ HÀNG CỦA BẠN:\\n' + itemsStr + '\\n\\nTổng cộng: $' + total);
}`,
        type: 'file',
        language: 'javascript',
        updatedAt: now,
        sizeBytes: 600,
      },
      {
        path: '/agents/config.json',
        name: 'config.json',
        folder: '/agents',
        content: `{
  "commander": "HÙNG SỮA",
  "activeArmyCount": 50,
  "defaultRouterModel": "gemini-3.7-flash",
  "highLevelTaskModel": "claude-3-5-sonnet",
  "visionModel": "gemini-2.5-pro",
  "emergencyHalt": false,
  "sandboxSecurity": "ENFORCED"
}`,
        type: 'file',
        language: 'json',
        updatedAt: now,
        sizeBytes: 280,
      },
      {
        path: '/uploads/welcome.md',
        name: 'welcome.md',
        folder: '/uploads',
        content: `# THƯ MỤC UPLOADS RIÊNG BIỆT
Nơi đây lưu trữ toàn bộ file tài liệu, hình ảnh, mã nguồn và dữ liệu do Commander tải lên.
Hệ thống Virtual File System (VFS) sẽ tự động lưu vào IndexedDB nội bộ của trình duyệt.`,
        type: 'file',
        language: 'markdown',
        updatedAt: now,
        sizeBytes: 250,
      },
    ];
  }

  private seedInitialFiles() {
    if (!this.db) return;
    const tx = this.db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const countReq = store.count();
    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        const writeTx = this.db!.transaction(STORE_NAME, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_NAME);
        for (const file of this.getInitialFiles()) {
          writeStore.put(file);
        }
      }
    };
  }

  private seedInitialFilesLocalStorage() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem('sovereign_vfs_files');
    if (!existing) {
      localStorage.setItem('sovereign_vfs_files', JSON.stringify(this.getInitialFiles()));
    }
  }

  public async getAllFiles(): Promise<VirtualFile[]> {
    await this.isReadyPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.getAllFilesLocalStorage());
      });
    }
    return this.getAllFilesLocalStorage();
  }

  private getAllFilesLocalStorage(): VirtualFile[] {
    if (typeof window === 'undefined') return this.getInitialFiles();
    const data = localStorage.getItem('sovereign_vfs_files');
    return data ? JSON.parse(data) : this.getInitialFiles();
  }

  public async saveFile(file: VirtualFile): Promise<boolean> {
    await this.isReadyPromise;
    file.updatedAt = new Date().toISOString();
    file.sizeBytes = new Blob([file.content]).size;

    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(file);
        req.onsuccess = () => {
          this.syncToLocalStorage();
          resolve(true);
        };
        req.onerror = () => resolve(false);
      });
    }

    const files = this.getAllFilesLocalStorage();
    const idx = files.findIndex((f) => f.path === file.path);
    if (idx >= 0) files[idx] = file;
    else files.push(file);
    localStorage.setItem('sovereign_vfs_files', JSON.stringify(files));
    return true;
  }

  public async deleteFile(path: string): Promise<boolean> {
    await this.isReadyPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(path);
        req.onsuccess = () => {
          this.syncToLocalStorage();
          resolve(true);
        };
        req.onerror = () => resolve(false);
      });
    }

    const files = this.getAllFilesLocalStorage().filter((f) => f.path !== path);
    localStorage.setItem('sovereign_vfs_files', JSON.stringify(files));
    return true;
  }

  public async getFile(path: string): Promise<VirtualFile | null> {
    await this.isReadyPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(path);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    const files = this.getAllFilesLocalStorage();
    return files.find((f) => f.path === path) || null;
  }

  private async syncToLocalStorage() {
    if (!this.db || typeof window === 'undefined') return;
    const tx = this.db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      localStorage.setItem('sovereign_vfs_files', JSON.stringify(req.result || []));
    };
  }
}

export const vfs = new VirtualFileSystemService();
