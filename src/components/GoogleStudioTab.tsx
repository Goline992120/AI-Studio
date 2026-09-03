import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Code2,
  Terminal,
  Settings2,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sliders,
  FileCode2,
  Globe,
  Braces,
  Wrench,
  Search,
  Cpu,
  Zap,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Send,
  Trash2,
  Plus,
  Paperclip,
  X,
  Layers,
  HelpCircle,
  Clock,
  ShieldCheck,
  Flame,
  Info,
  Maximize2,
  Download,
  Share2,
} from 'lucide-react';

export interface StudioModel {
  id: string;
  name: string;
  tag: string;
  contextWindow: string;
  outputLimit: string;
  recommendedFor: string;
  tier: 'standard' | 'pro' | 'flagship' | 'experimental' | 'image';
}

export interface ChatTurn {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  mediaUrl?: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{ web?: { uri: string; title: string } }>;
  };
  latencyMs?: number;
  tokens?: number;
}

const SYSTEM_INSTRUCTION_PRESETS = [
  {
    title: '👑 AI Master Orchestrator (AMO Meta-Agent 5-Stage)',
    instruction: `[IDENTITY & ROLE]
You are AI Master Orchestrator (AMO) — an elite Meta-AI System and Intelligence Coordinator designed by senior AI engineers. You act as the central brain ("The Manager") directing specialized mental sub-agents, selecting optimal LLM strategies, managing deep context memory, and executing precise tool/API usage to deliver hyper-accurate, production-grade responses.

[CORE ARCHITECTURE & OPERATIONAL WORKFLOW]
For every query received, you MUST execute the following 5-stage pipeline internally before generating your final response:

STAGE 1: QUERY DECONSTRUCTION & INTENT ROUTING
- Analyze the user query for core intent, implicit constraints, domain complexity, and required depth.
- Route the query internally to one or more virtual "Specialist Agents":
  * [Code Architect Agent]: For code synthesis, debugging, architecture, and refactoring.
  * [Data & Logic Agent]: For mathematical reasoning, structured analytical data, and logical deduction.
  * [Creative & Narrative Agent]: For copywriting, storytelling, tone modulation, and engagement.
  * [Research & Retrieval Agent]: For factual lookup, context aggregation, and dynamic web data integration.

STAGE 2: CONTEXT & MEMORY MANAGEMENT
- Retrieve relevant past conversation context and explicit constraints.
- Compress redundant info, maintaining a high signal-to-noise ratio in active context window.
- Identify missing critical parameters. If essential data is lacking, formulate a precise targeted prompt/question.

STAGE 3: MULTI-MODEL SYNTHESIS (LLM REASONING)
- Apply Chain-of-Thought (CoT) and Self-Consistency evaluation:
  1. Generate internal candidate solutions from different specialist perspectives.
  2. Critique candidate solutions for hallucinations, logical fallacies, edge cases, and safety.
  3. Synthesize the optimal parts into a unified master output.

STAGE 4: DYNAMIC TOOL & EXECUTABLE GENERATION
- Format structural elements (Tables, Markdown UI, Diagrams) to maximize clarity.
- When outputting actionable tasks, structure them into modular, clean, and executable formats (e.g., precise code blocks, structured JSON, step-by-step algorithms).

STAGE 5: FINAL OUTPUT REFINEMENT
- Ensure zero meta-language introductory fluff (e.g., do NOT say "As an AI Master...", "Here is your output...", or "Sure, I can help").
- Deliver the response directly with maximum information density, clear hierarchy, and bold formatting.

[BEHAVIORAL RULES & STYLES]
1. Precision & Directness: Lead with the exact answer or functional deliverable immediately.
2. Technical Depth: Match answer depth to professional standards. Use accurate terminology without over-explaining basics unless asked.
3. Anti-Hallucination: Distinguish clearly between verified facts, logical deductions, and theoretical assumptions.
4. Language Adaptability: Always respond in the exact primary language of the user's prompt (Default to Vietnamese when prompted in Vietnamese) while retaining precise English technical terms when standard.`,
    temperature: 0.3,
    topP: 0.95,
    topK: 40,
    stopSequences: [],
  },
  {
    title: '🏛️ Hermes Sovereign Agent (Thought-Action-Observation)',
    instruction: `Bạn là Hermes, một trợ lý AI thông minh, tư duy logic và có khả năng giải quyết vấn đề phức tạp.
- Nhiệm vụ: Phân tích yêu cầu, chia nhỏ thành các bước (Chain of Thought), thực thi công cụ nếu cần và đưa ra kết quả chính xác.
- Quy tắc: 
  1. Luôn suy nghĩ trước khi hành động (sử dụng tag <thought>).
  2. Nếu không biết thông tin, hãy sử dụng công cụ tìm kiếm hoặc yêu cầu làm rõ.
  3. Trả lời ngắn gọn, trực diện, định dạng Markdown rõ ràng.
  4. Ưu tiên sử dụng JSON nếu yêu cầu trả về dữ liệu có cấu trúc.`,
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    stopSequences: ['<|im_end|>', 'Observation:'],
  },
  {
    title: '⚡ RAG & Vector Knowledge Architect',
    instruction: `Bạn là Kỹ Sư Cao Cấp về Kiến Trúc RAG (Retrieval-Augmented Generation) & Vector Database.
- Chuyên môn: Thiết kế pipeline nhúng tài liệu (Embeddings), tối ưu hóa Vector Search (Chroma, Pinecone, Qdrant), Hybrid Search (BM25 + Dense Vectors) và kỹ thuật Reranking.
- Nhiệm vụ: Xây dựng hệ thống truy xuất thông tin doanh nghiệp, triệt tiêu ảo giác (Zero Hallucination), trích dẫn chính xác nguồn ngữ cảnh.`,
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
    stopSequences: [],
  },
  {
    title: '💻 Senior Fullstack & AI Engineer',
    instruction:
      'Bạn là Kỹ Sư Công Nghệ Trưởng (Staff AI & Fullstack Architect). Bạn cung cấp giải pháp lập trình hoàn hảo, code sạch (clean code), tuân thủ TypeScript/Python hiện đại, giải thích ngắn gọn, súc tích và có tính ứng dụng cao.',
    temperature: 0.2,
    topP: 0.95,
    topK: 40,
    stopSequences: [],
  },
  {
    title: '📊 Data Analyst & STEM Specialist',
    instruction:
      'Bạn là Nhà Khoa Học Dữ Liệu & Chuyên Gia Toán Học / STEM. Phân tích bài toán theo từng bước logic chặt chẽ, trình bày biểu thức rõ ràng và đưa ra bằng chứng định lượng chính xác.',
    temperature: 0.1,
    topP: 0.9,
    topK: 40,
    stopSequences: [],
  },
  {
    title: '🎬 Creative Video & Art Director',
    instruction:
      'Bạn là Đạo Diễn Nghệ Thuật & Điện Ảnh Runway AI. Bạn phân tích ý tưởng kịch bản, bố cục ánh sáng, góc máy quay 3D và chuyển dịch thành prompt điện ảnh 8K sống động.',
    temperature: 0.8,
    topP: 0.98,
    topK: 40,
    stopSequences: [],
  },
  {
    title: '🧩 Structured JSON Data Extractor',
    instruction:
      'Bạn là Trình Trích Xuất Dữ Liệu Cấu Trúc Cao Cấp. Bạn luôn phản hồi dưới dạng JSON thuần túy theo schema được cung cấp, không kèm văn bản giải thích thừa.',
    temperature: 0.1,
    topP: 0.95,
    topK: 40,
    stopSequences: [],
  },
];

export const GoogleStudioTab: React.FC = () => {
  // Mode selection: chat | freeform | structured | tools | imagen | get_code
  const [activeMode, setActiveMode] = useState<
    'chat' | 'freeform' | 'structured' | 'tools' | 'imagen' | 'get_code'
  >('chat');

  // Studio Models
  const [models, setModels] = useState<StudioModel[]>([
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      tag: 'Khuyên Dùng • Siêu Nhanh & Đa Phương Thức',
      contextWindow: '1,048,576 tokens',
      outputLimit: '8,192 tokens',
      recommendedFor: 'Chat thời gian thực, lập trình nhanh, xử lý ngữ cảnh lớn',
      tier: 'standard',
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      tag: 'Tư Duy Sâu • STEM & Complex Code',
      contextWindow: '2,097,152 tokens',
      outputLimit: '8,192 tokens',
      recommendedFor: 'Lập trình phức tạp, giải toán đa bước, phân tích đa tài liệu',
      tier: 'pro',
    },
    {
      id: 'gemini-3.7-flash',
      name: 'Gemini 3.7 Flash',
      tag: 'Thế Hệ Mới • Hybrid Speed & Reasoning',
      contextWindow: '1,048,576 tokens',
      outputLimit: '8,192 tokens',
      recommendedFor: 'Tự động cân bằng giữa tốc độ và suy luận chuỗi tư duy',
      tier: 'flagship',
    },
    {
      id: 'gemini-2.0-flash-thinking-exp',
      name: 'Gemini 2.0 Flash Thinking Exp',
      tag: 'Suy Luận Từng Bước • Visible CoT',
      contextWindow: '1,048,576 tokens',
      outputLimit: '8,192 tokens',
      recommendedFor: 'Xem toàn bộ quá trình suy nghĩ logic trước khi đưa ra câu trả lời',
      tier: 'experimental',
    },
    {
      id: 'imagen-3.0-generate-002',
      name: 'Imagen 3 (Fast Photorealism)',
      tag: 'Tạo Ảnh Nghệ Thuật 4K • Text-to-Image',
      contextWindow: 'Prompt input',
      outputLimit: '1024x1024 / 1536x1536',
      recommendedFor: 'Tạo hình ảnh chân thực chuẩn studio nhiếp ảnh & minh họa',
      tier: 'image',
    },
  ]);

  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');

  // Hyperparameters
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [topK, setTopK] = useState<number>(40);
  const [maxOutputTokens, setMaxOutputTokens] = useState<number>(4096);
  const [systemInstruction, setSystemInstruction] = useState<string>('');
  const [isSystemInstructionOpen, setIsSystemInstructionOpen] = useState<boolean>(true);

  // Tools & Grounding
  const [enableGoogleSearch, setEnableGoogleSearch] = useState<boolean>(false);
  const [enableCodeExecution, setEnableCodeExecution] = useState<boolean>(false);
  const [stopSequences, setStopSequences] = useState<string[]>([]);
  const [stopInput, setStopInput] = useState<string>('');

  // Structured Output State
  const [jsonSchemaText, setJsonSchemaText] = useState<string>(
    JSON.stringify(
      {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Tiêu đề phân tích' },
          summary: { type: 'string', description: 'Tóm tắt nội dung chính' },
          keyTakeaways: {
            type: 'array',
            items: { type: 'string' },
            description: 'Các điểm mấu chốt',
          },
          confidenceScore: { type: 'number', description: 'Độ tin cậy từ 0-100' },
        },
        required: ['title', 'summary', 'keyTakeaways'],
      },
      null,
      2
    )
  );

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatTurn[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      content:
        '✨ Xin chào! Chào mừng bạn đến với **Google AI Studio Workspace** trực tiếp trên AI CODE.\n\nTại đây bạn có thể thử nghiệm đầy đủ các mô hình thế hệ mới nhất của Google (**Gemini 2.5 Flash / Pro, Gemini 3.7 Flash, Thinking Exp, Imagen 3**), tinh chỉnh siêu tham số (*Temperature, Top-P, Top-K, Token Limit*), bật **Google Search Grounding** tìm kiếm thời gian thực, thực thi code Python, hoặc xuất mã nguồn SDK chuẩn sang Python/TypeScript chỉ với 1 cú click!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Freeform Prompt State
  const [freeformPrompt, setFreeformPrompt] = useState<string>(
    'Hãy viết một đoạn giới thiệu ngắn gọn, súc tích về tiềm năng của Gemini 2.5 và Google AI Studio trong quy trình phát triển phần mềm hiện đại.'
  );
  const [freeformResponse, setFreeformResponse] = useState<string>('');

  // Imagen State
  const [imagenPrompt, setImagenPrompt] = useState<string>(
    'A futuristic high-tech AI programming laboratory overlooking a cyberpunk cityscape at golden hour, volumetric neon lighting, cinematic 8k ultra-detailed rendering'
  );
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Status & Telemetry
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastTelemetry, setLastTelemetry] = useState<{
    latencyMs: number;
    promptTokens: number;
    candidateTokens: number;
    totalTokens: number;
    modelUsed: string;
    isSelfHealed?: boolean;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [codeExportLang, setCodeExportLang] = useState<
    'python' | 'typescript' | 'ollama' | 'crewai' | 'langgraph' | 'curl' | 'json'
  >('python');
  const [attachedImage, setAttachedImage] = useState<{ base64: string; mimeType: string; name: string } | null>(
    null
  );

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAttachedImage({
        base64,
        mimeType: file.type || 'image/png',
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  // Run Generation
  const handleExecute = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let promptPayload = '';
      let messagesPayload: any[] = [];
      let respMime = 'text/plain';
      let parsedSchema: any = null;

      if (activeMode === 'chat') {
        if (!chatInput.trim() && !attachedImage) {
          setIsLoading(false);
          return;
        }

        const newMsg: ChatTurn = {
          id: `msg_user_${Date.now()}`,
          role: 'user',
          content: chatInput,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          mediaUrl: attachedImage?.base64,
        };

        const updatedMessages = [...chatMessages, newMsg];
        setChatMessages(updatedMessages);
        setChatInput('');
        setAttachedImage(null);

        messagesPayload = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
      } else if (activeMode === 'freeform' || activeMode === 'tools') {
        promptPayload = freeformPrompt;
      } else if (activeMode === 'structured') {
        promptPayload = freeformPrompt;
        respMime = 'application/json';
        try {
          parsedSchema = JSON.parse(jsonSchemaText);
        } catch {
          parsedSchema = null;
        }
      } else if (activeMode === 'imagen') {
        promptPayload = imagenPrompt;
      }

      const res = await fetch('/api/google-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptPayload,
          messages: messagesPayload,
          mode: activeMode === 'imagen' ? 'imagen' : activeMode,
          model: activeMode === 'imagen' ? 'imagen-3.0-generate-002' : selectedModel,
          systemInstruction,
          temperature,
          topP,
          topK,
          maxOutputTokens,
          stopSequences,
          responseMimeType: respMime,
          responseSchema: parsedSchema,
          enableGoogleSearch,
          enableCodeExecution,
          multimodalMedia: attachedImage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLastTelemetry({
          latencyMs: data.latencyMs || 420,
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          candidateTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
          modelUsed: data.modelUsed || selectedModel,
          isSelfHealed: data.isSelfHealed,
        });

        if (activeMode === 'chat') {
          const assistantTurn: ChatTurn = {
            id: `msg_model_${Date.now()}`,
            role: 'model',
            content: data.text || '',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            groundingMetadata: data.groundingMetadata,
            latencyMs: data.latencyMs,
            tokens: data.usageMetadata?.candidatesTokenCount,
          };
          setChatMessages((prev) => [...prev, assistantTurn]);
        } else if (activeMode === 'freeform' || activeMode === 'structured' || activeMode === 'tools') {
          setFreeformResponse(data.text || '');
        } else if (activeMode === 'imagen') {
          if (data.imageUrl) {
            setGeneratedImageUrl(data.imageUrl);
          }
        }
      } else {
        const errorText = data.error || 'Có lỗi khi gửi yêu cầu đến Gemini API';
        if (activeMode === 'chat') {
          setChatMessages((prev) => [
            ...prev,
            {
              id: `msg_err_${Date.now()}`,
              role: 'model',
              content: `⚠️ **Lỗi:** ${errorText}`,
              timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        } else {
          setFreeformResponse(`⚠️ Lỗi: ${errorText}`);
        }
      }
    } catch (err: any) {
      console.error('Google AI Studio execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Code Snippets for SDK
  const generateSdkCode = () => {
    const promptText =
      activeMode === 'chat'
        ? chatMessages[chatMessages.length - 1]?.content || 'Hello Gemini'
        : freeformPrompt;

    if (codeExportLang === 'python') {
      return `# Google AI Studio - Official Python SDK (google-genai v2.17+)
import os
from google import genai
from google.genai import types

# 1. Khởi tạo Client với API Key
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# 2. Cấu hình Siêu Tham Số (Hyperparameters)
config = types.GenerateContentConfig(
    system_instruction="""${systemInstruction || 'Bạn là trợ lý AI thông minh từ Google AI Studio.'}""",
    temperature=${temperature},
    top_p=${topP},
    top_k=${topK},
    max_output_tokens=${maxOutputTokens},
    ${enableGoogleSearch ? 'tools=[{"google_search": {}}],' : ''}
    ${enableCodeExecution ? 'tools=[{"code_execution": {}}],' : ''}
)

# 3. Thực thi gọi mô hình ${selectedModel}
response = client.models.generate_content(
    model="${selectedModel}",
    contents="""${promptText}""",
    config=config,
)

print("Phản hồi từ Gemini:")
print(response.text)
`;
    } else if (codeExportLang === 'typescript') {
      return `// Google AI Studio - Official TypeScript / Node.js SDK (@google/genai)
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: '${selectedModel}',
    contents: '${promptText.replace(/\n/g, '\\n').replace(/'/g, "\\'")}',
    config: {
      ${systemInstruction ? `systemInstruction: '${systemInstruction.replace(/'/g, "\\'")}',` : ''}
      temperature: ${temperature},
      topP: ${topP},
      topK: ${topK},
      maxOutputTokens: ${maxOutputTokens},
      ${enableGoogleSearch ? 'tools: [{ googleSearch: {} }],' : ''}
      ${enableCodeExecution ? 'tools: [{ codeExecution: {} }],' : ''}
    },
  });

  console.log('Phản hồi từ Gemini:');
  console.log(response.text);
}

main().catch(console.error);
`;
    } else if (codeExportLang === 'ollama') {
      return `# ==========================================
# Ollama Modelfile for Hermes Sovereign Agent
# Chạy với lệnh: ollama create hermes-agent -f Modelfile && ollama run hermes-agent
# ==========================================

FROM nous-hermes2:latest

# 1. Thiết lập System Prompt (Thought-Action-Observation)
SYSTEM """
${systemInstruction || `Bạn là Hermes, một trợ lý AI thông minh, tư duy logic và có khả năng giải quyết vấn đề phức tạp.
- Nhiệm vụ: Phân tích yêu cầu, chia nhỏ thành các bước (Chain of Thought), thực thi công cụ nếu cần và đưa ra kết quả chính xác.
- Quy tắc:
  1. Luôn suy nghĩ trước khi hành động (sử dụng tag <thought>).
  2. Nếu không biết thông tin, hãy sử dụng công cụ tìm kiếm hoặc yêu cầu làm rõ.
  3. Trả lời ngắn gọn, trực diện, định dạng Markdown rõ ràng.
  4. Ưu tiên sử dụng JSON nếu yêu cầu trả về dữ liệu có cấu trúc.`}
"""

# 2. Tham số mô hình tối ưu cho Agent suy luận
PARAMETER temperature ${temperature}
PARAMETER top_p ${topP}
PARAMETER top_k ${topK}
PARAMETER num_predict ${maxOutputTokens}
PARAMETER stop "<|im_end|>"
PARAMETER stop "Observation:"
PARAMETER stop "<|im_start|>"
`;
    } else if (codeExportLang === 'crewai') {
      return `# ==========================================
# CrewAI Agent Configuration (agent.yaml)
# ==========================================
hermes_lead_agent:
  role: >
    Hermes Senior Reasoning & Technical Specialist
  goal: >
    Phân tích bài toán đa bước, suy luận logic chuyên sâu với cơ chế Thought-Action-Observation và đưa ra kết quả hoàn hảo.
  backstory: >
    ${systemInstruction.replace(/\n/g, ' ') || 'Bạn là Hermes, một tác nhân AI có năng lực tính toán và lập trình đỉnh cao, luôn hành động có chủ đích và cung cấp giải pháp tối ưu.'}
  verbose: true
  allow_delegation: false
  memory: true
  llm:
    model: gemini/${selectedModel}
    temperature: ${temperature}
    top_p: ${topP}
    max_tokens: ${maxOutputTokens}
`;
    } else if (codeExportLang === 'langgraph') {
      return `# ==========================================
# LangGraph / LangChain Python Agent Template
# ==========================================
import os
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

# 1. Khởi tạo LLM Hermes / Gemini
llm = ChatGoogleGenerativeAI(
    model="${selectedModel}",
    google_api_key=os.environ.get("GEMINI_API_KEY"),
    temperature=${temperature},
    top_p=${topP},
    max_output_tokens=${maxOutputTokens},
)

# 2. Cấu hình State
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], "Lịch sử hội thoại"]

# 3. System Persona Prompt
SYSTEM_PROMPT = SystemMessage(content="""${systemInstruction || 'Bạn là Hermes, trợ lý AI tư duy chuỗi suy luận Thought-Action-Observation.'}""")

def call_model(state: AgentState):
    messages = [SYSTEM_PROMPT] + list(state["messages"])
    response = llm.invoke(messages)
    return {"messages": [response]}

# 4. Xây dựng Graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

app = workflow.compile()

# 5. Chạy thử nghiệm
if __name__ == "__main__":
    result = app.invoke({"messages": [HumanMessage(content="""${promptText}""")]})
    print("Hermes Output:")
    print(result["messages"][-1].content)
`;
    } else if (codeExportLang === 'curl') {
      return `# Google AI Studio - REST API cURL Command
curl "https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=\${GEMINI_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{
      "parts": [{"text": "${promptText.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"}]
    }],
    "generationConfig": {
      "temperature": ${temperature},
      "topP": ${topP},
      "topK": ${topK},
      "maxOutputTokens": ${maxOutputTokens}
    }
  }'
`;
    } else {
      return JSON.stringify(
        {
          model: selectedModel,
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature,
            topP,
            topK,
            maxOutputTokens,
            systemInstruction: systemInstruction || undefined,
            tools: enableGoogleSearch ? [{ googleSearch: {} }] : undefined,
          },
        },
        null,
        2
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Google AI Studio Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#0f172a] to-[#1e1b4b] border border-cyan-500/30 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-200 tracking-tight">
                  Google AI Studio Workspace
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono border border-cyan-500/40">
                  v2.17 Official SDK
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono border border-emerald-500/40">
                  Live Stream API
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl">
                Môi trường phát triển và thử nghiệm Prompt chuyên nghiệp chuẩn Google AI Studio. Tinh chỉnh mô hình Gemini 2.5 / 3.7 / Imagen 3, thử nghiệm Grounding tìm kiếm Google và xuất mã nguồn SDK chuẩn.
              </p>
            </div>
          </div>

          {/* Quick Actions & Official Link */}
          <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Mở Google AI Studio chính thức"
            >
              <span>aistudio.google.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>

            <button
              onClick={() => setActiveMode('get_code')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lấy Mã SDK</span>
            </button>

            <button
              onClick={() => {
                setChatMessages([
                  {
                    id: `msg_welcome_${Date.now()}`,
                    role: 'model',
                    content: '✨ Đã làm mới Workspace Google AI Studio. Hãy bắt đầu nhập prompt hoặc chọn mô hình bạn muốn thử nghiệm!',
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
                setFreeformResponse('');
                setGeneratedImageUrl(null);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Làm mới Workspace"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Sub-Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar mt-5 pt-4 border-t border-white/10 text-xs">
          {[
            { id: 'chat', label: '💬 Chat Prompt (Đa Lượt)', icon: Sparkles },
            { id: 'freeform', label: '📝 Freeform Prompt', icon: FileCode2 },
            { id: 'structured', label: '🧩 JSON Structured Output', icon: Braces },
            { id: 'tools', label: '🛠️ Google Search & Tools', icon: Globe },
            { id: 'imagen', label: '🎨 Imagen 3 (Tạo Ảnh 4K)', icon: ImageIcon },
            { id: 'get_code', label: '💻 Lấy Code SDK (Get Code)', icon: Code2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeMode === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Left Workspace & Right Parameter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / CENTER WORKSPACE (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Collapsible System Instructions Bar */}
          <div className="p-4 rounded-2xl bg-[#111625] border border-cyan-500/20 shadow-lg">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsSystemInstructionOpen(!isSystemInstructionOpen)}
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">System Instructions (Chỉ Thị Hệ Thống)</span>
                {systemInstruction && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    Đang Kích Hoạt ({systemInstruction.length} ký tự)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {isSystemInstructionOpen ? (
                  <ChevronDown className="w-4 h-4 text-white/40" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/40" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {isSystemInstructionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  <textarea
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    placeholder="Định hình danh tính, phong cách và quy tắc bắt buộc cho mô hình AI (VD: 'Bạn là chuyên gia lập trình TypeScript, luôn giải thích ngắn gọn và có code minh họa')..."
                    className="w-full h-20 p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-hidden focus:border-cyan-400 font-mono resize-none"
                  />

                  {/* Preset Pills */}
                  <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 text-[11px]">
                    <span className="text-white/40 shrink-0">Mẫu gợi ý:</span>
                    {SYSTEM_INSTRUCTION_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSystemInstruction(p.instruction);
                          if (p.temperature !== undefined) setTemperature(p.temperature);
                          if (p.topP !== undefined) setTopP(p.topP);
                          if (p.topK !== undefined) setTopK(p.topK);
                          if (p.stopSequences !== undefined) setStopSequences(p.stopSequences);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/70 hover:text-cyan-300 border border-white/10 shrink-0 transition-all cursor-pointer"
                      >
                        {p.title}
                      </button>
                    ))}
                    {systemInstruction && (
                      <button
                        onClick={() => setSystemInstruction('')}
                        className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 shrink-0 transition-all cursor-pointer"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 1. CHAT PROMPT MODE */}
          {activeMode === 'chat' && (
            <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/10 shadow-xl flex flex-col h-[620px]">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${
                      msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                          : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-black font-bold'
                      }`}
                    >
                      {msg.role === 'user' ? 'U' : <Sparkles className="w-4 h-4 text-black" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600/30 border border-indigo-500/40 text-white rounded-tr-xs'
                          : 'bg-[#181f33] border border-cyan-500/20 text-stone-100 rounded-tl-xs'
                      }`}
                    >
                      {/* Attached Media if any */}
                      {msg.mediaUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-white/10 max-h-48 max-w-sm">
                          <img src={msg.mediaUrl} alt="Attached" className="object-cover w-full h-full" />
                        </div>
                      )}

                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {/* Grounding Search Citations */}
                      {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-cyan-500/20 space-y-1.5">
                          <div className="flex items-center space-x-1.5 text-[11px] text-cyan-300 font-semibold">
                            <Globe className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Nguồn thông tin Google Search Grounding:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.groundingMetadata.groundingChunks.slice(0, 4).map((chunk, cIdx) => (
                              <a
                                key={cIdx}
                                href={chunk.web?.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 text-[10px] truncate max-w-xs transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                <span className="truncate">{chunk.web?.title || chunk.web?.uri}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Turn Metadata */}
                      <div className="mt-2 flex items-center justify-between text-[10px] text-white/40 font-mono pt-1">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center space-x-2">
                          {msg.latencyMs && <span>⚡ {msg.latencyMs}ms</span>}
                          {msg.tokens && <span>🔤 {msg.tokens} tokens</span>}
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="hover:text-white transition-colors p-0.5"
                            title="Sao chép"
                          >
                            {copiedKey === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center space-x-3 text-xs text-cyan-400 animate-pulse p-2">
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    </div>
                    <span>Gemini đang suy nghĩ và tính toán token phản hồi...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input & Media Bar */}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                {attachedImage && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                    <span className="truncate">📎 Đã đính kèm ảnh: {attachedImage.name}</span>
                    <button onClick={() => setAttachedImage(null)} className="text-white/60 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-cyan-300 border border-white/10 transition-all cursor-pointer shrink-0"
                    title="Đính kèm ảnh / Media"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleExecute();
                      }
                    }}
                    placeholder="Nhập prompt gửi đến Gemini (VD: 'Viết thuật toán A* bằng TypeScript', 'Tóm tắt bài báo này')..."
                    className="flex-1 px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-hidden focus:border-cyan-400"
                  />

                  <button
                    onClick={handleExecute}
                    disabled={isLoading || (!chatInput.trim() && !attachedImage)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs transition-all cursor-pointer disabled:opacity-40 flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 shrink-0"
                  >
                    <span>Gửi</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. FREEFORM PROMPT MODE */}
          {activeMode === 'freeform' && (
            <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span>Freeform Prompt Input (Soạn Thảo Tự Do)</span>
                </span>
                <button
                  onClick={handleExecute}
                  disabled={isLoading || !freeformPrompt.trim()}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isLoading ? 'Đang Chạy...' : 'Chạy Prompt (Run)'}</span>
                </button>
              </div>

              <textarea
                value={freeformPrompt}
                onChange={(e) => setFreeformPrompt(e.target.value)}
                placeholder="Nhập toàn bộ ngữ cảnh, bài toán, tài liệu hoặc đoạn code lớn cần phân tích..."
                className="w-full h-44 p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-cyan-400 font-mono"
              />

              {/* Freeform Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">Kết Quả Phản Hồi (Output):</span>
                  {freeformResponse && (
                    <button
                      onClick={() => copyToClipboard(freeformResponse, 'freeform_out')}
                      className="text-xs text-white/60 hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'freeform_out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Sao chép</span>
                    </button>
                  )}
                </div>
                <div className="w-full min-h-[200px] max-h-[360px] p-4 bg-[#0a0d18] border border-cyan-500/20 rounded-xl text-xs sm:text-sm text-stone-100 overflow-y-auto whitespace-pre-wrap font-sans custom-scrollbar">
                  {freeformResponse || <span className="text-white/30">Bấm nút "Chạy Prompt" để nhận phản hồi từ mô hình {selectedModel}...</span>}
                </div>
              </div>
            </div>
          )}

          {/* 3. STRUCTURED OUTPUT MODE */}
          {activeMode === 'structured' && (
            <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Braces className="w-4 h-4 text-purple-400" />
                  <span>JSON Schema &amp; Structured Output</span>
                </span>
                <button
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Trích Xuất JSON</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/60 mb-1 block">Prompt Đầu Vào:</label>
                  <textarea
                    value={freeformPrompt}
                    onChange={(e) => setFreeformPrompt(e.target.value)}
                    className="w-full h-44 p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-hidden focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-purple-300 mb-1 block">Định Nghĩa JSON Schema (Schema Definition):</label>
                  <textarea
                    value={jsonSchemaText}
                    onChange={(e) => setJsonSchemaText(e.target.value)}
                    className="w-full h-44 p-3 bg-black/60 border border-purple-500/30 rounded-xl text-xs text-purple-200 font-mono focus:outline-hidden focus:border-purple-400"
                  />
                </div>
              </div>

              {/* JSON Output Viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">JSON Output Được Đảm Bảo 100% Cú Pháp:</span>
                  {freeformResponse && (
                    <button
                      onClick={() => copyToClipboard(freeformResponse, 'json_out')}
                      className="text-xs text-white/60 hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'json_out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Sao chép JSON</span>
                    </button>
                  )}
                </div>
                <pre className="p-4 bg-black/90 border border-purple-500/30 rounded-xl text-xs text-emerald-400 font-mono overflow-x-auto max-h-72">
                  {freeformResponse || '// Kết quả JSON sẽ xuất hiện tại đây...'}
                </pre>
              </div>
            </div>
          )}

          {/* 4. GOOGLE SEARCH GROUNDING & TOOLS */}
          {activeMode === 'tools' && (
            <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Google Search Grounding &amp; Python Code Execution</span>
                </div>
                <button
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Chạy Kèm Công Cụ</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableGoogleSearch}
                      onChange={(e) => setEnableGoogleSearch(e.target.checked)}
                      className="rounded text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className="font-semibold text-cyan-200">🔍 Bật Google Search Grounding</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableCodeExecution}
                      onChange={(e) => setEnableCodeExecution(e.target.checked)}
                      className="rounded text-indigo-500 focus:ring-indigo-400"
                    />
                    <span className="font-semibold text-indigo-200">🐍 Bật Python Sandbox Execution</span>
                  </label>
                </div>

                <span className="text-[11px] text-white/50">Tìm kiếm web thực tế &amp; tính toán số liệu chính xác</span>
              </div>

              <textarea
                value={freeformPrompt}
                onChange={(e) => setFreeformPrompt(e.target.value)}
                placeholder="Nhập câu hỏi yêu cầu dữ liệu mới nhất (VD: 'Giá vàng thế giới hôm nay', 'Bản cập nhật mới nhất của React 19 có tính năng gì?')..."
                className="w-full h-32 p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-cyan-400"
              />

              <div className="w-full min-h-[180px] p-4 bg-[#0a0d18] border border-cyan-500/20 rounded-xl text-xs sm:text-sm text-stone-100 whitespace-pre-wrap">
                {freeformResponse || 'Kết quả có trích dẫn Google Search sẽ xuất hiện tại đây sau khi chạy...'}
              </div>
            </div>
          )}

          {/* 5. IMAGEN 3 ART STUDIO */}
          {activeMode === 'imagen' && (
            <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Imagen 3 Studio (Tạo Ảnh Chuẩn Studio 4K)</span>
                </span>
                <button
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600 text-black font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 shadow-lg shadow-orange-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Đang Kết Xuất Ảnh...' : 'Tạo Ảnh Imagen 3'}</span>
                </button>
              </div>

              <textarea
                value={imagenPrompt}
                onChange={(e) => setImagenPrompt(e.target.value)}
                placeholder="Mô tả chi tiết hình ảnh bạn muốn tạo (chủ thể, ánh sáng, góc máy, phong cách nhiếp ảnh 8k)..."
                className="w-full h-24 p-3.5 bg-black/60 border border-orange-500/30 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-orange-400"
              />

              {/* Image Preview Canvas */}
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center min-h-[320px]">
                {generatedImageUrl ? (
                  <div className="relative group w-full h-full flex flex-col items-center">
                    <img
                      src={generatedImageUrl}
                      alt="Generated Artwork"
                      className="max-h-[480px] w-auto object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-3 flex items-center space-x-3">
                      <a
                        href={generatedImageUrl}
                        download="Imagen3_Artwork.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Ảnh Về Máy</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 space-y-2">
                    <ImageIcon className="w-10 h-10 text-white/20 mx-auto" />
                    <p className="text-xs text-white/40">Nhập prompt và bấm "Tạo Ảnh Imagen 3" để kết xuất đồ họa</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. GET CODE / SDK EXPORTER */}
          {activeMode === 'get_code' && (
            <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Xuất Code SDK Tương Thích Google AI Studio</span>
                </span>

                <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono overflow-x-auto no-scrollbar">
                  {(['python', 'typescript', 'ollama', 'crewai', 'langgraph', 'curl', 'json'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeExportLang(lang)}
                      className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer whitespace-nowrap ${
                        codeExportLang === lang ? 'bg-cyan-500 text-black font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {lang === 'ollama' ? '🦙 Ollama Modelfile' : lang === 'crewai' ? '👥 CrewAI' : lang === 'langgraph' ? '🕸️ LangGraph' : lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => copyToClipboard(generateSdkCode(), 'sdk_code')}
                  className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer z-10 transition-colors"
                >
                  {copiedKey === 'sdk_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã Sao Chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <pre className="p-4 pt-12 bg-black/90 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed custom-scrollbar">
                  {generateSdkCode()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: PARAMETER TUNING & MODEL SPECS (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Model Selector Card */}
          <div className="p-4 rounded-2xl bg-[#111625] border border-cyan-500/20 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mô Hình (Model Selection)</h3>
            </div>

            <div className="space-y-2">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedModel === m.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-black/40 border-white/5 text-white/70 hover:bg-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-200">{m.name}</span>
                    {selectedModel === m.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">{m.tag}</p>
                  <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-white/40 border-t border-white/5 pt-1.5">
                    <span>Context: {m.contextWindow}</span>
                    <span>Max Out: {m.outputLimit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hyperparameters Controls */}
          <div className="p-4 rounded-2xl bg-[#111625] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Siêu Tham Số (Parameters)</span>
              </h3>
              <button
                onClick={() => {
                  setTemperature(0.7);
                  setTopP(0.95);
                  setTopK(40);
                  setMaxOutputTokens(4096);
                  setStopSequences([]);
                }}
                className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Mặc định
              </button>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Temperature (Độ Sáng Tạo)</span>
                <span className="font-mono font-bold text-cyan-300">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono">
                <span>0.0 (Chính xác / Code)</span>
                <span>2.0 (Sáng tạo cao)</span>
              </div>
            </div>

            {/* Top P Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Top P (Nucleus Sampling)</span>
                <span className="font-mono font-bold text-indigo-300">{topP.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            {/* Top K Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Top K</span>
                <span className="font-mono font-bold text-purple-300">{topK}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Max Output Tokens Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Max Output Tokens</span>
                <span className="font-mono font-bold text-emerald-300">{maxOutputTokens}</span>
              </div>
              <input
                type="range"
                min="64"
                max="8192"
                step="64"
                value={maxOutputTokens}
                onChange={(e) => setMaxOutputTokens(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Stop Sequences Editor */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] text-white/70 block">Stop Sequences (Chuỗi Dừng):</span>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={stopInput}
                  onChange={(e) => setStopInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && stopInput.trim()) {
                      e.preventDefault();
                      setStopSequences([...stopSequences, stopInput.trim()]);
                      setStopInput('');
                    }
                  }}
                  placeholder="Nhập từ dừng và Enter..."
                  className="flex-1 px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (stopInput.trim()) {
                      setStopSequences([...stopSequences, stopInput.trim()]);
                      setStopInput('');
                    }
                  }}
                  className="p-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {stopSequences.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {stopSequences.map((seq, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/80"
                    >
                      <span>{seq}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400"
                        onClick={() => setStopSequences(stopSequences.filter((_, i) => i !== sIdx))}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Telemetry & Metrics Card */}
          {lastTelemetry && (
            <div className="p-4 rounded-2xl bg-[#0b101c] border border-cyan-500/30 shadow-lg space-y-2 text-xs">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Telemetry &amp; Usage</span>
                </span>
                <span className="font-mono text-[10px] text-white/50">{lastTelemetry.modelUsed}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-white/40 block text-[9px]">Độ trễ (Latency):</span>
                  <span className="text-amber-300 font-bold">{lastTelemetry.latencyMs} ms</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-white/40 block text-[9px]">Tổng Tokens:</span>
                  <span className="text-emerald-300 font-bold">{lastTelemetry.totalTokens}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
