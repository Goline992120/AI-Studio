import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  Sparkles,
  Camera,
  Film,
  Layers,
  Wand2,
  Sliders,
  Maximize2,
  Download,
  RefreshCw,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  Code2,
  Copy,
  Check,
  ChevronRight,
  Tv,
  Radio,
  Zap,
  Flame,
  Clapperboard,
  RotateCcw,
  SlidersHorizontal,
  FileVideo,
  Share2,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  LayoutGrid,
  PlayCircle,
  FastForward,
  CheckCheck,
  ListOrdered,
  Trash2,
  X,
  Trash,
} from 'lucide-react';
import {
  RunwayModel,
  RunwayGenerationMode,
  RunwayAspectRatio,
  RunwayCameraVector,
  RunwayMotionBrush,
  RunwayVideoTask,
  RunwayStoryboardShot,
  RunwayDirectorPreset,
  RunwayDirectorChatMessage,
} from '../types';
import { CodeBlock } from './CodeBlock';

export const RunwayAgentTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'chat_director' | 'video_board' | 'video_studio' | 'director_camera' | 'storyboard_planner' | 'act_one' | 'sdk_code'
  >('chat_director');

  // Conversational AI Director Chat State
  const [directorMessages, setDirectorMessages] = useState<RunwayDirectorChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Xin chào! Tôi là Tác tử Đạo Diễn Điện Ảnh Runway AI. Bạn hãy chia sẻ tự nhiên ý tưởng, cốt truyện, phong cách nghệ thuật hoặc cảm xúc video bằng tiếng Việt/Anh. Tôi sẽ tự động phân tích ngôn ngữ điện ảnh, tính toán camera 3D vector, ánh sáng và xuất bảng video hoàn hảo đúng ý bạn!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cinematicAnalysis: {
        visualStyle: 'Hollywood Cinematic Masterpiece',
        cameraIntent: 'Dynamic 3D Space Vectoring (FPV / Orbit / Dolly)',
        lightingAtmosphere: 'Volumetric Ray-Tracing & Chiaroscuro 8K',
        pacingTone: 'Immersive & Engaging Storytelling',
      },
    },
  ]);
  const [directorInputText, setDirectorInputText] = useState<string>('');
  const [isDirectorThinking, setIsDirectorThinking] = useState<boolean>(false);
  const [isDirectorRecording, setIsDirectorRecording] = useState<boolean>(false);
  const [autoExecuteOnChat, setAutoExecuteOnChat] = useState<boolean>(true);
  const [videoBoardShots, setVideoBoardShots] = useState<RunwayStoryboardShot[]>([
    {
      shotNumber: 1,
      shotType: 'drone',
      description: 'Góc máy FPV drone lướt nhanh qua đỉnh các tòa nhà chọc trời neon Tokyo 2099',
      cameraMotion: 'Dynamic FPV Dive & Orbit Roll',
      lighting: 'Neon Twilight Chiaroscuro & Anamorphic Lens Flare',
      prompt: 'Cinematic FPV drone accelerating through towering neon skyscrapers in Neo-Tokyo, volumetric twilight fog, 8K',
      durationSec: 5,
      status: 'done',
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    },
    {
      shotNumber: 2,
      shotType: 'close_up',
      description: 'Cận cảnh chuyển động của bánh răng cơ học cổ điển và ánh sáng khúc xạ qua nước',
      cameraMotion: 'Slow 85mm Macro Tracking',
      lighting: 'Submerged Bioluminescent Amber Rim Light',
      prompt: 'Macro shot of antique pocket watch gears underwater with air bubbles rising, 85mm f/1.2 lens',
      durationSec: 5,
      status: 'done',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    },
    {
      shotNumber: 3,
      shotType: 'wide',
      description: 'Toàn cảnh vũ trụ bao la với cực quang xanh lục và trạm không gian quay chậm',
      cameraMotion: 'Slow Orbital Pan across Nebula',
      lighting: 'Cosmic Stellar Glow & Ray-traced Starlight',
      prompt: 'Epic wide shot of orbiting orbital ring around distant blue planet, cosmic dust and vibrant nebula',
      durationSec: 5,
      status: 'done',
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
  ]);
  const [isPlayingBoardSequence, setIsPlayingBoardSequence] = useState<boolean>(false);
  const [boardSeqIndex, setBoardSeqIndex] = useState<number>(0);
  const [boardFilter, setBoardFilter] = useState<'all' | 'cyberpunk' | 'drone' | 'macro' | 'cinematic'>('all');

  // Generation State
  const [prompt, setPrompt] = useState<string>(
    'FPV cinematic drone shot soaring through a futuristic cyberpunk metropolis at twilight, neon reflections on wet glass skyscrapers, anamorphic 35mm lens flare.'
  );
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [model, setModel] = useState<RunwayModel>('gen3a_turbo');
  const [mode, setMode] = useState<RunwayGenerationMode>('text_to_video');
  const [duration, setDuration] = useState<5 | 10>(5);
  const [aspectRatio, setAspectRatio] = useState<RunwayAspectRatio>('16:9');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [motionScore, setMotionScore] = useState<number>(7);
  const [seed, setSeed] = useState<number>(4829104);

  // Camera 3D Vectors
  const [cameraVector, setCameraVector] = useState<RunwayCameraVector>({
    pan: 3,
    tilt: -4,
    zoom: 6,
    roll: 2,
    orbit: 4,
  });

  // Motion Brushes
  const [motionBrushes, setMotionBrushes] = useState<RunwayMotionBrush[]>([
    { id: 1, name: 'Lớp Tiền Cảnh (Foreground)', x: 4, y: 0, z: 2, enabled: true },
    { id: 2, name: 'Lớp Hậu Cảnh (Sky/Fog)', x: 0, y: -3, z: 0, enabled: true },
    { id: 3, name: 'Vật Thể Động (Dynamic Particles)', x: 2, y: 3, z: 1, enabled: false },
  ]);

  // Image to Video Input
  const [inputImageBase64, setInputImageBase64] = useState<string | null>(null);

  // Task & Gallery State
  const [tasks, setTasks] = useState<RunwayVideoTask[]>([]);
  const [activeVideoTask, setActiveVideoTask] = useState<RunwayVideoTask | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [presets, setPresets] = useState<RunwayDirectorPreset[]>([]);

  // Storyboard State
  const [storyboardTheme, setStoryboardTheme] = useState<string>(
    'Hành trình khám phá trạm không gian bỏ hoang giữa dải ngân hà đầy bí ẩn'
  );
  const [storyboardShots, setStoryboardShots] = useState<RunwayStoryboardShot[]>([]);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState<boolean>(false);

  // Act-One State
  const [actOneCharDesc, setActOneCharDesc] = useState<string>(
    'Cyberpunk android with expressive human facial emotion and micro-movements'
  );
  const [actOnePreset, setActOnePreset] = useState<string>('realistic');
  const [isActOneRunning, setIsActOneRunning] = useState<boolean>(false);

  // Video Player Controls
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const directorRecognitionRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSavingIPhone, setIsSavingIPhone] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Conversational AI Director Message Dispatcher
  const handleSendDirectorMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || directorInputText;
    if (!textToSend.trim() || isDirectorThinking) return;

    const userMsg: RunwayDirectorChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...directorMessages, userMsg];
    setDirectorMessages(updatedMessages);
    setDirectorInputText('');
    setIsDirectorThinking(true);

    try {
      const res = await fetch('/api/runway/chat-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentPrompt: textToSend,
          currentParameters: {
            model,
            mode,
            duration,
            aspectRatio,
            fps,
            motionScore,
            cameraVector,
            seed,
          },
          autoExecute: autoExecuteOnChat,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: RunwayDirectorChatMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: data.directorReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          cinematicAnalysis: data.cinematicAnalysis,
          suggestedParameters: data.suggestedParameters,
          createdTaskId: data.createdTask?.id,
          videoBoardShots: data.storyboardShots,
        };

        setDirectorMessages((prev) => [...prev, assistantMsg]);

        // Synchronize studio parameters
        if (data.suggestedParameters) {
          const sp = data.suggestedParameters;
          if (sp.prompt) setPrompt(sp.prompt);
          if (sp.enhancedPrompt) setEnhancedPrompt(sp.enhancedPrompt);
          if (sp.model) setModel(sp.model);
          if (sp.duration) setDuration(sp.duration);
          if (sp.aspectRatio) setAspectRatio(sp.aspectRatio);
          if (sp.fps) setFps(sp.fps);
          if (sp.motionScore) setMotionScore(sp.motionScore);
          if (sp.cameraVector) setCameraVector(sp.cameraVector);
        }

        if (data.createdTask) {
          setTasks((prev) => [data.createdTask, ...prev.filter((t) => t.id !== data.createdTask.id)]);
          setActiveVideoTask(data.createdTask);
          setSaveNotice(`🎬 Đạo Diễn AI đã cấu hình & tạo video theo ý bạn: ${data.createdTask.id}!`);
          setTimeout(() => setSaveNotice(null), 6000);
        }

        if (data.storyboardShots && data.storyboardShots.length > 0) {
          setVideoBoardShots(data.storyboardShots);
        }
      }
    } catch (err) {
      console.error('Director chat error:', err);
    } finally {
      setIsDirectorThinking(false);
    }
  };

  // Delete a single Runway video task
  const handleDeleteTask = async (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/runway/tasks/${taskId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (activeVideoTask?.id === taskId) {
          const remaining = tasks.filter((t) => t.id !== taskId);
          setActiveVideoTask(remaining.length > 0 ? remaining[0] : null);
        }
        setSaveNotice(`🗑️ Đã xóa tác vụ ${taskId.slice(0, 12)}...`);
        setTimeout(() => setSaveNotice(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Clear all Runway video tasks
  const handleClearAllTasks = async () => {
    if (tasks.length === 0) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách video đã tạo không?')) return;
    try {
      const res = await fetch('/api/runway/tasks', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTasks([]);
        setActiveVideoTask(null);
        setSaveNotice('🗑️ Đã xóa sạch toàn bộ danh sách video!');
        setTimeout(() => setSaveNotice(null), 3500);
      }
    } catch (err) {
      console.error('Failed to clear all tasks:', err);
    }
  };

  // Clear Chat History
  const handleClearChatHistory = () => {
    setDirectorMessages([
      {
        id: 'msg_welcome',
        role: 'assistant',
        content:
          'Xin chào! Tôi là Tác tử Đạo Diễn Điện Ảnh Runway AI. Bạn hãy chia sẻ tự nhiên ý tưởng, cốt truyện, phong cách nghệ thuật hoặc cảm xúc video bằng tiếng Việt/Anh. Tôi sẽ tự động phân tích ngôn ngữ điện ảnh, tính toán camera 3D vector, ánh sáng và xuất bảng video hoàn hảo đúng ý bạn!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        cinematicAnalysis: {
          visualStyle: 'Hollywood Cinematic Masterpiece',
          cameraIntent: 'Dynamic 3D Space Vectoring (FPV / Orbit / Dolly)',
          lightingAtmosphere: 'Volumetric Ray-Tracing & Chiaroscuro 8K',
          pacingTone: 'Immersive & Engaging Storytelling',
        },
      },
    ]);
    setSaveNotice('🧹 Đã dọn sạch lịch sử trò chuyện Đạo Diễn AI.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  // Clear Prompt Helper
  const handleClearPrompt = () => {
    setPrompt('');
    setEnhancedPrompt('');
  };

  // Voice Speech Recognition for AI Director
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSaveNotice('Trình duyệt chưa hỗ trợ Web Speech API. Bạn có thể gõ văn bản trực tiếp!');
      setTimeout(() => setSaveNotice(null), 4000);
      return;
    }

    if (isDirectorRecording && directorRecognitionRef.current) {
      try {
        directorRecognitionRef.current.stop();
      } catch (e) {
        try {
          directorRecognitionRef.current.abort();
        } catch (_) {}
      }
      setIsDirectorRecording(false);
      return;
    }

    if (directorRecognitionRef.current) {
      try {
        directorRecognitionRef.current.abort();
      } catch (_) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsDirectorRecording(true);
        setSaveNotice('🎙️ Đang lắng nghe giọng nói của bạn... Hãy nói yêu cầu làm video!');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setDirectorInputText(transcript);
          setSaveNotice(`🎙️ Đã nhận câu lệnh: "${transcript}"`);
          handleSendDirectorMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsDirectorRecording(false);
        if (event?.error !== 'no-speech' && event?.error !== 'aborted') {
          setSaveNotice('Không thể thu âm giọng nói. Vui lòng kiểm tra quyền microphone.');
          setTimeout(() => setSaveNotice(null), 3000);
        }
      };

      recognition.onend = () => {
        setIsDirectorRecording(false);
      };

      directorRecognitionRef.current = recognition;
      recognition.start();
      setIsDirectorRecording(true);
    } catch (err: any) {
      setIsDirectorRecording(false);
      if (err?.name !== 'InvalidStateError' && !err?.message?.includes('already started')) {
        console.warn('Speech recognition notice:', err);
      }
    }
  };

  // Save Video to iPhone Photos / Web Share / Download handler
  const handleSaveToIPhone = async (task: RunwayVideoTask) => {
    if (!task.videoUrl) return;
    try {
      setIsSavingIPhone(true);
      setSaveNotice('Đang chuẩn bị luồng video tối ưu cho iPhone/iPad...');

      const streamUrl = `/api/runway/stream-video?url=${encodeURIComponent(task.videoUrl)}&filename=Runway_${task.id}.mp4`;

      // Fetch blob
      const response = await fetch(streamUrl);
      const blob = await response.blob();
      const filename = `Runway_${task.id}.mp4`;
      const file = new File([blob], filename, { type: 'video/mp4' });

      // If Web Share API is available with file support (iOS Safari standard)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        setSaveNotice('Đang mở bảng chia sẻ iOS... Hãy chọn "Lưu video" để lưu vào Thư viện Ảnh!');
        await navigator.share({
          files: [file],
          title: 'Runway AI Video',
          text: `Video Runway Gen-3: ${task.prompt}`,
        });
        setSaveNotice('✅ Đã mở bảng lưu video iOS thành công! Chọn "Lưu video" để đưa vào Ảnh (Photos).');
      } else {
        // Fallback for browsers or desktop
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        setSaveNotice('✅ Đang tải file video MP4 về thiết bị của bạn!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Share error fallback:', err);
        // Fallback direct download link
        const directDownloadUrl = `/api/runway/stream-video?url=${encodeURIComponent(task.videoUrl)}&download=true&filename=Runway_${task.id}.mp4`;
        window.open(directDownloadUrl, '_blank');
        setSaveNotice('Đã mở luồng video tải trực tiếp cho iPhone.');
      }
    } finally {
      setIsSavingIPhone(false);
      setTimeout(() => setSaveNotice(null), 6500);
    }
  };

  // Fetch Tasks and Presets
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/runway/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
        if (!activeVideoTask && data.tasks.length > 0) {
          setActiveVideoTask(data.tasks[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch Runway tasks:', e);
    }
  };

  const fetchPresets = async () => {
    try {
      const res = await fetch('/api/runway/presets');
      const data = await res.json();
      if (data.presets) {
        setPresets(data.presets);
      }
    } catch (e) {
      console.warn('Failed to fetch Runway presets:', e);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchPresets();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update active video task if updated in tasks list
  useEffect(() => {
    if (activeVideoTask) {
      const updated = tasks.find((t) => t.id === activeVideoTask.id);
      if (updated) {
        setActiveVideoTask(updated);
      }
    }
  }, [tasks]);

  // AI Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    try {
      setIsEnhancingPrompt(true);
      const res = await fetch('/api/runway/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          duration,
          cameraMotion: `Pan: ${cameraVector.pan}, Zoom: ${cameraVector.zoom}`,
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setEnhancedPrompt(data.enhancedPrompt);
        if (data.cameraVector) setCameraVector(data.cameraVector);
        if (data.motionScore) setMotionScore(data.motionScore);
        if (data.recommendedAspectRatio) setAspectRatio(data.recommendedAspectRatio);
      }
    } catch (e) {
      console.error('Failed to enhance Runway prompt:', e);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Execute Generation
  const handleCreateVideoTask = async () => {
    if (!prompt.trim()) return;
    try {
      setIsGenerating(true);
      const res = await fetch('/api/runway/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          enhancedPrompt: enhancedPrompt || undefined,
          model,
          mode,
          duration,
          aspectRatio,
          fps,
          motionScore,
          cameraVector,
          motionBrushes: motionBrushes.filter((b) => b.enabled),
          inputImageUrl: inputImageBase64 || undefined,
        }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks((prev) => [data.task, ...prev]);
        setActiveVideoTask(data.task);
      }
    } catch (e) {
      console.error('Runway generate error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Storyboard Generation
  const handleGenerateStoryboard = async () => {
    if (!storyboardTheme.trim()) return;
    try {
      setIsGeneratingStoryboard(true);
      const res = await fetch('/api/runway/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptOrTheme: storyboardTheme,
          targetDurationSec: 20,
        }),
      });
      const data = await res.json();
      if (data.shots) {
        setStoryboardShots(data.shots);
      }
    } catch (e) {
      console.error('Failed to generate storyboard:', e);
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  // Act-One Trigger
  const handleRunActOne = async () => {
    try {
      setIsActOneRunning(true);
      const res = await fetch('/api/runway/act-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterDescription: actOneCharDesc,
          stylePreset: actOnePreset,
        }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks((prev) => [data.task, ...prev]);
        setActiveVideoTask(data.task);
      }
    } catch (e) {
      console.error('Failed to execute Act-One:', e);
    } finally {
      setIsActOneRunning(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setInputImageBase64(reader.result as string);
        setMode('image_to_video');
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply Preset
  const handleApplyPreset = (preset: RunwayDirectorPreset) => {
    setPrompt((prev) => prev.split(',')[0] + preset.promptSuffix);
    setCameraVector(preset.camera);
    setMotionScore(preset.motionScore);
    setAspectRatio(preset.aspectRatio);
  };

  // SDK Code Generation snippets
  const generatePythonRunwayCode = () => {
    return `# Runway Gen-3 Alpha Video Generation via Official Python SDK
from runwayml import RunwayML
import time

client = RunwayML()

# Khởi tạo tác vụ sinh video Gen-3 Alpha Turbo
task = client.image_to_video.create(
    model="${model}",
    prompt_text="""${enhancedPrompt || prompt}""",
    duration=${duration},
    ratio="${aspectRatio}",
    watermark=False,
    motion_score=${motionScore},
    camera_vector={
        "pan": ${cameraVector.pan},
        "tilt": ${cameraVector.tilt},
        "zoom": ${cameraVector.zoom},
        "roll": ${cameraVector.roll},
        "orbit": ${cameraVector.orbit}
    },
    seed=${seed}
)

print(f"Khởi tạo Task ID: {task.id}. Đang chờ render video...")

# Vòng lặp thăm dò tiến độ (Polling)
while True:
    task_status = client.tasks.retrieve(task.id)
    print(f"Tiến độ: {task_status.progress}% - Trạng thái: {task_status.status}")
    
    if task_status.status == "SUCCEEDED":
        print(f"Video đã sinh thành công: {task_status.output[0]}")
        break
    elif task_status.status == "FAILED":
        print("Lỗi render video:", task_status.failure)
        break
        
    time.sleep(3)
`;
  };

  const generateTsRunwayCode = () => {
    return `// Runway Gen-3 Alpha Video Generation via Official TypeScript SDK
import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

async function main() {
  const task = await client.imageToVideo.create({
    model: '${model}',
    promptText: \`${enhancedPrompt || prompt}\`,
    duration: ${duration},
    ratio: '${aspectRatio}',
    motionScore: ${motionScore},
    cameraVector: {
      pan: ${cameraVector.pan},
      tilt: ${cameraVector.tilt},
      zoom: ${cameraVector.zoom},
      roll: ${cameraVector.roll},
      orbit: ${cameraVector.orbit},
    },
    seed: ${seed},
  });

  console.log(\`Task khởi tạo: \${task.id}\`);

  // Polling cho tới khi hoàn tất
  const completedTask = await client.tasks.poll(task.id, {
    pollIntervalMs: 3000,
  });

  console.log('Video hoàn tất:', completedTask.output?.[0]);
}

main().catch(console.error);
`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Clapperboard className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300 tracking-tight">
                Runway AI Video Agent & Director Studio (Gen-3 Alpha / Turbo)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                Gen-3 & Act-One
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1.5 max-w-3xl leading-relaxed">
              Tác tử điện ảnh cao cấp tích hợp trực tiếp <strong>Runway Gen-3 Alpha Turbo</strong>, điều khiển vector camera 3D (Pan/Tilt/Zoom/Roll/Orbit), Multi-Motion Brush nhiều lớp, lập kịch bản phân cảnh Storyboard và chuyển giao biểu cảm Act-One.
            </p>
          </div>

          {/* Render Stats */}
          <div className="flex items-center space-x-3 bg-black/50 px-4 py-2 rounded-xl border border-white/10 shrink-0 text-xs">
            <div className="flex items-center space-x-1.5 text-purple-300 font-mono">
              <Film className="w-4 h-4" />
              <span className="font-bold">{tasks.length}</span>
              <span className="text-white/40">Videos</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono">
              <Zap className="w-4 h-4" />
              <span className="font-bold">Turbo GPU</span>
              <span className="text-white/40">Active</span>
            </div>
          </div>
        </div>

        {/* Quick Custom Video Prompt Creator Bar (Bắt Đầu Tạo Video Theo Ý Bạn) */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-purple-950/70 via-stone-900 to-indigo-950/70 border border-purple-500/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-black font-bold shadow-md">
                <Wand2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Tạo Video Theo Ý Muốn Của Bạn</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-400/30 font-normal">
                    Thực Thi Tức Thì
                  </span>
                </h3>
                <p className="text-[11px] text-white/60">
                  Nhập bất kỳ ý tưởng kịch bản nào, AI sẽ phân tích góc máy, ánh sáng và tạo video Runway Gen-3 đúng như bạn muốn.
                </p>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as RunwayAspectRatio)}
                className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-[11px] focus:outline-hidden focus:border-purple-500"
              >
                <option value="16:9">16:9 Ngang (YouTube/TV)</option>
                <option value="9:16">9:16 Dọc (iPhone/TikTok)</option>
                <option value="21:9">21:9 Rạp Phim (Cinema)</option>
                <option value="1:1">1:1 Vuông (Instagram)</option>
              </select>

              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10) as 5 | 10)}
                className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-[11px] focus:outline-hidden focus:border-purple-500"
              >
                <option value={5}>5 Giây (Turbo)</option>
                <option value={10}>10 Giây (Mở rộng)</option>
              </select>
            </div>
          </div>

          {/* Input & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Nhập ý tưởng video bạn muốn (VD: 'Flycam FPV lượn qua thành phố neon trong mưa', 'Cảnh anime hoa anh đào rơi')..."
                className="w-full pl-3.5 pr-16 py-2.5 bg-black/80 border border-purple-500/40 rounded-xl text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                {prompt && (
                  <button
                    type="button"
                    onClick={handleClearPrompt}
                    className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Xóa nội dung prompt"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={startVoiceInput}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isDirectorRecording ? 'bg-red-500 text-white animate-pulse' : 'text-white/40 hover:text-white'
                  }`}
                  title="Nói ý tưởng bằng giọng nói"
                >
                  {isDirectorRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {prompt && (
                <button
                  type="button"
                  onClick={handleClearPrompt}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer flex items-center space-x-1.5"
                  title="Xóa kịch bản"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (activeSubTab === 'chat_director') {
                    handleSendDirectorMessage(prompt);
                  } else {
                    handleCreateVideoTask();
                  }
                }}
                disabled={!prompt.trim() || isGenerating || isDirectorThinking}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/30 shrink-0"
              >
                {isGenerating || isDirectorThinking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Đang Tạo Video Theo Ý Bạn...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>TẠO VIDEO THEO Ý BẠN NGAY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Idea Suggestion Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 text-[10px]">
            <span className="text-white/40 shrink-0 font-medium">Ý tưởng phổ biến:</span>
            {[
              {
                title: '🌃 Tokyo Cyberpunk Mưa Đêm',
                prompt:
                  'FPV drone shot swooping through neon-lit futuristic Tokyo skyscrapers at twilight, volumetric rain, reflections on glass, 8K',
              },
              {
                title: '🌸 Anime Makoto Shinkai',
                prompt:
                  'Makoto Shinkai anime style, vibrant fluffy clouds at golden hour, cherry blossom petals floating gracefully in wind, cinematic 60fps',
              },
              {
                title: '🌌 Trạm Vũ Trụ & Hố Đen',
                prompt:
                  'Epic space exploration orbiting near a glowing accretion disk of a black hole, cosmic dust, deep cinematic lighting',
              },
              {
                title: '🏎️ Siêu Xe Đua Tương Lai',
                prompt:
                  'Low angle tracking shot of a sleek futuristic hypercar drifting through a subterranean tunnel with neon laser grid lines',
              },
              {
                title: '🌿 Thác Nước Rừng Nhiệt Đới',
                prompt:
                  'Slow motion 4K macro drone gliding over a lush emerald jungle waterfall with morning mist and sun rays filtering through canopy',
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(item.prompt);
                  if (activeSubTab === 'chat_director') {
                    handleSendDirectorMessage(item.prompt);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/80 hover:text-purple-300 border border-white/10 shrink-0 cursor-pointer transition-colors"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveSubTab('chat_director')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'chat_director'
                ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 text-white shadow-md shadow-purple-500/30 ring-1 ring-white/20'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>1. Đạo Diễn AI Đối Thoại (Hiểu Ngữ Cảnh)</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-200 border border-cyan-400/40">
              Auto Direct
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('video_board')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'video_board'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>2. Bảng Video & Phân Cảnh (Video Board)</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40">
              {videoBoardShots.length} Cảnh
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('video_studio')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'video_studio'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>3. Studio Sinh Video Gen-3 (Chi Tiết)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('director_camera')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'director_camera'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>4. Vector Camera 3D & Motion Brush</span>
          </button>

          <button
            onClick={() => setActiveSubTab('storyboard_planner')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'storyboard_planner'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5. Lập Kịch Bản Storyboard</span>
          </button>

          <button
            onClick={() => setActiveSubTab('act_one')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'act_one'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/30'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>6. Runway Act-One</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sdk_code')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'sdk_code'
                ? 'bg-gradient-to-r from-stone-600 to-neutral-700 text-white shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>7. SDK Code</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 0: Conversational AI Director (Hiểu ngữ cảnh chat & Tự động xuất bảng video) */}
      {activeSubTab === 'chat_director' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Chat Interface with AI Director (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0f0f0f] rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col h-[680px]">
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-purple-950/40 via-stone-900 to-black border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Clapperboard className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f0f0f] animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-bold text-white">Đạo Diễn Điện Ảnh AI (Runway Gen-3 Engine)</h3>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                        Context Aware
                      </span>
                    </div>
                    <p className="text-[10px] text-white/50">Thấu hiểu ngữ cảnh tự nhiên, tính toán góc máy & tự thực thi theo ý</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleClearChatHistory}
                    className="flex items-center space-x-1 text-[10px] text-white/60 hover:text-red-300 bg-black/50 hover:bg-red-500/20 px-2.5 py-1 rounded-lg border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
                    title="Xóa toàn bộ lịch sử chat đạo diễn"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa Lịch Sử</span>
                  </button>

                  <label className="flex items-center space-x-1.5 text-[10px] text-white/70 bg-black/50 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoExecuteOnChat}
                      onChange={(e) => setAutoExecuteOnChat(e.target.checked)}
                      className="rounded accent-purple-500 w-3 h-3 cursor-pointer"
                    />
                    <span>Tự động Render Video</span>
                  </label>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans">
                {directorMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${
                      msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                      }`}
                    >
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-[#18181b] border border-white/10 text-stone-200 shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-white/40 pb-1 border-b border-white/5">
                        <span className="font-semibold text-white/70">
                          {msg.role === 'user' ? 'Bạn' : 'Đạo Diễn Runway AI'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Cinematic Director Analysis Breakdown */}
                      {msg.cinematicAnalysis && (
                        <div className="bg-black/60 rounded-xl p-3 border border-purple-500/20 space-y-1.5 text-[11px]">
                          <div className="flex items-center space-x-1.5 text-purple-300 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Phân Tích Ngôn Ngữ Điện Ảnh & Khung Hình:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10px]">
                            <div className="p-1.5 rounded-lg bg-white/5">
                              <span className="text-white/40 block">Phong cách:</span>
                              <span className="font-bold text-fuchsia-300">{msg.cinematicAnalysis.visualStyle}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5">
                              <span className="text-white/40 block">Chuyển động Camera 3D:</span>
                              <span className="font-bold text-cyan-300">{msg.cinematicAnalysis.cameraIntent}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5">
                              <span className="text-white/40 block">Bố cục Ánh Sáng:</span>
                              <span className="font-bold text-amber-300">{msg.cinematicAnalysis.lightingAtmosphere}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5">
                              <span className="text-white/40 block">Nhịp Điệu & Cảm Xúc:</span>
                              <span className="font-bold text-emerald-300">{msg.cinematicAnalysis.pacingTone}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Suggested Parameters Pill & Actions */}
                      {msg.suggestedParameters && (
                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30">
                            {msg.suggestedParameters.model?.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                            {msg.suggestedParameters.aspectRatio} • {msg.suggestedParameters.duration}s
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                            Motion: {msg.suggestedParameters.motionScore}/10
                          </span>

                          <button
                            onClick={() => {
                              setActiveSubTab('video_board');
                            }}
                            className="ml-auto text-[10px] px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 flex items-center space-x-1 cursor-pointer"
                          >
                            <LayoutGrid className="w-3 h-3" />
                            <span>Mở Bảng Video</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isDirectorThinking && (
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-xs">
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                    </div>
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white/70 flex items-center space-x-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      <span>Đạo Diễn AI đang phân tích ngữ cảnh, tính toán vector camera và kết xuất video...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center space-x-2 overflow-x-auto no-scrollbar text-[10px]">
                <span className="text-white/40 shrink-0">Gợi ý nhanh:</span>
                <button
                  onClick={() =>
                    handleSendDirectorMessage(
                      'Tạo cảnh flycam FPV bay qua thành phố Cyberpunk Tokyo trong mưa đêm, ánh sáng neon rực rỡ, tỉ lệ 21:9 Cinema'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/80 hover:text-purple-300 border border-white/10 shrink-0 cursor-pointer"
                >
                  🌃 Cyberpunk Tokyo FPV (21:9)
                </button>
                <button
                  onClick={() =>
                    handleSendDirectorMessage(
                      'Làm video theo phong cách anime Makoto Shinkai, mây bồng bềnh và cánh hoa anh đào bay trong gió, 60fps mượt mà'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-300 border border-white/10 shrink-0 cursor-pointer"
                >
                  🌸 Anime Makoto Shinkai (60fps)
                </button>
                <button
                  onClick={() =>
                    handleSendDirectorMessage(
                      'Xuất một bảng video 3 cảnh hoàn chỉnh về hành trình khám phá hố đen vũ trụ kỳ vĩ'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-white/80 hover:text-amber-300 border border-white/10 shrink-0 cursor-pointer"
                >
                  🌌 Bảng Video Khám Phá Vũ Trụ
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-black border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendDirectorMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isDirectorRecording
                        ? 'bg-red-500 text-white border-red-400 animate-pulse'
                        : 'bg-white/5 text-white/70 hover:text-white border-white/10 hover:bg-white/10'
                    }`}
                    title="Nói câu lệnh bằng giọng nói (Microphone)"
                  >
                    {isDirectorRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={directorInputText}
                      onChange={(e) => setDirectorInputText(e.target.value)}
                      placeholder="Nói hoặc nhập ý tưởng làm video (VD: 'Chuyển sang góc lia chậm, thêm ánh sáng hoàng hôn, render ngay')..."
                      className="w-full pl-3.5 pr-8 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-purple-500"
                    />
                    {directorInputText && (
                      <button
                        type="button"
                        onClick={() => setDirectorInputText('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        title="Xóa nội dung nhập"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!directorInputText.trim() || isDirectorThinking}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all cursor-pointer disabled:opacity-40 flex items-center space-x-1.5 shadow-lg shadow-purple-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Thực Thi</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Real-time Director Workspace & Live Board Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Video Output Card */}
            <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Film className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white">Video Đang Phát & Kết Xuất</h3>
                </div>
                {activeVideoTask && (
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {activeVideoTask.id.slice(0, 14)}
                  </span>
                )}
              </div>

              {/* Video Player */}
              <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center">
                {activeVideoTask?.videoUrl ? (
                  <video
                    src={activeVideoTask.videoUrl}
                    controls
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    autoPlay
                    loop
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.retried && activeVideoTask?.videoUrl) {
                        target.dataset.retried = 'true';
                        target.src = `/api/runway/stream-video?url=${encodeURIComponent(activeVideoTask.videoUrl)}`;
                        target.load();
                        target.play().catch(() => {});
                      }
                    }}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2 text-white/40">
                    <Film className="w-10 h-10 mx-auto stroke-1 text-white/20" />
                    <span className="text-xs block">Chưa có video. Hãy chat với Đạo Diễn AI ở bên trái!</span>
                  </div>
                )}
              </div>

              {/* iPhone Save Button */}
              {activeVideoTask?.videoUrl && (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleSaveToIPhone(activeVideoTask)}
                    disabled={isSavingIPhone}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-white transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {isSavingIPhone
                        ? 'Đang mở bảng chia sẻ iOS...'
                        : '📱 Lưu vào iPhone / Thư viện Ảnh (Photos)'}
                    </span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`/api/runway/stream-video?url=${encodeURIComponent(
                        activeVideoTask.videoUrl
                      )}&download=true&filename=Runway_${activeVideoTask.id}.mp4`}
                      download={`Runway_${activeVideoTask.id}.mp4`}
                      className="flex-1 py-2 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-center flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải File MP4</span>
                    </a>

                    <button
                      onClick={() => setActiveSubTab('video_board')}
                      className="flex-1 py-2 rounded-xl text-[11px] font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Xem Bảng Toàn Cảnh</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active Studio Parameters Synced by Director */}
            <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vector Camera & Thông Số Tự Động:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Đồng bộ tức thì</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-white/40 block">Pan / Tilt:</span>
                  <span className="text-cyan-300 font-bold">
                    {cameraVector.pan > 0 ? `+${cameraVector.pan}` : cameraVector.pan} /{' '}
                    {cameraVector.tilt > 0 ? `+${cameraVector.tilt}` : cameraVector.tilt}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-white/40 block">Zoom / Roll:</span>
                  <span className="text-purple-300 font-bold">
                    {cameraVector.zoom > 0 ? `+${cameraVector.zoom}` : cameraVector.zoom} /{' '}
                    {cameraVector.roll > 0 ? `+${cameraVector.roll}` : cameraVector.roll}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-white/40 block">Orbit / Motion:</span>
                  <span className="text-amber-300 font-bold">
                    Orbit: {cameraVector.orbit} • {motionScore}/10
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200">
                <span className="text-[10px] text-purple-400 font-mono block">Prompt Điện Ảnh Tối Ưu:</span>
                <p className="line-clamp-2 mt-0.5">{enhancedPrompt || prompt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: Bảng Video Phân Cảnh & Dòng Thời Gian Đa Kênh (Interactive Video Board) */}
      {activeSubTab === 'video_board' && (
        <div className="space-y-5">
          {/* Video Board Header & Controls */}
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Bảng Video & Dòng Thời Gian Phân Cảnh (Video Board)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  {videoBoardShots.length + tasks.length} Cảnh Phim
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1 max-w-2xl">
                Bảng phân cảnh trực quan xuất đúng theo ý và ngữ cảnh chat. Xem từng cảnh hoặc phát liên hoàn toàn bộ câu chuyện.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  setIsPlayingBoardSequence(true);
                  setBoardSeqIndex(0);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center space-x-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Phát Liên Hoàn Cả Bảng</span>
              </button>

              <button
                onClick={() => {
                  if (activeVideoTask) handleSaveToIPhone(activeVideoTask);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Lưu Tất Cả Vào iPhone</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Bạn có muốn xóa toàn bộ các phân cảnh trong bảng video này không?')) {
                    setVideoBoardShots([]);
                    setSaveNotice('🗑️ Đã xóa toàn bộ phân cảnh trong Bảng Video.');
                    setTimeout(() => setSaveNotice(null), 3000);
                  }
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
                title="Xóa toàn bộ phân cảnh trong bảng video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sequential Showcase Modal */}
          {isPlayingBoardSequence && (
            <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-purple-500/50 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <h4 className="text-xs font-bold text-white">
                    Đang Trình Chiếu Liên Hoàn: Cảnh {boardSeqIndex + 1} / {videoBoardShots.length}
                  </h4>
                </div>
                <button
                  onClick={() => setIsPlayingBoardSequence(false)}
                  className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer"
                >
                  Đóng Trình Chiếu
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 aspect-video max-h-[460px] mx-auto">
                <video
                  src={videoBoardShots[boardSeqIndex]?.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4'}
                  controls
                  playsInline
                  autoPlay
                  onEnded={() => {
                    if (boardSeqIndex < videoBoardShots.length - 1) {
                      setBoardSeqIndex((prev) => prev + 1);
                    } else {
                      setIsPlayingBoardSequence(false);
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-xs text-white/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-300 block">
                    Cảnh {videoBoardShots[boardSeqIndex]?.shotNumber}: {videoBoardShots[boardSeqIndex]?.cameraMotion}
                  </span>
                  <span className="text-[11px] text-white/60">{videoBoardShots[boardSeqIndex]?.description}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBoardSeqIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={boardSeqIndex === 0}
                    className="p-2 rounded bg-white/10 disabled:opacity-30 cursor-pointer text-white"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() =>
                      setBoardSeqIndex((prev) => Math.min(prev + 1, videoBoardShots.length - 1))
                    }
                    disabled={boardSeqIndex === videoBoardShots.length - 1}
                    className="p-2 rounded bg-white/10 disabled:opacity-30 cursor-pointer text-white"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videoBoardShots.map((shot, index) => (
              <div
                key={shot.shotNumber}
                className="bg-[#0f0f0f] rounded-2xl border border-white/10 overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                {/* Video Playable Thumbnail */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-white/10">
                  <video
                    src={shot.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4'}
                    controls
                    playsInline
                    preload="metadata"
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/10">
                    Cảnh #{shot.shotNumber} • {shot.shotType.toUpperCase()}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                    {shot.durationSec}s
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white line-clamp-1">{shot.description}</h4>
                    <div className="space-y-1 text-[11px] text-white/60">
                      <div className="flex items-center space-x-1.5 text-cyan-300">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{shot.cameraMotion}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{shot.lighting}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-white/10 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const simulatedTask: RunwayVideoTask = {
                          id: `shot_${shot.shotNumber}_${Date.now()}`,
                          prompt: shot.prompt,
                          model: 'gen3a_turbo',
                          mode: 'text_to_video',
                          duration: 5,
                          aspectRatio: '16:9',
                          fps: 30,
                          motionScore: 7,
                          cameraVector: { pan: 0, tilt: 0, zoom: 4, roll: 0, orbit: 2 },
                          motionBrushes: [],
                          status: 'succeeded',
                          progress: 100,
                          videoUrl: shot.videoUrl,
                          seed: 4829104,
                          createdAt: new Date().toISOString(),
                        };
                        handleSaveToIPhone(simulatedTask);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Lưu iPhone</span>
                    </button>

                    <a
                      href={`/api/runway/stream-video?url=${encodeURIComponent(
                        shot.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4'
                      )}&download=true&filename=Runway_Shot_${shot.shotNumber}.mp4`}
                      download={`Runway_Shot_${shot.shotNumber}.mp4`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[11px] cursor-pointer"
                      title="Tải File MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: Main Video Studio (Chi tiết) */}
      {activeSubTab === 'video_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Generator Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-white/10 space-y-4">
              
              {/* Model & Mode Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">Mô Hình Runway:</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as RunwayModel)}
                    className="w-full px-3 py-2 bg-black/60 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="gen3a_turbo">Runway Gen-3 Alpha Turbo (1080p Siêu Nhanh)</option>
                    <option value="gen3a">Runway Gen-3 Alpha (Chuẩn Điện Ảnh 4K)</option>
                    <option value="gen2">Runway Gen-2 (Artistic & Surreal)</option>
                    <option value="act_one">Runway Act-One (Expression Engine)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">Chế Độ Sinh:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as RunwayGenerationMode)}
                    className="w-full px-3 py-2 bg-black/60 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="text_to_video">Văn Bản Sang Video (Text to Video)</option>
                    <option value="image_to_video">Ảnh Tĩnh Sang Video (Image to Video)</option>
                    <option value="video_to_video">Biến Đổi Video (Video to Video)</option>
                  </select>
                </div>
              </div>

              {/* Image Upload for Image-to-Video Mode */}
              {mode === 'image_to_video' && (
                <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-3 bg-purple-500/5 flex items-center justify-between gap-3">
                  {inputImageBase64 ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={inputImageBase64}
                        alt="Input frame"
                        className="w-16 h-12 object-cover rounded-lg border border-purple-400/40"
                      />
                      <div>
                        <span className="text-xs font-bold text-purple-300 block">Khung Ảnh Gốc Đã Tải Lên</span>
                        <span className="text-[10px] text-white/40 font-mono">Đang kích hoạt Keyframe Animation</span>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center space-x-2 text-xs text-purple-300 font-semibold cursor-pointer">
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Tải ảnh tĩnh làm khung hình mở đầu (Keyframe)</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                  {inputImageBase64 && (
                    <button
                      onClick={() => setInputImageBase64(null)}
                      className="text-[10px] px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                    >
                      Hủy ảnh
                    </button>
                  )}
                </div>
              )}

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/80">Kịch Bản / Prompt Điện Ảnh:</label>
                  <button
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancingPrompt || !prompt.trim()}
                    className="flex items-center space-x-1.5 text-[11px] font-bold text-purple-300 hover:text-purple-200 bg-purple-500/20 hover:bg-purple-500/30 px-2.5 py-1 rounded-lg border border-purple-500/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className={`w-3 h-3 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                    <span>{isEnhancingPrompt ? 'Đang Tối Ưu Prompt...' : 'AI Director Tối Ưu Prompt'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Mô tả bối cảnh, góc quay, ánh sáng và hành động nhân vật..."
                  className="w-full px-3.5 py-2.5 bg-black/60 rounded-xl border border-white/10 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-purple-500 font-mono leading-relaxed"
                />
              </div>

              {/* Enhanced Prompt Display */}
              {enhancedPrompt && (
                <div className="bg-purple-950/30 rounded-xl p-3 border border-purple-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Prompt Điện Ảnh Sau Khi AI Tối Ưu (Gen-3 Syntax):</span>
                    </span>
                    <button
                      onClick={() => {
                        setPrompt(enhancedPrompt);
                        setEnhancedPrompt('');
                      }}
                      className="text-[10px] text-cyan-300 hover:underline"
                    >
                      Áp dụng vào ô chính
                    </button>
                  </div>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">{enhancedPrompt}</p>
                </div>
              )}

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Thời Lượng:</label>
                  <div className="flex bg-black/60 rounded-xl p-1 border border-white/10 text-xs">
                    <button
                      onClick={() => setDuration(5)}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                        duration === 5 ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      5s
                    </button>
                    <button
                      onClick={() => setDuration(10)}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                        duration === 10 ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      10s
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Tỉ Lệ Khung Hình:</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as RunwayAspectRatio)}
                    className="w-full px-2.5 py-1.5 bg-black/60 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (TikTok/Reels)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="21:9">21:9 (CinemaScope)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Tốc Độ Khung (FPS):</label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value) as 24 | 30 | 60)}
                    className="w-full px-2.5 py-1.5 bg-black/60 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value={24}>24 FPS (Cinematic Film)</option>
                    <option value={30}>30 FPS (Standard Video)</option>
                    <option value={60}>60 FPS (Ultra Smooth)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">
                    Độ Động (Motion: {motionScore}/10):
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={motionScore}
                    onChange={(e) => setMotionScore(Number(e.target.value))}
                    className="w-full accent-purple-500 mt-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick Director Presets */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-white/40 block font-bold uppercase tracking-wider">
                  Bộ Phong Cách Đạo Diễn Điện Ảnh Có Sẵn:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPreset(p)}
                      className="text-left p-2 rounded-xl bg-black/40 hover:bg-purple-950/40 border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 block truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-white/40 block truncate">{p.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCreateVideoTask}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 via-fuchsia-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-xl shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Khởi Tạo Pipeline Runway GPU...</span>
                  </>
                ) : (
                  <>
                    <Clapperboard className="w-4 h-4" />
                    <span>Khởi Chạy Render Video Runway ({model.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Player & Active Render Monitor (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center space-x-1.5 text-purple-300">
                  <Tv className="w-4 h-4" />
                  <span>Màn Hình Giám Sát Render 4K</span>
                </span>
                {activeVideoTask && (
                  <span className="text-[11px] font-mono text-white/50">
                    ID: <strong className="text-cyan-300">{activeVideoTask.id.slice(0, 14)}</strong>
                  </span>
                )}
              </div>

              {/* Video Player Container */}
              <div
                className={`relative rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center aspect-video ${
                  aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[380px] mx-auto' : 'w-full'
                }`}
              >
                {activeVideoTask?.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={activeVideoTask.videoUrl}
                    controls
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    autoPlay
                    loop
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.retried && activeVideoTask?.videoUrl) {
                        target.dataset.retried = 'true';
                        target.src = `/api/runway/stream-video?url=${encodeURIComponent(activeVideoTask.videoUrl)}`;
                        target.load();
                        target.play().catch(() => {});
                      }
                    }}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : activeVideoTask?.status === 'processing' ? (
                  <div className="text-center p-6 space-y-3">
                    <RefreshCw className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">
                        Đang Render Khung Hình AI ({activeVideoTask.progress}%)
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        Runway Gen-3 Neural Rendering Engine
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden mx-auto">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
                        style={{ width: `${activeVideoTask.progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2 text-white/40">
                    <Film className="w-12 h-12 mx-auto stroke-1 text-white/20" />
                    <span className="text-xs block">Chọn hoặc sinh video để xem trước</span>
                  </div>
                )}
              </div>

              {/* Notification Banner */}
              {saveNotice && (
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/40 text-xs text-purple-200 flex items-center space-x-2 animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-cyan-300 shrink-0 animate-pulse" />
                  <span className="leading-snug">{saveNotice}</span>
                </div>
              )}

              {/* Task Details & Download Actions */}
              {activeVideoTask && (
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Trạng thái:</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        activeVideoTask.status === 'succeeded'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-purple-500/20 text-purple-300 animate-pulse'
                      }`}
                    >
                      {activeVideoTask.status} • {activeVideoTask.progress}%
                    </span>
                  </div>

                  <p className="text-[11px] text-white/60 bg-black/40 p-2.5 rounded-lg border border-white/5 line-clamp-2">
                    {activeVideoTask.directorNotes || activeVideoTask.prompt}
                  </p>

                  {activeVideoTask.videoUrl && (
                    <div className="space-y-2">
                      {/* Primary iPhone Save Action */}
                      <button
                        onClick={() => handleSaveToIPhone(activeVideoTask)}
                        disabled={isSavingIPhone}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center space-x-2 text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Smartphone className={`w-4 h-4 text-cyan-200 ${isSavingIPhone ? 'animate-bounce' : ''}`} />
                        <span>
                          {isSavingIPhone
                            ? 'Đang chuẩn bị lưu...'
                            : '📱 Lưu vào iPhone / Thư viện Ảnh (Camera Roll)'}
                        </span>
                      </button>

                      {/* Secondary Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`/api/runway/stream-video?url=${encodeURIComponent(
                            activeVideoTask.videoUrl
                          )}&download=true&filename=Runway_${activeVideoTask.id}.mp4`}
                          download={`Runway_${activeVideoTask.id}.mp4`}
                          className="py-2 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center space-x-1.5 text-[11px] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải File MP4</span>
                        </a>

                        <a
                          href={activeVideoTask.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-xl font-medium flex items-center justify-center space-x-1.5 text-[11px] transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mở Trực Tiếp</span>
                        </a>
                      </div>

                      {/* iPhone Save Hint */}
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-[10px] text-white/50 space-y-1">
                        <div className="flex items-center space-x-1 text-cyan-300 font-semibold">
                          <span>💡 Mẹo xem & lưu trên iPhone:</span>
                        </div>
                        <p className="leading-relaxed">
                          Nhấn <strong>"Lưu vào iPhone"</strong> để mở bảng chia sẻ iOS, sau đó chọn <strong>"Lưu video (Save Video)"</strong> để đưa video vào ứng dụng <strong>Ảnh (Photos)</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Task Gallery List */}
            <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Thư Viện Tác Vụ Video ({tasks.length})</span>
                <button
                  onClick={fetchTasks}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Làm mới"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setActiveVideoTask(task)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeVideoTask?.id === task.id
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-xs'
                        : 'bg-black/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="text-xs font-bold text-white block truncate">{task.prompt}</span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {task.model.toUpperCase()} • {task.duration}s • {task.aspectRatio}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        task.status === 'succeeded'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {task.status === 'succeeded' ? '100%' : `${task.progress}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: Director Mode & Camera 3D Vectors */}
      {activeSubTab === 'director_camera' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3D Camera Controls */}
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Điều Khiển Vector Camera 3D (Runway Director Mode)</span>
            </h3>
            <p className="text-xs text-white/60">
              Thiết lập tọa độ di chuyển camera thực tế trong không gian 3 chiều theo tiêu chuẩn quay phim Hollywood.
            </p>

            <div className="space-y-3.5 pt-2">
              {/* PAN */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white/80">Pan (Quay Ngang Trái - Phải):</span>
                  <span className="text-cyan-400 font-mono font-bold">{cameraVector.pan}</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  value={cameraVector.pan}
                  onChange={(e) => setCameraVector({ ...cameraVector, pan: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* TILT */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white/80">Tilt (Nghiêng Lên - Xuống):</span>
                  <span className="text-cyan-400 font-mono font-bold">{cameraVector.tilt}</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  value={cameraVector.tilt}
                  onChange={(e) => setCameraVector({ ...cameraVector, tilt: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* ZOOM */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white/80">Zoom (Phóng To Tiến - Lùi):</span>
                  <span className="text-cyan-400 font-mono font-bold">{cameraVector.zoom}</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  value={cameraVector.zoom}
                  onChange={(e) => setCameraVector({ ...cameraVector, zoom: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* ROLL */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white/80">Roll (Xoay Góc Nghiêng Nghiêng Trục):</span>
                  <span className="text-cyan-400 font-mono font-bold">{cameraVector.roll}</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  value={cameraVector.roll}
                  onChange={(e) => setCameraVector({ ...cameraVector, roll: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* ORBIT */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white/80">Orbit (Quay Quanh Đối Tượng 360):</span>
                  <span className="text-cyan-400 font-mono font-bold">{cameraVector.orbit}</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  value={cameraVector.orbit}
                  onChange={(e) => setCameraVector({ ...cameraVector, orbit: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCameraVector({ pan: 0, tilt: 0, zoom: 0, roll: 0, orbit: 0 })}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-xl transition-all"
              >
                Đặt lại (Reset Vector)
              </button>
            </div>
          </div>

          {/* Multi-Motion Brush Layers */}
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-purple-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Multi-Motion Brush (Quét Chuyển Động Từng Vùng)</span>
            </h3>
            <p className="text-xs text-white/60">
              Gán hướng và vận tốc chuyển động riêng biệt cho từng lớp đối tượng độc lập trong cảnh quay.
            </p>

            <div className="space-y-3 pt-2">
              {motionBrushes.map((brush) => (
                <div
                  key={brush.id}
                  className={`p-3 rounded-xl border transition-all ${
                    brush.enabled ? 'bg-black/60 border-purple-500/40' : 'bg-black/20 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={brush.enabled}
                        onChange={(e) => {
                          setMotionBrushes(
                            motionBrushes.map((b) =>
                              b.id === brush.id ? { ...b, enabled: e.target.checked } : b
                            )
                          );
                        }}
                        className="rounded text-purple-500 focus:ring-0"
                      />
                      <span className="text-xs font-bold text-white">{brush.name}</span>
                    </label>
                    <span className="text-[10px] font-mono text-purple-300">
                      Vector ({brush.x}, {brush.y}, {brush.z})
                    </span>
                  </div>

                  {brush.enabled && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-white/50 block">Trục X ({brush.x})</span>
                        <input
                          type="range"
                          min={-10}
                          max={10}
                          value={brush.x}
                          onChange={(e) => {
                            setMotionBrushes(
                              motionBrushes.map((b) =>
                                b.id === brush.id ? { ...b, x: Number(e.target.value) } : b
                              )
                            );
                          }}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">Trục Y ({brush.y})</span>
                        <input
                          type="range"
                          min={-10}
                          max={10}
                          value={brush.y}
                          onChange={(e) => {
                            setMotionBrushes(
                              motionBrushes.map((b) =>
                                b.id === brush.id ? { ...b, y: Number(e.target.value) } : b
                              )
                            );
                          }}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">Trục Z ({brush.z})</span>
                        <input
                          type="range"
                          min={-10}
                          max={10}
                          value={brush.z}
                          onChange={(e) => {
                            setMotionBrushes(
                              motionBrushes.map((b) =>
                                b.id === brush.id ? { ...b, z: Number(e.target.value) } : b
                              )
                            );
                          }}
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: Storyboard & Multi-Shot Sequence Planner */}
      {activeSubTab === 'storyboard_planner' && (
        <div className="space-y-5">
          <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-amber-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clapperboard className="w-4 h-4 text-amber-400" />
              <span>Storyboard AI Agent (Lập Kịch Bản Phân Cảnh Liên Hoàn)</span>
            </h3>
            <p className="text-xs text-white/60">
              Nhập ý tưởng hoặc kịch bản tổng thể, AI Director sẽ tự động phân rã thành các phân cảnh quay (Shots) với góc máy, ánh sáng và prompt Runway Gen-3 chuẩn xác để dựng video dài.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={storyboardTheme}
                onChange={(e) => setStoryboardTheme(e.target.value)}
                placeholder="Nhập kịch bản hoặc chủ đề phim..."
                className="flex-1 px-4 py-2.5 bg-black/60 rounded-xl border border-white/10 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-amber-500"
              />
              <button
                onClick={handleGenerateStoryboard}
                disabled={isGeneratingStoryboard || !storyboardTheme.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2 shrink-0"
              >
                {isGeneratingStoryboard ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Phân Rã Kịch Bản...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Tạo Storyboard 4 Cảnh</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Storyboard Shots Grid */}
          {storyboardShots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {storyboardShots.map((shot) => (
                <div
                  key={shot.shotNumber}
                  className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/10 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black text-amber-400 font-mono">
                      CẢNH #{shot.shotNumber} ({shot.shotType.toUpperCase()})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                      {shot.durationSec}s
                    </span>
                  </div>

                  <p className="text-xs text-white/90 font-semibold">{shot.description}</p>

                  <div className="space-y-1 text-[11px] text-white/60 font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <div>🎥 Góc máy: <strong className="text-cyan-300">{shot.cameraMotion}</strong></div>
                    <div>💡 Ánh sáng: <strong className="text-amber-300">{shot.lighting}</strong></div>
                  </div>

                  <p className="text-[10px] text-white/50 font-mono bg-black/60 p-2 rounded-lg line-clamp-3">
                    {shot.prompt}
                  </p>

                  <button
                    onClick={() => {
                      setPrompt(shot.prompt);
                      setDuration(shot.durationSec as 5 | 10);
                      setActiveSubTab('video_studio');
                    }}
                    className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <Play className="w-3 h-3 fill-amber-300" />
                    <span>Nạp Vào Studio Render</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 4: Runway Act-One */}
      {activeSubTab === 'act_one' && (
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-pink-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Runway Act-One (Bắt & Chuyển Giao Biểu Cảm Khuôn Mặt Nhân Vật)</span>
          </h3>
          <p className="text-xs text-white/60">
            Công nghệ Act-One ghi nhận chuyển động micro-expression và khẩu hình miệng từ giọng nói/video diễn viên thật để tái tạo biểu cảm chân thực trên bất kỳ avatar nhân vật ảo nào.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-white/80 block mb-1">Mô Tả Nhân Vật Avatar Mục Tiêu:</label>
              <textarea
                rows={3}
                value={actOneCharDesc}
                onChange={(e) => setActOneCharDesc(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-pink-500 font-mono"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Phong Cách Diễn Xuất:</label>
                <select
                  value={actOnePreset}
                  onChange={(e) => setActOnePreset(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 rounded-xl border border-white/10 text-xs text-white focus:outline-hidden focus:border-pink-500"
                >
                  <option value="realistic">Hyper-Realistic Human (Người Thật Siêu Chi Tiết)</option>
                  <option value="anime">Anime 3D Expressive (Hoạt Hình Nhật Bản)</option>
                  <option value="cyberpunk">Cybernetic Cyborg Avatar (Android Tương Lai)</option>
                </select>
              </div>

              <button
                onClick={handleRunActOne}
                disabled={isActOneRunning}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isActOneRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Bắt Biểu Cảm Act-One...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Kích Hoạt Act-One Tracking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 5: SDK Code Generator */}
      {activeSubTab === 'sdk_code' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
                <span>Python SDK (<code className="font-mono text-amber-300">runwayml</code>)</span>
              </span>
              <span className="text-white/40 font-mono text-[11px]">pip install runwayml</span>
            </div>
            <CodeBlock code={generatePythonRunwayCode()} language="python" title="Python (runwayml)" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>TypeScript SDK (<code className="font-mono text-cyan-300">@runwayml/sdk</code>)</span>
              </span>
              <span className="text-white/40 font-mono text-[11px]">npm install @runwayml/sdk</span>
            </div>
            <CodeBlock code={generateTsRunwayCode()} language="typescript" title="TypeScript (@runwayml/sdk)" />
          </div>
        </div>
      )}
    </div>
  );
};
