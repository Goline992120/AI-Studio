import { GeminiModelInfo } from '../types';

export const GEMINI_MODELS: GeminiModelInfo[] = [
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    category: 'text',
    recommendedFor: 'Mô hình Flagship 2026: Hybrid Reasoning (Thinking Budget linh hoạt) & Lập trình siêu tốc',
    supportsThinking: true,
    tier: 'general',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    category: 'text',
    recommendedFor: 'Tác vụ phức tạp, suy luận chiều sâu & kiến trúc mã nguồn lớn',
    supportsThinking: true,
    tier: 'complex',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    category: 'text',
    recommendedFor: 'Mô hình siêu nhẹ, độ trễ cực thấp, tối ưu chi phí & phản hồi tức thì',
    supportsThinking: false,
    tier: 'fast',
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    category: 'text',
    recommendedFor: 'Bản phát hành Gemini Flash mới nhất với khả năng thích ứng cao',
    supportsThinking: false,
    tier: 'general',
  },
  {
    id: 'gemini-3.1-flash-lite-image',
    name: 'Gemini 3.1 Flash Lite Image',
    category: 'image',
    recommendedFor: 'Tạo hình ảnh & chỉnh sửa ảnh siêu tốc',
  },
  {
    id: 'gemini-3.1-flash-image',
    name: 'Gemini 3.1 Flash Image',
    category: 'image',
    recommendedFor: 'Tạo ảnh chất lượng cao tùy chỉnh tỉ lệ khung hình',
  },
  {
    id: 'gemini-3-pro-image',
    name: 'Gemini 3 Pro Image',
    category: 'image',
    recommendedFor: 'Tạo ảnh chuyên nghiệp độ phân giải cao 2K/4K',
  },
];

export const PYTHON_PIP_COMMAND = 'pip install google-genai';
export const TS_NPM_COMMAND = 'npm install @google/genai';

export const MIGRATION_EXAMPLES = [
  {
    feature: 'Import SDK & Khởi Tạo Client (Gemini 3.7 Flash)',
    legacyPython: `import google.generativeai as genai\n\ngenai.configure(api_key=os.environ["GEMINI_API_KEY"])\nmodel = genai.GenerativeModel("gemini-1.5-flash")`,
    newPython: `from google import genai\n\nclient = genai.Client()  # Tự động đọc GEMINI_API_KEY từ biến môi trường\nresponse = client.models.generate_content(\n    model="gemini-3.7-flash",\n    contents="Xin chào Gemini 3.7 Flash!"\n)`,
    legacyTs: `import { GoogleGenerativeAI } from "@google/generative-ai";\n\nconst genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);\nconst model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });`,
    newTs: `import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\nconst response = await ai.models.generateContent({\n  model: "gemini-3.7-flash",\n  contents: "Xin chào Gemini 3.7 Flash!"\n});`,
    notes: 'SDK hợp nhất mới sử dụng client.models.generate_content (Python) / ai.models.generateContent (TS) với mô hình Gemini 3.7 Flash và tự động phát hiện biến môi trường GEMINI_API_KEY.'
  },
  {
    feature: 'Thinking Mode & Cấu Hình Thinking Budget (Gemini 3.7 Flash)',
    legacyPython: `# Legacy SDK không hỗ trợ điều chỉnh Thinking Budget động`,
    newPython: `from google import genai\nfrom google.genai import types\n\nclient = genai.Client()\nresponse = client.models.generate_content(\n    model="gemini-3.7-flash",\n    contents="Thiết kế thuật toán phân tán chịu lỗi cho microservices.",\n    config=types.GenerateContentConfig(\n        thinking_config=types.ThinkingConfig(\n            thinking_budget=4096,  # 0 để tắt thinking, hoặc 1024-8192 tokens\n        ),\n        temperature=0.7,\n    )\n)`,
    legacyTs: `// Chưa hỗ trợ cấu hình Thinking Budget động`,
    newTs: `import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\nconst response = await ai.models.generateContent({\n  model: "gemini-3.7-flash",\n  contents: "Thiết kế thuật toán phân tán chịu lỗi cho microservices.",\n  config: {\n    thinkingConfig: {\n      thinkingBudget: 4096, // 0 = tắt suy luận nhanh, > 0 = suy luận sâu\n    },\n    temperature: 0.7,\n  }\n});`,
    notes: 'Gemini 3.7 Flash là mô hình đầu tiên hỗ trợ Hybrid Reasoning: điều chỉnh thinkingBudget linh hoạt từ 0 (siêu tốc) đến 8192 (suy luận sâu sắc).'
  },
  {
    feature: 'Xuất Dữ Liệu JSON Cấu Trúc Ngắt Nghoéo (Schema)',
    legacyPython: `response = model.generate_content(\n    "Liệt kê 3 loại trái cây",\n    generation_config={"response_mime_type": "application/json"}\n)`,
    newPython: `from google import genai\nfrom google.genai import types\nfrom pydantic import BaseModel\n\nclass Fruit(BaseModel):\n    name: str\n    color: str\n\nclient = genai.Client()\nresponse = client.models.generate_content(\n    model="gemini-3.7-flash",\n    contents="Liệt kê 3 loại trái cây",\n    config=types.GenerateContentConfig(\n        response_mime_type="application/json",\n        response_schema=list[Fruit],\n    )\n)`,
    legacyTs: `// Cần parse chuỗi thủ công không có kiểm soát kiểu`,
    newTs: `import { GoogleGenAI, Type } from "@google/genai";\n\nconst response = await ai.models.generateContent({\n  model: "gemini-3.7-flash",\n  contents: "Liệt kê 3 loại trái cây",\n  config: {\n    responseMimeType: "application/json",\n    responseSchema: {\n      type: Type.ARRAY,\n      items: {\n        type: Type.OBJECT,\n        properties: {\n          name: { type: Type.STRING },\n          color: { type: Type.STRING }\n        }\n      }\n    }\n  }\n});`,
    notes: 'Python hỗ trợ định nghĩa Pydantic schema trực tiếp (list[Fruit]). TypeScript hỗ trợ enum Type chính thức từ @google/genai.'
  },
  {
    feature: 'Xử Lý Phản Hồi Dạng Streaming (Gemini 3.7 Flash)',
    legacyPython: `response = model.generate_content("Kể một câu chuyện", stream=True)\nfor chunk in response:\n    print(chunk.text)`,
    newPython: `client = genai.Client()\nfor chunk in client.models.generate_content_stream(\n    model="gemini-3.7-flash",\n    contents="Kể một câu chuyện"\n):\n    print(chunk.text, end="")`,
    legacyTs: `const result = await model.generateContentStream("Kể một câu chuyện");\nfor await (const chunk of result.stream) {\n  console.log(chunk.text());\n}`,
    newTs: `const response = await ai.models.generateContentStream({\n  model: "gemini-3.7-flash",\n  contents="Kể một câu chuyện"\n});\nfor await (const chunk of response) {\n  console.log(chunk.text);\n}`,
    notes: 'Truy cập thẳng thuộc tính chunk.text (không cần gọi hàm chunk.text()).'
  }
];
