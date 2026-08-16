export type SdkLanguage = 'python' | 'typescript';

export type TabType =
  | 'google_studio'
  | 'super_intelligence'
  | 'runway'
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

export interface RagCodeChunk {
  file: string;
  chunkId: string;
  startLine: number;
  endLine: number;
  content: string;
  symbols: string[];
  relevanceScore?: number;
}

export interface RagIndexedFile {
  path: string;
  name: string;
  lines: number;
  sizeBytes: number;
  symbols: string[];
  type: 'component' | 'utility' | 'types' | 'server' | 'config' | 'style';
  lastModified: string;
}

export interface RagQueryResult {
  answer: string;
  thoughtProcess?: string[];
  citedFiles: {
    file: string;
    startLine?: number;
    endLine?: number;
    snippet: string;
    explanation: string;
  }[];
  suggestedAction?: {
    actionType: 'explain' | 'fix' | 'test' | 'refactor';
    targetFile?: string;
    proposedCode?: string;
  };
  retrievedChunksCount: number;
  modelUsed?: string;
  durationMs: number;
}

export interface RagVisionInspectResult {
  detectedIssues: {
    type: 'ui_bug' | 'ux_flaw' | 'style_mismatch' | 'accessibility' | 'responsiveness';
    severity: 'high' | 'medium' | 'low';
    description: string;
    suspectedFile: string;
    suspectedLines: string;
    suggestedFix: string;
    codeFixSnippet?: string;
  }[];
  overallAssessment: string;
  matchedComponents: string[];
  modelUsed?: string;
}

export interface AutonomousAgentTask {
  id: string;
  type: 'create_test' | 'fix_code' | 'refactor' | 'audit';
  targetFile: string;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  resultMessage?: string;
  generatedFilePath?: string;
  codeDiff?: string;
  createdAt: string;
}

export type RunwayModel = 'gen3a_turbo' | 'gen3a' | 'gen2' | 'act_one';
export type RunwayGenerationMode = 'text_to_video' | 'image_to_video' | 'video_to_video' | 'storyboard';
export type RunwayAspectRatio = '16:9' | '9:16' | '1:1' | '21:9';

export interface RunwayCameraVector {
  pan: number; // -10 to 10
  tilt: number; // -10 to 10
  zoom: number; // -10 to 10
  roll: number; // -10 to 10
  orbit: number; // -10 to 10
}

export interface RunwayMotionBrush {
  id: number;
  name: string;
  x: number; // -10 to 10
  y: number; // -10 to 10
  z: number; // -10 to 10
  enabled: boolean;
}

export interface RunwayVideoTask {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  model: RunwayModel;
  mode: RunwayGenerationMode;
  duration: 5 | 10;
  aspectRatio: RunwayAspectRatio;
  fps: 24 | 30 | 60;
  motionScore: number; // 1 to 10
  cameraVector: RunwayCameraVector;
  motionBrushes: RunwayMotionBrush[];
  inputImageUrl?: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  progress: number; // 0 to 100
  videoUrl?: string;
  previewPoster?: string;
  seed: number;
  createdAt: string;
  durationMs?: number;
  directorNotes?: string;
  tags?: string[];
}

export interface RunwayStoryboardShot {
  shotNumber: number;
  shotType: 'wide' | 'medium' | 'close_up' | 'drone' | 'pov' | 'macro';
  description: string;
  cameraMotion: string;
  lighting: string;
  prompt: string;
  durationSec: number;
  status: 'ready' | 'generating' | 'done';
  videoUrl?: string;
  previewUrl?: string;
}

export interface RunwayDirectorPreset {
  id: string;
  name: string;
  description: string;
  category: 'cinematic' | 'drone' | 'anime' | 'cyberpunk' | 'vintage' | 'vfx';
  camera: RunwayCameraVector;
  motionScore: number;
  promptSuffix: string;
  aspectRatio: RunwayAspectRatio;
  sampleThumbnail: string;
}

export interface RunwayDirectorChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cinematicAnalysis?: {
    visualStyle?: string;
    cameraIntent?: string;
    lightingAtmosphere?: string;
    pacingTone?: string;
  };
  suggestedParameters?: {
    prompt: string;
    enhancedPrompt?: string;
    model?: RunwayModel;
    duration?: 5 | 10;
    aspectRatio?: RunwayAspectRatio;
    fps?: 24 | 30 | 60;
    motionScore?: number;
    cameraVector?: RunwayCameraVector;
  };
  createdTaskId?: string;
  videoBoardShots?: RunwayStoryboardShot[];
}



