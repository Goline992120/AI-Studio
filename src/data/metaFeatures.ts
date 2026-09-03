export interface MetaFeatureItem {
  id: number;
  name: string;
  icon: string;
  desc: string;
  api: string;
  category: 'HỘI THOẠI' | 'TẠO ẢNH/VIDEO' | 'GIỌNG NÓI/VISION' | 'AGENT/SOVEREIGN';
  groupColor: 'cyan' | 'gold' | 'purple' | 'emerald';
  status: string;
}

export const META_40_GROUPS = [
  { id: 'chat', title: 'HỘI THOẠI & SIÊU TRÍ TUỆ', count: 6, color: 'cyan', badge: 'text-cyan-300 border-cyan-400/50 bg-cyan-950/40' },
  { id: 'media', title: 'TẠO ẢNH & VIDEO 8K', count: 10, color: 'gold', badge: 'text-amber-300 border-amber-400/50 bg-amber-950/40' },
  { id: 'multimodal', title: 'GIỌNG NÓI & OMNI VISION', count: 10, color: 'purple', badge: 'text-purple-300 border-purple-400/50 bg-purple-950/40' },
  { id: 'agent', title: 'AGENT & SOVEREIGN EMPIRE', count: 14, color: 'emerald', badge: 'text-emerald-300 border-emerald-400/50 bg-emerald-950/40' },
] as const;

export const META_15: MetaFeatureItem[] = [
  // ==========================================
  // NHÓM 1: HỘI THOẠI (6 CHỨC NĂNG) - CYAN
  // ==========================================
  { id: 1, name: "Chat Llama 4 405B", icon: "💬", desc: "Chat Llama 4 405B với bộ nhớ 10M Token & đa phương thức", api: "/api/chat", category: "HỘI THOẠI", groupColor: "cyan", status: "ONLINE" },
  { id: 2, name: "GPT-5 Omni Pro", icon: "🧠", desc: "Siêu trí tuệ suy luận toán học, lý luận logic đỉnh cao", api: "/api/gpt5", category: "HỘI THOẠI", groupColor: "cyan", status: "ONLINE" },
  { id: 3, name: "Gemini 2.5 Pro Ultra", icon: "✨", desc: "Mô hình triệu token đọc toàn bộ thư viện sách trong 1s", api: "/api/gemini", category: "HỘI THOẠI", groupColor: "cyan", status: "ONLINE" },
  { id: 4, name: "Claude 4.0 Opus", icon: "🎭", desc: "Bậc thầy lập trình kiến trúc và sáng tạo văn phong tinh tế", api: "/api/claude", category: "HỘI THOẠI", groupColor: "cyan", status: "ONLINE" },
  { id: 5, name: "DeepSeek R1 Quantum", icon: "🐳", desc: "Mô hình lý luận chuỗi tư duy mở siêu tiết kiệm tài nguyên", api: "/api/deepseek", category: "HỘI THOẠI", groupColor: "cyan", status: "ONLINE" },
  { id: 6, name: "Grok 3 Colossus", icon: "🚀", desc: "AI thời gian thực kết nối mạng xã hội và phân tích xu hướng", api: "/api/grok", category: "HỘI THOẠI", groupColor: "cyan", status: "ONLINE" },

  // ==========================================
  // NHÓM 2: TẠO ẢNH / VIDEO (10 CHỨC NĂNG) - GOLD
  // ==========================================
  { id: 7, name: "Imagine Emu Ultra", icon: "🎨", desc: "Tạo ảnh 4K Emu / Flux chất lượng điện ảnh 1024x1024", api: "/api/imagine", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 8, name: "Flux 1.1 Pro HD", icon: "⚡", desc: "Công nghệ sinh ảnh chi tiết sợi tóc và ánh sáng chân thực", api: "/api/flux", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 9, name: "Midjourney v7 Core", icon: "🌌", desc: "Phong cách nghệ thuật thị giác và minh họa chuyên nghiệp", api: "/api/midjourney", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 10, name: "Movie Gen 8K", icon: "🎬", desc: "Tạo video 8K từ văn bản prompt điện ảnh thời gian thực", api: "/api/movie", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 11, name: "OpenAI Sora Studio", icon: "🎥", desc: "Vật lý video chân thực 60fps với độ nét chuẩn studio", api: "/api/sora", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 12, name: "Runway Gen-4 Ultra", icon: "🎞️", desc: "Điều khiển chuyển động camera, ánh sáng 3D đa hướng", api: "/api/runway", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 13, name: "Google Veo 2 Cinema", icon: "📽️", desc: "Đạo diễn phim AI tự động tạo cảnh quay cinematic dài tập", api: "/api/veo", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 14, name: "Kling 1.5 HD Video", icon: "📹", desc: "Chuyển động nhân vật mượt mà với mô phỏng cơ thể học", api: "/api/kling", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 15, name: "Luma Dream Machine", icon: "💫", desc: "Tạo cảnh quay 3D không gian ảo từ 1 tấm ảnh tĩnh", api: "/api/luma", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },
  { id: 16, name: "Stable Diffusion 3.5", icon: "🖼️", desc: "Sinh đồ họa vector, typography và concept art chính xác", api: "/api/sd3", category: "TẠO ẢNH/VIDEO", groupColor: "gold", status: "ONLINE" },

  // ==========================================
  // NHÓM 3: GIỌNG NÓI & VISION (10 CHỨC NĂNG) - PURPLE
  // ==========================================
  { id: 17, name: "Voice Clone Studio", icon: "🎙️", desc: "Clone giọng nói Neural HD chuẩn xác 99.4% chỉ sau 3s", api: "/api/voice", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 18, name: "ElevenLabs Prime HD", icon: "🎧", desc: "Truyền cảm xúc giọng đọc đa ngôn ngữ với ngữ điệu tự nhiên", api: "/api/elevenlabs", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 19, name: "Suno v4 Music Studio", icon: "🎵", desc: "Sáng tác ca khúc hoàn chỉnh có lời và phối khí chuẩn phòng thu", api: "/api/suno", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 20, name: "Udio AI Symphony", icon: "🎼", desc: "Hòa âm phối khí nhạc giao hưởng và nhạc điện tử đỉnh cao", api: "/api/udio", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 21, name: "OpenAI Whisper v3", icon: "👂", desc: "Nhận diện giọng nói siêu chuẩn bỏ qua tạp âm 100 ngôn ngữ", api: "/api/whisper", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 22, name: "Omni Vision 360", icon: "👁️", desc: "Phân tích ảnh, PDF, hóa đơn, bảng biểu & nhận diện camera", api: "/api/vision", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 23, name: "Realtime Voice Matrix", icon: "🗣️", desc: "Đàm thoại song phương thời gian thực độ trễ dưới 200ms", api: "/api/realtime_voice", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 24, name: "Ray-Ban Meta Vision", icon: "👓", desc: "Thị giác không gian kính thông minh nhận diện vật thể xung quanh", api: "/api/rayban", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 25, name: "Instant Translator 4K", icon: "🌐", desc: "Dịch thuật giọng nói và văn bản thời gian thực đa ngữ", api: "/api/translate", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },
  { id: 26, name: "Neural Sound FX Gen", icon: "🔊", desc: "Tạo hiệu ứng âm thanh điện ảnh chuyên dụng cho phim ảnh", api: "/api/sfx", category: "GIỌNG NÓI/VISION", groupColor: "purple", status: "ONLINE" },

  // ==========================================
  // NHÓM 4: AGENT & SOVEREIGN (14 CHỨC NĂNG) - EMERALD
  // ==========================================
  { id: 27, name: "Auto Post Engine", icon: "📱", desc: "Tự động đăng bài FB/TikTok/IG/Threads theo giờ và auto-reply", api: "/api/post", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 28, name: "Business AI Advisor", icon: "💼", desc: "Tư vấn kinh doanh $500k 24/7, chốt đơn tự động & tối ưu chi phí", api: "/api/business", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 29, name: "Code Genie v6.0", icon: "⚡", desc: "Viết code tự động, review kiến trúc & thực thi JS/Python", api: "/api/code", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 30, name: "Devin AI Engineer", icon: "💻", desc: "Kỹ sư phần mềm AI tự động giải quyết bug và deploy app", api: "/api/devin", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 31, name: "CrewAI Multi-Agent", icon: "🤖", desc: "Hội đồng 10 AI tự động phối hợp phân công hoàn thành dự án", api: "/api/crewai", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 32, name: "AutoGPT Quantum", icon: "🔄", desc: "Tác nhân tự sinh mục tiêu và tự động thực thi chuỗi tác vụ", api: "/api/autogpt", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 33, name: "Ads Factory 1000", icon: "📢", desc: "Sinh 1000 mẫu quảng cáo FB/TikTok đa biến thể tỷ lệ chuyển đổi cao", api: "/api/ads", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 34, name: "Drone Control Quantum", icon: "🚁", desc: "Điều khiển drone lượng tử, dẫn đường bay tự hành AI", api: "/api/drone", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 35, name: "Cyber Shield 256-bit", icon: "🛡️", desc: "Bảo mật quantum, mã hóa AES-GCM-256 chống xâm nhập", api: "/api/shield", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 36, name: "Sovereign Chain Fund", icon: "⛓️", desc: "Blockchain $500K quỹ bảo chứng & 127 doanh nghiệp kết nối", api: "/api/chain", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 37, name: "AI Workforce 50 Agents", icon: "👥", desc: "Đội ngũ 50 nhân viên AI tự chủ vận hành 24/7 không cần lương", api: "/api/workforce", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 38, name: "Auto Factory 1000 Videos", icon: "🏭", desc: "Sản xuất tự động 1000 videos viral/ngày không cần người", api: "/api/factory", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 39, name: "One-Click Empire", icon: "👑", desc: "Nhân bản đế chế doanh nghiệp tự động với 1 cú click", api: "/api/empire", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
  { id: 40, name: "Hermes Autonomous Core", icon: "🏛️", desc: "Bộ não tối cao điều phối 40 phân hệ thời gian thực", api: "/api/hermes", category: "AGENT/SOVEREIGN", groupColor: "emerald", status: "ONLINE" },
];
