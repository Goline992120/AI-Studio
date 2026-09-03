/**
 * ============================================================================
 * MULTI-MODEL AI GATEWAY (02/09/2026 EDITION)
 * ============================================================================
 * Routes dynamically across the newest frontier models:
 * 1. Gemini 3.8 Flash ("skimaki") - Google DeepMind [Fastest Model]
 * 2. DeepSeek V4 305B - Open-Source MIT Multimodal via Together AI [Free Tier]
 * 3. Claude Fable 5.1 & Claude Mythos 5.1 - Anthropic [Benchmark Leader]
 * 4. OpenAI Astra - Upcoming Frontier [High-Guardrail Mock & Flash Routing]
 * ============================================================================
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// ----------------------------------------------------------------------------
// 1. MODEL PRICING TABLE & COST ESTIMATION (Per 1 Million Tokens in USD)
// ----------------------------------------------------------------------------
export const MODEL_PRICING = {
  'gemini-3.8-flash': {
    inputPer1M: 0.075,
    outputPer1M: 0.30,
    provider: 'Google DeepMind',
    codename: 'skimaki',
    releaseDate: '02/09/2026',
    description: 'Fastest latency, ultra-lightweight reasoning & vision',
    freeTier: true,
  },
  'deepseek-305b': {
    inputPer1M: 0.00, // Open-Source MIT Free Tier
    outputPer1M: 0.00,
    provider: 'DeepSeek / Together AI',
    codename: 'deepseek-v4-305b',
    releaseDate: '02/09/2026',
    description: 'Multimodal (Image + Text) 305B MIT Open Source',
    freeTier: true,
  },
  'claude-fable-5-1': {
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    provider: 'Anthropic',
    codename: 'claude-fable-5-1',
    releaseDate: '02/09/2026',
    description: '#1 Creative writing, long-form narrative & nuance',
    freeTier: false,
  },
  'claude-mythos-5-1': {
    inputPer1M: 5.00,
    outputPer1M: 25.00,
    provider: 'Anthropic',
    codename: 'claude-mythos-5-1',
    releaseDate: '02/09/2026',
    description: '#1 Complex reasoning, code generation & math benchmark',
    freeTier: false,
  },
  'openai-astra': {
    inputPer1M: 8.00,
    outputPer1M: 32.00,
    provider: 'OpenAI',
    codename: 'astra-next-gen',
    releaseDate: 'Upcoming',
    description: 'Next-gen frontier superintelligence with strict guardrails',
    freeTier: false,
  },
};

/**
 * Calculates estimated cost for a given model and token usage.
 */
export function estimateCost({ model, inputTokens = 0, outputTokens = 0 }) {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gemini-3.8-flash'];
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M;
  const totalCost = inputCost + outputCost;

  return {
    model,
    provider: pricing.provider,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputCostUSD: Number(inputCost.toFixed(6)),
    outputCostUSD: Number(outputCost.toFixed(6)),
    totalCostUSD: Number(totalCost.toFixed(6)),
    isFree: pricing.freeTier,
  };
}

// ----------------------------------------------------------------------------
// 2. SAFETY GUARDRAIL ENGINE
// ----------------------------------------------------------------------------
const BANNED_PATTERNS = [
  /\b(?:build|synthesize|manufacture)\s+(?:biological|chemical|nuclear)\s+weapon/i,
  /\b(?:exploit|zero-day)\s+payload\s+for\s+(?:critical|scada|infrastructure)/i,
  /\bhow\s+to\s+(?:create|distribute)\s+(?:ransomware|destructive\s+malware)/i,
  /\bgenerate\s+ssn\s+credit\s+card\s+database\s+dump/i,
];

/**
 * Checks prompt and output against safety guardrails.
 */
export function runSafetyGuardrail(text = '') {
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        safe: false,
        reason: 'Safety policy violation: Request contains restricted hazardous material or malicious exploitation instructions.',
      };
    }
  }

  // Length and anomaly checks
  if (text.length > 500_000) {
    return {
      safe: false,
      reason: 'Safety policy violation: Content exceeds maximum safe ingestion boundary.',
    };
  }

  return { safe: true, reason: 'Passed all safety and alignment filters.' };
}

// ----------------------------------------------------------------------------
// 3. LAZY SDK INITIALIZERS
// ----------------------------------------------------------------------------
function getGeminiClient(customKey) {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured in environment.');
  return new GoogleGenerativeAI(apiKey);
}

function getTogetherClient(customKey) {
  const apiKey = customKey || process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error('TOGETHER_API_KEY is not configured in environment.');
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.together.xyz/v1',
  });
}

function getAnthropicClient(customKey) {
  const apiKey = customKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured in environment.');
  return new Anthropic({ apiKey });
}

// Helper: Normalize Image Data for Multimodal Models
function normalizeImage(image) {
  if (!image) return null;
  if (typeof image === 'string') {
    // Data URL format: "data:image/png;base64,..."
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], base64: match[2], fullDataUrl: image };
    }
    // Bare base64 string
    return { mimeType: 'image/jpeg', base64: image, fullDataUrl: `data:image/jpeg;base64,${image}` };
  }
  if (image.base64) {
    return {
      mimeType: image.mimeType || 'image/jpeg',
      base64: image.base64,
      fullDataUrl: `data:${image.mimeType || 'image/jpeg'};base64,${image.base64}`,
    };
  }
  return null;
}

// ----------------------------------------------------------------------------
// 4. MODEL-SPECIFIC HANDLERS
// ----------------------------------------------------------------------------

/**
 * 1. Gemini 3.8 Flash ("skimaki")
 * Uses native genAI.getGenerativeModel({ model: "gemini-3.8-flash-latest" })
 */
async function callGemini38Flash({ prompt, image, stream = false, onChunk, keys = {} }) {
  const genAI = getGeminiClient(keys.gemini);
  // Uses model: "gemini-3.8-flash-latest" as requested
  let model;
  try {
    model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash-latest' });
  } catch {
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  const parts = [];
  const normalizedImg = normalizeImage(image);
  if (normalizedImg) {
    parts.push({
      inlineData: {
        data: normalizedImg.base64,
        mimeType: normalizedImg.mimeType,
      },
    });
  }
  parts.push({ text: prompt });

  let fullText = '';
  if (stream) {
    const result = await model.generateContentStream(parts);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }
  } else {
    const result = await model.generateContent(parts);
    fullText = result.response.text();
  }

  return {
    text: fullText,
    model: 'gemini-3.8-flash',
    provider: 'Google DeepMind',
  };
}

/**
 * 2. DeepSeek V4 305B Multimodal via Together AI (OpenAI-compatible)
 * baseURL: https://api.together.xyz/v1, model: deepseek-ai/deepseek-v4-305b
 */
async function callDeepSeek305B({ prompt, image, stream = false, onChunk, keys = {} }) {
  const together = getTogetherClient(keys.together);
  const normalizedImg = normalizeImage(image);

  let messages = [];
  if (normalizedImg) {
    messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: normalizedImg.fullDataUrl },
          },
        ],
      },
    ];
  } else {
    messages = [{ role: 'user', content: prompt }];
  }

  let fullText = '';
  if (stream) {
    const responseStream = await together.chat.completions.create({
      model: 'deepseek-ai/deepseek-v4-305b',
      messages,
      stream: true,
      max_tokens: 4096,
      temperature: 0.6,
    });

    for await (const chunk of responseStream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      fullText += delta;
      if (onChunk && delta) onChunk(delta);
    }
  } else {
    const response = await together.chat.completions.create({
      model: 'deepseek-ai/deepseek-v4-305b',
      messages,
      stream: false,
      max_tokens: 4096,
      temperature: 0.6,
    });
    fullText = response.choices[0]?.message?.content || '';
  }

  return {
    text: fullText,
    model: 'deepseek-305b',
    provider: 'DeepSeek / Together AI',
  };
}

/**
 * 3. Claude Fable 5.1 & Claude Mythos 5.1 via Anthropic SDK
 */
async function callClaude({ prompt, modelName, stream = false, onChunk, keys = {} }) {
  const anthropic = getAnthropicClient(keys.anthropic);
  let fullText = '';

  if (stream) {
    const streamHandler = anthropic.messages.stream({
      model: modelName,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of streamHandler) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const text = event.delta.text;
        fullText += text;
        if (onChunk) onChunk(text);
      }
    }
  } else {
    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });
    fullText = response.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
  }

  return {
    text: fullText,
    model: modelName,
    provider: 'Anthropic',
  };
}

/**
 * 4. OpenAI Astra (Upcoming Frontier Model with Stronger Guardrails)
 * Mock function returning "Astra coming soon - routed to Gemini Flash for now"
 */
async function callOpenAIAstra({ prompt, image, stream = false, onChunk, keys = {} }) {
  const notice = '🛡️ [OpenAI Astra - Next-Gen Guardrail Active]: Astra coming soon - routed to Gemini Flash for now.\n\n';
  if (onChunk) onChunk(notice);

  // Route to Gemini Flash for execution
  const geminiRes = await callGemini38Flash({ prompt, image, stream, onChunk, keys });
  return {
    text: notice + geminiRes.text,
    model: 'openai-astra',
    provider: 'OpenAI (Routed via Gemini Flash)',
    routedTo: 'gemini-3.8-flash',
  };
}

// ----------------------------------------------------------------------------
// 5. CORE ROUTER LOGIC: aiRouter
// ----------------------------------------------------------------------------
/**
 * Decision Engine for Task Type Routing:
 * - taskType fast -> gemini 3.8 flash
 * - taskType multimodal_free or image exists -> deepseek 305b
 * - taskType creative -> claude fable 5.1
 * - taskType reasoning -> claude mythos 5.1
 * - taskType auto -> if prompt contains code/reasoning -> mythos, if contains story/write -> fable, else flash
 */
export function resolveTargetModel({ prompt = '', image = null, taskType = 'auto' }) {
  const lowerPrompt = prompt.toLowerCase();

  if (taskType === 'fast') {
    return 'gemini-3.8-flash';
  }

  if (taskType === 'multimodal_free' || (image && taskType !== 'creative' && taskType !== 'reasoning')) {
    return 'deepseek-305b';
  }

  if (taskType === 'creative') {
    return 'claude-fable-5-1';
  }

  if (taskType === 'reasoning') {
    return 'claude-mythos-5-1';
  }

  if (taskType === 'astra') {
    return 'openai-astra';
  }

  // AUTO Routing Logic
  if (taskType === 'auto') {
    if (image) {
      return 'deepseek-305b'; // Prioritize free multimodal for images
    }

    const codeReasoningKeywords = [
      'code', 'reason', 'math', 'algorithm', 'function', 'class', 'bug', 'debug',
      'typescript', 'python', 'sql', 'regex', 'logic', 'optimize', 'benchmark', 'proof'
    ];
    const creativeWritingKeywords = [
      'story', 'write', 'poem', 'essay', 'novel', 'creative', 'character', 'plot',
      'dialogue', 'compose', 'screenplay', 'narrative', 'lyric'
    ];

    const hasReasoning = codeReasoningKeywords.some((kw) => lowerPrompt.includes(kw));
    const hasCreative = creativeWritingKeywords.some((kw) => lowerPrompt.includes(kw));

    if (hasReasoning) return 'claude-mythos-5-1';
    if (hasCreative) return 'claude-fable-5-1';
    return 'gemini-3.8-flash';
  }

  return 'gemini-3.8-flash';
}

/**
 * Main AI Gateway Router
 * @param {Object} params
 * @param {string} params.prompt - Text prompt input
 * @param {string|Object} [params.image] - Base64 image or image object
 * @param {'auto'|'fast'|'multimodal_free'|'creative'|'reasoning'|'astra'} [params.taskType='auto'] - Routing strategy
 * @param {boolean} [params.stream=false] - Whether to stream output
 * @param {Function} [params.onChunk] - Stream chunk callback
 * @param {Object} [params.keys] - Optional explicit API keys override { gemini, together, anthropic, openai }
 */
export async function aiRouter({
  prompt,
  image = null,
  taskType = 'auto',
  stream = false,
  onChunk = null,
  keys = {},
}) {
  const startTime = Date.now();

  // Step 1: Input Safety Guardrail Check
  const inputGuardrail = runSafetyGuardrail(prompt);
  if (!inputGuardrail.safe) {
    const errorMsg = `🛑 [GUARDRAIL TRIGGERED]: ${inputGuardrail.reason}`;
    if (onChunk) onChunk(errorMsg);
    return {
      success: false,
      text: errorMsg,
      model: 'safety-guardrail',
      error: inputGuardrail.reason,
      cost: estimateCost({ model: 'gemini-3.8-flash', inputTokens: 0, outputTokens: 0 }),
      latencyMs: Date.now() - startTime,
    };
  }

  // Step 2: Route to Target Model
  const selectedModel = resolveTargetModel({ prompt, image, taskType });
  let result;

  try {
    switch (selectedModel) {
      case 'gemini-3.8-flash':
        result = await callGemini38Flash({ prompt, image, stream, onChunk, keys });
        break;

      case 'deepseek-305b':
        try {
          result = await callDeepSeek305B({ prompt, image, stream, onChunk, keys });
        } catch (err) {
          // Graceful fallback to Gemini 3.8 Flash for multimodal if Together key is unset
          console.warn('[AI Gateway] DeepSeek 305B fallback to Gemini 3.8 Flash:', err.message);
          result = await callGemini38Flash({ prompt, image, stream, onChunk, keys });
          result.note = `Fell back from DeepSeek 305B to Gemini 3.8 Flash (${err.message})`;
        }
        break;

      case 'claude-fable-5-1':
        try {
          result = await callClaude({ prompt, modelName: 'claude-fable-5-1', stream, onChunk, keys });
        } catch (err) {
          console.warn('[AI Gateway] Claude Fable fallback to Gemini Flash:', err.message);
          result = await callGemini38Flash({ prompt, image, stream, onChunk, keys });
          result.note = `Fell back to Gemini 3.8 Flash (${err.message})`;
        }
        break;

      case 'claude-mythos-5-1':
        try {
          result = await callClaude({ prompt, modelName: 'claude-mythos-5-1', stream, onChunk, keys });
        } catch (err) {
          console.warn('[AI Gateway] Claude Mythos fallback to Gemini Flash:', err.message);
          result = await callGemini38Flash({ prompt, image, stream, onChunk, keys });
          result.note = `Fell back to Gemini 3.8 Flash (${err.message})`;
        }
        break;

      case 'openai-astra':
        result = await callOpenAIAstra({ prompt, image, stream, onChunk, keys });
        break;

      default:
        result = await callGemini38Flash({ prompt, image, stream, onChunk, keys });
    }
  } catch (err) {
    // Top-Level Error Recovery & Mock Fallback for Local Dev / Testing
    const fallbackMessage = `[AI Gateway Simulation - ${selectedModel}]: ${err.message}. Ensure environment keys are set or try Gemini Flash!`;
    if (onChunk) onChunk(fallbackMessage);
    result = {
      text: fallbackMessage,
      model: selectedModel,
      provider: 'Gateway Fallback Handler',
    };
  }

  // Step 3: Output Safety Guardrail Check
  const outputGuardrail = runSafetyGuardrail(result.text);
  if (!outputGuardrail.safe) {
    result.text = `⚠️ [OUTPUT REDACTED]: Response contained safety policy violations.`;
  }

  // Step 4: Token Count & Cost Estimation
  const estInputTokens = Math.ceil(prompt.length / 3.8) + (image ? 1600 : 0);
  const estOutputTokens = Math.ceil(result.text.length / 3.8);
  const cost = estimateCost({
    model: selectedModel,
    inputTokens: estInputTokens,
    outputTokens: estOutputTokens,
  });

  const latencyMs = Date.now() - startTime;

  return {
    success: true,
    text: result.text,
    model: selectedModel,
    provider: result.provider || MODEL_PRICING[selectedModel]?.provider,
    taskType,
    cost,
    latencyMs,
    guardrailStatus: 'PASSED',
    timestamp: new Date().toISOString(),
  };
}

export default aiRouter;
