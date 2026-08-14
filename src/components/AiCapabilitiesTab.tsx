import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles, Image, Code2, Zap, MessageSquare, Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface CapabilityItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  description: string;
  models: string[];
  pythonCode: string;
  tsCode: string;
  highlights: string[];
}

const AI_CAPABILITIES: CapabilityItem[] = [
  {
    id: 'text-reasoning',
    title: 'Text & Hybrid Reasoning (Gemini 3.7 Flash & 3.1 Pro)',
    subtitle: 'Mô hình xử lý ngôn ngữ & suy luận linh hoạt Hybrid Thinking thế hệ mới',
    category: 'Core AI',
    badge: 'FLAGSHIP 2026',
    description: 'Xử lý văn bản, lập trình, suy luận nhiều bước với khả năng tùy chỉnh Thinking Budget (0 - 4096+ tokens) cho tốc độ siêu tốc hoặc suy luận phân tích sâu.',
    models: ['gemini-3.7-flash', 'gemini-3.1-pro-preview'],
    pythonCode: `from google import genai
from google.genai import types

client = genai.Client()

# Gemini 3.7 Flash với Hybrid Reasoning (Thinking Budget)
response = client.models.generate_content(
    model="gemini-3.7-flash",
    contents="Giải thích nguyên lý hoạt động của Quantum Computing bằng ví dụ đơn giản.",
    config=types.GenerateContentConfig(
        temperature=0.3,
        system_instruction="Bạn là giáo sư vật lý giải thích cho học sinh lớp 12.",
        thinking_config=types.ThinkingConfig(
            thinking_budget=2048  # 0 cho siêu tốc, hoặc 2048+ cho suy luận sâu
        )
    )
)

print(response.text)`,
    tsCode: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: "Giải thích nguyên lý hoạt động của Quantum Computing bằng ví dụ đơn giản.",
    config: {
      temperature: 0.3,
      systemInstruction: "Bạn là giáo sư vật lý giải thích cho học sinh lớp 12.",
      thinkingConfig: {
        thinkingBudget: 2048, // 0 cho cực hạn tốc độ, hoặc 2048+ cho phân tích sâu
      }
    },
  });
  console.log(response.text);
}`,
    highlights: [
      'Hỗ trợ Hybrid Reasoning & Thinking Budget linh hoạt',
      'Độ trễ cực thấp (Sub-second) khi đặt thinkingBudget = 0',
      'Tương thích hoàn toàn với cú pháp chuẩn @google/genai mới nhất',
    ],
  },
  {
    id: 'high-thinking',
    title: 'High Thinking Mode (Suy Luận Chuyên Sâu)',
    subtitle: 'Chế độ suy luận logic phức tạp cho toán, thuật toán và phân tích hệ thống',
    category: 'Reasoning AI',
    badge: 'THINKING HIGH',
    description: 'Sử dụng mô hình gemini-3.1-pro-preview với tham số thinkingLevel set thành HIGH để giải quyết các bài toán hóc húa, phân tích lỗ hổng bảo mật và thiết kế kiến trúc hệ thống.',
    models: ['gemini-3.1-pro-preview'],
    pythonCode: `from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents="Hãy lập kế hoạch tối ưu hóa thuật toán Dijkstra cho đồ thị 1 triệu đỉnh.",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level="HIGH"
        )
    )
)

print(response.text)`,
    tsCode: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runHighThinking() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: "Hãy lập kế hoạch tối ưu hóa thuật toán Dijkstra cho đồ thị 1 triệu đỉnh.",
    config: {
      thinkingConfig: {
        thinkingLevel: "HIGH"
      }
    }
  });

  console.log(response.text);
}`,
    highlights: [
      'Bật thinkingLevel: "HIGH" cho tư duy logic nâng cao',
      'Được thiết kế riêng cho bài toán thuật toán và lập trình phức tạp',
      'Đảm bảo không bị giới hạn tokens tự do',
    ],
  },
  {
    id: 'search-grounding',
    title: 'Search & Maps Grounding (Tra Cứu Trực Tuyến)',
    subtitle: 'Kết nối thông tin Google Search & Google Maps theo thời gian thực',
    category: 'Grounding AI',
    badge: 'REAL-TIME DATA',
    description: 'Sử dụng công cụ googleSearch và googleMaps với mô hình gemini-3.5-flash để truy xuất tin tức mới nhất, địa điểm thực tế và thời tiết chính xác.',
    models: ['gemini-3.5-flash'],
    pythonCode: `from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Tin tức sự kiện công nghệ nổi bật nhất hôm nay là gì?",
    config={
        "tools": [{"googleSearch": {}}]
    }
)

print(response.text)`,
    tsCode: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runSearchGrounding() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "Tin tức sự kiện công nghệ nổi bật nhất hôm nay là gì?",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  console.log(response.text);
}`,
    highlights: [
      'Sử dụng tool googleSearch / googleMaps trực tiếp',
      'Truy cập dữ liệu web thời gian thực từ Google',
      'Trích dẫn nguồn tin uy tín và minh bạch',
    ],
  },
  {
    id: 'screen-vision',
    title: 'Quan Sát Màn Hình Windows Live (Vision Multimodal)',
    subtitle: 'Truyền hình ảnh màn hình trực tiếp để phân tích và chẩn đoán lỗi',
    category: 'Multimodal Vision',
    badge: 'LIVE SCREEN VISION',
    description: 'Quan sát giao diện Windows, đọc lỗi compiler/terminal, OCR dữ liệu từ màn hình và đưa ra câu lệnh PowerShell/CMD xử lý ngay tức thì.',
    models: ['gemini-3.6-flash', 'gemini-3.1-pro-preview'],
    pythonCode: `from google import genai

client = genai.Client()

# Đọc file ảnh màn hình Windows
with open("screen_capture.png", "rb") as f:
    image_bytes = f.read()

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=[
        {"inline_data": {"mime_type": "image/png", "data": image_bytes}},
        "Hãy chẩn đoán dòng lỗi compiler màu đỏ trên màn hình và đưa ra câu lệnh PowerShell sửa lỗi."
    ]
)

print(response.text)`,
    tsCode: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeScreen(base64Image: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
      "Hãy chẩn đoán dòng lỗi compiler màu đỏ trên màn hình và đưa ra câu lệnh PowerShell sửa lỗi.",
    ],
  });

  console.log(response.text);
}`,
    highlights: [
      'Hỗ trợ truyền hình ảnh base64 trực tiếp qua inlineData',
      'Chẩn đoán lỗi IDE, đọc văn bản OCR siêu chính xác',
      'Tương thích hoàn hảo với tính năng Live Screen Share',
    ],
  },
  {
    id: 'image-generation',
    title: 'Tạo & Chỉnh Sửa Hình Ảnh (Image Generation)',
    subtitle: 'Tạo hình ảnh chất lượng cao từ văn bản với Imagen 3 / Gemini Image',
    category: 'Multimodal',
    badge: 'IMAGEN 3',
    description: 'Tạo ảnh minh họa, thiết kế giao diện, logo, banner truyền thông với tùy chỉnh tỉ lệ khung hình (Aspect Ratio 1:1, 16:9, 9:16, 4:3).',
    models: ['gemini-3.1-flash-lite-image'],
    pythonCode: `from google import genai

client = genai.Client()

result = client.models.generate_images(
    model="gemini-3.1-flash-lite-image",
    prompt="Một thành phố Cyberpunk hiện đại lung linh ánh đèn neon về đêm, độ phân giải cao",
    config={
        "number_of_images": 1,
        "aspect_ratio": "16:9",
        "output_mime_type": "image/jpeg"
    }
)

for generated_image in result.generated_images:
    # Trả về bytes dữ liệu hình ảnh
    image_bytes = generated_image.image.image_bytes`,
    tsCode: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImage() {
  const response = await ai.models.generateImages({
    model: "gemini-3.1-flash-lite-image",
    prompt: "Một thành phố Cyberpunk hiện đại lung linh ánh đèn neon về đêm, độ phân giải cao",
    config: {
      numberOfImages: 1,
      aspectRatio: "16:9",
      outputMimeType: "image/jpeg",
    },
  });

  const base64Image = response.generatedImages[0].image.imageBytes;
}`,
    highlights: [
      'Tùy chọn Aspect Ratio chuẩn 16:9, 1:1, 9:16',
      'Định dạng đầu ra JPEG / PNG chuẩn base64/bytes',
      'Tạo ảnh siêu tốc phù hợp ứng dụng thực tế',
    ],
  },
  {
    id: 'structured-json',
    title: 'Xuất Dữ Liệu Cấu Trúc JSON (Structured Outputs)',
    subtitle: 'Yêu cầu AI trả về định dạng JSON nghiêm ngặt theo Schema',
    category: 'Structured Data',
    badge: 'PYDANTIC & TS SCHEMA',
    description: 'Đảm bảo dữ liệu đầu ra tuân thủ 100% định dạng JSON mong muốn để parse trực tiếp vào ứng dụng web/mobile mà không lo rủi ro sai cú pháp.',
    models: ['gemini-3.6-flash'],
    pythonCode: `from google import genai
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    name: str
    skills: list[str]
    years_experience: int
    summary: str

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Tạo hồ sơ chuyên gia lập trình Python Senior",
    config={
        "response_mime_type": "application/json",
        "response_schema": UserProfile,
    }
)

print(response.text) # JSON hợp lệ 100%`,
    tsCode: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getStructuredData() {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Tạo hồ sơ chuyên gia lập trình TypeScript Senior",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          yearsExperience: { type: Type.INTEGER },
          summary: { type: Type.STRING }
        },
        required: ["name", "skills", "yearsExperience"]
      }
    }
  });

  const profile = JSON.parse(response.text);
}`,
    highlights: [
      'Hỗ trợ Pydantic Type Schema trực tiếp trong Python',
      'Hỗ trợ enum Type.OBJECT, Type.STRING, Type.ARRAY trong TypeScript',
      'Không bị nhiễu markdown hay thừa câu chữ',
    ],
  },
  {
    id: 'streaming',
    title: 'Phản Hồi Dạng Streaming (Real-time SSE)',
    subtitle: 'Nhận từng từ / token theo thời gian thực như ChatGPT',
    category: 'Real-time',
    badge: 'SSE STREAMING',
    description: 'Hiển thị câu trả lời ngay lập tức khi mô hình đang sinh dữ liệu, mang lại trải nghiệm người dùng tức thì.',
    models: ['gemini-3.6-flash', 'gemini-3.1-pro-preview'],
    pythonCode: `from google import genai

client = genai.Client()

response = client.models.generate_content_stream(
    model="gemini-3.6-flash",
    contents="Viết bài luận ngắn về tương lai của AI trong y tế."
)

for chunk in response:
    print(chunk.text, end="", flush=True)`,
    tsCode: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function streamResponse() {
  const responseStream = await ai.models.generateContentStream({
    model: "gemini-3.6-flash",
    contents: "Viết bài luận ngắn về tương lai của AI trong y tế.",
  });

  for await (const chunk of responseStream) {
    process.stdout.write(chunk.text);
  }
}`,
    highlights: [
      'Phương thức generate_content_stream() / generateContentStream()',
      'Đọc từng chunk nhỏ và truyền thẳng ra client bằng Server-Sent Events',
      'Tối ưu cảm giác phản hồi mịn màng',
    ],
  },
  {
    id: 'function-calling',
    title: 'Gọi Hàm & Công Cụ Tự Động (Function Calling)',
    subtitle: 'Cho phép Gemini AI tự động kích hoạt các hàm/API của hệ thống',
    category: 'Agentic AI',
    badge: 'TOOL USE',
    description: 'Gemini tự động xác định khi nào cần gọi hàm mã nguồn (ví dụ: tra cứu giá thời tiết, truy vấn SQL, gửi email) và nhận kết quả để trả lời.',
    models: ['gemini-3.6-flash'],
    pythonCode: `from google import genai

def get_current_weather(location: str) -> str:
    """Lấy thời tiết hiện tại cho một địa điểm."""
    return f"Thời tiết tại {location} là 28°C, nắng nhẹ."

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Thời tiết hôm nay ở Đà Nẵng thế nào?",
    config={
        "tools": [get_current_weather]
    }
)

print(response.text)`,
    tsCode: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const weatherTool = {
  functionDeclarations: [{
    name: "getCurrentWeather",
    description: "Lấy thời tiết hiện tại cho địa điểm",
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "Tên thành phố" }
      },
      required: ["location"]
    }
  }]
};

async function runTool() {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Thời tiết hôm nay ở Đà Nẵng thế nào?",
    config: { tools: [weatherTool] }
  });
}`,
    highlights: [
      'Truyền trực tiếp Python function vào config.tools',
      'Gemini tự động phân tích tham số hàm và tạo lệnh gọi',
      'Hỗ trợ xây dựng Agent AI tự động hóa công việc',
    ],
  },
];

export const AiCapabilitiesTab: React.FC = () => {
  const [selectedCap, setSelectedCap] = useState<string>(AI_CAPABILITIES[0].id);
  const activeItem = AI_CAPABILITIES.find((c) => c.id === selectedCap) || AI_CAPABILITIES[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Tổng Quan Toàn Bộ Tính Năng AI Hiện Nay & Mới Nhất</span>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Google GenAI 2026
              </span>
            </h2>
            <p className="text-xs text-white/60 mt-1">
              Khám phá bộ tính năng AI vượt trội của Gemini 3.6 Flash & 3.1 Pro với code ví dụ chuẩn cho Python (<code className="text-amber-300 font-mono">google-genai</code>) và TypeScript (<code className="text-cyan-300 font-mono">@google/genai</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {AI_CAPABILITIES.map((cap) => {
          const isActive = cap.id === selectedCap;
          return (
            <button
              key={cap.id}
              onClick={() => setSelectedCap(cap.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-[#1a1a1a] border-emerald-500/50 text-white shadow-lg shadow-emerald-500/5'
                  : 'bg-[#0f0f0f] border-white/10 text-white/60 hover:text-white hover:bg-[#141414]'
              }`}
            >
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/40'
                }`}>
                  {cap.badge}
                </span>
                <h3 className="text-xs font-bold text-white mt-2 leading-tight">
                  {cap.title.split('(')[0]}
                </h3>
              </div>
              <span className="text-[11px] text-white/40 font-mono flex items-center space-x-1">
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Card View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6"
        >
          {/* Card Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeItem.category}
              </span>
              <span className="text-xs font-mono text-white/40">•</span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Model: {activeItem.models.join(', ')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {activeItem.title}
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              {activeItem.description}
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeItem.highlights.map((h, i) => (
            <div key={i} className="p-3 bg-[#141414] border border-white/5 rounded-xl flex items-start space-x-2 text-xs text-white/80">
              <CheckCircle2 className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Code Implementations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-semibold text-amber-300 block mb-2 font-mono flex items-center justify-between">
              <span>Python Code (<code className="text-amber-400 font-mono">google-genai</code>)</span>
              <span className="text-[11px] text-white/40 font-normal">pip install google-genai</span>
            </span>
            <CodeBlock code={activeItem.pythonCode} language="python" title={`Python - ${activeItem.title}`} />
          </div>

          <div>
            <span className="text-xs font-semibold text-cyan-300 block mb-2 font-mono flex items-center justify-between">
              <span>TypeScript Code (<code className="text-cyan-400 font-mono">@google/genai</code>)</span>
              <span className="text-[11px] text-white/40 font-normal">npm install @google/genai</span>
            </span>
            <CodeBlock code={activeItem.tsCode} language="typescript" title={`TypeScript - ${activeItem.title}`} />
          </div>
        </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
};
