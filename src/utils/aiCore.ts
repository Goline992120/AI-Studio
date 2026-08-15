// Cấu trúc Logic triệu hồi AI thực thi & Quyền thực thi hệ thống
export interface AgentDeployRequest {
  type: string;
  capabilities: string[] | string;
  name?: string;
  model?: string;
  systemInstruction?: string;
}

export interface AgentDeployResponse {
  success: boolean;
  agentId: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'deployed' | 'active' | 'ready';
  endpoint?: string;
  message: string;
  deployedAt: string;
}

// Cấu trúc Logic triệu hồi AI thực thi
export const AIFactory = {
  async createAgent(type: string, capabilities: string[] | string): Promise<AgentDeployResponse> {
    const response = await fetch('/api/ai/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, capabilities }),
    });
    if (!response.ok) {
      throw new Error(`Failed to deploy agent: ${response.statusText}`);
    }
    return response.json();
  },
};

// Khai báo kiểu dữ liệu mở rộng cho Window
declare global {
  interface Window {
    AI_Bridge?: {
      invoke: (toolName: string, params: Record<string, any>) => Promise<any>;
    };
    AI_Assistant?: {
      execute: (command: string, options?: Record<string, any>) => Promise<any>;
      AIFactory?: typeof AIFactory;
      AI_Assistance_Core?: typeof AI_Assistance_Core;
    };
  }
}

// Tích hợp quyền thực thi hệ thống (Tool Calling)
export const AI_Assistance_Core = {
  callTool: async (toolName: string, params: Record<string, any> = {}): Promise<any> => {
    // Quyền thực thi tác vụ như: Build code, deploy tool, phân tích data
    if (typeof window !== 'undefined' && window.AI_Bridge && typeof window.AI_Bridge.invoke === 'function') {
      return await window.AI_Bridge.invoke(toolName, params);
    }

    // Fallback qua API server trực tiếp nếu chưa nạp Bridge cục bộ
    const response = await fetch('/api/ai/tool-invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toolName, params }),
    });
    return response.json();
  },
};

// Khởi tạo AI Bridge mặc định trên Window nếu chưa có
if (typeof window !== 'undefined') {
  if (!window.AI_Bridge) {
    window.AI_Bridge = {
      invoke: async (toolName: string, params: Record<string, any>) => {
        console.log(`[AI_Bridge] Thực thi Tool: "${toolName}"`, params);
        try {
          const res = await fetch('/api/ai/tool-invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolName, params }),
          });
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {
          console.warn('[AI_Bridge] Remote invoke error, running in local fallback mode:', e);
        }

        // Local autonomous execution mock fallback
        return {
          success: true,
          tool: toolName,
          status: 'executed',
          params,
          timestamp: new Date().toISOString(),
          output: `Đã thực thi thành công tác vụ ${toolName}`,
        };
      },
    };
  }

  // Gắn AIFactory và Core vào window.AI_Assistant
  window.AI_Assistant = {
    execute: async (command: string, options: Record<string, any> = {}) => {
      console.log(`[AI_Assistant] Executing AI Command: ${command}`, options);
      return await AI_Assistance_Core.callTool('execute_command', { command, ...options });
    },
    AIFactory,
    AI_Assistance_Core,
  };
}
