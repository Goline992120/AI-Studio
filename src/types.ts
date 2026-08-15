export type SdkLanguage = 'python' | 'typescript';

export type TabType =
  | 'super_intelligence'
  | 'codestudio'
  | 'hermes'
  | 'playground'
  | 'pip_stream'
  | 'screen'
  | 'chatbot'
  | 'powershell'
  | 'orchestrator'
  | 'aifeatures'
  | 'app_exporter'
  | 'quickstart'
  | 'migration';

export interface CustomAgentItem {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: 'chatbot' | 'code_tool' | 'multi_agent' | 'vision_expert' | 'automation';
  systemInstruction: string;
  model: string;
  temperature: number;
  roles: { role: string; task: string }[];
  toolsEnabled: string[];
  createdAt: string;
  isBuiltIn?: boolean;
}

export interface WorkspaceFolder {
  id: string;
  name: string;
  path: string;
  description: string;
  filesCount: number;
  type: 'folder' | 'file';
  subFolders?: string[];
}

export interface VpsConfig {
  vpsHost: string;
  vpsPort: number;
  apiToken: string;
  protocol: 'wss' | 'webrtc' | 'https';
  connected: boolean;
  latencyMs?: number;
  cpuUsage?: number;
  ramUsage?: number;
}

export interface ContextMemoryItem {
  id: string;
  type: 'screen_snapshot' | 'voice_transcript' | 'camera_frame' | 'system_log';
  content: string;
  timestamp: string;
  importance: 'high' | 'medium' | 'low';
  metadata?: Record<string, any>;
}

export interface MultimodalStreamState {
  isScreenSharing: boolean;
  isCameraActive: boolean;
  isVoiceActive: boolean;
  isPipActive: boolean;
  fps: number;
  activeModel: string;
}

export type TaskType = 'text' | 'stream' | 'chat' | 'structured' | 'image';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  tokens?: number;
}

export interface GeminiModelInfo {
  id: string;
  name: string;
  category: 'text' | 'image' | 'audio' | 'video';
  recommendedFor: string;
  supportsThinking?: boolean;
  tier?: 'complex' | 'general' | 'fast';
}

export interface PlaygroundConfig {
  task: TaskType;
  model: string;
  prompt: string;
  systemInstruction: string;
  temperature: number;
  topP: number;
  responseMimeType: 'text/plain' | 'application/json';
  thinkingLevel?: 'LOW' | 'HIGH' | 'MINIMAL';
  thinkingBudget?: number;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  jsonSchema?: string;
}

export interface GenerationResult {
  text?: string;
  imageUrl?: string;
  error?: string;
  loading?: boolean;
  isSelfHealed?: boolean;
  modelUsed?: string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  durationMs?: number;
}

export interface HermesSubAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'executing' | 'healing' | 'ready';
  lastAction: string;
  latencyMs: number;
  successRate: number;
  tasksCompleted: number;
}

export interface HermesHealingLog {
  id: string;
  timestamp: string;
  source: string;
  errorType: string;
  rootCause: string;
  actionTaken: string;
  recoveryTimeMs: number;
  status: 'healed' | 'stabilized' | 'intercepted';
  fallbackModel?: string;
}

export interface HermesSystemStatus {
  autonomousMode: boolean;
  sovereignControllerActive: boolean;
  totalErrorsIntercepted: number;
  autoHealedCount: number;
  healingSuccessRate: number;
  averageHealingSpeedMs: number;
  activeAgents: HermesSubAgent[];
  activeCascadeSequence: string[];
}
